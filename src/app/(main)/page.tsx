import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/homepage/HeroSection";
import NewAdditionsStrip from "@/components/homepage/NewAdditionsStrip";
import { HomeCollectionGridLazy } from "@/components/homepage/HomeCollectionGridLazy";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { generateMetadata as generatePageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { getAllCurators } from "@/data/curations";
import { fetchCommunityCoffeeReviewCount } from "@/lib/data/fetch-community-coffee-review-count";

// Dynamic imports for below-the-fold components to reduce initial bundle size
const NewArrivalsSection = dynamic(
  () => import("@/components/homepage/NewArrivalsSection"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

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

const EducationSection = dynamic(
  () => import("@/components/homepage/EducationContent"),
  {
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">
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

const CuratorSpotlight = dynamic(
  () => import("@/components/homepage/CuratorSpotlight"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
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

const UserProfileTeaser = dynamic(
  () =>
    import("@/components/homepage/UserProfileTeaser").then((mod) => ({
      default: mod.UserProfileTeaser,
    })),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

const TopRatedSection = dynamic(
  () => import("@/components/homepage/TopRatedSection"),
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
    title: "IndianCoffeeBeans (ICB) — Rate Coffee, Build Your Taste Profile",
    description:
      "Rate Indian specialty coffees, track your brews, and build a taste profile. Discover beans from Indian roasters with community reviews and recommendations.",
    keywords: [
      "indian specialty coffee",
      "coffee ratings",
      "coffee reviews",
      "indian coffee roasters",
      "coffee beans india",
      "taste profile",
      "brew methods",
    ],
    image: `${baseUrl}/favicon/android-chrome-512x512.png`,
    type: "website",
    canonical: baseUrl,
  });
}

export default async function Home() {
  const [curators, communityCoffeeReviewCount] = await Promise.all([
    getAllCurators(),
    fetchCommunityCoffeeReviewCount(),
  ]);

  return (
    <div className="surface-0 flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30">
        <div className="relative">
          {/* Wrap HeroSection in Suspense for streaming SSR - allows h1 to render earlier */}
          <Suspense
            fallback={
              // Matches HeroSkeleton visually so there's no flash between SSR → client states.
              // Can't use HeroSkeleton directly here (it imports HeroVideoBackground, a client component).
              <section className="relative flex min-h-[90dvh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-6 sm:px-12 md:px-24">
                <div className="absolute inset-0 z-0 bg-black/70" />
                <div className="hero-content relative z-10 w-full max-w-2xl text-left">
                  <div className="flex flex-col gap-8">
                    <div className="flex justify-center">
                      <div className="h-8 w-64 max-w-full animate-pulse rounded-full bg-white/10" />
                    </div>
                    <div className="space-y-4">
                      <div className="mx-auto h-12 w-full max-w-lg animate-pulse rounded-lg bg-white/10" />
                      <div className="mx-auto h-6 w-full max-w-md animate-pulse rounded-lg bg-white/5" />
                    </div>
                    <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-wrap justify-center gap-4">
                        <div className="h-11 w-44 animate-pulse rounded-lg bg-white/15" />
                        <div className="h-11 w-40 animate-pulse rounded-lg bg-white/10" />
                      </div>
                      <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                      <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                        <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            }
          >
            <HeroSection />
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
        <HowItWorksSection />
        <UserProfileTeaser />
        <TopRatedSection
          communityCoffeeReviewCount={communityCoffeeReviewCount}
        />
        <HomeCollectionGridLazy tier="core" />
        <NewArrivalsSection />
        <RoasterInfrastructureSection />
        <EducationSection />
        <CuratorSpotlight curator={curators[0] || null} />
        <TestimonialsSection />
        <HomepageFAQ />
        <CtaSection />
      </main>
    </div>
  );
}
