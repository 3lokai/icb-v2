// src/components/tools/calculator/MethodSelector.tsx

import { Label } from "@/components/ui/label";
import {
  BREWING_METHODS_ARRAY,
  type BrewingMethodKey,
} from "@/lib/tools/brewing-guide";
import { cn } from "@/lib/utils";

type MethodSelectorProps = {
  value: BrewingMethodKey | null;
  onChange: (method: BrewingMethodKey) => void;
  className?: string;
};

export function MethodSelector({
  value,
  onChange,
  className,
}: MethodSelectorProps) {
  return (
    <div className={className}>
      <fieldset>
        <legend className="sr-only">Select brewing method</legend>
        <Label className="mb-1 block font-medium text-caption">
          Brewing method
        </Label>
        <p className="mb-4 normal-case! text-overline text-muted-foreground">
          Determines the ratio, temperature, and timer below
        </p>
        <div className="flex flex-wrap gap-2">
          {BREWING_METHODS_ARRAY.map((method) => {
            const active = method.id === value;
            return (
              <button
                aria-pressed={active}
                className={cn(
                  "h-10 whitespace-nowrap rounded-full border px-4 text-caption transition-colors duration-150",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/50 bg-background text-foreground hover:bg-muted/50"
                )}
                key={method.id}
                onClick={() => onChange(method.id)}
                type="button"
              >
                {method.name}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
