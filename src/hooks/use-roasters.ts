import { useQuery } from "@tanstack/react-query";
import { buildRoasterQueryString } from "@/lib/filters/roaster-url";
import { queryKeys } from "@/lib/query-keys";
import type {
  RoasterFilters,
  RoasterListResponse,
  RoasterSort,
} from "@/types/roaster-types";

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
 * TanStack Query hook for fetching roasters
 * @param params - Object containing filters, page, limit, sort
 * @param initialData - Optional initial data for SSR hydration
 */
export function useRoasters(
  params: {
    filters: RoasterFilters;
    page: number;
    limit: number;
    sort: RoasterSort;
  },
  initialData?: RoasterListResponse
) {
  const { filters, page, limit, sort } = params;
  return useQuery({
    queryKey: queryKeys.roasters.list(filters, page, limit, sort),
    queryFn: () => fetchRoastersFromAPI(filters, page, limit, sort),
    placeholderData: initialData,
    staleTime: 60 * 1000, // 1 minute
  });
}
