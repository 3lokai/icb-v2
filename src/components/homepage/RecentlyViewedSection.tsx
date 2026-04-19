"use client";

import CoffeeCard from "@/components/cards/CoffeeCard";
import { Icon } from "@/components/common/Icon";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { useRecentlyViewedCoffees } from "@/hooks/use-recently-viewed-coffees";
import type { RecentlyViewedCoffeeItem } from "@/lib/data/fetch-recently-viewed-coffees";
import type { CoffeeSummary } from "@/types/coffee-types";

type RecentlyViewedSectionProps = {
  initialCoffees?: RecentlyViewedCoffeeItem[];
};

const sectionSurfaceClassName =
  "bg-background relative overflow-hidden border-y border-border/40";

function mapRecentlyViewedCoffeeToSummary(coffee: {
  coffeeId: string;
  name: string;
  coffeeSlug: string;
  roasterId: string;
  roasterSlug: string;
  roasterName: string;
  imageUrl: string | null;
}): CoffeeSummary {
  return {
    coffee_id: coffee.coffeeId,
    slug: coffee.coffeeSlug,
    name: coffee.name,
    roaster_id: coffee.roasterId,
    status: null,
    process: null,
    process_raw: null,
    roast_level: null,
    roast_level_raw: null,
    roast_style_raw: null,
    direct_buy_url: null,
    has_250g_bool: null,
    has_sensory: null,
    in_stock_count: null,
    min_price_in_stock: null,
    best_variant_id: null,
    best_normalized_250g: null,
    weights_available: null,
    sensory_public: null,
    sensory_updated_at: null,
    decaf: false,
    is_limited: false,
    bean_species: null,
    rating_avg: null,
    rating_count: 0,
    tags: null,
    works_with_milk: null,
    roaster_slug: coffee.roasterSlug,
    roaster_name: coffee.roasterName,
    hq_city: null,
    hq_state: null,
    hq_country: null,
    website: null,
    image_url: coffee.imageUrl,
    flavor_keys: null,
    brew_method_canonical_keys: null,
  };
}

export default function RecentlyViewedSection({
  initialCoffees,
}: RecentlyViewedSectionProps) {
  const {
    data: coffees,
    isLoading,
    isError,
  } = useRecentlyViewedCoffees(12, initialCoffees);

  if (isLoading) {
    return (
      <Section spacing="loose" className={sectionSurfaceClassName}>
        <div className="relative z-10 flex min-h-[200px] items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Section>
    );
  }

  if (isError || !coffees?.length) {
    return null;
  }

  return (
    <Section spacing="loose" className={sectionSurfaceClassName}>
      <div className="absolute -left-24 -top-24 opacity-[0.04] select-none pointer-events-none">
        <Icon name="Eye" size={320} strokeWidth={1} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stack gap="6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <span className="text-overline text-accent font-semibold tracking-[0.2em]">
                  CONTINUE
                </span>
              </div>
              <h2 className="text-title text-balance leading-tight">
                Recently{" "}
                <span className="font-serif italic text-accent">viewed.</span>
              </h2>
              <p className="mt-2 max-w-xl text-body text-muted-foreground">
                Pick up where you left off—based on coffees you opened on this
                device.
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {coffees.map((c) => {
              const summary = mapRecentlyViewedCoffeeToSummary(c);
              return (
                <li key={c.coffeeId}>
                  <CoffeeCard coffee={summary} variant="compact" />
                </li>
              );
            })}
          </ul>
        </Stack>
      </div>
    </Section>
  );
}
