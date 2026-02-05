import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

export const metadata = generateSEOMetadata({
  title: "Profile | Indian Coffee Beans",
  description: "Your personal coffee record and discovery profile.",
  canonical: `${baseUrl}/profile`,
  noIndex: true,
});

export default async function ProfileRedirectPage() {
  // Get current user
  const { user } = await serverAuth.getUser();

  if (!user) {
    // Not authenticated - redirect to login or home
    redirect("/");
  }

  const supabase = await createClient();

  // Ensure user_profiles row exists (creates if missing, e.g. before trigger existed)
  const fullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    (user.email ? user.email.split("@")[0] : null) ??
    "User";

  if (process.env.NODE_ENV === "development") {
    console.log("[ProfileRedirectPage] Ensuring profile exists:", {
      userId: user.id,
      fullName,
      email: user.email,
    });
  }

  const { error: upsertError } = await supabase.rpc("upsert_user_profile", {
    p_user_id: user.id,
    p_full_name: fullName,
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
    p_is_public_profile: null,
    p_show_location: null,
  });

  if (upsertError && process.env.NODE_ENV === "development") {
    console.error("[ProfileRedirectPage] Upsert error:", upsertError);
  }

  // Fetch user's username from profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("username, id")
    .eq("id", user.id)
    .single();

  if (profileError && process.env.NODE_ENV === "development") {
    console.error("[ProfileRedirectPage] Profile fetch error:", profileError);
  }

  // Use username if available, otherwise fallback to UUID (lowercase for consistent URL)
  const profileIdentifier = profile?.username ?? user.id.toLowerCase();

  if (process.env.NODE_ENV === "development") {
    console.log("[ProfileRedirectPage] Redirecting to:", {
      profileIdentifier,
      hasUsername: !!profile?.username,
      redirectUrl: `/profile/${profileIdentifier}`,
    });
  }

  // Redirect to user's profile page
  redirect(`/profile/${profileIdentifier}`);
}
