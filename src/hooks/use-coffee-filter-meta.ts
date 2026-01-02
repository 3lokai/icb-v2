import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryKeys } from "@/lib/query-keys";
import type { CoffeeFilterMeta, CoffeeFilters } from "@/types/coffee-types";

/**
 * Fetch filtered coffee filter meta from API endpoint
 */
async function fetchCoffeeFilterMetaFromAPI(
  filters: CoffeeFilters
): Promise<CoffeeFilterMeta> {
  // Build query string from filters
  const params = new URLSearchParams();

  // Add filters to params
  if (filters.q) {
    params.set("q", filters.q);
  }
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
 */
export function useCoffeeFilterMeta(
  filters: CoffeeFilters,
  initialMeta?: CoffeeFilterMeta,
  enabled: boolean = true
) {
  // Only fetch if there are active filters, otherwise use static meta
  const hasActiveFilters = Object.keys(filters).length > 0;

  // Debounce filter changes to avoid excessive API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters]);

  return useQuery({
    queryKey: queryKeys.coffees.filterMeta(debouncedFilters),
    queryFn: () => fetchCoffeeFilterMetaFromAPI(debouncedFilters),
    placeholderData: initialMeta,
    initialData: hasActiveFilters ? undefined : initialMeta, // Use static meta if no filters
    staleTime: 30 * 1000, // 30 seconds - counts update relatively frequently
    enabled: enabled && hasActiveFilters, // Only fetch if filters are active
  });
}
