import Link from "next/link";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { brewMethodDiscoveryLinkClassName } from "@/lib/discovery/brew-method-labels";
import {
  discoveryPagePath,
  getLandingPageConfig,
  type PriceBucketProfileConfig,
} from "@/lib/discovery/landing-pages";

type PriceBucketProfileSectionProps = {
  profile: PriceBucketProfileConfig;
  className?: string;
};

export function PriceBucketProfileSection({
  profile,
  className,
}: PriceBucketProfileSectionProps) {
  const {
    whatYouGet,
    buyingGuide,
    whatToExpect,
    priceNormalizationNote,
    icbDataNote,
  } = profile;

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Price Category Profile"
        title="What to expect at this *price point*"
        description="A clear breakdown of exactly what you get, what to look out for, and how to maximize your coffee budget."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Analysis
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl w-full space-y-12 px-4 md:px-0">
        {/* 1. What You Get */}
        <div className="surface-1 relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl shadow-primary/5">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />

          <Stack gap="6" className="relative z-10">
            <div className="flex items-center gap-2">
              <Icon
                name="CurrencyCircleDollar"
                className="h-5 w-5 text-accent/70"
              />
              <h3 className="text-heading">The Reality of this Price Range</h3>
            </div>
            <p className="text-body-large text-pretty text-muted-foreground leading-relaxed">
              {whatYouGet}
            </p>
          </Stack>
        </div>

        {/* 2. Buying Guide Grid */}
        <div className="max-w-5xl mx-auto w-full pt-4">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="ShoppingCart" className="h-5 w-5 text-accent/70" />
            <h3 className="text-heading">Smart Buying Guide</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {buyingGuide.map((item, idx) => (
              <div
                key={idx}
                className="bg-card/40 border border-border/40 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent/70 mb-2">
                  <Icon name="Checks" className="w-5 h-5" />
                </div>
                <h4 className="text-subheading text-foreground">{item.tip}</h4>
                <p className="text-body text-muted-foreground/90">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />

        {/* 3. What to Expect - Roast and Process Breakdown */}
        <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Roast Expectations */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Fire" className="h-5 w-5 text-accent/70" />
              <h3 className="text-heading">Roast Profiles</h3>
            </div>
            <p className="text-body text-muted-foreground">
              {whatToExpect.roastNote}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {whatToExpect.roastLevels.map((slug) => {
                const cfg = getLandingPageConfig(slug);
                if (!cfg) return null;
                return (
                  <Link
                    key={slug}
                    href={discoveryPagePath(slug)}
                    className={brewMethodDiscoveryLinkClassName}
                  >
                    {cfg.h1.replace(" Coffee in India", "").trim()}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Process Expectations */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Drop" className="h-5 w-5 text-accent/70" />
              <h3 className="text-heading">Processing Methods</h3>
            </div>
            <p className="text-body text-muted-foreground">
              {whatToExpect.processNote}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {whatToExpect.processes.map((slug) => {
                const cfg = getLandingPageConfig(slug);
                if (!cfg) return null;
                return (
                  <Link
                    key={slug}
                    href={discoveryPagePath(slug)}
                    className={brewMethodDiscoveryLinkClassName}
                  >
                    {cfg.h1.replace(" Coffee in India", "").trim()}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Notes & Disclosures */}
        <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-6 pt-10 border-t border-border/40">
          <aside className="rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 md:px-6 md:py-5">
            <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
              <Icon name="Info" className="w-4 h-4" />
              Price Normalization
            </p>
            <p className="text-caption text-muted-foreground leading-relaxed">
              {priceNormalizationNote}
            </p>
          </aside>

          <aside className="rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 md:px-6 md:py-5">
            <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
              <Icon name="Database" className="w-4 h-4" />
              On Indian Coffee Beans
            </p>
            <p className="text-caption text-muted-foreground leading-relaxed">
              {icbDataNote}
            </p>
          </aside>
        </div>
      </div>
    </Section>
  );
}
