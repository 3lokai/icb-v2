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
 * Get user profile with access control
 *
 * Returns different data based on viewer permissions:
 * - If profile is public OR viewer is the owner: returns PublicProfileDTO
 * - If profile is private AND viewer is not owner: returns null
 *
 * This function respects RLS policies and implements additional access control
 * at the application layer for defense in depth.
 *
 * @param userId - The ID of the user profile to fetch
 * @returns PublicProfileDTO if accessible, null if not found or not accessible
 *
 * @example
 * ```ts
 * const profile = await getProfileDTO(params.id);
 * if (!profile) {
 *   notFound();
 * }
 * return <ProfileClient profile={profile} />;
 * ```
 */
export async function getProfileDTO(
  userId: string
): Promise<PublicProfileDTO | null> {
  // Validate input (never trust user input!)
  if (typeof userId !== "string" || userId.length === 0) {
    return null;
  }

  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  // Fetch profile data (RLS policies will apply)
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    // Profile might not exist or RLS blocked access
    return null;
  }

  // Check if profile is public or viewer is the owner
  const isOwner = currentUser?.id === userId;
  const isPublic = profile.is_public_profile ?? true; // Default to public

  // Profile is private and viewer is not owner - deny access
  if (!(isPublic || isOwner)) {
    return null;
  }

  // Return public DTO (safe for client)
  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    experience_level: profile.experience_level,
  };
}

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
 * Check if a user profile exists
 *
 * @param userId - The ID of the user to check
 * @returns true if profile exists, false otherwise
 */
export async function profileExists(userId: string): Promise<boolean> {
  if (typeof userId !== "string" || userId.length === 0) {
    return false;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", userId)
    .single();

  return !error && data !== null;
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
