"use client";

import { useMemo, memo } from "react";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";
import type { CoffeeSummary } from "@/types/coffee-types";

interface CoffeeGridProps {
  items: CoffeeSummary[];
  isLoading?: boolean;
}

const SKELETON_COUNT = 8;

/**
 * Coffee Grid Component (Phase 1 - Minimal)
 * Renders a grid of coffee cards
 * Optimized with memoization to reduce re-renders
 * Shows skeleton grid when loading with no items to prevent CLS
 */
function CoffeeGridComponent({ items, isLoading }: CoffeeGridProps) {
  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(() => {
    if (isLoading && items.length === 0) {
      return Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <CoffeeCardSkeleton key={i} variant="default" />
      ));
    }

    if (items.length === 0 && !isLoading) {
      return (
        <div className="py-12 text-center col-span-full">
          <p className="text-muted-foreground">No coffees found.</p>
        </div>
      );
    }

    return items.map((coffee, index) => (
      <CoffeeCard
        coffee={coffee}
        key={coffee.coffee_id || coffee.slug || `coffee-${index}`}
      />
    ));
  }, [items, isLoading]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {gridItems}
    </div>
  );
}

// Memoize the component to prevent re-renders when parent updates
export const CoffeeGrid = memo(CoffeeGridComponent);
CoffeeGrid.displayName = "CoffeeGrid";
