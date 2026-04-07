// Enhanced RecipeMainPanel.tsx - UI only changes
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
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
      {recipes.length === 0 ? (
        <div className="surface-1 card-padding relative overflow-hidden rounded-lg py-16 text-center">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-muted/10 blur-2xl" />
          <div className="relative z-10">
            <Icon
              className="mx-auto mb-6 h-12 w-12 text-muted-foreground opacity-50"
              name="Coffee"
            />
            <Stack className="items-center" gap="4">
              <h3 className="text-heading text-primary">No recipes found</h3>
              <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
              <p className="max-w-md text-pretty text-body text-muted-foreground leading-relaxed">
                Try widening your search or clearing filters to see more
                recipes.
              </p>
            </Stack>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
