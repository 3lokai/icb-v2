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
import type {
  DifficultyLevel,
  RecommendedUse,
} from "@/lib/tools/expert-recipes";

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
};

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

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-3">
        {/* Method */}
        <Select
          value={selectedMethod || "all"}
          onValueChange={(val) =>
            onMethodChange(val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-background">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="v60">V60</SelectItem>
            <SelectItem value="aeropress">AeroPress</SelectItem>
            <SelectItem value="frenchpress">French Press</SelectItem>
            <SelectItem value="chemex">Chemex</SelectItem>
            <SelectItem value="pourover">Pour Over</SelectItem>
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
          <SelectTrigger className="h-10 w-full md:w-[150px] bg-background">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Difficulty</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {/* Use */}
        <Select
          value={selectedUse || "all"}
          onValueChange={(val) =>
            onUseChange(val === "all" ? undefined : (val as RecommendedUse))
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-background">
            <SelectValue placeholder="Recommended Use" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Use</SelectItem>
            <SelectItem value="everyday">Everyday Brew</SelectItem>
            <SelectItem value="competition">Competition</SelectItem>
            <SelectItem value="experiment">Experiment</SelectItem>
          </SelectContent>
        </Select>

        {/* Expert */}
        <Select
          value={selectedExpert || "all"}
          onValueChange={(val) =>
            onExpertChange(val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="h-10 w-full md:w-[180px] bg-background">
            <SelectValue placeholder="Expert" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experts</SelectItem>
            <SelectItem value="James Hoffmann">James Hoffmann</SelectItem>
            <SelectItem value="Tetsu Kasuya">Tetsu Kasuya</SelectItem>
            <SelectItem value="Scott Rao">Scott Rao</SelectItem>
            <SelectItem value="Carolina Ibarra Garay">
              Carolina Ibarra Garay
            </SelectItem>
            <SelectItem value="George Stanica">George Stanica</SelectItem>
            <SelectItem value="Intelligentsia Coffee">
              Intelligentsia Coffee
            </SelectItem>
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
