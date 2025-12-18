import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/header";
import CtaSection from "@/components/homepage/CtaSection";
import EducationSection from "@/components/homepage/EducationContent";
import FeaturedRoastersSection from "@/components/homepage/FeaturedRoastersSection";
import FeaturesBentoGrid from "@/components/homepage/FeaturesBentoGrid";
import HeroSection from "@/components/homepage/HeroSection";
import NewArrivalsSection from "@/components/homepage/NewArrivalsSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import { Banner1 } from "@/components/ui/banner1";
import { fetchActiveAnnouncement } from "@/lib/data/fetch-announcement";

export default async function Home() {
  const announcement = await fetchActiveAnnouncement();

  return (
    <div className="surface-0 flex min-h-screen flex-col">
      <Header />
      {announcement && (
        <Banner1
          defaultVisible
          description={announcement.message}
          linkText={announcement.link ? "Learn more" : undefined}
          linkUrl={announcement.link || undefined}
        />
      )}
      <main className="flex-1">
        <HeroSection />
        <NewArrivalsSection />
        <FeaturesBentoGrid />
        <FeaturedRoastersSection />
        <EducationSection />
        <TestimonialsSection />
        <NewsletterSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
