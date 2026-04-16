"use client";

import Link from "next/link";
import { Fragment, useState, useCallback, useEffect, useRef } from "react";
import type { CoffeeDetail } from "@/types/coffee-types";
import type { LatestReviewPerIdentity } from "@/types/review-types";
import { Icon } from "@/components/common/Icon";
import { trackCoffeeViewItem } from "@/lib/analytics/enhanced-tracking";
import { recordCoffeeView } from "@/app/actions/coffee-views";
import { capture } from "@/lib/posthog";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import {
  ReviewList,
  ReviewStats,
  QuickRating,
  ExitIntentRatingModal,
} from "@/components/reviews";
import { useReviews, useReviewStats } from "@/hooks/use-reviews";
import { useExitIntentRating } from "@/hooks/use-exit-intent-rating";
import { cn, capitalizeFirstLetter } from "@/lib/utils";
import { SimilarCoffees } from "./SimilarCoffees";
import { CoffeeSensoryProfile } from "./CoffeeSensoryProfile";
import Tag, { TagList } from "@/components/common/Tag";
import CoffeeImageCarousel from "@/components/layout/carousel-image";
import { CoffeeVariantSelector } from "./CoffeeVariantSelector";
import { FloatingRateCTA } from "@/components/common/FloatingRateCTA";
import { ShareRow } from "@/components/common/ShareRow";
import { discoveryPagePath } from "@/lib/discovery/landing-pages";
import {
  discoverySlugForBrewMethodKey,
  discoverySlugForProcess,
  discoverySlugForRegionDisplayOrSubregion,
  discoverySlugForRoastLevel,
} from "@/lib/utils/coffee-constants";

/* ─── Types ─── */

type CoffeeDetailPageProps = {
  coffee: CoffeeDetail;
  className?: string;
};

type CoffeeExitIntentRatingProps = {
  coffee: CoffeeDetail;
  reviews: LatestReviewPerIdentity[] | undefined;
};

/* ─── Scrollspy Tab Bar ─── */

type TabItem = { id: string; label: string };

const SECTIONS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "flavor", label: "Flavor" },
  { id: "pricing", label: "Pricing" },
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

/* ─── Exit Intent (remounted per coffee via key) ─── */

function CoffeeExitIntentRating({
  coffee,
  reviews,
}: CoffeeExitIntentRatingProps) {
  const { open, setOpen } = useExitIntentRating({
    entityId: coffee.id,
    entityType: "coffee",
    reviews,
    mobileDelayMs: 45_000,
  });
  return (
    <ExitIntentRatingModal
      open={open}
      onOpenChange={setOpen}
      entityType="coffee"
      entityId={coffee.id}
      coffeeName={coffee.name}
      slug={coffee.slug}
    />
  );
}

/* ─── Helper: Trim description ─── */

function trimDescription(text: string | null, maxLen = 160): string | null {
  if (!text) return null;
  if (text.length <= maxLen) return text;
  // Trim at last space before maxLen
  const trimmed = text.slice(0, maxLen);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "…";
}

const discoveryPhraseLinkClass =
  "text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors";

/** Link to /coffees/[slug] when a programmatic landing exists; else plain text. */
function DiscoveryInlineLink({
  slug,
  children,
  className,
}: {
  slug: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  if (!slug) {
    return <span className={className}>{children}</span>;
  }
  return (
    <Link
      href={discoveryPagePath(slug)}
      className={cn(discoveryPhraseLinkClass, className)}
    >
      {children}
    </Link>
  );
}

/* ─── Main Component ─── */

export function CoffeeDetailPage({ coffee, className }: CoffeeDetailPageProps) {
  const { data: reviews } = useReviews("coffee", coffee.id);
  const { data: stats } = useReviewStats("coffee", coffee.id);

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
        // Find the topmost visible section
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

  // GA4 + PostHog tracking
  useEffect(() => {
    trackCoffeeViewItem({
      coffeeId: coffee.id,
      coffeeName: coffee.name,
      roasterName: coffee.roaster?.name,
      price:
        coffee.summary.min_price_in_stock ??
        coffee.summary.best_normalized_250g ??
        undefined,
      currency: "INR",
      inStock: (coffee.summary.in_stock_count ?? 0) > 0,
      rating: coffee.rating_avg ?? undefined,
      ratingCount: coffee.rating_count,
    });
    capture("coffee_page_viewed", {
      coffee_slug: coffee.slug,
      roaster_name: coffee.roaster?.name ?? null,
    });
    capture("rating_page_viewed", {
      entity_type: "coffee" as const,
      entity_id: coffee.id,
      coffee_slug: coffee.slug,
    });
    void (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const anonForAction = user ? null : ensureAnonId();
      await recordCoffeeView(coffee.id, anonForAction);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per coffee view
  }, [coffee.id]);

  // Hash scroll on mount
  useEffect(() => {
    if (window.location.hash === "#rating-section") {
      requestAnimationFrame(() => {
        ratingSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, []);

  const handleScrollToRating = useCallback(() => {
    ratingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleScrollToStory = useCallback(() => {
    document
      .getElementById("coffee-story")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const trimmedDesc = trimDescription(coffee.description_md);

  const estateName = coffee.estates?.[0]?.name;
  const firstRegion = coffee.regions[0];
  const originLine =
    estateName ||
    firstRegion?.display_name ||
    (firstRegion &&
      [firstRegion.country, firstRegion.state, firstRegion.subregion]
        .filter(Boolean)
        .join(", ")) ||
    firstRegion?.subregion ||
    null;
  const originSlug = estateName
    ? null
    : firstRegion
      ? discoverySlugForRegionDisplayOrSubregion(firstRegion)
      : null;

  const heroMetaParts: React.ReactNode[] = [];
  if (originLine) {
    heroMetaParts.push(
      <DiscoveryInlineLink key="origin" slug={originSlug}>
        {originLine}
      </DiscoveryInlineLink>
    );
  }
  if (coffee.process) {
    heroMetaParts.push(
      <DiscoveryInlineLink
        key="process"
        slug={discoverySlugForProcess(coffee.process)}
      >
        {capitalizeFirstLetter(coffee.process_raw || coffee.process || "")}
      </DiscoveryInlineLink>
    );
  }
  if (coffee.roast_level) {
    heroMetaParts.push(
      <DiscoveryInlineLink
        key="roast"
        slug={discoverySlugForRoastLevel(coffee.roast_level)}
      >
        {capitalizeFirstLetter(
          coffee.roast_level_raw || coffee.roast_level || ""
        )}
      </DiscoveryInlineLink>
    );
  }

  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      {/* ─── Scrollspy Tab Bar ─── */}
      <ScrollspyTabBar activeId={activeSection} />

      <PageShell maxWidth="5xl">
        <div className="flex flex-col pb-12">
          {/* ═══════════════════════════════════════════
              SECTION 1: HERO / OVERVIEW
          ═══════════════════════════════════════════ */}
          <section id="overview" className="scroll-mt-40 py-10 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
              {/* Image */}
              <div className="w-full max-w-md mx-auto md:mx-0">
                <CoffeeImageCarousel
                  images={coffee.images}
                  coffeeName={coffee.name}
                  className="rounded-2xl"
                />
              </div>

              {/* Product Info */}
              <Stack gap="4" className="pt-2">
                {/* Name + Roaster */}
                <Stack gap="1">
                  <h1 className="text-display font-serif italic leading-none text-balance">
                    {coffee.name}
                  </h1>
                  <Cluster gap="2" align="center">
                    {coffee.roaster && (
                      <Link
                        href={`/roasters/${coffee.roaster.slug}`}
                        className="text-body-muted hover:text-foreground transition-colors font-medium"
                      >
                        {coffee.roaster.name}
                      </Link>
                    )}
                  </Cluster>
                  <div className="text-label uppercase tracking-widest mt-1">
                    {heroMetaParts.map((node, i) => (
                      <Fragment key={i}>
                        {i > 0 ? " · " : null}
                        {node}
                      </Fragment>
                    ))}
                  </div>
                </Stack>

                {/* Rating Badge + Price */}
                <div className="flex flex-wrap items-center gap-4">
                  {stats &&
                  stats.review_count !== null &&
                  stats.review_count > 0 ? (
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

                  {coffee.summary.min_price_in_stock && (
                    <div className="px-3 py-1.5 rounded-full border border-border/40 bg-muted/20">
                      <span className="text-caption text-muted-foreground">
                        From{" "}
                      </span>
                      <span className="font-medium text-body">
                        ₹{coffee.summary.min_price_in_stock}
                      </span>
                    </div>
                  )}
                </div>

                {/* Trimmed Description */}
                {trimmedDesc && (
                  <p className="text-body text-muted-foreground leading-relaxed">
                    {trimmedDesc}{" "}
                    {coffee.description_md &&
                      coffee.description_md.length > 160 && (
                        <button
                          type="button"
                          onClick={handleScrollToStory}
                          className="text-accent hover:text-accent/80 font-medium transition-colors"
                        >
                          Read more
                        </button>
                      )}
                  </p>
                )}

                {/* At a Glance */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
                  {coffee.roast_level && (
                    <Stack gap="1">
                      <span className="text-label">Roast</span>
                      <DiscoveryInlineLink
                        slug={discoverySlugForRoastLevel(coffee.roast_level)}
                        className="font-medium"
                      >
                        {coffee.roast_level_raw || coffee.roast_level}
                      </DiscoveryInlineLink>
                    </Stack>
                  )}
                  {coffee.process && (
                    <Stack gap="1">
                      <span className="text-label">Process</span>
                      <DiscoveryInlineLink
                        slug={discoverySlugForProcess(coffee.process)}
                        className="font-medium"
                      >
                        {coffee.process_raw || coffee.process}
                      </DiscoveryInlineLink>
                    </Stack>
                  )}
                  {coffee.regions.length > 0 && (
                    <Stack gap="1">
                      <span className="text-label">
                        Region{coffee.regions.length > 1 ? "s" : ""}
                      </span>
                      <span className="font-medium">
                        {coffee.regions.map((region, i) => {
                          const label =
                            region.display_name ||
                            [region.country, region.state, region.subregion]
                              .filter(Boolean)
                              .join(", ") ||
                            region.subregion;
                          return (
                            <Fragment key={region.id}>
                              {i > 0 ? ", " : null}
                              <DiscoveryInlineLink
                                slug={discoverySlugForRegionDisplayOrSubregion(
                                  region
                                )}
                              >
                                {label}
                              </DiscoveryInlineLink>
                            </Fragment>
                          );
                        })}
                      </span>
                    </Stack>
                  )}
                  {coffee.estates.length > 0 && (
                    <Stack gap="1">
                      <span className="text-label">
                        Estate{coffee.estates.length > 1 ? "s" : ""}
                      </span>
                      <span className="font-medium">
                        {coffee.estates.map((estate) => estate.name).join(", ")}
                      </span>
                    </Stack>
                  )}
                  {coffee.brew_methods && coffee.brew_methods.length > 0 && (
                    <Stack gap="1" className="col-span-2">
                      <span className="text-label">Suggested brew methods</span>
                      <span className="font-medium">
                        {coffee.brew_methods.map((bm, i) => (
                          <Fragment key={bm.id}>
                            {i > 0 ? ", " : null}
                            <DiscoveryInlineLink
                              slug={discoverySlugForBrewMethodKey(bm.key)}
                            >
                              {bm.label}
                            </DiscoveryInlineLink>
                          </Fragment>
                        ))}
                      </span>
                    </Stack>
                  )}
                </div>

                {/* CTAs */}
                <Cluster gap="3" className="pt-2">
                  <Button
                    ref={heroRateButtonRef}
                    size="lg"
                    className="shadow-xl bg-primary hover:scale-[1.02] transition-transform min-w-[160px]"
                    onClick={handleScrollToRating}
                  >
                    <Icon
                      name="Star"
                      size={18}
                      className="mr-2 fill-amber-300 text-amber-300"
                    />
                    Rate this coffee
                  </Button>
                  {coffee.status === "discontinued" ? (
                    <Button
                      variant="outline"
                      size="lg"
                      disabled
                      className="text-muted-foreground min-w-[160px] opacity-60"
                    >
                      Discontinued
                    </Button>
                  ) : (
                    coffee.direct_buy_url && (
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="text-muted-foreground min-w-[160px]"
                      >
                        <a
                          href={coffee.direct_buy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buy from roaster
                        </a>
                      </Button>
                    )
                  )}
                </Cluster>
              </Stack>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 2: COFFEE STORY + ORIGIN DETAILS
          ═══════════════════════════════════════════ */}
          {(coffee.description_md ||
            coffee.regions.length > 0 ||
            coffee.estates.length > 0 ||
            coffee.varieties?.length ||
            coffee.roast_level ||
            coffee.process) && (
            <section
              id="coffee-story"
              className="scroll-mt-40 py-10 md:py-14 border-t border-border/20"
            >
              <Stack gap="8">
                {/* Coffee Story */}
                {coffee.description_md && (
                  <div className="surface-1 rounded-2xl p-6 md:p-8 border-l-4 border-l-accent/40">
                    <Stack gap="4">
                      <div className="inline-flex items-center gap-4 mb-1">
                        <span className="h-px w-8 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Coffee Story
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                        About this{" "}
                        <span className="text-accent italic">coffee</span>
                      </h2>
                      <p className="whitespace-pre-line text-body text-muted-foreground/80 leading-relaxed">
                        {coffee.description_md}
                      </p>
                    </Stack>
                  </div>
                )}

                {/* Origin & Production Card */}
                <div className="surface-1 rounded-2xl p-6 md:p-8">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4 mb-1">
                      <span className="h-px w-8 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        Origin & Production
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Stack gap="4">
                        <div className="flex items-start gap-3">
                          <Icon
                            name="MapPin"
                            size={18}
                            className="text-accent mt-0.5 shrink-0"
                          />
                          <Stack gap="1">
                            <span className="text-label uppercase tracking-widest font-bold">
                              Region / Estate
                            </span>
                            <span className="text-body font-medium">
                              {coffee.estates.length === 0 &&
                              coffee.regions.length === 0 ? (
                                "—"
                              ) : (
                                <>
                                  {coffee.estates.map((e, i) => (
                                    <Fragment key={e.id}>
                                      {i > 0 ? ", " : null}
                                      {e.name}
                                    </Fragment>
                                  ))}
                                  {coffee.regions.map((r, i) => {
                                    const label =
                                      r.display_name ||
                                      [r.country, r.state, r.subregion]
                                        .filter(Boolean)
                                        .join(", ") ||
                                      r.subregion;
                                    return (
                                      <Fragment key={r.id}>
                                        {i > 0 || coffee.estates.length > 0
                                          ? ", "
                                          : null}
                                        <DiscoveryInlineLink
                                          slug={discoverySlugForRegionDisplayOrSubregion(
                                            r
                                          )}
                                        >
                                          {label}
                                        </DiscoveryInlineLink>
                                      </Fragment>
                                    );
                                  })}
                                </>
                              )}
                            </span>
                          </Stack>
                        </div>
                        {coffee.varieties && coffee.varieties.length > 0 && (
                          <div className="flex items-start gap-3">
                            <Icon
                              name="Leaf"
                              size={18}
                              className="text-accent mt-0.5 shrink-0"
                            />
                            <Stack gap="1">
                              <span className="text-label uppercase tracking-widest font-bold">
                                Variety
                              </span>
                              <span className="text-body font-medium">
                                {coffee.varieties.join(", ")}
                              </span>
                            </Stack>
                          </div>
                        )}
                      </Stack>

                      <Stack gap="4">
                        {coffee.roast_level && (
                          <div className="flex items-start gap-3">
                            <Icon
                              name="Fire"
                              size={18}
                              className="text-accent mt-0.5 shrink-0"
                            />
                            <Stack gap="1">
                              <span className="text-label uppercase tracking-widest font-bold">
                                Roast Level
                              </span>
                              <DiscoveryInlineLink
                                slug={discoverySlugForRoastLevel(
                                  coffee.roast_level
                                )}
                                className="text-body font-medium"
                              >
                                {coffee.roast_level_raw || coffee.roast_level}
                              </DiscoveryInlineLink>
                            </Stack>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Icon
                            name="Funnel"
                            size={18}
                            className="text-accent mt-0.5 shrink-0"
                          />
                          <Stack gap="1">
                            <span className="text-label uppercase tracking-widest font-bold">
                              Processing
                            </span>
                            <DiscoveryInlineLink
                              slug={discoverySlugForProcess(coffee.process)}
                              className="text-body font-medium"
                            >
                              {coffee.process_raw || coffee.process || "—"}
                            </DiscoveryInlineLink>
                          </Stack>
                        </div>
                        {coffee.bean_species && (
                          <div className="flex items-start gap-3">
                            <Icon
                              name="Flask"
                              size={18}
                              className="text-accent mt-0.5 shrink-0"
                            />
                            <Stack gap="1">
                              <span className="text-label uppercase tracking-widest font-bold">
                                Species
                              </span>
                              <span className="text-body font-medium">
                                {coffee.bean_species}
                              </span>
                            </Stack>
                          </div>
                        )}
                        {coffee.crop_year && (
                          <div className="flex items-start gap-3">
                            <Icon
                              name="Calendar"
                              size={18}
                              className="text-accent mt-0.5 shrink-0"
                            />
                            <Stack gap="1">
                              <span className="text-label uppercase tracking-widest font-bold">
                                Crop Year
                              </span>
                              <span className="text-body font-medium">
                                {coffee.crop_year}
                              </span>
                            </Stack>
                          </div>
                        )}
                        {coffee.harvest_window && (
                          <div className="flex items-start gap-3">
                            <Icon
                              name="Sun"
                              size={18}
                              className="text-accent mt-0.5 shrink-0"
                            />
                            <Stack gap="1">
                              <span className="text-label uppercase tracking-widest font-bold">
                                Harvest
                              </span>
                              <span className="text-body font-medium">
                                {coffee.harvest_window}
                              </span>
                            </Stack>
                          </div>
                        )}
                      </Stack>
                    </div>

                    {/* Tags and Badges */}
                    {(coffee.decaf ||
                      coffee.is_limited ||
                      (coffee.tags && coffee.tags.length > 0)) && (
                      <div className="pt-5 border-t border-border/20">
                        <Stack gap="3">
                          <span className="text-label uppercase tracking-widest font-bold">
                            Tags
                          </span>
                          <TagList>
                            {coffee.decaf && (
                              <Tag variant="filled" size="micro">
                                Decaf
                              </Tag>
                            )}
                            {coffee.is_limited && (
                              <Tag variant="filled" size="micro">
                                Limited
                              </Tag>
                            )}
                            {coffee.tags &&
                              coffee.tags.map((tag, index) => (
                                <Tag key={index} variant="outline" size="micro">
                                  {tag}
                                </Tag>
                              ))}
                          </TagList>
                        </Stack>
                      </div>
                    )}
                  </Stack>
                </div>
              </Stack>
            </section>
          )}

          {/* ═══════════════════════════════════════════
              SECTION 3: FLAVOR PROFILE
          ═══════════════════════════════════════════ */}
          <section
            id="flavor"
            className="scroll-mt-40 py-10 md:py-14 border-t border-border/20"
          >
            <Stack gap="8">
              <div className="surface-1 rounded-2xl p-6 md:p-8">
                <CoffeeSensoryProfile coffee={coffee} className="border-0" />
              </div>

              <div className="surface-1 rounded-2xl p-6 md:p-8">
                <Stack gap="4">
                  <div>
                    <div className="inline-flex items-center gap-4 mb-3">
                      <span className="h-px w-8 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        Roaster&apos;s Take
                      </span>
                    </div>
                    <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
                      Tasting <span className="text-accent italic">Notes</span>
                    </h2>
                    <p className="text-caption text-muted-foreground">
                      Original tasting notes from {coffee.roaster?.name}
                    </p>
                  </div>

                  {coffee.flavor_notes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {coffee.flavor_notes.map((note) => (
                        <div
                          key={note.id}
                          className="px-4 py-2 rounded-full border border-border/40 bg-muted/20 text-body font-medium text-muted-foreground hover:bg-accent/10 hover:border-accent/30 hover:text-foreground transition-all cursor-default"
                        >
                          {note.label}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-muted-foreground">
                      No tasting notes cataloged
                    </p>
                  )}
                </Stack>
              </div>
            </Stack>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 4: PRICING & AVAILABILITY
          ═══════════════════════════════════════════ */}
          <section
            id="pricing"
            className="scroll-mt-40 py-10 md:py-14 border-t border-border/20"
          >
            <div className="surface-1 rounded-2xl p-6 md:p-8">
              <Stack gap="4">
                <div>
                  <div className="inline-flex items-center gap-4 mb-2">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      Available Options
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-4">
                    Pricing &{" "}
                    <span className="text-accent italic">Availability</span>
                  </h2>
                </div>

                {coffee.variants.length > 0 ? (
                  <CoffeeVariantSelector
                    variants={coffee.variants}
                    directBuyUrl={coffee.direct_buy_url}
                    roasterName={coffee.roaster?.name}
                  />
                ) : (
                  <p className="text-body-muted italic">
                    No pricing information available
                  </p>
                )}
              </Stack>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 5: RATE & REVIEW (dark contrast)
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
                  entityType="coffee"
                  entityId={coffee.id}
                  variant="inline"
                  slug={coffee.slug ?? undefined}
                  onSavedStateChange={setHasUserRating}
                />
                {hasUserRating && (
                  <ShareRow
                    entityType="coffee"
                    name={coffee.name}
                    slug={coffee.slug ?? ""}
                  />
                )}
              </div>

              {/* Community Reviews */}
              {reviews && reviews.length > 0 && (
                <Section contained={false} spacing="tight">
                  <ReviewList
                    entityType="coffee"
                    reviews={reviews.slice(0, 10)}
                  />
                </Section>
              )}
            </Stack>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 6: SIMILAR COFFEES
          ═══════════════════════════════════════════ */}
          <Section
            contained={false}
            spacing="tight"
            className="border-t border-border/20 pt-8"
          >
            <SimilarCoffees coffee={coffee} />
          </Section>
        </div>

        {/* Exit Intent Modal */}
        <CoffeeExitIntentRating
          key={coffee.id}
          coffee={coffee}
          reviews={reviews}
        />
      </PageShell>

      {/* Floating Rate CTA */}
      <FloatingRateCTA
        heroButtonRef={heroRateButtonRef}
        ratingSectionRef={ratingSectionRef}
      />
    </div>
  );
}
