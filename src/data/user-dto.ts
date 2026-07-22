import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";

/**
 * Public Profile DTO - Safe to pass to Client Components
 *
 * Contains only fields that are safe to expose publicly.
 * This DTO is used when viewing other users' profiles.
 */
export type PublicProfileDTO = {
  id: string;
  username: string | null;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  experience_level: string | null;
  // Only public fields - no sensitive data like email, location, etc.
};

/**
 * Private Profile DTO - Includes sensitive fields user can see about themselves
 *
 * Contains additional fields that only the profile owner should see.
 * This DTO is used when viewing your own profile.
 */
export type PrivateProfileDTO = PublicProfileDTO & {
  email: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  gender: string | null;
  preferred_brewing_methods: string[] | null;
  is_public_profile: boolean | null;
  show_location: boolean | null;
  email_verified: boolean | null;
  onboarding_completed: boolean | null;
  newsletter_subscribed: boolean | null;
};

/**
 * Get current user's own profile (includes private fields)
 *
 * Returns the full profile including sensitive fields that only the owner
 * should see. This is used for profile editing pages and dashboard.
 *
 * @returns PrivateProfileDTO if user has a profile, null otherwise
 *
 * @example
 * ```ts
 * const profile = await getMyProfileDTO();
 * if (!profile) {
 *   // User needs to complete onboarding
 *   redirect('/onboarding');
 * }
 * ```
 */
export async function getMyProfileDTO(): Promise<PrivateProfileDTO | null> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if (error || !profile) {
    // Profile might not exist yet (new user)
    return null;
  }

  // Return full profile for owner
  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    experience_level: profile.experience_level,
    email: currentUser.email,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    gender: profile.gender,
    preferred_brewing_methods: profile.preferred_brewing_methods,
    is_public_profile: profile.is_public_profile,
    show_location: profile.show_location,
    email_verified: profile.email_verified,
    onboarding_completed: profile.onboarding_completed,
    newsletter_subscribed: profile.newsletter_subscribed,
  };
}

/**
 * Get current user's coffee preferences
 *
 * @returns Coffee preferences data or null if not found
 */
export async function getCoffeePreferences() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_coffee_preferences")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Get current user's notification preferences
 *
 * @returns Notification preferences data or null if not found
 */
export async function getNotificationPreferences() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_notification_preferences")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Review with entity details for display
 */
export type MyReview = {
  id: string;
  entity_type: "coffee" | "roaster";
  entity_id: string;
  user_id: string | null;
  anon_id: string | null;
  recommend: boolean | null;
  rating: number | null;
  value_for_money: boolean | null;
  works_with_milk: boolean | null;
  brew_method: string | null;
  comment: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  identity_key: string | null;
  entity: {
    id: string;
    slug: string;
    name: string;
    /** Roaster slug for coffee reviews (used for nested coffee detail URL) */
    roaster_slug?: string;
  };
};

/**
 * Get current user's reviews with entity details
 *
 * Fetches all reviews submitted by the authenticated user from the
 * latest_reviews_per_identity view, and enriches them with entity
 * information (coffee or roaster name and slug).
 *
 * @returns Array of reviews with entity details, or empty array if none found
 *
 * @example
 * ```ts
 * const reviews = await getMyReviews();
 * const coffeeReviews = reviews.filter(r => r.entity_type === 'coffee');
 * const roasterReviews = reviews.filter(r => r.entity_type === 'roaster');
 * ```
 */
export async function getMyReviews(): Promise<MyReview[]> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }

  const supabase = await createClient();

  // Fetch reviews from latest_reviews_per_identity view
  // Filter by user_id for authenticated users
  const { data: reviews, error: reviewsError } = await supabase
    .from("latest_reviews_per_identity")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("[getMyReviews] Error fetching user reviews:", {
      error: reviewsError,
      message: reviewsError.message,
      code: reviewsError.code,
      details: reviewsError.details,
      hint: reviewsError.hint,
      userId: currentUser.id,
    });
    return [];
  }

  if (!reviews || reviews.length === 0) {
    // No reviews found - this is normal for new users
    return [];
  }

  // Separate coffee and roaster reviews
  const coffeeReviews = reviews.filter((r) => r.entity_type === "coffee");
  const roasterReviews = reviews.filter((r) => r.entity_type === "roaster");

  // Fetch entity details in parallel
  const [coffeeEntities, roasterEntities] = await Promise.all([
    coffeeReviews.length > 0
      ? supabase
          .from("coffees")
          .select("id, slug, name, roasters(slug)")
          .in(
            "id",
            coffeeReviews.map((r) => r.entity_id)
          )
      : { data: [], error: null },
    roasterReviews.length > 0
      ? supabase
          .from("roasters")
          .select("id, slug, name")
          .in(
            "id",
            roasterReviews.map((r) => r.entity_id)
          )
      : { data: [], error: null },
  ]);

  if (coffeeEntities.error) {
    console.error(
      "[getMyReviews] Error fetching coffee entities:",
      coffeeEntities.error
    );
  }
  if (roasterEntities.error) {
    console.error(
      "[getMyReviews] Error fetching roaster entities:",
      roasterEntities.error
    );
  }

  // Create maps for quick lookup
  const coffeeMap = new Map((coffeeEntities.data || []).map((c) => [c.id, c]));
  const roasterMap = new Map(
    (roasterEntities.data || []).map((r) => [r.id, r])
  );

  // Combine reviews with entity details
  const enrichedReviews: MyReview[] = [];

  for (const review of reviews) {
    const entity =
      review.entity_type === "coffee"
        ? coffeeMap.get(review.entity_id)
        : roasterMap.get(review.entity_id);

    if (!entity) {
      // Entity not found - skip this review
      continue;
    }

    const entityData =
      review.entity_type === "coffee" && "roasters" in entity
        ? {
            id: entity.id,
            slug: entity.slug,
            name: entity.name,
            roaster_slug:
              (entity.roasters as { slug?: string } | null)?.slug ?? "",
          }
        : {
            id: entity.id,
            slug: entity.slug,
            name: entity.name,
          };

    enrichedReviews.push({
      id: review.id,
      entity_type: review.entity_type,
      entity_id: review.entity_id,
      user_id: review.user_id,
      anon_id: review.anon_id,
      recommend: review.recommend,
      rating: review.rating,
      value_for_money: review.value_for_money,
      works_with_milk: review.works_with_milk,
      brew_method: review.brew_method,
      comment: review.comment,
      status: review.status,
      created_at: review.created_at,
      updated_at: review.updated_at,
      identity_key: review.identity_key || null,
      entity: entityData,
    });
  }

  return enrichedReviews;
}

/**
 * Get current user's review statistics
 *
 * Returns aggregated statistics about the user's reviews:
 * - Coffee review count and average rating
 * - Roaster review count and average rating
 *
 * @returns Review statistics object
 */
export async function getMyReviewStats(): Promise<{
  coffeeCount: number;
  coffeeAverageRating: number | null;
  roasterCount: number;
  roasterAverageRating: number | null;
}> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      coffeeCount: 0,
      coffeeAverageRating: null,
      roasterCount: 0,
      roasterAverageRating: null,
    };
  }

  const reviews = await getMyReviews();

  const coffeeReviews = reviews.filter((r) => r.entity_type === "coffee");
  const roasterReviews = reviews.filter((r) => r.entity_type === "roaster");

  // Calculate average rating for coffee reviews
  const coffeeReviewsWithRatings = coffeeReviews.filter(
    (r) => r.rating !== null
  );
  const coffeeAverageRating =
    coffeeReviewsWithRatings.length > 0
      ? coffeeReviewsWithRatings.reduce((sum, r) => sum + (r.rating || 0), 0) /
        coffeeReviewsWithRatings.length
      : null;

  // Calculate average rating for roaster reviews
  const roasterReviewsWithRatings = roasterReviews.filter(
    (r) => r.rating !== null
  );
  const roasterAverageRating =
    roasterReviewsWithRatings.length > 0
      ? roasterReviewsWithRatings.reduce((sum, r) => sum + (r.rating || 0), 0) /
        roasterReviewsWithRatings.length
      : null;

  return {
    coffeeCount: coffeeReviews.length,
    coffeeAverageRating: coffeeAverageRating
      ? Math.round(coffeeAverageRating * 10) / 10
      : null,
    roasterCount: roasterReviews.length,
    roasterAverageRating: roasterAverageRating
      ? Math.round(roasterAverageRating * 10) / 10
      : null,
  };
}
