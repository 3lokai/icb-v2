"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import {
  type DifficultyLevel,
  RECIPE_DIFFICULTY_OPTIONS,
  RECIPE_EXPERT_OPTIONS,
  RECIPE_METHOD_OPTIONS,
  RECIPE_USE_OPTIONS,
  type RecommendedUse,
} from "@/lib/tools/expert-recipes";

type RecipeSidebarProps = {
  selectedMethod?: string;
  selectedDifficulty?: DifficultyLevel;
  selectedUse?: RecommendedUse;
  selectedExpert?: string;
  onMethodChange: (method: string | undefined) => void;
  onDifficultyChange: (difficulty: DifficultyLevel | undefined) => void;
  onUseChange: (use: RecommendedUse | undefined) => void;
  onExpertChange: (expert: string | undefined) => void;
  onClearAll: () => void;
  recipeCount: number;
  methodCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  useCounts: Record<string, number>;
  expertCounts: Record<string, number>;
};

export function RecipeSidebar({
  selectedMethod,
  selectedDifficulty,
  selectedUse,
  selectedExpert,
  onMethodChange,
  onDifficultyChange,
  onUseChange,
  onExpertChange,
  onClearAll,
  methodCounts,
  difficultyCounts,
  useCounts,
  expertCounts,
}: RecipeSidebarProps) {
  const methods = RECIPE_METHOD_OPTIONS.map((o) => ({
    ...o,
    count: methodCounts[o.value] ?? 0,
  }));

  const difficulties = RECIPE_DIFFICULTY_OPTIONS.map((o) => ({
    ...o,
    count: difficultyCounts[o.value] ?? 0,
  }));

  const useCases = RECIPE_USE_OPTIONS.map((o) => ({
    ...o,
    count: useCounts[o.value] ?? 0,
  }));

  // Check if any filters are active
  const hasActiveFilters =
    selectedMethod || selectedDifficulty || selectedUse || selectedExpert;

  // Helper to toggle single-select filter
  const toggleFilter = <T,>(
    current: T | undefined,
    value: T,
    onChange: (value: T | undefined) => void
  ) => {
    onChange(current === value ? undefined : value);
  };

  // Helper to render filter section
  const renderFilterSection = <T extends string>(options: {
    title: string;
    items: Array<{ value: T; label: string; count?: number }>;
    selected: T | undefined;
    onSelect: (value: T | undefined) => void;
  }) => {
    const { title, items, selected, onSelect } = options;
    if (items.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <span className="shrink-0 text-overline tracking-[0.15em] text-muted-foreground">
          {title}
        </span>
        <Cluster gap="2">
          {items.map((item) => {
            const isSelected = selected === item.value;
            return (
              <Button
                className="shrink-0"
                key={item.value}
                onClick={() => toggleFilter(selected, item.value, onSelect)}
                size="sm"
                variant={isSelected ? "default" : "outline"}
              >
                {item.label}
                {item.count !== undefined && (
                  <span className="ml-1.5 text-overline opacity-70">
                    ({item.count})
                  </span>
                )}
              </Button>
            );
          })}
        </Cluster>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8 space-y-6">
        <Stack gap="4">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 bg-accent/60" />
            <span className="text-overline tracking-[0.15em] text-muted-foreground">
              Refine results
            </span>
          </div>
          <h2 className="text-heading text-balance leading-tight tracking-tight">
            Filters
          </h2>
        </Stack>

        {/* Quick Filter Buttons */}
        <div className="space-y-6">
          {/* Brewing Methods */}
          {renderFilterSection({
            title: "Brewing Method",
            items: methods,
            selected: selectedMethod,
            onSelect: onMethodChange,
          })}

          {/* Difficulty Level */}
          {renderFilterSection({
            title: "Difficulty Level",
            items: difficulties,
            selected: selectedDifficulty,
            onSelect: onDifficultyChange,
          })}

          {/* Recommended Use */}
          {renderFilterSection({
            title: "Recommended Use",
            items: useCases,
            selected: selectedUse,
            onSelect: onUseChange,
          })}

          {/* Coffee Expert */}
          {renderFilterSection({
            title: "Coffee Expert",
            items: RECIPE_EXPERT_OPTIONS.map((o) => ({
              ...o,
              count: expertCounts[o.value] ?? 0,
            })),
            selected: selectedExpert,
            onSelect: onExpertChange,
          })}
        </div>
      </div>

      {/* Applied Filters Section */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 py-2 border-y border-border/40">
          <span className="shrink-0 text-overline tracking-[0.15em] text-muted-foreground">
            Applied
          </span>
          <Cluster gap="2">
            {selectedMethod && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {methods.find((m) => m.value === selectedMethod)?.label ||
                  selectedMethod}
                <button
                  aria-label={`Remove ${selectedMethod} filter`}
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => onMethodChange(undefined)}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {selectedDifficulty && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {selectedDifficulty}
                <button
                  aria-label={`Remove ${selectedDifficulty} filter`}
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => onDifficultyChange(undefined)}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {selectedUse && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {selectedUse}
                <button
                  aria-label={`Remove ${selectedUse} filter`}
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => onUseChange(undefined)}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {selectedExpert && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {selectedExpert}
                <button
                  aria-label={`Remove ${selectedExpert} filter`}
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => onExpertChange(undefined)}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            <Button
              className="shrink-0 text-micro font-bold uppercase tracking-widest hover:text-accent"
              onClick={onClearAll}
              size="sm"
              variant="link"
            >
              Clear all
            </Button>
          </Cluster>
        </div>
      )}
    </div>
  );
}
