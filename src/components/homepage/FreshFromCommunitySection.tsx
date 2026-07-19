import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { StarRating } from "@/components/common/StarRating";
import { Accent } from "@/components/primitives/accent";
import { Reveal } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchFeaturedReviews } from "@/lib/data/fetch-featured-reviews";
import { formatBrewMethodLabels } from "@/lib/utils/coffee-card-utils";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";

const COFFEES_RATING_SORT_HREF = "/coffees?sort=rating_desc";

/** Truncate to a word boundary, appending an ellipsis only when clipped. */
function truncateAtWord(text: string, max = 140): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max).replace(/\s\S*$/, "") + "…";
}

function initials(username: string | null): string {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
}

/**
 * "Fresh from the community" — real signed-in reviewers' written comments as
 * pull-quote cards, plus a directory-wide ratings line. Static server component,
 * one cached RPC round trip. Renders nothing unless a full set of 3 is available.
 */
export default async function FreshFromCommunitySection() {
  const data = await fetchFeaturedReviews(3);

  // Never render placeholders: bail on failure or an incomplete set.
  if (!data || data.reviews.length < 3) return null;

  return (
    <Section spacing="default" id="fresh-from-community">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              Community voices
            </span>
          </div>
          <h2 className="text-title text-balance">
            Fresh from the <Accent>community.</Accent>
          </h2>
          <p className="text-body-large text-muted-foreground mt-3 max-w-2xl text-pretty">
            {data.ratings_last_30d}
            {
              " new ratings in the last 30 days — here's what people are brewing and saying."
            }
          </p>
        </div>
        <Link
          href={COFFEES_RATING_SORT_HREF}
          className="text-micro font-bold uppercase tracking-[0.15em] text-foreground hover:text-accent transition-colors"
        >
          All ratings →
        </Link>
      </div>

      <Reveal className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {data.reviews.map((review) => {
          const brewLabel = formatBrewMethodLabels(
            review.brew_method ? [review.brew_method] : null
          )[0];

          return (
            <article
              key={review.id}
              className="flex flex-col gap-5 rounded-xl border border-border/60 bg-card p-6"
            >
              {/* Reviewer */}
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  {review.avatar_url && (
                    <AvatarImage
                      src={review.avatar_url}
                      alt={review.username ?? "Reviewer"}
                    />
                  )}
                  <AvatarFallback className="text-caption font-medium">
                    {initials(review.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-label-large truncate">
                    {review.username ?? "A coffee lover"}
                  </p>
                  <p className="text-micro text-muted-foreground">
                    {review.reviewer_coffee_count} coffees rated ·{" "}
                    {formatDistanceToNow(new Date(review.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {/* Pull-quote */}
              <blockquote className="text-body-large flex-1 font-serif text-foreground">
                “{truncateAtWord(review.comment)}”
              </blockquote>

              {/* Footer: coffee + brew method, rating right-aligned */}
              <div className="flex items-end justify-between gap-3 border-t border-border/40 pt-4">
                <div className="min-w-0">
                  <Link
                    href={coffeeDetailHref(
                      review.roaster_slug,
                      review.coffee_slug
                    )}
                    className="text-caption font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
                  >
                    {review.coffee_name}
                  </Link>
                  {brewLabel && (
                    <p className="text-micro text-muted-foreground mt-0.5">
                      {brewLabel}
                    </p>
                  )}
                </div>
                {review.rating != null && review.rating > 0 && (
                  <div className="shrink-0">
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </Reveal>

      <p className="text-body text-muted-foreground mt-10 text-center">
        <span className="text-foreground font-medium">
          {data.total_ratings.toLocaleString("en-IN")}
        </span>{" "}
        ratings and counting across the directory —{" "}
        <Link
          href={COFFEES_RATING_SORT_HREF}
          className="text-accent font-medium hover:underline"
        >
          add yours
        </Link>
        .
      </p>
    </Section>
  );
}
