"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback, useRef, useEffect } from "react";
import {
  buildCoffeeQueryString,
  parseCoffeeSearchParams,
} from "@/lib/filters/coffee-url";
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";

const DEFAULT_PAGE = 1;

/**
 * Hook to read and update coffee filters from URL
 * URL is the single source of truth
 *
 * Note: All filter updates use router.replace (not push) to avoid spamming
 * browser history. Filter changes are state changes, not navigations.
 */
export function useCoffeeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRestoreYRef = useRef<number | null>(null);
  const shouldRestoreScrollRef = useRef(false);

  // Parse current URL params
  const { filters, page, sort, limit } = useMemo(() => {
    return parseCoffeeSearchParams(searchParams);
  }, [searchParams]);

  // Restore scroll after URL update (only when we triggered the change via replace)
  useEffect(() => {
    if (!shouldRestoreScrollRef.current || scrollRestoreYRef.current == null) {
      return;
    }
    const y = scrollRestoreYRef.current;
    shouldRestoreScrollRef.current = false;
    scrollRestoreYRef.current = null;
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  }, [searchParams]);

  const saveScrollAndReplace = useCallback(
    (url: string) => {
      shouldRestoreScrollRef.current = true;
      scrollRestoreYRef.current = window.scrollY;
      router.replace(url, { scroll: false });
    },
    [router]
  );

  // Update filters by updating URL
  const updateFilters = useCallback(
    (
      updates:
        | Partial<CoffeeFilters>
        | ((prev: CoffeeFilters) => Partial<CoffeeFilters>)
    ) => {
      const current = parseCoffeeSearchParams(searchParams);
      const updatesObj =
        typeof updates === "function" ? updates(current.filters) : updates;
      const newFilters = { ...current.filters, ...updatesObj };

      const queryString = buildCoffeeQueryString(
        newFilters,
        1,
        current.sort,
        current.limit
      );

      saveScrollAndReplace(`/coffees?${queryString}`);
    },
    [searchParams, saveScrollAndReplace]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    saveScrollAndReplace("/coffees");
  }, [saveScrollAndReplace]);

  // Update page
  const setPage = useCallback(
    (newPage: number) => {
      const queryString = buildCoffeeQueryString(filters, newPage, sort, limit);
      saveScrollAndReplace(`/coffees?${queryString}`);
    },
    [filters, sort, limit, saveScrollAndReplace]
  );

  // Update sort
  const setSort = useCallback(
    (newSort: CoffeeSort) => {
      const queryString = buildCoffeeQueryString(
        filters,
        1, // Reset to page 1 when sort changes
        newSort,
        limit
      );
      saveScrollAndReplace(`/coffees?${queryString}`);
    },
    [filters, limit, saveScrollAndReplace]
  );

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
