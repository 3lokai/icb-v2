import { unstable_cache } from "next/cache";
import { combineRatings } from "@/lib/badges/badges";
import { createAnonServerClient } from "@/lib/supabase/server";
import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";
import type { Database } from "@/types/supabase-types";

export type BadgeCoffee = {
  id: string;
  slug: string;
  name: string;
  status: Database["public"]["Enums"]["coffee_status_enum"];
  ratingAvg: number | null;
  ratingCount: number;
  /** The roaster's own product page, captured at ingest. */
  sourceUrl: string | null;
};

export type BadgeRoaster = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  platform: Database["public"]["Enums"]["platform_enum"] | null;
  /** Roaster + coffee ratings combined (see combineRatings). */
  ratingAvg: number | null;
  ratingCount: number;
  coffees: BadgeCoffee[];
};

/**
 * Everything the badge SVGs, the /go redirect and the badges page need for one
 * roaster, in two queries. Cached 1h (§22 allows 1–6h) and shared by all of a
 * roaster's badges, so a store full of SKU badges is one cache entry.
 */
async function fetchBadgeRoaster(slug: string): Promise<BadgeRoaster | null> {
  const supabase = createAnonServerClient();

  const { data: roaster, error } = await supabase
    .from("roasters")
    .select(
      "id, slug, name, website, platform, avg_rating, total_ratings_count"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!roaster) return null;

  const { data: coffees, error: coffeesError } = await supabase
    .from("coffee_directory_mv")
    .select(
      "coffee_id, slug, name, status, rating_avg, rating_count, direct_buy_url"
    )
    .eq("roaster_id", roaster.id)
    .in("status", PUBLIC_COFFEE_STATUSES)
    .order("name");
  if (coffeesError) throw coffeesError;

  const badgeCoffees: BadgeCoffee[] = (coffees ?? [])
    .filter((c) => c.coffee_id && c.slug && c.name && c.status)
    .map((c) => ({
      id: c.coffee_id!,
      slug: c.slug!,
      name: c.name!,
      status: c.status!,
      ratingAvg: c.rating_avg,
      ratingCount: c.rating_count ?? 0,
      sourceUrl: c.direct_buy_url,
    }));

  // Roaster badge rating = roaster ratings + all its coffees' ratings.
  const combined = combineRatings([
    {
      ratingAvg: roaster.avg_rating,
      ratingCount: roaster.total_ratings_count ?? 0,
    },
    ...badgeCoffees,
  ]);

  return {
    id: roaster.id,
    slug: roaster.slug,
    name: roaster.name,
    website: roaster.website,
    platform: roaster.platform,
    ...combined,
    coffees: badgeCoffees,
  };
}

export const fetchBadgeRoasterCached = unstable_cache(
  fetchBadgeRoaster,
  ["badge-roaster"],
  { revalidate: 3600, tags: ["roasters", "coffees"] }
);
