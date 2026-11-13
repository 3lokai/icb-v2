// src/components/cards/CoffeeCard.tsx
//
// No "use client": this card has no handlers and no browser APIs of its own, so
// it renders on the server under a server parent (MoreFromRoaster,
// CoffeeGridTeaser) and is bundled as ordinary client code under a client one
// (CoffeeGrid, SimilarCoffees). Its interactive parts — WishlistButton,
// CardRatingFooter, StarRating — declare their own boundaries and stay islands.
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { coffeeImagePresets } from "@/lib/imagekit";
import { formatPrice } from "@/lib/utils/coffee-utils";
import {
  formatFlavorLabels,
  formatProcess,
  formatRoastLevel,
} from "@/lib/utils/coffee-card-utils";
import type { CoffeeSummary } from "@/types/coffee-types";
import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";
import { cn } from "@/lib/utils";
import { StarRating } from "../common/StarRating";
import { CardRatingFooter } from "./CardRatingFooter";
import { Stack } from "../primitives/stack";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { WishlistButton } from "@/components/coffees/WishlistButton";

// Packaging tile, as in the approved HTML playground: paper tile with a pressed frame (inner
// highlight, soft drop shadow, heavier bottom edge), image filling the tile with an 8px inset and
// white pack-shot backgrounds multiplied into the paper. The tile stays paper in both themes (a
// dark tile would turn every multiplied pack muddy); in dark it is one step dimmer so it does not glow.
// Owner decision 2026-11-13; note this crops and tints packaging, which 22-visual-system.md rule 1
// otherwise forbids — recorded there as the sanctioned exception.
const TILE =
  "relative block w-full overflow-hidden rounded-xl border border-border border-b-[3px] bg-[#F6EFE3] p-2 dark:bg-[#E2D4BE] shadow-[inset_0_0_0_4px_rgb(251_246_236/0.6),0_3px_7px_rgb(45_21_14/0.11)] transition-colors motion-reduce:transition-none group-hover:border-foreground/30";
const TILE_IMAGE = "object-cover mix-blend-multiply";

type CoffeeCardProps = {
  coffee: CoffeeSummary;
  variant?: "hero" | "default" | "compact" | "similar";
  userRating?: number | null;
  matchInfo?: {
    matchType: "flavor" | "style" | "origin" | "fallback";
    chips: string[]; // Max 3 labels to display
  };
};

export default function CoffeeCard({
  coffee,
  variant = "default",
  userRating,
  matchInfo,
}: CoffeeCardProps) {
  // Early returns (need roaster_slug for nested coffee detail URL)
  if (!coffee || !coffee.slug || !coffee.name || !coffee.roaster_slug) {
    return null;
  }

  const imageUrl =
    variant === "hero"
      ? coffeeImagePresets.coffeeCardHero(coffee.image_url)
      : coffeeImagePresets.coffeeCard(coffee.image_url);

  // Format metadata - limit to 2-3 soft signals total
  const roastLevel = formatRoastLevel(
    coffee.roast_level,
    coffee.roast_level_raw,
    coffee.roast_style_raw
  );

  const processLabel = formatProcess(coffee.process);

  const flavorLabels = formatFlavorLabels(coffee.flavor_keys, 3);
  const extraFlavorCount =
    (coffee.flavor_keys?.length ?? 0) - flavorLabels.length;

  const formattedPrice = coffee.best_normalized_250g
    ? formatPrice(coffee.best_normalized_250g).replace(/₹/g, "").trim()
    : null;

  // Cleaned name for every render path in this card. `coffee.name` stays the
  // raw scraped value and is only used for identity checks below.
  const displayName = getCoffeeDisplayName(coffee);

  const ariaLabel = coffee.roaster_name
    ? `${displayName} by ${coffee.roaster_name} - Add your take`
    : `${displayName} - Add your take`;

  // Descriptive, unique alt text for the product image (SEO + a11y).
  const imageAlt = coffee.roaster_name
    ? `${displayName} by ${coffee.roaster_name}`
    : displayName || "Coffee";

  const detailHref = coffeeDetailHref(coffee.roaster_slug, coffee.slug!);

  // ICB is an Indian directory; a foreign origin should not read as Indian.
  const originBadge = coffee.origin_country ? (
    <Badge
      variant="secondary"
      className="absolute top-2 left-2 z-10 text-overline"
    >
      {coffee.origin_country} origin
    </Badge>
  ) : null;

  // One quiet line each, instead of chips and scales: notes in the display italic,
  // then roast and process for precise scanning.
  const notes =
    flavorLabels.length > 0
      ? flavorLabels.join(", ").toLowerCase() +
        (extraFlavorCount > 0 ? ` +${extraFlavorCount}` : "")
      : null;
  const specs = [roastLevel, processLabel]
    .filter(Boolean)
    .join(" · ")
    .replace(/[_-]+/g, " ");

  // Compact variant - dense, horizontal row card, display-only rating
  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover border-0 ring-1 ring-border/60 hover:ring-border",
          "h-[80px]",
          "gap-0 p-0"
        )}
        aria-label={ariaLabel}
      >
        <Link
          href={detailHref}
          className="flex flex-row items-center gap-3 card-padding-compact h-full"
        >
          {/* Small packaging tile - fixed square */}
          <div className="relative size-16 shrink-0 self-center overflow-hidden rounded-md border border-border bg-[#F6EFE3]">
            <Image
              alt={imageAlt}
              className={TILE_IMAGE}
              fill
              sizes="64px"
              src={imageUrl}
              unoptimized
            />
          </div>

          {/* Content - 1-2 lines total */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <Stack gap="1">
              {/* Display-only rating (rendered only when a community rating exists) */}
              <StarRating
                rating={coffee.rating_avg ?? 0}
                count={coffee.rating_count}
                size="sm"
              />

              {/* Coffee name - primary */}
              <h3 className="text-body line-clamp-1">{displayName}</h3>

              {/* Secondary info - roaster OR roast level, one line max */}
              {(coffee.roaster_name || roastLevel) && (
                <p className="text-caption line-clamp-1">
                  {coffee.roaster_name || roastLevel}
                </p>
              )}
            </Stack>
          </div>
        </Link>
      </Card>
    );
  }

  // Hero, default and similar share one structure: framed packaging tile, then
  // name, roaster, notes, specs, evidence line, and the in-place rating row.
  const isHero = variant === "hero";
  const isSimilar = variant === "similar";

  return (
    <article
      aria-label={ariaLabel}
      className={cn(
        "group relative flex h-full w-full flex-col",
        isHero && "mx-auto max-w-[420px]",
        variant === "default" && "max-w-[300px]"
      )}
    >
      <WishlistButton
        variant="icon"
        coffeeId={coffee.coffee_id}
        className="absolute top-2 right-2 z-10"
      />
      <Link href={detailHref} className="flex flex-1 flex-col">
        <span
          className={cn(
            TILE,
            isHero
              ? "aspect-square"
              : isSimilar
                ? "aspect-[3/4]"
                : "aspect-[4/5]"
          )}
        >
          <span className="relative block size-full overflow-hidden rounded-lg">
            <Image
              alt={imageAlt}
              className={TILE_IMAGE}
              fill
              sizes={
                isHero
                  ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                  : isSimilar
                    ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              }
              src={imageUrl}
              unoptimized
            />
          </span>
          {!isSimilar && originBadge}
        </span>

        <h3
          className={cn(
            "mt-4 text-balance line-clamp-2 underline-offset-4 group-hover:underline",
            isHero ? "text-title" : "text-heading"
          )}
        >
          {displayName}
        </h3>
        {coffee.roaster_name && (
          <p className="mt-0.5 text-ui-meta line-clamp-1">
            {coffee.roaster_name}
          </p>
        )}

        {isSimilar ? (
          matchInfo &&
          matchInfo.chips.length > 0 && (
            <span className="flex flex-wrap gap-2 pt-2">
              {matchInfo.chips.slice(0, 3).map((chip, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-micro font-medium"
                >
                  {chip}
                </Badge>
              ))}
            </span>
          )
        ) : (
          <>
            {notes && (
              <p className="mt-2 font-serif text-body text-foreground italic leading-snug line-clamp-2">
                {notes}
              </p>
            )}
            {(specs || formattedPrice) && (
              <p className="mt-auto flex items-baseline justify-between gap-2 pt-2">
                <span className="min-w-0 truncate text-label">{specs}</span>
                {formattedPrice && (
                  <span className="whitespace-nowrap text-caption tabular-nums">
                    <span className="font-medium text-foreground">
                      ₹{formattedPrice}
                    </span>{" "}
                    / 250g
                  </span>
                )}
              </p>
            )}
          </>
        )}
      </Link>

      {/* In-place rating: interactive stars + prompt, flush with the text column */}
      <CardRatingFooter
        entityType="coffee"
        entityId={coffee.coffee_id}
        entityName={displayName}
        ratingAvg={coffee.rating_avg}
        ratingCount={coffee.rating_count}
        userRating={userRating}
        size={isHero ? "lg" : isSimilar ? "sm" : "md"}
        variant={isSimilar ? "minimal" : "inline"}
        flush={isSimilar}
      />
    </article>
  );
}
