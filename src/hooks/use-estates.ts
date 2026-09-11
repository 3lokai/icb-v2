import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { buildEstateQueryString } from "@/lib/filters/estate-url";
import { queryKeys } from "@/lib/query-keys";
import type {
  EstateFilters,
  EstateListResponse,
  EstateSort,
} from "@/types/estate-types";

/**
 * Fetch estates from API endpoint
 */
async function fetchEstatesFromAPI(
  filters: EstateFilters,
  page: number,
  limit: number,
  sort: EstateSort
): Promise<EstateListResponse> {
  const queryString = buildEstateQueryString(filters, page, sort, limit);
  const response = await fetch(`/api/estates?${queryString}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to fetch estates",
    }));
    throw new Error(error.error || "Failed to fetch estates");
  }

  return response.json();
}

/**
 * TanStack Query hook for fetching estates
 * @param params - Object containing filters, page, limit, sort
 * @param options - Optional TanStack Query options
 */
export function useEstates(
  params: {
    filters: EstateFilters;
    page: number;
    limit: number;
    sort: EstateSort;
  },
  options?: Omit<
    UseQueryOptions<EstateListResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  const { filters, page, limit, sort } = params;
  return useQuery({
    queryKey: queryKeys.estates.list(filters, page, limit, sort),
    queryFn: () => fetchEstatesFromAPI(filters, page, limit, sort),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}
