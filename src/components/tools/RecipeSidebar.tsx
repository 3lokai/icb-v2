import { Button } from "@/components/ui/button";
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
      <div className="space-y-2">
        <label className="font-medium text-caption" htmlFor={title}>
          {title}
        </label>
        <div className="space-y-2">
          {items.map((item) => (
            <label
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/50"
              key={item.value}
            >
              <input
                checked={selected === item.value}
                className="h-4 w-4 rounded border-input"
                onChange={() => toggleFilter(selected, item.value, onSelect)}
                type="checkbox"
              />
              <span className="text-caption">
                {item.label}{" "}
                {item.count !== undefined && (
                  <span className="text-muted-foreground">({item.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 md:w-64">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-subheading">Filters</h2>
        <Button onClick={onClearAll} size="sm" variant="ghost">
          Reset
        </Button>
      </div>

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
  );
}
