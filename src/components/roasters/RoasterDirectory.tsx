"use client";

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
import { RoasterFilterBar } from "./RoasterFilterBar";
import { RoasterFilterSidebar } from "./RoasterFilterSidebar";
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
  const { filters, page, sort, limit } = useRoasterFilters();

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
  const { data, isFetching, isError } = useRoasters(
    { filters, page, limit, sort },
    { initialData }
  );

  // Render minimal UI (Phase 1)
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="py-12 text-center">
          <h2 className="mb-4 text-title">Error loading roasters</h2>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const items = data?.items || [];

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
            Explore India&apos;s{" "}
            <span className="text-accent italic">Roaster Network</span>
          </h2>

          <p className="max-w-md text-pretty text-body-large text-muted-foreground leading-relaxed">
            Discover specialty coffee roasters from across the country. Filter
            by location, search by name, or browse to find your next favorite
            roaster.
          </p>
        </Stack>
      </div>

      {/* Results Count - always reserve space to prevent CLS when data loads */}
      <div className="mb-6 min-h-[1.5rem] flex items-center justify-center text-center">
        {data ? (
          <p className="text-muted-foreground text-caption italic">
            Showing {items.length} of {data.total} roasters
          </p>
        ) : (
          <p className="text-muted-foreground text-caption italic">Loading…</p>
        )}
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 md:hidden">
        <Button
          aria-label="Open filters"
          className="w-full justify-start h-12"
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

      {/* Filter Bar */}
      <RoasterFilterBar />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        filterMeta={filterMeta}
        onOpenChange={setIsDrawerOpen}
        open={isDrawerOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* Filter Sidebar */}
        <RoasterFilterSidebar filterMeta={filterMeta} />

        {/* Roaster Grid (skeletons shown by RoasterGrid when loading) */}
        <div className="flex-1">
          <Stack gap="8">
            <RoasterGrid isLoading={isFetching} items={items} />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <RoasterPagination totalPages={data.totalPages} />
            )}
          </Stack>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 border-t border-border/40 pt-16">
        <RoasterDirectoryFAQ />
      </div>
    </div>
  );
}
