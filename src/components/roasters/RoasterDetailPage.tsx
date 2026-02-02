"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RoasterDetail } from "@/types/roaster-types";
import { roasterImagePresets } from "@/lib/imagekit";
import { Icon } from "@/components/common/Icon";

import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReviewSection } from "@/components/reviews";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";
import { trackRoasterClick } from "@/lib/analytics";
import {
  trackRoasterConversion,
  trackRoasterEngagement,
} from "@/lib/analytics/enhanced-tracking";

type RoasterDetailPageProps = {
  roaster: RoasterDetail;
  className?: string;
};

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toLocaleString("en-IN");
}

function formatRating(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toFixed(1);
}

export function RoasterDetailPage({
  roaster,
  className,
}: RoasterDetailPageProps) {
  const router = useRouter();

  // GA: tag roaster slug page with profile_view (roaster_engagement)
  useEffect(() => {
    trackRoasterEngagement(roaster.id, "profile_view", {
      coffeeCount: roaster.coffee_count ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per roaster view
  }, [roaster.id]);

  // Build location info
  const locationParts: string[] = [];
  if (roaster.hq_city) locationParts.push(roaster.hq_city);
  if (roaster.hq_state) locationParts.push(roaster.hq_state);
  if (roaster.hq_country) locationParts.push(roaster.hq_country);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;

  // Handle "See More" click - navigate with filter in URL
  const handleSeeMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Build URL with roaster filter
    const queryString = buildCoffeeQueryString(
      { roaster_ids: [roaster.id] },
      1,
      "relevance",
      15
    );
    // Navigate to coffee directory
    router.push(`/coffees?${queryString}`);
  };

  // Social Links Logic
  const socialLinks: Array<{ label: string; url: string; icon: string }> = [];
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
    if (social.linkedin && typeof social.linkedin === "string") {
      socialLinks.push({
        label: "LinkedIn",
        url: social.linkedin,
        icon: "LinkedinLogo",
      });
    }
  }

  // Stats Logic
  const stats = [
    {
      label: "Total Coffees",
      value: formatNumber(roaster.coffee_count),
      icon: "Coffee",
    },

    {
      label: "Avg Coffee Rating",
      value: formatRating(roaster.avg_coffee_rating),
      icon: "Star",
    },
    {
      label: "Roaster Rating",
      value: formatRating(roaster.avg_rating),
      icon: "SealCheck",
    },
  ];

  return (
    <div className={cn("w-full bg-background", className)}>
      <PageShell maxWidth="7xl">
        <div className="py-8 md:py-12 lg:py-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <Cluster gap="2" align="center" className="text-caption">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <Link
                href="/roasters"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Roasters
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground font-medium">
                {roaster.name}
              </span>
            </Cluster>
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-7">
            {/* Left Column: Image */}
            <div className="order-1 lg:col-span-3">
              <Stack gap="6">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm transition-all duration-300 hover:shadow-md">
                  {roaster.slug ? (
                    <Image
                      alt={`${roaster.name} logo`}
                      className="object-contain p-8 md:p-12"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
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

                {/* Visit Website (Desktop) */}
                {roaster.website && (
                  <div className="hidden lg:block">
                    <Button
                      asChild
                      size="lg"
                      className="w-full hover-lift shadow-md"
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
                        Visit Roaster Website
                        <Icon name="ArrowRight" size={14} className="ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </Stack>
            </div>

            {/* Right Column: Details & Content */}
            <div className="order-2 lg:col-span-4">
              <Stack gap="8">
                {/* Header Section */}
                <Stack gap="6">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.2em]">
                      {(roaster.active_coffee_count || 0) > 0
                        ? `Active with ${roaster.active_coffee_count} coffees`
                        : "Coffee Roaster"}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-display text-balance leading-[1.1] tracking-tight font-serif italic">
                    {roaster.name}
                  </h1>

                  {/* Stats Ribbon */}
                  <div className="py-6 md:py-8 border-y border-border/60 bg-muted/5 rounded-lg md:rounded-xl px-4 md:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col gap-1.5 items-center sm:items-start"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon
                              name={stat.icon as any}
                              size={14}
                              className="text-accent/60"
                            />
                            <span className="text-label font-bold uppercase tracking-widest leading-none">
                              {stat.label}
                            </span>
                          </div>
                          <span className="text-heading font-serif italic text-accent leading-none">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Stack>

                {/* Connect Section */}
                {(socialLinks.length > 0 ||
                  location ||
                  roaster.phone ||
                  roaster.support_email) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Socials Column */}
                    {socialLinks.length > 0 && (
                      <Stack gap="3">
                        <span className="text-label text-muted-foreground font-bold uppercase tracking-widest">
                          Connect
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {socialLinks.map((link) => {
                            const handleSocialClick = () => {
                              if (link.label === "Website") {
                                trackRoasterClick(roaster.id, "website");
                                trackRoasterConversion(
                                  roaster.id,
                                  "website_click"
                                );
                              } else {
                                trackRoasterClick(roaster.id, "social");
                                trackRoasterConversion(
                                  roaster.id,
                                  "social_click"
                                );
                              }
                            };

                            return (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-3 rounded-xl hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 border border-border/60 hover:border-accent/40 bg-background shadow-sm"
                                title={link.label}
                                onClick={handleSocialClick}
                              >
                                <Icon
                                  name={link.icon as any}
                                  size={20}
                                  className="transition-transform group-hover:scale-110"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </Stack>
                    )}

                    {/* Contact Details Column */}
                    {(location || roaster.phone || roaster.support_email) && (
                      <Stack gap="3">
                        <span className="text-label text-muted-foreground font-bold uppercase tracking-widest">
                          Location & Contact
                        </span>
                        <Stack gap="3">
                          {location && (
                            <div className="flex items-start gap-3 text-body-small text-muted-foreground group">
                              <Icon
                                name="MapPin"
                                size={16}
                                className="mt-0.5 text-accent/60 flex-shrink-0 transition-colors group-hover:text-accent"
                              />
                              <span className="leading-tight">{location}</span>
                            </div>
                          )}
                          {roaster.phone && (
                            <div className="flex items-center gap-3 text-body-small group">
                              <Icon
                                name="Phone"
                                size={16}
                                className="text-accent/60 flex-shrink-0 transition-colors group-hover:text-accent"
                              />
                              <a
                                href={`tel:${roaster.phone}`}
                                className="text-muted-foreground hover:text-accent transition-colors underline-offset-4 hover:underline"
                                onClick={() => {
                                  trackRoasterClick(roaster.id, "phone");
                                  trackRoasterConversion(
                                    roaster.id,
                                    "phone_click"
                                  );
                                }}
                              >
                                {roaster.phone}
                              </a>
                            </div>
                          )}
                          {roaster.support_email && (
                            <div className="flex items-center gap-3 text-body-small group">
                              <Icon
                                name="Envelope"
                                size={16}
                                className="text-accent/60 flex-shrink-0 transition-colors group-hover:text-accent"
                              />
                              <a
                                href={`mailto:${roaster.support_email}`}
                                className="text-muted-foreground hover:text-accent transition-colors underline-offset-4 hover:underline"
                                onClick={() => {
                                  trackRoasterClick(roaster.id, "email");
                                  trackRoasterConversion(
                                    roaster.id,
                                    "email_click"
                                  );
                                }}
                              >
                                {roaster.support_email}
                              </a>
                            </div>
                          )}
                        </Stack>
                      </Stack>
                    )}
                  </div>
                )}

                {/* Visit Website (Mobile) */}
                {roaster.website && (
                  <div className="lg:hidden">
                    <Button
                      asChild
                      size="lg"
                      className="w-full hover-lift shadow-sm"
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
                        Visit Roaster Website
                        <Icon name="ArrowRight" size={14} className="ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </Stack>
            </div>
          </div>

          {/* Story Section */}
          {roaster.description && (
            <Section
              spacing="default"
              contained={false}
              className="border-t border-border/60 bg-muted/5 mt-16 md:mt-24"
            >
              <Stack gap="6">
                <div>
                  <div className="inline-flex items-center gap-4 mb-3">
                    <span className="h-px w-6 bg-accent/40" />
                    <span className="text-overline text-muted-foreground tracking-[0.2em]">
                      Our Story
                    </span>
                    <span className="h-px w-6 bg-accent/40" />
                  </div>
                  <h2 className="text-title text-balance leading-tight font-serif italic">
                    The <span className="text-accent">Roaster's Story.</span>
                  </h2>
                </div>
                <Prose className="max-w-none">
                  <p className="text-body-large text-muted-foreground font-serif leading-relaxed whitespace-pre-line italic opacity-90">
                    {roaster.description}
                  </p>
                </Prose>
              </Stack>
            </Section>
          )}

          {/* Coffees List Section */}
          {roaster.coffees && roaster.coffees.length > 0 && (
            <Section
              spacing="default"
              contained={false}
              className="border-t border-border/60"
            >
              <Stack gap="8">
                <div>
                  <div className="inline-flex items-center gap-4 mb-3">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.2em]">
                      Curated Selection
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight font-serif italic">
                    Our <span className="text-accent">Selection.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {roaster.coffees.slice(0, 6).map((coffee) => (
                    <CoffeeCard key={coffee.coffee_id} coffee={coffee} />
                  ))}
                </div>

                {roaster.coffees.length > 6 && (
                  <div className="flex justify-center pt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 hover-lift"
                    >
                      <Link
                        href={`/coffees?${buildCoffeeQueryString(
                          { roaster_ids: [roaster.id] },
                          1,
                          "relevance",
                          15
                        )}`}
                        onClick={handleSeeMoreClick}
                        className="inline-flex items-center gap-2"
                      >
                        Explore All Coffees
                        <Icon name="ArrowRight" size={16} />
                      </Link>
                    </Button>
                  </div>
                )}
              </Stack>
            </Section>
          )}

          {/* Empty State */}
          {(!roaster.coffees || roaster.coffees.length === 0) && (
            <Section
              spacing="default"
              contained={false}
              className="border-t border-border/60"
            >
              <div className="text-center">
                <div className="border border-dashed border-border/40 rounded-3xl p-16 bg-muted/20">
                  <Icon
                    name="Coffee"
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground/40"
                  />
                  <p className="text-body text-muted-foreground font-serif italic">
                    No coffees currently listed for this roaster.
                  </p>
                </div>
              </div>
            </Section>
          )}

          {/* Reviews Section */}
          <Section
            spacing="default"
            contained={false}
            className="border-t border-border/60"
          >
            <ReviewSection entityType="roaster" entityId={roaster.id} />
          </Section>

          {/* Claim Your Page CTA */}
          <div className="text-center py-12 md:py-16 border-t border-border/40">
            <p className="text-label text-muted-foreground tracking-wide uppercase">
              Partner with Indian Coffee Beans
            </p>
            <p className="mt-4 text-body text-muted-foreground">
              If you are the owner of{" "}
              <span className="text-foreground font-medium">
                {roaster.name}
              </span>
              ,{" "}
              <Link
                href="/roasters/partner"
                className="text-accent hover:underline font-medium italic underline-offset-4"
              >
                claim your page now
              </Link>{" "}
              to get a verified badge and manage your coffees.
            </p>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
