"use client";

import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { useMemo, useState } from "react";
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
import { CoffeeFilterBar } from "./CoffeeFilterBar";
import { CoffeeFilterSidebar } from "./CoffeeFilterSidebar";
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
 */
export function CoffeeDirectory({
  initialData,
  filterMeta,
}: CoffeeDirectoryProps) {
  const { filters, page, sort, limit } = useCoffeeFilters();

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return (
      (filters.in_stock_only ? 1 : 0) +
      (filters.has_250g_only ? 1 : 0) +
      (filters.max_price ? 1 : 0) +
      (filters.roast_levels?.length ?? 0) +
      (filters.processes?.length ?? 0) +
      (filters.status?.length ?? 0) +
      (filters.flavor_keys?.length ?? 0) +
      (filters.roaster_ids?.length ?? 0) +
      (filters.region_ids?.length ?? 0) +
      (filters.estate_ids?.length ?? 0) +
      (filters.brew_method_ids?.length ?? 0) +
      (filters.q ? 1 : 0)
    );
  }, [filters]);

  // Fetch data using TanStack Query
  const { data, isFetching, isError } = useCoffees(
    { filters, page, limit, sort },
    initialData
  );

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

  // For Phase 1, pass CoffeeSummary directly (mapping will be used in Phase 2)
  const items = data?.items || [];

  return (
    <>
      <PageHeader
        backgroundImage="/images/hero-coffees.avif"
        backgroundImageAlt="Coffee beans background"
        description="Discover over hundreds of specialty coffee beans from roasters across India. Verified data, verified roasters, verified taste."
        overline="Specialty Coffee Directory"
        rightSideContent={
          <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Updated Regularly
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
        title={
          <>
            Explore India&apos;s{" "}
            <span className="text-accent italic">Exceptional</span> Beans.
          </>
        }
      />

      <div className="container mx-auto p-4 pt-16 md:pt-24">
        {/* Results Count */}
        {data && (
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              Showing {items.length} of {data.total} coffees
            </p>
          </div>
        )}

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

        {/* Filter Bar */}
        <CoffeeFilterBar />

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          filterMeta={filterMeta}
          onOpenChange={setIsDrawerOpen}
          open={isDrawerOpen}
        />

        {/* Main Content Area */}
        <div className="flex flex-col gap-12 md:flex-row md:gap-16">
          {/* Filter Sidebar */}
          <CoffeeFilterSidebar filterMeta={filterMeta} />

          {/* Coffee Grid */}
          <div className="flex-1">
            <Stack gap="8">
              {isFetching && !data && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Loading coffees...</p>
                </div>
              )}

              <CoffeeGrid isLoading={isFetching} items={items} />

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <CoffeePagination totalPages={data.totalPages} />
              )}
            </Stack>
          </div>
        </div>

        {/* FAQ Section */}
        <CoffeeDirectoryFAQ />
      </div>
    </>
  );
}
