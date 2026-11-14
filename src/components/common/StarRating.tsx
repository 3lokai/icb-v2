"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { StarHalfIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "./Icon";
import { nextRatingFocus } from "@/lib/utils/rating-keyboard";

type StarRatingProps = {
  rating: number; // 0-5, supports decimal for half stars
  count?: number; // review count to show alongside
  size?: "sm" | "md" | "lg";
  interactive?: boolean; // enable hover preview and click
  onRate?: (rating: number) => void;
  showEmpty?: boolean; // show empty stars even if rating is 0
  /** Accessible label for the interactive radiogroup, e.g. "Rate Monsoon Malabar". */
  ariaLabel?: string;
};

const sizeValues = {
  sm: 12,
  md: 16,
  lg: 20,
};

/**
 * StarRating - Display or interactive star rating component
 * Filled stars use the `rating` token; empty stars are muted outlines.
 *
 * Read-only mode renders fractional (half-star) fill. Interactive mode renders a
 * keyboard-operable group of star action buttons: arrows/Home/End move focus
 * without activating, and native Enter/Space or click opens the rating form.
 * A group (not radiogroup) is intentional: these are modal launchers,
 * not radio choices whose selection should change on arrow navigation.
 */
export function StarRating({
  rating,
  count,
  size = "md",
  interactive = false,
  onRate,
  showEmpty = false,
  ariaLabel,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [focusedValue, setFocusedValue] = useState<number | null>(null);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const displayRating =
    interactive && hoverRating !== null ? hoverRating : rating;

  // Don't show stars if rating is 0 and showEmpty is false
  if (rating === 0 && !showEmpty && !interactive) {
    return null;
  }

  // ---- Interactive rating actions ----------------------------------------
  if (interactive) {
    // Preserve the former initial tab stop close to the displayed rating,
    // but keep arrow navigation independent from modal activation.
    const initialTabStop = Math.min(Math.max(Math.round(rating), 1), 5);
    const tabbableValue = focusedValue ?? initialTabStop;

    const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
      const next = nextRatingFocus(e.key, starValue);
      if (next === null) return; // Native Enter/Space button clicks activate once.
      e.preventDefault();
      setFocusedValue(next);
      starRefs.current[next - 1]?.focus();
    };

    return (
      <div
        className="flex items-center gap-2"
        onMouseLeave={() => setHoverRating(null)}
      >
        <div
          role="group"
          aria-label={ariaLabel ?? "Rate"}
          className="flex items-center gap-0.5"
        >
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            const fillPercentage = Math.min(
              Math.max(displayRating - index, 0),
              1
            );
            const isHalf = fillPercentage > 0.25 && fillPercentage < 0.75;
            const isEmpty = fillPercentage <= 0.25;

            return (
              <button
                key={index}
                ref={(el) => {
                  starRefs.current[index] = el;
                }}
                type="button"
                aria-label={`Rate ${starValue} ${starValue === 1 ? "star" : "stars"}`}
                tabIndex={starValue === tabbableValue ? 0 : -1}
                className={cn(
                  "relative cursor-pointer rounded-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                )}
                onClick={() => onRate?.(starValue)}
                onFocus={() => setFocusedValue(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onKeyDown={(e) => handleKeyDown(e, starValue)}
              >
                <Icon
                  icon={isHalf ? StarHalfIcon : StarIcon}
                  size={sizeValues[size]}
                  color={isEmpty ? "muted" : "rating"}
                  weight={isEmpty ? "regular" : "fill"}
                  aria-hidden
                  className="transition-colors motion-reduce:transition-none"
                />
              </button>
            );
          })}
        </div>

        {count !== undefined && count > 0 && (
          <span className="text-ui-meta">({count})</span>
        )}
      </div>
    );
  }

  // ---- Read-only display path (unchanged) --------------------------------
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1);

          const isHalf = fillPercentage > 0.25 && fillPercentage < 0.75;
          const isEmpty = fillPercentage <= 0.25;

          return (
            <div key={index} className="relative">
              <Icon
                icon={isHalf ? StarHalfIcon : StarIcon}
                size={sizeValues[size]}
                color={isEmpty ? "muted" : "rating"}
                weight={isEmpty ? "regular" : "fill"}
                className="transition-colors motion-reduce:transition-none"
              />
            </div>
          );
        })}
      </div>

      {/* Review count */}
      {count !== undefined && count > 0 && (
        <span className="text-ui-meta">({count})</span>
      )}
    </div>
  );
}
