import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getCuratorsAction,
  getCuratorBySlugAction,
} from "@/app/actions/curations";
import type { CuratorDTO, CuratorPageDTO } from "@/data/curations";

/**
 * TanStack Query hook for fetching all curators (listing).
 * Uses server action for data; for Server Components prefer getAllCurators from @/data/curations.
 *
 * @param options - Optional TanStack Query options
 */
export function useCurators(
  options?: Omit<UseQueryOptions<CuratorDTO[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.curations.list(),
    queryFn: () => getCuratorsAction(),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}

/**
 * TanStack Query hook for fetching a single curator by slug with full curations.
 * Uses server action for data; for Server Components prefer getCuratorBySlug from @/data/curations.
 *
 * @param slug - Curator slug
 * @param options - Optional TanStack Query options (e.g. enabled: !!slug)
 */
export function useCurator(
  slug: string,
  options?: Omit<
    UseQueryOptions<CuratorPageDTO | null, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.curations.detail(slug),
    queryFn: () => getCuratorBySlugAction(slug),
    enabled: !!slug,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}
