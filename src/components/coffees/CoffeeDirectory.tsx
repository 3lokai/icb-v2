"use client";

import { Icon } from "@/components/common/Icon";
import { useMemo, useState, memo } from "react";
import { CoffeeDirectoryFAQ } from "@/components/faqs/CoffeeDirectoryFAQs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCoffees } from "@/hooks/use-coffees";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";
import { Stack } from "@/components/primitives/stack";
import type {
  CoffeeFilterMeta,
  CoffeeFilters,
  CoffeeListResponse,
  CoffeeSort,
} from "@/types/coffee-types";
import { CoffeeFacetedFilterBar } from "./CoffeeFacetedFilterBar";
import { CoffeeGrid } from "./CoffeeGrid";
import { CoffeePagination } from "./CoffeePagination";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

type CoffeeDirectoryProps = {
  initialFilters: CoffeeFilters;
  initialData: CoffeeListResponse;
  initialPage: number;
  initialSort: CoffeeSort;
  filterMeta: CoffeeFilterMeta;
};

/**
 * Coffee Directory Component (Client Component)
 * URL is the single source of truth for filters
 * Optimized with memoization to reduce re-renders
 */
function CoffeeDirectoryComponent({
  initialData,
  filterMeta,
}: CoffeeDirectoryProps) {
  const { filters, page, sort, limit } = useCoffeeFilters();

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate active filter count (for mobile filter badge)
  const activeFilterCount = useMemo(() => {
    return (
      (filters.in_stock_only ? 1 : 0) +
      (filters.has_250g_only ? 1 : 0) +
      (filters.max_price ? 1 : 0) +
      (filters.min_price ? 1 : 0) +
      (filters.roast_levels?.length ?? 0) +
      (filters.bean_species?.length ?? 0) +
      (filters.processes?.length ?? 0) +
      (filters.status?.length ?? 0) +
      (filters.flavor_keys?.length ?? 0) +
      (filters.canon_flavor_slugs?.length ?? 0) +
      (filters.canon_flavor_node_ids?.length ?? 0) + // Backward compat
      (filters.roaster_slugs?.length ?? 0) +
      (filters.roaster_ids?.length ?? 0) + // Backward compat
      (filters.region_slugs?.length ?? 0) +
      (filters.region_ids?.length ?? 0) + // Backward compat
      (filters.estate_keys?.length ?? 0) +
      (filters.estate_ids?.length ?? 0) + // Backward compat
      (filters.brew_method_ids?.length ?? 0) +
      (filters.q ? 1 : 0)
    );
  }, [filters]);

  // Fetch data using TanStack Query
  const { data, isFetching, isError } = useCoffees(
    { filters, page, limit, sort },
    { initialData }
  );

  // Memoize items to prevent unnecessary re-renders
  const items = useMemo(() => data?.items || [], [data?.items]);

  // Render minimal UI (Phase 1)
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="py-12 text-center">
          <h2 className="mb-4 text-title">Error loading coffees</h2>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-16 md:pt-24">
      {/* Section Header */}
      <div className="mb-12">
        <Stack gap="6">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              The Directory
            </span>
          </div>

          <h2 className="text-title text-balance leading-[1.1] tracking-tight">
            Explore the full{" "}
            <span className="text-accent italic">Coffee Catalogue</span>
          </h2>

          <p className="max-w-md text-pretty text-body-large text-muted-foreground leading-relaxed">
            Filter by roast level, brew method, processing, or flavour to narrow
            things down — or simply browse and compare at your own pace.
          </p>
        </Stack>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 md:hidden">
        <Button
          aria-label="Open filters"
          className="w-full justify-start"
          onClick={() => setIsDrawerOpen(true)}
          variant="outline"
        >
          <Icon className="mr-2" name="Funnel" size={16} />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Top-aligned faceted filter bar (search + primary filters + Refine panel) */}
      <CoffeeFacetedFilterBar filterMeta={filterMeta} isVisible={true} />

      {/* Results Count - always reserve space to prevent CLS when data loads */}
      <div className="mt-6 min-h-[1.5rem] flex items-center justify-center text-center">
        {data ? (
          <p className="text-muted-foreground">
            Showing {items.length} of {data.total} coffees
          </p>
        ) : (
          <p className="text-muted-foreground">Loading…</p>
        )}
      </div>

      {/* Mobile Filter Drawer (fallback for full filter UI on small screens) */}
      <MobileFilterDrawer
        filterMeta={filterMeta}
        onOpenChange={setIsDrawerOpen}
        open={isDrawerOpen}
      />

      {/* Main Content - no sidebar, full width grid (skeletons shown by CoffeeGrid when loading) */}
      <div className="mt-8">
        <Stack gap="8">
          <CoffeeGrid isLoading={isFetching} items={items} />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <CoffeePagination totalPages={data.totalPages} />
          )}
        </Stack>
      </div>

      {/* FAQ Section */}
      <CoffeeDirectoryFAQ />
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const CoffeeDirectory = memo(CoffeeDirectoryComponent);
CoffeeDirectory.displayName = "CoffeeDirectory";
