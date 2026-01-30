"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback, useTransition } from "react";
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
  const [, startTransition] = useTransition();

  // Parse current URL params
  const { filters, page, sort, limit } = useMemo(() => {
    return parseCoffeeSearchParams(searchParams);
  }, [searchParams]);

  // Update filters by updating URL
  // Use startTransition so MultiSelect can receive multiple selections before re-render
  // (immediate router.replace would close the popover after each selection)
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

      startTransition(() => {
        router.replace(`/coffees?${queryString}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    router.replace(`/coffees`, { scroll: false });
  }, [router]);

  // Update page
  const setPage = useCallback(
    (newPage: number) => {
      const queryString = buildCoffeeQueryString(filters, newPage, sort, limit);
      router.replace(`/coffees?${queryString}`, { scroll: false });
    },
    [filters, sort, limit, router]
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
      router.replace(`/coffees?${queryString}`, { scroll: false });
    },
    [filters, limit, router]
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
