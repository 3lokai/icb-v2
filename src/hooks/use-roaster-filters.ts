"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  buildRoasterQueryString,
  parseRoasterSearchParams,
} from "@/lib/filters/roaster-url";
import type { RoasterFilters, RoasterSort } from "@/types/roaster-types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 15;
const DEFAULT_SORT: RoasterSort = "relevance";

/**
 * Hook to read and update roaster filters from URL
 * URL is the single source of truth
 */
export function useRoasterFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current URL params
  const { filters, page, sort, limit } = useMemo(() => {
    return parseRoasterSearchParams(searchParams);
  }, [searchParams]);

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
    router.replace(`/roasters?${queryString}`, { scroll: false });
  };

  // Reset all filters
  const resetFilters = () => {
    router.replace(`/roasters`, { scroll: false });
  };

  // Update page
  const setPage = (newPage: number) => {
    const queryString = buildRoasterQueryString(filters, newPage, sort, limit);
    router.replace(`/roasters?${queryString}`, { scroll: false });
  };

  // Update sort
  const setSort = (newSort: RoasterSort) => {
    const queryString = buildRoasterQueryString(
      filters,
      DEFAULT_PAGE, // Reset to page 1 when sort changes
      newSort,
      limit
    );
    router.replace(`/roasters?${queryString}`, { scroll: false });
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
