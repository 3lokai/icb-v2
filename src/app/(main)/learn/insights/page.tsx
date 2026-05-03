import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { Stack } from "@/components/primitives/stack";
import {
  ProcessBreakdownChart,
  StateConcentrationChart,
  TopRegionsChart,
  PriceByProcessChart,
  VarietyDistributionChart,
  RoasterCityChart,
} from "@/components/insights/InsightsCharts";

export const metadata: Metadata = {
  title:
    "Indian Specialty Coffee Insights — by the Numbers | IndianCoffeeBeans",
  description:
    "Live data from 85+ active roasters and 1,100+ specialty SKUs indexed on IndianCoffeeBeans.com. Process breakdowns, origin regions, pricing benchmarks, variety distribution, and roaster geography. Updated monthly.",
};

const LAST_UPDATED = "May 2025";

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            The State of Indian Specialty Coffee
            <br />
            <span className="text-accent italic font-serif">
              by the Numbers
            </span>
          </>
        }
        overline="Market Insights"
        description="Live data from 85+ active roasters and 1,100+ specialty SKUs indexed on IndianCoffeeBeans.com. Updated monthly."
        backgroundImage="/images/hero-learn.avif"
      />

      <PageShell className="py-0">
        <Stack gap="1">
          {/* Metadata strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-4">
            <div className="flex flex-wrap gap-6">
              <Stat label="Active Roasters" value="85+" />
              <Stat label="Specialty SKUs" value="1,108" />
              <Stat label="States Covered" value="8" />
              <Stat label="Origin Regions" value="60+" />
            </div>
            <p className="text-caption">
              Last updated:{" "}
              <span className="font-medium text-foreground">
                {LAST_UPDATED}
              </span>
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
            <Stack gap="12">
              {/* Row 1: full-width lead chart */}
              <ProcessBreakdownChart />

              {/* Row 2: 2-col — State treemap + Top regions bar */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <StateConcentrationChart />
                <TopRegionsChart />
              </div>

              {/* Row 3: full-width pricing */}
              <PriceByProcessChart />

              {/* Row 4: 2-col — Variety radial + Roaster bubbles */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <VarietyDistributionChart />
                <RoasterCityChart />
              </div>
            </Stack>
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
                      1,108 active SKUs
                    </strong>{" "}
                    from{" "}
                    <strong className="text-foreground">85+ roasters</strong>
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
                    <strong className="text-foreground">{LAST_UPDATED}</strong>
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
