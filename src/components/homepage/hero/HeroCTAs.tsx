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
  const { segment, recentlyViewed } = hero;

  const firstRecent = recentlyViewed[0];
  const rateFirstHref = firstRecent
    ? `/roasters/${firstRecent.roasterSlug}/coffees/${firstRecent.coffeeSlug}#reviews`
    : "/coffees";

  const captureCta = (label: string) => {
    capture("hero_cta_clicked", {
      cta_label: label,
      hero_segment: segment,
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
              <Icon className="mr-2" name="Coffee" size={18} />
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
              href="/coffees/medium-roast"
              onClick={() => captureCta("Browse by roast")}
            >
              Browse by roast
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
            <Link
              href={rateFirstHref}
              onClick={() => captureCta("Rate a coffee")}
            >
              <Icon className="mr-2" name="Star" size={18} />
              Rate a coffee
            </Link>
          </Button>
          <Button
            asChild
            className={heroCtaButtonClass}
            size="lg"
            variant="outline"
          >
            <Link href="/coffees" onClick={() => captureCta("Explore more")}>
              Explore more
            </Link>
          </Button>
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
            <Link href="/coffees" onClick={() => captureCta("Explore coffees")}>
              Explore coffees
            </Link>
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
