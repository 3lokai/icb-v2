"use client";

import Link from "next/link";
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
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";

// ============================================================================
// TYPES
// ============================================================================

type CollectionGridProps = {
  tier?: CollectionTier;
  showFeatured?: boolean; // Show featured collection separately
  maxItems?: number; // Limit displayed items (default: 4)
  coffeeCountMap?: Record<string, number>; // Map of collection ID to coffee count
  cardVariant?: "default" | "small"; // Card variant (default: "default")
  // Header props
  overline?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  mobileDecorativeText?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function CollectionGrid({
  tier,
  showFeatured = false,
  maxItems = 4,
  coffeeCountMap = {},
  cardVariant = "default",
  overline = "Discover By Style",
  title = "Curated",
  titleAccent = "Collections.",
  description = "Hand-picked coffee selections to match your taste and brewing style, from bold espressos to delicate single origins.",
  ctaText = "Browse All Coffees",
  ctaHref = "/coffees",
  mobileDecorativeText = "Curated",
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

  // Get featured collection if requested
  const featuredCollection = showFeatured ? getFeaturedCollection() : undefined;

  // Filter out featured from regular grid if showing featured
  const gridCollections = featuredCollection
    ? collections.filter((c) => c.id !== featuredCollection.id)
    : collections;

  return (
    <Section spacing="default">
      {/* Header Section - 12 column grid */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          {/* Left: Text content (8 columns) */}
          <div className="md:col-span-8">
            <Stack gap="6">
              {/* Overline with decorative line */}
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  {overline}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                {title}{" "}
                <span className="text-accent italic">{titleAccent}</span>
              </h2>

              {/* Description */}
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Stack>
          </div>

          {/* Right: CTA Button (4 columns) */}
          <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
            <Link className="hidden md:block" href={ctaHref}>
              <Button className="group" variant="outline">
                {ctaText}
                <Icon
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  name="ArrowRight"
                />
              </Button>
            </Link>
            {/* Mobile decorative element */}
            <div className="flex md:hidden items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              {mobileDecorativeText}
              <span className="h-1 w-1 rounded-full bg-accent/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      {featuredCollection && (
        <div className="mb-6 w-full">
          <CollectionCard
            collection={featuredCollection}
            variant={cardVariant}
            coffeeCount={coffeeCountMap[featuredCollection.id]}
          />
        </div>
      )}

      {/* Regular Grid */}
      {gridCollections.length > 0 && (
        <div
          className={
            cardVariant === "small"
              ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          {gridCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              variant={cardVariant}
              coffeeCount={coffeeCountMap[collection.id]}
            />
          ))}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="mt-8 text-center md:hidden">
        <Link href={ctaHref}>
          <Button className="group w-full sm:w-auto" variant="outline">
            {ctaText}
            <Icon
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              name="ArrowRight"
            />
          </Button>
        </Link>
      </div>
    </Section>
  );
}
