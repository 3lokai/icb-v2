// src/components/cards/CoffeeCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/common/Icon";
import { coffeeImagePresets } from "@/lib/imagekit";
import { formatPrice } from "@/lib/utils/coffee-utils";
import {
  formatBrewMethodLabels,
  formatRoastLevel,
} from "@/lib/utils/coffee-card-utils";
import type { CoffeeSummary } from "@/types/coffee-types";
import { cn } from "@/lib/utils";
import { StarRating } from "../common/StarRating";
import { CardRatingFooter } from "./CardRatingFooter";
import { Stack } from "../primitives/stack";
import { trackCoffeeDiscovery } from "@/lib/analytics/enhanced-tracking";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";

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
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {beans.map((filled, idx) => (
          <Icon
            key={idx}
            name="CoffeeBean"
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
      <span className="text-label">{displayText}</span>
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

  const brewMethodLabels = useMemo(
    () => formatBrewMethodLabels(coffee.brew_method_canonical_keys),
    [coffee.brew_method_canonical_keys]
  );

  const formattedPrice = useMemo(
    () =>
      coffee.best_normalized_250g
        ? formatPrice(coffee.best_normalized_250g).replace(/₹/g, "").trim()
        : null,
    [coffee.best_normalized_250g]
  );

  const ariaLabel = useMemo(
    () =>
      coffee.roaster_name
        ? `${coffee.name} by ${coffee.roaster_name} - Add your take`
        : `${coffee.name} - Add your take`,
    [coffee.name, coffee.roaster_name]
  );

  // Early returns (need roaster_slug for nested coffee detail URL)
  if (!coffee || !coffee.slug || !coffee.name || !coffee.roaster_slug) {
    return null;
  }

  const detailHref = coffeeDetailHref(coffee.roaster_slug, coffee.slug!);

  const handleTrackClick = () => {
    if (coffee.coffee_id && coffee.roaster_id) {
      trackCoffeeDiscovery(coffee.coffee_id, coffee.roaster_id, "browse", {
        resultCount: undefined,
        responseTime: undefined,
      });
    }
  };

  // Hero variant - large, interactive rating, spacious
  if (variant === "hero") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover",
          "h-full flex flex-col",
          "max-w-[420px] w-full mx-auto",
          "p-0"
        )}
        aria-label={ariaLabel}
      >
        <Link
          href={detailHref}
          onClick={handleTrackClick}
          className="flex-1 flex flex-col"
        >
          {/* Hero Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden image-hover-zoom transition-opacity duration-200 group-hover:opacity-90">
            <Image
              alt={coffee.name || "Coffee"}
              className="object-contain"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
              src={imageUrl}
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="flex-1 card-padding transition-opacity duration-200 group-hover:opacity-90">
            <Stack gap="3">
              {/* Coffee name - hero size */}
              <h3 className="text-title text-balance line-clamp-2">
                {coffee.name}
              </h3>

              {/* Roaster - quiet context */}
              {coffee.roaster_name && (
                <p className="text-body-muted font-medium">
                  {coffee.roaster_name}
                </p>
              )}

              {/* Metadata - roast indicator and brew badges */}
              {(roastLevel || brewMethodLabels.length > 0) && (
                <div className="flex flex-col gap-2">
                  {roastLevel && (
                    <RoastLevelIndicator
                      roastLevel={coffee.roast_level}
                      roastLevelRaw={coffee.roast_level_raw}
                      roastStyleRaw={coffee.roast_style_raw}
                    />
                  )}
                  {brewMethodLabels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {brewMethodLabels.map((method, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-overline"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Price - small, muted, secondary, at bottom before rating zone */}
              {formattedPrice && (
                <p className="text-caption mt-auto pt-2 text-right">
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
          entityName={coffee.name}
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
          "surface-1 rounded-lg card-hover",
          "h-full flex flex-col",
          "p-0"
        )}
        aria-label={ariaLabel}
      >
        <Link
          href={detailHref}
          onClick={handleTrackClick}
          className="flex-1 flex flex-col"
        >
          {/* Image - 3:4 aspect ratio */}
          <div className="relative aspect-[3/4] w-full overflow-hidden image-hover-zoom transition-opacity duration-200 group-hover:opacity-90">
            <Image
              alt={coffee.name || "Coffee"}
              className="object-contain"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={imageUrl}
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="flex-1 card-padding-compact transition-opacity duration-200 group-hover:opacity-90">
            <Stack gap="2">
              {/* Coffee name */}
              <h3 className="text-heading text-balance line-clamp-2">
                {coffee.name}
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
          entityName={coffee.name}
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
          "surface-1 rounded-lg card-hover",
          "h-[80px]",
          "p-0"
        )}
        aria-label={ariaLabel}
      >
        <Link
          href={detailHref}
          onClick={handleTrackClick}
          className="flex flex-row items-center gap-3 card-padding-compact h-full"
        >
          {/* Small image - fixed square */}
          <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded image-hover-zoom self-center transition-opacity duration-200 group-hover:opacity-90">
            <Image
              alt={coffee.name || "Coffee"}
              className="object-contain"
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
              <h3 className="text-body line-clamp-1">{coffee.name}</h3>

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
        "surface-1 rounded-lg card-hover",
        "h-full flex flex-col",
        "max-w-[300px] w-full",
        "p-0"
      )}
      aria-label={ariaLabel}
    >
      <Link
        href={detailHref}
        onClick={handleTrackClick}
        className="flex-1 flex flex-col"
      >
        {/* Image - 3:2 aspect ratio for tighter magazine tile */}
        <div className="relative aspect-[3/2] w-full overflow-hidden image-hover-zoom transition-opacity duration-200 group-hover:opacity-90">
          <Image
            alt={coffee.name || "Coffee"}
            className="object-contain"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            src={imageUrl}
            unoptimized
          />
        </div>

        {/* Content - strict hierarchy */}
        <div className="flex-1 card-padding-compact transition-opacity duration-200 group-hover:opacity-90">
          <Stack gap="2">
            {/* 1. Coffee name - 2 lines max */}
            <h3 className="text-heading text-balance line-clamp-2">
              {coffee.name}
            </h3>

            {/* 2. Roaster (muted) */}
            {coffee.roaster_name && (
              <p className="text-body-muted font-medium">
                {coffee.roaster_name}
              </p>
            )}

            {/* 3. Metadata - roast indicator and brew badges, limit to 2 items: roast + brew */}
            {(roastLevel || brewMethodLabels.length > 0) && (
              <div className="flex flex-col gap-2">
                {roastLevel && (
                  <RoastLevelIndicator
                    roastLevel={coffee.roast_level}
                    roastLevelRaw={coffee.roast_level_raw}
                    roastStyleRaw={coffee.roast_style_raw}
                  />
                )}
                {brewMethodLabels.slice(0, roastLevel ? 1 : 2).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {brewMethodLabels
                      .slice(0, roastLevel ? 1 : 2)
                      .map((method, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-overline"
                        >
                          {method}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Price (small, muted, secondary) */}
            {formattedPrice && (
              <p className="text-caption mt-auto pt-2 text-right">
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
        entityName={coffee.name}
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
