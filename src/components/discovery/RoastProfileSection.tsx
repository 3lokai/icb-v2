import type { RoastProfileConfig } from "@/lib/discovery/landing-pages";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { RoastProfileTabbed } from "@/components/discovery/RoastProfileTabbed";
import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

type RoastProfileSectionProps = {
  roastProfile: RoastProfileConfig;
  className?: string;
};

export function RoastProfileSection({
  roastProfile,
  className,
}: RoastProfileSectionProps) {
  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Roast profile"
        title="What this roast *means*"
        description="Flavour families you often taste in Indian cups, how the bean looks through the roast, and practical brew starting points."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Guide
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full space-y-8 px-4 md:px-0">
        <RoastProfileTabbed roastProfile={roastProfile} />

        <aside className="rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 md:px-6 md:py-5">
          <p className="text-micro font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            On Indian Coffee Beans
          </p>
          <p className="text-caption text-muted-foreground leading-relaxed">
            {roastProfile.icbDataNote}
          </p>
        </aside>
      </div>
    </Section>
  );
}
