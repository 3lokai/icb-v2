"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import {
  type OnboardingFormData,
  onboardingSchema,
} from "@/lib/validations/onboarding";

type OnboardingData = OnboardingFormData;

function prepareProfileData(data: OnboardingData) {
  const profileData: {
    full_name: string;
    city?: string;
    state?: string;
    country?: string;
    gender?: string;
    experience_level?: string;
    preferred_brewing_methods?: string[];
    onboarding_completed: boolean;
    newsletter_subscribed?: boolean;
  } = {
    full_name: data.fullName,
    onboarding_completed: true,
  };

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
  if (data.newsletterSubscribed !== undefined) {
    profileData.newsletter_subscribed = data.newsletterSubscribed;
  }

  return profileData;
}

function prepareCoffeePreferences(data: OnboardingData) {
  const hasCoffeePrefs =
    data.roastLevels ||
    data.flavorProfiles ||
    data.processingMethods ||
    data.regions ||
    data.withMilkPreference !== undefined ||
    data.decafOnly !== undefined ||
    data.organicOnly !== undefined;

  if (!hasCoffeePrefs) {
    return null;
  }

  return {
    roast_levels: data.roastLevels,
    flavor_profiles: data.flavorProfiles,
    processing_methods: data.processingMethods,
    regions: data.regions,
    with_milk_preference: data.withMilkPreference,
    decaf_only: data.decafOnly,
    organic_only: data.organicOnly,
  };
}

function prepareNotificationPreferences(data: OnboardingData) {
  const hasNotificationPrefs =
    data.newRoasters !== undefined ||
    data.coffeeUpdates !== undefined ||
    data.platformUpdates !== undefined ||
    data.emailFrequency;

  if (!hasNotificationPrefs) {
    return null;
  }

  return {
    new_roasters: data.newRoasters,
    coffee_updates: data.coffeeUpdates,
    platform_updates: data.platformUpdates,
    email_frequency: data.emailFrequency,
  };
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
    p_city: profileData.city ?? null,
    p_state: profileData.state ?? null,
    p_country: profileData.country ?? null,
    p_gender: profileData.gender ?? null,
    p_experience_level: profileData.experience_level ?? null,
    p_preferred_brewing_methods: profileData.preferred_brewing_methods ?? null,
    p_onboarding_completed: profileData.onboarding_completed,
    p_newsletter_subscribed: profileData.newsletter_subscribed ?? true,
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
    // Don't fail the whole onboarding if preferences fail
  } else {
    console.log("✅ Coffee preferences saved via RPC");
  }
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

  // Use RPC function to safely upsert notification preferences
  const { error } = await supabase.rpc("upsert_notification_preferences", {
    p_user_id: userId,
    p_new_roasters: notificationPrefs.new_roasters ?? true,
    p_coffee_updates: notificationPrefs.coffee_updates ?? true,
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
    // Don't fail the whole onboarding if preferences fail
  } else {
    console.log("✅ Notification preferences saved via RPC");
  }
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
    const profileData = prepareProfileData(validatedData);
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
      await saveCoffeePreferences(supabase, currentUser.id, coffeePrefs);
    }

    // Save notification preferences if provided
    const notificationPrefs = prepareNotificationPreferences(validatedData);
    if (notificationPrefs) {
      await saveNotificationPreferences(
        supabase,
        currentUser.id,
        notificationPrefs
      );
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
