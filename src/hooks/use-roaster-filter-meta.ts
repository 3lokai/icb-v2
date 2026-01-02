import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryKeys } from "@/lib/query-keys";
import type { RoasterFilterMeta, RoasterFilters } from "@/types/roaster-types";

/**
 * Fetch filtered roaster filter meta from API endpoint
 */
async function fetchRoasterFilterMetaFromAPI(
  filters: RoasterFilters
): Promise<RoasterFilterMeta> {
  // Build query string from filters
  const params = new URLSearchParams();

  // Add filters to params
  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.cities?.length) {
    params.set("cities", filters.cities.join(","));
  }
  if (filters.states?.length) {
    params.set("states", filters.states.join(","));
  }
  if (filters.countries?.length) {
    params.set("countries", filters.countries.join(","));
  }
  if (filters.active_only) {
    params.set("activeOnly", "1");
  }

  const queryString = params.toString();
  const url = queryString
    ? `/api/roasters/filter-meta?${queryString}`
    : "/api/roasters/filter-meta";

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
 * TanStack Query hook for fetching filtered roaster filter meta
 * Returns filter counts that reflect the current filter state
 * @param filters - Current active filters
 * @param initialMeta - Optional initial meta for SSR hydration (static counts)
 * @param enabled - Whether to fetch (default: true, set to false to disable)
 */
export function useRoasterFilterMeta(
  filters: RoasterFilters,
  initialMeta?: RoasterFilterMeta,
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
    queryKey: queryKeys.roasters.filterMeta(debouncedFilters),
    queryFn: () => fetchRoasterFilterMetaFromAPI(debouncedFilters),
    placeholderData: initialMeta,
    initialData: hasActiveFilters ? undefined : initialMeta, // Use static meta if no filters
    staleTime: 30 * 1000, // 30 seconds - counts update relatively frequently
    enabled: enabled && hasActiveFilters, // Only fetch if filters are active
  });
}
