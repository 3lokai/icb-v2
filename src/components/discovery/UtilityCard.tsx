// src/components/discovery/UtilityCard.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import type { UtilityCardConfig } from "@/lib/discovery/landing-pages";
import { Stack } from "../primitives/stack";

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
    <Card className="hover-lift overflow-hidden border-border/50 bg-card/50 backdrop-blur-[2px] transition-all duration-300">
      <CardHeader className="pb-4">
        <Stack gap="4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Icon name={iconName} size={20} />
            </div>
            <h3 className="text-heading font-serif tracking-tight">
              {config.title}
            </h3>
          </div>
        </Stack>
      </CardHeader>
      <CardContent>
        <p className="text-body-large text-muted-foreground mb-6 leading-relaxed">
          {config.description}
        </p>
        <Button asChild variant="outline" className="group w-full sm:w-auto">
          <Link href={config.href}>
            {config.ctaText}
            <Icon
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              name="ArrowRight"
            />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
