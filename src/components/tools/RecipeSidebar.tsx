"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cluster } from "@/components/primitives/cluster";
import {
  type DifficultyLevel,
  EXPERTS,
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
  const methods = [
    { value: "v60" as const, label: "V60", count: methodCounts.v60 ?? 0 },
    {
      value: "aeropress" as const,
      label: "AeroPress",
      count: methodCounts.aeropress ?? 0,
    },
    {
      value: "frenchpress" as const,
      label: "French Press",
      count: methodCounts.frenchpress ?? 0,
    },
    {
      value: "chemex" as const,
      label: "Chemex",
      count: methodCounts.chemex ?? 0,
    },
    {
      value: "pourover" as const,
      label: "Pour Over",
      count: methodCounts.pourover ?? 0,
    },
  ];

  const difficulties = [
    {
      value: "Beginner" as const,
      label: "Beginner",
      count: difficultyCounts.Beginner ?? 0,
    },
    {
      value: "Intermediate" as const,
      label: "Intermediate",
      count: difficultyCounts.Intermediate ?? 0,
    },
    {
      value: "Advanced" as const,
      label: "Advanced",
      count: difficultyCounts.Advanced ?? 0,
    },
  ];

  const useCases = [
    {
      value: "everyday" as const,
      label: "Everyday",
      count: useCounts.everyday ?? 0,
    },
    {
      value: "competition" as const,
      label: "Competition",
      count: useCounts.competition ?? 0,
    },
    {
      value: "experiment" as const,
      label: "Experiment",
      count: useCounts.experiment ?? 0,
    },
  ];

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
        <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
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
    <div className="w-full space-y-6 md:w-64">
      {/* Header */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-subheading">Filters</h2>
        </div>

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
            items: EXPERTS.map((expert) => ({
              value: expert.name,
              label: expert.name,
              count: expertCounts[expert.name] ?? 0,
            })),
            selected: selectedExpert,
            onSelect: onExpertChange,
          })}
        </div>
      </div>

      {/* Applied Filters Section */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 py-2 border-y border-border/40">
          <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
            Applied:
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
