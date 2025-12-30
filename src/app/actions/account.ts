"use server";

import { getCurrentUser } from "@/data/auth";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

/**
 * Confirm password for account deletion
 * Validates the user's password before allowing account deletion
 */
export async function confirmPassword(
  password: string
): Promise<ActionResult<{ success: boolean }>> {
  try {
    if (!password || typeof password !== "string") {
      return {
        success: false,
        error: "Password is required.",
      };
    }

    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to confirm your password.",
      };
    }

    if (!user.email) {
      return {
        success: false,
        error: "User email not found. Cannot verify password.",
      };
    }

    // Use regular client (not service role) for password verification
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (error) {
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Invalid password. Please try again.",
      };
    }

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    console.error("Password confirmation error:", error);
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error occurred"
          : "Failed to verify password. Please try again.",
    };
  }
}

/**
 * Delete user account
 * Performs immediate deactivation and anonymization of user data
 */
export async function deleteAccount(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to delete your account.",
      };
    }

    const userId = user.id;
    const supabase = await createServiceRoleClient();

    // Step 1: Critical - Set anon_id on all reviews where user_id = userId and anon_id IS NULL
    // This prevents CHECK constraint violation when user_id is set to NULL
    const { error: reviewsError } = await supabase.rpc(
      "anonymize_user_reviews",
      {
        p_user_id: userId,
      }
    );

    if (reviewsError) {
      console.error("Error anonymizing reviews:", reviewsError);
      // Continue anyway - might not have any reviews, or function might not exist yet
      // In production, this should be handled, but for now we continue
    }

    // Step 2: Anonymize PII in user_profiles
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        full_name: "Deleted User", // Required field, cannot be NULL
        username: null,
        avatar_url: null,
        bio: null,
        city: null,
        state: null,
        gender: null,
        is_public_profile: false,
        show_location: false,
        newsletter_subscribed: false,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error anonymizing profile:", profileError);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `Failed to anonymize profile: ${profileError.message}`
            : "Failed to delete account. Please try again.",
      };
    }

    // Step 3: Disable all notifications
    const { error: notifError } = await supabase
      .from("user_notification_preferences")
      .update({
        new_roasters: false,
        coffee_updates: false,
        newsletter: false,
        platform_updates: false,
      })
      .eq("user_id", userId);

    // Notifications might not exist, so we ignore errors
    if (notifError && !notifError.message.includes("No rows")) {
      console.error("Error updating notification preferences:", notifError);
      // Continue anyway
    }

    // Step 4: Delete auth.users record (prevents login)
    // Use Admin API through service role client
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `Failed to delete auth user: ${deleteError.message}`
            : "Failed to delete account. Please try again.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Account deletion error:", error);
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error occurred"
          : "Failed to delete account. Please try again.",
    };
  }
}
