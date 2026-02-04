"use client";

import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileRatings } from "./ProfileRatings";
import { ProfileTasteProfile } from "./ProfileTasteProfile";
import { ProfileSelections } from "./ProfileSelections";
import { ProfileGearStation } from "./ProfileGearStation";
import type { UserProfileFull } from "@/types/profile-types";
import { formatDistanceToNow } from "date-fns";

type ProfilePageProps = {
  profileData: UserProfileFull;
  isOwner: boolean;
  isAnonymous?: boolean;
};

export function ProfilePage({
  profileData,
  isOwner,
  isAnonymous = false,
}: ProfilePageProps) {
  const {
    profile,
    ratings,
    selections,
    taste_profile,
    gear,
    station_photos,
    coffee_preferences,
  } = profileData;

  if (!profile) {
    return null;
  }

  // Transform ratings for component (include slugs for nested coffee links)
  const formattedRatings = ratings.map((rating) => ({
    id: rating.id,
    name: rating.coffee_name,
    roaster: rating.roaster_name,
    rating: rating.rating,
    date: formatDistanceToNow(new Date(rating.created_at), { addSuffix: true }),
    comment: rating.comment || undefined,
    image: rating.image_url || undefined,
    coffeeSlug: rating.coffee_slug || undefined,
    roasterSlug: rating.roaster_slug || undefined,
  }));

  // Transform selections for component (include slugs for nested coffee links)
  // Only show coffees with rating > 3
  const formattedSelections = selections
    .filter((selection) => selection.rating > 3)
    .map((selection) => {
      const imageUrl =
        selection.image_url && selection.image_url.trim() !== ""
          ? selection.image_url
          : undefined;

      return {
        id: selection.review_id,
        name: selection.coffee_name,
        roaster: selection.roaster_name,
        note: selection.comment || "Recommended",
        image: imageUrl,
        coffeeSlug: selection.coffee_slug || undefined,
        roasterSlug: selection.roaster_slug || undefined,
        coffeeId: selection.coffee_id,
      };
    });

  // Transform taste profile for component
  // Map roast levels to display labels
  const roastLabels: Record<string, string> = {
    light: "Light",
    light_medium: "Light-Medium",
    medium: "Medium",
    medium_dark: "Medium-Dark",
    dark: "Dark",
  };

  const formattedRoasts = taste_profile.top_roast_levels.map(
    (roast) => roastLabels[roast] || roast
  );

  // Map brew methods to display labels (capitalize first letter)
  const formattedMethods = taste_profile.top_brew_methods.map((method) => {
    // Convert snake_case to Title Case
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  // For tendencies, we'll use flavor notes (simplified for now)
  // In a full implementation, you'd fetch flavor note labels from the database
  const tendencies =
    taste_profile.top_flavor_note_ids.length > 0
      ? [`${taste_profile.top_flavor_note_ids.length} flavor preferences`]
      : [];

  const formattedTasteProfile = {
    roasts: formattedRoasts,
    methods: formattedMethods,
    tendencies,
  };

  return (
    <div className="min-h-screen bg-background">
      <Section spacing="default" className="pt-24">
        <Stack gap="12">
          {/* 1. Identity Header */}
          <ProfileHeader
            name={profile.full_name}
            avatarUrl={profile.avatar_url || undefined}
            city={profile.city || undefined}
            state={profile.state || undefined}
            country={profile.country || undefined}
            bio={profile.bio || undefined}
            isOwner={isOwner}
            isAnonymous={isAnonymous}
            coffeePreferences={coffee_preferences}
          />
          {/* 4. Selections (Recommendations) */}
          <ProfileSelections
            selections={formattedSelections}
            username={profile.username}
            isOwner={isOwner}
            isAnonymous={isAnonymous}
          />

          {/* 5. Gear & Coffee Station */}
          <ProfileGearStation
            gear={gear}
            photos={station_photos}
            username={profile.username}
            isOwner={isOwner}
            isAnonymous={isAnonymous}
          />
          {/* 2. Ratings (Hero) */}
          <ProfileRatings
            ratings={formattedRatings}
            isOwner={isOwner}
            isAnonymous={isAnonymous}
          />

          {/* 3. Taste Profile (Owner or Anon) */}
          {(isOwner || isAnonymous) && (
            <ProfileTasteProfile
              profile={formattedTasteProfile}
              totalReviews={taste_profile.total_reviews}
              isAnonymous={isAnonymous}
            />
          )}

          {/* 6. Final CTA for Anon */}
          {isAnonymous && (
            <Section
              spacing="default"
              className="border-t border-border/20 pt-16 bg-muted/10 -mx-10 px-10 rounded-[3rem]"
            >
              <Stack gap="8" className="text-center items-center">
                <Stack gap="2">
                  <h2 className="text-heading font-serif italic text-accent">
                    Ready to make it official?
                  </h2>
                  <p className="text-body-large text-muted-foreground max-w-lg">
                    Join other coffee lovers tracking their journey. Your
                    anonymous ratings will be automatically ported to your new
                    account.
                  </p>
                </Stack>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="rounded-full px-8 shadow-xl hover-lift"
                    >
                      Create Your Profile
                    </Button>
                  </Link>
                  <Link href="/coffees">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 hover-lift"
                    >
                      Explore More Coffees
                    </Button>
                  </Link>
                </div>
              </Stack>
            </Section>
          )}
        </Stack>
      </Section>
    </div>
  );
}
