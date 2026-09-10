import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import type { RegionProfileConfig } from "@/lib/discovery/landing-pages";
import type { RegionFacts } from "@/lib/discovery/region-facts";
import { cn } from "@/lib/utils";
import {
  CloudRainIcon,
  DropIcon,
  CalendarIcon,
  MapPinIcon,
  MountainsIcon,
  PlantIcon,
  RulerIcon,
  TreeIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { RegionSnapshot } from "./RegionSnapshot";

/** Icon per fact label from `fetchRegionFacts`; anything unlisted gets the mountain. */
const FACT_ICONS: Record<string, typeof MountainsIcon> = {
  Climate: CloudRainIcon,
  Soil: TreeIcon,
  Altitude: TrendUpIcon,
  Varieties: PlantIcon,
  Rainfall: DropIcon,
  Harvest: CalendarIcon,
  Intercrops: PlantIcon,
  Area: RulerIcon,
};

type RegionOverviewSectionProps = {
  profile: RegionProfileConfig;
  /** Terroir read from `canon_regions`. Null for regions with no canon row. */
  facts: RegionFacts | null;
  className?: string;
};

export function RegionOverviewSection({
  profile,
  facts,
  className,
}: RegionOverviewSectionProps) {
  const { overview } = profile;
  // Facts win over the config snapshot: the hardcoded elevation had already drifted
  // from the Coffee Board figure the database carries.
  const snapshot = {
    ...profile.snapshot,
    state: facts?.state ?? profile.snapshot.state,
    elevation: facts?.elevation ?? profile.snapshot.elevation,
  };

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        divider
        className="mb-8"
        overline="Region profile"
        title="Explore the *Terroir*"
        description="Terroir, flavour profile, and Indian specialty context — all from the data behind our catalogue."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Guide
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl w-full space-y-12 px-4 md:px-0">
        {/* 1. Region Snapshot & Overview */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
          <Stack gap="6">
            <h3 className="text-heading flex items-center gap-2">
              <Icon icon={MapPinIcon} className="h-5 w-5 text-accent/70" />
              About the Region
            </h3>
            <p className="text-body-large text-pretty leading-relaxed text-muted-foreground">
              {overview}
            </p>
          </Stack>

          <div className="surface-1 overflow-hidden rounded-3xl shadow-xl shadow-primary/5">
            <RegionSnapshot variant="embedded" regionSnapshot={snapshot} />
          </div>
        </div>

        {/* 2. Terroir details grid — every value sourced from canon_regions */}
        {facts && facts.cards.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Icon icon={MountainsIcon} className="h-5 w-5 text-accent/70" />
              <h3 className="text-heading">Terroir & Growing Conditions</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {facts.cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm transition-colors hover:bg-muted/50"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Icon
                      icon={FACT_ICONS[card.label] ?? MountainsIcon}
                      className="h-5 w-5 text-accent/70"
                    />
                  </div>
                  <h4 className="text-label mb-2">{card.label}</h4>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
