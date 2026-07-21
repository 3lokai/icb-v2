"use client";

import { Accent } from "@/components/primitives/accent";
import { ArrowClockwiseIcon, FunnelIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { useMemo, useState } from "react";
import { RoasterDirectoryFAQ } from "@/components/faqs/RoasterDirectoryFAQs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/primitives/stack";
import { useRoasters } from "@/hooks/use-roasters";
import { useRoasterFilters } from "@/hooks/use-roaster-filters";
import type {
  RoasterFilterMeta,
  RoasterFilters,
  RoasterListResponse,
  RoasterSort,
} from "@/types/roaster-types";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { RoasterFacetedFilterBar } from "./RoasterFacetedFilterBar";
import { RoasterGrid } from "./RoasterGrid";
import { RoasterPagination } from "./RoasterPagination";

type RoasterDirectoryProps = {
  initialFilters: RoasterFilters;
  initialData: RoasterListResponse;
  initialPage: number;
  initialSort: RoasterSort;
  filterMeta: RoasterFilterMeta;
};

/**
 * Roaster Directory Component (Client Component)
 * URL is the single source of truth for filters
 */
export function RoasterDirectory({
  initialData,
  filterMeta,
}: RoasterDirectoryProps) {
  const { filters, page, sort, limit, resetFilters } = useRoasterFilters();

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return (
      (filters.active_only ? 1 : 0) +
      (filters.cities?.length ?? 0) +
      (filters.states?.length ?? 0) +
      (filters.countries?.length ?? 0) +
      (filters.q ? 1 : 0)
    );
  }, [filters]);

  // Fetch data using TanStack Query
  const { data, isFetching, isError, refetch } = useRoasters(
    { filters, page, limit, sort },
    { initialData }
  );

  if (isError) {
    return (
      <div className="w-full py-16 text-center">
        <h2 className="mb-3 text-title">Couldn&apos;t load roasters</h2>
        <p className="mx-auto mb-6 max-w-md text-body text-muted-foreground">
          Something went wrong fetching the directory. Check your connection and
          try again.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <Icon icon={ArrowClockwiseIcon} className="mr-2" size={16} />
          Try again
        </Button>
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="w-full">
      {/* Section heading — single anchor above the directory (hero carries the intro) */}
      <h2 className="mb-8 text-title text-balance leading-[1.1] tracking-tight">
        Explore India&apos;s <Accent>Roaster Network</Accent>
      </h2>

      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 md:hidden">
        <Button
          aria-label="Open filters"
          className="w-full justify-start h-12"
          onClick={() => setIsDrawerOpen(true)}
          variant="outline"
        >
          <Icon className="mr-2" icon={FunnelIcon} size={16} />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Top-aligned faceted filter bar (desktop) */}
      <RoasterFacetedFilterBar filterMeta={filterMeta} />

      {/* Results Count - always reserve space to prevent CLS when data loads */}
      <div className="mt-6 min-h-[1.5rem] flex items-center justify-center text-center">
        {data ? (
          <p className="text-muted-foreground text-caption italic">
            Showing {items.length} of {data.total} roasters
          </p>
        ) : (
          <p className="text-muted-foreground text-caption italic">Loading…</p>
        )}
      </div>

      {/* Mobile Filter Drawer (full filter UI on small screens) */}
      <MobileFilterDrawer
        filterMeta={filterMeta}
        onOpenChange={setIsDrawerOpen}
        open={isDrawerOpen}
      />

      {/* Roaster Grid — full width (skeletons shown by RoasterGrid when loading) */}
      <div className="mt-8">
        <Stack gap="8">
          <RoasterGrid
            isLoading={isFetching}
            items={items}
            hasActiveFilters={activeFilterCount > 0}
            onClearFilters={resetFilters}
          />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <RoasterPagination totalPages={data.totalPages} />
          )}
        </Stack>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 border-t border-border/40 pt-16">
        <RoasterDirectoryFAQ />
      </div>
    </div>
  );
}
