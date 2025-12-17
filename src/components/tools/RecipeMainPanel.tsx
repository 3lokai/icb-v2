// Enhanced RecipeMainPanel.tsx - UI only changes
import React, { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { BrewingTimer } from "@/components/tools/BrewTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BREWING_METHODS_ARRAY,
  calculateBrewRatio,
} from "@/lib/tools/brewing-guide";
import type { ExpertRecipe } from "@/lib/tools/expert-recipes";
import { cn } from "@/lib/utils";

type RecipeMainPanelProps = {
  recipes: ExpertRecipe[];
  selectedRecipeId?: string;
  onRecipeSelect: (recipeId: string | undefined) => void;
};

type RecipeCardProps = {
  recipe: ExpertRecipe;
  isSelected: boolean;
  onSelect: () => void;
};

function RecipeCard({ recipe, isSelected, onSelect }: RecipeCardProps) {
  const difficultyColors = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500",
  };

  const useColors = {
    everyday: "default",
    competition: "destructive",
    experiment: "secondary",
  } as const;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: Cannot use button element due to nested button constraint - inner element is decorative
    <div
      className={`glass-card card-padding hover-lift group relative w-full cursor-pointer overflow-hidden text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isSelected ? "border-primary/50 shadow-lg ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {/* Decorative blur element */}
      <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-primary/5 blur-xl" />

      <div className="relative z-10">
        <div className="pb-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                className="h-4 w-4 text-primary transition-transform group-hover:scale-110"
                name="Coffee"
              />
              <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                {
                  BREWING_METHODS_ARRAY.find((m) => m.id === recipe.method)
                    ?.name
                }
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`h-3 w-3 rounded-full ${difficultyColors[recipe.difficulty]}`}
              />
              <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                {recipe.difficulty}
              </Badge>
            </div>
          </div>

          <h3 className="mb-3 font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="font-medium">{recipe.expert.name}</span>
              {recipe.expert.year && (
                <Badge className="badge bg-accent/90 text-accent-foreground text-xs">
                  {recipe.expert.year}
                </Badge>
              )}
            </div>
            <Badge
              className="text-xs"
              variant={useColors[recipe.recommendedUse]}
            >
              {recipe.recommendedUse}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {/* Quick Stats - Enhanced with glass treatment */}
          <div className="glass-panel relative overflow-hidden rounded-lg p-3">
            <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-accent/5 blur-lg" />
            <div className="relative z-10 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ratio</span>
                <span className="font-medium">{recipe.ratio}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{recipe.totalTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Grind</span>
                <span className="font-medium text-xs">{recipe.grind}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Temp</span>
                <span className="font-medium text-xs">
                  {recipe.temperature}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Key Technique Preview - Enhanced glass panel */}
          <div className="glass-panel relative overflow-hidden rounded-lg p-3">
            <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-accent/10 blur-lg" />
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-3 w-3 text-accent" name="Lightbulb" />
                <span className="font-medium text-accent text-xs uppercase tracking-wide">
                  Key Technique
                </span>
              </div>
              <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                {recipe.keyTechnique}
              </p>
            </div>
          </div>

          {/* Action */}
          <div
            className={cn(
              "glass-button hover-lift group flex h-8 w-full items-center justify-center gap-1.5 rounded-md border px-3 font-medium text-sm transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {isSelected ? "Selected" : "View Full Recipe"}
            <Icon
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
              name="ArrowRight"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type RecipeDetailProps = {
  recipe: ExpertRecipe;
  onClose: () => void;
};

function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert to calculator results for timer integration
  const timerResults = React.useMemo(() => {
    try {
      return calculateBrewRatio({
        method: recipe.method,
        volume: recipe.water,
        strength: recipe.strengthLevel,
        roastLevel: recipe.roastRecommendation[0],
      });
    } catch {
      return null;
    }
  }, [recipe]);

  const handleCopyRecipe = async () => {
    const recipeText = `
${recipe.title} by ${recipe.expert.name}

Coffee: ${recipe.coffee}g
Water: ${recipe.water}ml
Ratio: ${recipe.ratio}
Grind: ${recipe.grind}
Temperature: ${recipe.temperature}
Time: ${recipe.totalTime}

Steps:
${recipe.steps.map((step, i) => `${i + 1}. ${step.time}: ${step.instruction}`).join("\n")}

Key Technique: ${recipe.keyTechnique}

From IndianCoffeeBeans.com Expert Recipes
    `.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy recipe:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Enhanced with glass treatment */}
      <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2 font-bold text-2xl text-primary">
                {recipe.title}
              </h2>
              <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
              <div className="mb-6 flex items-center gap-3 text-muted-foreground">
                <span className="font-medium">{recipe.expert.name}</span>
                <span>•</span>
                <span>{recipe.expert.achievement}</span>
                {recipe.expert.year && (
                  <>
                    <span>•</span>
                    <span>{recipe.expert.year}</span>
                  </>
                )}
              </div>

              {/* Recipe Summary - Enhanced glass treatment */}
              <div className="glass-card relative overflow-hidden rounded-lg p-4">
                <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-accent/10 blur-xl" />
                <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">
                      {recipe.coffee}g
                    </div>
                    <div className="text-muted-foreground text-sm">Coffee</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">
                      {recipe.water}ml
                    </div>
                    <div className="text-muted-foreground text-sm">Water</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">
                      {recipe.ratio}
                    </div>
                    <div className="text-muted-foreground text-sm">Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">
                      {recipe.totalTime}
                    </div>
                    <div className="text-muted-foreground text-sm">Time</div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="hover:bg-background/50"
              onClick={onClose}
              size="sm"
              variant="ghost"
            >
              <Icon className="h-4 w-4" name="X" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Story - Glass card treatment */}
          <div className="glass-card card-padding relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />
            <div className="relative z-10">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-primary">
                <Icon className="h-5 w-5" name="BookOpen" />
                The Story
              </h3>
              <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
              <p className="text-muted-foreground leading-relaxed">
                {recipe.story}
              </p>
            </div>
          </div>

          {/* Steps - Glass card treatment */}
          <div className="glass-card card-padding relative overflow-hidden">
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full bg-accent/5 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-lg text-primary">
                    <Icon className="h-5 w-5" name="ListChecks" />
                    Brewing Steps
                  </h3>
                  <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
                </div>
                <Button
                  className="glass-button flex items-center gap-2"
                  onClick={() => setShowTimer(!showTimer)}
                  size="sm"
                  variant="outline"
                >
                  <Icon className="h-4 w-4" name="Timer" />
                  {showTimer ? "Hide Timer" : "Start Timer"}
                </Button>
              </div>
              <div className="mt-6 space-y-3">
                {recipe.steps.map((step, index) => (
                  <div
                    className="glass-card card-padding group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    key={`step-${step.time}-${index}`}
                  >
                    <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-primary/5 blur-lg" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                        <span className="font-medium text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {step.time}
                          </span>
                          {step.waterAmount && (
                            <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                              {step.waterAmount}ml
                            </Badge>
                          )}
                          {step.pourNumber && (
                            <Badge className="badge bg-accent/90 text-accent-foreground text-xs">
                              Pour #{step.pourNumber}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timer */}
          {showTimer && timerResults && (
            <div className="glass-panel card-padding rounded-2xl">
              <BrewingTimer results={timerResults} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips - Enhanced glass card */}
          <div className="glass-card card-padding relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-accent/10 blur-xl" />
            <div className="relative z-10">
              <h4 className="mb-4 flex items-center gap-2 font-medium text-base text-primary">
                <Icon className="h-5 w-5" name="Lightbulb" />
                Pro Tips
              </h4>
              <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
              <div className="space-y-3">
                {recipe.tips.map((tip, index) => (
                  <div
                    className="group flex items-start gap-3 rounded-lg bg-background/30 p-3 backdrop-blur-sm transition-colors hover:bg-background/40"
                    key={`tip-${tip.slice(0, 20)}-${index}`}
                  >
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
                    <p className="text-muted-foreground text-sm leading-relaxed transition-colors group-hover:text-foreground">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment - Enhanced glass card */}
          <div className="glass-card card-padding relative overflow-hidden">
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
            <div className="relative z-10">
              <h4 className="mb-4 flex items-center gap-2 font-medium text-base text-primary">
                <Icon className="h-5 w-5" name="Wrench" />
                Equipment
              </h4>
              <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
              <div className="space-y-2">
                {recipe.equipmentRecommendations.map((equipment, index) => (
                  <div
                    className="group flex items-center gap-2 rounded-lg bg-background/30 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-background/40"
                    key={`equipment-${equipment.slice(0, 20)}-${index}`}
                  >
                    <Icon
                      className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                      name="Coffee"
                    />
                    <span className="text-sm transition-colors group-hover:text-foreground">
                      {equipment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions - Enhanced glass modal for conversion focus */}
          <div className="glass-modal card-padding relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-primary/20 blur-xl" />
            <div className="absolute bottom-0 left-0 h-8 w-8 rounded-full bg-accent/20 blur-lg" />
            <div className="relative z-10">
              <h4 className="mb-4 font-medium text-base text-primary">
                Save & Share
              </h4>
              <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
              <div className="space-y-2">
                <Button
                  className="glass-button hover-lift group w-full"
                  onClick={handleCopyRecipe}
                  size="sm"
                  variant="outline"
                >
                  <Icon
                    className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
                    name="Copy"
                  />
                  {copied ? "Copied!" : "Copy Recipe"}
                </Button>

                {recipe.youtubeUrl && (
                  <Button
                    asChild
                    className="glass-button hover-lift group w-full"
                    size="sm"
                    variant="outline"
                  >
                    <a
                      href={recipe.youtubeUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Icon
                        className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
                        name="Play"
                      />
                      Watch Video
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Header - Enhanced with glass treatment */}
      <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative z-10">
          <h2 className="mb-2 font-bold text-2xl text-primary">
            Expert Coffee Recipes
          </h2>
          <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
          <p className="text-muted-foreground">
            Showing {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="glass-card card-padding relative overflow-hidden py-12 text-center">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-muted/10 blur-2xl" />
          <div className="relative z-10">
            <Icon
              className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50"
              name="Coffee"
            />
            <h3 className="mb-2 font-semibold text-lg">No recipes found</h3>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
