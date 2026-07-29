// src/components/tools/calculator/RoastLevelSelector.tsx

import { Label } from "@/components/ui/label";
import type { RoastLevel } from "@/lib/tools/brewing-guide";
import { cn } from "@/lib/utils";

type RoastLevelSelectorProps = {
  value: RoastLevel;
  onChange: (roast: RoastLevel) => void;
  className?: string;
};

const ROAST_OPTIONS: {
  value: RoastLevel;
  label: string;
  color: string;
}[] = [
  { value: "light", label: "Light", color: "#D2B48C" },
  { value: "medium", label: "Medium", color: "#8B4513" },
  { value: "dark", label: "Dark", color: "#2F1B14" },
];

export function RoastLevelSelector({
  value,
  onChange,
  className,
}: RoastLevelSelectorProps) {
  return (
    <div className={className}>
      <fieldset>
        <legend className="sr-only">Select roast level</legend>
        <Label className="mb-1 block font-medium text-caption">
          Roast level
        </Label>
        <p className="mb-3 normal-case! text-overline text-muted-foreground">
          Changes the recommended water temperature
        </p>
        <div className="flex gap-2">
          {ROAST_OPTIONS.map((option) => (
            <button
              aria-pressed={value === option.value}
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border font-medium text-caption transition-colors duration-150",
                value === option.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border/50 bg-background text-foreground hover:bg-muted/50"
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-border/20"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
