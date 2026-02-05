"use client";

import Link from "next/link";
import { CollectionCard } from "@/components/cards/CollectionCard";
import type { CoffeeCollection } from "@/lib/collections/coffee-collections";
import {
  getCoreCollections,
  getCollectionsByTier,
  getFeaturedCollection,
} from "@/lib/collections/coffee-collections";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import {
  type HomeCollectionGridProps,
  filterOptions,
} from "./homeCollectionGridShared";

// Same layout as HomeCollectionGrid but no Motion — used as placeholder until in view.
export function HomeCollectionGridStatic({
  tier = "core",
  showFeatured = false,
  maxItems = 4,
  coffeeCountMap = {},
  className,
  overline = "Discover By Style",
  title = "How do you like your",
  titleAccent = "Coffee?",
  description = "Common ways people explore Indian coffees — by flavour, brewing style, and how they like to drink them.",
}: HomeCollectionGridProps) {
  let collections: CoffeeCollection[];
  if (tier) {
    collections = getCollectionsByTier(tier);
  } else {
    collections = getCoreCollections();
  }

  if (maxItems) {
    collections = collections.slice(0, maxItems);
  }

  const featuredCollection = showFeatured ? getFeaturedCollection() : undefined;
  const gridCollections = featuredCollection
    ? collections.filter((c) => c.id !== featuredCollection.id)
    : collections;

  const columns: CoffeeCollection[][] = [[], [], [], []];
  gridCollections.forEach((item, index) => {
    columns[index % 4].push(item);
  });

  return (
    <Section spacing="default" className={cn("overflow-hidden", className)}>
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  {overline}
                </span>
              </div>

              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                {title}{" "}
                <span className="text-accent italic">{titleAccent}</span>
              </h2>

              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Stack>
          </div>
        </div>
      </div>

      {featuredCollection && (
        <div className="mb-6 w-full">
          <CollectionCard
            collection={featuredCollection}
            variant="default"
            coffeeCount={coffeeCountMap[featuredCollection.id]}
          />
        </div>
      )}

      <div className="overflow-hidden lg:pb-[200px] lg:-mb-[200px] pt-4 -mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((colItems, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className={cn(
                "flex flex-col gap-6",
                (colIndex === 1 || colIndex === 3) && "lg:mt-24"
              )}
            >
              {colItems.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  variant="default"
                  coffeeCount={coffeeCountMap[collection.id]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-0 pt-4 border-t border-border/40">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex-none">
            <span className="text-caption font-medium text-muted-foreground uppercase tracking-widest">
              Prefer to search directly?
            </span>
          </div>

          <div className="flex-1 flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory mask-linear-fade">
            {filterOptions.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                className="group relative flex-none snap-center"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300",
                    "bg-muted/30 hover:bg-muted/80 border border-transparent hover:border-border/40",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon
                    name={option.icon}
                    size={16}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="text-caption font-medium whitespace-nowrap">
                    {option.label.replace("By ", "")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
