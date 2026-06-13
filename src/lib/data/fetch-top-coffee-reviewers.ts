import "server-only";

import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";

/**
 * A public profile surfaced in the homepage "Top Profiles" section, ranked by
 * the number of its authenticated active coffee reviews. Display-safe fields
 * only — mirrors the columns returned by the `get_top_coffee_reviewers` RPC.
 */
export type TopProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  show_location: boolean | null;
  preferred_brewing_methods: string[] | null;
  review_count: number;
};

/**
 * Top public profiles by authenticated coffee-review count.
 *
 * Calls the `get_top_coffee_reviewers` RPC (migration 20260613120000). Until that
 * migration is applied + types regenerated (`npm run supabase:types`), the RPC name
 * isn't in the generated `Database` union, so the call is cast locally; a missing
 * RPC simply logs and returns `[]`, and the section renders its empty state.
 *
 * Cached for 10 minutes — a slightly stale leaderboard is fine for a homepage.
 */
export const fetchTopCoffeeReviewers = unstable_cache(
  async (limit = 6): Promise<TopProfile[]> => {
    try {
      const supabase = createAnonServerClient();

      const { data, error } = await (
        supabase.rpc as unknown as (
          name: string,
          args: Record<string, unknown>
        ) => Promise<{ data: unknown; error: { message: string } | null }>
      )("get_top_coffee_reviewers", { p_limit: limit });

      if (error) {
        console.error("[fetchTopCoffeeReviewers]", error.message);
        return [];
      }

      return Array.isArray(data) ? (data as TopProfile[]) : [];
    } catch (e) {
      console.error("[fetchTopCoffeeReviewers]", e);
      return [];
    }
  },
  ["top-coffee-reviewers"],
  { revalidate: 600, tags: ["reviews"] }
);
