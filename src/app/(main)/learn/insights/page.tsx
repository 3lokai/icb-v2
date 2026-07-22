import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { Stack } from "@/components/primitives/stack";
import { Accent } from "@/components/primitives/accent";
import StructuredData from "@/components/seo/StructuredData";
import dynamic from "next/dynamic";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  fetchPublicDirectoryTotals,
  type PublicDirectoryTotals,
} from "@/lib/data/fetch-public-directory-totals";
import { createAnonServerClient } from "@/lib/supabase/server";

// Dynamic-imported so recharts (~283 KB) code-splits out of first-load JS.
const InsightsChartsGrid = dynamic(() =>
  import("@/components/insights/InsightsCharts").then(
    (m) => m.InsightsChartsGrid
  )
);

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

const TOTALS_FALLBACK: PublicDirectoryTotals = { coffees: 0, roasters: 0 };

async function getDirectoryTotals(): Promise<PublicDirectoryTotals> {
  try {
    return await fetchPublicDirectoryTotals();
  } catch (e) {
    console.error("[InsightsPage] fetchPublicDirectoryTotals", e);
    return TOTALS_FALLBACK;
  }
}

export const metadata: Metadata = generateSEOMetadata({
  title: "Indian Specialty Coffee — by the Numbers",
  description:
    "Live data from 85+ active roasters and 1,100+ specialty SKUs indexed on IndianCoffeeBeans.com. Process breakdowns, origin regions, pricing benchmarks, variety distribution, and roaster geography. Updated monthly.",
  keywords: [
    "Indian specialty coffee data",
    "coffee market India",
    "specialty coffee statistics",
    "Indian coffee regions",
    "coffee processing methods India",
  ],
  canonical: "/learn/insights",
  image: `${baseUrl}/og/insights.png`,
  type: "website",
});

async function getLastUpdated(): Promise<{
  display: string;
  iso: string;
}> {
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from("coffees")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (data?.updated_at) {
    return {
      display: new Date(data.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      iso: data.updated_at,
    };
  }

  return {
    display: "May 2026",
    iso: "2026-05-01",
  };
}

function buildInsightsDatasetSchema(
  dateModified: string,
  totals: PublicDirectoryTotals
) {
  const roasterCountLabel = `${totals.roasters.toLocaleString("en-IN")}+`;
  const coffeeCountLabel = `${totals.coffees.toLocaleString("en-IN")}+`;

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
    dateModified,
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
  const [{ display: lastUpdated, iso: lastUpdatedIso }, totals] =
    await Promise.all([getLastUpdated(), getDirectoryTotals()]);

  const roasterCountLabel = `${totals.roasters.toLocaleString("en-IN")}+`;
  const coffeeCountLabel = `${totals.coffees.toLocaleString("en-IN")}+`;

  return (
    <>
      <StructuredData
        schema={buildInsightsDatasetSchema(lastUpdatedIso, totals)}
      />
      <PageHeader
        title={
          <>
            The State of Indian Specialty Coffee,
            <br />
            <Accent>by the Numbers</Accent>
          </>
        }
        overline="Market Insights"
        description={`Live data from ${roasterCountLabel} active roasters and ${coffeeCountLabel} specialty SKUs indexed on IndianCoffeeBeans.com. Updated monthly.`}
        backgroundImage="/images/hero-learn.avif"
      />

      <PageShell className="py-0">
        <Stack gap="1">
          {/* Metadata strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-4">
            <div className="flex flex-wrap gap-6">
              <Stat label="Active Roasters" value={roasterCountLabel} />
              <Stat label="Specialty SKUs" value={coffeeCountLabel} />
              <Stat label="States Covered" value="8" />
              <Stat label="Origin Regions" value="60+" />
            </div>
            <p className="text-caption">
              Last updated:{" "}
              <span className="font-medium text-foreground">{lastUpdated}</span>
            </p>
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
            <InsightsChartsGrid />
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
                  refreshed monthly.
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
                    <strong className="text-foreground">605 SKUs</strong> —
                    state and origin percentages are shares of this subset, not
                    the full catalog
                  </FootnoteLine>
                  <FootnoteLine>
                    Wet Hulled (₹1,200 median) has only 3 SKUs — treat as
                    directional only
                  </FootnoteLine>
                  <FootnoteLine>
                    Prices normalized to 250g equivalent across all packaging
                    variants
                  </FootnoteLine>
                  <FootnoteLine>
                    Last updated:{" "}
                    <strong className="text-foreground">{lastUpdated}</strong>
                  </FootnoteLine>
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
