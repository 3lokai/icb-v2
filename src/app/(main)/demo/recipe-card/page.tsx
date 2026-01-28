import { RecipeCard } from "@/components/cards/RecipeCard";
import type { ExpertRecipe } from "@/lib/tools/expert-recipes";
import { EXPERT_RECIPES } from "@/lib/tools/expert-recipes";
import { Stack } from "@/components/primitives/stack";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";

// Use the Hoffman V60 recipe as the demo recipe
const demoRecipe: ExpertRecipe = EXPERT_RECIPES["hoffman-v60"];

export default function RecipeCardDemoPage() {
  if (!demoRecipe) {
    return (
      <PageShell>
        <Section spacing="default" contained={false}>
          <div className="text-center">
            <h1 className="text-title mb-2">Recipe Not Found</h1>
            <p className="text-body text-muted-foreground">
              Demo recipe could not be found.
            </p>
          </div>
        </Section>
      </PageShell>
    );
  }

  return (
    <>
      {/* Header Section */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="2">
            <h1 className="text-title">RecipeCard Component Demo</h1>
            <p className="text-body text-muted-foreground">
              Showcasing both variants of the RecipeCard component using recipe:{" "}
              <strong>{demoRecipe.title}</strong>
            </p>
          </Stack>
        </PageShell>
      </Section>

      {/* Default Variant */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Default Variant</h2>
              <p className="text-caption text-muted-foreground">
                Full card with all recipe details, stats, and key techniques.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <RecipeCard recipe={demoRecipe} variant="default" />
              <RecipeCard
                recipe={demoRecipe}
                variant="default"
                isSelected={false}
              />
              <RecipeCard
                recipe={demoRecipe}
                variant="default"
                isSelected={true}
              />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Compact Variant */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Compact Variant</h2>
              <p className="text-caption text-muted-foreground">
                Dense, horizontal layout with method badge and key info. Perfect
                for lists and sidebars.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl">
              <RecipeCard recipe={demoRecipe} variant="compact" />
              <RecipeCard
                recipe={demoRecipe}
                variant="compact"
                isSelected={true}
              />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Grid Layout - 2 Columns */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Grid Layout - 2 Columns</h2>
              <p className="text-caption text-muted-foreground">
                Two-column grid layout for recipe cards (standard for recipe
                grids).
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <RecipeCard recipe={demoRecipe} variant="default" />
              <RecipeCard recipe={demoRecipe} variant="default" />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Grid Layout - 3 Columns */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Grid Layout - 3 Columns</h2>
              <p className="text-caption text-muted-foreground">
                Three-column grid layout for recipe cards.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <RecipeCard recipe={demoRecipe} variant="default" />
              <RecipeCard recipe={demoRecipe} variant="default" />
              <RecipeCard recipe={demoRecipe} variant="default" />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* All Variants Comparison */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">All Variants Comparison</h2>
              <p className="text-caption text-muted-foreground">
                Same recipe displayed in both variants for direct comparison.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Default</h3>
                <RecipeCard recipe={demoRecipe} variant="default" />
              </div>
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Compact</h3>
                <RecipeCard recipe={demoRecipe} variant="compact" />
              </div>
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Selected States */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Selected States</h2>
              <p className="text-caption text-muted-foreground">
                Showing default variant with selected and unselected states.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <RecipeCard
                recipe={demoRecipe}
                variant="default"
                isSelected={false}
              />
              <RecipeCard
                recipe={demoRecipe}
                variant="default"
                isSelected={true}
              />
              <RecipeCard
                recipe={demoRecipe}
                variant="default"
                isSelected={false}
              />
            </div>
          </Stack>
        </PageShell>
      </Section>
    </>
  );
}
