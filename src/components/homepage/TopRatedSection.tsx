"use client";

import Link from "next/link";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";
import {
  ArrowRightIcon,
  StarIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Accent } from "@/components/primitives/accent";
import { Reveal } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { useTopRatedCoffees } from "@/hooks/useHomePageQueries";
import { formatCommunityCoffeeReviewLabel } from "@/lib/utils/community-review-label";

const COFFEES_RATING_SORT_HREF = "/coffees?sort=rating_desc";

// Warm-paper band (surface-1) in the homepage's alternating ground rhythm.
const sectionSurfaceClassName =
  "bg-card relative overflow-hidden border-y border-border/60";

type TopRatedSectionProps = {
  /** Metric B: rows in `latest_reviews_per_identity` for `entity_type = coffee`. */
  communityCoffeeReviewCount?: number | null;
};

export default function TopRatedSection({
  communityCoffeeReviewCount = null,
}: TopRatedSectionProps) {
  const { data, isLoading } = useTopRatedCoffees(6);
  const coffees = data?.items || [];

  if (!isLoading && coffees.length === 0) {
    return (
      <Section
        id="top-rated"
        spacing="loose"
        className={sectionSurfaceClassName}
      >
        <div className="relative z-10 py-8 text-center">
          <h2 className="mb-4 text-title">Top Rated</h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
          <p className="text-body text-muted-foreground">
            Top-rated coffees will appear here as the community adds ratings.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="top-rated" spacing="loose" className={sectionSurfaceClassName}>
      {/* Decorative background element */}
      <div className="absolute -right-24 -top-24 opacity-[0.03] select-none pointer-events-none">
        <Icon icon={StarIcon} size={400} strokeWidth={1} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10">
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-32">
          <Stack gap="8">
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              Top <Accent>Rated.</Accent>
            </h2>

            <p className="text-body-large lg:text-subheading text-muted-foreground leading-relaxed">
              The coffees visitors love most right now—ranked by average rating
              from real brews and community feedback across the directory.
            </p>

            <div className="pt-2">
              <Link href={COFFEES_RATING_SORT_HREF}>
                <Button
                  variant="secondary"
                  className="group text-micro font-bold uppercase tracking-[0.15em] text-foreground hover:bg-transparent hover:text-accent transition-all"
                >
                  Browse all by rating
                  <Icon
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    icon={ArrowRightIcon}
                  />
                </Button>
              </Link>
            </div>

            {/* Microstats or subtle proof point */}
            <div className="pt-8 border-t border-border/40">
              <div className="flex items-center gap-4 text-micro text-muted-foreground uppercase tracking-widest font-medium">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center"
                    >
                      <Icon icon={UserIcon} size={10} />
                    </div>
                  ))}
                </div>
                <span>
                  {formatCommunityCoffeeReviewLabel(communityCoffeeReviewCount)}
                </span>
              </div>
            </div>
          </Stack>
        </div>

        <div className="md:col-span-7 lg:col-span-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <CoffeeCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {coffees.map((coffee) => (
                <CoffeeCard
                  coffee={coffee}
                  key={coffee.slug || coffee.coffee_id}
                />
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
