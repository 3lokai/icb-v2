// src/components/tools/calculator/StrengthSelector.tsx

import { Label } from "@/components/ui/label";
import type { StrengthLevel } from "@/lib/tools/brewing-guide";
import { cn } from "@/lib/utils";

type StrengthSelectorProps = {
  value: StrengthLevel;
  onChange: (strength: StrengthLevel) => void;
  className?: string;
};

const STRENGTH_OPTIONS: { value: StrengthLevel; label: string }[] = [
  { value: "mild", label: "Mild" },
  { value: "average", label: "Medium" },
  { value: "robust", label: "Robust" },
];

export function StrengthSelector({
  value,
  onChange,
  className,
}: StrengthSelectorProps) {
  return (
    <div className={className}>
      <fieldset>
        <legend className="sr-only">Select brew strength</legend>
        <Label className="mb-1 block font-medium text-caption">Strength</Label>
        <p className="mb-3 normal-case! text-overline text-muted-foreground">
          Changes the coffee-to-water ratio
        </p>
        <div className="flex gap-2">
          {STRENGTH_OPTIONS.map((option) => (
            <button
              aria-pressed={value === option.value}
              className={cn(
                "h-10 flex-1 rounded-lg border font-medium text-caption transition-colors duration-150",
                value === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/50 bg-background text-foreground hover:bg-muted/50"
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
