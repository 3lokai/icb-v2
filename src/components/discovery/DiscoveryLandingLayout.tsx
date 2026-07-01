import { Accent } from "@/components/primitives/accent";
// src/components/discovery/DiscoveryLandingLayout.tsx
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { Stack } from "@/components/primitives/stack";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FAQSection } from "@/components/common/FAQ";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeGridTeaser } from "./CoffeeGridTeaser";
import { UtilityCard } from "./UtilityCard";
import { RelatedLinks } from "./RelatedLinks";
import { BrewParamsStrip } from "./BrewParamsStrip";
import { RoastScale } from "./RoastScale";
import { RoastProfileSection } from "./RoastProfileSection";
import { ProcessExplainer } from "./ProcessExplainer";
import { DiscoveryRecipeSection } from "./DiscoveryRecipeSection";
import { FlavourImpact } from "./FlavourImpact";
import { RegionSnapshot } from "./RegionSnapshot";
import { RoastersSourcing } from "./RoastersSourcing";
import { ValueTips } from "./ValueTips";
import { BrewMethodProfileSection } from "./BrewMethodProfileSection";
import { ProcessProfileSection } from "./ProcessProfileSection";
import { PriceBucketProfileSection } from "./PriceBucketProfileSection";
import { RegionOverviewSection } from "./RegionOverviewSection";
import { RegionDetailSection } from "./RegionDetailSection";
import { BeanTypeProfileSection } from "./BeanTypeProfileSection";
import { splitEmphasisPair } from "@/lib/discovery/accent-emphasis";
import {
  discoveryPagePath,
  type LandingPageConfig,
} from "@/lib/discovery/landing-pages";
import {
  coffeeProductListItem,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateFAQSchema,
} from "@/lib/seo/schema";
import { fetchCoffeesCached } from "@/lib/data/fetch-coffees";
import type { CoffeeSummary } from "@/types/coffee-types";

type DiscoveryLandingLayoutProps = {
  config: LandingPageConfig;
};

function renderFaqTitleParts(title: string): ReactNode {
  const parts = splitEmphasisPair(title);
  if (!parts) {
    return title;
  }
  return (
    <>
      {parts.before}
      <Accent>{parts.accent}</Accent>
      {parts.after}
    </>
  );
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

/** Short page label for breadcrumb from config (e.g. "AeroPress", "Light Roast", "Under ₹500") */
function getDiscoveryPageLabel(config: LandingPageConfig): string {
  if (config.type === "price_bucket" && config.displayRange) {
    return config.displayRange;
  }
  return config.entityLabel;
}

function buildDiscoveryCoffeeListItems(
  coffees: CoffeeSummary[],
  baseUrl: string
): Array<Record<string, unknown>> {
  return coffees
    .filter((c) => c.slug && c.roaster_slug && c.name)
    .slice(0, 20)
    .map((c, i) => coffeeProductListItem(c, baseUrl, i + 1));
}

/**
 * DiscoveryLandingLayout - Server component
 * Renders all sections of a discovery landing page in order
 */
export async function DiscoveryLandingLayout({
  config,
}: DiscoveryLandingLayoutProps) {
  const categoryLabel =
    config.type === "brew_method"
      ? "Brew Method"
      : config.type === "roast_level"
        ? "Roast Level"
        : config.type === "price_bucket"
          ? "Price Range"
          : config.type === "process"
            ? "Process"
            : config.type === "region"
              ? "Region"
              : "Bean Type";
  const pageLabel = getDiscoveryPageLabel(config);
  const canonical = `${BASE_URL}${discoveryPagePath(config.slug)}`;
  const crumbs = [
    { name: "Home", url: BASE_URL, href: "/" },
    { name: "Coffees", url: `${BASE_URL}/coffees`, href: "/coffees" },
    { name: categoryLabel, url: `${BASE_URL}/coffees`, href: "/coffees" },
    { name: pageLabel, url: canonical, href: discoveryPagePath(config.slug) },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(
    crumbs.map(({ name, url }) => ({ name, url }))
  );

  // Discovery pages only surface buyable coffees — an out-of-stock coffee has
  // no price to show and can't form valid Product schema. Applied to both the
  // visible grid and the JSON-LD via the shared filter below.
  const discoveryFilter = { ...config.filter, in_stock_only: true };

  const coffeeResult = await fetchCoffeesCached(
    discoveryFilter,
    1,
    20,
    config.sortOrder
  );
  const coffeeItems = buildDiscoveryCoffeeListItems(
    coffeeResult.items,
    BASE_URL
  );

  const collectionPageSchema = generateCollectionPageSchema(
    config.h1,
    config.intro,
    canonical,
    coffeeItems
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
        : config.type === "price_bucket"
          ? "Price Range"
          : config.type === "process"
            ? "Processing Method"
            : config.type === "region"
              ? "Origin Region"
              : "Bean Type";

  // Create right side badge content if heroBadge is provided
  const rightSideContent = config.heroBadge ? (
    <div className="flex items-center gap-3 text-micro text-white/60 uppercase tracking-widest font-medium">
      <span className="h-1 w-1 rounded-full bg-accent/40" />
      {config.heroBadge}
      <span className="h-1 w-1 rounded-full bg-accent/40" />
    </div>
  ) : undefined;

  const backgroundImage = config.heroBackgroundImage ?? "/images/hero-bg.avif";

  const showUtilityCard =
    !!config.utilityCard &&
    (config.utilityCard.type !== "brew_guide" || config.type === "brew_method");

  const processGuideHref =
    config.blogArticleHref ?? config.utilityCard?.href ?? "/learn";

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

      {/* Breadcrumbs - visual nav mirroring the BreadcrumbList schema */}
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <Fragment key={crumb.name}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Nudge - Subtle guidance under header */}
      {config.headerNudge && (
        <div className="mx-auto max-w-6xl w-full px-4 md:px-0 py-6">
          <div className="border-l-2 border-accent/30 pl-4 py-1">
            <p className="text-caption text-muted-foreground/80 italic leading-relaxed">
              {config.headerNudge}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {config.type === "brew_method" && config.brewParams && (
          <BrewParamsStrip brewParams={config.brewParams} />
        )}

        {config.type === "brew_method" && config.brewMethodProfile && (
          <BrewMethodProfileSection
            profile={config.brewMethodProfile}
            slug={config.slug}
          />
        )}

        {config.type === "roast_level" && config.roastProfile && (
          <RoastProfileSection roastProfile={config.roastProfile} />
        )}

        {config.type === "price_bucket" && config.priceBucketProfile && (
          <PriceBucketProfileSection profile={config.priceBucketProfile} />
        )}

        {config.type === "process" && config.processProfile && (
          <ProcessProfileSection
            profile={config.processProfile}
            slug={config.slug}
            guideHref={processGuideHref}
          />
        )}

        {config.type === "process" && !config.processProfile && (
          <ProcessExplainer
            processSlug={config.slug}
            guideHref={processGuideHref}
          />
        )}

        {config.type === "region" && config.regionProfile && (
          <RegionOverviewSection
            profile={config.regionProfile}
            slug={config.slug}
          />
        )}

        {config.type === "region" &&
          !config.regionProfile &&
          config.regionSnapshot && (
            <RegionSnapshot
              regionSlug={config.slug}
              regionSnapshot={config.regionSnapshot}
            />
          )}

        {config.type === "bean_type" && config.beanTypeProfile && (
          <BeanTypeProfileSection
            profile={config.beanTypeProfile}
            slug={config.slug}
          />
        )}

        {/* 2. Coffee Grid Teaser */}
        <CoffeeGridTeaser
          filters={discoveryFilter}
          sortOrder={config.sortOrder}
          limit={12}
          overline={
            config.sortOrder === "best_value"
              ? "Best Value Selection"
              : "Top Rated Selection"
          }
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

        {(config.type === "brew_method" || config.type === "roast_level") && (
          <DiscoveryRecipeSection
            methodKey={config.type === "brew_method" ? config.slug : undefined}
            roastLevel={config.type === "roast_level" ? config.slug : undefined}
          />
        )}

        {config.type === "process" && !config.processProfile && (
          <FlavourImpact processSlug={config.slug} />
        )}

        {config.type === "region" && config.regionProfile && (
          <RegionDetailSection
            profile={config.regionProfile}
            slug={config.slug}
            guideHref={processGuideHref}
          />
        )}

        {config.type === "region" && config.filter.region_slugs?.length ? (
          <div className="py-6 md:py-8">
            <RoastersSourcing
              regionSlugs={config.filter.region_slugs}
              regionLabel={pageLabel}
            />
          </div>
        ) : null}

        {config.type === "price_bucket" && config.valueTips?.length ? (
          <ValueTips tips={config.valueTips} />
        ) : null}

        {/* 3. Utility Card (brew_guide shown on brew method pages only) */}
        {config.utilityCard && showUtilityCard ? (
          <div className="py-10 md:py-14 px-4 md:px-0 mx-auto max-w-6xl w-full">
            <Stack gap="4">
              {config.utilityNudge && (
                <div className="border-l-2 border-accent/20 pl-4 py-1">
                  <p className="text-caption text-muted-foreground/80 italic leading-relaxed">
                    {config.utilityNudge}
                  </p>
                </div>
              )}
              <UtilityCard config={config.utilityCard} />
            </Stack>
          </div>
        ) : null}

        {config.type === "roast_level" && (
          <RoastScale currentRoastSlug={config.slug} />
        )}

        {/* Related reading - contextual in-body links to /learn articles */}
        {config.learnLinks && config.learnLinks.length > 0 && (
          <div className="py-8 md:py-10 px-4 md:px-0 mx-auto max-w-6xl w-full">
            <p className="text-micro text-muted-foreground/60 uppercase tracking-widest font-medium mb-3">
              Related reading
            </p>
            <ul className="flex flex-col gap-2">
              {config.learnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-body text-accent underline-offset-4 hover:underline"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. FAQ Section */}
        {config.faqs.length > 0 && (
          <FAQSection
            items={config.faqs}
            includeStructuredData={false}
            overline={config.faqOverline || "Common Questions"}
            title={renderFaqTitleParts(
              config.faqTitle || "Frequently Asked Questions"
            )}
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
      </div>
    </PageShell>
  );
}
