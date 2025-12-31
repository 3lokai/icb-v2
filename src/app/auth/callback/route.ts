import { type NextRequest, NextResponse } from "next/server";
import { getMyProfileDTO } from "@/data/user-dto";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendSlackNotification } from "@/lib/notifications/slack";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  // Handle Supabase OAuth errors
  if (error) {
    console.error("OAuth error from Supabase:", {
      error,
      errorDescription: errorDescription
        ? decodeURIComponent(errorDescription)
        : null,
    });

    // If it's a database error creating the user, the user might still exist
    // Try to check if we can recover
    if (
      error === "server_error" &&
      errorDescription?.includes("Database error")
    ) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If user exists, try to manually create profile and continue
      if (user) {
        try {
          const profile = await getMyProfileDTO();
          if (!profile) {
            // Profile doesn't exist - redirect to onboarding to create it
            return NextResponse.redirect(
              new URL("/auth/onboarding", requestUrl.origin)
            );
          }
          // Profile exists - continue normally
          if (!profile.onboarding_completed) {
            return NextResponse.redirect(
              new URL("/auth/onboarding", requestUrl.origin)
            );
          }
          return NextResponse.redirect(new URL(next, requestUrl.origin));
        } catch {
          // Profile fetch failed - redirect to onboarding
          return NextResponse.redirect(
            new URL("/auth/onboarding", requestUrl.origin)
          );
        }
      }
    }

    // For other errors, redirect to auth page with error message
    const errorMessage =
      errorDescription && errorDescription.includes("Database error")
        ? "account_creation_failed"
        : "oauth_failed";
    return NextResponse.redirect(
      new URL(`/auth?error=${errorMessage}`, requestUrl.origin)
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL("/auth?error=callback_failed", requestUrl.origin)
      );
    }

    // Check if this is a new user signup (user created within last 5 minutes)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user found after code exchange");
      return NextResponse.redirect(
        new URL("/auth?error=callback_failed", requestUrl.origin)
      );
    }

    // Check if user has completed onboarding
    let profile;
    try {
      profile = await getMyProfileDTO();
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Profile might not exist yet - try to create a minimal one
      profile = null;
    }

    // If profile doesn't exist, try to create a minimal one
    if (!profile) {
      try {
        const serviceClient = await createServiceRoleClient();
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          (user.email ? user.email.split("@")[0] : "User");
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          user.user_metadata?.photo_url ||
          null;

        const { data: newProfile, error: insertError } = await serviceClient
          .from("user_profiles")
          .insert({
            id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            email_verified: user.email_confirmed_at ? true : false,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Failed to create profile:", insertError);
          // Profile creation failed - redirect to onboarding where user can create it
          return NextResponse.redirect(
            new URL("/auth/onboarding", requestUrl.origin)
          );
        }

        profile = {
          id: newProfile.id,
          full_name: newProfile.full_name,
          onboarding_completed: newProfile.onboarding_completed || false,
        } as any;
      } catch (error) {
        console.error("Error creating profile:", error);
        // Profile creation failed - redirect to onboarding
        return NextResponse.redirect(
          new URL("/auth/onboarding", requestUrl.origin)
        );
      }
    }

    // Check if this is a new user signup (user created within last 5 minutes)
    const userCreatedAt = new Date(user.created_at);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (userCreatedAt > fiveMinutesAgo) {
      // New user signup - send Slack notification
      const name =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Unknown";

      // Determine signup method
      let method: "email" | "google" | "facebook" = "email";
      if (user.app_metadata?.provider === "google") {
        method = "google";
      } else if (user.app_metadata?.provider === "facebook") {
        method = "facebook";
      } else if (user.identities && user.identities.length > 0) {
        const provider = user.identities[0]?.provider;
        if (provider === "google") method = "google";
        else if (provider === "facebook") method = "facebook";
      }

      // Fire and forget - don't await
      sendSlackNotification("signup", {
        email: user.email || "unknown@example.com",
        name,
        method,
      }).catch((err) => {
        console.error("Failed to send signup notification:", err);
      });
    }

    // Redirect to onboarding if profile doesn't exist or onboarding not completed
    if (!profile || !profile.onboarding_completed) {
      return NextResponse.redirect(
        new URL("/auth/onboarding", requestUrl.origin)
      );
    }

    // Success - redirect to dashboard or intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided - redirect back to auth page
  return NextResponse.redirect(
    new URL("/auth?error=no_code", requestUrl.origin)
  );
}
