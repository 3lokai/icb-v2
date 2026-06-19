import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/homepage/hero/HeroSection";
import NewAdditionsStrip from "@/components/homepage/NewAdditionsStrip";
import { HomeCollectionGridLazy } from "@/components/homepage/HomeCollectionGridLazy";
import { Section } from "@/components/primitives/section";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { generateMetadata as generatePageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import TopProfilesSectionServer from "@/components/homepage/sections/TopProfilesSectionServer";
import EducationSectionServer from "@/components/homepage/sections/EducationSectionServer";
import CuratorSpotlightServer from "@/components/homepage/sections/CuratorSpotlightServer";
import TopRatedSectionServer from "@/components/homepage/sections/TopRatedSectionServer";

// Dynamic imports for below-the-fold components to reduce initial bundle size
const RoasterInfrastructureSection = dynamic(
  () => import("@/components/homepage/RoasterInfrastructureSection"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/homepage/TestimonialsSection"),
  {
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

const HomepageFAQ = dynamic(
  () =>
    import("@/components/faqs/HomePageFAQs").then((mod) => ({
      default: mod.HomepageFAQ,
    })),
  {
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

const CtaSection = dynamic(() => import("@/components/homepage/CtaSection"), {
  loading: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <LoadingSpinner size="sm" />
    </div>
  ),
});

const HowItWorksSection = dynamic(
  () => import("@/components/homepage/HowItWorksSection"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

const DiscoveryAccordionGrid = dynamic(
  () =>
    import("@/components/discovery/DiscoveryAccordionGrid").then((mod) => ({
      default: mod.DiscoveryAccordionGrid,
    })),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
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
          {/* Wrap HeroSection in Suspense for streaming SSR - allows h1 to render earlier */}
          <Suspense
            fallback={
              // Matches HeroSkeleton visually so there's no flash between SSR → client states.
              // Can't use HeroSkeleton directly here (it imports HeroVideoBackground, a client component).
              <section className="relative flex min-h-[90dvh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-4 md:px-6 lg:px-8">
                <div className="absolute inset-0 z-0 bg-black/70" />
                <div className="relative z-10 mx-auto w-full max-w-7xl">
                  <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-6 lg:gap-y-8 xl:gap-x-8">
                    <div className="order-1 flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
                      <div className="h-8 w-56 max-w-full animate-pulse rounded-full bg-white/10" />
                      <div className="space-y-3">
                        <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-white/10" />
                        <div className="h-6 w-full max-w-lg animate-pulse rounded-lg bg-white/5" />
                      </div>
                    </div>
                    <div className="order-3 min-h-[200px] min-w-0 rounded-2xl border border-white/10 bg-white/5 lg:order-0 lg:col-start-2 lg:row-span-2 lg:row-start-1" />
                    <div className="order-2 flex min-w-0 flex-wrap gap-3 lg:col-start-1 lg:row-start-2">
                      <div className="h-11 w-44 animate-pulse rounded-lg bg-white/15" />
                      <div className="h-11 w-40 animate-pulse rounded-lg bg-white/10" />
                    </div>
                    <div className="order-4 flex flex-wrap gap-6 border-t border-white/10 pt-6 lg:col-span-2 lg:row-start-3">
                      <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              </section>
            }
          >
            <HeroSection devSegmentParam={devSegmentParam} />
          </Suspense>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <div className="pointer-events-auto">
              <Suspense
                fallback={<div className="h-10 w-full bg-foreground/5" />}
              >
                <NewAdditionsStrip />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
        >
          <TopRatedSectionServer />
        </Suspense>
        <HomeCollectionGridLazy tier="core" />
        <Section spacing="default" ground="warm" decor={{ texture: "grain" }}>
          <DiscoveryAccordionGrid description="Jump straight to top-rated coffees by roast, brew method, process, origin, and more." />
        </Section>
        <HowItWorksSection />
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
        >
          <TopProfilesSectionServer />
        </Suspense>
        <RoasterInfrastructureSection />
        <Suspense
          fallback={
            <div className="flex min-h-[300px] items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
        >
          <EducationSectionServer />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
        >
          <CuratorSpotlightServer />
        </Suspense>
        <TestimonialsSection />
        <HomepageFAQ />
        <CtaSection />
      </main>
    </div>
  );
}
