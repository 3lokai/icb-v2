import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/homepage/hero/HeroSection";
import { HeroSuspenseFallback } from "@/components/homepage/hero/HeroSuspenseFallback";
import NewAdditionsStrip from "@/components/homepage/NewAdditionsStrip";
import { HomeCollectionGridLazy } from "@/components/homepage/HomeCollectionGridLazy";
import { Section } from "@/components/primitives/section";
import { FAQSectionSkeleton } from "@/components/common/FAQSectionSkeleton";
import { generateMetadata as generatePageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import TopProfilesSectionServer from "@/components/homepage/sections/TopProfilesSectionServer";
import EducationSectionServer from "@/components/homepage/sections/EducationSectionServer";
import CuratorSpotlightServer from "@/components/homepage/sections/CuratorSpotlightServer";
import TopRatedSectionServer from "@/components/homepage/sections/TopRatedSectionServer";
import FreshFromCommunitySection from "@/components/homepage/FreshFromCommunitySection";
import { TopRatedSectionSkeleton } from "@/components/homepage/TopRatedSectionSkeleton";
import { TopProfilesSectionSkeleton } from "@/components/homepage/TopProfilesSectionSkeleton";
import { EducationSectionSkeleton } from "@/components/homepage/EducationSectionSkeleton";
import { CuratorSpotlightSkeleton } from "@/components/homepage/CuratorSpotlightSkeleton";
import { RoasterInfrastructureSectionSkeleton } from "@/components/homepage/RoasterInfrastructureSectionSkeleton";
import { TestimonialsSectionSkeleton } from "@/components/homepage/TestimonialsSectionSkeleton";
import { CtaSectionSkeleton } from "@/components/homepage/CtaSectionSkeleton";
import { HowItWorksSectionSkeleton } from "@/components/homepage/HowItWorksSectionSkeleton";
import { DiscoveryAccordionGridSkeleton } from "@/components/discovery/DiscoveryAccordionGridSkeleton";

// Dynamic imports for below-the-fold components to reduce initial bundle size
const RoasterInfrastructureSection = dynamic(
  () => import("@/components/homepage/RoasterInfrastructureSection"),
  {
    loading: () => <RoasterInfrastructureSectionSkeleton />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/homepage/TestimonialsSection"),
  {
    loading: () => <TestimonialsSectionSkeleton />,
  }
);

const HomepageFAQ = dynamic(
  () =>
    import("@/components/faqs/HomePageFAQs").then((mod) => ({
      default: mod.HomepageFAQ,
    })),
  {
    loading: () => <FAQSectionSkeleton />,
  }
);

const CtaSection = dynamic(() => import("@/components/homepage/CtaSection"), {
  loading: () => <CtaSectionSkeleton />,
});

const HowItWorksSection = dynamic(
  () => import("@/components/homepage/HowItWorksSection"),
  {
    loading: () => <HowItWorksSectionSkeleton />,
  }
);

const DiscoveryAccordionGrid = dynamic(
  () =>
    import("@/components/discovery/DiscoveryAccordionGrid").then((mod) => ({
      default: mod.DiscoveryAccordionGrid,
    })),
  {
    loading: () => <DiscoveryAccordionGridSkeleton />,
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  return generatePageMetadata({
    title: "ICB — Rate Indian Specialty Coffee",
    description:
      "Rate Indian specialty coffees, track your brews, and build a taste profile. Discover beans from Indian roasters with community reviews and recommendations.",
    keywords: [
      "best coffee beans India",
      "Indian coffee roasters",
      "buy coffee online India",
    ],
    image: `${baseUrl}/favicon/android-chrome-512x512.png`,
    type: "website",
    canonical: baseUrl,
  });
}

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const sp = await searchParams;
  const heroSegmentRaw = sp.heroSegment;
  const devSegmentParam =
    typeof heroSegmentRaw === "string"
      ? heroSegmentRaw
      : Array.isArray(heroSegmentRaw)
        ? heroSegmentRaw[0]
        : null;

  return (
    <div className="surface-0 flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
        <div className="relative">
          {/* Contentful fallback: discovery h1 streams immediately so FCP isn't gated on hero data */}
          <Suspense fallback={<HeroSuspenseFallback />}>
            <HeroSection devSegmentParam={devSegmentParam} />
          </Suspense>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="pointer-events-auto">
              <Suspense fallback={null}>
                <NewAdditionsStrip />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense fallback={<TopRatedSectionSkeleton />}>
          <TopRatedSectionServer />
        </Suspense>
        {/* No Suspense: cached RPC that renders a full section or nothing. A boundary
            here streamed 0-height then expanded to a tall section, shifting everything below. */}
        <FreshFromCommunitySection />
        <HomeCollectionGridLazy tier="core" />
        <Section spacing="default" ground="warm" decor={{ texture: "grain" }}>
          <DiscoveryAccordionGrid description="Jump straight to top-rated coffees by roast, brew method, process, origin, and more." />
        </Section>
        <HowItWorksSection />
        <Suspense fallback={<TopProfilesSectionSkeleton />}>
          <TopProfilesSectionServer />
        </Suspense>
        <RoasterInfrastructureSection />
        <Suspense fallback={<EducationSectionSkeleton />}>
          <EducationSectionServer />
        </Suspense>
        <Suspense fallback={<CuratorSpotlightSkeleton />}>
          <CuratorSpotlightServer />
        </Suspense>
        <TestimonialsSection />
        <HomepageFAQ />
        <CtaSection />
      </main>
    </div>
  );
}
