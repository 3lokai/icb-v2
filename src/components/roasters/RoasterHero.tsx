"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import type { RoasterDetail } from "@/types/roaster-types";
import type { EntityReviewStats } from "@/types/review-types";
import { roasterImagePresets } from "@/lib/imagekit";
import { Icon, type IconName } from "@/components/common/Icon";
import { useImageColor } from "@/hooks/useImageColor";
import { Band } from "@/components/primitives/band";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Tag, { TagList } from "@/components/common/Tag";
import { trackRoasterClick } from "@/lib/analytics";
import {
  trackRoasterConversion,
  trackRoasterEngagement,
} from "@/lib/analytics/enhanced-tracking";
import { capture } from "@/lib/posthog";

function hasValues(arr: string[] | null | undefined): arr is string[] {
  return Array.isArray(arr) && arr.length > 0;
}

type RoasterHeroProps = {
  roaster: RoasterDetail;
  stats: EntityReviewStats | null;
};

/**
 * Hero/overview section. Client (interactive rate button, tracking, adaptive
 * logo bg) but receives roaster + stats as PROPS — no data hooks — so its SSR
 * output already matches hydration and it never reflows. UI is unchanged.
 */
export function RoasterHero({ roaster, stats }: RoasterHeroProps) {
  // GA + Tracking (mount)
  useEffect(() => {
    trackRoasterEngagement(roaster.id, "profile_view", {
      coffeeCount: roaster.coffee_count ?? undefined,
    });
    capture("rating_page_viewed", {
      entity_type: "roaster" as const,
      entity_id: roaster.id,
      roaster_slug: roaster.slug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roaster.id]);

  const logoUrl = useMemo(() => {
    if (!roaster?.slug) return null;
    return roasterImagePresets.roasterLogo(`roasters/${roaster.slug}-logo`);
  }, [roaster]);

  const { isDark } = useImageColor(logoUrl);

  const defaultBg =
    "bg-[radial-gradient(circle_at_center,var(--muted)_0%,var(--background)_100%)]";
  const darkContrastBg =
    "bg-[radial-gradient(circle_at_center,oklch(0.24_0.014_59.46)_0%,oklch(0.195_0.01_59.58)_100%)]";
  const lightContrastBg =
    "bg-[radial-gradient(circle_at_center,oklch(0.965_0.015_79.92)_0%,oklch(0.982_0.009_79.92)_100%)]";

  const logoBgClass = isDark
    ? `${darkContrastBg} dark:${defaultBg}`
    : `${defaultBg} dark:${lightContrastBg}`;

  // Location string
  const locationParts: string[] = [];
  if (roaster.hq_city) locationParts.push(roaster.hq_city);
  if (roaster.hq_state) locationParts.push(roaster.hq_state);
  if (roaster.hq_country) locationParts.push(roaster.hq_country);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;

  // Social Links
  const socialLinks: Array<{ label: string; url: string; icon: IconName }> = [];
  if (roaster.website) {
    socialLinks.push({ label: "Website", url: roaster.website, icon: "Globe" });
  }
  if (roaster.instagram_handle) {
    const instagramUrl = roaster.instagram_handle.startsWith("http")
      ? roaster.instagram_handle
      : `https://instagram.com/${roaster.instagram_handle.replace(/^@/, "")}`;
    socialLinks.push({
      label: "Instagram",
      url: instagramUrl,
      icon: "InstagramLogo",
    });
  }
  if (roaster.social_json && typeof roaster.social_json === "object") {
    const social = roaster.social_json as Record<string, unknown>;
    if (social.twitter && typeof social.twitter === "string") {
      socialLinks.push({
        label: "Twitter",
        url: social.twitter.startsWith("http")
          ? social.twitter
          : `https://twitter.com/${social.twitter.replace(/^@/, "")}`,
        icon: "TwitterLogo",
      });
    }
    if (social.facebook && typeof social.facebook === "string") {
      socialLinks.push({
        label: "Facebook",
        url: social.facebook,
        icon: "FacebookLogo",
      });
    }
  }

  const handleScrollToRating = () => {
    document
      .getElementById("rate-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Band id="overview" className="py-10 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
        {/* Logo Column */}
        <div className="w-full max-w-sm mx-auto md:mx-0">
          <div
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md",
              logoBgClass
            )}
          >
            {roaster.slug ? (
              <Image
                alt={`${roaster.name} logo`}
                className="object-contain p-8 md:p-12"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                src={roasterImagePresets.roasterLogo(
                  `roasters/${roaster.slug}-logo`
                )}
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                <Icon name="Storefront" size={84} />
              </div>
            )}
          </div>
        </div>

        {/* Info Column */}
        <Stack gap="6" className="pt-2">
          <Stack gap="1">
            <h1 className="text-display italic leading-[1.1] text-balance">
              {roaster.name}
            </h1>
            {location && (
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Icon name="MapPin" size={14} className="text-accent/60" />
                <span className="text-label uppercase tracking-widest">
                  {location}
                </span>
              </div>
            )}
            <p className="text-body-muted mt-3 max-w-xl leading-relaxed">
              {stats?.review_count &&
              stats.review_count >= 5 &&
              stats.avg_rating != null
                ? `Community-rated ${stats.avg_rating.toFixed(1)}/5 from ${stats.review_count} reviews. ${roaster.coffee_count ?? 0} ${(roaster.coffee_count ?? 0) === 1 ? "coffee" : "coffees"} cataloged with tasting notes and unbiased ratings from Indian coffee drinkers.`
                : `${roaster.coffee_count ?? 0} ${(roaster.coffee_count ?? 0) === 1 ? "coffee" : "coffees"} cataloged with tasting notes. Rate ${roaster.name} and help build India's neutral specialty coffee directory.`}
            </p>
          </Stack>

          {/* Rating + Basic Stats */}
          <div className="flex flex-wrap items-center gap-4">
            {stats && stats.review_count ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-card">
                <Icon
                  name="Star"
                  size={16}
                  className="fill-rating text-rating"
                />
                <span className="text-heading text-foreground">
                  {stats.avg_rating?.toFixed(1)}
                </span>
                <span className="text-caption text-muted-foreground ml-1">
                  ({stats.review_count})
                </span>
              </div>
            ) : (
              <span className="text-body-muted italic text-caption">
                Be the first to rate
              </span>
            )}
          </div>

          {(hasValues(roaster.certifications) ||
            hasValues(roaster.specialty_focus) ||
            hasValues(roaster.sourcing_model)) && (
            <div className="surface-1 rounded-xl p-4 border border-border/40">
              <Stack gap="3">
                <p className="text-overline tracking-[0.2em] text-muted-foreground">
                  At a glance
                </p>
                {hasValues(roaster.certifications) && (
                  <Stack gap="2">
                    <p className="text-label text-muted-foreground">
                      Certifications
                    </p>
                    <TagList>
                      {roaster.certifications.map((item) => (
                        <Tag key={item} variant="outline" size="micro">
                          {item}
                        </Tag>
                      ))}
                    </TagList>
                  </Stack>
                )}
                {hasValues(roaster.specialty_focus) && (
                  <Stack gap="2">
                    <p className="text-label text-muted-foreground">
                      Specialty focus
                    </p>
                    <TagList>
                      {roaster.specialty_focus.map((item) => (
                        <Tag key={item} variant="outline" size="micro">
                          {item}
                        </Tag>
                      ))}
                    </TagList>
                  </Stack>
                )}
                {hasValues(roaster.sourcing_model) && (
                  <Stack gap="2">
                    <p className="text-label text-muted-foreground">
                      Sourcing model
                    </p>
                    <TagList>
                      {roaster.sourcing_model.map((item) => (
                        <Tag key={item} variant="outline" size="micro">
                          {item}
                        </Tag>
                      ))}
                    </TagList>
                  </Stack>
                )}
              </Stack>
            </div>
          )}

          {/* CTAs */}
          <Cluster gap="3" className="pt-2">
            <Button
              id="roaster-rate-hero"
              size="lg"
              className="bg-primary shadow-sm hover:shadow-md transition-shadow min-w-[170px]"
              onClick={handleScrollToRating}
            >
              <Icon
                name="Star"
                size={18}
                className="mr-2 fill-rating text-rating"
              />
              Rate Roaster
            </Button>
            {roaster.website && (
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-muted-foreground min-w-[170px]"
              >
                <a
                  href={roaster.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackRoasterClick(roaster.id, "website");
                    trackRoasterConversion(roaster.id, "website_click");
                  }}
                >
                  <Icon name="Globe" size={18} className="mr-2" />
                  Website
                </a>
              </Button>
            )}
          </Cluster>

          {/* Socials */}
          {socialLinks.length > 0 && (
            <Cluster gap="2" className="pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all border border-border/40 bg-background shadow-sm"
                  title={link.label}
                  aria-label={`${roaster.name} on ${link.label}`}
                >
                  <Icon name={link.icon} size={18} aria-hidden="true" />
                </a>
              ))}
            </Cluster>
          )}
        </Stack>
      </div>
    </Band>
  );
}
