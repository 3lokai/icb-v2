import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { buildRegionQueryString } from "@/lib/filters/region-url";
import { queryKeys } from "@/lib/query-keys";
import type {
  RegionFilters,
  RegionListResponse,
  RegionSort,
} from "@/types/region-types";

/**
 * Fetch regions from API endpoint
 */
async function fetchRegionsFromAPI(
  filters: RegionFilters,
  page: number,
  limit: number,
  sort: RegionSort
): Promise<RegionListResponse> {
  const queryString = buildRegionQueryString(filters, page, sort, limit);
  const response = await fetch(`/api/regions?${queryString}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to fetch regions",
    }));
    throw new Error(error.error || "Failed to fetch regions");
  }

  return response.json();
}

/**
 * TanStack Query hook for fetching regions
 * @param params - Object containing filters, page, limit, sort
 * @param options - Optional TanStack Query options
 */
export function useRegions(
  params: {
    filters: RegionFilters;
    page: number;
    limit: number;
    sort: RegionSort;
  },
  options?: Omit<
    UseQueryOptions<RegionListResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  const { filters, page, limit, sort } = params;
  return useQuery({
    queryKey: queryKeys.regions.list(filters, page, limit, sort),
    queryFn: () => fetchRegionsFromAPI(filters, page, limit, sort),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}
