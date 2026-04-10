import "server-only";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Count of latest active coffee reviews per identity (matches how `coffees.rating_count`
 * is derived — one row per user/anon per coffee in `latest_reviews_per_identity`).
 */
export async function fetchCommunityCoffeeReviewCount(): Promise<
  number | null
> {
  try {
    const supabase = process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : await createClient();

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
}
