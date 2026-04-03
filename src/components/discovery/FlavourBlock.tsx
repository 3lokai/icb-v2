import Link from "next/link";
import { discoveryPagePath } from "@/lib/discovery/landing-pages";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ROAST_DATA: Record<
  string,
  { flavours: string[]; brewSlugs: { slug: string; label: string }[] }
> = {
  "light-roast": {
    flavours: ["Bright acidity", "Floral & fruit", "Tea-like body"],
    brewSlugs: [
      { slug: "v60", label: "V60" },
      { slug: "aeropress", label: "AeroPress" },
      { slug: "chemex", label: "Chemex" },
    ],
  },
  "light-medium-roast": {
    flavours: ["Balanced sweetness", "Gentle fruit", "Smooth body"],
    brewSlugs: [
      { slug: "aeropress", label: "AeroPress" },
      { slug: "v60", label: "V60" },
      { slug: "kalita", label: "Kalita" },
    ],
  },
  "medium-roast": {
    flavours: ["Caramel & cocoa", "Round acidity", "Versatile cup"],
    brewSlugs: [
      { slug: "french-press", label: "French Press" },
      { slug: "v60", label: "V60" },
      { slug: "aeropress", label: "AeroPress" },
    ],
  },
  "medium-dark-roast": {
    flavours: ["Chocolate-forward", "Fuller body", "Lower brightness"],
    brewSlugs: [
      { slug: "french-press", label: "French Press" },
      { slug: "chemex", label: "Chemex" },
      { slug: "kalita", label: "Kalita" },
    ],
  },
  "dark-roast": {
    flavours: ["Bold & smoky", "Low acidity", "Heavy body"],
    brewSlugs: [
      { slug: "french-press", label: "French Press" },
      { slug: "aeropress", label: "AeroPress" },
      { slug: "v60", label: "V60" },
    ],
  },
};

type FlavourBlockProps = {
  roastLevel: string;
  className?: string;
};

export function FlavourBlock({ roastLevel, className }: FlavourBlockProps) {
  const data = ROAST_DATA[roastLevel];
  if (!data) {
    return null;
  }

  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-6"
        overline="Tasting notes"
        title="What to *expect*"
        description="Flavour families you will often taste at this roast level, plus brew methods that show it well."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Roast profile
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="surface-1 relative overflow-hidden rounded-2xl card-padding card-hover transition-all duration-500">
          {/* Decorative background blurs */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/5 blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl opacity-60" />

          <Stack gap="8" className="relative z-10">
            <Stack gap="3">
              <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                Expected flavours
              </p>
              <Cluster gap="2" className="flex-wrap">
                {data.flavours.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border-accent/10 bg-accent/5 px-3 py-1 text-micro font-medium text-accent/80 hover:bg-accent/10 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </Cluster>
            </Stack>

            <Stack gap="3" className="border-t border-border/40 pt-8">
              <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground">
                Pairs well with
              </p>
              <Cluster gap="2" className="flex-wrap">
                {data.brewSlugs.map(({ slug, label }) => (
                  <Link
                    key={slug}
                    href={discoveryPagePath(slug)}
                    className={cn(
                      "group inline-flex items-center rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-micro font-medium text-muted-foreground",
                      "transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-accent hover:scale-[1.02] hover:shadow-sm"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </Cluster>
            </Stack>
          </Stack>
        </div>
      </div>
    </Section>
  );
}
