// src/components/tools/CoffeeCalculator.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, startTransition, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
// Import calculation logic
import {
  BREWING_METHODS_ARRAY,
  type BrewingMethodKey,
  type CalculatorResults,
  calculateBrewRatio,
  type RoastLevel,
  type StrengthLevel,
} from "@/lib/tools/brewing-guide";
import { BrewingTimer } from "./BrewTimer";
import { CopyLink } from "./CopyLink";
import { DrinkSizeInput } from "./DrinkSizeInput";
// Import our components
import { MethodSelector } from "./MethodSelector";
import { RecipeDisplay } from "./RecipeDisplay";
import { RoastLevelSelector } from "./RoastLevelSelector";
import { StrengthSelector } from "./StrengthSelector";

type CoffeeCalculatorProps = {
  className?: string;
  initialMethod?: BrewingMethodKey;
};

export function CoffeeCalculator({
  className,
  initialMethod,
}: CoffeeCalculatorProps) {
  const searchParams = useSearchParams();

  // Initialize state from URL params or defaults
  const initialMethodFromUrl =
    (searchParams.get("method") as BrewingMethodKey) || initialMethod || null;
  const initialStrengthFromUrl =
    (searchParams.get("strength") as StrengthLevel) || "average";
  const initialRoastFromUrl =
    (searchParams.get("roast") as RoastLevel) || "medium";
  // Change from 'water' to 'drink' for better UX
  const initialDrinkFromUrl =
    Number.parseInt(
      searchParams.get("drink") || searchParams.get("water") || "300",
      10
    ) || 300;

  const [method, setMethod] = useState<BrewingMethodKey | null>(
    initialMethodFromUrl
  );
  const [drinkSize, setDrinkSize] = useState<number>(initialDrinkFromUrl);
  const [strength, setStrength] = useState<StrengthLevel>(
    initialStrengthFromUrl
  );
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(initialRoastFromUrl);
  const [error, setError] = useState<string | null>(null);

  // Validate initial method from URL
  useEffect(() => {
    if (
      initialMethodFromUrl &&
      !BREWING_METHODS_ARRAY.some((m) => m.id === initialMethodFromUrl)
    ) {
      startTransition(() => {
        setMethod(null); // Reset if invalid method ID
      });
    }
  }, [initialMethodFromUrl]);

  // Calculate results - ONE WAY ONLY! 🎯
  const results: CalculatorResults | null = useMemo(() => {
    if (!method) {
      return null;
    }

    try {
      return calculateBrewRatio({
        method,
        volume: drinkSize, // User's desired drink size
        strength,
        roastLevel,
      });
    } catch {
      return null;
    }
  }, [method, drinkSize, strength, roastLevel]);

  // Handle error state based on calculation result
  useEffect(() => {
    startTransition(() => {
      if (method && !results) {
        setError("Unable to calculate recipe. Please check your inputs.");
      } else {
        setError(null);
      }
    });
  }, [method, results]);

  // Update method if initialMethod prop changes
  useEffect(() => {
    if (initialMethod) {
      startTransition(() => {
        setMethod(initialMethod);
      });
    }
  }, [initialMethod]);

  // Handle drink size changes - ONLY ONE DIRECTION! 🚀
  const handleDrinkSizeChange = (newDrinkSize: number) => {
    setDrinkSize(newDrinkSize);
    // That's it! No reverse calculations, no madness!
  };

  // Reset calculator
  const handleReset = () => {
    setMethod(null);
    setDrinkSize(300);
    setStrength("average");
    setRoastLevel("medium");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Brewing Parameters (Surface Card) */}
        <div className="surface-1 card-padding relative rounded-lg [isolation:auto]">
          {/* Subtle decorative element */}
          <div className="-z-10 pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-subheading">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Brewing Parameters
              </h3>
              <div className="flex items-center gap-2">
                {method && (
                  <button
                    className="rounded px-2 py-1 text-muted-foreground text-overline transition-colors hover:bg-background/50 hover:text-foreground"
                    onClick={handleReset}
                    type="button"
                  >
                    Reset
                  </button>
                )}
                <CopyLink
                  drink={drinkSize}
                  method={method}
                  roast={roastLevel}
                  strength={strength} // Changed from 'water' to 'drink'
                />
              </div>
            </div>

            {/* Method Selection */}
            <MethodSelector
              isCompleted={!!method}
              onChange={setMethod}
              value={method}
            />

            {/* Drink Size Input - Clean & Simple! */}
            <DrinkSizeInput
              calculatedCoffee={results?.coffeeAmount || 0}
              drinkSize={drinkSize}
              isCompleted={drinkSize > 0}
              onDrinkSizeChange={handleDrinkSizeChange}
            />

            {/* Strength & Roast Level */}
            {method && (
              <>
                <StrengthSelector
                  isCompleted={!!strength}
                  onChange={setStrength}
                  value={strength}
                />

                <RoastLevelSelector
                  isCompleted={!!roastLevel}
                  onChange={setRoastLevel}
                  value={roastLevel}
                />
              </>
            )}

            {/* Error Display */}
            {error && (
              <Alert
                className="border-destructive/20 bg-destructive/10 backdrop-blur-sm"
                variant="destructive"
              >
                <Icon className="h-4 w-4" name="Warning" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Right Column - Recipe Display (Enhanced) */}
        <RecipeDisplay results={results} strength={strength} />
      </div>

      {/* Glassmorphed Brewing Timer */}
      {results && (
        <div className="mt-6">
          <div className="surface-1 card-padding rounded-2xl">
            <BrewingTimer results={results} />
          </div>
        </div>
      )}

      {/* Method Tips (Full Width) */}
      {results?.method.tips && results.method.tips.length > 0 && (
        <div className="surface-1 card-padding relative mt-6 overflow-hidden rounded-2xl">
          {/* Enhanced decorative blur elements */}
          <div className="absolute top-0 left-0 h-24 w-24 animate-float rounded-full bg-accent/10 blur-2xl" />
          <div className="absolute right-0 bottom-0 h-20 w-20 animate-float rounded-full bg-primary/10 blur-xl delay-700" />

          <div className="relative z-10">
            <div className="mb-6 text-center">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-heading text-primary">
                <Icon className="h-5 w-5 text-accent" name="Lightbulb" />
                Pro Tips for {results.method.name}
              </h3>
              <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {results.method.tips.map((tip, index) => (
                <div
                  className="surface-1 card-padding card-hover group relative overflow-hidden rounded-lg"
                  key={`tip-${tip.slice(0, 20)}-${index}`}
                >
                  {/* Subtle tip card decoration */}
                  <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-primary/5 blur-lg" />

                  <div className="relative z-10 flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <span className="font-medium text-overline">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                      {tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
