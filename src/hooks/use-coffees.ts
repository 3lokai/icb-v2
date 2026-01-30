import { useQuery } from "@tanstack/react-query";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";
import { queryKeys } from "@/lib/query-keys";
import type {
  CoffeeFilters,
  CoffeeListResponse,
  CoffeeSort,
} from "@/types/coffee-types";

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
 * TanStack Query hook for fetching coffees
 * @param params - Query parameters (filters, page, limit, sort)
 * @param initialData - Optional initial data for SSR hydration
 */
export function useCoffees(
  params: {
    filters: CoffeeFilters;
    page: number;
    limit: number;
    sort: CoffeeSort;
  },
  initialData?: CoffeeListResponse
) {
  const { filters, page, limit, sort } = params;
  return useQuery({
    queryKey: queryKeys.coffees.list(filters, page, limit, sort),
    queryFn: () => fetchCoffeesFromAPI(filters, page, limit, sort),
    placeholderData: initialData,
    staleTime: 60 * 1000, // 1 minute
  });
}
