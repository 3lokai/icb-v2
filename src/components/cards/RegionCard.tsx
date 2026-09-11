import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { regionBrowseHref } from "@/lib/discovery/landing-pages";
import { coffeeImagePresets } from "@/lib/imagekit";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Structural, not `RegionSummary`: the compact variant is fed from landing-page
 * configs and from `EstateRegionSummary`, neither of which carries the hub's terroir
 * columns. Everything past `logo_url` is optional and drops silently.
 */
export type RegionCardRegion = {
  slug: string;
  display_name: string;
  /** The `card` image slot — a framed Coffee-Board-style plate, 4:5, ImageKit. */
  logo_url: string | null;
  altitude_min_m?: number | null;
  altitude_max_m?: number | null;
  district?: string | null;
  signature_profile?: string | null;
};

type RegionCardProps = {
  region: RegionCardRegion;
  coffeeCount: number;
  /**
   * `default` — the /regions hub: plate, then name, elevation, signature profile.
   * `compact` — a cross-link on a discovery page: plate stamp, name, tally.
   */
  variant?: "default" | "compact";
  /** Defaults to the region's browse page. Discovery pages pass their own page path. */
  href?: string;
  className?: string;
};

// ============================================================================
// HELPERS
// ============================================================================

/** `900–1,800 m`, or an open-ended band when only one bound is known. */
function formatElevation(region: RegionCardRegion): string | null {
  const { altitude_min_m: min, altitude_max_m: max } = region;
  if (min && max) {
    return `${min.toLocaleString("en-IN")}–${max.toLocaleString("en-IN")} m`;
  }
  if (min) {
    return `From ${min.toLocaleString("en-IN")} m`;
  }
  return max ? `Up to ${max.toLocaleString("en-IN")} m` : null;
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
 * The plate bleeds to the card's edges so its own painted border becomes the card's top
 * edge (a plate inset inside a bordered card double-frames it), and the caption block
 * sits below on warm paper, the way a specimen is captioned in the guide this whole
 * system is modelled on.
 *
 * The caption carries three facts and no more — name, elevation, signature profile —
 * with the tally and district demoted to a footnote. Sub-region links deliberately live
 * outside the card (see the `/regions` state headers): a chip inside it would be a
 * nested click target, and the whole card is one link.
 */
export function RegionCard({
  region,
  coffeeCount,
  variant = "default",
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

  const elevation = formatElevation(region);

  return (
    <Link
      className={cn(
        "group surface-1 card-hover flex flex-col overflow-hidden rounded-xl",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      href={target}
    >
      <Plate
        region={region}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Stack gap="1">
          <h3 className="text-heading text-balance transition-colors group-hover:text-accent">
            {region.display_name}
          </h3>
          {elevation ? (
            <p className="text-caption tabular-nums">{elevation}</p>
          ) : null}
        </Stack>

        {region.signature_profile ? (
          <p className="text-caption line-clamp-2">
            {region.signature_profile}
          </p>
        ) : null}

        <p className="text-micro mt-auto pt-2 font-normal opacity-70">
          <span className="tabular-nums">{tally}</span>
          {region.district ? ` · ${region.district}` : ""}
        </p>
      </div>
    </Link>
  );
}
