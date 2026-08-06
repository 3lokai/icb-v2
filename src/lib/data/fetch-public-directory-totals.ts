import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";
import type { CoffeeFilterMeta } from "@/types/coffee-types";

export type PublicDirectoryTotals = CoffeeFilterMeta["totals"] & {
  /** When the scraper last finished a successful run (`get_last_scrape_completed_at` RPC). */
  asOf: string | null;
};

async function fetchPublicDirectoryTotalsImpl(): Promise<PublicDirectoryTotals> {
  const supabase = createAnonServerClient();

  const [coffeesResult, roastersResult, lastScrapedResult] = await Promise.all([
    supabase
      .from("coffee_directory_mv")
      .select("coffee_id", { count: "exact", head: true })
      .in("status", PUBLIC_COFFEE_STATUSES),
    supabase
      .from("roasters")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.rpc("get_last_scrape_completed_at"),
  ]);

  if (coffeesResult.error) {
    throw coffeesResult.error;
  }
  if (roastersResult.error) {
    throw roastersResult.error;
  }
  if (lastScrapedResult.error) {
    throw lastScrapedResult.error;
  }

  return {
    coffees: coffeesResult.count ?? 0,
    roasters: roastersResult.count ?? 0,
    asOf: lastScrapedResult.data ?? null,
  };
}

/**
 * Head-count totals for the public coffee directory (same semantics as
 * CoffeeFilterMeta.totals). Lightweight — use on homepage instead of full
 * fetchCoffeeFilterMeta. Global (non-personalized) counts, so cached for 10
 * minutes to keep it off the hero's hot render path.
 */
export const fetchPublicDirectoryTotals = unstable_cache(
  fetchPublicDirectoryTotalsImpl,
  ["public-directory-totals"],
  { revalidate: 600, tags: ["coffees", "roasters"] }
);
