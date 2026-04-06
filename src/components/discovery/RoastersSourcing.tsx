import Link from "next/link";
import { fetchRoastersForRegionSlugs } from "@/lib/data/fetch-coffees";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Cluster } from "@/components/primitives/cluster";
import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

type RoastersSourcingProps = {
  regionSlugs: string[] | undefined;
  /** Display label, e.g. "Chikmagalur" */
  regionLabel: string;
  className?: string;
};

/**
 * Roasters that list coffees from the same region filter as the grid.
 */
export async function RoastersSourcing({
  regionSlugs,
  regionLabel,
  className,
}: RoastersSourcingProps) {
  if (!regionSlugs?.length) {
    return null;
  }

  const roasters = await fetchRoastersForRegionSlugs(regionSlugs);

  if (roasters.length === 0) {
    return null;
  }

  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-6"
        overline="Roasters"
        title={`Sourcing from *${regionLabel}*`}
        description="Roasters on our directory with coffees tagged to this origin."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            {roasters.length} listed
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <Cluster gap="2" className="flex-wrap">
          {roasters.map((r) => (
            <Link
              key={r.roasterId}
              href={`/roasters/${r.slug}`}
              className={cn(
                "group inline-flex max-w-full items-center rounded-full border border-border/50 bg-background/60 px-3 py-1.5 text-micro font-medium text-muted-foreground truncate",
                "transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-foreground hover:scale-[1.02] hover:shadow-sm"
              )}
            >
              {r.name}
            </Link>
          ))}
        </Cluster>
      </div>
    </Section>
  );
}
