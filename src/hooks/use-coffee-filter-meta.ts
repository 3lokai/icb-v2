import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { queryKeys } from "@/lib/query-keys";
import type { CoffeeFilterMeta, CoffeeFilters } from "@/types/coffee-types";

/**
 * Fetch filtered coffee filter meta from API endpoint
 * Note: q (text search) is excluded - meta counts don't need to update while typing
 */
async function fetchCoffeeFilterMetaFromAPI(
  filters: CoffeeFilters
): Promise<CoffeeFilterMeta> {
  // Build query string from filters (excluding q)
  const params = new URLSearchParams();

  // Add filters to params (q is intentionally excluded)
  if (filters.roast_levels?.length) {
    params.set("roastLevels", filters.roast_levels.join(","));
  }
  if (filters.processes?.length) {
    params.set("processes", filters.processes.join(","));
  }
  if (filters.status?.length) {
    params.set("statuses", filters.status.join(","));
  }
  if (filters.roaster_ids?.length) {
    params.set("roasterIds", filters.roaster_ids.join(","));
  }
  if (filters.region_ids?.length) {
    params.set("regionIds", filters.region_ids.join(","));
  }
  if (filters.estate_ids?.length) {
    params.set("estateIds", filters.estate_ids.join(","));
  }
  if (filters.brew_method_ids?.length) {
    params.set("brewMethodIds", filters.brew_method_ids.join(","));
  }
  if (filters.flavor_keys?.length) {
    params.set("flavorKeys", filters.flavor_keys.join(","));
  }
  if (filters.in_stock_only) {
    params.set("inStockOnly", "1");
  }
  if (filters.has_250g_only) {
    params.set("has250gOnly", "1");
  }
  if (filters.min_price) {
    params.set("minPrice", filters.min_price.toString());
  }
  if (filters.max_price) {
    params.set("maxPrice", filters.max_price.toString());
  }

  const queryString = params.toString();
  const url = queryString
    ? `/api/coffees/filter-meta?${queryString}`
    : "/api/coffees/filter-meta";

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to fetch filter meta",
    }));
    throw new Error(error.error || "Failed to fetch filter meta");
  }

  return response.json();
}

/**
 * TanStack Query hook for fetching filtered coffee filter meta
 * Returns filter counts that reflect the current filter state
 * @param filters - Current active filters
 * @param initialMeta - Optional initial meta for SSR hydration (static counts)
 * @param enabled - Whether to fetch (default: true, set to false to disable)
 * @param isVisible - Whether the filter UI is visible (default: true). When false, skips fetching to save API calls.
 */
export function useCoffeeFilterMeta(
  filters: CoffeeFilters,
  initialMeta?: CoffeeFilterMeta,
  enabled: boolean = true,
  isVisible: boolean = true
) {
  // Debounce filter changes to avoid excessive API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters]);

  // Extract q from filters - exclude completely from meta fetching
  const filtersWithoutQ = useMemo(() => {
    const { q: _q, ...rest } = debouncedFilters;
    return rest;
  }, [debouncedFilters]);

  // Check if any non-q filters are actually set (not just keys exist)
  const hasNonQFilters = useMemo(() => {
    const { q: _q, ...rest } = debouncedFilters;

    // Check arrays have length
    if (rest.roast_levels?.length) return true;
    if (rest.processes?.length) return true;
    if (rest.status?.length) return true;
    if (rest.flavor_keys?.length) return true;
    if (rest.roaster_ids?.length) return true;
    if (rest.region_ids?.length) return true;
    if (rest.estate_ids?.length) return true;
    if (rest.brew_method_ids?.length) return true;

    // Check booleans are true
    if (rest.in_stock_only === true) return true;
    if (rest.has_250g_only === true) return true;

    // Check prices are set
    if (rest.min_price !== undefined && rest.min_price > 0) return true;
    if (rest.max_price !== undefined && rest.max_price < 10000) return true;

    return false;
  }, [debouncedFilters]);

  return useQuery({
    // Query key excludes q to keep cache stable during text typing
    queryKey: queryKeys.coffees.filterMeta(filtersWithoutQ),
    // API call also excludes q - meta counts don't need to update while typing
    queryFn: () => fetchCoffeeFilterMetaFromAPI(filtersWithoutQ),
    // TanStack Query v5 pattern: use placeholderData function to keep previous data during refetch
    placeholderData: (previousData) => previousData || initialMeta,
    initialData: hasNonQFilters ? undefined : initialMeta, // Use static meta if no non-q filters
    staleTime: 60 * 1000, // 60 seconds - reasonable for filter counts
    // Only fetch if: enabled, has non-q filters, and filter UI is visible
    enabled: enabled && hasNonQFilters && isVisible,
  });
}
