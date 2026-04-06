import Link from "next/link";
import { splitEmphasisPair } from "@/lib/discovery/accent-emphasis";
import type { LandingPageConfig } from "@/lib/discovery/landing-pages";
import { Icon } from "@/components/common/Icon";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

/** Flip when dedicated `/regions/[slug]` pages are published */
const REGION_GUIDES_LIVE = false;

const SNAPSHOT_TITLE = "In the cup & on the *map*";
const SNAPSHOT_DESCRIPTION =
  "Quick facts to anchor flavour expectations—pair with the coffees below.";

type RegionSnapshotProps = {
  regionSlug: string;
  regionSnapshot: NonNullable<LandingPageConfig["regionSnapshot"]>;
  className?: string;
  /**
   * `embedded` — inside RegionProfile card: no Section wrapper, compact header, no double padding.
   * `standalone` — full section rhythm for discovery pages without RegionProfileSection.
   */
  variant?: "standalone" | "embedded";
};

const STAT_ICONS = [
  { icon: "MapPin" as const, bg: "bg-primary/10", color: "text-primary" },
  { icon: "Mountains" as const, bg: "bg-accent/10", color: "text-accent" },
  { icon: "Sparkle" as const, bg: "bg-chart-2/10", color: "text-chart-2" },
];

function SnapshotHeadingTitle({ children }: { children: React.ReactNode }) {
  if (typeof children === "string") {
    const parts = splitEmphasisPair(children);
    if (parts) {
      return (
        <>
          {parts.before}
          <span className="text-accent italic">{parts.accent}</span>
          {parts.after}
        </>
      );
    }
  }
  return <>{children}</>;
}

function SnapshotContent({
  regionSlug,
  regionSnapshot,
  embedded,
}: {
  regionSlug: string;
  regionSnapshot: NonNullable<LandingPageConfig["regionSnapshot"]>;
  embedded: boolean;
}) {
  const guideHref = `/regions/${regionSlug}`;
  const cards = [
    { label: "State / area", value: regionSnapshot.state },
    { label: "Elevation", value: regionSnapshot.elevation },
    { label: "Known for", value: regionSnapshot.knownFor },
  ];

  const cardShell = embedded
    ? "relative overflow-hidden rounded-xl border border-border/40 bg-card/40 p-4 shadow-sm transition-all duration-300 hover:border-border/60 md:p-5"
    : "surface-1 relative overflow-hidden card-padding card-hover group rounded-2xl transition-all duration-300 hover:-translate-y-1";

  return (
    <>
      {embedded ? (
        <div className="mb-5 space-y-3 md:mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Snapshot
                </span>
              </div>
              <h3 className="text-heading text-balance leading-snug tracking-tight">
                <SnapshotHeadingTitle>{SNAPSHOT_TITLE}</SnapshotHeadingTitle>
              </h3>
              <p className="text-pretty text-caption text-muted-foreground leading-relaxed sm:max-w-md">
                {SNAPSHOT_DESCRIPTION}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium sm:pt-1">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              Origin
              <span className="h-1 w-1 rounded-full bg-accent/40" />
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          embedded ? "w-full" : "mx-auto max-w-6xl w-full px-4 md:px-0"
        )}
      >
        <div
          className={cn("grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3")}
        >
          {cards.map((c, i) => {
            const meta = STAT_ICONS[i] ?? STAT_ICONS[0];
            return (
              <div
                key={c.label}
                className={cn(cardShell, !embedded && "group")}
              >
                {!embedded && (
                  <div
                    className={cn(
                      "absolute top-0 right-0 h-16 w-16 rounded-full blur-2xl opacity-10 transition-all duration-500 group-hover:opacity-20",
                      meta.bg
                    )}
                  />
                )}

                <Stack gap={embedded ? "3" : "4"} className="relative z-10">
                  <div
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all md:h-10 md:w-10 md:rounded-xl",
                      embedded
                        ? ""
                        : "group-hover:scale-110 group-hover:rotate-3",
                      meta.bg
                    )}
                  >
                    <Icon
                      className={cn(meta.color, embedded && "opacity-90")}
                      name={meta.icon}
                      size={embedded ? 18 : 20}
                    />
                  </div>
                  <Stack gap="2">
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="text-body leading-relaxed text-foreground">
                      {c.value}
                    </p>
                  </Stack>
                </Stack>
              </div>
            );
          })}
        </div>
        <div className={cn("mt-6", embedded && "mt-5 md:mt-6")}>
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
    </>
  );
}

export function RegionSnapshot({
  regionSlug,
  regionSnapshot,
  className,
  variant = "standalone",
}: RegionSnapshotProps) {
  const embedded = variant === "embedded";

  if (embedded) {
    return (
      <div
        className={cn("w-full px-4 py-5 sm:px-5 md:px-6 md:py-6", className)}
      >
        <SnapshotContent
          regionSlug={regionSlug}
          regionSnapshot={regionSnapshot}
          embedded
        />
      </div>
    );
  }

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Snapshot"
        title={SNAPSHOT_TITLE}
        description={SNAPSHOT_DESCRIPTION}
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Origin
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <SnapshotContent
        regionSlug={regionSlug}
        regionSnapshot={regionSnapshot}
        embedded={false}
      />
    </Section>
  );
}
