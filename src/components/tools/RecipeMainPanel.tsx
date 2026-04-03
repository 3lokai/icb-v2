// Enhanced RecipeMainPanel.tsx - UI only changes
import React, { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { BrewingTimer } from "@/components/tools/BrewTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateBrewRatio } from "@/lib/tools/brewing-guide";
import type { ExpertRecipe } from "@/lib/tools/expert-recipes";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { RecipeDetail } from "./RecipeDetail";

type RecipeMainPanelProps = {
  recipes: ExpertRecipe[];
  selectedRecipeId?: string;
  onRecipeSelect: (recipeId: string | undefined) => void;
};

export function RecipeMainPanel({
  recipes,
  selectedRecipeId,
  onRecipeSelect,
}: RecipeMainPanelProps) {
  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

  if (selectedRecipe) {
    return (
      <RecipeDetail
        onClose={() => onRecipeSelect(undefined)}
        recipe={selectedRecipe}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Enhanced with surface treatment */}
      <div className="surface-1 relative overflow-hidden rounded-2xl p-6">
        <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative z-10">
          <h2 className="mb-2 text-title text-primary">
            Expert Coffee Recipes
          </h2>
          <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
          <p className="text-muted-foreground">
            Showing {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="surface-1 card-padding relative overflow-hidden rounded-lg py-12 text-center">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-muted/10 blur-2xl" />
          <div className="relative z-10">
            <Icon
              className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50"
              name="Coffee"
            />
            <h3 className="mb-2 text-subheading">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more recipes
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recipes.map((recipe) => (
            <RecipeCard
              isSelected={selectedRecipeId === recipe.id}
              key={recipe.id}
              onSelect={() => onRecipeSelect(recipe.id)}
              recipe={recipe}
              variant="default"
            />
          ))}
        </div>
      )}
    </div>
  );
}
