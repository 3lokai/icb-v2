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

  // Calculate counts for each filter option
  const methodCounts = useMemo(() => {
    // Get recipes filtered by all other filters except method
    const filtersWithoutMethod: RecipeFilters = {};
    if (selectedDifficulty) {
      filtersWithoutMethod.difficulty = selectedDifficulty;
    }
    if (selectedUse) {
      filtersWithoutMethod.recommendedUse = selectedUse;
    }
    if (selectedExpert) {
      filtersWithoutMethod.expert = selectedExpert;
    }
    const recipesForCounting = filterRecipes(filtersWithoutMethod);

    const counts: Record<string, number> = {};
    const methods = ["v60", "aeropress", "frenchpress", "chemex", "pourover"];
    methods.forEach((method) => {
      counts[method] = recipesForCounting.filter(
        (r) => r.method === method
      ).length;
    });
    return counts;
  }, [selectedDifficulty, selectedUse, selectedExpert]);

  const difficultyCounts = useMemo(() => {
    // Get recipes filtered by all other filters except difficulty
    const filtersWithoutDifficulty: RecipeFilters = {};
    if (selectedMethod) {
      filtersWithoutDifficulty.method = selectedMethod as BrewingMethodKey;
    }
    if (selectedUse) {
      filtersWithoutDifficulty.recommendedUse = selectedUse;
    }
    if (selectedExpert) {
      filtersWithoutDifficulty.expert = selectedExpert;
    }
    const recipesForCounting = filterRecipes(filtersWithoutDifficulty);

    const counts: Record<string, number> = {};
    const difficulties = ["Beginner", "Intermediate", "Advanced"];
    difficulties.forEach((difficulty) => {
      counts[difficulty] = recipesForCounting.filter(
        (r) => r.difficulty === difficulty
      ).length;
    });
    return counts;
  }, [selectedMethod, selectedUse, selectedExpert]);

  const useCounts = useMemo(() => {
    // Get recipes filtered by all other filters except recommendedUse
    const filtersWithoutUse: RecipeFilters = {};
    if (selectedMethod) {
      filtersWithoutUse.method = selectedMethod as BrewingMethodKey;
    }
    if (selectedDifficulty) {
      filtersWithoutUse.difficulty = selectedDifficulty;
    }
    if (selectedExpert) {
      filtersWithoutUse.expert = selectedExpert;
    }
    const recipesForCounting = filterRecipes(filtersWithoutUse);

    const counts: Record<string, number> = {};
    const uses = ["everyday", "competition", "experiment"];
    uses.forEach((use) => {
      counts[use] = recipesForCounting.filter(
        (r) => r.recommendedUse === use
      ).length;
    });
    return counts;
  }, [selectedMethod, selectedDifficulty, selectedExpert]);

  const expertCounts = useMemo(() => {
    // Get recipes filtered by all other filters except expert
    const filtersWithoutExpert: RecipeFilters = {};
    if (selectedMethod) {
      filtersWithoutExpert.method = selectedMethod as BrewingMethodKey;
    }
    if (selectedDifficulty) {
      filtersWithoutExpert.difficulty = selectedDifficulty;
    }
    if (selectedUse) {
      filtersWithoutExpert.recommendedUse = selectedUse;
    }
    const recipesForCounting = filterRecipes(filtersWithoutExpert);

    const counts: Record<string, number> = {};
    const experts = [
      "James Hoffmann",
      "Tetsu Kasuya",
      "Scott Rao",
      "Carolina Ibarra Garay",
      "George Stanica",
      "Intelligentsia Coffee",
    ];
    experts.forEach((expert) => {
      counts[expert] = recipesForCounting.filter(
        (r) => r.expert.name === expert
      ).length;
    });
    return counts;
  }, [selectedMethod, selectedDifficulty, selectedUse]);

  const clearAllFilters = () => {
    setSelectedMethod(undefined);
    setSelectedDifficulty(undefined);
    setSelectedUse(undefined);
    setSelectedExpert(undefined);
    setSelectedRecipeId(undefined);
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <RecipeSidebar
        difficultyCounts={difficultyCounts}
        expertCounts={expertCounts}
        methodCounts={methodCounts}
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
        useCounts={useCounts}
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
