// src/components/cards/RecipeCard.tsx
"use client";

import React from "react";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter } from "@/components/ui/card";
import { BREWING_METHODS_ARRAY } from "@/lib/tools/brewing-guide";
import type { ExpertRecipe } from "@/lib/tools/expert-recipes";
import { cn } from "@/lib/utils";
import { Stack } from "../primitives/stack";
import { Cluster } from "../primitives/cluster";

type RecipeCardProps = {
  recipe: ExpertRecipe;
  isSelected?: boolean;
  onSelect?: () => void;
  variant?: "default" | "compact";
};

export function RecipeCard({
  recipe,
  isSelected = false,
  onSelect,
  variant = "default",
}: RecipeCardProps) {
  const methodName =
    BREWING_METHODS_ARRAY.find((m) => m.id === recipe.method)?.name ||
    recipe.method;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.();
    }
  };

  // Compact variant - horizontal row card
  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "group relative cursor-pointer overflow-hidden",
          "surface-1 rounded-lg card-hover",
          "flex flex-row items-center gap-3 card-padding-compact",
          "h-[80px]",
          isSelected && "ring-2 ring-border"
        )}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        {/* Method badge on left */}
        <Badge variant="secondary" className="text-overline shrink-0">
          {methodName}
        </Badge>

        {/* Content - 1-2 lines total */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <Stack gap="1">
            {/* Recipe title - primary */}
            <h3 className="text-body line-clamp-1">{recipe.title}</h3>

            {/* Secondary info - expert name and key stat */}
            <div className="flex items-center gap-1.5 line-clamp-1">
              <span className="text-caption">by {recipe.expert.name}</span>
              <span className="text-caption text-muted-foreground">•</span>
              <span className="text-caption text-muted-foreground">
                {recipe.ratio}
              </span>
              <span className="text-caption text-muted-foreground">•</span>
              <span className="text-caption text-muted-foreground">
                {recipe.totalTime}
              </span>
            </div>
          </Stack>
        </div>

        {/* Right indicator */}
        <div
          className={cn(
            "flex items-center gap-1.5 text-caption transition-colors",
            isSelected
              ? "text-primary"
              : "text-muted-foreground group-hover:text-accent"
          )}
        >
          {isSelected ? (
            <Icon className="h-4 w-4" name="CheckCircle" />
          ) : (
            <Icon
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              name="ArrowRight"
            />
          )}
        </div>
      </Card>
    );
  }

  // Default variant - full card with all details
  return (
    <Card
      className={cn(
        "group relative cursor-pointer overflow-hidden",
        "surface-1 rounded-lg card-hover",
        "h-full flex flex-col p-0",
        isSelected && "ring-2 ring-border"
      )}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="card-padding">
        <Stack gap="2">
          <Cluster gap="2" align="center">
            <Badge variant="secondary" className="text-overline">
              {methodName}
            </Badge>
            <Badge variant="outline" className="text-overline">
              {recipe.difficulty}
            </Badge>
          </Cluster>
          <h3 className="line-clamp-2 text-heading text-balance">
            {recipe.title}
          </h3>
          <p className="text-body-muted font-medium">
            by {recipe.expert.name}
            {recipe.expert.year && ` • ${recipe.expert.year}`}
          </p>
        </Stack>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center justify-between rounded-md bg-background/50 px-2 py-1">
            <span className="text-label">Ratio</span>
            <span className="text-caption">{recipe.ratio}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-background/50 px-2 py-1">
            <span className="text-label">Time</span>
            <span className="text-caption">{recipe.totalTime}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-background/50 px-2 py-1">
            <span className="text-label">Grind</span>
            <span className="text-overline">{recipe.grind}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-background/50 px-2 py-1">
            <span className="text-label">Temp</span>
            <span className="text-overline">{recipe.temperature}</span>
          </div>
        </div>

        {/* Key Technique Preview */}
        <div className="mt-4 rounded-md bg-background/30 p-2">
          <div className="mb-1 flex items-center gap-1.5">
            <Icon className="h-3 w-3 text-accent" name="Lightbulb" />
            <span className="text-accent text-overline">Key Technique</span>
          </div>
          <p className="line-clamp-2 text-caption leading-relaxed">
            {recipe.keyTechnique}
          </p>
        </div>
      </div>

      <CardFooter className="flex items-center justify-between border-t border-border/40 bg-muted/20 card-padding-compact">
        <div className="text-caption text-muted-foreground">
          {recipe.steps.length} step{recipe.steps.length !== 1 ? "s" : ""}
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 text-caption transition-colors",
            isSelected
              ? "text-primary"
              : "text-muted-foreground group-hover:text-accent"
          )}
        >
          {isSelected ? "Selected" : "View Recipe"}
          <Icon
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            name="ArrowRight"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
