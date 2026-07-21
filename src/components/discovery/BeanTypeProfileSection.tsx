import Link from "next/link";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  brewMethodDiscoveryLinkClassName,
  brewSlugToLabel,
} from "@/lib/discovery/brew-method-labels";
import {
  discoveryPagePath,
  getLandingPageConfig,
  type BeanTypeProfileConfig,
} from "@/lib/discovery/landing-pages";
import { cn } from "@/lib/utils";
import {
  ArrowsLeftRightIcon,
  CheckCircleIcon,
  CoffeeIcon,
  FireIcon,
  InfoIcon,
  ListNumbersIcon,
  MapPinIcon,
  PlantIcon,
  SparkleIcon,
  StarIcon,
  ThumbsUpIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Icon } from "@/components/common/Icon";
import { BeanTypeComparisonGrid } from "@/components/discovery/BeanTypeComparisonGrid";
import { BEAN_TYPE_NAV_SLUGS } from "@/lib/discovery/landing-pages/bean-species-visuals";

type BeanTypeProfileSectionProps = {
  profile: BeanTypeProfileConfig;
  slug: string;
  className?: string;
};

/** Short label for a bean type page, derived from its entityLabel. */
function beanTypeSlugToLabel(slug: string): string {
  const page = getLandingPageConfig(slug);
  if (!page) return slug;
  return page.entityLabel;
}

/** Short label for a roast level discovery page. */
function roastLinkLabel(slug: string): string {
  const cfg = getLandingPageConfig(slug);
  if (!cfg) return slug;
  return cfg.entityLabel.replace(/\s*Roast$/, "");
}

function RoastPairingLinks({
  label,
  slugs,
  icon,
}: {
  label: string;
  slugs: string[];
  icon?: ComponentType<IconProps>;
}) {
  const links = slugs
    .map((s) => {
      const cfg = getLandingPageConfig(s);
      if (!cfg || cfg.type !== "roast_level") return null;
      return { slug: s, text: roastLinkLabel(s) };
    })
    .filter((x): x is { slug: string; text: string } => x !== null);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2 w-36 shrink-0">
        {icon && (
          <Icon icon={icon} className="h-4 w-4 text-muted-foreground/60" />
        )}
        <p className="text-label uppercase">{label}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map(({ slug: s, text }) => (
          <Link
            key={s}
            href={discoveryPagePath(s)}
            className={cn(
              brewMethodDiscoveryLinkClassName,
              "bg-muted/30 hover:bg-transparent border-transparent hover:border-accent/30 shadow-none transition-colors"
            )}
          >
            {text}
          </Link>
        ))}
      </div>
    </div>
  );
}

function hasValidRoastPairingSlugs(slugs: string[]): boolean {
  return slugs.some((s) => {
    const cfg = getLandingPageConfig(s);
    return cfg?.type === "roast_level";
  });
}

export function BeanTypeProfileSection({
  profile,
  slug,
  className,
}: BeanTypeProfileSectionProps) {
  const {
    characteristics,
    flavourProfile,
    indiaContext,
    brewGuidance,
    comparison,
    varietyHighlights,
    roastPairing,
    commonMistakes,
    icbDataNote,
  } = profile;

  const comparisonLinks = comparison.relatedSlugs
    .map((s) => {
      const cfg = getLandingPageConfig(s);
      if (!cfg || cfg.type !== "bean_type" || s === slug) return null;
      return { slug: s, label: beanTypeSlugToLabel(s) };
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

  const showRoastPairing =
    roastPairing &&
    (hasValidRoastPairingSlugs(roastPairing.best) ||
      hasValidRoastPairingSlugs(roastPairing.works));

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        divider
        className="mb-8"
        overline="Bean type profile"
        title="What this *bean type* is"
        description="Characteristics, flavour, Indian context, and brew guidance — the practical picture behind the catalogue."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Guide
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full space-y-12 px-4 md:px-0">
        {/* 1. Characteristics — quick-reference stat cards */}
        {characteristics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Icon icon={ListNumbersIcon} className="h-5 w-5 text-accent/70" />
              <h3 className="text-heading">At a Glance</h3>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {characteristics.map((item) => (
                <div
                  key={item.label}
                  className="surface-1 relative overflow-hidden rounded-2xl card-padding card-hover group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  <Stack gap="2" className="relative z-10">
                    <dt className="text-micro font-bold uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="text-body-large font-serif leading-tight text-foreground">
                      {item.value}
                    </dd>
                  </Stack>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* 2. Flavour profile — tags + Indian context */}
        <div className="surface-1 relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl shadow-primary/5">
          <div className="relative z-10">
            <Stack gap="8">
              <Stack gap="4">
                <div className="flex items-center gap-2">
                  <Icon icon={SparkleIcon} className="h-4 w-4 text-accent/60" />
                  <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                    Typical notes
                  </p>
                </div>
                <Cluster gap="2" className="flex-wrap">
                  {flavourProfile.typical.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-lg border-accent/10 bg-accent/5 px-4 py-1.5 text-caption font-medium text-accent transition-all hover:border-accent/20 hover:bg-accent/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </Cluster>
              </Stack>

              <div className="relative border-l-2 border-accent/30 py-1 pl-5">
                <p className="text-body leading-relaxed text-foreground/80">
                  {flavourProfile.indianContext}
                </p>
              </div>
            </Stack>
          </div>
        </div>

        {/* 2b. Bean type comparison grid — species images + category links */}
        {BEAN_TYPE_NAV_SLUGS.has(slug) && (
          <BeanTypeComparisonGrid activeSlug={slug} />
        )}

        {/* 3. Variety highlights — cards for key varieties */}
        {varietyHighlights && varietyHighlights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Icon icon={PlantIcon} className="h-5 w-5 text-accent/70" />
              <h3 className="text-heading">Key Varieties</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {varietyHighlights.map((v) => (
                <div
                  key={v.name}
                  className="surface-1 relative overflow-hidden rounded-2xl card-padding group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  <Stack gap="3" className="relative z-10">
                    <p className="text-body-large font-serif font-medium text-foreground">
                      {v.name}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Icon
                          icon={CoffeeIcon}
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent/60"
                        />
                        <p className="text-caption text-foreground/80 leading-relaxed">
                          {v.cup}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon
                          icon={MapPinIcon}
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60"
                        />
                        <p className="text-caption text-muted-foreground leading-relaxed">
                          {v.cultivation}
                        </p>
                      </div>
                    </div>
                  </Stack>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Indian context — promoted block */}
        <div className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-accent/5 shadow-sm p-6 py-10 md:px-12 md:py-14">
          <Stack gap="6" className="relative z-10 w-full">
            <div className="flex items-center gap-2">
              <Icon icon={MapPinIcon} className="h-5 w-5 text-accent/70" />
              <p className="text-overline text-accent tracking-[0.15em] uppercase">
                Indian Coffee Context
              </p>
            </div>
            <p className="text-body-large text-pretty text-muted-foreground leading-relaxed font-light">
              {indiaContext}
            </p>
          </Stack>
        </div>

        {/* 5. Brew guidance */}
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <h3 className="text-heading mb-6 flex items-center gap-2">
            <Icon icon={CoffeeIcon} className="h-5 w-5 text-accent/70" />
            Brew Guidance
          </h3>

          {brewGuidance.recommended.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 w-36 shrink-0">
                <Icon
                  icon={StarIcon}
                  className="h-4 w-4 text-muted-foreground/60"
                />
                <p className="text-label uppercase">Recommended</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {brewGuidance.recommended.map((methodSlug) => (
                  <Link
                    key={methodSlug}
                    href={discoveryPagePath(methodSlug)}
                    className={cn(
                      brewMethodDiscoveryLinkClassName,
                      "bg-muted/30 hover:bg-transparent border-transparent hover:border-accent/30 shadow-none transition-colors"
                    )}
                  >
                    {brewSlugToLabel(methodSlug)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="surface-2 rounded-xl p-5 mt-4">
            <div className="flex items-start gap-3">
              <Icon
                icon={InfoIcon}
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              />
              <p className="text-caption font-medium leading-relaxed text-foreground/80">
                {brewGuidance.notes}
              </p>
            </div>
          </div>
        </div>

        {/* 6. Roast pairing */}
        {showRoastPairing && (
          <>
            <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />
            <div className="max-w-5xl mx-auto w-full space-y-6">
              <h3 className="text-heading mb-6 flex items-center gap-2">
                <Icon icon={FireIcon} className="h-5 w-5 text-accent/70" />
                Roast Pairing
              </h3>
              <Stack gap="4">
                <RoastPairingLinks
                  icon={StarIcon}
                  label="Best Match"
                  slugs={roastPairing!.best}
                />
                <RoastPairingLinks
                  icon={ThumbsUpIcon}
                  label="Also Works"
                  slugs={roastPairing!.works}
                />
              </Stack>

              {roastPairing!.avoid && (
                <p className="text-caption border-l-2 border-destructive/30 pl-4 max-w-3xl mt-6">
                  <span className="font-medium text-foreground">Avoid:</span>{" "}
                  {roastPairing!.avoid}
                </p>
              )}
            </div>
          </>
        )}

        {/* 7. Common mistakes — accordion */}
        {commonMistakes && commonMistakes.length > 0 && (
          <>
            <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />
            <div className="max-w-5xl mx-auto w-full space-y-6">
              <h3 className="text-heading mb-6 flex items-center gap-2">
                <Icon
                  icon={WarningCircleIcon}
                  className="h-5 w-5 text-accent/70"
                />
                Common Mistakes
              </h3>
              <Accordion type="multiple" className="space-y-3">
                {commonMistakes.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`mistake-${i}`}
                    className="rounded-xl border border-border/40 bg-card/30 px-5 data-[state=open]:bg-card/60 transition-colors"
                  >
                    <AccordionTrigger className="text-body font-medium py-4 [&[data-state=open]>svg]:rotate-180">
                      <span className="flex items-center gap-2 text-left">
                        <Icon
                          icon={XCircleIcon}
                          className="h-4 w-4 shrink-0 text-destructive/60"
                        />
                        {item.mistake}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-6 text-caption leading-relaxed text-foreground/80">
                      <span className="flex items-start gap-2">
                        <Icon
                          icon={CheckCircleIcon}
                          className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
                        />
                        <span>{item.fix}</span>
                      </span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </>
        )}

        {/* 8. Comparison — links to other bean types */}
        {comparisonLinks.length > 0 && (
          <>
            <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />
            <div className="max-w-5xl mx-auto w-full space-y-6">
              <h3 className="text-heading mb-6 flex items-center gap-2">
                <Icon
                  icon={ArrowsLeftRightIcon}
                  className="h-5 w-5 text-accent/70"
                />
                Compare Bean Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {comparisonLinks.map(({ slug: s, label }) => (
                  <Link
                    key={s}
                    href={discoveryPagePath(s)}
                    className={cn(
                      brewMethodDiscoveryLinkClassName,
                      "bg-muted/30 hover:bg-transparent border-transparent hover:border-accent/30 shadow-none transition-colors"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <p className="text-caption border-l-2 border-accent/30 pl-4 max-w-3xl mt-6">
                {comparison.note}
              </p>
            </div>
          </>
        )}

        {/* 9. ICB data note */}
        <aside className="max-w-5xl mx-auto w-full rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 md:px-6 md:py-5">
          <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            On Indian Coffee Beans
          </p>
          <p className="text-caption text-muted-foreground leading-relaxed">
            {icbDataNote}
          </p>
        </aside>
      </div>
    </Section>
  );
}
