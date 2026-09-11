import Image from "next/image";
import Link from "next/link";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { regionBrowseHref } from "@/lib/discovery/landing-pages";
import { coffeeImagePresets } from "@/lib/imagekit";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Structural, not `RegionSummary`: the compact variant is fed from landing-page
 * configs and from `EstateRegionSummary`, neither of which carries the hub's
 * sourced-area columns. Everything past `logo_url` is optional and drops silently.
 */
export type RegionCardRegion = {
  slug: string;
  display_name: string;
  /** The `card` image slot — a framed Coffee-Board-style plate, 4:5, ImageKit. */
  logo_url: string | null;
  district?: string | null;
  signature_profile?: string | null;
  area_hectares?: number | null;
  area_source?: string | null;
  area_as_of?: string | null;
};

export type RegionCardChild = {
  region: Pick<RegionCardRegion, "slug" | "display_name"> & { id?: string };
  coffeeCount: number;
};

type RegionCardProps = {
  region: RegionCardRegion;
  coffeeCount: number;
  /**
   * `default` — the /regions hub: full plate, profile, provenance, sub-region chips.
   * `compact` — a cross-link on a discovery page: plate stamp, name, tally.
   */
  variant?: "default" | "compact";
  /** Sub-units with coffees of their own. Ignored by `compact`. */
  subRegions?: RegionCardChild[];
  /** Defaults to the region's browse page. Discovery pages pass their own page path. */
  href?: string;
  className?: string;
};

/** Sub-region chips per card, sized to the 4-up card width; the rest collapse into "+N more". */
const CHILD_CHIP_LIMIT = 4;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Never render a figure without its provenance: the Coffee Board's older web figures
 * disagree with NRSC 2024 by up to 65%, so an unattributed number is worse than none.
 * Enforced in the DB by `canon_regions_area_needs_source`.
 */
function formatArea(region: RegionCardRegion): string | null {
  if (!region.area_hectares || !region.area_source || !region.area_as_of) {
    return null;
  }
  const asOf = new Date(region.area_as_of).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
  return `${region.area_hectares.toLocaleString("en-IN")} ha under coffee · ${region.area_source}, ${asOf}`;
}

function formatTally(count: number): string {
  return `${count.toLocaleString("en-IN")} ${count === 1 ? "coffee" : "coffees"}`;
}

/**
 * The plate itself, edge to edge. The card takes its width from the plate's own 4:5
 * rather than forcing the plate into the card, which is what keeps this free of any pad
 * or letterbox fill: the image is the tile. Deliberately *not* clipped to a radius of
 * its own and never zoomed on hover either — these images ship with a painted frame and
 * keyline as part of the artwork, so a crop or a scale eats the frame. The card clips;
 * the plate does not.
 */
function Plate({
  region,
  size = "card",
  sizes,
  className,
}: {
  region: RegionCardRegion;
  size?: "card" | "stamp";
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[4/5] bg-muted/40", className)}>
      <Image
        alt={`Illustrated plate for the ${region.display_name} coffee region`}
        className="object-cover"
        fill
        sizes={sizes}
        src={coffeeImagePresets.regionCard(region.logo_url, size)}
        unoptimized
      />
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * RegionCard — a mounted field-guide plate.
 *
 * The plate bleeds to the card's edges so its own painted border becomes the card's
 * top edge (a plate inset inside a bordered card double-frames it), and the caption
 * block sits below on warm paper, the way a specimen is captioned in the guide this
 * whole system is modelled on.
 */
export function RegionCard({
  region,
  coffeeCount,
  variant = "default",
  subRegions = [],
  href,
  className,
}: RegionCardProps) {
  const target = href ?? regionBrowseHref(region.slug);
  const tally = formatTally(coffeeCount);

  if (variant === "compact") {
    return (
      <Link
        className={cn(
          "group surface-1 card-hover flex items-center gap-3 overflow-hidden rounded-lg pr-4",
          "transition-colors duration-300 hover:border-accent/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        href={target}
      >
        <Plate
          className="w-11 shrink-0"
          region={region}
          size="stamp"
          sizes="44px"
        />
        <span className="min-w-0 py-2">
          <span className="block truncate text-body font-medium transition-colors group-hover:text-accent">
            {region.display_name}
          </span>
          <span className="block text-micro tabular-nums">{tally}</span>
        </span>
      </Link>
    );
  }

  const area = formatArea(region);
  const visibleChildren = subRegions.slice(0, CHILD_CHIP_LIMIT);
  const hiddenChildCount = subRegions.length - visibleChildren.length;

  return (
    <div
      className={cn(
        "group surface-1 card-hover relative flex flex-col overflow-hidden rounded-xl",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
    >
      <Plate
        region={region}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />

      <div className="card-padding-compact flex flex-1 flex-col gap-2.5">
        <Stack gap="1">
          {/* Stretched link: the whole card is one target with one accessible name,
              while the sub-region chips below stay independently clickable. */}
          <h3 className="text-heading text-balance">
            <Link
              className="outline-none after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-accent"
              href={target}
            >
              {region.display_name}
            </Link>
          </h3>
          <p className="text-caption">
            <span className="tabular-nums">{tally}</span>
            {region.district ? ` · ${region.district}` : ""}
          </p>
        </Stack>

        {region.signature_profile ? (
          <p className="text-caption line-clamp-2">
            {region.signature_profile}
          </p>
        ) : null}

        {subRegions.length > 0 ? (
          <Cluster className="relative" gap="2">
            {visibleChildren.map((child) => (
              <Link
                className="text-micro rounded-full border border-border/60 px-2.5 py-0.5 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={regionBrowseHref(child.region.slug)}
                key={child.region.id ?? child.region.slug}
              >
                {child.region.display_name}{" "}
                <span className="tabular-nums">({child.coffeeCount})</span>
              </Link>
            ))}
            {hiddenChildCount > 0 ? (
              <Link
                className="text-micro rounded-full border border-dashed border-border/60 px-2.5 py-0.5 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={target}
              >
                +{hiddenChildCount} more
              </Link>
            ) : null}
          </Cluster>
        ) : null}

        {/* Provenance footnote, pinned to the bottom so the rule lines up across a row. */}
        {area ? (
          <p className="text-micro mt-auto border-t border-border/60 pt-2.5 font-normal leading-snug">
            {area}
          </p>
        ) : null}
      </div>
    </div>
  );
}
