// src/components/cards/CoffeeCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoffeeBeanIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
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

// Title-scrim gradient. Uses the palette's darkest color (the dark-theme
// --background warm coffee-black) as a fixed literal, not var(--background),
// which flips to near-white in light mode — the scrim must stay dark in both.
const TITLE_SCRIM =
  "linear-gradient(to top, oklch(0.195 0.01 59.58), oklch(0.195 0.01 59.58 / 0.7) 40%, oklch(0.195 0.01 59.58 / 0.2) 70%, transparent)";

type CoffeeCardProps = {
  coffee: CoffeeSummary;
  variant?: "hero" | "default" | "compact" | "similar";
  userRating?: number | null;
  matchInfo?: {
    matchType: "flavor" | "style" | "origin" | "fallback";
    chips: string[]; // Max 3 labels to display
  };
};

type RoastLevelIndicatorProps = {
  roastLevel: string | null;
  roastLevelRaw: string | null;
  roastStyleRaw: string | null;
  className?: string;
};

/**
 * Roast Level Indicator Component
 * Shows 1-5 coffee beans based on roast level (light to dark)
 */
function RoastLevelIndicator({
  roastLevel,
  roastLevelRaw,
  roastStyleRaw,
  className,
}: RoastLevelIndicatorProps) {
  // Get the formatted roast level text
  const displayText = formatRoastLevel(
    roastLevel,
    roastLevelRaw,
    roastStyleRaw
  );

  if (!displayText) return null;

  // Map roast level to number of beans (1-5)
  const getBeanCount = (level: string | null): number => {
    if (!level) return 0;
    const normalized = level.toLowerCase();
    if (normalized === "light") return 1;
    if (normalized === "light_medium" || normalized === "light medium")
      return 2;
    if (normalized === "medium") return 3;
    if (normalized === "medium_dark" || normalized === "medium dark") return 4;
    if (normalized === "dark") return 5;
    // Fallback: try to infer from text
    if (normalized.includes("light")) return 1;
    if (normalized.includes("dark")) return 5;
    return 3; // Default to medium
  };

  const beanCount = getBeanCount(roastLevel ?? roastLevelRaw);
  const beans = Array.from({ length: 5 }, (_, i) => i < beanCount);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-label">Roast</span>
      <div
        className="flex items-center gap-0.5"
        aria-label={`Roast level: ${displayText}`}
        title={displayText}
      >
        {beans.map((filled, idx) => (
          <Icon
            key={idx}
            icon={CoffeeBeanIcon}
            size={12}
            color="muted"
            className={cn(
              "transition-opacity",
              filled ? "opacity-100" : "opacity-20"
            )}
            style={
              {
                "--ph-secondary": "var(--muted-foreground)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

function CoffeeCardComponent({
  coffee,
  variant = "default",
  userRating,
  matchInfo,
}: CoffeeCardProps) {
  // Memoize expensive computations
  const imageUrl = useMemo(
    () =>
      variant === "hero"
        ? coffeeImagePresets.coffeeCardHero(coffee.image_url)
        : coffeeImagePresets.coffeeCard(coffee.image_url),
    [coffee.image_url, variant]
  );

  // Format metadata - limit to 2-3 soft signals total
  const roastLevel = useMemo(
    () =>
      formatRoastLevel(
        coffee.roast_level,
        coffee.roast_level_raw,
        coffee.roast_style_raw
      ),
    [coffee.roast_level, coffee.roast_level_raw, coffee.roast_style_raw]
  );

  const processLabel = useMemo(
    () => formatProcess(coffee.process),
    [coffee.process]
  );

  const flavorLabels = useMemo(
    () => formatFlavorLabels(coffee.flavor_keys, 3),
    [coffee.flavor_keys]
  );
  const extraFlavorCount =
    (coffee.flavor_keys?.length ?? 0) - flavorLabels.length;

  const formattedPrice = useMemo(
    () =>
      coffee.best_normalized_250g
        ? formatPrice(coffee.best_normalized_250g).replace(/₹/g, "").trim()
        : null,
    [coffee.best_normalized_250g]
  );

  // Cleaned name for every render path in this card. `coffee.name` stays the
  // raw scraped value and is only used for identity checks below.
  const displayName = getCoffeeDisplayName(coffee);

  const ariaLabel = useMemo(
    () =>
      coffee.roaster_name
        ? `${displayName} by ${coffee.roaster_name} - Add your take`
        : `${displayName} - Add your take`,
    [displayName, coffee.roaster_name]
  );

  // Descriptive, unique alt text for the product image (SEO + a11y).
  const imageAlt = useMemo(
    () =>
      coffee.roaster_name
        ? `${displayName} by ${coffee.roaster_name}`
        : displayName || "Coffee",
    [displayName, coffee.roaster_name]
  );

  // Early returns (need roaster_slug for nested coffee detail URL)
  if (!coffee || !coffee.slug || !coffee.name || !coffee.roaster_slug) {
    return null;
  }

  const detailHref = coffeeDetailHref(coffee.roaster_slug, coffee.slug!);

  // Hero variant - large, interactive rating, spacious
  if (variant === "hero") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover border-0 ring-1 ring-border/60 hover:ring-border",
          "h-full flex flex-col",
          "max-w-[420px] w-full mx-auto",
          "gap-0 p-0"
        )}
        aria-label={ariaLabel}
      >
        <WishlistButton
          variant="icon"
          coffeeId={coffee.coffee_id}
          className="absolute top-2 right-2 z-10"
        />
        <Link href={detailHref} className="flex-1 flex flex-col">
          {/* Hero Image with title scrim */}
          <div className="relative aspect-square w-full overflow-hidden image-hover-zoom transition-opacity duration-200 group-hover:opacity-90">
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
              src={imageUrl}
              unoptimized
            />
            {/* Title scrim */}
            <div
              className="absolute inset-x-0 bottom-0 z-10 p-4 pt-20"
              style={{ background: TITLE_SCRIM }}
            >
              <h3 className="text-title text-white text-balance line-clamp-2 drop-shadow-md">
                {displayName}
              </h3>
              {coffee.roaster_name && (
                <p className="text-body font-medium text-white/85 line-clamp-1 drop-shadow">
                  {coffee.roaster_name}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 card-padding transition-opacity duration-200 group-hover:opacity-90">
            <Stack gap="2" className="h-full">
              {/* Metadata - roast indicator, process and flavor notes */}
              {(roastLevel || processLabel || flavorLabels.length > 0) && (
                <div className="flex flex-col gap-3">
                  {(roastLevel || processLabel) && (
                    <div className="flex items-start justify-between gap-2">
                      {roastLevel && (
                        <RoastLevelIndicator
                          roastLevel={coffee.roast_level}
                          roastLevelRaw={coffee.roast_level_raw}
                          roastStyleRaw={coffee.roast_style_raw}
                        />
                      )}
                      {processLabel && (
                        <div className="ml-auto flex flex-col items-end gap-1 text-right">
                          <span className="text-label">Processing</span>
                          <span className="text-overline">{processLabel}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {flavorLabels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {flavorLabels.map((flavor, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-overline"
                        >
                          {flavor}
                        </Badge>
                      ))}
                      {extraFlavorCount > 0 && (
                        <span className="text-overline text-muted-foreground">
                          +{extraFlavorCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Price - small, muted, secondary, at bottom before rating zone */}
              {formattedPrice && (
                <p className="text-caption mt-auto pt-1 text-right">
                  From ₹{formattedPrice} / 250g
                </p>
              )}
            </Stack>
          </div>
        </Link>

        {/* Bottom rating strip */}
        <CardRatingFooter
          entityType="coffee"
          entityId={coffee.coffee_id}
          entityName={displayName}
          ratingAvg={coffee.rating_avg}
          ratingCount={coffee.rating_count}
          userRating={userRating}
          size="lg"
        />
      </Card>
    );
  }

  // Similar variant - compact vertical card with match chips
  if (variant === "similar") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover border-0 ring-1 ring-border/60 hover:ring-border",
          "h-full flex flex-col",
          "gap-0 p-0"
        )}
        aria-label={ariaLabel}
      >
        <WishlistButton
          variant="icon"
          coffeeId={coffee.coffee_id}
          className="absolute top-2 right-2 z-10"
        />
        <Link href={detailHref} className="flex-1 flex flex-col">
          {/* Image - 3:4 aspect ratio */}
          <div className="relative aspect-[3/4] w-full overflow-hidden image-hover-zoom transition-opacity duration-200 group-hover:opacity-90">
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={imageUrl}
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="flex-1 card-padding-compact transition-opacity duration-200 group-hover:opacity-90">
            <Stack gap="1">
              {/* Coffee name */}
              <h3 className="text-heading text-balance line-clamp-2">
                {displayName}
              </h3>

              {/* Roaster */}
              {coffee.roaster_name && (
                <p className="text-body-muted font-medium">
                  {coffee.roaster_name}
                </p>
              )}

              {/* Match chips row - max 3 badges */}
              {matchInfo && matchInfo.chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchInfo.chips.slice(0, 3).map((chip, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-micro font-medium"
                    >
                      {chip}
                    </Badge>
                  ))}
                </div>
              )}
            </Stack>
          </div>
        </Link>

        {/* Minimal interactive rating row — capture without the full number block */}
        <CardRatingFooter
          entityType="coffee"
          entityId={coffee.coffee_id}
          entityName={displayName}
          ratingAvg={coffee.rating_avg}
          ratingCount={coffee.rating_count}
          userRating={userRating}
          size="sm"
          variant="minimal"
        />
      </Card>
    );
  }

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
          {/* Small image - fixed square */}
          <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded image-hover-zoom self-center transition-opacity duration-200 group-hover:opacity-90">
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              sizes="64px"
              src={imageUrl}
              unoptimized
            />
          </div>

          {/* Content - 1-2 lines total */}
          <div className="flex-1 min-w-0 flex flex-col justify-center transition-opacity duration-200 group-hover:opacity-90">
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

  // Default variant - opinion-first hierarchy, magazine tile
  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "surface-1 rounded-lg card-hover border-0 ring-1 ring-border/60 hover:ring-border",
        "h-full flex flex-col",
        "max-w-[300px] w-full",
        "gap-0 p-0"
      )}
      aria-label={ariaLabel}
    >
      <WishlistButton
        variant="icon"
        coffeeId={coffee.coffee_id}
        className="absolute top-2 right-2 z-10"
      />
      <Link href={detailHref} className="flex-1 flex flex-col">
        {/* Image with title scrim */}
        <div className="relative aspect-[4/5] w-full overflow-hidden image-hover-zoom transition-opacity duration-200 group-hover:opacity-90">
          <Image
            alt={imageAlt}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            src={imageUrl}
            unoptimized
          />
          {/* Title scrim */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 p-4 pt-20"
            style={{ background: TITLE_SCRIM }}
          >
            <h3 className="text-heading text-white text-balance line-clamp-2 drop-shadow-md">
              {displayName}
            </h3>
            {coffee.roaster_name && (
              <p className="text-body font-medium text-white/85 line-clamp-1 drop-shadow">
                {coffee.roaster_name}
              </p>
            )}
          </div>
        </div>

        {/* Content - strict hierarchy */}
        <div className="flex-1 card-padding-compact transition-opacity duration-200 group-hover:opacity-90">
          <Stack gap="1" className="h-full">
            {/* Metadata - roast indicator, process and flavor notes */}
            {(roastLevel || processLabel || flavorLabels.length > 0) && (
              <div className="flex flex-col gap-3">
                {(roastLevel || processLabel) && (
                  <div className="flex items-start justify-between gap-2">
                    {roastLevel && (
                      <RoastLevelIndicator
                        roastLevel={coffee.roast_level}
                        roastLevelRaw={coffee.roast_level_raw}
                        roastStyleRaw={coffee.roast_style_raw}
                      />
                    )}
                    {processLabel && (
                      <div className="ml-auto flex flex-col items-end gap-1 text-right">
                        <span className="text-label">Processing</span>
                        <span className="text-overline">{processLabel}</span>
                      </div>
                    )}
                  </div>
                )}
                {flavorLabels.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {flavorLabels.map((flavor, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-overline"
                      >
                        {flavor}
                      </Badge>
                    ))}
                    {extraFlavorCount > 0 && (
                      <span className="text-overline text-muted-foreground">
                        +{extraFlavorCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. Price (small, muted, secondary) */}
            {formattedPrice && (
              <p className="text-caption mt-auto pt-1 text-right">
                From ₹{formattedPrice} / 250g
              </p>
            )}
          </Stack>
        </div>
      </Link>

      {/* Opinion-first Footer */}
      <CardRatingFooter
        entityType="coffee"
        entityId={coffee.coffee_id}
        entityName={displayName}
        ratingAvg={coffee.rating_avg}
        ratingCount={coffee.rating_count}
        userRating={userRating}
        size="md"
      />
    </Card>
  );
}

// Memoize component
const CoffeeCard = memo(CoffeeCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.coffee.coffee_id === nextProps.coffee.coffee_id &&
    prevProps.coffee.slug === nextProps.coffee.slug &&
    prevProps.coffee.name === nextProps.coffee.name &&
    prevProps.coffee.image_url === nextProps.coffee.image_url &&
    prevProps.coffee.rating_avg === nextProps.coffee.rating_avg &&
    prevProps.coffee.rating_count === nextProps.coffee.rating_count &&
    prevProps.variant === nextProps.variant &&
    JSON.stringify(prevProps.matchInfo) === JSON.stringify(nextProps.matchInfo)
  );
});

CoffeeCard.displayName = "CoffeeCard";

export default CoffeeCard;
