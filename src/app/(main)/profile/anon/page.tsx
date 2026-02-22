import { cookies } from "next/headers";
import { fetchAnonProfile } from "@/lib/data/fetch-user-profile";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { EnsureAnonIdAndRefresh } from "@/components/profile/EnsureAnonIdAndRefresh";
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

export const metadata: Metadata = generateSEOMetadata({
  title: "My Profile | Indian Coffee Beans",
  description: "View your anonymous profile, ratings, and recommendations.",
  canonical: `${baseUrl}/profile/anon`,
  noIndex: true,
});

export default async function AnonProfilePage() {
  // Get anon_id from cookies
  const cookieStore = await cookies();
  const anonId = cookieStore.get("icb_anon_id")?.value;

  if (!anonId) {
    return <EnsureAnonIdAndRefresh />;
  }

  // Fetch anon profile data (will return default profile even if empty)
  const profileData = await fetchAnonProfile(anonId);

  if (!profileData) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  // Show profile with isOwner=true (they own their local anon profile)
  // and isAnonymous=true (profileData is non-null after check above)
  return (
    <ProfilePage
      profileData={profileData as NonNullable<typeof profileData>}
      isOwner={true}
      isAnonymous={true}
    />
  );
}
