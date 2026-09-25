import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { Stack } from "@/components/primitives/stack";
import { Accent } from "@/components/primitives/accent";
import StructuredData from "@/components/seo/StructuredData";
import { InsightsChartsGridLoader } from "@/components/insights/InsightsChartsGridLoader";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  fetchPublicDirectoryTotals,
  type PublicDirectoryTotals,
} from "@/lib/data/fetch-public-directory-totals";
import {
  EMPTY_INSIGHTS_STATS,
  fetchInsightsStats,
  type InsightsStats,
} from "@/lib/data/fetch-insights-stats";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

const TOTALS_FALLBACK: PublicDirectoryTotals = {
  coffees: 0,
  roasters: 0,
  asOf: null,
};

async function getDirectoryTotals(): Promise<PublicDirectoryTotals> {
  try {
    return await fetchPublicDirectoryTotals();
  } catch (e) {
    console.error("[InsightsPage] fetchPublicDirectoryTotals", e);
    return TOTALS_FALLBACK;
  }
}

async function getInsightsStats(): Promise<InsightsStats> {
  try {
    return await fetchInsightsStats();
  } catch (e) {
    console.error("[InsightsPage] fetchInsightsStats", e);
    return EMPTY_INSIGHTS_STATS;
  }
}

function countLabel(n: number): string {
  return `${n.toLocaleString("en-IN")}+`;
}

// OG/Twitter images come from the sibling opengraph-image.tsx / twitter-image.tsx.
// The helper always sets images (default /api/og card), and explicit images beat
// the file convention, so strip them here.
export async function generateMetadata(): Promise<Metadata> {
  const totals = await getDirectoryTotals();
  const { openGraph, twitter, ...meta } = generateSEOMetadata({
    title: "Indian Coffee by the Numbers",
    description: `Live data from ${countLabel(totals.roasters)} active roasters and ${countLabel(totals.coffees)} specialty SKUs indexed on IndianCoffeeBeans.com. Process breakdowns, origin regions, pricing benchmarks, variety distribution, and roaster geography. Updated weekly.`,
    keywords: [
      "Indian specialty coffee data",
      "coffee market India",
      "specialty coffee statistics",
      "Indian coffee regions",
      "coffee processing methods India",
    ],
    canonical: "/learn/insights",
    type: "website",
  });
  const { images: _ogImages, ...og } = openGraph ?? {};
  const { images: _twImages, ...tw } = twitter ?? {};
  return { ...meta, openGraph: og, twitter: tw };
}

/** Last completed scraper run — when the numbers on this page last changed. */
function lastUpdatedLabel(asOf: string | null): string | null {
  return asOf
    ? new Date(asOf).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
}

function buildInsightsDatasetSchema(totals: PublicDirectoryTotals) {
  const roasterCountLabel = countLabel(totals.roasters);
  const coffeeCountLabel = countLabel(totals.coffees);

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Indian Specialty Coffee Market Data",
    description: `Processing methods, origin regions, pricing benchmarks, variety distribution, and roaster geography for ${coffeeCountLabel} specialty SKUs from ${roasterCountLabel} active Indian roasters.`,
    url: `${baseUrl}/learn/insights`,
    creator: {
      "@type": "Organization",
      name: "IndianCoffeeBeans.com",
      url: baseUrl,
    },
    datePublished: "2024-01-01",
    ...(totals.asOf ? { dateModified: totals.asOf } : {}),
    keywords: [
      "Indian specialty coffee",
      "coffee processing",
      "origin regions",
      "coffee pricing India",
      "specialty roasters India",
    ],
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    spatialCoverage: "India",
    variableMeasured: [
      "processing method",
      "origin region",
      "price",
      "variety",
      "roaster geography",
    ],
  };
}

export default async function InsightsPage() {
  const [totals, stats] = await Promise.all([
    getDirectoryTotals(),
    getInsightsStats(),
  ]);

  const roasterCountLabel = countLabel(totals.roasters);
  const coffeeCountLabel = countLabel(totals.coffees);
  const lastUpdated = lastUpdatedLabel(totals.asOf);

  return (
    <>
      <StructuredData schema={buildInsightsDatasetSchema(totals)} />
      <PageHeader
        title={
          <>
            The State of Indian Specialty Coffee,
            <br />
            <Accent>by the Numbers</Accent>
          </>
        }
        overline="Market Insights"
        description={`Live data from ${roasterCountLabel} active roasters and ${coffeeCountLabel} specialty SKUs indexed on IndianCoffeeBeans.com. Updated weekly.`}
        backgroundImage="/images/hero-learn.avif"
      />

      <PageShell className="py-0">
        <Stack gap="1">
          {/* Metadata strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-4">
            <div className="flex flex-wrap gap-6">
              <Stat label="Active Roasters" value={roasterCountLabel} />
              <Stat label="Specialty SKUs" value={coffeeCountLabel} />
              <Stat
                label="States Covered"
                value={String(stats.states.length)}
              />
              <Stat
                label="Origin Regions"
                value={String(stats.origin_regions)}
              />
            </div>
            {lastUpdated && (
              <p className="text-caption">
                Last updated:{" "}
                <span className="font-medium text-foreground">
                  {lastUpdated}
                </span>
              </p>
            )}
          </div>

          {/* Jump links */}
          <nav
            aria-label="Jump to chart"
            className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-border/40 py-3"
          >
            {[
              { href: "#process", label: "Processing" },
              { href: "#states", label: "States" },
              { href: "#regions", label: "Regions" },
              { href: "#pricing", label: "Pricing" },
              { href: "#varieties", label: "Varieties" },
              { href: "#roasters", label: "Roasters" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-caption shrink-0 rounded-sm border border-border/50 px-3 py-1 font-medium transition-colors hover:border-accent/60 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Charts grid */}
          <div className="py-10 md:py-14 lg:py-16">
            <InsightsChartsGridLoader
              stats={stats}
              catalogTotal={totals.coffees}
            />
          </div>

          {/* Citation footer */}
          <footer
            id="methodology"
            className="mb-16 rounded-lg border border-border/60 bg-muted/30 px-6 py-8"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 bg-primary/70 md:w-12" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                    Use this data
                  </span>
                </div>
                <h2 className="text-heading text-foreground">
                  Methodology &amp; Attribution
                </h2>
                <p className="text-caption leading-relaxed">
                  This catalog reflects active SKUs from Indian specialty
                  roasters listed on IndianCoffeeBeans.com. Region, process, and
                  variety attribution are sourced directly from roaster product
                  pages and normalized against a controlled vocabulary.
                  Duplicate labels (e.g. &ldquo;Selection 795&rdquo; →
                  &ldquo;SLN 795&rdquo;) are reconciled manually. Data is
                  refreshed weekly, after each catalog crawl.
                </p>
                <p className="text-caption leading-relaxed">
                  All data on this page is free to use with attribution to{" "}
                  <strong className="text-foreground">
                    IndianCoffeeBeans.com
                  </strong>
                  . For the underlying dataset or custom queries, reach out via
                  the contact page.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 bg-primary/70 md:w-12" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                    Data scope
                  </span>
                </div>
                <ul className="flex flex-col gap-2 text-caption leading-relaxed">
                  <FootnoteLine>
                    Total catalog:{" "}
                    <strong className="text-foreground">
                      {coffeeCountLabel} active SKUs
                    </strong>{" "}
                    from{" "}
                    <strong className="text-foreground">
                      {roasterCountLabel} roasters
                    </strong>
                  </FootnoteLine>
                  <FootnoteLine>
                    Region-tagged coffees:{" "}
                    <strong className="text-foreground">
                      {stats.region_tagged_total.toLocaleString("en-IN")} SKUs
                    </strong>{" "}
                    — state and origin percentages are shares of this subset,
                    not the full catalog
                  </FootnoteLine>
                  <FootnoteLine>
                    Prices normalized to 250g equivalent across all packaging
                    variants
                  </FootnoteLine>
                  {lastUpdated && (
                    <FootnoteLine>
                      Last updated:{" "}
                      <strong className="text-foreground">{lastUpdated}</strong>
                    </FootnoteLine>
                  )}
                </ul>
              </div>
            </div>
          </footer>
        </Stack>
      </PageShell>
    </>
  );
}

/* ─── small helper components ─────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-title font-sans font-medium tracking-tight text-foreground">
        {value}
      </span>
      <span className="text-caption">{label}</span>
    </div>
  );
}

function FootnoteLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
      <span>{children}</span>
    </li>
  );
}
