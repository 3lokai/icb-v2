// src/components/cards/CoffeeCard.tsx
//
// No "use client": this card has no handlers and no browser APIs of its own, so
// it renders on the server under a server parent (MoreFromRoaster,
// CoffeeGridTeaser) and is bundled as ordinary client code under a client one
// (CoffeeGrid, SimilarCoffees). Its interactive parts — WishlistButton,
// CardRatingFooter, StarRating — declare their own boundaries and stay islands.
import Image from "next/image";
import Link from "next/link";
import { CoffeeBeanIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
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
import { CardRatingFooter } from "./CardRatingFooter";
import { Stack } from "../primitives/stack";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { WishlistButton } from "@/components/coffees/WishlistButton";
import { TILE_FRAME } from "./tile";

// Packaging tile: square paper tile with a pressed frame (see ./tile.ts). The pack is shown whole
// (`contain`, 8px inset) and multiplied into the paper so white pack-shot backgrounds disappear;
// coloured backdrops stay visible as a rectangle. The tile stays paper in both themes (a dark tile
// would turn every multiplied pack muddy); in dark it is one step dimmer so it does not glow.
// Multiply tints packaging, which 22-visual-system.md rule 1 otherwise forbids — recorded there as
// the sanctioned exception. The 64px compact thumbnail still fills its square.
const TILE = cn(TILE_FRAME, "bg-[#F6EFE3] dark:bg-[#E2D4BE]");
const TILE_IMAGE = "object-contain mix-blend-multiply";
const THUMB_IMAGE = "object-cover mix-blend-multiply";

// Roast as 1–5 beans, light to dark. Unknown wording falls back to medium, as the original card did.
const ROAST_BEANS: Record<string, number> = {
  light: 1,
  light_medium: 2,
  medium: 3,
  medium_dark: 4,
  dark: 5,
};

function RoastBeans({ level, label }: { level: string; label: string }) {
  const key = level
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
  const count =
    ROAST_BEANS[key] ??
    (key.includes("light") ? 1 : key.includes("dark") ? 5 : 3);
  return (
    <span
      role="img"
      aria-label={`Roast: ${label}`}
      title={`${label} roast`}
      className="inline-flex shrink-0 items-center gap-0.5 text-foreground"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <CoffeeBeanIcon
          key={i}
          aria-hidden
          weight={i < count ? "fill" : "regular"}
          className={cn("size-3", i >= count && "opacity-30")}
        />
      ))}
    </span>
  );
}

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

  const flavorLabels = formatFlavorLabels(coffee.flavor_keys, 2);
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
  const roastKey = coffee.roast_level ?? coffee.roast_level_raw;
  const processText = processLabel?.replace(/[_-]+/g, " ") ?? null;

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
              className={THUMB_IMAGE}
              fill
              sizes="64px"
              src={imageUrl}
              unoptimized
            />
          </div>

          {/* Content - 1-2 lines total */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <Stack gap="1">
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

          {/* Display-only rating at the right edge, only when a community rating exists */}
          {!!coffee.rating_avg && coffee.rating_count > 0 && (
            <span
              className="flex shrink-0 items-center gap-1 text-ui-meta tabular-nums"
              aria-label={`${coffee.rating_avg.toFixed(1)} out of 5 from ${coffee.rating_count} ${coffee.rating_count === 1 ? "rating" : "ratings"}`}
            >
              <StarIcon
                aria-hidden
                weight="fill"
                className="size-3.5 text-rating"
              />
              <span className="font-medium text-foreground">
                {coffee.rating_avg.toFixed(1)}
              </span>
              ({coffee.rating_count})
            </span>
          )}
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
        <span className={cn(TILE, "aspect-square")}>
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
            "mt-4 line-clamp-1 underline-offset-4 group-hover:underline",
            isHero ? "text-title" : "text-heading"
          )}
          title={displayName}
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
              <p className="mt-2 font-serif text-body text-foreground italic leading-snug line-clamp-1">
                {notes}
              </p>
            )}
            {(roastLevel || processText || formattedPrice) && (
              <p className="mt-auto flex items-center justify-between gap-2 pt-2">
                <span className="flex min-w-0 items-center gap-2 text-label">
                  {roastLevel && roastKey && (
                    <RoastBeans level={roastKey} label={roastLevel} />
                  )}
                  {processText && (
                    <span className="truncate">{processText}</span>
                  )}
                </span>
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
