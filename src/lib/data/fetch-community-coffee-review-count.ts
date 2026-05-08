import "server-only";

import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";

/**
 * Count of latest active coffee reviews per identity (matches how `coffees.rating_count`
 * is derived — one row per user/anon per coffee in `latest_reviews_per_identity`).
 * Cached for 10 minutes — stale count is acceptable for a homepage stat.
 */
export const fetchCommunityCoffeeReviewCount = unstable_cache(
  async (): Promise<number | null> => {
    try {
      const supabase = createAnonServerClient();

      const { count, error } = await supabase
        .from("latest_reviews_per_identity")
        .select("*", { count: "exact", head: true })
        .eq("entity_type", "coffee");

      if (error) {
        console.error("[fetchCommunityCoffeeReviewCount]", error.message);
        return null;
      }

      return count ?? 0;
    } catch (e) {
      console.error("[fetchCommunityCoffeeReviewCount]", e);
      return null;
    }
  },
  ["community-coffee-review-count"],
  { revalidate: 600, tags: ["reviews"] }
);
