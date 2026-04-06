import Link from "next/link";
import Image from "next/image";
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
  type RegionProfileConfig,
} from "@/lib/discovery/landing-pages";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

type RegionDetailSectionProps = {
  profile: RegionProfileConfig;
  slug: string;
  guideHref?: string;
  className?: string;
};

function regionSlugToLabel(slug: string): string {
  const page = getLandingPageConfig(slug);
  if (!page) return slug;
  return page.h1.replace(" Coffee in India", "").replace(" Coffee", "").trim();
}

export function RegionDetailSection({
  profile,
  slug,
  guideHref = "/learn",
  className,
}: RegionDetailSectionProps) {
  const {
    flavourProfile,
    roasterContext,
    brewGuidance,
    nearbyRegions,
    icbDataNote,
  } = profile;

  // Resolve nearby region links
  const nearbyRegionLinks = nearbyRegions
    .map((s) => {
      const cfg = getLandingPageConfig(s);
      if (!cfg || cfg.type !== "region") return null;
      return { slug: s, label: regionSlugToLabel(s) };
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Flavour & guidance"
        title="In the *Cup*"
        description="Flavour profile, Indian specialty context, and brew guidance — deeper detail after you've browsed the coffees."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Detail
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl w-full space-y-12 px-4 md:px-0">
        {/* 1. Flavour impact — tags + process variation + roaster context */}
        <div className="surface-1 relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl shadow-primary/5">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 md:grid-cols-5 md:items-start">
            {/* Content column */}
            <div className="md:col-span-5 lg:col-span-3">
              <Stack gap="8">
                {/* Typical flavour tags */}
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

                {/* Process Variation */}
                <div className="rounded-[1.25rem] border border-border bg-muted/30 px-5 py-5 transition-colors hover:bg-muted/50">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="Drop" className="h-4 w-4 text-accent/60" />
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      Process Variation
                    </p>
                  </div>
                  <p className="text-body leading-relaxed text-foreground/90">
                    {flavourProfile.processVariation}
                  </p>
                </div>
              </Stack>
            </div>

            {/* Roaster Context */}
            <div className="relative flex h-full w-full flex-col justify-center gap-4 overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/20 p-6 md:col-span-5 lg:col-span-2">
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/10 blur-3xl"
              />
              <div className="relative z-10 flex items-center gap-2">
                <Icon name="Users" className="h-5 w-5 text-accent/70" />
                <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                  Roaster Sourcing
                </p>
              </div>
              <p className="relative z-10 text-body leading-relaxed text-foreground/80">
                {roasterContext}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Indian Context — Promoted hero block */}
        <div className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-accent/5 shadow-sm grid md:grid-cols-5">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />
          <div className="order-1 md:order-2 md:col-span-2 relative aspect-[4/3] md:aspect-auto h-full min-h-0 bg-muted/20">
            <Image
              src={`/images/discovery/region-${slug}-landscape.png`}
              alt={`${slug} region landscape`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="order-2 md:order-1 md:col-span-3 p-6 py-10 md:px-12 md:py-14 flex items-center">
            <Stack
              gap="6"
              className="relative z-10 w-full text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Icon name="MapPin" className="h-5 w-5 text-accent/70" />
                <p className="text-overline text-accent/80 tracking-[0.15em] uppercase">
                  Indian Specialty Context
                </p>
              </div>
              <p className="text-body-large text-pretty text-muted-foreground leading-relaxed font-light">
                {flavourProfile.indianContext}
              </p>
            </Stack>
          </div>
        </div>

        {/* 3. Brew guidance — recommended methods + notes */}
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <h3 className="text-heading mb-6 flex items-center gap-2">
            <Icon name="Coffee" className="h-5 w-5 text-accent/70" />
            Brew Guidance
          </h3>

          <Stack gap="4">
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
          </Stack>

          <div className="surface-2 rounded-xl p-5 mt-4">
            <div className="flex items-start gap-3">
              <Icon
                name="Info"
                className="mt-0.5 h-5 w-5 shrink-0 text-accent/70"
              />
              <p className="text-body leading-relaxed text-muted-foreground">
                {brewGuidance.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />

        {/* 4. Nearby regions */}
        {nearbyRegionLinks.length > 0 && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <h3 className="text-heading mb-6 flex items-center gap-2">
              <Icon name="MapTrifold" className="h-5 w-5 text-accent/70" />
              Explore Nearby Regions
            </h3>

            <Stack gap="4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex flex-wrap gap-2">
                  {nearbyRegionLinks.map(({ slug: s, label }) => (
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
              </div>
            </Stack>
          </div>
        )}

        {/* 5. ICB data note */}
        <aside className="max-w-5xl mx-auto w-full rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 md:px-6 md:py-5">
          <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
            <Icon name="Database" className="h-4 w-4" />
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
