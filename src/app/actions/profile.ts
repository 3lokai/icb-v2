"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/data/auth";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { unsubscribeFromConvertKit } from "@/lib/convertkit/client";
import {
  type OnboardingFormData,
  onboardingSchema,
} from "@/lib/validations/onboarding";
import {
  type ProfileUpdateFormData,
  profileUpdateSchema,
  type CoffeePreferencesUpdateFormData,
  coffeePreferencesUpdateSchema,
  type NotificationPreferencesUpdateFormData,
  notificationPreferencesUpdateSchema,
  type PrivacySettingsFormData,
  privacySettingsSchema,
} from "@/lib/validations/profile";
import {
  uploadStationPhotoSchema,
  deleteStationPhotoSchema,
  uploadAvatarSchema,
  type UploadStationPhotoFormData,
  type DeleteStationPhotoFormData,
  type UploadAvatarFormData,
} from "@/lib/validations/station-photos";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit/upload";

type OnboardingData = OnboardingFormData;

function prepareProfileData(
  data: OnboardingData | ProfileUpdateFormData,
  includeOnboarding = false
) {
  const profileData: {
    full_name: string;
    username?: string | null;
    bio?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    gender?: string | null;
    experience_level?: string | null;
    preferred_brewing_methods?: string[] | null;
    onboarding_completed?: boolean | null;
    is_public_profile?: boolean | null;
    show_location?: boolean | null;
  } = {
    full_name: data.fullName,
  };

  if (includeOnboarding) {
    profileData.onboarding_completed = true;
  }

  if ("username" in data && data.username) {
    profileData.username = data.username;
  }
  if ("bio" in data && data.bio) {
    profileData.bio = data.bio;
  }
  if (data.city) {
    profileData.city = data.city;
  }
  if (data.state) {
    profileData.state = data.state;
  }
  if (data.country) {
    profileData.country = data.country;
  }
  if (data.gender) {
    profileData.gender = data.gender;
  }
  if (data.experienceLevel) {
    profileData.experience_level = data.experienceLevel;
  }
  if (data.preferredBrewingMethods) {
    profileData.preferred_brewing_methods = data.preferredBrewingMethods;
  }
  if (
    "isPublicProfile" in data &&
    data.isPublicProfile !== undefined &&
    typeof data.isPublicProfile === "boolean"
  ) {
    profileData.is_public_profile = data.isPublicProfile;
  }
  if (
    "showLocation" in data &&
    data.showLocation !== undefined &&
    typeof data.showLocation === "boolean"
  ) {
    profileData.show_location = data.showLocation;
  }

  return profileData;
}

async function saveUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  profileData: ReturnType<typeof prepareProfileData>
) {
  console.log("🔍 Calling upsert_user_profile RPC with:", {
    userId,
    profileData,
  });

  // Use RPC function to safely upsert the profile
  // The RPC returns an array, so we get the first element
  const { data, error } = await supabase.rpc("upsert_user_profile", {
    p_user_id: userId,
    p_full_name: profileData.full_name,
    p_username: profileData.username ?? null,
    p_bio: profileData.bio ?? null,
    p_city: profileData.city ?? null,
    p_state: profileData.state ?? null,
    p_country: profileData.country ?? null,
    p_gender: profileData.gender ?? null,
    p_experience_level: profileData.experience_level ?? null,
    p_preferred_brewing_methods: profileData.preferred_brewing_methods ?? null,
    p_onboarding_completed: profileData.onboarding_completed ?? null,
    p_newsletter_subscribed:
      profileData.onboarding_completed !== undefined ? true : null,
    p_is_public_profile: profileData.is_public_profile ?? null,
    p_show_location: profileData.show_location ?? null,
  });

  // RPC returns an array, extract the first result
  const profile = Array.isArray(data) ? data[0] : data;

  if (error) {
    console.error("❌ Profile RPC error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    // In development, return the actual error message for debugging
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
        : "Failed to save profile. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }

  console.log("✅ Profile saved successfully via RPC:", profile);
  return { success: true };
}

function prepareCoffeePreferences(
  data: OnboardingData | CoffeePreferencesUpdateFormData
): {
  roast_levels: string[] | null;
  flavor_profiles: string[] | null;
  processing_methods: string[] | null;
  regions: string[] | null;
  with_milk_preference: boolean | null;
  decaf_only: boolean;
  organic_only: boolean;
} | null {
  const hasCoffeePrefs =
    ("withMilkPreference" in data && data.withMilkPreference !== undefined) ||
    ("decafOnly" in data && data.decafOnly !== undefined) ||
    ("organicOnly" in data && data.organicOnly !== undefined) ||
    ("roastLevels" in data &&
      data.roastLevels &&
      data.roastLevels.length > 0) ||
    ("flavorProfiles" in data &&
      data.flavorProfiles &&
      data.flavorProfiles.length > 0) ||
    ("processingMethods" in data &&
      data.processingMethods &&
      data.processingMethods.length > 0) ||
    ("regions" in data && data.regions && data.regions.length > 0);

  if (!hasCoffeePrefs) {
    return null;
  }

  return {
    roast_levels: "roastLevels" in data ? (data.roastLevels ?? null) : null,
    flavor_profiles:
      "flavorProfiles" in data ? (data.flavorProfiles ?? null) : null,
    processing_methods:
      "processingMethods" in data ? (data.processingMethods ?? null) : null,
    regions: "regions" in data ? (data.regions ?? null) : null,
    with_milk_preference:
      "withMilkPreference" in data ? (data.withMilkPreference ?? null) : null,
    decaf_only: "decafOnly" in data ? (data.decafOnly ?? false) : false,
    organic_only: "organicOnly" in data ? (data.organicOnly ?? false) : false,
  };
}

async function saveCoffeePreferences(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  coffeePrefs: NonNullable<ReturnType<typeof prepareCoffeePreferences>>
) {
  console.log("🔍 Calling upsert_coffee_preferences RPC with:", {
    userId,
    coffeePrefs,
  });

  // Use RPC function to safely upsert coffee preferences
  const { error } = await supabase.rpc("upsert_coffee_preferences", {
    p_user_id: userId,
    p_roast_levels: coffeePrefs.roast_levels ?? null,
    p_flavor_profiles: coffeePrefs.flavor_profiles ?? null,
    p_processing_methods: coffeePrefs.processing_methods ?? null,
    p_regions: coffeePrefs.regions ?? null,
    p_with_milk_preference: coffeePrefs.with_milk_preference ?? null,
    p_decaf_only: coffeePrefs.decaf_only ?? false,
    p_organic_only: coffeePrefs.organic_only ?? false,
  });

  if (error) {
    console.error("❌ Coffee preferences RPC error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
          : "Failed to save coffee preferences. Please try again.",
    };
  }

  console.log("✅ Coffee preferences saved via RPC");
  return { success: true };
}

function prepareNotificationPreferences(
  data: OnboardingData | NotificationPreferencesUpdateFormData
) {
  const hasNotificationPrefs =
    ("newRoasters" in data && data.newRoasters !== undefined) ||
    ("coffeeUpdates" in data && data.coffeeUpdates !== undefined) ||
    ("newsletter" in data && data.newsletter !== undefined) ||
    ("platformUpdates" in data && data.platformUpdates !== undefined) ||
    ("emailFrequency" in data && data.emailFrequency !== undefined);

  if (!hasNotificationPrefs) {
    return null;
  }

  return {
    new_roasters: "newRoasters" in data ? (data.newRoasters ?? true) : true,
    coffee_updates:
      "coffeeUpdates" in data ? (data.coffeeUpdates ?? true) : true,
    newsletter: "newsletter" in data ? (data.newsletter ?? true) : true,
    platform_updates:
      "platformUpdates" in data ? (data.platformUpdates ?? true) : true,
    email_frequency:
      "emailFrequency" in data ? (data.emailFrequency ?? "weekly") : "weekly",
  };
}

async function saveNotificationPreferences(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  notificationPrefs: NonNullable<
    ReturnType<typeof prepareNotificationPreferences>
  >
) {
  console.log("🔍 Calling upsert_notification_preferences RPC with:", {
    userId,
    notificationPrefs,
  });

  const { error } = await supabase.rpc("upsert_notification_preferences", {
    p_user_id: userId,
    p_new_roasters: notificationPrefs.new_roasters ?? true,
    p_coffee_updates: notificationPrefs.coffee_updates ?? true,
    p_newsletter: notificationPrefs.newsletter ?? true,
    p_platform_updates: notificationPrefs.platform_updates ?? true,
    p_email_frequency: notificationPrefs.email_frequency ?? "weekly",
  });

  if (error) {
    console.error("❌ Notification preferences RPC error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
          : "Failed to save notification preferences. Please try again.",
    };
  }

  console.log("✅ Notification preferences saved via RPC");
  return { success: true };
}

export async function saveOnboardingData(data: OnboardingData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    // Validate input with Zod
    const validationResult = onboardingSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      return {
        success: false,
        error: "Please correct the errors in the form.",
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to complete onboarding.",
      };
    }

    const supabase = await createClient();

    // Save user profile
    const profileData = prepareProfileData(validatedData, true);
    console.log("Prepared profile data:", profileData);
    console.log("Current user ID:", currentUser.id);

    const profileResult = await saveUserProfile(
      supabase,
      currentUser.id,
      profileData
    );

    if (!profileResult.success) {
      console.error("Profile save failed:", profileResult.error);
      return profileResult;
    }

    // Save coffee preferences if provided
    const coffeePrefs = prepareCoffeePreferences(validatedData);
    if (coffeePrefs) {
      const result = await saveCoffeePreferences(
        supabase,
        currentUser.id,
        coffeePrefs
      );
      if (!result.success) {
        // Don't fail onboarding if preferences fail, but log it
        console.warn("Coffee preferences save failed:", result.error);
      }
    }

    // Save notification preferences if provided (from onboarding step 4)
    const notificationPrefs = prepareNotificationPreferences(validatedData);
    if (notificationPrefs) {
      const result = await saveNotificationPreferences(
        supabase,
        currentUser.id,
        notificationPrefs
      );
      if (!result.success) {
        // Don't fail onboarding if notification prefs fail, but log it
        console.warn("Notification preferences save failed:", result.error);
      }
    }

    // Revalidate profile pages
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Onboarding save error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Update profile action
export async function updateProfile(data: ProfileUpdateFormData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const validationResult = profileUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      return {
        success: false,
        error: "Please correct the errors in the form.",
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to update your profile.",
      };
    }

    const supabase = await createClient();
    const profileData = prepareProfileData(validatedData, false);

    const profileResult = await saveUserProfile(
      supabase,
      currentUser.id,
      profileData as ReturnType<typeof prepareProfileData>
    );

    if (!profileResult.success) {
      return profileResult;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Update coffee preferences action
export async function updateCoffeePreferences(
  data: CoffeePreferencesUpdateFormData
): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const validationResult = coffeePreferencesUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      return {
        success: false,
        error: "Please correct the errors in the form.",
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to update preferences.",
      };
    }

    const supabase = await createClient();
    const coffeePrefs = prepareCoffeePreferences(validatedData);

    if (coffeePrefs) {
      const result = await saveCoffeePreferences(
        supabase,
        currentUser.id,
        coffeePrefs
      );

      if (!result.success) {
        return result;
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/preferences");

    return { success: true };
  } catch (error) {
    console.error("Coffee preferences update error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Update notification preferences action
export async function updateNotificationPreferences(
  data: NotificationPreferencesUpdateFormData
): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const validationResult =
      notificationPreferencesUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      return {
        success: false,
        error: "Please correct the errors in the form.",
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to update notification preferences.",
      };
    }

    const supabase = await createClient();

    // Check if newsletter is being unsubscribed (changed from true to false)
    let wasSubscribed = true;
    let isUnsubscribing = false;

    if (
      "newsletter" in validatedData &&
      validatedData.newsletter !== undefined
    ) {
      // Get current newsletter preference
      const { data: currentPrefs } = await supabase
        .from("user_notification_preferences")
        .select("newsletter")
        .eq("user_id", currentUser.id)
        .single();

      wasSubscribed = currentPrefs?.newsletter ?? true;
      isUnsubscribing = wasSubscribed && !validatedData.newsletter;
    }

    const notificationPrefs = prepareNotificationPreferences(validatedData);

    if (notificationPrefs) {
      const result = await saveNotificationPreferences(
        supabase,
        currentUser.id,
        notificationPrefs
      );

      if (!result.success) {
        return result;
      }

      // If unsubscribing from newsletter, also update newsletter_subscribed in user_profiles
      // and sync to ConvertKit
      if (isUnsubscribing) {
        const serviceClient = await createServiceRoleClient();

        // Get ConvertKit subscriber ID before updating
        const { data: profile } = await serviceClient
          .from("user_profiles")
          .select("convertkit_subscriber_id")
          .eq("id", currentUser.id)
          .single();

        // Update newsletter_subscribed in user_profiles
        await serviceClient
          .from("user_profiles")
          .update({ newsletter_subscribed: false })
          .eq("id", currentUser.id);

        // Unsubscribe from ConvertKit if we have subscriber ID
        if (profile?.convertkit_subscriber_id) {
          unsubscribeFromConvertKit(profile.convertkit_subscriber_id)
            .then((success) => {
              if (success) {
                console.log(
                  `[ConvertKit] Unsubscribed user ${currentUser.id} (subscriber ID: ${profile.convertkit_subscriber_id})`
                );
              }
            })
            .catch((err) => {
              console.error("[ConvertKit] Unsubscribe error:", err);
            });
        } else {
          console.warn(
            `[ConvertKit] No subscriber ID found for user ${currentUser.id}, cannot unsubscribe`
          );
        }
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return { success: true };
  } catch (error) {
    console.error("Notification preferences update error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Update privacy settings action
export async function updatePrivacySettings(
  data: PrivacySettingsFormData
): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const validationResult = privacySettingsSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      return {
        success: false,
        error: "Please correct the errors in the form.",
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to update privacy settings.",
      };
    }

    const supabase = await createClient();
    const profileData = prepareProfileData(
      {
        fullName: "", // Required but won't be used
        isPublicProfile: validatedData.isPublicProfile,
        showLocation: validatedData.showLocation,
      } as ProfileUpdateFormData,
      false
    );

    // Update only privacy fields via RPC
    // Note: The RPC now uses COALESCE, so passing null won't overwrite existing values
    const { error } = await supabase.rpc("upsert_user_profile", {
      p_user_id: currentUser.id,
      p_full_name: null,
      p_username: null,
      p_bio: null,
      p_city: null,
      p_state: null,
      p_country: null,
      p_gender: null,
      p_experience_level: null,
      p_preferred_brewing_methods: null,
      p_onboarding_completed: null,
      p_newsletter_subscribed: null,
      p_is_public_profile: profileData.is_public_profile ?? null,
      p_show_location: profileData.show_location ?? null,
    });

    if (error) {
      console.error("❌ Privacy settings RPC error:", error);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
            : "Failed to update privacy settings. Please try again.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/privacy");

    return { success: true };
  } catch (error) {
    console.error("Privacy settings update error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Upload station photo action
export async function uploadStationPhoto(
  data: UploadStationPhotoFormData
): Promise<{
  success: boolean;
  error?: string;
  data?: { photoId: string; imageUrl: string };
}> {
  try {
    const validationResult = uploadStationPhotoSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to upload photos.",
      };
    }

    const supabase = await createClient();

    // Check current photo count
    const { count, error: countError } = await supabase
      .from("user_station_photos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id);

    if (countError) {
      console.error("❌ Photo count query error:", countError);
      return {
        success: false,
        error: "Failed to check photo count. Please try again.",
      };
    }

    if ((count ?? 0) >= 5) {
      return {
        success: false,
        error: "Maximum 5 photos allowed. Please delete a photo first.",
      };
    }

    // Convert base64 to Buffer for ImageKit upload
    const base64Data =
      validatedData.fileData.split(",")[1] || validatedData.fileData;
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to ImageKit
    let imageKitResult;
    try {
      imageKitResult = await uploadToImageKit(
        buffer,
        currentUser.id,
        validatedData.fileName
      );
    } catch (error) {
      console.error("❌ ImageKit upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? `Failed to upload to ImageKit: ${error.message}`
            : "Failed to upload to ImageKit. Please try again.",
      };
    }

    // Get next sort_order
    const { data: existingPhotos } = await supabase
      .from("user_station_photos")
      .select("sort_order")
      .eq("user_id", currentUser.id)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder =
      existingPhotos && existingPhotos.length > 0
        ? (existingPhotos[0].sort_order ?? 0) + 1
        : 0;

    // Insert photo into database
    const { data: photo, error: insertError } = await supabase
      .from("user_station_photos")
      .insert({
        user_id: currentUser.id,
        image_url: imageKitResult.url,
        width: imageKitResult.width ?? null,
        height: imageKitResult.height ?? null,
        sort_order: nextSortOrder,
      })
      .select("id, image_url")
      .single();

    if (insertError) {
      console.error("❌ Photo insert error:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });

      // Try to delete from ImageKit if database insert fails
      try {
        await deleteFromImageKit(imageKitResult.fileId);
      } catch (deleteError) {
        console.warn(
          "Failed to clean up ImageKit file after database error:",
          deleteError
        );
      }

      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${insertError.message}${insertError.details ? ` (${insertError.details})` : ""}${insertError.hint ? ` - ${insertError.hint}` : ""}`
            : "Failed to save photo. Please try again.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        photoId: photo.id,
        imageUrl: photo.image_url,
      },
    };
  } catch (error) {
    console.error("Upload station photo error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Delete station photo action
export async function deleteStationPhoto(
  data: DeleteStationPhotoFormData
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const validationResult = deleteStationPhotoSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to delete photos.",
      };
    }

    const supabase = await createClient();

    // Get photo details and verify ownership
    const { data: photo, error: fetchError } = await supabase
      .from("user_station_photos")
      .select("id, image_url, user_id")
      .eq("id", validatedData.photoId)
      .single();

    if (fetchError || !photo) {
      return {
        success: false,
        error: "Photo not found.",
      };
    }

    if (photo.user_id !== currentUser.id) {
      return {
        success: false,
        error: "You don't have permission to delete this photo.",
      };
    }

    // Extract file ID from ImageKit URL
    // ImageKit URLs contain the file path, we need to query ImageKit API to get fileId
    // For now, we'll try to extract it from the URL or query ImageKit
    // The URL format is typically: https://ik.imagekit.io/{imagekitId}/{path}
    // We need to query ImageKit API to find the file by URL
    let fileId: string | null = null;

    try {
      // Query ImageKit API to find file by URL
      const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
      if (privateKey) {
        const token = Buffer.from(`${privateKey}:`).toString("base64");
        const url = new URL(photo.image_url);
        const path = url.pathname;

        // Query ImageKit to find file by path
        const searchResponse = await fetch(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(path)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = (await searchResponse.json()) as {
            files?: Array<{ fileId: string }>;
          };
          if (searchData.files && searchData.files.length > 0) {
            fileId = searchData.files[0].fileId;
          }
        }
      }
    } catch (error) {
      console.warn("Failed to query ImageKit for file ID:", error);
      // Continue with deletion even if we can't find the fileId
      // The file might have already been deleted or the URL might be invalid
    }

    // Delete from ImageKit if we have the fileId
    if (fileId) {
      try {
        await deleteFromImageKit(fileId);
      } catch (error) {
        console.warn("Failed to delete from ImageKit:", error);
        // Continue with database deletion even if ImageKit deletion fails
        // The file might have already been deleted
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("user_station_photos")
      .delete()
      .eq("id", validatedData.photoId)
      .eq("user_id", currentUser.id);

    if (deleteError) {
      console.error("❌ Photo delete error:", {
        message: deleteError.message,
        code: deleteError.code,
        details: deleteError.details,
        hint: deleteError.hint,
      });

      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${deleteError.message}${deleteError.details ? ` (${deleteError.details})` : ""}${deleteError.hint ? ` - ${deleteError.hint}` : ""}`
            : "Failed to delete photo. Please try again.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete station photo error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Upload avatar action
export async function uploadAvatar(data: UploadAvatarFormData): Promise<{
  success: boolean;
  error?: string;
  data?: { avatarUrl: string };
}> {
  try {
    const validationResult = uploadAvatarSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to upload an avatar.",
      };
    }

    // Convert base64 to Buffer for ImageKit upload
    const base64Data =
      validatedData.fileData.split(",")[1] || validatedData.fileData;
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to ImageKit
    let imageKitResult;
    try {
      imageKitResult = await uploadToImageKit(
        buffer,
        currentUser.id,
        validatedData.fileName
      );
    } catch (error) {
      console.error("❌ ImageKit upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? `Failed to upload to ImageKit: ${error.message}`
            : "Failed to upload to ImageKit. Please try again.",
      };
    }

    // Update avatar_url in user_profiles
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ avatar_url: imageKitResult.url })
      .eq("id", currentUser.id);

    if (updateError) {
      console.error("❌ Avatar update error:", {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
      });

      // Try to delete from ImageKit if database update fails
      try {
        await deleteFromImageKit(imageKitResult.fileId);
      } catch (deleteError) {
        console.warn(
          "Failed to clean up ImageKit file after database error:",
          deleteError
        );
      }

      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${updateError.message}${updateError.details ? ` (${updateError.details})` : ""}${updateError.hint ? ` - ${updateError.hint}` : ""}`
            : "Failed to save avatar. Please try again.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      data: {
        avatarUrl: imageKitResult.url,
      },
    };
  } catch (error) {
    console.error("Upload avatar error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Delete avatar action
export async function deleteAvatar(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to delete your avatar.",
      };
    }

    const supabase = await createClient();

    // Get current avatar URL
    const { data: profile, error: fetchError } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("id", currentUser.id)
      .single();

    if (fetchError || !profile) {
      return {
        success: false,
        error: "Profile not found.",
      };
    }

    if (!profile.avatar_url) {
      // No avatar to delete
      return { success: true };
    }

    // Try to delete from ImageKit (if it's an ImageKit URL)
    if (profile.avatar_url.includes("imagekit.io")) {
      try {
        // Query ImageKit to find file by URL path
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        if (privateKey) {
          const token = Buffer.from(`${privateKey}:`).toString("base64");
          const url = new URL(profile.avatar_url);
          const path = url.pathname;

          const searchResponse = await fetch(
            `https://api.imagekit.io/v1/files?path=${encodeURIComponent(path)}`,
            {
              method: "GET",
              headers: {
                Authorization: `Basic ${token}`,
              },
            }
          );

          if (searchResponse.ok) {
            const searchData = (await searchResponse.json()) as {
              files?: Array<{ fileId: string }>;
            };
            if (searchData.files && searchData.files.length > 0) {
              const fileId = searchData.files[0].fileId;
              await deleteFromImageKit(fileId);
            }
          }
        }
      } catch (error) {
        console.warn("Failed to delete from ImageKit:", error);
        // Continue with database update even if ImageKit deletion fails
      }
    }

    // Update avatar_url to null in database
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ avatar_url: null })
      .eq("id", currentUser.id);

    if (updateError) {
      console.error("❌ Avatar delete error:", {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
      });

      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${updateError.message}${updateError.details ? ` (${updateError.details})` : ""}${updateError.hint ? ` - ${updateError.hint}` : ""}`
            : "Failed to delete avatar. Please try again.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Delete avatar error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
