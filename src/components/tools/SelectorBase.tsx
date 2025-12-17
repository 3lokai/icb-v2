// src/components/tools/SelectorBase.tsx

import { Icon } from "@/components/common/Icon";
import { Label } from "@/components/ui/label";

type SelectorBaseProps = {
  stepNumber: number;
  legend: string;
  labelText: string;
  labelId: string;
  isCompleted?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function SelectorBase({
  stepNumber,
  legend,
  labelText,
  labelId,
  isCompleted,
  className,
  children,
}: SelectorBaseProps) {
  return (
    <div className={className}>
      <fieldset>
        <legend className="sr-only">{legend}</legend>
        <Label
          className="mb-3 flex items-center gap-2 font-medium text-sm"
          htmlFor={labelId}
        >
          <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-bold text-xs transition-all duration-300 ${
              isCompleted
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {isCompleted ? (
              <Icon className="h-3 w-3" name="Check" />
            ) : (
              stepNumber
            )}
          </span>
          {labelText}
        </Label>
      </fieldset>
      {children}
    </div>
  );
}
