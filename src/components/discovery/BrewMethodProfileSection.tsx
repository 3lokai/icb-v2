import Link from "next/link";
import Image from "next/image";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
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
  type BrewMethodProfileConfig,
} from "@/lib/discovery/landing-pages";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/common/Icon";

type BrewMethodProfileSectionProps = {
  profile: BrewMethodProfileConfig;
  slug: string;
  className?: string;
};

function CharBlock({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap="1">
      <p className="text-label uppercase">{label}</p>
      <p className="text-body text-foreground">{value}</p>
    </Stack>
  );
}

/** Asset filenames use "mokapot" while page slug is "moka-pot". */
function brewMethodImageBase(slug: string): string {
  if (slug === "moka-pot") return "mokapot";
  return slug;
}

function roastLinkLabel(slug: string): string {
  const page = getLandingPageConfig(slug);
  if (!page) return slug;
  return page.teaserTitle ?? page.h1;
}

function RoastPairingLinks({
  label,
  slugs,
  icon,
}: {
  label: string;
  slugs: string[];
  icon?: IconName;
}) {
  const links = slugs
    .map((slug) => {
      const cfg = getLandingPageConfig(slug);
      if (!cfg || cfg.type !== "roast_level") return null;
      return { slug, text: roastLinkLabel(slug) };
    })
    .filter((x): x is { slug: string; text: string } => x !== null);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2 w-36 shrink-0">
        {icon && (
          <Icon name={icon} className="h-4 w-4 text-muted-foreground/60" />
        )}
        <p className="text-label uppercase">{label}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map(({ slug, text }) => (
          <Link
            key={slug}
            href={discoveryPagePath(slug)}
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

export function BrewMethodProfileSection({
  profile,
  slug,
  className,
}: BrewMethodProfileSectionProps) {
  const { brewerCharacteristics, indianCoffeeContext, commonMistakes } =
    profile;
  const siblingLinks = profile.siblingMethods.filter(
    (slug) => getLandingPageConfig(slug)?.type === "brew_method"
  );

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Brew profile"
        title="How this *brewer* behaves"
        description="Mechanics, Indian specialty context, common mistakes, and roast pairings that match how we filter coffees on ICB."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Guide
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full space-y-12 px-4 md:px-0">
        {/* 1. Brewer characteristics - stays as a 2x2 grid card */}
        <div className="surface-1 relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl shadow-primary/5">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-5 items-center">
            <div className="md:col-span-2 relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-sm border border-border/10">
              <Image
                src={`/images/discovery/brew-methods/${brewMethodImageBase(slug)}-mechanism.avif`}
                alt="Brewer Mechanism"
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-3 grid gap-8 md:grid-cols-2">
              <CharBlock
                label="Mechanism"
                value={brewerCharacteristics.mechanism}
              />
              <CharBlock
                label="Filter"
                value={brewerCharacteristics.filterType}
              />
              <div className="md:col-span-2">
                <CharBlock
                  label="How it works"
                  value={brewerCharacteristics.howItWorks}
                />
              </div>
              <div className="md:col-span-2">
                <CharBlock
                  label="Why it stands out"
                  value={brewerCharacteristics.keyAdvantage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Indian context - Promoted hero block */}
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/20 bg-amber-500/5 shadow-sm grid md:grid-cols-5">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="order-1 md:order-2 md:col-span-2 relative aspect-video md:aspect-auto h-full min-h-0">
            <Image
              src={`/images/discovery/brew-methods/${brewMethodImageBase(slug)}-context.avif`}
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
                {indianCoffeeContext}
              </p>
            </Stack>
          </div>
        </div>

        {/* 3. Common mistakes - Accordion */}
        {commonMistakes.length > 0 ? (
          <div className="max-w-4xl mx-auto w-full pt-4">
            <div className="flex items-center gap-2 mb-6">
              <Icon
                name="WarningCircle"
                className="h-5 w-5 text-destructive/70"
              />
              <h3 className="text-heading">Common Mistakes</h3>
            </div>
            <Accordion type="multiple" className="w-full space-y-3">
              {commonMistakes.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-xl border border-border/40 bg-card/30 px-5 data-[state=open]:bg-card/60 transition-colors"
                >
                  <AccordionTrigger className="text-left text-body font-bold text-foreground hover:no-underline py-4">
                    {item.mistake}
                  </AccordionTrigger>
                  <AccordionContent className="text-body text-muted-foreground leading-relaxed pt-1 pb-5">
                    {item.fix}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}

        <div className="h-px w-full bg-border/40 max-w-5xl mx-auto my-8" />

        {/* 4. Roast pairing - Inline pill rows */}
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <h3 className="text-heading mb-6 flex items-center gap-2">
            <Icon name="Fire" className="h-5 w-5 text-accent/70" />
            Roast Pairing Guide
          </h3>
          <Stack gap="4">
            <RoastPairingLinks
              icon="Star"
              label="Best Match"
              slugs={profile.roastPairing.best}
            />
            <RoastPairingLinks
              icon="ThumbsUp"
              label="Also Works"
              slugs={profile.roastPairing.works}
            />
          </Stack>

          {profile.roastPairing.avoid && (
            <p className="text-caption border-l-2 border-destructive/30 pl-4 max-w-3xl mt-6">
              <span className="font-medium text-foreground">Avoid:</span>{" "}
              {profile.roastPairing.avoid}
            </p>
          )}
        </div>

        {/* 5. Related brewers */}
        {siblingLinks.length > 0 ? (
          <div className="max-w-5xl mx-auto w-full border-t border-border/40 pt-10">
            <p className="text-overline text-muted-foreground tracking-[0.15em] uppercase mb-4">
              Related Brewers
            </p>
            <div className="flex flex-wrap gap-2">
              {siblingLinks.map((slug) => (
                <Link
                  key={slug}
                  href={discoveryPagePath(slug)}
                  className={cn(
                    brewMethodDiscoveryLinkClassName,
                    "bg-card shadow-sm hover:shadow transition-shadow"
                  )}
                >
                  {brewSlugToLabel(slug)}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* 6. ICB data note */}
        <aside className="max-w-5xl mx-auto w-full rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 md:px-6 md:py-5">
          <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            On Indian Coffee Beans
          </p>
          <p className="text-caption text-muted-foreground leading-relaxed">
            {profile.icbDataNote}
          </p>
        </aside>
      </div>
    </Section>
  );
}
