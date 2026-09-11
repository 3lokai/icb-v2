import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  createAnonServerClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import type { RegionCoffeeCount } from "@/types/region-types";

/**
 * Coffee counts for every Indian canon region, in one call.
 *
 * `own_count` is coffees tagged directly to the region; `rolled_count` adds every
 * descendant via `parent_id`, deduped on coffee. The /regions hub needs the rolled
 * figure — `get_region_detail`'s own `coffee_count` is per-region only and
 * undercounts parents (Chikmagalur reads 357 against 514 rolled).
 *
 * See migration 20260911120000_create_region_coffee_counts_rpc.sql.
 */
export async function fetchRegionCoffeeCounts(): Promise<RegionCoffeeCount[]> {
  // Cookie-free anon client (not createClient) so this is safe inside unstable_cache.
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : createAnonServerClient();

  const { data, error } = await supabase.rpc("get_region_coffee_counts");

  if (error) {
    throw error;
  }

  return (data ?? []) as RegionCoffeeCount[];
}

export const fetchRegionCoffeeCountsCached = cache(
  unstable_cache(fetchRegionCoffeeCounts, ["region-coffee-counts"], {
    revalidate: 86400,
    tags: ["coffees", "regions"],
  })
);
