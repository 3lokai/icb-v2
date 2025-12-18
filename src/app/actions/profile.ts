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
  const { error } = await supabase.from("user_profiles").upsert(
    {
      id: userId,
      ...profileData,
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: "Failed to save profile. Please try again.",
    };
  }

  return { success: true };
}

async function saveCoffeePreferences(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  coffeePrefs: NonNullable<ReturnType<typeof prepareCoffeePreferences>>
) {
  const { error } = await supabase.from("user_coffee_preferences").upsert(
    {
      user_id: userId,
      ...coffeePrefs,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Coffee preferences error:", error);
    // Don't fail the whole onboarding if preferences fail
  }
}

async function saveNotificationPreferences(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  notificationPrefs: NonNullable<
    ReturnType<typeof prepareNotificationPreferences>
  >
) {
  const { error } = await supabase.from("user_notification_preferences").upsert(
    {
      user_id: userId,
      ...notificationPrefs,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Notification preferences error:", error);
    // Don't fail the whole onboarding if preferences fail
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
    const profileResult = await saveUserProfile(
      supabase,
      currentUser.id,
      profileData
    );

    if (!profileResult.success) {
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
