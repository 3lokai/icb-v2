"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Icon } from "./Icon";

type StarRatingProps = {
  rating: number; // 0-5, supports decimal for half stars
  count?: number; // review count to show alongside
  size?: "sm" | "md" | "lg";
  interactive?: boolean; // enable hover preview and click
  onRate?: (rating: number) => void;
  showEmpty?: boolean; // show empty stars even if rating is 0
};

const sizeValues = {
  sm: 12,
  md: 16,
  lg: 20,
};

/**
 * StarRating - Display or interactive star rating component
 * Opinion-first design: calm, uses accent color through the Icon component
 */
export function StarRating({
  rating,
  count,
  size = "md",
  interactive = false,
  onRate,
  showEmpty = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating =
    interactive && hoverRating !== null ? hoverRating : rating;

  // Don't show stars if rating is 0 and showEmpty is false
  if (rating === 0 && !showEmpty && !interactive) {
    return null;
  }

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRate) {
      onRate(starIndex + 1);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className="flex items-center gap-1.5" onMouseLeave={handleMouseLeave}>
      <div
        className={cn(
          "flex items-center gap-0.5",
          interactive && "cursor-pointer"
        )}
      >
        {[...Array(5)].map((_, index) => {
          const fillPercentage = Math.min(
            Math.max(displayRating - index, 0),
            1
          );

          const isHalf = fillPercentage > 0.25 && fillPercentage < 0.75;
          const isEmpty = fillPercentage <= 0.25;

          return (
            <div
              key={index}
              className={cn(
                "relative transition-transform duration-150",
                interactive && "hover:scale-110"
              )}
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
            >
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
