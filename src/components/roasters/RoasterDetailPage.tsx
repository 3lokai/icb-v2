"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { RoasterDetail } from "@/types/roaster-types";
import { roasterImagePresets } from "@/lib/imagekit";
import { Icon, type IconName } from "@/components/common/Icon";
import { useImageColor } from "@/hooks/useImageColor";

import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ReviewList,
  ReviewStats,
  QuickRating,
  ExitIntentRatingModal,
} from "@/components/reviews";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { trackRoasterClick } from "@/lib/analytics";
import {
  trackRoasterConversion,
  trackRoasterEngagement,
} from "@/lib/analytics/enhanced-tracking";
import { capture } from "@/lib/posthog";
import { useReviews, useReviewStats } from "@/hooks/use-reviews";
import { useExitIntentRating } from "@/hooks/use-exit-intent-rating";
import { ShareRow } from "@/components/common/ShareRow";
import { FloatingRateCTA } from "@/components/common/FloatingRateCTA";
import Tag, { TagList } from "@/components/common/Tag";

/* ─── Types ─── */

type RoasterDetailPageProps = {
  roaster: RoasterDetail;
  className?: string;
};

import type { LatestReviewPerIdentity } from "@/types/review-types";

type RoasterExitIntentRatingProps = {
  roaster: RoasterDetail;
  reviews: LatestReviewPerIdentity[] | undefined;
};

/* ─── Scrollspy Tab Bar ─── */

type TabItem = { id: string; label: string };

const SECTIONS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "coffees", label: "Coffees" },
  { id: "reviews", label: "Reviews" },
];

function ScrollspyTabBar({ activeId }: { activeId: string }) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border/40"
      aria-label="Page sections"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleClick(section.id)}
              className={cn(
                "relative px-4 py-2.5 text-caption font-medium rounded-full transition-all whitespace-nowrap",
                activeId === section.id
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── Exit Intent ─── */

function RoasterExitIntentRating({
  roaster,
  reviews,
}: RoasterExitIntentRatingProps) {
  const { open, setOpen } = useExitIntentRating({
    entityId: roaster.id,
    entityType: "roaster",
    reviews,
    mobileDelayMs: 45_000,
  });
  return (
    <ExitIntentRatingModal
      open={open}
      onOpenChange={setOpen}
      entityType="roaster"
      entityId={roaster.id}
      coffeeName={roaster.name}
      slug={roaster.slug}
    />
  );
}

/* ─── Helpers ─── */

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toLocaleString("en-IN");
}

function hasValues(arr: string[] | null | undefined): arr is string[] {
  return Array.isArray(arr) && arr.length > 0;
}

/* ─── Main Component ─── */

export function RoasterDetailPage({
  roaster,
  className,
}: RoasterDetailPageProps) {
  const { data: reviews } = useReviews("roaster", roaster.id);
  const { data: stats } = useReviewStats("roaster", roaster.id);

  // Refs for FloatingRateCTA
  const heroRateButtonRef = useRef<HTMLButtonElement>(null);
  const ratingSectionRef = useRef<HTMLDivElement>(null);

  // Scrollspy active section
  const [activeSection, setActiveSection] = useState("overview");
  const [hasUserRating, setHasUserRating] = useState(false);

  useEffect(() => {
    const sectionIds = SECTIONS.map((s) => s.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // GA + Tracking
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

  // Scroll Handlers
  const handleScrollToRating = useCallback(() => {
    ratingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Memoize logo URL for color extraction
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

  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      <ScrollspyTabBar activeId={activeSection} />

      <PageShell maxWidth="5xl">
        <div className="flex flex-col pb-12">
          {/* ═══════════════════════════════════════════
              SECTION 1: HERO / OVERVIEW
          ═══════════════════════════════════════════ */}
          <section id="overview" className="scroll-mt-40 py-10 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
              {/* Logo Column */}
              <div className="w-full max-w-sm mx-auto md:mx-0">
                <div
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md",
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
                  <div className="inline-flex items-center gap-4 mb-2">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.2em]">
                      {(roaster.active_coffee_count || 0) > 0
                        ? `Active with ${roaster.active_coffee_count} coffees`
                        : "Coffee Roaster"}
                    </span>
                  </div>
                  <h1 className="text-display font-serif italic leading-[1.1] text-balance tracking-tight">
                    {roaster.name}
                  </h1>
                  {location && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Icon
                        name="MapPin"
                        size={14}
                        className="text-accent/60"
                      />
                      <span className="text-label uppercase tracking-widest">
                        {location}
                      </span>
                    </div>
                  )}
                </Stack>

                {/* Rating + Basic Stats */}
                <div className="flex flex-wrap items-center gap-4">
                  {stats && stats.review_count ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                      <Icon name="Star" size={16} className="fill-amber-500" />
                      <span className="text-heading">
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

                  <div className="px-3 py-1.5 rounded-full border border-border/40 bg-muted/20">
                    <span className="font-medium text-body">
                      {formatNumber(roaster.coffee_count)}
                    </span>
                    <span className="text-caption text-muted-foreground ml-1.5">
                      Coffees Cataloged
                    </span>
                  </div>
                </div>

                {(hasValues(roaster.certifications) ||
                  hasValues(roaster.specialty_focus) ||
                  hasValues(roaster.sourcing_model)) && (
                  <div className="surface-1 rounded-xl p-4 border border-border/40">
                    <Stack gap="3">
                      <p className="text-overline tracking-[0.15em] text-muted-foreground">
                        At a glance
                      </p>
                      {hasValues(roaster.certifications) && (
                        <Stack gap="1.5">
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
                        <Stack gap="1.5">
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
                        <Stack gap="1.5">
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
                    ref={heroRateButtonRef}
                    size="lg"
                    className="shadow-xl bg-primary hover:scale-[1.02] transition-transform min-w-[170px]"
                    onClick={handleScrollToRating}
                  >
                    <Icon
                      name="Star"
                      size={18}
                      className="mr-2 fill-amber-300 text-amber-300"
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
                      >
                        <Icon name={link.icon} size={18} />
                      </a>
                    ))}
                  </Cluster>
                )}
              </Stack>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 2: ROASTER STORY
          ═══════════════════════════════════════════ */}
          {roaster.description && (
            <section
              id="about"
              className="scroll-mt-40 py-10 md:py-14 border-t border-border/20"
            >
              <div className="surface-1 rounded-2xl p-6 md:p-8 border-l-4 border-l-accent/40">
                <Stack gap="4">
                  <div className="inline-flex items-center gap-4 mb-1">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      Our Story
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                    The{" "}
                    <span className="text-accent italic">
                      Roaster&apos;s Story
                    </span>
                  </h2>
                  <p className="whitespace-pre-line text-body-large text-muted-foreground/80 leading-relaxed italic">
                    {roaster.description}
                  </p>
                </Stack>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════
              SECTION 3: COFFEES SELECTION
          ═══════════════════════════════════════════ */}
          {roaster.coffees && roaster.coffees.length > 0 && (
            <section
              id="coffees"
              className="scroll-mt-40 py-10 md:py-14 border-t border-border/20"
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
                        href={`/roasters/${roaster.slug}/coffees`}
                        className="inline-flex items-center gap-2"
                      >
                        Explore All Coffees
                        <Icon name="ArrowRight" size={16} />
                      </Link>
                    </Button>
                  </div>
                )}
              </Stack>
            </section>
          )}

          {/* ═══════════════════════════════════════════
              SECTION 4: RATE & REVIEW
          ═══════════════════════════════════════════ */}
          <section
            id="reviews"
            ref={ratingSectionRef}
            className="scroll-mt-40 py-10 md:py-14 border-t border-border/20"
          >
            <Stack gap="8">
              {/* Review Stats */}
              <ReviewStats stats={stats || null} />

              {/* Rating form */}
              <div className="surface-2 rounded-2xl p-8 border border-accent/20">
                <QuickRating
                  entityType="roaster"
                  entityId={roaster.id}
                  variant="inline"
                  slug={roaster.slug ?? undefined}
                  onSavedStateChange={setHasUserRating}
                />
                {hasUserRating && (
                  <ShareRow
                    entityType="roaster"
                    name={roaster.name}
                    slug={roaster.slug ?? ""}
                  />
                )}
              </div>

              {/* Community Reviews */}
              {reviews && reviews.length > 0 && (
                <Section contained={false} spacing="tight">
                  <ReviewList
                    entityType="roaster"
                    reviews={reviews.slice(0, 10)}
                  />
                </Section>
              )}
            </Stack>
          </section>

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

        {/* Exit Intent Modal */}
        <RoasterExitIntentRating
          key={roaster.id}
          roaster={roaster}
          reviews={reviews}
        />
      </PageShell>

      {/* Floating Rate CTA */}
      <FloatingRateCTA
        heroButtonRef={heroRateButtonRef}
        ratingSectionRef={ratingSectionRef}
        entityType="roaster"
      />
    </div>
  );
}
