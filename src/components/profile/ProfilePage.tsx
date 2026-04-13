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
import { ProfileAtAGlance } from "./ProfileAtAGlance";
import {
  ProfileScrollspyTabBar,
  useProfileSectionScrollspy,
} from "./ProfileSectionTabs";
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
  const activeSection = useProfileSectionScrollspy();

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

  const profileRevalidatePath = isAnonymous
    ? "/profile/anon"
    : `/profile/${(profile.username?.trim() || profile.id).toLowerCase()}`;

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

  const formattedMethods = taste_profile.top_brew_methods.map((method) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  const tier =
    taste_profile.total_reviews >= 10
      ? 3
      : taste_profile.total_reviews >= 5
        ? 2
        : 1;

  const getPersona = () => {
    const {
      top_roast_levels,
      top_processes,
      top_species,
      single_origin_pct,
      distinct_roaster_count,
      total_reviews,
      avg_rating,
    } = taste_profile;

    const explorationIndex =
      total_reviews > 0 ? distinct_roaster_count / total_reviews : 0;

    if (
      top_roast_levels.includes("light") &&
      top_processes.includes("washed") &&
      explorationIndex > 0.6
    )
      return "Third Wave Explorer";
    if (
      top_roast_levels.includes("light") &&
      top_processes.includes("natural") &&
      (single_origin_pct || 0) > 0.7
    )
      return "Natural Process Purist";
    if (top_roast_levels.includes("dark") && (single_origin_pct || 0) < 0.3)
      return "Classic Blend Enthusiast";
    if (distinct_roaster_count >= 8 && total_reviews >= 10)
      return "Roaster Hopper";
    if (top_species.includes("robusta") && top_processes.includes("monsooned"))
      return "South Indian Traditionalist";
    if (total_reviews >= 5 && (avg_rating || 0) < 3.0)
      return "Discerning Palate";
    if (total_reviews >= 5 && (avg_rating || 0) > 4.2)
      return "Coffee Evangelist";
    if (explorationIndex < 0.3 && total_reviews >= 5) return "Loyal Loyalist";

    return "Coffee Enthusiast";
  };

  const persona = getPersona();

  const enrichedTasteProfile = {
    ...taste_profile,
    roasts: formattedRoasts,
    methods: formattedMethods,
    persona,
    tier,
  };

  const hasEnoughRatings = taste_profile.total_reviews >= 3;

  return (
    <div className="min-h-screen bg-background">
      <Section spacing="default" className="pt-24" contained={false}>
        <Stack gap="8">
          <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(260px,320px)] lg:grid-cols-[1fr_minmax(280px,340px)] gap-8 lg:gap-12 items-start">
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
              <ProfileAtAGlance
                totalReviews={taste_profile.total_reviews}
                avgRating={taste_profile.avg_rating}
                distinctRoasterCount={taste_profile.distinct_roaster_count}
                selectionsCount={formattedSelections.length}
                tier={tier}
                persona={persona}
                isOwner={isOwner}
                isAnonymous={isAnonymous}
                className="md:sticky md:top-28"
              />
            </div>
          </div>

          <ProfileScrollspyTabBar activeId={activeSection} />

          <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <Stack gap="16" className="md:gap-20">
              <section
                id="insights"
                className="scroll-mt-40"
                aria-label="Taste insights"
              >
                <ProfileTasteProfile
                  profile={enrichedTasteProfile}
                  isOwner={isOwner}
                  isAnonymous={isAnonymous}
                  showStatBar={!hasEnoughRatings}
                  selectionsCount={formattedSelections.length}
                />
              </section>

              <section
                id="selections"
                className="scroll-mt-40"
                aria-label="Selections"
              >
                <ProfileSelections
                  selections={formattedSelections}
                  username={profile.username}
                  revalidateProfilePath={profileRevalidatePath}
                  isOwner={isOwner}
                  isAnonymous={isAnonymous}
                />
              </section>

              <section
                id="ratings"
                className="scroll-mt-40"
                aria-label="Ratings"
              >
                <ProfileRatings
                  ratings={formattedRatings}
                  isOwner={isOwner}
                  isAnonymous={isAnonymous}
                />
              </section>

              <section
                id="gear-station"
                className="scroll-mt-40"
                aria-label="Gear and station"
              >
                <ProfileGearStation
                  gear={gear}
                  photos={station_photos}
                  username={profile.username}
                  isOwner={isOwner}
                  isAnonymous={isAnonymous}
                />
              </section>

              {isAnonymous && (
                <div className="border-t border-border/20 pt-16 pb-8 bg-muted/10 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 rounded-[2rem] md:rounded-[3rem]">
                  <Stack gap="8" className="text-center items-center">
                    <Stack gap="2">
                      <h2 className="text-heading font-serif italic text-accent m-0">
                        Ready to make it official?
                      </h2>
                      <p className="text-body-large text-muted-foreground max-w-lg m-0">
                        Join other coffee lovers tracking their journey. Your
                        anonymous ratings will be automatically ported to your
                        new account.
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
                </div>
              )}
            </Stack>
          </div>
        </Stack>
      </Section>
    </div>
  );
}
