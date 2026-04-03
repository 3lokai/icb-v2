import { Icon } from "@/components/common/Icon";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

type ValueTipsProps = {
  tips: string[];
  className?: string;
};

export function ValueTips({ tips, className }: ValueTipsProps) {
  const bullets = tips.slice(0, 3);
  if (bullets.length === 0) {
    return null;
  }

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Shopping smart"
        title="What to look for at this *price*"
        description="Practical pointers to get the most from coffees in this range."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Value
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="surface-1 card-padding rounded-2xl">
          <ul className="space-y-4">
            {bullets.map((tip) => (
              <li key={tip} className="flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="text-accent" name="CheckCircle" size={18} />
                </span>
                <p className="text-body text-muted-foreground leading-relaxed pt-0.5">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
