// src/components/discovery/UtilityCard.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import type { UtilityCardConfig } from "@/lib/discovery/landing-pages";
import { Stack } from "@/components/primitives/stack";

type UtilityCardProps = {
  config: UtilityCardConfig;
};

/**
 * UtilityCard - Contextual card for brew guides, calculators, tips
 * Uses existing Card component
 */
export function UtilityCard({ config }: UtilityCardProps) {
  const iconName =
    config.type === "brew_guide"
      ? "BookOpen"
      : config.type === "calculator"
        ? "Calculator"
        : "Lightbulb";

  return (
    <div className="surface-1 relative overflow-hidden rounded-2xl card-padding card-hover hover-lift transition-all duration-500 shadow-sm border border-border/40">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-accent/5 blur-2xl opacity-60" />

      <Stack gap="6" className="relative z-10 font-sans">
        <Stack gap="4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ring-1 ring-white/10">
              <Icon name={iconName} size={24} />
            </div>
            <Stack gap="2">
              <h3 className="text-heading font-serif tracking-tight leading-none text-balance">
                {config.title}
              </h3>
              <div className="h-0.5 w-8 rounded-full bg-accent/60" />
            </Stack>
          </div>
          <p className="text-body-large text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </Stack>

        <Button
          asChild
          variant="outline"
          className="group w-full sm:w-auto h-11 px-6 border-border/60 hover:bg-accent/5 hover:border-accent/30 hover:text-accent transition-all duration-300"
        >
          <Link href={config.href}>
            <span className="font-semibold tracking-wide">
              {config.ctaText}
            </span>
            <Icon
              className="ml-2.5 h-4 w-4 transition-transform group-hover:translate-x-1"
              name="ArrowRight"
            />
          </Link>
        </Button>
      </Stack>
    </div>
  );
}
