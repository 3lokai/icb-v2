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
  type ProcessProfileConfig,
} from "@/lib/discovery/landing-pages";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/common/Icon";

type ProcessProfileSectionProps = {
  profile: ProcessProfileConfig;
  slug: string;
  guideHref?: string;
  className?: string;
};

const STEP_ICONS: IconName[] = ["Coffee", "Drop", "Package"];

function processSlugToLabel(slug: string): string {
  const page = getLandingPageConfig(slug);
  if (!page) return slug;
  return page.h1.replace(" Coffee in India", "").replace(" Process", "").trim();
}

export function ProcessProfileSection({
  profile,
  slug,
  guideHref = "/learn",
  className,
}: ProcessProfileSectionProps) {
  const {
    steps,
    flavourImpact,
    indiaContext,
    brewGuidance,
    processComparison,
    icbDataNote,
  } = profile;

  // Resolve process comparison links
  const moreIntenseLinks = processComparison.moreIntense
    .map((s) => {
      const cfg = getLandingPageConfig(s);
      if (!cfg || cfg.type !== "process") return null;
      return { slug: s, label: processSlugToLabel(s) };
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

  const lessIntenseLinks = processComparison.lessIntense
    .map((s) => {
      const cfg = getLandingPageConfig(s);
      if (!cfg || cfg.type !== "process") return null;
      return { slug: s, label: processSlugToLabel(s) };
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Process profile"
        title="How this *process* works"
        description="Step-by-step processing, flavour impact, Indian context, and brew guidance — all from the data behind our catalogue."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Guide
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full space-y-12 px-4 md:px-0">
        {/* 1. Processing steps — 3-card horizontal grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Icon name="ListNumbers" className="h-5 w-5 text-accent/70" />
            <h3 className="text-heading">From Cherry to Cup</h3>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.stage}
                className="surface-1 relative overflow-hidden card-padding card-hover group rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
                <Stack gap="4" className="relative z-10">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon
                      className="text-primary"
                      name={STEP_ICONS[index] ?? "Coffee"}
                      size={24}
                    />
                  </div>
                  <Stack gap="1">
                    <div className="flex items-center gap-2">
                      <span className="text-micro font-bold text-accent/80 tracking-tighter tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="h-0.5 w-4 rounded-full bg-accent/20" />
                    </div>
                    <h3 className="text-heading font-serif leading-tight">
                      {step.stage}
                    </h3>
                  </Stack>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Stack>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link
              href={guideHref}
              className="group inline-flex items-center gap-2 text-body font-medium text-accent hover:underline"
            >
              Read the full guide
              <Icon
                name="ArrowRight"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* 2. Flavour impact — tags + Indian context + comparison */}
        <div className="surface-1 relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl shadow-primary/5">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 md:grid-cols-5 md:items-start">
            {/* Image column */}
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/20 md:col-span-2 md:aspect-square">
              <Image
                src={`/images/discovery/process-${slug}.avif`}
                alt={`${slug} process coffee`}
                fill
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="mb-1 text-caption font-semibold uppercase tracking-wide !text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  In the cup
                </p>
                <p className="font-serif text-body-large !text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]">
                  Flavour Profile
                </p>
              </div>
            </div>

            {/* Content column */}
            <div className="md:col-span-3">
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
                    {flavourImpact.typical.map((tag) => (
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

                {/* Indian context */}
                <div className="relative border-l-2 border-accent/30 py-1 pl-5">
                  <p className="text-body leading-relaxed text-foreground/80">
                    {flavourImpact.indianContext}
                  </p>
                </div>

                {/* Comparison */}
                <div className="rounded-[1.25rem] border border-border bg-muted/30 px-5 py-5 transition-colors hover:bg-muted/50">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon
                      name="ArrowsLeftRight"
                      className="h-4 w-4 text-accent/60"
                    />
                    <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                      Process comparison
                    </p>
                  </div>
                  <p className="text-body font-medium leading-relaxed text-foreground">
                    {flavourImpact.comparedTo}
                  </p>
                </div>
              </Stack>
            </div>
          </div>
        </div>

        {/* 3. Indian context — Promoted hero block */}
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/20 bg-amber-500/5 shadow-sm grid md:grid-cols-5">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="order-1 md:order-2 md:col-span-2 relative aspect-video md:aspect-auto h-full min-h-0">
            <Image
              src={`/images/discovery/process-${slug}-context.avif`}
              alt="Indian Specialty Context"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-2 md:order-1 md:col-span-3 p-6 py-10 md:px-12 md:py-14 flex items-center">
            <Stack
              gap="6"
              className="relative z-10 w-full text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Icon name="MapPin" className="h-5 w-5 text-amber-600/70" />
                <p className="text-overline text-amber-700/80 dark:text-amber-500/80 tracking-[0.15em] uppercase">
                  Indian Specialty Context
                </p>
              </div>
              <p className="text-body-large text-pretty text-muted-foreground leading-relaxed font-light">
                {indiaContext}
              </p>
            </Stack>
          </div>
        </div>

        {/* 4. Brew guidance — recommended methods + notes */}
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
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              />
              <p className="text-caption font-medium leading-relaxed text-foreground/80">
                {brewGuidance.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />

        {/* 5. Process comparison — links to more/less intense processes */}
        {(moreIntenseLinks.length > 0 || lessIntenseLinks.length > 0) && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <h3 className="text-heading mb-6 flex items-center gap-2">
              <Icon name="ArrowsLeftRight" className="h-5 w-5 text-accent/70" />
              Explore Other Processes
            </h3>

            <Stack gap="4">
              {moreIntenseLinks.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 w-36 shrink-0">
                    <Icon
                      name="ArrowUp"
                      className="h-4 w-4 text-muted-foreground/60"
                    />
                    <p className="text-label uppercase">More intense</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moreIntenseLinks.map(({ slug: s, label }) => (
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
              )}
              {lessIntenseLinks.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 w-36 shrink-0">
                    <Icon
                      name="ArrowDown"
                      className="h-4 w-4 text-muted-foreground/60"
                    />
                    <p className="text-label uppercase">Less intense</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lessIntenseLinks.map(({ slug: s, label }) => (
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
              )}
            </Stack>

            <p className="text-caption border-l-2 border-accent/30 pl-4 max-w-3xl mt-6">
              {processComparison.comparisonNote}
            </p>
          </div>
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
