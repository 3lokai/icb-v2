import Link from "next/link";
import type { LandingPageConfig } from "@/lib/discovery/landing-pages";
import { Icon } from "@/components/common/Icon";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

/** Flip when dedicated `/regions/[slug]` pages are published */
const REGION_GUIDES_LIVE = false;

type RegionSnapshotProps = {
  regionSlug: string;
  regionSnapshot: NonNullable<LandingPageConfig["regionSnapshot"]>;
  className?: string;
};

const STAT_ICONS = [
  { icon: "MapPin" as const, bg: "bg-primary/10", color: "text-primary" },
  { icon: "Mountains" as const, bg: "bg-accent/10", color: "text-accent" },
  { icon: "Sparkle" as const, bg: "bg-chart-2/10", color: "text-chart-2" },
];

export function RegionSnapshot({
  regionSlug,
  regionSnapshot,
  className,
}: RegionSnapshotProps) {
  const guideHref = `/regions/${regionSlug}`;
  const cards = [
    { label: "State / area", value: regionSnapshot.state },
    { label: "Elevation", value: regionSnapshot.elevation },
    { label: "Known for", value: regionSnapshot.knownFor },
  ];

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Snapshot"
        title="In the cup & on the *map*"
        description="Quick facts to anchor flavour expectations—pair with the coffees below."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Origin
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => {
            const meta = STAT_ICONS[i] ?? STAT_ICONS[0];
            return (
              <div
                key={c.label}
                className="surface-1 relative overflow-hidden card-padding card-hover group rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decorative background blur */}
                <div
                  className={cn(
                    "absolute top-0 right-0 h-16 w-16 rounded-full blur-2xl opacity-10 transition-all duration-500 group-hover:opacity-20",
                    meta.bg.replace("bg-", "bg-")
                  )}
                />

                <Stack gap="4" className="relative z-10">
                  <div
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                      meta.bg
                    )}
                  >
                    <Icon className={meta.color} name={meta.icon} size={20} />
                  </div>
                  <Stack gap="2">
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="text-body text-foreground leading-relaxed font-medium">
                      {c.value}
                    </p>
                  </Stack>
                </Stack>
              </div>
            );
          })}
        </div>
        <div className="mt-8">
          {REGION_GUIDES_LIVE ? (
            <Link
              href={guideHref}
              className="inline-flex items-center gap-2 text-body font-medium text-accent hover:underline"
            >
              Full region guide
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          ) : (
            <span
              className="inline-flex flex-wrap items-center gap-2 text-body text-muted-foreground"
              title="Full region guide coming soon"
            >
              Full region guide
              <span className="text-micro uppercase tracking-wider border border-border/60 rounded-full px-2.5 py-0.5 bg-muted/20 text-muted-foreground">
                Coming soon
              </span>
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}
