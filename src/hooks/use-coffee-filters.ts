"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  buildCoffeeQueryString,
  parseCoffeeSearchParams,
} from "@/lib/filters/coffee-url";
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";

const DEFAULT_PAGE = 1;
const _DEFAULT_LIMIT = 15;
const _DEFAULT_SORT: CoffeeSort = "relevance";

/**
 * Hook to read and update coffee filters from URL
 * URL is the single source of truth
 */
export function useCoffeeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current URL params
  const { filters, page, sort, limit } = useMemo(() => {
    return parseCoffeeSearchParams(searchParams);
  }, [searchParams]);

  // Update filters by updating URL
  const updateFilters = (
    updates:
      | Partial<CoffeeFilters>
      | ((prev: CoffeeFilters) => Partial<CoffeeFilters>)
  ) => {
    const current = parseCoffeeSearchParams(searchParams);
    const updatesObj =
      typeof updates === "function" ? updates(current.filters) : updates;
    const newFilters = { ...current.filters, ...updatesObj };

    // Reset page to 1 when filters change
    const queryString = buildCoffeeQueryString(
      newFilters,
      DEFAULT_PAGE,
      current.sort,
      current.limit
    );
    router.replace(`/coffees?${queryString}`, { scroll: false });
  };

  // Reset all filters
  const resetFilters = () => {
    router.replace(`/coffees`, { scroll: false });
  };

  // Update page
  const setPage = (newPage: number) => {
    const queryString = buildCoffeeQueryString(filters, newPage, sort, limit);
    router.replace(`/coffees?${queryString}`, { scroll: false });
  };

  // Update sort
  const setSort = (newSort: CoffeeSort) => {
    const queryString = buildCoffeeQueryString(
      filters,
      DEFAULT_PAGE, // Reset to page 1 when sort changes
      newSort,
      limit
    );
    router.replace(`/coffees?${queryString}`, { scroll: false });
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
