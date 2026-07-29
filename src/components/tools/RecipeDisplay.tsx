// src/components/tools/calculator/RecipeDisplay.tsx
import { useState } from "react";
import {
  CoffeeIcon,
  CopyIcon,
  ScalesIcon,
  ThermometerIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  type CalculatorResults,
  formatCoffeeAmount,
  getStrengthLabel,
  type StrengthLevel,
} from "@/lib/tools/brewing-guide";

type RecipeDisplayProps = {
  results: CalculatorResults | null;
  className?: string;
  strength: StrengthLevel;
};

export function RecipeDisplay({
  results,
  className,
  strength,
}: RecipeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopyRecipe = async () => {
    if (!results) {
      return;
    }

    const recipeText = `
${results.method.name} Coffee Recipe

Coffee: ${formatCoffeeAmount(results.coffeeAmount)}
Water: ${results.waterAmount}ml
Ratio: ${results.ratio}
Temperature: ${results.temperature}
Grind: ${results.grindSize}
Time: ${results.brewTime}
Strength: ${getStrengthLabel(strength)}
Flavor: ${results.method.flavorProfile}
Made with IndianCoffeeBeans.com
    `.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy recipe:", err);
      setCopied(false);
      setCopyError(
        "Couldn't copy to clipboard. Try selecting the text manually."
      );
    }
  };

  if (!results) {
    return (
      <div className={`surface-1 card-padding rounded-lg ${className}`}>
        <div className="mb-6 flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" icon={CoffeeIcon} />
          <h3 className="text-subheading">You&apos;ll need</h3>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          <Icon
            className="mx-auto mb-3 h-12 w-12 opacity-50"
            icon={CoffeeIcon}
          />
          <p className="text-caption">
            Select a brewing method to see your recipe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`surface-1 card-padding rounded-lg ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <span className="font-medium text-caption text-muted-foreground">
            You&apos;ll need
          </span>
          <Button
            aria-describedby={copyError ? "recipe-copy-error" : undefined}
            aria-invalid={copyError ? true : undefined}
            className="h-8 gap-1.5 rounded-full text-overline"
            onClick={handleCopyRecipe}
            size="sm"
            variant="outline"
          >
            <Icon className="h-3.5 w-3.5" icon={CopyIcon} />
            {copied ? "Copied" : "Copy recipe"}
          </Button>
        </div>

        {/* Water output */}
        <div className="text-center">
          <span className="font-serif text-display leading-none tracking-tight text-accent">
            {Math.round(results.waterAmount)}
          </span>
          <span className="ml-1 font-serif text-subheading text-muted-foreground">
            ml water
          </span>
          <div className="mt-1 text-caption text-muted-foreground">
            ratio {results.ratio} · {results.method.name}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Recipe Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-1" icon={ScalesIcon} />
              <span className="text-muted-foreground">Ratio</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.ratio}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-2" icon={TimerIcon} />
              <span className="text-muted-foreground">Time</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.brewTime}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-3" icon={ThermometerIcon} />
              <span className="text-muted-foreground">Temperature</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.temperature}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-4" icon={CoffeeIcon} />
              <span className="text-muted-foreground">Grind</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.grindSize}
            </span>
          </div>
        </div>

        {copyError ? (
          <p
            className="text-caption text-destructive"
            id="recipe-copy-error"
            role="alert"
          >
            {copyError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
