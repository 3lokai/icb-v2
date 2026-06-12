"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Icon } from "./Icon";

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
 * Opinion-first design: calm, uses accent color through the Icon component
 *
 * Read-only mode renders fractional (half-star) fill. Interactive mode renders a
 * keyboard-operable `radiogroup` of star buttons (arrow keys move + select, Home/End
 * jump to 1/5, Enter/Space confirm) so a rating can be submitted without a pointer.
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
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const displayRating =
    interactive && hoverRating !== null ? hoverRating : rating;

  // Don't show stars if rating is 0 and showEmpty is false
  if (rating === 0 && !showEmpty && !interactive) {
    return null;
  }

  // ---- Interactive (radiogroup) path -------------------------------------
  if (interactive) {
    // Whole-star value the radiogroup treats as "selected" (1-5).
    const selectedValue = Math.round(rating);
    // Roving tabindex anchor: the selected star, or the first star when unrated.
    const tabbableValue =
      selectedValue >= 1 && selectedValue <= 5 ? selectedValue : 1;

    const selectAndFocus = (value: number) => {
      const next = Math.min(Math.max(value, 1), 5);
      starRefs.current[next - 1]?.focus();
      onRate?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          selectAndFocus(starValue + 1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          selectAndFocus(starValue - 1);
          break;
        case "Home":
          e.preventDefault();
          selectAndFocus(1);
          break;
        case "End":
          e.preventDefault();
          selectAndFocus(5);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onRate?.(starValue);
          break;
        default:
          break;
      }
    };

    return (
      <div
        className="flex items-center gap-1.5"
        onMouseLeave={() => setHoverRating(null)}
      >
        <div
          role="radiogroup"
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
            const isChecked = selectedValue === starValue;

            return (
              <button
                key={index}
                ref={(el) => {
                  starRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isChecked}
                aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"}`}
                tabIndex={starValue === tabbableValue ? 0 : -1}
                className={cn(
                  "relative cursor-pointer rounded-sm transition-transform duration-150",
                  "hover:scale-110 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                )}
                onClick={() => onRate?.(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onKeyDown={(e) => handleKeyDown(e, starValue)}
              >
                <Icon
                  name={isHalf ? "StarHalf" : "Star"}
                  size={sizeValues[size]}
                  color={isEmpty ? "muted" : "accent"}
                  aria-hidden
                  className="transition-colors duration-300"
                />
              </button>
            );
          })}
        </div>

        {count !== undefined && count > 0 && (
          <span className="text-caption text-muted-foreground">({count})</span>
        )}
      </div>
    );
  }

  // ---- Read-only display path (unchanged) --------------------------------
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1);

          const isHalf = fillPercentage > 0.25 && fillPercentage < 0.75;
          const isEmpty = fillPercentage <= 0.25;

          return (
            <div key={index} className="relative">
              <Icon
                name={isHalf ? "StarHalf" : "Star"}
                size={sizeValues[size]}
                color={isEmpty ? "muted" : "accent"}
                className="transition-colors duration-300"
              />
            </div>
          );
        })}
      </div>

      {/* Review count */}
      {count !== undefined && count > 0 && (
        <span className="text-caption text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
