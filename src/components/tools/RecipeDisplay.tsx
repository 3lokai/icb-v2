// src/components/tools/calculator/RecipeDisplay.tsx
import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
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
          <Icon className="h-5 w-5 text-primary" name="Coffee" />
          <h3 className="text-subheading">Your Recipe</h3>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          <Icon className="mx-auto mb-3 h-12 w-12 opacity-50" name="Coffee" />
          <p className="text-caption">
            Select brewing method to calculate your perfect recipe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`surface-1 card-padding rounded-lg ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" name="Coffee" />
            <h3 className="text-subheading">Your Recipe</h3>
          </div>
          <Badge className="badge border-border/50 bg-background/90 text-foreground">
            {results.method.name}
          </Badge>
        </div>

        {/* Main Recipe Amounts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="surface-1 card-padding card-hover text-center rounded-lg">
            <div className="mb-1 text-title text-primary">
              {Math.round(results.coffeeAmount * 10) / 10}g
            </div>
            <div className="mb-1 text-muted-foreground text-caption">
              Coffee
            </div>
            <div className="text-muted-foreground text-overline">
              {Math.round((results.coffeeAmount / 6) * 10) / 10} tbsp
            </div>
          </div>

          <div className="surface-1 card-padding card-hover text-center rounded-lg">
            <div className="mb-1 text-title text-primary">
              {Math.round(results.waterAmount)}ml
            </div>
            <div className="mb-1 text-muted-foreground text-caption">Water</div>
            <div className="text-muted-foreground text-overline">
              {Math.round((results.waterAmount / 29.5735) * 10) / 10} fl oz
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Recipe Details - Enhanced with icons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-1" name="Scales" />
              <span className="text-muted-foreground">Ratio</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.ratio}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-2" name="Timer" />
              <span className="text-muted-foreground">Time</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.brewTime}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-3" name="Thermometer" />
              <span className="text-muted-foreground">Temperature</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.temperature}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/60 p-2">
            <div className="flex items-center gap-2 text-caption">
              <Icon className="h-4 w-4 text-chart-4" name="Coffee" />
              <span className="text-muted-foreground">Grind</span>
            </div>
            <span className="text-caption font-medium text-foreground">
              {results.grindSize}
            </span>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Method Info */}
        <div className="surface-1 rounded-lg p-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-4 w-4 text-accent" name="Palette" />
              <span className="font-medium text-accent text-overline">
                Flavor Profile
              </span>
            </div>
            <p className="mb-1 font-medium text-caption">
              {results.method.flavorProfile}
            </p>
            <p className="text-muted-foreground text-caption leading-relaxed">
              {results.method.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            aria-describedby={copyError ? "recipe-copy-error" : undefined}
            aria-invalid={copyError ? true : undefined}
            className="flex-1"
            onClick={handleCopyRecipe}
            size="sm"
            variant="outline"
          >
            <Icon className="mr-2 h-4 w-4" name="Copy" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button onClick={() => window.print()} size="sm" variant="outline">
            <Icon className="h-4 w-4" name="Printer" />
          </Button>

          <Button
            onClick={() => {
              if (navigator.share) {
                // Share can reject when the user dismisses the sheet (AbortError);
                // swallow that, fall back to copy on a real failure.
                navigator
                  .share({
                    title: `${results.method.name} Coffee Recipe`,
                    text: `Perfect ${results.method.name} recipe: ${formatCoffeeAmount(results.coffeeAmount)} coffee + ${results.waterAmount}ml water`,
                    url: window.location.href,
                  })
                  .catch((err) => {
                    if (err?.name !== "AbortError") {
                      handleCopyRecipe();
                    }
                  });
              } else {
                handleCopyRecipe();
              }
            }}
            size="sm"
            variant="outline"
          >
            <Icon className="h-4 w-4" name="ShareNetwork" />
          </Button>
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
