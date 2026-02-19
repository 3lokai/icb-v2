// src/components/discovery/DiscoveryLandingLayout.tsx
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { FAQSection } from "@/components/common/FAQ";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeGridTeaser } from "./CoffeeGridTeaser";
import { UtilityCard } from "./UtilityCard";
import { RelatedLinks } from "./RelatedLinks";
import type { LandingPageConfig } from "@/lib/discovery/landing-pages";
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateFAQSchema,
} from "@/lib/seo/schema";

type DiscoveryLandingLayoutProps = {
  config: LandingPageConfig;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

/** Short page label for breadcrumb from config (e.g. "AeroPress", "Light Roast", "Under ₹500") */
function getDiscoveryPageLabel(config: LandingPageConfig): string {
  if (config.type === "price_bucket" && config.displayRange) {
    return config.displayRange;
  }
  if (config.type === "brew_method") {
    return config.h1
      .replace("Best Coffees for ", "")
      .replace(" in India", "")
      .trim();
  }
  if (config.type === "roast_level") {
    return config.h1.replace(" Coffee in India", "").trim();
  }
  return config.h1;
}

/**
 * DiscoveryLandingLayout - Server component
 * Renders all sections of a discovery landing page in order
 */
export function DiscoveryLandingLayout({
  config,
}: DiscoveryLandingLayoutProps) {
  const categoryLabel =
    config.type === "brew_method"
      ? "Brew Method"
      : config.type === "roast_level"
        ? "Roast Level"
        : "Price Range";
  const pageLabel = getDiscoveryPageLabel(config);
  const canonical = `${BASE_URL}/${config.slug}`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Coffees", url: `${BASE_URL}/coffees` },
    { name: categoryLabel, url: `${BASE_URL}/coffees` },
    { name: pageLabel, url: canonical },
  ]);

  const collectionPageSchema = generateCollectionPageSchema(
    config.h1,
    config.intro,
    canonical
  );

  const faqSchema =
    config.faqs.length > 0 ? generateFAQSchema(config.faqs) : null;

  const schemas = [
    breadcrumbSchema,
    collectionPageSchema,
    ...(faqSchema ? [faqSchema] : []),
  ];

  // Determine overline text based on page type
  const overline =
    config.type === "brew_method"
      ? "Brew Method"
      : config.type === "roast_level"
        ? "Roast Profile"
        : "Price Range";

  // Create right side badge content if heroBadge is provided
  const rightSideContent = config.heroBadge ? (
    <div className="flex items-center gap-3 text-micro text-white/60 uppercase tracking-widest font-medium">
      <span className="h-1 w-1 rounded-full bg-accent/40" />
      {config.heroBadge}
      <span className="h-1 w-1 rounded-full bg-accent/40" />
    </div>
  ) : undefined;

  // Use default hero background if not provided
  const backgroundImage = "/images/hero-bg.avif";

  return (
    <PageShell maxWidth="7xl">
      <StructuredData schema={schemas} />
      {/* 1. Hero Section - PageHeader breaks out of PageShell via its own ml/mr calc for full bleed */}
      <PageHeader
        title={config.h1}
        description={config.intro}
        overline={overline}
        backgroundImage={backgroundImage}
        rightSideContent={rightSideContent}
      />

      {/* Header Nudge - Subtle guidance under header */}
      {config.headerNudge && (
        <div className="mx-auto max-w-6xl w-full px-4 md:px-0 py-4">
          <p className="text-caption text-muted-foreground italic">
            {config.headerNudge}
          </p>
        </div>
      )}

      {/* 2. Coffee Grid Teaser */}
      <CoffeeGridTeaser
        filters={config.filter}
        sortOrder={config.sortOrder}
        limit={12}
        overline="Featured Selection"
        title={
          config.teaserTitle ||
          `Top *${config.type === "price_bucket" ? "Value" : "Rated"}* Coffees`
        }
        description={
          config.teaserDescription ||
          `A curated selection of the best coffees matching your criteria.`
        }
        seeAllLabel="See All Coffees"
        nudge={config.gridNudge}
      />

      {/* 3. Utility Card (if configured) */}
      {config.utilityCard && (
        <div className="py-12">
          {config.utilityNudge && (
            <div className="mx-auto max-w-6xl w-full px-4 md:px-0 pb-4">
              <p className="text-caption text-muted-foreground italic">
                {config.utilityNudge}
              </p>
            </div>
          )}
          <UtilityCard config={config.utilityCard} />
        </div>
      )}

      {/* 4. FAQ Section */}
      {config.faqs.length > 0 && (
        <FAQSection
          items={config.faqs}
          includeStructuredData={false}
          overline={config.faqOverline || "Common Questions"}
          title={
            config.faqTitle?.includes("*") ? (
              <>
                {config.faqTitle.split("*")[0]}
                <span className="text-accent italic">
                  {config.faqTitle.split("*")[1]}
                </span>
                {config.faqTitle.split("*")[2]}
              </>
            ) : (
              config.faqTitle || "Frequently Asked Questions"
            )
          }
          description={
            config.faqDescription ||
            "Quick answers to help you make the best choice."
          }
          badge={config.faqBadge || "Help & Support"}
          contained={false}
        />
      )}

      {/* 5. Related Links */}
      {config.related.length > 0 && (
        <RelatedLinks relatedSlugs={config.related} />
      )}
    </PageShell>
  );
}
