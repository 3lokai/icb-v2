"use client";

import RoasterCard from "@/components/cards/RoasterCard";
import { RoasterCardSkeleton } from "@/components/cards/RoasterCardSkeleton";
import type { RoasterSummary } from "@/types/roaster-types";

const SKELETON_COUNT = 6;

type RoasterGridProps = {
  items: RoasterSummary[];
  isLoading?: boolean;
};

/**
 * Roaster Grid Component (Phase 1 - Minimal)
 * Renders a grid of roaster cards.
 * Shows skeleton grid when loading with no items to prevent CLS.
 */
export function RoasterGrid({ items, isLoading }: RoasterGridProps) {
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
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No roasters found.</p>
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
