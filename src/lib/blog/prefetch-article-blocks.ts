import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchCoffeeBySlug } from "@/lib/data/fetch-coffee-by-slug";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";
import { fetchChartData } from "@/lib/data/fetch-chart-data";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { fetchRoasters } from "@/lib/data/fetch-roasters";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";
import {
  buildCoffeeCollectionParams,
  buildRoasterCollectionParams,
} from "@/lib/blog/collection-params";

/**
 * Walks a Sanity article body and prefetches the data each client-fetched
 * blog block (CoffeeSpotlight, RoasterSpotlight, DataChart, CoffeeCollection,
 * RoasterCollection) would otherwise fetch after hydration, seeding the same
 * TanStack Query cache keys (queryKeys.blog.*) so the widgets render with
 * real content in the initial server HTML instead of a loading skeleton.
 *
 * A block whose prefetch fails (e.g. a stale/deleted coffee slug) is simply
 * left unseeded — the component's existing client-side useQuery + skeleton
 * takes over exactly as it does today, so this can never break the page.
 */
export async function prefetchArticleBlocks(
  queryClient: QueryClient,
  body: any[] | undefined
): Promise<void> {
  if (!body?.length) return;

  const tasks = body.map((block) => {
    switch (block?._type) {
      case "coffeeSpotlight":
        if (!block.coffeeId) return null;
        return queryClient.prefetchQuery({
          queryKey: queryKeys.blog.coffeeSpotlight(block.coffeeId),
          queryFn: () => fetchCoffeeBySlug(block.coffeeId),
        });

      case "roasterSpotlight":
        if (!block.roasterId) return null;
        return queryClient.prefetchQuery({
          queryKey: queryKeys.blog.roasterSpotlight(block.roasterId),
          queryFn: () => fetchRoasterBySlug(block.roasterId),
        });

      case "dataChart":
        return queryClient.prefetchQuery({
          queryKey: queryKeys.blog.dataChart(
            block.dataKey,
            block.limit,
            block.region
          ),
          queryFn: () =>
            fetchChartData(block.dataKey, block.limit || 10, block.region),
        });

      case "coffeeCollection":
        return queryClient.prefetchQuery({
          queryKey: queryKeys.blog.coffeeCollection(block),
          queryFn: async () => {
            const { filters, page, limit, sort } = parseCoffeeSearchParams(
              buildCoffeeCollectionParams(block)
            );
            return fetchCoffees(filters, page, limit, sort);
          },
        });

      case "roasterCollection":
        return queryClient.prefetchQuery({
          queryKey: queryKeys.blog.roasterCollection(block),
          queryFn: async () => {
            const { filters, page, limit, sort } = parseRoasterSearchParams(
              buildRoasterCollectionParams(block)
            );
            return fetchRoasters(filters, page, limit, sort);
          },
        });

      default:
        return null;
    }
  });

  await Promise.allSettled(tasks);
}
