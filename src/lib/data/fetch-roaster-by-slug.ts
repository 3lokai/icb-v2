import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createAnonServerClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import type { RoasterDetail } from "@/types/roaster-types";

export type FetchRoasterBySlugOptions = {
  /** Max coffees to load from `coffee_summary` (default 15). */
  limit?: number;
  supabaseClient?: SupabaseClient;
};

/**
 * Fetch a single roaster by slug with all related data
 * Returns null if roaster not found
 */
export async function fetchRoasterBySlug(
  slug: string,
  options?: FetchRoasterBySlugOptions
): Promise<RoasterDetail | null> {
  const { limit = 15, supabaseClient } = options ?? {};

  // Try to use service role client if available (bypasses RLS for server-side queries).
  // Fallback uses the cookie-free anon client (not createClient) so this is safe to
  // run inside `unstable_cache` via fetchRoasterBySlugCached.
  const supabase =
    supabaseClient ??
    (process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : createAnonServerClient());

  // Single round-trip: the get_roaster_detail RPC assembles the entire
  // RoasterDetail jsonb server-side (roaster + coffees[] from coffee_directory_mv
  // + live counts), replacing the ~4 PostgREST queries this previously fired.
  // See migration 20260625195049_create_detail_rpcs.sql.
  const { data, error } = await supabase.rpc("get_roaster_detail", {
    p_slug: slug,
    p_limit: limit,
  });

  if (error || data == null) {
    return null;
  }

  return data as unknown as RoasterDetail;
}

/**
 * Cached variant of {@link fetchRoasterBySlug} for the roaster detail page.
 *
 * Wraps the default-limit fetch in `unstable_cache` (24h + "roasters" tag) so
 * repeat visits are served from cache instead of hitting Supabase, and in React
 * `cache()` so `generateMetadata` and the page component share one fetch per
 * request. API routes and the per-roaster coffee list keep using the raw
 * `fetchRoasterBySlug` (they pass custom `limit` options).
 */
export const fetchRoasterBySlugCached = cache(
  unstable_cache(
    (slug: string) => fetchRoasterBySlug(slug),
    ["roaster-by-slug"],
    { revalidate: 86400, tags: ["roasters"] }
  )
);
