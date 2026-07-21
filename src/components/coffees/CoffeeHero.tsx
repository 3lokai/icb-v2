"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { CoffeeDetail } from "@/types/coffee-types";
import { SPECIES_LABELS } from "@/types/coffee-types";
import type { EntityReviewStats } from "@/types/review-types";
import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";
import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { recordCoffeeView } from "@/app/actions/coffee-views";
import { capture } from "@/lib/posthog";
import { queryKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import { Band } from "@/components/primitives/band";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import CoffeeImageCarousel from "@/components/layout/carousel-image";
import { WishlistButton } from "@/components/coffees/WishlistButton";

function trimDescription(text: string | null, maxLen = 160): string | null {
  if (!text) return null;
  if (text.length <= maxLen) return text;
  const trimmed = text.slice(0, maxLen);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "…";
}

type CoffeeHeroProps = {
  coffee: CoffeeDetail;
  stats: EntityReviewStats | null;
};

/**
 * Coffee hero/overview. Client (interactive CTAs, view tracking, hash scroll,
 * adaptive image carousel) but receives coffee + stats as PROPS — no data hooks —
 * so its SSR output matches hydration and it never reflows. UI is unchanged.
 */
export function CoffeeHero({ coffee, stats }: CoffeeHeroProps) {
  const queryClient = useQueryClient();

  // PostHog tracking + record view
  useEffect(() => {
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

  // Hash scroll on mount (external links use #rating-section)
  useEffect(() => {
    if (window.location.hash === "#rating-section") {
      requestAnimationFrame(() => {
        document
          .getElementById("rate-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const handleScrollToRating = () => {
    document
      .getElementById("rate-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToStory = () => {
    document
      .getElementById("coffee-story")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const trimmedDesc = trimDescription(coffee.description_md);

  // Synthesized alt-text fallback for images lacking a stored `alt`.
  const displayName = getCoffeeDisplayName(coffee);
  const roast = coffee.roast_level_raw || coffee.roast_level;
  const species = coffee.bean_species
    ? (SPECIES_LABELS[coffee.bean_species] ?? coffee.bean_species)
    : null;
  const firstRegion = coffee.regions[0];
  const region = firstRegion
    ? firstRegion.display_name ||
      [firstRegion.country, firstRegion.state, firstRegion.subregion]
        .filter(Boolean)
        .join(", ") ||
      firstRegion.subregion
    : null;
  const descriptor = [roast && `${roast} roast`, species, "coffee"]
    .filter(Boolean)
    .join(" ");
  const imageAltFallback = [
    displayName,
    region ? `${descriptor} from ${region}` : descriptor,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <Band id="overview" className="py-10 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
        {/* Image */}
        <div className="w-full max-w-md mx-auto md:mx-0">
          <CoffeeImageCarousel
            images={coffee.images}
            coffeeName={displayName}
            altFallback={imageAltFallback}
            className="rounded-xl"
          />
        </div>

        {/* Product Info */}
        <Stack gap="4" className="pt-2">
          {/* Name + Roaster */}
          <Stack gap="1">
            <h1 className="text-display italic leading-[1.05] text-balance">
              {getCoffeeDisplayName(coffee)}
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
            {stats && stats.review_count !== null && stats.review_count > 0 ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-card">
                <Icon
                  icon={StarIcon}
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
              {coffee.description_md && coffee.description_md.length > 160 && (
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
              id="coffee-rate-hero"
              size="lg"
              className="bg-primary shadow-sm hover:shadow-md transition-shadow min-w-[160px]"
              onClick={handleScrollToRating}
            >
              <Icon
                icon={StarIcon}
                size={18}
                className="mr-2 fill-rating text-rating"
              />
              Rate this coffee
            </Button>
            <WishlistButton
              variant="button"
              size="lg"
              coffeeId={coffee.id}
              className="min-w-[160px]"
            />
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
  );
}
