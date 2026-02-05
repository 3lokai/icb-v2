import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { fetchAnonProfile } from "@/lib/data/fetch-user-profile";
import { ProfilePage } from "@/components/profile/ProfilePage";
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
    // No anon_id found - redirect to home or show empty state
    // For now, show not found. In future, could redirect to home with message
    notFound();
  }

  // Fetch anon profile data (will return default profile even if empty)
  const profileData = await fetchAnonProfile(anonId);

  if (!profileData) {
    notFound();
  }

  // Show profile with isOwner=true (they own their local anon profile)
  // and isAnonymous=true
  return (
    <ProfilePage profileData={profileData} isOwner={true} isAnonymous={true} />
  );
}
