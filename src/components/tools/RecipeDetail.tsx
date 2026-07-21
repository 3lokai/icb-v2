// src/components/tools/RecipeDetail.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BookOpenIcon,
  CoffeeIcon,
  CopyIcon,
  LightbulbIcon,
  ListChecksIcon,
  PlayIcon,
  TimerIcon,
  WrenchIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { BrewingTimer } from "@/components/tools/BrewTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BREWING_METHODS_ARRAY,
  calculateBrewRatio,
} from "@/lib/tools/brewing-guide";
import type { ExpertRecipe } from "@/lib/tools/expert-recipes";
import { Stack } from "@/components/primitives/stack";

export type RecipeDetailProps = {
  recipe: ExpertRecipe;
  onClose: () => void;
};

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current != null) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Convert to calculator results for timer integration
  const timerResults = React.useMemo(() => {
    const hasRoast =
      Array.isArray(recipe.roastRecommendation) &&
      recipe.roastRecommendation.length > 0;
    if (!hasRoast) {
      return null;
    }
    try {
      return calculateBrewRatio({
        method: recipe.method,
        volume: recipe.water,
        strength: recipe.strengthLevel,
        roastLevel: recipe.roastRecommendation[0],
      });
    } catch {
      return null;
    }
  }, [recipe]);

  const methodName =
    BREWING_METHODS_ARRAY.find((m) => m.id === recipe.method)?.name ||
    recipe.method;

  const handleCopyRecipe = async () => {
    const recipeText = `
${recipe.title} by ${recipe.expert.name}

Coffee: ${recipe.coffee}g
Water: ${recipe.water}ml
Ratio: ${recipe.ratio}
Grind: ${recipe.grind}
Temperature: ${recipe.temperature}
Time: ${recipe.totalTime}

Steps:
${recipe.steps.map((step, i) => `${i + 1}. ${step.time}: ${step.instruction}`).join("\n")}

Key Technique: ${recipe.keyTechnique}

From IndianCoffeeBeans.com Expert Recipes
    `.trim();

    try {
      setCopyError(null);
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      if (copyTimeoutRef.current != null) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy recipe:", err);
      setCopied(false);
      setCopyError(
        "Couldn't copy to clipboard. Try selecting the text manually."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="surface-1 rounded-2xl p-4 md:p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 bg-accent/60 md:w-12" />
                <span className="text-overline tracking-[0.15em] text-muted-foreground">
                  {methodName}
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight text-primary">
                {recipe.title}
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">
                  {recipe.expert.name}
                </span>
                <span className="text-muted-foreground"> · </span>
                {recipe.expert.achievement}
                {recipe.expert.year != null ? (
                  <>
                    <span className="text-muted-foreground"> · </span>
                    {recipe.expert.year}
                  </>
                ) : null}
              </p>

              {/* Recipe Summary */}
              <div className="surface-1 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="font-bold text-subheading text-primary">
                      {recipe.coffee}g
                    </div>
                    <div className="text-muted-foreground text-caption">
                      Coffee
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-subheading text-primary">
                      {recipe.water}ml
                    </div>
                    <div className="text-muted-foreground text-caption">
                      Water
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-subheading text-primary">
                      {recipe.ratio}
                    </div>
                    <div className="text-muted-foreground text-caption">
                      Ratio
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-subheading text-primary">
                      {recipe.totalTime}
                    </div>
                    <div className="text-muted-foreground text-caption">
                      Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              aria-label="Close recipe details"
              className="hover:bg-background/50"
              onClick={onClose}
              size="sm"
              variant="ghost"
            >
              <Icon className="h-4 w-4" icon={XIcon} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Story */}
          <div className="surface-1 card-padding rounded-lg">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 bg-accent/60" />
                <span className="text-overline tracking-[0.15em] text-muted-foreground">
                  Context
                </span>
              </div>
              <h3 className="flex items-center gap-2 text-heading text-primary">
                <Icon className="h-5 w-5 shrink-0" icon={BookOpenIcon} />
                The Story
              </h3>
              <p className="text-pretty text-body text-muted-foreground leading-relaxed">
                {recipe.story}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="surface-1 card-padding rounded-lg">
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <Stack className="min-w-0 flex-1" gap="4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline tracking-[0.15em] text-muted-foreground">
                      Walkthrough
                    </span>
                  </div>
                  <h3 className="flex items-center gap-2 text-heading text-primary">
                    <Icon className="h-5 w-5 shrink-0" icon={ListChecksIcon} />
                    Brewing Steps
                  </h3>
                </Stack>
                {timerResults ? (
                  <Button
                    className="flex shrink-0 items-center gap-2 self-start sm:self-auto"
                    onClick={() => setShowTimer(!showTimer)}
                    size="sm"
                    variant="outline"
                  >
                    <Icon className="h-4 w-4" icon={TimerIcon} />
                    {showTimer ? "Hide Timer" : "Start Timer"}
                  </Button>
                ) : null}
              </div>
              <div className="mt-6 space-y-3">
                {recipe.steps.map((step, index) => (
                  <div
                    className="surface-1 card-padding card-hover group rounded-lg"
                    key={`step-${step.time}-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <span className="font-medium text-caption">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium text-caption">
                            {step.time}
                          </span>
                          {step.waterAmount && (
                            <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                              {step.waterAmount}ml
                            </Badge>
                          )}
                          {step.pourNumber && (
                            <Badge className="badge bg-accent/90 text-accent-foreground text-overline">
                              Pour #{step.pourNumber}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-caption leading-relaxed">
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timer */}
          {showTimer && timerResults && (
            <div className="surface-1 card-padding rounded-2xl">
              <BrewingTimer results={timerResults} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="surface-1 card-padding rounded-lg">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 bg-accent/60" />
                <span className="text-overline tracking-[0.15em] text-muted-foreground">
                  Guidance
                </span>
              </div>
              <h3 className="flex items-center gap-2 text-heading text-primary">
                <Icon className="h-5 w-5 shrink-0" icon={LightbulbIcon} />
                Pro Tips
              </h3>
              <div className="space-y-3">
                {recipe.tips.map((tip, index) => (
                  <div
                    className="group flex items-start gap-3 rounded-lg bg-background/60 p-3 transition-colors hover:bg-background"
                    key={`tip-${tip.slice(0, 20)}-${index}`}
                  >
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                    <p className="text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div className="surface-1 card-padding rounded-lg">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 bg-accent/60" />
                <span className="text-overline tracking-[0.15em] text-muted-foreground">
                  Gear
                </span>
              </div>
              <h3 className="flex items-center gap-2 text-heading text-primary">
                <Icon className="h-5 w-5 shrink-0" icon={WrenchIcon} />
                Equipment
              </h3>
              <div className="space-y-2">
                {recipe.equipmentRecommendations.map((equipment, index) => (
                  <div
                    className="group flex items-center gap-2 rounded-lg bg-background/60 p-3 transition-colors hover:bg-background"
                    key={`equipment-${equipment.slice(0, 20)}-${index}`}
                  >
                    <Icon
                      className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                      icon={CoffeeIcon}
                    />
                    <span className="text-caption transition-colors group-hover:text-foreground">
                      {equipment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="surface-2 card-padding rounded-2xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 bg-accent/60" />
                <span className="text-overline tracking-[0.15em] text-muted-foreground">
                  Share
                </span>
              </div>
              <h3 className="text-heading text-primary">Save & Share</h3>
              <div className="space-y-2">
                <Button
                  aria-describedby={copyError ? "copy-recipe-error" : undefined}
                  aria-invalid={copyError ? true : undefined}
                  className="hover-lift group w-full"
                  id="copy-recipe-btn"
                  onClick={handleCopyRecipe}
                  size="sm"
                  variant="outline"
                >
                  <Icon className="mr-2 h-4 w-4" icon={CopyIcon} />
                  {copied ? "Copied!" : "Copy Recipe"}
                </Button>
                {copyError ? (
                  <p
                    className="text-caption text-destructive"
                    id="copy-recipe-error"
                    role="alert"
                  >
                    {copyError}
                  </p>
                ) : null}

                {recipe.youtubeUrl && (
                  <Button
                    asChild
                    className="hover-lift group w-full"
                    size="sm"
                    variant="outline"
                  >
                    <a
                      href={recipe.youtubeUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Icon className="mr-2 h-4 w-4" icon={PlayIcon} />
                      Watch Video
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
