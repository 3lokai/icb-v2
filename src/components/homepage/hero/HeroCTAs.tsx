"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { capture } from "@/lib/posthog";
import { useSearchContext } from "@/providers/SearchProvider";
import type { HeroSegmentPayload } from "@/types/hero-segment";

const heroCtaButtonClass = "hover-lift px-8 lg:px-10";

type HeroCTAsProps = {
  hero: HeroSegmentPayload;
};

export function HeroCTAs({ hero }: HeroCTAsProps) {
  const { openSearch } = useSearchContext();
  const { segment, recentlyViewed, isAuthenticated } = hero;

  const firstRecent = recentlyViewed[0];
  const continueLastViewedHref = firstRecent
    ? `/roasters/${firstRecent.roasterSlug}/coffees/${firstRecent.coffeeSlug}`
    : null;

  const captureCta = (label: string, extra?: Record<string, unknown>) => {
    capture("hero_cta_clicked", {
      cta_label: label,
      hero_segment: segment,
      ...extra,
    });
  };

  const effectiveSegment =
    segment === "discovery" ||
    segment === "returning_browser" ||
    segment === "rating_progress" ||
    segment === "anon_conversion" ||
    segment === "authenticated_profile"
      ? segment
      : "discovery";

  return (
    <div className="animate-fade-in-scale delay-300 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {effectiveSegment === "discovery" && (
        <>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="default"
          >
            <Link href="/coffees" onClick={() => captureCta("Explore coffees")}>
              <Icon className="mr-2 shrink-0" name="Coffee" size={18} />
              Explore coffees
            </Link>
          </Button>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="outline"
          >
            <Link
              href="/#top-rated"
              onClick={() => captureCta("Top rated coffees")}
            >
              Top rated coffees
            </Link>
          </Button>
        </>
      )}

      {effectiveSegment === "returning_browser" && (
        <>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="default"
          >
            <Link href="/coffees" onClick={() => captureCta("Explore coffees")}>
              <Icon className="mr-2 shrink-0" name="Coffee" size={18} />
              Explore coffees
            </Link>
          </Button>
          {continueLastViewedHref && firstRecent ? (
            <Button
              asChild
              className={`${heroCtaButtonClass} min-w-0 max-w-full sm:max-w-md`}
              size="lg"
              variant="outline"
            >
              <Link
                href={continueLastViewedHref}
                title={firstRecent.name}
                onClick={() =>
                  captureCta("Continue with last viewed", {
                    coffee_name: firstRecent.name,
                  })
                }
              >
                <span className="truncate">
                  Continue with {firstRecent.name}
                </span>
              </Link>
            </Button>
          ) : null}
        </>
      )}

      {effectiveSegment === "rating_progress" && (
        <>
          <Button
            className={heroCtaButtonClass}
            onClick={() => {
              captureCta("Rate another coffee");
              openSearch(undefined, true);
            }}
            size="lg"
            variant="default"
          >
            <Icon className="mr-2" name="Star" size={18} />
            Rate another coffee
          </Button>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="outline"
          >
            {isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => captureCta("View your profile")}
              >
                <Icon className="mr-2" name="User" size={18} />
                View your profile
              </Link>
            ) : (
              <Link
                href="/auth"
                onClick={() => captureCta("Save your coffee journey")}
              >
                Save your coffee journey
              </Link>
            )}
          </Button>
        </>
      )}

      {effectiveSegment === "anon_conversion" && (
        <>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="default"
          >
            <Link
              href="/auth?mode=sign-up"
              onClick={() => captureCta("Save your profile")}
            >
              Save your profile
            </Link>
          </Button>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="outline"
          >
            <Link
              href="/profile/anon"
              onClick={() => captureCta("Review your ratings")}
            >
              Review your ratings
            </Link>
          </Button>
        </>
      )}

      {effectiveSegment === "authenticated_profile" && (
        <>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="default"
          >
            <Link
              href="/profile"
              onClick={() => captureCta("View your profile")}
            >
              <Icon className="mr-2" name="User" size={18} />
              View your profile
            </Link>
          </Button>
          <Button
            className={heroCtaButtonClass}
            onClick={() => {
              captureCta("Rate another coffee");
              openSearch(undefined, true);
            }}
            size="lg"
            variant="outline"
          >
            <Icon className="mr-2" name="Star" size={18} />
            Rate another coffee
          </Button>
        </>
      )}
    </div>
  );
}
