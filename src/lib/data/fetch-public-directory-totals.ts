import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";
import type { CoffeeFilterMeta } from "@/types/coffee-types";

export type PublicDirectoryTotals = CoffeeFilterMeta["totals"];

async function fetchPublicDirectoryTotalsImpl(): Promise<PublicDirectoryTotals> {
  const supabase = createAnonServerClient();

  const [coffeesResult, roastersResult] = await Promise.all([
    supabase
      .from("coffee_summary")
      .select("coffee_id", { count: "exact", head: true })
      .in("status", PUBLIC_COFFEE_STATUSES),
    supabase
      .from("roasters")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  if (coffeesResult.error) {
    throw coffeesResult.error;
  }
  if (roastersResult.error) {
    throw roastersResult.error;
  }

  return {
    coffees: coffeesResult.count ?? 0,
    roasters: roastersResult.count ?? 0,
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
