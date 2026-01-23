import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/homepage/HeroSection";
import { Banner1 } from "@/components/ui/banner1";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { fetchActiveAnnouncement } from "@/lib/data/fetch-announcement";
import { generateMetadata as generatePageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

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

const FeaturesBentoGrid = dynamic(
  () => import("@/components/homepage/FeaturesBentoGrid"),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
);

const NewsletterSection = dynamic(
  () => import("@/components/homepage/NewsletterSection"),
  {
    loading: () => (
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    ),
  }
);

const FeaturedRoastersSection = dynamic(
  () => import("@/components/homepage/FeaturedRoastersSection"),
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

const HomeCollectionGrid = dynamic(
  () =>
    import("@/components/homepage/HomeCollectionGrid").then((mod) => ({
      default: mod.HomeCollectionGrid,
    })),
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

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

  return generatePageMetadata({
    title: "Indian Coffee Beans - India's First Specialty Coffee Directory",
    description:
      "Discover premium coffee beans and roasters from India. Explore the rich world of Indian specialty coffee, find your perfect brew, and connect with local roasters.",
    keywords: [
      "indian coffee",
      "specialty coffee india",
      "indian roasters",
      "coffee directory",
      "filter coffee",
      "brew guides",
      "coffee beans india",
    ],
    image: `${baseUrl}/logo-icon.svg`,
    type: "website",
    canonical: baseUrl,
  });
}

export default async function Home() {
  const announcement = await fetchActiveAnnouncement();

  return (
    <div className="surface-0 flex min-h-screen flex-col">
      {announcement && (
        <Banner1
          defaultVisible
          description={announcement.message}
          linkText={announcement.link ? "Learn more" : undefined}
          linkUrl={announcement.link || undefined}
        />
      )}
      <main className="flex-1 bg-muted/30">
        {/* Wrap HeroSection in Suspense for streaming SSR - allows h1 to render earlier */}
        <Suspense
          fallback={
            <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
              <div className="hero-content">
                <h1 className="text-hero text-white text-balance leading-[1.1]">
                  Discover India's{" "}
                  <span className="text-accent italic">Finest Coffee</span>{" "}
                  Beans.
                </h1>
              </div>
            </section>
          }
        >
          <HeroSection />
        </Suspense>
        <HowItWorksSection />
        <HomeCollectionGrid tier="core" />

        <NewArrivalsSection />
        <FeaturesBentoGrid />
        <NewsletterSection />
        <FeaturedRoastersSection />
        <EducationSection />
        <TestimonialsSection />
        <HomepageFAQ />
        <CtaSection />
      </main>
    </div>
  );
}
