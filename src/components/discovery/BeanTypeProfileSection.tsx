import Link from "next/link";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Badge } from "@/components/ui/badge";
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
import { Icon } from "@/components/common/Icon";

type BeanTypeProfileSectionProps = {
  profile: BeanTypeProfileConfig;
  slug: string;
  className?: string;
};

/** Short label for a bean type page, derived from its h1. */
function beanTypeSlugToLabel(slug: string): string {
  const page = getLandingPageConfig(slug);
  if (!page) return slug;
  return page.h1
    .replace(" Coffee in India", "")
    .replace(" in India", "")
    .trim();
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
    icbDataNote,
  } = profile;

  const comparisonLinks = comparison.relatedSlugs
    .map((s) => {
      const cfg = getLandingPageConfig(s);
      if (!cfg || cfg.type !== "bean_type" || s === slug) return null;
      return { slug: s, label: beanTypeSlugToLabel(s) };
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

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
              <Icon name="ListNumbers" className="h-5 w-5 text-accent/70" />
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
                  <Icon name="Sparkle" className="h-4 w-4 text-accent/60" />
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

        {/* 3. Indian context — promoted block */}
        <div className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-accent/5 shadow-sm p-6 py-10 md:px-12 md:py-14">
          <Stack gap="6" className="relative z-10 w-full">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" className="h-5 w-5 text-accent/70" />
              <p className="text-overline text-accent tracking-[0.15em] uppercase">
                Indian Coffee Context
              </p>
            </div>
            <p className="text-body-large text-pretty text-muted-foreground leading-relaxed font-light">
              {indiaContext}
            </p>
          </Stack>
        </div>

        {/* 4. Brew guidance */}
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <h3 className="text-heading mb-6 flex items-center gap-2">
            <Icon name="Coffee" className="h-5 w-5 text-accent/70" />
            Brew Guidance
          </h3>

          {brewGuidance.recommended.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 w-36 shrink-0">
                <Icon
                  name="Star"
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
                name="Info"
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              />
              <p className="text-caption font-medium leading-relaxed text-foreground/80">
                {brewGuidance.notes}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Comparison — links to other bean types */}
        {comparisonLinks.length > 0 && (
          <>
            <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />
            <div className="max-w-5xl mx-auto w-full space-y-6">
              <h3 className="text-heading mb-6 flex items-center gap-2">
                <Icon
                  name="ArrowsLeftRight"
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

        {/* 6. ICB data note */}
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
