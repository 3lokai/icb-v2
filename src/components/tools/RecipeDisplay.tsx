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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy recipe:", err);
    }
  };

  if (!results) {
    return (
      <div
        className={`glass-card card-padding relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" name="Coffee" />
            <h3 className="font-semibold text-lg">Your Recipe</h3>
          </div>
          <div className="py-8 text-center text-muted-foreground">
            <Icon className="mx-auto mb-3 h-12 w-12 opacity-50" name="Coffee" />
            <p className="text-sm">
              Select brewing method to calculate your perfect recipe
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card card-padding relative overflow-hidden ${className}`}
    >
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 right-0 h-20 w-20 animate-float rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-16 w-16 animate-float rounded-full bg-accent/10 blur-xl delay-700" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" name="Coffee" />
            <h3 className="font-semibold text-lg">Your Recipe</h3>
          </div>
          <Badge className="badge border-border/50 bg-background/90 text-foreground">
            {results.method.name}
          </Badge>
        </div>

        {/* Main Recipe Amounts - Enhanced glass cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card card-padding group text-center transition-all duration-300 hover:scale-[1.02]">
            <div className="mb-1 font-bold text-2xl text-primary transition-transform duration-300 group-hover:scale-110">
              {Math.round(results.coffeeAmount * 10) / 10}g
            </div>
            <div className="mb-1 text-muted-foreground text-sm">Coffee</div>
            <div className="text-muted-foreground text-xs">
              {Math.round((results.coffeeAmount / 6) * 10) / 10} tbsp
            </div>
          </div>

          <div className="glass-card card-padding group text-center transition-all duration-300 hover:scale-[1.02]">
            <div className="mb-1 font-bold text-2xl text-primary transition-transform duration-300 group-hover:scale-110">
              {Math.round(results.waterAmount)}ml
            </div>
            <div className="mb-1 text-muted-foreground text-sm">Water</div>
            <div className="text-muted-foreground text-xs">
              {Math.round((results.waterAmount / 29.5735) * 10) / 10} fl oz
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Recipe Details - Enhanced with icons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-background/30 p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-chart-1" name="Scales" />
              <span className="text-muted-foreground">Ratio</span>
            </div>
            <span className="font-medium">{results.ratio}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/30 p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-chart-2" name="Timer" />
              <span className="text-muted-foreground">Time</span>
            </div>
            <span className="font-medium">{results.brewTime}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/30 p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-chart-3" name="Thermometer" />
              <span className="text-muted-foreground">Temperature</span>
            </div>
            <span className="font-medium">{results.temperature}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/30 p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-chart-4" name="Coffee" />
              <span className="text-muted-foreground">Grind</span>
            </div>
            <span className="font-medium">{results.grindSize}</span>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Method Info - Enhanced glass panel */}
        <div className="glass-panel relative overflow-hidden rounded-lg p-4">
          <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-accent/10 blur-lg" />
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-4 w-4 text-accent" name="Palette" />
              <span className="font-medium text-accent text-xs uppercase tracking-wide">
                Flavor Profile
              </span>
            </div>
            <p className="mb-1 font-medium text-sm">
              {results.method.flavorProfile}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {results.method.description}
            </p>
          </div>
        </div>

        {/* Action Buttons - Enhanced with glass treatment */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-background/80"
            onClick={handleCopyRecipe}
            size="sm"
            variant="outline"
          >
            <Icon className="mr-2 h-4 w-4" name="Copy" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            className="bg-background/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-background/80"
            onClick={() => window.print()}
            size="sm"
            variant="outline"
          >
            <Icon className="h-4 w-4" name="Printer" />
          </Button>

          <Button
            className="bg-background/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-background/80"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${results.method.name} Coffee Recipe`,
                  text: `Perfect ${results.method.name} recipe: ${formatCoffeeAmount(results.coffeeAmount)} coffee + ${results.waterAmount}ml water`,
                  url: window.location.href,
                });
              } else {
                handleCopyRecipe();
                // Toast notification handled in handleCopyRecipe
              }
            }}
            size="sm"
            variant="outline"
          >
            <Icon className="h-4 w-4" name="ShareNetwork" />
          </Button>
        </div>
      </div>
    </div>
  );
}
