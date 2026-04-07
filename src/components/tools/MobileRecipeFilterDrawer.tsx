"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RecipeSidebar } from "./RecipeSidebar";
import { cn } from "@/lib/utils";
import type {
  DifficultyLevel,
  RecommendedUse,
} from "@/lib/tools/expert-recipes";

type MobileRecipeFilterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

/**
 * Mobile Recipe Filter Drawer Component
 * Sheet drawer for recipe filtering
 * Only visible on mobile devices (< 768px)
 */
export function MobileRecipeFilterDrawer({
  open,
  onOpenChange,
  ...sidebarProps
}: MobileRecipeFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn("surface-2 overflow-y-auto md:hidden")}
        side="left"
      >
        <SheetHeader className="space-y-3 text-left">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 bg-accent/60" />
            <span className="text-overline tracking-[0.15em] text-muted-foreground">
              Refine results
            </span>
          </div>
          <SheetTitle className="text-heading text-balance leading-tight tracking-tight">
            Brewing filters
          </SheetTitle>
          <SheetDescription className="text-body text-muted-foreground leading-relaxed">
            Combine method, difficulty, use case, and expert to find a recipe.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-0 pb-8">
          <RecipeSidebar {...sidebarProps} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
