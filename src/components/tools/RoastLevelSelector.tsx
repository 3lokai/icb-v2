// src/components/tools/calculator/RoastLevelSelector.tsx

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RoastLevel } from "@/lib/tools/brewing-guide";
import { SelectorBase } from "./SelectorBase";

type RoastLevelSelectorProps = {
  value: RoastLevel;
  onChange: (roast: RoastLevel) => void;
  className?: string;
  isCompleted?: boolean;
};

export function RoastLevelSelector({
  value,
  onChange,
  className,
  isCompleted,
}: RoastLevelSelectorProps) {
  const roastOptions = [
    {
      value: "light" as const,
      label: "Light Roast",
      description: "Bright & acidic",
      color: "#D2B48C",
      temp: "95-100°C",
    },
    {
      value: "medium" as const,
      label: "Medium Roast",
      description: "Sweet & balanced",
      color: "#8B4513",
      temp: "90-93°C",
    },
    {
      value: "dark" as const,
      label: "Dark Roast",
      description: "Bold & smoky",
      color: "#2F1B14",
      temp: "87-90°C",
    },
  ];

  const selectedRoast = roastOptions.find((r) => r.value === value);

  return (
    <SelectorBase
      className={className}
      isCompleted={isCompleted}
      labelId="roast-level"
      labelText="What is your coffee's roast level?"
      legend="Step 4 of 4: Select Bean Roast level"
      stepNumber={4}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Select roast level"
            className={`h-14 w-full justify-between border backdrop-blur-sm transition-all duration-300 ${
              isCompleted
                ? "border-primary/30 bg-primary/10 shadow-sm"
                : "border-border/50 bg-background/50 hover:bg-background/80"
            }`}
            id="roast-level"
            variant="outline"
          >
            <div className="flex items-center gap-2">
              <Icon
                className={`h-4 w-4 transition-colors ${
                  isCompleted ? "text-primary" : "text-muted-foreground"
                }`}
                name="Fire"
              />
              {selectedRoast ? (
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full border border-border/20 shadow-sm"
                    style={{ backgroundColor: selectedRoast.color }}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{selectedRoast.label}</span>
                    <span className="text-muted-foreground text-overline">
                      {selectedRoast.temp}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  Select roast level
                </span>
              )}
            </div>
            <Icon className="h-4 w-4 opacity-50" name="CaretDown" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          avoidCollisions={true}
          className="w-[var(--radix-dropdown-menu-trigger-width)] border border-border/50 bg-popover/95 shadow-xl backdrop-blur-md"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuRadioGroup
            onValueChange={(val) => onChange(val as RoastLevel)}
            value={value}
          >
            {roastOptions.map((roast) => (
              <DropdownMenuRadioItem
                className="py-4 transition-colors hover:bg-primary/10 focus:bg-primary/10"
                key={roast.value}
                value={roast.value}
              >
                <div className="flex w-full items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" name="Coffee" />
                  <div
                    className="h-4 w-4 rounded-full border border-border/20 shadow-sm"
                    style={{ backgroundColor: roast.color }}
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">{roast.label}</span>
                      <span className="font-medium text-primary text-overline">
                        {roast.temp}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-overline">
                      {roast.description}
                    </span>
                  </div>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SelectorBase>
  );
}
