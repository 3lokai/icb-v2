import Link from "next/link";
import { ArrowUpRightIcon, BookOpenIcon } from "@phosphor-icons/react/dist/ssr";
import { Accent } from "@/components/primitives/accent";
import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Card, CardContent } from "@/components/ui/card";
import { Stack } from "@/components/primitives/stack";

type LearnLinksProps = {
  links: { label: string; href: string }[];
};

/**
 * LearnLinks - Contextual in-body links from a discovery page into /learn articles.
 * Sibling of RelatedLinks (discovery -> discovery); this one is discovery -> editorial.
 *
 * ponytail: labels are curated in the landing-page configs, not fetched from Sanity.
 * Anchor text is the point; covers/excerpts would cost a Sanity round-trip on 39
 * otherwise Supabase-only static pages, with no /coffees/* webhook invalidation.
 */
export function LearnLinks({ links }: LearnLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <Section spacing="default" contained={false}>
      <div className="mb-10">
        <Stack gap="6">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              From the Field Guide
            </span>
          </div>
          <h2 className="text-title text-balance leading-[1.1] tracking-tight">
            Read the <Accent>Context.</Accent>
          </h2>
          <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
            The background behind what you are tasting, from our writing on
            Indian coffee.
          </p>
        </Stack>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block h-full">
            <Card className="h-full hover-lift transition-all duration-300 border-border/50 border-l-2 border-l-accent/40 bg-card/40 hover:bg-card/60 hover:border-l-accent">
              <CardContent className="p-6 h-full">
                <Stack gap="6" className="h-full flex-col">
                  <div className="flex items-center gap-2 text-micro font-bold tracking-widest text-muted-foreground uppercase">
                    <Icon icon={BookOpenIcon} size={14} />
                    Guide
                  </div>

                  <h3 className="text-heading font-serif text-pretty flex-grow group-hover:text-accent transition-colors">
                    {link.label}
                  </h3>

                  <div className="flex items-center gap-2 text-label font-bold text-accent group-hover:gap-3 transition-all">
                    Read the guide
                    <Icon icon={ArrowUpRightIcon} size={16} />
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
