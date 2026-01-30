import { useQuery } from "@tanstack/react-query";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";
import { buildRoasterQueryString } from "@/lib/filters/roaster-url";
import { queryKeys } from "@/lib/query-keys";
import type {
  CoffeeFilters,
  CoffeeListResponse,
  CoffeeSort,
} from "@/types/coffee-types";
import type {
  RoasterFilters,
  RoasterListResponse,
  RoasterSort,
} from "@/types/roaster-types";

/**
 * Fetch coffees from API endpoint
 */
async function fetchCoffeesFromAPI(
  filters: CoffeeFilters,
  page: number,
  limit: number,
  sort: CoffeeSort
): Promise<CoffeeListResponse> {
  const queryString = buildCoffeeQueryString(filters, page, sort, limit);
  const response = await fetch(`/api/coffees?${queryString}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to fetch coffees",
    }));
    throw new Error(error.error || "Failed to fetch coffees");
  }

  return response.json();
}

/**
 * Fetch roasters from API endpoint
 */
async function fetchRoastersFromAPI(
  filters: RoasterFilters,
  page: number,
  limit: number,
  sort: RoasterSort
): Promise<RoasterListResponse> {
  const queryString = buildRoasterQueryString(filters, page, sort, limit);
  const response = await fetch(`/api/roasters?${queryString}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to fetch roasters",
    }));
    throw new Error(error.error || "Failed to fetch roasters");
  }

  return response.json();
}

/**
 * Hook for fetching new arrival coffees (sorted by newest)
 */
export function useNewArrivalCoffees(limit: number = 6) {
  return useQuery({
    queryKey: queryKeys.coffees.list({}, 1, limit, "newest"),
    queryFn: () => fetchCoffeesFromAPI({}, 1, limit, "newest"),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook for fetching featured roasters (sorted by rating, active only)
 */
export function useFeaturedRoasters(limit: number = 6) {
  return useQuery({
    queryKey: queryKeys.roasters.list(
      { active_only: true },
      1,
      limit,
      "rating_desc"
    ),
    queryFn: () =>
      fetchRoastersFromAPI({ active_only: true }, 1, limit, "rating_desc"),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook for fetching all roasters (directory listing)
 */
export function useRoasterDirectory(limit: number = 100) {
  return useQuery({
    queryKey: queryKeys.roasters.list(
      { active_only: true },
      1,
      limit,
      "name_asc"
    ),
    queryFn: () =>
      fetchRoastersFromAPI({ active_only: true }, 1, limit, "name_asc"),
    staleTime: 5 * 60 * 1000, // 5 minutes - directory data doesn't change often
  });
}
