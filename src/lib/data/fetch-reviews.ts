import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type {
  EntityReviewStats,
  LatestReviewPerIdentity,
} from "@/types/review-types";

/** Matches merged shape from useReviews hook and ReviewList's ReviewWithProfile. */
export type ReviewWithProfile = LatestReviewPerIdentity & {
  user_profiles: {
    id: string;
    username: string | null;
    full_name: string;
    avatar_url: string | null;
  } | null;
};

export type FetchReviewsOptions = {
  supabaseClient?: SupabaseClient;
};

async function getServerSupabase(
  override?: SupabaseClient
): Promise<SupabaseClient> {
  if (override) return override;
  return process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();
}

/**
 * Entity review aggregates ( mirrors useReviewStats queryFn ).
 */
export async function fetchReviewStats(
  entityType: "coffee" | "roaster",
  entityId: string,
  options?: { supabaseClient?: SupabaseClient }
): Promise<EntityReviewStats | null> {
  const supabase = await getServerSupabase(options?.supabaseClient);

  const { data, error } = await supabase
    .from("entity_review_stats")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data as EntityReviewStats | null;
}

/**
 * Latest reviews per identity with profile joins ( mirrors useReviews queryFn ).
 * Default limit 10 matches RoasterDetailPage / CoffeeDetailPage ReviewList slice.
 */
export async function fetchReviews(
  entityType: "coffee" | "roaster",
  entityId: string,
  limit = 10,
  options?: FetchReviewsOptions
): Promise<ReviewWithProfile[]> {
  const supabase = await getServerSupabase(options?.supabaseClient);

  const { data: reviews, error: reviewsError } = await supabase
    .from("latest_reviews_per_identity")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (reviewsError) {
    throw reviewsError;
  }

  if (!reviews || reviews.length === 0) {
    return [];
  }

  const userIds = reviews
    .map((r) => r.user_id)
    .filter((id): id is string => id !== null);

  const userProfilesMap = new Map<
    string,
    {
      id: string;
      username: string | null;
      full_name: string;
      avatar_url: string | null;
    }
  >();

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("id, username, full_name, avatar_url")
      .in("id", userIds);

    if (!profilesError && profiles) {
      for (const profile of profiles) {
        userProfilesMap.set(profile.id, profile);
      }
    }
  }

  return reviews.map((review) => ({
    ...review,
    user_profiles: review.user_id
      ? userProfilesMap.get(review.user_id) || null
      : null,
  })) as ReviewWithProfile[];
}
