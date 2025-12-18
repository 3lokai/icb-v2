import { type NextRequest, NextResponse } from "next/server";
import { getMyProfileDTO } from "@/data/user-dto";
import { createClient } from "@/lib/supabase/server";

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

    // Check if user has completed onboarding
    const profile = await getMyProfileDTO();
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
