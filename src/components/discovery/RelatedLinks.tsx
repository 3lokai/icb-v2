import { Accent } from "@/components/primitives/accent";
import { RegionCard } from "@/components/cards/RegionCard";
import { fetchNearbyRegionCards } from "@/lib/discovery/region-facts";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import {
  discoveryPagePath,
  getLandingPageConfig,
  type LandingPageType,
} from "@/lib/discovery/landing-pages";
import { Stack } from "../primitives/stack";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";

type RelatedLinksProps = {
  relatedSlugs: string[];
  /**
   * Region pages already carry their origin cross-links in RegionDetailSection's
   * "Explore Nearby Regions", and `related` repeats `nearbyRegions` almost verbatim on
   * every one of them. Set on region pages so the same origins don't appear twice.
   */
  excludeRegions?: boolean;
};

/**
 * RelatedLinks - Internal links to other discovery pages
 * Uses existing Button/Link patterns
 */
export async function RelatedLinks({
  relatedSlugs,
  excludeRegions = false,
}: RelatedLinksProps) {
  // Origins get the plate treatment; everything else stays a text card. Split rather
  // than mixed into one grid — a horizontal compact card wedged between tall text cards
  // reads as a layout bug.
  const regionSlugs = excludeRegions
    ? []
    : relatedSlugs.filter(
        (slug) => getLandingPageConfig(slug)?.type === "region"
      );
  const regionCards = await fetchNearbyRegionCards(regionSlugs);
  const regionSlugSet = new Set(regionSlugs);

  const relatedPages = relatedSlugs
    .filter((slug) => !regionSlugSet.has(slug))
    .map((slug) => {
      const config = getLandingPageConfig(slug);
      if (!config) return null;
      return {
        slug,
        title: config.h1,
        teaserTitle: config.teaserTitle || config.entityLabel,
        teaserDescription: config.teaserDescription || config.intro,
        type: config.type as LandingPageType,
      };
    })
    .filter(
      (
        page
      ): page is {
        slug: string;
        title: string;
        teaserTitle: string;
        teaserDescription: string;
        type: LandingPageType;
      } => page !== null
    );

  if (relatedPages.length === 0 && regionCards.length === 0) {
    return null;
  }

  return (
    <Section spacing="default" contained={false}>
      <div className="mb-12">
        <Stack gap="6">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              Further Exploration
            </span>
          </div>
          <h2 className="text-title text-balance leading-[1.1] tracking-tight">
            Explore <Accent>More.</Accent>
          </h2>
          <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
            Discover other ways to find your perfect coffee.
          </p>
        </Stack>
      </div>
      {regionCards.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regionCards.map((nearby) => (
            <RegionCard
              coffeeCount={nearby.coffeeCount}
              href={nearby.href}
              key={nearby.slug}
              region={nearby.region}
              variant="compact"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPages.map((page) => (
          <Link
            key={page.slug}
            href={discoveryPagePath(page.slug)}
            className="group block h-full"
          >
            <Card className="h-full hover-lift transition-all duration-300 border-border/50 bg-card/40 hover:bg-card/60 overflow-hidden relative">
              {/* Magazine accent: single-accent top rule (category is signalled by the label below) */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/60 opacity-40 transition-opacity group-hover:opacity-100" />

              <CardContent className="p-6 h-full">
                <Stack gap="6" className="h-full flex-col">
                  <div>
                    <span className="text-micro font-bold tracking-widest text-muted-foreground uppercase">
                      {page.type.replaceAll("_", " ")}
                    </span>
                    <h3 className="text-heading font-serif mt-2 group-hover:text-accent transition-colors">
                      {page.teaserTitle}
                    </h3>
                  </div>

                  <p className="text-body-medium text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
                    {page.teaserDescription}
                  </p>

                  <div className="flex items-center gap-2 text-label font-bold text-accent group-hover:gap-3 transition-all">
                    Explore
                    <Icon icon={ArrowRightIcon} size={16} />
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
