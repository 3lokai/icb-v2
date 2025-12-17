"use client";

import CoffeeCard from "@/components/cards/CoffeeCard";
import type { CoffeeSummary } from "@/types/coffee-types";

interface CoffeeGridProps {
  items: CoffeeSummary[];
  isLoading?: boolean;
}

/**
 * Coffee Grid Component (Phase 1 - Minimal)
 * Renders a grid of coffee cards
 */
export function CoffeeGrid({ items, isLoading }: CoffeeGridProps) {
  if (items.length === 0 && !isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No coffees found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((coffee) => (
        <CoffeeCard coffee={coffee} key={coffee.slug || coffee.coffee_id} />
      ))}
    </div>
  );
}
