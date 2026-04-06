import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Cluster } from "@/components/primitives/cluster";
import { Section } from "@/components/primitives/section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const IMPACT: Record<
  string,
  { tags: string[]; compareLabel: string; compareBody: string }
> = {
  natural: {
    tags: ["Jammy fruit", "Wine-like", "Heavy body"],
    compareLabel: "Compared to washed",
    compareBody:
      "Naturals usually trade some of washed clarity for deeper fruit and fermentation-forward sweetness—great when you want intensity and body.",
  },
  washed: {
    tags: ["Clean cup", "Bright acidity", "Defined origin"],
    compareLabel: "Compared to natural",
    compareBody:
      "Washed lots often read cleaner and more articulate than naturals from the same origin, with less ferment and usually a lighter mouthfeel.",
  },
  honey: {
    tags: ["Rounded sweetness", "Silky body", "Balanced fruit"],
    compareLabel: "Compared to washed",
    compareBody:
      "Honey processing keeps more mucilage than washed, so cups tend to be sweeter and fuller while staying less intense than heavy naturals.",
  },
  anaerobic: {
    tags: ["Intense aromatics", "Tropical & winey", "Complex finish"],
    compareLabel: "Compared to classic washed",
    compareBody:
      "Anaerobic lots can push fruit and spice further than everyday washed profiles—use familiar brew ratios first, then adjust for intensity.",
  },
  "monsooned-malabar": {
    tags: ["Low acidity", "Earthy spice", "Mellow body"],
    compareLabel: "Compared to washed arabica",
    compareBody:
      "Monsooning is a different goal than brightness-forward washing—expect a smooth, heritage cup rather than crisp acidity.",
  },
};

type FlavourImpactProps = {
  processSlug: string;
  className?: string;
};

export function FlavourImpact({ processSlug, className }: FlavourImpactProps) {
  const data = IMPACT[processSlug];
  if (!data) {
    return null;
  }

  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-6"
        overline="In the cup"
        title="Typical *flavours*"
        description="How this process tends to read in the cup versus common alternatives."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Processing
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="surface-1 card-padding rounded-2xl">
          <div className="space-y-8">
            <div>
              <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Typical flavours
              </p>
              <Cluster gap="2" className="flex-wrap">
                {data.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border-border/50 text-micro font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </Cluster>
            </div>
            <div className="border-t border-border/40 pt-8">
              <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                {data.compareLabel}
              </p>
              <p className="text-body text-muted-foreground leading-relaxed max-w-3xl">
                {data.compareBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
