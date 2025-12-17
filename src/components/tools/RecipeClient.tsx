"use client";

import { useEffect, useMemo, useState } from "react";
import { trackToolsEngagement } from "@/lib/analytics/enhanced-tracking";
import type { BrewingMethodKey } from "@/lib/tools/brewing-guide";
import {
  type ExpertRecipe,
  filterRecipes,
  type RecipeFilters,
} from "@/lib/tools/expert-recipes";
import { RecipeMainPanel } from "./RecipeMainPanel";
import { RecipeSidebar } from "./RecipeSidebar";

export function ExpertRecipesClient() {
  // Filter state
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ExpertRecipe["difficulty"] | undefined
  >();
  const [selectedUse, setSelectedUse] = useState<
    ExpertRecipe["recommendedUse"] | undefined
  >();
  const [selectedExpert, setSelectedExpert] = useState<string | undefined>();
  useEffect(() => {
    const startTime = Date.now();

    // Track recipes tool entry
    trackToolsEngagement("recipes", {
      sessionDuration: 0,
      interactionCount: 0,
      completionStatus: "started",
    });

    return () => {
      const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
      if (sessionDuration > 30) {
        trackToolsEngagement("recipes", {
          sessionDuration,
          interactionCount: 1,
          completionStatus: sessionDuration > 240 ? "completed" : "partial",
        });
      }
    };
  }, []);

  // Selected recipe state
  const [selectedRecipeId, setSelectedRecipeId] = useState<
    string | undefined
  >();

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    const filters: RecipeFilters = {};

    if (selectedMethod) {
      filters.method = selectedMethod as BrewingMethodKey;
    }
    if (selectedDifficulty) {
      filters.difficulty = selectedDifficulty;
    }
    if (selectedUse) {
      filters.recommendedUse = selectedUse;
    }
    if (selectedExpert) {
      filters.expert = selectedExpert;
    }

    return filterRecipes(filters);
  }, [selectedMethod, selectedDifficulty, selectedUse, selectedExpert]);

  const clearAllFilters = () => {
    setSelectedMethod(undefined);
    setSelectedDifficulty(undefined);
    setSelectedUse(undefined);
    setSelectedExpert(undefined);
    setSelectedRecipeId(undefined);
  };

  return (
    <div className="flex min-h-screen gap-8 bg-gradient-to-b from-background to-muted/20">
      {/* Sidebar */}
      <RecipeSidebar
        onClearAll={clearAllFilters}
        onDifficultyChange={setSelectedDifficulty}
        onExpertChange={setSelectedExpert}
        onMethodChange={setSelectedMethod}
        onUseChange={setSelectedUse}
        recipeCount={filteredRecipes.length}
        selectedDifficulty={selectedDifficulty}
        selectedExpert={selectedExpert}
        selectedMethod={selectedMethod}
        selectedUse={selectedUse}
      />

      {/* Main Content */}
      <div className="flex-1">
        <RecipeMainPanel
          onRecipeSelect={setSelectedRecipeId}
          recipes={filteredRecipes}
          selectedRecipeId={selectedRecipeId}
        />
      </div>
    </div>
  );
}
