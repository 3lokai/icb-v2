import Link from "next/link";
import { Section } from "@/components/primitives/section";
import {
  getLandingPageConfig,
  type LandingPageType,
} from "@/lib/discovery/landing-pages";
import { Stack } from "../primitives/stack";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type RelatedLinksProps = {
  relatedSlugs: string[];
};

/**
 * RelatedLinks - Internal links to other discovery pages
 * Uses existing Button/Link patterns
 */
export function RelatedLinks({ relatedSlugs }: RelatedLinksProps) {
  const relatedPages = relatedSlugs
    .map((slug) => {
      const config = getLandingPageConfig(slug);
      if (!config) return null;
      return {
        slug,
        title: config.h1,
        teaserTitle: config.teaserTitle || config.h1,
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

  if (relatedPages.length === 0) {
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
            Explore <span className="text-accent italic">More.</span>
          </h2>
          <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
            Discover other ways to find your perfect coffee.
          </p>
        </Stack>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPages.map((page) => (
          <Link
            key={page.slug}
            href={`/${page.slug}`}
            className="group block h-full"
          >
            <Card className="h-full hover-lift transition-all duration-300 border-border/50 bg-card/40 hover:bg-card/60 overflow-hidden relative">
              {/* Magazine accent stripe */}
              <div
                className={cn(
                  "absolute left-0 top-0 h-full w-1 opacity-40 transition-opacity group-hover:opacity-100",
                  page.type === "brew_method"
                    ? "bg-accent"
                    : page.type === "roast_level"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                )}
              />

              <CardContent className="p-6 h-full">
                <Stack gap="6" className="h-full flex-col">
                  <div>
                    <span className="text-micro font-bold tracking-widest text-muted-foreground uppercase">
                      {page.type.replace("_", " ")}
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
                    <Icon name="ArrowRight" size={16} />
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
