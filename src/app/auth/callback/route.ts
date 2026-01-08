import { type NextRequest, NextResponse } from "next/server";
import { getMyProfileDTO } from "@/data/user-dto";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendSlackNotification } from "@/lib/notifications/slack";
import { sendWelcomeEmail } from "@/lib/emails/resend";
import { subscribeToConvertKit } from "@/lib/convertkit/client";

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
      // New user signup - send Slack notification and welcome email
      const name =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        null;

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
        name: name || "Unknown",
        method,
      }).catch((err) => {
        console.error("Failed to send signup notification:", err);
      });

      // Send welcome email (fire and forget)
      if (user.email) {
        sendWelcomeEmail({
          email: user.email,
          name,
        }).catch((err) => {
          console.error("Failed to send welcome email:", err);
        });
      }

      // Sync to ConvertKit if newsletter_subscribed is true (default)
      if (user.email && (profile?.newsletter_subscribed ?? true)) {
        const serviceClient = await createServiceRoleClient();

        // Get full profile data for custom fields
        const { data: fullProfile } = await serviceClient
          .from("user_profiles")
          .select("experience_level, city, state, country")
          .eq("id", user.id)
          .single();

        // Get user roles
        const { data: roles } = await serviceClient
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        const userRoles = roles?.map((r) => r.role) || [];
        const signupSource =
          method === "google"
            ? "oauth-google"
            : method === "facebook"
              ? "oauth-facebook"
              : "user-registration";

        // Sync to ConvertKit (fire and forget)
        subscribeToConvertKit({
          email_address: user.email,
          first_name: name,
          state: "active",
          fields: {
            "Signup Source": signupSource,
            ...(userRoles.length > 0 && { "User Role": userRoles[0] }),
            ...(fullProfile?.experience_level && {
              "Experience Level": fullProfile.experience_level,
            }),
            ...(fullProfile?.city || fullProfile?.state || fullProfile?.country
              ? {
                  Location: [
                    fullProfile.city,
                    fullProfile.state,
                    fullProfile.country,
                  ]
                    .filter(Boolean)
                    .join(", "),
                }
              : {}),
          },
        })
          .then((response) => {
            // Store subscriber ID if we got a response
            if (response?.subscriber?.id) {
              Promise.resolve(
                serviceClient
                  .from("user_profiles")
                  .update({ convertkit_subscriber_id: response.subscriber.id })
                  .eq("id", user.id)
              )
                .then((result) => {
                  if (result.error) {
                    throw result.error;
                  }
                  console.log(
                    `[ConvertKit] Stored subscriber ID ${response.subscriber.id} for user ${user.id}`
                  );
                })
                .catch((err: unknown) => {
                  console.error(
                    "[ConvertKit] Failed to store subscriber ID:",
                    err
                  );
                });
            }
          })
          .catch((err) => {
            // Already logged in subscribeToConvertKit
            console.error("[ConvertKit] OAuth signup sync error:", err);
          });
      }
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
