import { Accent } from "@/components/primitives/accent";
import Link from "next/link";
import { Fragment } from "react";
import type { CoffeeDetail } from "@/types/coffee-types";
import { SPECIES_LABELS } from "@/types/coffee-types";
import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";
import type { EntityReviewStats } from "@/types/review-types";
import type { ReviewWithProfile } from "@/lib/data/fetch-reviews";
import { Icon } from "@/components/common/Icon";
import { Band } from "@/components/primitives/band";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import { ReviewList, ReviewStats } from "@/components/reviews";
import { RatingPanel } from "@/components/reviews/RatingPanel";
import { ExitIntentRating } from "@/components/reviews/ExitIntentRating";
import { cn } from "@/lib/utils";
import { SimilarCoffees } from "./SimilarCoffees";
import { MoreFromRoaster } from "./MoreFromRoaster";
import type { CoffeeSummary } from "@/types/coffee-types";
import { CoffeeSensoryProfile } from "./CoffeeSensoryProfile";
import Tag, { TagList } from "@/components/common/Tag";
import { CoffeeVariantSelector } from "./CoffeeVariantSelector";
import { CoffeeHero } from "@/components/coffees/CoffeeHero";
import {
  ScrollspyTabBar,
  type ScrollspySection,
} from "@/components/common/ScrollspyTabBar";
import { FloatingRateCTA } from "@/components/common/FloatingRateCTA";
import { FAQSection } from "@/components/common/FAQ";
import type { FaqItem } from "@/lib/seo/coffee-faqs";
import { getVarietyDescription } from "@/lib/coffee/variety-info";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { discoveryPagePath } from "@/lib/discovery/landing-pages";
import {
  discoverySlugForBeanSpecies,
  discoverySlugForBrewMethodKey,
  discoverySlugForProcess,
  discoverySlugForRegionDisplayOrSubregion,
  discoverySlugForRoastLevel,
} from "@/lib/utils/coffee-constants";

/* ─── Types ─── */

type CoffeeDetailPageProps = {
  coffee: CoffeeDetail;
  stats: EntityReviewStats | null;
  reviews: ReviewWithProfile[];
  /** Other coffees from the same roaster (for SKU↔SKU internal links). */
  moreFromRoaster?: CoffeeSummary[];
  /** Data-templated FAQs; JSON-LD is emitted by the parent route. */
  faqItems?: FaqItem[];
  className?: string;
};

const SECTIONS: ScrollspySection[] = [
  { id: "overview", label: "Overview" },
  { id: "flavor", label: "Flavor" },
  { id: "pricing", label: "Pricing" },
  { id: "reviews", label: "Reviews" },
];

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

/* ─── Main Component (Server Component) ─── */

export function CoffeeDetailPage({
  coffee,
  stats,
  reviews,
  moreFromRoaster,
  faqItems,
  className,
}: CoffeeDetailPageProps) {
  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      {/* ─── Scrollspy Tab Bar (client island) ─── */}
      <ScrollspyTabBar sections={SECTIONS} />

      {/* SECTION 1: HERO / OVERVIEW (client island — data via props) */}
      <CoffeeHero coffee={coffee} stats={stats} />

      {/* SECTION 2: COFFEE STORY + PRODUCTION (warm band) */}
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
                    About <Accent>{getCoffeeDisplayName(coffee)}</Accent>
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
                              {coffee.varieties.map((v, i) => {
                                const desc = getVarietyDescription(v);
                                return (
                                  <Fragment key={v}>
                                    {i > 0 ? ", " : null}
                                    {desc ? (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span
                                            tabIndex={0}
                                            className="cursor-help underline decoration-dotted underline-offset-4"
                                          >
                                            {v}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs text-pretty">
                                          {desc}
                                        </TooltipContent>
                                      </Tooltip>
                                    ) : (
                                      v
                                    )}
                                  </Fragment>
                                );
                              })}
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
                            <DiscoveryInlineLink
                              slug={discoverySlugForBeanSpecies(
                                coffee.bean_species
                              )}
                              className="text-body font-medium"
                            >
                              {SPECIES_LABELS[coffee.bean_species] ??
                                coffee.bean_species}
                            </DiscoveryInlineLink>
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

      {/* SECTION 3: FLAVOR PROFILE (cream band) */}
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

      {/* SECTION 4: PRICING & AVAILABILITY (warm band) */}
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

      {/* SECTION 5: RATE & REVIEW (cream band) */}
      <Band id="reviews">
        <div id="rate-section" className="scroll-mt-40">
          <Stack gap="8">
            <h2 className="text-title text-balance leading-[1.1] italic">
              {stats?.review_count
                ? `${stats.review_count} ${stats.review_count === 1 ? "Review" : "Reviews"} for `
                : "Be the first to review "}
              <span className="text-accent">
                {getCoffeeDisplayName(coffee)}
              </span>
            </h2>
            {/* Review Stats */}
            <ReviewStats stats={stats} />

            {/* Rating form (interactive client island) */}
            <RatingPanel
              entityType="coffee"
              entityId={coffee.id}
              name={getCoffeeDisplayName(coffee)}
              slug={coffee.slug ?? ""}
            />

            {/* Community Reviews */}
            {reviews.length > 0 && (
              <ReviewList entityType="coffee" reviews={reviews.slice(0, 10)} />
            )}
          </Stack>
        </div>
      </Band>

      {/* SECTION 5b: FAQ (JSON-LD emitted by the route, not here) */}
      {faqItems && faqItems.length > 0 && (
        <Band>
          <FAQSection
            includeStructuredData={false}
            overline="Good to Know"
            badge="Coffee Q&A"
            title={
              <>
                Before You <Accent>Brew.</Accent>
              </>
            }
            description={`Quick answers on how ${getCoffeeDisplayName(coffee)} tastes, brews, and where it comes from.`}
            items={faqItems}
          />
        </Band>
      )}

      {/* SECTION 6: MORE FROM ROASTER + SIMILAR COFFEES (warm band) */}
      {moreFromRoaster && moreFromRoaster.length > 0 && (
        <Band ground="warm" texture="grain">
          <MoreFromRoaster
            coffees={moreFromRoaster}
            roasterName={coffee.roaster.name}
            roasterSlug={coffee.roaster.slug}
          />
        </Band>
      )}
      <Band ground="warm" texture="grain">
        <SimilarCoffees coffee={coffee} />
      </Band>

      {/* Exit Intent Modal (client island) */}
      <ExitIntentRating
        key={coffee.id}
        entityType="coffee"
        entityId={coffee.id}
        name={getCoffeeDisplayName(coffee)}
        slug={coffee.slug ?? ""}
        reviews={reviews}
      />

      {/* Floating Rate CTA (client island) */}
      <FloatingRateCTA
        heroButtonId="coffee-rate-hero"
        ratingSectionId="rate-section"
        entityType="coffee"
      />
    </div>
  );
}
