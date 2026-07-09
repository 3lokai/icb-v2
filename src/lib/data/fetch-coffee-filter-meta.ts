import { unstable_cache } from "next/cache";
import { fetchCoffeeFilterMetaWithFilters } from "@/lib/data/fetch-coffee-filter-meta-filtered";
import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";
import type { CoffeeFilterMeta } from "@/types/coffee-types";

/**
 * Unfiltered filter meta for the coffee directory (facet options + counts).
 * Delegates to the get_coffee_filter_meta RPC (single DB call over
 * coffee_directory_mv) instead of the old 11-query fan-out.
 *
 * PUBLIC_COFFEE_STATUSES must be passed explicitly: the RPC applies NO status
 * filter when p_statuses is null, which would leak draft/discontinued coffees
 * into the public counts.
 */
async function _fetchCoffeeFilterMetaImpl(): Promise<CoffeeFilterMeta> {
  return fetchCoffeeFilterMetaWithFilters({ status: PUBLIC_COFFEE_STATUSES });
}

export const fetchCoffeeFilterMeta = unstable_cache(
  _fetchCoffeeFilterMetaImpl,
  ["coffee-filter-meta"],
  { revalidate: 86400, tags: ["coffees", "coffee-filter-meta"] }
);
