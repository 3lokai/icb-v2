// src/components/discovery/DiscoveryRecipeSection.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { filterRecipes, type ExpertRecipe } from "@/lib/tools/expert-recipes";
import type { BrewingMethodKey, RoastLevel } from "@/lib/tools/brewing-guide";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecipeDetail } from "@/components/tools/RecipeDetail";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type DiscoveryRecipeSectionProps = {
  methodKey?: BrewingMethodKey | string;
  roastLevel?: RoastLevel | string;
  className?: string;
};

export function DiscoveryRecipeSection({
  methodKey,
  roastLevel,
  className,
}: DiscoveryRecipeSectionProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<ExpertRecipe | null>(
    null
  );

  // Filter recipes based on the discovery context
  const recipes = filterRecipes({
    method: methodKey as BrewingMethodKey,
    roast: roastLevel as RoastLevel,
  }).slice(0, 3);

  if (recipes.length === 0) return null;

  return (
    <Section spacing="tight" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="Expert Techniques"
        title="Brew like a *pro*"
        description="Master your coffee with these championship-winning recipes tailored for this profile."
        rightAside={
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-accent hover:text-accent hover:bg-accent/5"
          >
            <Link
              href="/tools/expert-recipes"
              className="flex items-center gap-2"
            >
              <span className="font-semibold tracking-wide">
                See all recipes
              </span>
              <Icon name="ArrowRight" size={16} />
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <Dialog
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 scrollbar-hide">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedRecipe?.title}</DialogTitle>
          </DialogHeader>
          {selectedRecipe && (
            <div className="p-6 md:p-8">
              <RecipeDetail
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
