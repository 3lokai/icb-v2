import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type DifficultyLevel,
  EXPERTS,
  type RecommendedUse,
} from "@/lib/tools/expert-recipes";
import { FilterSection } from "./FilterSection";

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
  recipeCount,
}: RecipeSidebarProps) {
  const methods = [
    { value: "v60" as const, label: "V60", icon: "Coffee" as const },
    {
      value: "aeropress" as const,
      label: "AeroPress",
      icon: "Circle" as const,
    },
    {
      value: "frenchpress" as const,
      label: "French Press",
      icon: "Coffee" as const,
    },
    { value: "chemex" as const, label: "Chemex", icon: "Funnel" as const },
    { value: "pourover" as const, label: "Pour Over", icon: "Drop" as const },
  ];

  const difficulties = [
    { value: "Beginner" as const, label: "Beginner", color: "bg-green-500" },
    {
      value: "Intermediate" as const,
      label: "Intermediate",
      color: "bg-yellow-500",
    },
    { value: "Advanced" as const, label: "Advanced", color: "bg-red-500" },
  ];

  const useCases = [
    { value: "everyday" as const, label: "Everyday", icon: "Coffee" as const },
    {
      value: "competition" as const,
      label: "Competition",
      icon: "Trophy" as const,
    },
    {
      value: "experiment" as const,
      label: "Experiment",
      icon: "Flask" as const,
    },
  ];

  // Check if any filters are active
  const hasActiveFilters = !!(
    selectedMethod ||
    selectedDifficulty ||
    selectedUse ||
    selectedExpert
  );

  return (
    <div className="w-80 space-y-6">
      {/* Header - Enhanced glass panel */}
      <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="absolute top-0 right-0 h-16 w-16 animate-float rounded-full bg-primary/10 blur-xl" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-primary">
              Filter Recipes
            </h3>
            <div className="flex items-center gap-2">
              <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                {recipeCount} recipes
              </Badge>
              {hasActiveFilters && (
                <Badge className="badge bg-accent/90 text-accent-foreground text-xs">
                  Filters active
                </Badge>
              )}
            </div>
          </div>
          <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
          <Button
            className="w-full bg-background/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-background/80"
            disabled={!hasActiveFilters}
            onClick={onClearAll}
            size="sm"
            variant="outline"
          >
            <Icon className="mr-2 h-4 w-4" name="X" />
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Brewing Methods */}
      <FilterSection
        blurPosition="top-right"
        icon="Coffee"
        items={methods}
        onSelect={onMethodChange}
        selected={selectedMethod}
        title="Brewing Method"
      />

      {/* Difficulty */}
      <FilterSection
        blurPosition="top-left"
        icon="ChartBar"
        items={difficulties.map((d) => ({
          value: d.value,
          label: d.label,
          color: d.color,
        }))}
        onSelect={onDifficultyChange}
        selected={selectedDifficulty}
        title="Difficulty Level"
      />

      {/* Use Case */}
      <FilterSection
        blurPosition="bottom-right"
        icon="Target"
        items={useCases}
        onSelect={onUseChange}
        selected={selectedUse}
        title="Recommended Use"
      />

      {/* Expert */}
      <FilterSection
        blurPosition="top-right"
        icon="User"
        items={EXPERTS.map((expert) => ({
          value: expert.name,
          label: expert.name,
          metadata: `${expert.recipes.length} recipe${expert.recipes.length > 1 ? "s" : ""}`,
        }))}
        onSelect={onExpertChange}
        selected={selectedExpert}
        title="Coffee Expert"
      />

      {/* Pro Tip - Enhanced glass modal */}
      <div className="glass-modal card-padding relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 h-20 w-20 animate-float rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-12 w-12 animate-float rounded-full bg-primary/20 blur-xl delay-700" />
        <div className="relative z-10 text-center">
          <Icon className="mx-auto mb-3 h-8 w-8 text-accent" name="Lightbulb" />
          <h4 className="mb-2 font-medium text-primary">Pro Tip</h4>
          <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-accent" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Start with everyday recipes, then try competition methods as you
            develop your skills.
          </p>
        </div>
      </div>
    </div>
  );
}
