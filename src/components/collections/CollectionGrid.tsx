"use client";

import { CollectionCard } from "@/components/cards/CollectionCard";
import type {
  CoffeeCollection,
  CollectionTier,
} from "@/lib/collections/coffee-collections";
import {
  getCoreCollections,
  getCollectionsByTier,
  getFeaturedCollection,
} from "@/lib/collections/coffee-collections";

// ============================================================================
// TYPES
// ============================================================================

type CollectionGridProps = {
  tier?: CollectionTier;
  showHero?: boolean; // Show featured collection as hero
  maxItems?: number; // Limit displayed items
  coffeeCountMap?: Record<string, number>; // Map of collection ID to coffee count
};

// ============================================================================
// COMPONENT
// ============================================================================

export function CollectionGrid({
  tier,
  showHero = false,
  maxItems,
  coffeeCountMap = {},
}: CollectionGridProps) {
  // Get collections
  let collections: CoffeeCollection[];
  if (tier) {
    collections = getCollectionsByTier(tier);
  } else {
    collections = getCoreCollections();
  }

  // Apply max items limit
  if (maxItems) {
    collections = collections.slice(0, maxItems);
  }

  // Get hero collection if requested
  const heroCollection = showHero ? getFeaturedCollection() : undefined;

  // Filter out hero from regular grid if showing hero
  const gridCollections = heroCollection
    ? collections.filter((c) => c.id !== heroCollection.id)
    : collections;

  return (
    <div className="space-y-5">
      {/* Hero Collection */}
      {heroCollection && (
        <div className="w-full">
          <CollectionCard
            collection={heroCollection}
            variant="hero"
            coffeeCount={coffeeCountMap[heroCollection.id]}
          />
        </div>
      )}

      {/* Regular Grid */}
      {gridCollections.length > 0 && (
        <div
          className="grid gap-5
            grid-cols-1 
            md:grid-cols-2 
            lg:grid-cols-3
          "
        >
          {gridCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              variant="default"
              coffeeCount={coffeeCountMap[collection.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
