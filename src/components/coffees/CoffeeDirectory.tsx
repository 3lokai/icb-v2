"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CoffeeDirectoryFAQ } from "@/components/faqs/CoffeeDirectoryFAQs";
import { useCoffees } from "@/hooks/use-coffees";
import {
  buildCoffeeQueryString,
  parseCoffeeSearchParams,
} from "@/lib/filters/coffee-url";
import { useCoffeeDirectoryStore } from "@/store/zustand/coffee-directory-store";
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

type CoffeeDirectoryProps = {
  initialFilters: CoffeeFilters;
  initialData: CoffeeListResponse;
  initialPage: number;
  initialSort: CoffeeSort;
  filterMeta: CoffeeFilterMeta;
};

/**
 * Coffee Directory Component (Client Component)
 * Coordinates between URL, Zustand store, and data fetching
 */
export function CoffeeDirectory({
  initialFilters,
  initialData,
  initialPage,
  initialSort,
  filterMeta,
}: CoffeeDirectoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);
  const lastSyncedQueryString = useRef<string>("");

  // Get state from Zustand store
  const { filters, page, sort, limit, setAll } = useCoffeeDirectoryStore();

  // Initialize store from props (SSR data) on mount (only once)
  useEffect(() => {
    if (!isInitialized.current) {
      // Use props from server component (already parsed and validated)
      const queryString = buildCoffeeQueryString(
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

    const queryString = buildCoffeeQueryString(filters, page, sort, limit);

    // Only update URL if it's different from what we last synced
    if (queryString !== lastSyncedQueryString.current) {
      lastSyncedQueryString.current = queryString;
      router.replace(`/coffees?${queryString}`, { scroll: false });
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
      const parsed = parseCoffeeSearchParams(urlSearchParams);
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
  const { data, isFetching, isError } = useCoffees(
    { filters, page, limit, sort },
    initialData
  );

  // Render minimal UI (Phase 1)
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="py-12 text-center">
          <h2 className="mb-4 font-bold text-2xl">Error loading coffees</h2>
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
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-3xl">Coffee Directory</h1>
        {data && (
          <p className="text-muted-foreground">
            Showing {items.length} of {data.total} coffees
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <CoffeeFilterBar />

      {/* Main Content Area */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filter Sidebar */}
        <CoffeeFilterSidebar filterMeta={filterMeta} />

        {/* Coffee Grid */}
        <div className="flex-1">
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
        </div>
      </div>

      {/* FAQ Section */}
      <CoffeeDirectoryFAQ />
    </div>
  );
}
