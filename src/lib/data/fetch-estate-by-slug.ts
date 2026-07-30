import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createAnonServerClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import type { EstateDetail } from "@/types/estate-types";

export type FetchEstateBySlugOptions = {
  /** Max coffees to embed from `coffee_directory_mv` (default 24). */
  limit?: number;
  supabaseClient?: SupabaseClient;
};

/**
 * Fetch a single estate by slug with all related data (region, media, coffees).
 * Returns null if not found. Never touches `canon_estate_trade` (B2B-gated, no
 * public SELECT policy) — the RPC itself doesn't reference that table.
 */
export async function fetchEstateBySlug(
  slug: string,
  options?: FetchEstateBySlugOptions
): Promise<EstateDetail | null> {
  const { limit = 24, supabaseClient } = options ?? {};

  const supabase =
    supabaseClient ??
    (process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : createAnonServerClient());

  // Single round-trip: the get_estate_detail RPC assembles the entire
  // EstateDetail jsonb server-side (estate + region + media + coffees[]).
  // See migration 20260730120000_create_estate_region_detail_rpcs.sql.
  const { data, error } = await supabase.rpc("get_estate_detail", {
    p_slug: slug,
    p_limit: limit,
  });

  if (error) {
    throw error;
  }
  if (data == null) {
    return null;
  }

  return data as unknown as EstateDetail;
}

/**
 * Cached variant of {@link fetchEstateBySlug} for the estate detail page.
 */
export const fetchEstateBySlugCached = cache(
  unstable_cache(
    (slug: string) => fetchEstateBySlug(slug),
    ["estate-by-slug"],
    { revalidate: 86400, tags: ["estates"] }
  )
);
