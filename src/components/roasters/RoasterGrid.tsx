"use client";

import RoasterCard from "@/components/cards/RoasterCard";
import type { RoasterSummary } from "@/types/roaster-types";

type RoasterGridProps = {
  items: RoasterSummary[];
  isLoading?: boolean;
};

/**
 * Roaster Grid Component (Phase 1 - Minimal)
 * Renders a grid of roaster cards
 */
export function RoasterGrid({ items, isLoading }: RoasterGridProps) {
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
