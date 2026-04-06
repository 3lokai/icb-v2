import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import type { RegionProfileConfig } from "@/lib/discovery/landing-pages";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import { RegionSnapshot } from "./RegionSnapshot";

type RegionOverviewSectionProps = {
  profile: RegionProfileConfig;
  slug: string;
  className?: string;
};

export function RegionOverviewSection({
  profile,
  slug,
  className,
}: RegionOverviewSectionProps) {
  const { snapshot, overview, terroir } = profile;

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
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
              <Icon name="MapPin" className="h-5 w-5 text-accent/70" />
              About the Region
            </h3>
            <p className="text-body-large text-pretty leading-relaxed text-muted-foreground">
              {overview}
            </p>
          </Stack>

          <div className="surface-1 overflow-hidden rounded-3xl shadow-xl shadow-primary/5">
            <RegionSnapshot
              variant="embedded"
              regionSlug={slug}
              regionSnapshot={snapshot}
            />
          </div>
        </div>

        {/* 2. Terroir details grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Icon name="Mountains" className="h-5 w-5 text-accent/70" />
            <h3 className="text-heading">Terroir & Growing Conditions</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm transition-colors hover:bg-muted/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icon name="CloudRain" className="h-5 w-5 text-accent/70" />
              </div>
              <h4 className="text-label mb-2">Climate</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                {terroir.climate}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm transition-colors hover:bg-muted/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icon name="Tree" className="h-5 w-5 text-accent/70" />
              </div>
              <h4 className="text-label mb-2">Soil</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                {terroir.soil}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm transition-colors hover:bg-muted/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icon name="TrendUp" className="h-5 w-5 text-accent/70" />
              </div>
              <h4 className="text-label mb-2">Altitude</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                {terroir.altitude}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm transition-colors hover:bg-muted/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icon name="Plant" className="h-5 w-5 text-accent/70" />
              </div>
              <h4 className="text-label mb-2">Varieties</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                {terroir.varieties}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
