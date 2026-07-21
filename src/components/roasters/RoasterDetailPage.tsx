import { Accent } from "@/components/primitives/accent";
import Link from "next/link";
import type { RoasterDetail } from "@/types/roaster-types";
import type { EntityReviewStats } from "@/types/review-types";
import type { ReviewWithProfile } from "@/lib/data/fetch-reviews";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Band } from "@/components/primitives/band";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import { Button } from "@/components/ui/button";
import { ReviewList, ReviewStats } from "@/components/reviews";
import { RatingPanel } from "@/components/reviews/RatingPanel";
import { ExitIntentRating } from "@/components/reviews/ExitIntentRating";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { RoasterCoffeeBreakdown } from "@/components/roasters/RoasterCoffeeBreakdown";
import { RoasterHero } from "@/components/roasters/RoasterHero";
import {
  ScrollspyTabBar,
  type ScrollspySection,
} from "@/components/common/ScrollspyTabBar";
import { FloatingRateCTA } from "@/components/common/FloatingRateCTA";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

type RoasterDetailPageProps = {
  roaster: RoasterDetail;
  stats: EntityReviewStats | null;
  reviews: ReviewWithProfile[];
  className?: string;
};

const SECTIONS: ScrollspySection[] = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "coffees", label: "Coffees" },
  { id: "reviews", label: "Reviews" },
];

/* ─── Main Component (Server Component) ─── */

export function RoasterDetailPage({
  roaster,
  stats,
  reviews,
  className,
}: RoasterDetailPageProps) {
  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      <ScrollspyTabBar sections={SECTIONS} />

      {/* SECTION 1: HERO / OVERVIEW (client island — data via props) */}
      <RoasterHero roaster={roaster} stats={stats} />

      {/* SECTION 2: ROASTER STORY (warm band) */}
      {roaster.description && (
        <Band id="about" ground="warm" texture="grain">
          <Stack gap="4">
            <h2 className="text-title text-balance leading-[1.1] italic">
              About <Accent>{roaster.name}</Accent>
            </h2>
            <Prose className="text-muted-foreground">
              <p className="whitespace-pre-line">{roaster.description}</p>
            </Prose>
          </Stack>
        </Band>
      )}

      {/* SECTION 3: COFFEES SELECTION (cream band) */}
      {roaster.coffees && roaster.coffees.length > 0 && (
        <Band id="coffees">
          <Stack gap="8">
            <h2 className="text-title text-balance leading-[1.1] italic">
              Coffees from <Accent>{roaster.name}</Accent>
            </h2>

            {/* At-a-glance roast/process split across the roaster's full public
                catalog (server-aggregated, not just the cards shown below). */}
            <RoasterCoffeeBreakdown
              roastDistribution={roaster.roast_distribution}
              processDistribution={roaster.process_distribution}
            />

            {/* Surface up to 12 direct SKU links from this indexed roaster page
                (data already loads up to 15) so coffee pages stay well-linked
                without depending on the noindexed lineup listing page. */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roaster.coffees.slice(0, 12).map((coffee) => (
                <CoffeeCard key={coffee.coffee_id} coffee={coffee} />
              ))}
            </div>

            {roaster.coffees.length > 12 && (
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
                    <Icon icon={ArrowRightIcon} size={16} />
                  </Link>
                </Button>
              </div>
            )}
          </Stack>
        </Band>
      )}

      {/* SECTION 4: RATE & REVIEW (warm band) */}
      <Band id="reviews" ground="warm" texture="grain-coarse">
        <div id="rate-section" className="scroll-mt-40">
          <Stack gap="8">
            <h2 className="text-title text-balance leading-[1.1] italic">
              {stats?.review_count
                ? `${stats.review_count} ${stats.review_count === 1 ? "Review" : "Reviews"} for `
                : "Be the first to review "}
              <Accent>{roaster.name}</Accent>
            </h2>
            {/* Review Stats */}
            <ReviewStats stats={stats} />

            {/* Rating form (interactive client island) */}
            <RatingPanel
              entityType="roaster"
              entityId={roaster.id}
              name={roaster.name}
              slug={roaster.slug ?? ""}
            />

            {/* Community Reviews */}
            {reviews.length > 0 && (
              <ReviewList entityType="roaster" reviews={reviews.slice(0, 10)} />
            )}
          </Stack>
        </div>
      </Band>

      {/* CLAIM YOUR PAGE CTA (cream band) */}
      <Band>
        <div className="text-center">
          <p className="text-label text-muted-foreground tracking-wide uppercase">
            Partner with Indian Coffee Beans
          </p>
          <p className="mt-4 text-body text-muted-foreground">
            If you are the owner of{" "}
            <span className="text-foreground font-medium">{roaster.name}</span>,{" "}
            <Link
              href="/roasters/partner"
              className="text-accent hover:underline font-medium italic underline-offset-4"
            >
              claim your page now
            </Link>{" "}
            to get a verified badge and manage your coffees.
          </p>
        </div>
      </Band>

      {/* Exit Intent Modal (client island) */}
      <ExitIntentRating
        key={roaster.id}
        entityType="roaster"
        entityId={roaster.id}
        name={roaster.name}
        slug={roaster.slug ?? ""}
        reviews={reviews}
      />

      {/* Floating Rate CTA (client island) */}
      <FloatingRateCTA
        heroButtonId="roaster-rate-hero"
        ratingSectionId="rate-section"
        entityType="roaster"
      />
    </div>
  );
}
