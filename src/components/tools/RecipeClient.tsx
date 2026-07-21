"use client";

import { useEffect, useMemo, useState } from "react";
import { trackToolsEngagement } from "@/lib/analytics/enhanced-tracking";
import type { BrewingMethodKey } from "@/lib/tools/brewing-guide";
import {
  type ExpertRecipe,
  filterRecipes,
  RECIPE_DIFFICULTY_OPTIONS,
  RECIPE_EXPERT_OPTIONS,
  RECIPE_METHOD_OPTIONS,
  RECIPE_USE_OPTIONS,
  type RecipeFilters,
} from "@/lib/tools/expert-recipes";
import { FunnelIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { RecipeMainPanel } from "./RecipeMainPanel";
import { MobileRecipeFilterDrawer } from "./MobileRecipeFilterDrawer";
import { RecipeFacetedFilterBar } from "./RecipeFacetedFilterBar";
import { Stack } from "../primitives/stack";
import { Button } from "../ui/button";

export function ExpertRecipesClient() {
  // Mobile drawer state
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState("");
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

    let results = filterRecipes(filters);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.expert.name.toLowerCase().includes(q) ||
          (r.flavorProfile?.toLowerCase().includes(q) ?? false)
      );
    }

    return results;
  }, [
    selectedMethod,
    selectedDifficulty,
    selectedUse,
    selectedExpert,
    searchQuery,
  ]);

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
    RECIPE_METHOD_OPTIONS.forEach(({ value }) => {
      counts[value] = recipesForCounting.filter(
        (r) => r.method === value
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
    RECIPE_DIFFICULTY_OPTIONS.forEach(({ value }) => {
      counts[value] = recipesForCounting.filter(
        (r) => r.difficulty === value
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
    RECIPE_USE_OPTIONS.forEach(({ value }) => {
      counts[value] = recipesForCounting.filter(
        (r) => r.recommendedUse === value
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
    RECIPE_EXPERT_OPTIONS.forEach(({ value }) => {
      counts[value] = recipesForCounting.filter(
        (r) => r.expert.name === value
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
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedMethod ? 1 : 0) +
    (selectedDifficulty ? 1 : 0) +
    (selectedUse ? 1 : 0) +
    (selectedExpert ? 1 : 0);

  return (
    <Stack gap="8">
      {/* Mobile Filter Toggle — directory-pattern button → left-sheet drawer */}
      <div className="md:hidden">
        <Button
          aria-label="Open filters"
          className="w-full justify-start"
          onClick={() => setIsFiltersDrawerOpen(true)}
          variant="outline"
        >
          <Icon className="mr-2" icon={FunnelIcon} size={16} />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search + faceted filter bar (dropdown row is desktop-only) */}
      <RecipeFacetedFilterBar
        recipeCount={filteredRecipes.length}
        totalCount={filterRecipes({}).length} // Total recipes available
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedUse={selectedUse}
        onUseChange={setSelectedUse}
        selectedExpert={selectedExpert}
        onExpertChange={setSelectedExpert}
        onClearAll={clearAllFilters}
        methodCounts={methodCounts}
        difficultyCounts={difficultyCounts}
        useCounts={useCounts}
        expertCounts={expertCounts}
      />

      {/* Main Content - Full Width Grid */}
      <div className="w-full">
        <RecipeMainPanel
          onRecipeSelect={setSelectedRecipeId}
          recipes={filteredRecipes}
          selectedRecipeId={selectedRecipeId}
        />
      </div>

      {/* Mobile Filter Drawer (Hidden on Desktop) */}
      <MobileRecipeFilterDrawer
        difficultyCounts={difficultyCounts}
        expertCounts={expertCounts}
        methodCounts={methodCounts}
        onClearAll={clearAllFilters}
        onDifficultyChange={setSelectedDifficulty}
        onExpertChange={setSelectedExpert}
        onMethodChange={setSelectedMethod}
        onOpenChange={setIsFiltersDrawerOpen}
        onUseChange={setSelectedUse}
        open={isFiltersDrawerOpen}
        recipeCount={filteredRecipes.length}
        selectedDifficulty={selectedDifficulty}
        selectedExpert={selectedExpert}
        selectedMethod={selectedMethod}
        selectedUse={selectedUse}
        useCounts={useCounts}
      />
    </Stack>
  );
}
