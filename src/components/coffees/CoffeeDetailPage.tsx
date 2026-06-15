"use client";

import { Accent } from "@/components/primitives/accent";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useState, useCallback, useEffect, useRef } from "react";
import type { CoffeeDetail } from "@/types/coffee-types";
import type { LatestReviewPerIdentity } from "@/types/review-types";
import { Icon } from "@/components/common/Icon";
import { trackCoffeeViewItem } from "@/lib/analytics/enhanced-tracking";
import { recordCoffeeView } from "@/app/actions/coffee-views";
import { capture } from "@/lib/posthog";
import { queryKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import { Band } from "@/components/primitives/band";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import { Button } from "@/components/ui/button";
import {
  ReviewList,
  ReviewStats,
  QuickRating,
  ExitIntentRatingModal,
} from "@/components/reviews";
import { useReviews, useReviewStats } from "@/hooks/use-reviews";
import { useExitIntentRating } from "@/hooks/use-exit-intent-rating";
import { cn } from "@/lib/utils";
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
  const queryClient = useQueryClient();
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
      const res = await recordCoffeeView(coffee.id, anonForAction);
      if (res.success) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.coffees.recentlyViewed(12),
        });
      }
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

  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      {/* ─── Scrollspy Tab Bar ─── */}
      <ScrollspyTabBar activeId={activeSection} />

      {/* ═══════════════════════════════════════════
          SECTION 1: HERO / OVERVIEW (cream band)
      ═══════════════════════════════════════════ */}
      <Band id="overview" className="py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Image */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <CoffeeImageCarousel
              images={coffee.images}
              coffeeName={coffee.name}
              className="rounded-xl"
            />
          </div>

          {/* Product Info */}
          <Stack gap="4" className="pt-2">
            {/* Name + Roaster */}
            <Stack gap="1">
              <h1 className="text-display italic leading-[1.05] text-balance">
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
            </Stack>

            {/* Rating Badge + Price */}
            <div className="flex flex-wrap items-center gap-4">
              {stats &&
              stats.review_count !== null &&
              stats.review_count > 0 ? (
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

            {/* CTAs */}
            <Cluster gap="3" className="pt-2">
              <Button
                ref={heroRateButtonRef}
                size="lg"
                className="bg-primary shadow-sm hover:shadow-md transition-shadow min-w-[160px]"
                onClick={handleScrollToRating}
              >
                <Icon
                  name="Star"
                  size={18}
                  className="mr-2 fill-rating text-rating"
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
      </Band>

      {/* ═══════════════════════════════════════════
          SECTION 2: COFFEE STORY + PRODUCTION (warm band)
      ═══════════════════════════════════════════ */}
      {(() => {
        const hasProductionSpecs = Boolean(
          coffee.roast_level ||
          coffee.process ||
          coffee.regions.length > 0 ||
          coffee.estates.length > 0 ||
          (coffee.varieties && coffee.varieties.length > 0) ||
          coffee.bean_species ||
          coffee.crop_year ||
          coffee.harvest_window ||
          (coffee.brew_methods && coffee.brew_methods.length > 0)
        );
        const hasTags = Boolean(
          coffee.decaf ||
          coffee.is_limited ||
          (coffee.tags && coffee.tags.length > 0)
        );
        if (!coffee.description_md && !hasProductionSpecs && !hasTags) {
          return null;
        }
        return (
          <Band id="coffee-story" ground="warm" texture="grain">
            <Stack gap="12">
              {/* Coffee Story — open editorial block */}
              {coffee.description_md && (
                <div className="max-w-2xl">
                  <h2 className="text-title text-balance leading-[1.1]">
                    About <Accent>{coffee.name}</Accent>
                  </h2>
                  <Prose className="mt-4 text-muted-foreground">
                    <p className="whitespace-pre-line">
                      {coffee.description_md}
                    </p>
                  </Prose>
                </div>
              )}

              {/* Production details — single home for every coffee spec */}
              {(hasProductionSpecs || hasTags) && (
                <div>
                  <Stack gap="6">
                    <h2 className="text-heading">Production details</h2>

                    {hasProductionSpecs && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                        {coffee.roast_level && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Fire"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Roast
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
                        )}
                        {coffee.process && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Funnel"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Process
                            </span>
                            <DiscoveryInlineLink
                              slug={discoverySlugForProcess(coffee.process)}
                              className="text-body font-medium"
                            >
                              {coffee.process_raw || coffee.process}
                            </DiscoveryInlineLink>
                          </Stack>
                        )}
                        {coffee.regions.length > 0 && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="MapPin"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Region{coffee.regions.length > 1 ? "s" : ""}
                            </span>
                            <span className="text-body font-medium">
                              {coffee.regions.map((region, i) => {
                                const label =
                                  region.display_name ||
                                  [
                                    region.country,
                                    region.state,
                                    region.subregion,
                                  ]
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
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Mountains"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Estate{coffee.estates.length > 1 ? "s" : ""}
                            </span>
                            <span className="text-body font-medium">
                              {coffee.estates
                                .map((estate) => estate.name)
                                .join(", ")}
                            </span>
                          </Stack>
                        )}
                        {coffee.varieties && coffee.varieties.length > 0 && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Leaf"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Variety
                            </span>
                            <span className="text-body font-medium">
                              {coffee.varieties.join(", ")}
                            </span>
                          </Stack>
                        )}
                        {coffee.bean_species && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Flask"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Species
                            </span>
                            <span className="text-body font-medium">
                              {coffee.bean_species}
                            </span>
                          </Stack>
                        )}
                        {coffee.crop_year && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Calendar"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Crop Year
                            </span>
                            <span className="text-body font-medium">
                              {coffee.crop_year}
                            </span>
                          </Stack>
                        )}
                        {coffee.harvest_window && (
                          <Stack gap="1">
                            <span className="flex items-center gap-1.5 text-label">
                              <Icon
                                name="Sun"
                                size={14}
                                className="text-accent shrink-0"
                              />
                              Harvest
                            </span>
                            <span className="text-body font-medium">
                              {coffee.harvest_window}
                            </span>
                          </Stack>
                        )}
                        {coffee.brew_methods &&
                          coffee.brew_methods.length > 0 && (
                            <Stack gap="1" className="col-span-2 md:col-span-4">
                              <span className="flex items-center gap-1.5 text-label">
                                <Icon
                                  name="Coffee"
                                  size={14}
                                  className="text-accent shrink-0"
                                />
                                Suggested brew methods
                              </span>
                              <span className="text-body font-medium">
                                {coffee.brew_methods.map((bm, i) => (
                                  <Fragment key={bm.id}>
                                    {i > 0 ? ", " : null}
                                    <DiscoveryInlineLink
                                      slug={discoverySlugForBrewMethodKey(
                                        bm.key
                                      )}
                                    >
                                      {bm.label}
                                    </DiscoveryInlineLink>
                                  </Fragment>
                                ))}
                              </span>
                            </Stack>
                          )}
                      </div>
                    )}

                    {hasTags && (
                      <div className="pt-5 border-t border-border/20">
                        <Stack gap="3">
                          <span className="text-label">Tags</span>
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
              )}
            </Stack>
          </Band>
        );
      })()}

      {/* ═══════════════════════════════════════════
              SECTION 3: FLAVOR PROFILE (cream band)
          ═══════════════════════════════════════════ */}
      <Band id="flavor">
        <Stack gap="12">
          <CoffeeSensoryProfile coffee={coffee} className="border-0" />

          <div>
            <Stack gap="4">
              <div>
                <h2 className="text-title text-balance leading-[1.1]">
                  Tasting <Accent>Notes</Accent>
                </h2>
                <p className="mt-1 text-caption text-muted-foreground">
                  Original tasting notes from {coffee.roaster?.name}
                </p>
              </div>

              {coffee.flavor_notes.length > 0 ? (
                <TagList>
                  {coffee.flavor_notes.map((note) => (
                    <Tag key={note.id} variant="outline" size="small">
                      {note.label}
                    </Tag>
                  ))}
                </TagList>
              ) : (
                <p className="italic text-muted-foreground">
                  No tasting notes cataloged
                </p>
              )}
            </Stack>
          </div>
        </Stack>
      </Band>

      {/* ═══════════════════════════════════════════
              SECTION 4: PRICING & AVAILABILITY (warm band)
          ═══════════════════════════════════════════ */}
      <Band id="pricing" ground="warm" texture="grain-coarse">
        <Stack gap="4">
          <h2 className="text-title text-balance leading-[1.1]">
            Pricing & <Accent>Availability</Accent>
          </h2>

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
      </Band>

      {/* ═══════════════════════════════════════════
              SECTION 5: RATE & REVIEW (cream band)
          ═══════════════════════════════════════════ */}
      <Band id="reviews">
        <div ref={ratingSectionRef} className="scroll-mt-40">
          <Stack gap="8">
            <h2 className="text-title text-balance leading-[1.1] italic">
              {stats?.review_count
                ? `${stats.review_count} ${stats.review_count === 1 ? "Review" : "Reviews"} for `
                : "Be the first to review "}
              <span className="text-accent">{coffee.name}</span>
            </h2>
            {/* Review Stats */}
            <ReviewStats stats={stats || null} />

            {/* Rating form (interactive input panel — a card is the right affordance) */}
            <div className="surface-2 rounded-xl p-8 border border-accent/20">
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
              <ReviewList entityType="coffee" reviews={reviews.slice(0, 10)} />
            )}
          </Stack>
        </div>
      </Band>

      {/* ═══════════════════════════════════════════
              SECTION 6: SIMILAR COFFEES (warm band)
          ═══════════════════════════════════════════ */}
      <Band ground="warm" texture="grain">
        <SimilarCoffees coffee={coffee} />
      </Band>

      {/* Exit Intent Modal */}
      <CoffeeExitIntentRating
        key={coffee.id}
        coffee={coffee}
        reviews={reviews}
      />

      {/* Floating Rate CTA */}
      <FloatingRateCTA
        heroButtonRef={heroRateButtonRef}
        ratingSectionRef={ratingSectionRef}
      />
    </div>
  );
}
