// src/components/cards/CoffeeCard.tsx
"use client";

import Image from "next/image";
import { useMemo, memo } from "react";
import { useRouter } from "next/navigation";
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
import { Stack } from "../primitives/stack";
import { useModal } from "@/components/providers/modal-provider";
import { QuickRating } from "@/components/reviews";
import { trackCoffeeDiscovery } from "@/lib/analytics/enhanced-tracking";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";

type CoffeeCardProps = {
  coffee: CoffeeSummary;
  variant?: "hero" | "default" | "compact" | "similar";
  userRating?: number | null;
  onRateClick?: (coffeeId: string, rating: number) => void;
  matchInfo?: {
    matchType: "flavor" | "style" | "origin" | "fallback";
    chips: string[]; // Max 3 labels to display
  };
};

type RatingFooterProps = {
  size?: "sm" | "md" | "lg";
  coffee: CoffeeSummary;
  userRating?: number | null;
  onOpenModal: () => void;
  onStarClick: (rating: number) => void;
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

  const beanCount = getBeanCount(roastLevelRaw || roastLevel);
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

function RatingFooter({
  size = "md",
  coffee,
  userRating,
  onOpenModal,
  onStarClick,
}: RatingFooterProps) {
  // Determine if coffee has overall rating (not 0, not null)
  const hasOverallRating = Boolean(coffee.rating_avg && coffee.rating_avg > 0);
  // Determine if user has rated (number > 0)
  const hasUserRating = typeof userRating === "number" && userRating > 0;

  // Rating to display in stars: user rating if exists, otherwise overall rating
  const starRating = hasUserRating ? userRating : coffee.rating_avg || 0;

  // Determine state and microcopy
  let microcopy: string;
  if (hasOverallRating) {
    // State A: Coffee has overall rating
    if (hasUserRating) {
      // A1: User has rated
      microcopy = `Your rating: ${userRating}`;
    } else {
      // A2: User hasn't rated
      microcopy = "Tried this? Rate it.";
    }
  } else {
    // State B: Coffee has NO overall rating
    if (hasUserRating) {
      // B1: User has rated (but no community avg)
      microcopy = `Your rating: ${userRating}`;
    } else {
      // B2: User hasn't rated, no community avg
      microcopy = "Be the first to rate.";
    }
  }

  // Rating display for left zone
  const ratingDisplay = hasOverallRating ? coffee.rating_avg!.toFixed(1) : "—";

  return (
    <div
      data-rating-zone
      onClick={(e) => {
        // Prevent card navigation when clicking footer
        e.stopPropagation();
        onOpenModal();
      }}
      className={cn(
        "mt-auto border-t border-border/40 bg-muted/20 cursor-pointer",
        "transition-transform duration-200 ease-out origin-bottom",
        "group-hover:scale-[1.02] group-hover:bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-between",
          "card-padding-compact"
        )}
      >
        {/* Left: Rating number block */}
        <div className="flex flex-col">
          <div className="text-title font-medium">{ratingDisplay}</div>
          <div className="text-label">Rating</div>
          {hasOverallRating && coffee.rating_count > 0 && (
            <div className="text-caption">({coffee.rating_count})</div>
          )}
        </div>

        {/* Right: Action block */}
        <div
          className="flex flex-col items-end gap-1"
          onClick={(e) => {
            // Prevent footer click when clicking stars
            e.stopPropagation();
          }}
        >
          <StarRating
            rating={starRating}
            size={size}
            interactive={true}
            showEmpty={true}
            onRate={onStarClick}
          />
          <div className="text-caption">{microcopy}</div>
        </div>
      </div>
    </div>
  );
}

function CoffeeCardComponent({
  coffee,
  variant = "default",
  userRating,
  onRateClick,
  matchInfo,
}: CoffeeCardProps) {
  const router = useRouter();
  const { openModal } = useModal();

  // Memoize expensive computations
  const imageUrl = useMemo(
    () => coffeeImagePresets.coffeeCard(coffee.image_url),
    [coffee.image_url]
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

  // Modal handlers
  const handleOpenRatingModal = (rating?: number) => {
    if (!coffee.coffee_id) return;

    openModal({
      type: "custom",
      component: QuickRating,
      props: {
        entityType: "coffee",
        entityId: coffee.coffee_id,
        initialRating: rating,
        onClose: () => {},
      },
    });
  };

  // Star click handler - passes rating to modal
  const handleStarClick = (rating: number) => {
    if (onRateClick && coffee.coffee_id) {
      // Legacy callback support
      onRateClick(coffee.coffee_id, rating);
    } else {
      handleOpenRatingModal(rating);
    }
  };

  // Card click handler - navigate to detail page
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking rating zone
    if ((e.target as HTMLElement).closest("[data-rating-zone]")) {
      return;
    }
    // Track analytics
    if (coffee.coffee_id && coffee.roaster_id) {
      trackCoffeeDiscovery(coffee.coffee_id, coffee.roaster_id, "browse", {
        resultCount: undefined,
        responseTime: undefined,
      });
    }
    // Navigate to nested coffee detail URL (slug is truthy from early return)
    router.push(coffeeDetailHref(coffee.roaster_slug, coffee.slug!));
  };

  // Hero variant - large, interactive rating, spacious
  if (variant === "hero") {
    return (
      <Card
        onClick={handleCardClick}
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover",
          "h-full flex flex-col",
          "max-w-[420px] w-full mx-auto",
          "p-0"
        )}
        aria-label={ariaLabel}
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

        {/* Bottom rating strip */}
        <RatingFooter
          size="lg"
          coffee={coffee}
          userRating={userRating}
          onOpenModal={() => handleOpenRatingModal()}
          onStarClick={handleStarClick}
        />
      </Card>
    );
  }

  // Similar variant - compact vertical card with match chips
  if (variant === "similar") {
    return (
      <Card
        onClick={handleCardClick}
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover",
          "h-full flex flex-col",
          "p-0"
        )}
        aria-label={ariaLabel}
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
      </Card>
    );
  }

  // Compact variant - dense, horizontal row card, no interactive rating
  if (variant === "compact") {
    return (
      <Card
        onClick={handleCardClick}
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover",
          "flex flex-row items-center gap-3 card-padding-compact",
          "h-[80px]"
        )}
        aria-label={ariaLabel}
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
      </Card>
    );
  }

  // Default variant - opinion-first hierarchy, magazine tile
  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "surface-1 rounded-lg card-hover",
        "h-full flex flex-col",
        "max-w-[300px] w-full",
        "p-0"
      )}
      aria-label={ariaLabel}
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
            <p className="text-body-muted font-medium">{coffee.roaster_name}</p>
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

      {/* Opinion-first Footer */}
      <RatingFooter
        size="md"
        coffee={coffee}
        userRating={userRating}
        onOpenModal={() => handleOpenRatingModal()}
        onStarClick={handleStarClick}
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
