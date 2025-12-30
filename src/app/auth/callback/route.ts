import { type NextRequest, NextResponse } from "next/server";
import { getMyProfileDTO } from "@/data/user-dto";
import { createClient } from "@/lib/supabase/server";
import { sendSlackNotification } from "@/lib/notifications/slack";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL("/auth?mode=login&error=callback_failed", requestUrl.origin)
      );
    }

    // Check if this is a new user signup (user created within last 5 minutes)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if user has completed onboarding
    const profile = await getMyProfileDTO();

    if (user) {
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
    }
    if (!profile?.onboarding_completed) {
      // Redirect to onboarding if not completed
      return NextResponse.redirect(
        new URL("/auth/onboarding", requestUrl.origin)
      );
    }

    // Success - redirect to dashboard or intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided - redirect back to auth page
  return NextResponse.redirect(
    new URL("/auth?mode=login&error=no_code", requestUrl.origin)
  );
}
