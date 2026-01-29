import { notFound } from "next/navigation";
import { fetchUserProfileByUsername } from "@/lib/data/fetch-user-profile";
import { serverAuth } from "@/lib/supabase/auth-helpers";
import { ProfilePage } from "@/components/profile/ProfilePage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  // Try to fetch profile for metadata (without viewer check for public profiles)
  const profileData = await fetchUserProfileByUsername(username);

  if (!profileData?.profile) {
    return {
      title: "Profile Not Found | Indian Coffee Beans",
      description: "The requested profile could not be found.",
    };
  }

  const { profile } = profileData;
  const displayName = profile.full_name || profile.username || "User";
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const profileUrl = `${baseUrl}/profile/${username}`;
  const ogImageUrl = `${baseUrl}/api/og/profile/${username}/selections`;

  return {
    title: `${displayName} | Indian Coffee Beans`,
    description:
      profile.bio ||
      `View ${displayName}'s coffee profile, ratings, and recommendations.`,
    openGraph: {
      title: `${displayName} | Indian Coffee Beans`,
      description:
        profile.bio ||
        `View ${displayName}'s coffee profile, ratings, and recommendations.`,
      url: profileUrl,
      siteName: "Indian Coffee Beans",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName}'s profile`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} | Indian Coffee Beans`,
      description:
        profile.bio ||
        `View ${displayName}'s coffee profile, ratings, and recommendations.`,
      images: [ogImageUrl],
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  // Get current viewer for privacy checks
  const { user: viewer } = await serverAuth.getUser();
  const viewerId = viewer?.id;

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[UserProfilePage] Fetching profile:", {
      username,
      viewerId,
    });
  }

  // Fetch profile data
  const profileData = await fetchUserProfileByUsername(username, viewerId);

  if (!profileData) {
    if (process.env.NODE_ENV === "development") {
      console.error("[UserProfilePage] Profile not found, calling notFound()", {
        username,
        viewerId,
      });
    }
    notFound();
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[UserProfilePage] Profile found:", {
      profileId: profileData.profile?.id,
      username: profileData.profile?.username,
      fullName: profileData.profile?.full_name,
      ratingsCount: profileData.ratings.length,
      selectionsCount: profileData.selections.length,
    });
  }

  const isOwner = viewerId === profileData.profile?.id;

  return <ProfilePage profileData={profileData} isOwner={isOwner} />;
}
