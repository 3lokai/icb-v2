"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoasterDirectoryFAQ } from "@/components/faqs/RoasterDirectoryFAQs";
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
import { RoasterFilterBar } from "./RoasterFilterBar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
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
        24 // limit is constant
      );
      setAll({
        filters: initialFilters,
        page: initialPage,
        sort: initialSort,
        limit: 24,
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
          <h2 className="mb-4 font-bold text-2xl">Error loading roasters</h2>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-3xl">Roaster Directory</h1>
        {data && (
          <p className="text-muted-foreground">
            Showing {items.length} of {data.total} roasters
          </p>
        )}
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 md:hidden">
        <Button
          aria-label="Open filters"
          className="w-full justify-start"
          onClick={() => setIsDrawerOpen(true)}
          variant="outline"
        >
          <Filter className="mr-2 h-4 w-4" />
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
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filter Sidebar */}
        <RoasterFilterSidebar filterMeta={filterMeta} />

        {/* Roaster Grid */}
        <div className="flex-1">
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
        </div>
      </div>

      {/* FAQ Section */}
      <RoasterDirectoryFAQ />
    </div>
  );
}
