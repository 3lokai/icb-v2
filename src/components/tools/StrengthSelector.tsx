// src/components/tools/calculator/StrengthSelector.tsx

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { StrengthLevel } from "@/lib/tools/brewing-guide";
import { SelectorBase } from "./SelectorBase";

type StrengthSelectorProps = {
  value: StrengthLevel;
  onChange: (strength: StrengthLevel) => void;
  className?: string;
  isCompleted?: boolean;
};

export function StrengthSelector({
  value,
  onChange,
  className,
  isCompleted,
}: StrengthSelectorProps) {
  const strengthOptions = [
    {
      value: "mild" as const,
      label: "Mild",
      description: "Mild & smooth",
      icon: "Circle",
      intensity: 1,
    },
    {
      value: "average" as const,
      label: "Medium",
      description: "Balanced",
      icon: "CircleHalf",
      intensity: 2,
    },
    {
      value: "robust" as const,
      label: "Robust",
      description: "Bold & intense",
      icon: "CircleFilled",
      intensity: 3,
    },
  ];

  return (
    <SelectorBase
      className={className}
      isCompleted={isCompleted}
      labelId="strength-selector"
      labelText="What is your desired coffee strength?"
      legend="Step 3 of 4: Select Brew Strength"
      stepNumber={3}
    >
      <RadioGroup
        className="flex gap-2"
        onValueChange={(val) => onChange(val as StrengthLevel)}
        value={value}
      >
        {strengthOptions.map((option) => (
          <div className="flex-1" key={option.value}>
            <Label
              className={`group flex h-full cursor-pointer flex-col items-center rounded-lg border-2 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                value === option.value
                  ? "scale-[1.02] border-primary/50 bg-primary/10 shadow-sm"
                  : "border-border/50 bg-background/30 hover:border-border hover:bg-background/50"
              }
              `}
              htmlFor={option.value}
            >
              <RadioGroupItem
                className="sr-only"
                id={option.value}
                value={option.value}
              />

              {/* Strength indicator dots */}
              <div className="mb-2 flex items-center gap-1">
                {[1, 2, 3].map((dot) => {
                  const isActive = dot <= option.intensity;
                  const isSelected = value === option.value;
                  let dotClassName =
                    "h-2 w-2 rounded-full transition-all duration-300";

                  if (isActive) {
                    dotClassName += isSelected
                      ? " scale-110 bg-primary"
                      : " bg-accent/70";
                  } else {
                    dotClassName += " bg-muted/30";
                  }

                  return <div className={dotClassName} key={dot} />;
                })}
              </div>

              <span
                className={`font-medium text-caption transition-colors ${
                  value === option.value ? "text-primary" : "text-foreground"
                }`}
              >
                {option.label}
              </span>
              <span className="mt-1 text-center text-muted-foreground text-overline">
                {option.description}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </SelectorBase>
  );
}
