import { createClient } from "@/lib/supabase/server";
import type { UserProfileFull, CoffeePreferences } from "@/types/profile-types";

/**
 * Fetch complete user profile data by username or UUID
 * Returns null if profile not found or permission denied (private profile)
 *
 * @param username - Username string or UUID string (for users without username)
 * @param viewerId - Optional UUID of the viewer (for privacy checks)
 */
export async function fetchUserProfileByUsername(
  username: string,
  viewerId?: string
): Promise<UserProfileFull | null> {
  const supabase = await createClient();

  // Call the RPC function
  const { data, error } = await supabase.rpc("get_user_profile_full", {
    p_username: username,
    p_viewer_id: viewerId || null,
  });

  // Log errors in development
  if (process.env.NODE_ENV === "development") {
    if (error) {
      console.error("[fetchUserProfileByUsername] RPC Error:", {
        username,
        viewerId,
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }
    if (!data) {
      console.warn("[fetchUserProfileByUsername] No data returned:", {
        username,
        viewerId,
        hasError: !!error,
      });
    }
  }

  if (error || !data) {
    // Profile not found or permission denied
    return null;
  }

  // Type assertion - the RPC returns JSONB which matches our UserProfileFull type
  // We validate the structure matches what we expect
  const profileData = data as unknown as UserProfileFull;

  // Basic validation - ensure we have at least a profile object
  if (!profileData || !profileData.profile) {
    return null;
  }

  // Fetch coffee preferences separately (not included in RPC)
  // Only fetch if viewing own profile or profile is public
  const userId = profileData.profile.id;
  let coffeePreferences: CoffeePreferences | null = null;

  // For owners, we fetch preferences; for public profiles, fetch if public
  if (viewerId === userId || profileData.profile.is_public_profile) {
    const { data: prefsData } = await supabase
      .from("user_coffee_preferences")
      .select(
        "roast_levels, flavor_profiles, processing_methods, regions, with_milk_preference, decaf_only, organic_only"
      )
      .eq("user_id", userId)
      .single();

    if (prefsData) {
      coffeePreferences = {
        roast_levels: prefsData.roast_levels,
        flavor_profiles: prefsData.flavor_profiles,
        processing_methods: prefsData.processing_methods,
        regions: prefsData.regions,
        with_milk_preference: prefsData.with_milk_preference,
        decaf_only: prefsData.decaf_only ?? false,
        organic_only: prefsData.organic_only ?? false,
      };
    }
  }

  return {
    ...profileData,
    coffee_preferences: coffeePreferences,
  };
}

/**
 * Fetch anonymous user profile data by anon_id
 * Returns null if no reviews/selections found for this anon_id
 *
 * @param anonId - Anonymous user ID (UUID)
 */
export async function fetchAnonProfile(
  anonId: string
): Promise<UserProfileFull | null> {
  const supabase = await createClient();

  // Fetch ratings (reviews with ratings)
  // Note: latest_reviews_per_identity doesn't have direct foreign keys to coffees
  // We need to query differently - get reviews first, then fetch coffee details
  const { data: reviewsData, error: reviewsError } = await supabase
    .from("latest_reviews_per_identity")
    .select("id, entity_id, rating, comment, created_at, recommend")
    .eq("anon_id", anonId)
    .eq("entity_type", "coffee")
    .not("rating", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (reviewsError) {
    console.error("Error fetching anon reviews:", reviewsError);
    return null;
  }

  // If no reviews found, return early with an empty profile structure
  if (!reviewsData || reviewsData.length === 0) {
    return {
      profile: {
        id: anonId,
        username: null,
        full_name: "Anonymous User",
        avatar_url: null,
        bio: null,
        city: null,
        state: null,
        country: null,
        is_public_profile: true,
        show_location: false,
        created_at: null,
      },
      ratings: [],
      selections: [],
      taste_profile: {
        top_roast_levels: [],
        top_brew_methods: [],
        top_flavor_note_ids: [],
        total_reviews: 0,
        last_computed_at: null,
      },
      gear: [],
      station_photos: [],
      coffee_preferences: null,
    };
  }

  // Get coffee IDs and fetch coffee details
  const coffeeIds = reviewsData.map((r) => r.entity_id);

  const { data: coffeesData, error: coffeesError } = await supabase
    .from("coffees")
    .select(
      `
      id,
      name,
      slug,
      roaster_id,
      roasters!inner(
        id,
        name,
        slug
      )
    `
    )
    .in("id", coffeeIds);

  if (coffeesError) {
    console.error("Error fetching coffees:", coffeesError);
    return null;
  }

  // Fetch coffee images
  const { data: imagesData } = await supabase
    .from("coffee_images")
    .select("coffee_id, imagekit_url, sort_order")
    .in("coffee_id", coffeeIds)
    .eq("sort_order", 0);

  // Create maps for quick lookup
  const coffeeMap = new Map((coffeesData || []).map((c) => [c.id, c]));
  const imageMap = new Map(
    (imagesData || []).map((img) => [img.coffee_id, img.imagekit_url])
  );

  // Transform ratings
  const ratings = reviewsData
    .filter((r) => r.rating !== null)
    .map((r) => {
      const coffee = coffeeMap.get(r.entity_id);
      const roaster = coffee?.roasters as any;

      return {
        id: r.id,
        coffee_id: r.entity_id,
        coffee_name: coffee?.name || "Unknown Coffee",
        coffee_slug: coffee?.slug || "",
        roaster_name: roaster?.name || "Unknown Roaster",
        roaster_slug: roaster?.slug || "",
        rating: r.rating!,
        comment: r.comment,
        created_at: r.created_at,
        image_url: imageMap.get(r.entity_id) || null,
      };
    });

  // Transform selections (recommended coffees)
  const selections = reviewsData
    .filter((r) => r.recommend === true)
    .map((r) => {
      const coffee = coffeeMap.get(r.entity_id);
      const roaster = coffee?.roasters as any;

      return {
        review_id: r.id,
        coffee_id: r.entity_id,
        coffee_name: coffee?.name || "Unknown Coffee",
        coffee_slug: coffee?.slug || "",
        roaster_name: roaster?.name || "Unknown Roaster",
        roaster_slug: roaster?.slug || "",
        rating: r.rating,
        comment: r.comment,
        reviewed_at: r.created_at,
        image_url: imageMap.get(r.entity_id) || null,
      };
    });

  // Build minimal profile structure for anon user
  const profileData: UserProfileFull = {
    profile: {
      id: anonId,
      username: null,
      full_name: "Anonymous User",
      avatar_url: null,
      bio: null,
      city: null,
      state: null,
      country: null,
      is_public_profile: true,
      show_location: false,
      created_at: null,
    },
    ratings,
    selections,
    taste_profile: {
      top_roast_levels: [],
      top_brew_methods: [],
      top_flavor_note_ids: [],
      total_reviews: ratings.length,
      last_computed_at: null,
    },
    gear: [],
    station_photos: [],
    coffee_preferences: null,
  };

  return profileData;
}
