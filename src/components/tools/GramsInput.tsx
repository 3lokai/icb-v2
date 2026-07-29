// src/components/tools/GramsInput.tsx

import { Slider } from "@/components/ui/slider";
import type { BrewingMethod } from "@/lib/tools/brewing-guide";

type GramsInputProps = {
  method: BrewingMethod;
  grams: number;
  onChange: (grams: number) => void;
  className?: string;
};

export function GramsInput({
  method,
  grams,
  onChange,
  className,
}: GramsInputProps) {
  const tbsp = Math.round((grams / 6) * 10) / 10;

  return (
    <div className={className}>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-medium text-caption">Coffee weight</span>
        <span className="normal-case! tabular-nums text-overline text-muted-foreground">
          ≈ {tbsp} tbsp
        </span>
      </div>
      <p className="mb-3 normal-case! text-overline text-muted-foreground">
        Water is calculated from this amount
      </p>

      <div className="py-3 text-center">
        <span className="font-serif text-display leading-none tabular-nums tracking-tight">
          {grams}
        </span>
        <span className="ml-1 font-serif text-subheading text-muted-foreground">
          g
        </span>
      </div>

      <Slider
        aria-label="Coffee weight in grams"
        max={method.maxGrams}
        min={method.minGrams}
        onValueChange={([val]) => onChange(val ?? grams)}
        step={method.stepGrams}
        value={[grams]}
      />

      <div className="mt-2 flex justify-between tabular-nums text-muted-foreground text-overline">
        <span>{method.minGrams}g</span>
        <span>{method.maxGrams}g</span>
      </div>
    </div>
  );
}
