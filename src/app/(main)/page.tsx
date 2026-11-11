import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/homepage/hero/HeroSection";
import { TrackedSection } from "@/components/analytics/TrackedSection";
import { HeroSuspenseFallback } from "@/components/homepage/hero/HeroSuspenseFallback";
import NewAdditionsStrip from "@/components/homepage/NewAdditionsStrip";
import NewArrivalsSection from "@/components/homepage/NewArrivalsSection";
import { NewArrivalsSectionSkeleton } from "@/components/homepage/NewArrivalsSectionSkeleton";
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
import { FreshFromCommunitySkeleton } from "@/components/homepage/FreshFromCommunitySkeleton";
import { TopRatedSectionSkeleton } from "@/components/homepage/TopRatedSectionSkeleton";
import { TopProfilesSectionSkeleton } from "@/components/homepage/TopProfilesSectionSkeleton";
import { EducationSectionSkeleton } from "@/components/homepage/EducationSectionSkeleton";
import { CuratorSpotlightSkeleton } from "@/components/homepage/CuratorSpotlightSkeleton";
import { RoasterInfrastructureSectionSkeleton } from "@/components/homepage/RoasterInfrastructureSectionSkeleton";
import { TestimonialsSectionSkeleton } from "@/components/homepage/TestimonialsSectionSkeleton";
import { CtaSectionSkeleton } from "@/components/homepage/CtaSectionSkeleton";
import { HowItWorksSectionSkeleton } from "@/components/homepage/HowItWorksSectionSkeleton";
import { DiscoveryAccordionGridSkeleton } from "@/components/discovery/DiscoveryAccordionGridSkeleton";
import { DISCOVERY_PILL_ROWS } from "@/lib/discovery/discovery-pill-labels";

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

// The promise is handed to HeroSection unawaited so the `heroSegment` read happens
// inside its Suspense boundary — nothing above a boundary may block the first flush.
export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="surface-0 flex min-h-screen flex-col">
      {/* Not <main>: the (main) layout already provides the document's single
          <main> landmark — nesting a second one is invalid HTML and breaks
          main-tag content extraction. */}
      <div className="flex-1 bg-background">
        <div className="relative">
          {/* Contentful fallback: discovery h1 streams immediately so FCP isn't gated on hero data */}
          <Suspense fallback={<HeroSuspenseFallback />}>
            <HeroSection searchParams={searchParams} />
          </Suspense>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="pointer-events-auto">
              <Suspense
                fallback={
                  <div className="sr-only" aria-busy="true">
                    Loading new additions
                  </div>
                }
              >
                <NewAdditionsStrip />
              </Suspense>
            </div>
          </div>
        </div>
        <TrackedSection name="top_rated" position={2}>
          <Suspense fallback={<TopRatedSectionSkeleton />}>
            <TopRatedSectionServer />
          </Suspense>
        </TrackedSection>
        {/* Boundary is required: unwrapped, this section's RPC blocks the document's
            first flush and is the homepage's TTFB floor. The fallback is height-matched
            (an earlier 0-height one expanded into a tall section and shifted everything below). */}
        <TrackedSection name="fresh_from_community" position={3}>
          <Suspense fallback={<FreshFromCommunitySkeleton />}>
            <FreshFromCommunitySection />
          </Suspense>
        </TrackedSection>
        {/* Recency, deliberately not adjacent to the hero's NewAdditionsStrip —
            the strip tickers every recent name above the fold, this is the
            scannable card surface for anyone who scrolls. Warm ground restores
            the alternating band rhythm (Fresh and HomeCollectionGrid are both
            cream, so this sits between them rather than beside another warm). */}
        <TrackedSection name="new_arrivals" position={4}>
          <Suspense fallback={<NewArrivalsSectionSkeleton />}>
            <NewArrivalsSection />
          </Suspense>
        </TrackedSection>
        <TrackedSection name="collection_grid" position={5}>
          <HomeCollectionGridLazy tier="core" />
        </TrackedSection>
        <TrackedSection name="discovery_accordion" position={6}>
          <Section spacing="default" ground="warm" decor={{ texture: "grain" }}>
            <DiscoveryAccordionGrid
              rows={DISCOVERY_PILL_ROWS}
              description="Jump straight to top-rated coffees by roast, brew method, process, origin, and more."
            />
          </Section>
        </TrackedSection>
        <TrackedSection name="how_it_works" position={7}>
          <HowItWorksSection />
        </TrackedSection>
        <TrackedSection name="top_profiles" position={8}>
          <Suspense fallback={<TopProfilesSectionSkeleton />}>
            <TopProfilesSectionServer />
          </Suspense>
        </TrackedSection>
        <TrackedSection name="roaster_infrastructure" position={9}>
          <RoasterInfrastructureSection />
        </TrackedSection>
        <TrackedSection name="education" position={10}>
          <Suspense fallback={<EducationSectionSkeleton />}>
            <EducationSectionServer />
          </Suspense>
        </TrackedSection>
        <TrackedSection name="curator_spotlight" position={11}>
          <Suspense fallback={<CuratorSpotlightSkeleton />}>
            <CuratorSpotlightServer />
          </Suspense>
        </TrackedSection>
        <TrackedSection name="testimonials" position={12}>
          <TestimonialsSection />
        </TrackedSection>
        <TrackedSection name="faq" position={13}>
          <HomepageFAQ />
        </TrackedSection>
        <TrackedSection name="cta" position={14}>
          <CtaSection />
        </TrackedSection>
      </div>
    </div>
  );
}
