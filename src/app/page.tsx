import CtaSection from "@/components/homepage/CtaSection";
import EducationSection from "@/components/homepage/EducationContent";
import FeaturedRoastersSection from "@/components/homepage/FeaturedRoastersSection";
import FeaturesBentoGrid from "@/components/homepage/FeaturesBentoGrid";
import HeroSection from "@/components/homepage/HeroSection";
import NewArrivalsSection from "@/components/homepage/NewArrivalsSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import { HomepageFAQ } from "@/components/faqs/HomePageFAQs";
import { Banner1 } from "@/components/ui/banner1";
import { fetchActiveAnnouncement } from "@/lib/data/fetch-announcement";
import { generateMetadata as generatePageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

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
        <HeroSection />
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
