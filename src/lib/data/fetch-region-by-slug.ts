import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createAnonServerClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import type { RegionDetail } from "@/types/region-types";

export type FetchRegionBySlugOptions = {
  /** Max coffees to embed from `coffee_directory_mv` (default 24). */
  limit?: number;
  supabaseClient?: SupabaseClient;
};

/**
 * Fetch a single region by slug with all related data (media, estates, coffees).
 * Returns null if not found.
 */
export async function fetchRegionBySlug(
  slug: string,
  options?: FetchRegionBySlugOptions
): Promise<RegionDetail | null> {
  const { limit = 24, supabaseClient } = options ?? {};

  // Fallback uses the cookie-free anon client (not createClient) so this is safe to
  // run inside `unstable_cache` via fetchRegionBySlugCached.
  const supabase =
    supabaseClient ??
    (process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : createAnonServerClient());

  // Single round-trip: the get_region_detail RPC assembles the entire
  // RegionDetail jsonb server-side (region + media + estates[] + coffees[]).
  // See migration 20260730120000_create_estate_region_detail_rpcs.sql.
  const { data, error } = await supabase.rpc("get_region_detail", {
    p_slug: slug,
    p_limit: limit,
  });

  // Throw on RPC failure so transient errors aren't cached as a 24h "not found";
  // only a genuine miss (null) returns null.
  if (error) {
    throw error;
  }
  if (data == null) {
    return null;
  }

  return data as unknown as RegionDetail;
}

/**
 * Cached variant of {@link fetchRegionBySlug} for the region detail page.
 *
 * Wraps the default-limit fetch in `unstable_cache` (24h + "regions" tag) so
 * repeat visits are served from cache, and in React `cache()` so
 * `generateMetadata` and the page component share one fetch per request.
 */
export const fetchRegionBySlugCached = cache(
  unstable_cache(
    (slug: string) => fetchRegionBySlug(slug),
    ["region-by-slug"],
    { revalidate: 86400, tags: ["regions"] }
  )
);
