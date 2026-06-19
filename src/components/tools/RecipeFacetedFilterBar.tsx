"use client";

import { useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stack } from "@/components/primitives/stack";
import {
  type DifficultyLevel,
  RECIPE_DIFFICULTY_OPTIONS,
  RECIPE_EXPERT_OPTIONS,
  RECIPE_METHOD_OPTIONS,
  RECIPE_USE_OPTIONS,
  type RecommendedUse,
} from "@/lib/tools/expert-recipes";

type Counts = Record<string, number>;

type RecipeFacetedFilterBarProps = {
  selectedMethod?: string;
  selectedDifficulty?: DifficultyLevel;
  selectedUse?: RecommendedUse;
  selectedExpert?: string;
  searchQuery?: string;
  onMethodChange: (val: string | undefined) => void;
  onDifficultyChange: (val: DifficultyLevel | undefined) => void;
  onUseChange: (val: RecommendedUse | undefined) => void;
  onExpertChange: (val: string | undefined) => void;
  onSearchChange: (val: string) => void;
  onClearAll: () => void;
  recipeCount: number;
  totalCount: number;
  methodCounts: Counts;
  difficultyCounts: Counts;
  useCounts: Counts;
  expertCounts: Counts;
};

/** Label with its live result count, e.g. "AeroPress (3)" — matches the directory bar. */
function withCount(label: string, count: number | undefined) {
  return `${label} (${count ?? 0})`;
}

export function RecipeFacetedFilterBar({
  selectedMethod,
  selectedDifficulty,
  selectedUse,
  selectedExpert,
  searchQuery = "",
  onMethodChange,
  onDifficultyChange,
  onUseChange,
  onExpertChange,
  onSearchChange,
  onClearAll,
  recipeCount,
  totalCount,
  methodCounts,
  difficultyCounts,
  useCounts,
  expertCounts,
}: RecipeFacetedFilterBarProps) {
  const activeFiltersCount = useMemo(() => {
    return (
      (selectedMethod ? 1 : 0) +
      (selectedDifficulty ? 1 : 0) +
      (selectedUse ? 1 : 0) +
      (selectedExpert ? 1 : 0)
    );
  }, [selectedMethod, selectedDifficulty, selectedUse, selectedExpert]);

  return (
    <Stack gap="4" className="w-full">
      {/* Search and Main Row */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Icon
            name="MagnifyingGlass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            aria-label="Search recipes, experts, or techniques"
            placeholder="Search recipes, experts or techniques..."
            className="pl-10 h-11 bg-background"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <p className="text-body text-muted-foreground leading-relaxed">
          Showing {recipeCount} of {totalCount} recipes
        </p>
      </div>

      {/* Filter Dropdowns Row — desktop only; mobile uses the Filters drawer */}
      <div className="hidden md:flex md:flex-wrap items-center gap-3">
        {/* Method */}
        <Select
          value={selectedMethod || "all"}
          onValueChange={(val) =>
            onMethodChange(val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[170px] bg-background">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {RECIPE_METHOD_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {withCount(o.label, methodCounts[o.value])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select
          value={selectedDifficulty || "all"}
          onValueChange={(val) =>
            onDifficultyChange(
              val === "all" ? undefined : (val as DifficultyLevel)
            )
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-background">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Difficulty</SelectItem>
            {RECIPE_DIFFICULTY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {withCount(o.label, difficultyCounts[o.value])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Use */}
        <Select
          value={selectedUse || "all"}
          onValueChange={(val) =>
            onUseChange(val === "all" ? undefined : (val as RecommendedUse))
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[170px] bg-background">
            <SelectValue placeholder="Recommended Use" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Use</SelectItem>
            {RECIPE_USE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {withCount(o.label, useCounts[o.value])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Expert */}
        <Select
          value={selectedExpert || "all"}
          onValueChange={(val) =>
            onExpertChange(val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[200px] bg-background">
            <SelectValue placeholder="Expert" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experts</SelectItem>
            {RECIPE_EXPERT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {withCount(o.label, expertCounts[o.value])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear All */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="md:ml-auto h-10 px-3 text-muted-foreground hover:text-accent"
          >
            Clear All
            <Badge
              variant="secondary"
              className="ml-2 px-1.5 py-0 min-w-[1.2rem] flex justify-center"
            >
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </Stack>
  );
}
