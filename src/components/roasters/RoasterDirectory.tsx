"use client";

import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/common/PageHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RoasterDirectoryFAQ } from "@/components/faqs/RoasterDirectoryFAQs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/primitives/stack";
import { useRoasters } from "@/hooks/use-roasters";
import {
  buildRoasterQueryString,
  parseRoasterSearchParams,
} from "@/lib/filters/roaster-url";
import { useRoasterDirectoryStore } from "@/store/zustand/roaster-directory-store";
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
 * Coordinates between URL, Zustand store, and data fetching
 */
export function RoasterDirectory({
  initialFilters,
  initialData,
  initialPage,
  initialSort,
  filterMeta,
}: RoasterDirectoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);
  const lastSyncedQueryString = useRef<string>("");

  // Get state from Zustand store
  const { filters, page, sort, limit, setAll } = useRoasterDirectoryStore();

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate active filter count
  const activeFilterCount =
    (filters.active_only ? 1 : 0) +
    (filters.cities?.length ?? 0) +
    (filters.states?.length ?? 0) +
    (filters.countries?.length ?? 0) +
    (filters.q ? 1 : 0);

  // Initialize store from props (SSR data) on mount (only once)
  useEffect(() => {
    if (!isInitialized.current) {
      // Use props from server component (already parsed and validated)
      const queryString = buildRoasterQueryString(
        initialFilters,
        initialPage,
        initialSort,
        15 // limit is constant
      );
      setAll({
        filters: initialFilters,
        page: initialPage,
        sort: initialSort,
        limit: 15,
      });
      lastSyncedQueryString.current = queryString;
      isInitialized.current = true;
    }
  }, [initialFilters, initialPage, initialSort, setAll]);

  // Sync store changes to URL
  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }

    const queryString = buildRoasterQueryString(filters, page, sort, limit);

    // Only update URL if it's different from what we last synced
    if (queryString !== lastSyncedQueryString.current) {
      lastSyncedQueryString.current = queryString;
      router.replace(`/roasters?${queryString}`, { scroll: false });
    }
  }, [filters, page, sort, limit, router]);

  // Handle URL changes (back/forward navigation)
  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }

    const currentQueryString = searchParams.toString();

    // Only update store if URL query string is different from what we last synced
    if (currentQueryString !== lastSyncedQueryString.current) {
      const urlSearchParams = new URLSearchParams(currentQueryString);
      const parsed = parseRoasterSearchParams(urlSearchParams);
      setAll({
        filters: parsed.filters,
        page: parsed.page,
        sort: parsed.sort,
        limit: parsed.limit,
      });
      lastSyncedQueryString.current = currentQueryString;
    }
  }, [searchParams, setAll]);

  // Fetch data using TanStack Query
  const { data, isFetching, isError } = useRoasters(
    { filters, page, limit, sort },
    initialData
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
    <>
      <PageHeader
        backgroundImage="/images/hero-bg.png"
        backgroundImageAlt="Roastery background"
        description="Discover specialty coffee roasters from across India. Connect with the artisans dedicated to bringing out the best in every bean."
        overline="Artisan Roaster Directory"
        rightSideContent={
          <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Manually Reviewed
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
        title={
          <>
            India&apos;s <span className="text-accent italic">Passionate</span>{" "}
            Roasters.
          </>
        }
      />

      <div className="container mx-auto p-4 pt-16 md:pt-24">
        {/* Results Count */}
        {data && (
          <div className="mb-6 text-center">
            <p className="text-muted-foreground text-caption italic">
              Showing {items.length} of {data.total} roasters
            </p>
          </div>
        )}

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

          {/* Roaster Grid */}
          <div className="flex-1">
            <Stack gap="8">
              {isFetching && !data && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Loading roasters...</p>
                </div>
              )}

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
    </>
  );
}
