"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  buildRoasterQueryString,
  parseRoasterSearchParams,
} from "@/lib/filters/roaster-url";
import type { RoasterFilters, RoasterSort } from "@/types/roaster-types";

const DEFAULT_PAGE = 1;

/**
 * Hook to read and update roaster filters from URL
 * URL is the single source of truth
 *
 * Writes the URL via the native History API rather than `router.replace`, for
 * the same reason as `useCoffeeFilters`: `RoasterDirectory` gets its rows from
 * TanStack Query (`useRoasters`), so navigating only re-ran server work that was
 * then discarded. See `useCoffeeFilters` for the full rationale and trade-off.
 */
export function useRoasterFilters() {
  const searchParams = useSearchParams();

  // Parse current URL params
  const { filters, page, sort, limit } = useMemo(() => {
    return parseRoasterSearchParams(searchParams);
  }, [searchParams]);

  const replaceUrl = useCallback((url: string) => {
    window.history.replaceState(null, "", url);
  }, []);

  // Update filters by updating URL
  const updateFilters = (updates: Partial<RoasterFilters>) => {
    const current = parseRoasterSearchParams(searchParams);
    const newFilters = { ...current.filters, ...updates };

    // Reset page to 1 when filters change
    const queryString = buildRoasterQueryString(
      newFilters,
      DEFAULT_PAGE,
      current.sort,
      current.limit
    );
    replaceUrl(`/roasters?${queryString}`);
  };

  // Reset all filters
  const resetFilters = () => {
    replaceUrl(`/roasters`);
  };

  // Update page
  const setPage = (newPage: number) => {
    const queryString = buildRoasterQueryString(filters, newPage, sort, limit);
    replaceUrl(`/roasters?${queryString}`);
  };

  // Update sort
  const setSort = (newSort: RoasterSort) => {
    const queryString = buildRoasterQueryString(
      filters,
      DEFAULT_PAGE, // Reset to page 1 when sort changes
      newSort,
      limit
    );
    replaceUrl(`/roasters?${queryString}`);
  };

  return {
    filters,
    page,
    sort,
    limit,
    updateFilters,
    resetFilters,
    setPage,
    setSort,
  };
}
