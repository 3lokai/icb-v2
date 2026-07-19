import "server-only";

import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";

/**
 * A single signed-in coffee review surfaced in the homepage "Fresh from the
 * community" section. Display-safe fields only — mirrors the row shape returned
 * by the `get_featured_reviews` RPC. `coffee_name` is already the cleaned name
 * (`coffees.display_name`), so no client-side decode/strip is needed.
 */
export type FeaturedReview = {
  id: string;
  rating: number | null;
  comment: string;
  brew_method: string | null;
  created_at: string;
  featured: boolean;
  coffee_name: string;
  coffee_slug: string;
  roaster_slug: string;
  username: string | null;
  avatar_url: string | null;
  reviewer_coffee_count: number;
};

export type FeaturedReviewsPayload = {
  reviews: FeaturedReview[];
  /** All-time active coffee ratings across the directory (auth + anon, deduped). */
  total_ratings: number;
  /** Active coffee ratings in the last 30 days. */
  ratings_last_30d: number;
};

/**
 * Featured community reviews + directory rating totals for the homepage.
 *
 * Calls the `get_featured_reviews` RPC (migration 20260720120000) — one round trip
 * for both the cards and the aggregate line. Until that migration is applied +
 * types regenerated (`npm run supabase:types`), the RPC name isn't in the generated
 * `Database` union, so the call is cast locally. Returns `null` on any failure so
 * the section renders nothing rather than a broken shell.
 *
 * Cached for 15 minutes — a slightly stale set of testimonials is fine for a homepage.
 */
export const fetchFeaturedReviews = unstable_cache(
  async (limit = 3): Promise<FeaturedReviewsPayload | null> => {
    try {
      const supabase = createAnonServerClient();

      const { data, error } = await (
        supabase.rpc as unknown as (
          name: string,
          args: Record<string, unknown>
        ) => Promise<{ data: unknown; error: { message: string } | null }>
      )("get_featured_reviews", { p_limit: limit });

      if (error) {
        console.error("[fetchFeaturedReviews]", error.message);
        return null;
      }

      const payload = data as FeaturedReviewsPayload | null;
      if (!payload || !Array.isArray(payload.reviews)) {
        return null;
      }

      return payload;
    } catch (e) {
      console.error("[fetchFeaturedReviews]", e);
      return null;
    }
  },
  ["featured-reviews"],
  { revalidate: 900, tags: ["reviews"] }
);
