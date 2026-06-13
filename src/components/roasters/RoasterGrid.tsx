"use client";

import RoasterCard from "@/components/cards/RoasterCard";
import { RoasterCardSkeleton } from "@/components/cards/RoasterCardSkeleton";
import { Button } from "@/components/ui/button";
import type { RoasterSummary } from "@/types/roaster-types";

const SKELETON_COUNT = 6;

type RoasterGridProps = {
  items: RoasterSummary[];
  isLoading?: boolean;
  /** When true, an empty result is from active filters — offer a way back. */
  hasActiveFilters?: boolean;
  /** Clears all filters (wired to the directory's resetFilters). */
  onClearFilters?: () => void;
};

/**
 * Roaster Grid Component (Phase 1 - Minimal)
 * Renders a grid of roaster cards.
 * Shows skeleton grid when loading with no items to prevent CLS.
 */
export function RoasterGrid({
  items,
  isLoading,
  hasActiveFilters,
  onClearFilters,
}: RoasterGridProps) {
  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <RoasterCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-body text-muted-foreground">
          {hasActiveFilters
            ? "No roasters match these filters."
            : "No roasters found."}
        </p>
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((roaster) => (
        <RoasterCard key={roaster.slug || roaster.id} roaster={roaster} />
      ))}
    </div>
  );
}
