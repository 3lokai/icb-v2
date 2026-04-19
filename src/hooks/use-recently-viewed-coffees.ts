import { useQuery } from "@tanstack/react-query";
import { getRecentlyViewedCoffees } from "@/app/actions/coffee-views";
import type { RecentlyViewedCoffeeItem } from "@/lib/data/fetch-recently-viewed-coffees";
import { queryKeys } from "@/lib/query-keys";

export function useRecentlyViewedCoffees(
  limit: number = 12,
  initialData?: RecentlyViewedCoffeeItem[]
) {
  return useQuery({
    queryKey: queryKeys.coffees.recentlyViewed(limit),
    queryFn: async () => {
      const result = await getRecentlyViewedCoffees(limit);
      if (!result.success || result.data === undefined) {
        throw new Error(
          result.error ?? "Failed to load recently viewed coffees."
        );
      }
      return result.data;
    },
    initialData,
    staleTime: 60 * 1000,
  });
}
