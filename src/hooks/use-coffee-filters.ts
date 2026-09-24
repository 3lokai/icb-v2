"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import {
  buildCoffeeQueryString,
  parseCoffeeSearchParams,
} from "@/lib/filters/coffee-url";
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";

/**
 * Hook to read and update coffee filters from URL
 * URL is the single source of truth
 *
 * Filter changes are state changes, not navigations. The grid is driven by
 * TanStack Query (`useCoffees`), which re-keys off these filters and refetches
 * `/api/coffees` itself — it never reads the RSC payload after first paint. So
 * the URL only needs to be *written*, not navigated to. `router.replace`
 * additionally re-ran `generateMetadata` (→ `fetchPublicDirectoryTotals`),
 * `fetchCoffeesCached`, `fetchCoffeeFilterMeta` and the schema builders on every
 * commit and discarded all of it.
 *
 * Next syncs `useSearchParams()` off the native History API, so `replaceState`
 * updates the URL with no server round trip — and with no navigation there is no
 * scroll reset, hence no scroll save/restore to do either.
 *
 * Trade-off: `generateMetadata` no longer re-runs, so the tab title and page
 * schema stay at their first-paint values while filtering. That costs nothing —
 * filtered views are `noindex` and canonicalise to bare `/coffees` (see
 * `shouldIndex` in `app/(main)/coffees/page.tsx`), and a directly-loaded or
 * crawled URL still gets the correct SSR render.
 */
export function useCoffeeFilters() {
  const searchParams = useSearchParams();

  // Parse current URL params
  const { filters, page, sort, limit } = useMemo(() => {
    return parseCoffeeSearchParams(searchParams);
  }, [searchParams]);

  const replaceUrl = useCallback((url: string) => {
    window.history.replaceState(null, "", url);
  }, []);

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

      replaceUrl(`/coffees?${queryString}`);
    },
    [searchParams, replaceUrl]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    replaceUrl("/coffees");
  }, [replaceUrl]);

  // Update page
  const setPage = useCallback(
    (newPage: number) => {
      const queryString = buildCoffeeQueryString(filters, newPage, sort, limit);
      replaceUrl(`/coffees?${queryString}`);
    },
    [filters, sort, limit, replaceUrl]
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
      replaceUrl(`/coffees?${queryString}`);
    },
    [filters, limit, replaceUrl]
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
