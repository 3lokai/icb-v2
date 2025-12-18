import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertVolume, VOLUME_UNITS } from "@/lib/tools/brewing-guide";

type VolumeUnit = "ml" | "cups" | "oz";

type DrinkSizeInputProps = {
  drinkSize: number;
  calculatedCoffee: number;
  onDrinkSizeChange: (sizeInMl: number) => void;
  className?: string;
  isCompleted?: boolean;
};

const MIN_SIZE_ML = 50;
const MAX_SIZE_ML = 2000;

export function DrinkSizeInput({
  drinkSize,
  onDrinkSizeChange,
  className,
  isCompleted,
}: DrinkSizeInputProps) {
  const [drinkUnit, setDrinkUnit] = useState<VolumeUnit>("ml");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDrinkUnitChange = (newUnit: VolumeUnit) => {
    setDrinkUnit(newUnit);
  };

  const displayDrinkSize = convertVolume(drinkSize, "ml", drinkUnit);

  const validateDrinkSize = (mlValue: number): string | null => {
    if (mlValue < MIN_SIZE_ML) {
      return `Minimum drink size is ${convertVolume(MIN_SIZE_ML, "ml", drinkUnit)} ${VOLUME_UNITS[drinkUnit].abbreviation}`;
    }
    if (mlValue > MAX_SIZE_ML) {
      return `Maximum drink size is ${convertVolume(MAX_SIZE_ML, "ml", drinkUnit)} ${VOLUME_UNITS[drinkUnit].abbreviation}`;
    }
    return null;
  };

  const handleInputChange = (inputValue: number) => {
    const mlValue = convertVolume(inputValue, drinkUnit, "ml");
    const error = validateDrinkSize(mlValue);
    setValidationError(error);

    // Still update the value even if there's an error (allow user to type)
    onDrinkSizeChange(mlValue);
  };

  const hasError = validationError !== null;

  const getInputClassName = () => {
    if (hasError) {
      return "border-destructive/50 bg-destructive/5 focus-visible:ring-destructive/20";
    }
    if (isCompleted) {
      return "border-primary/30 bg-primary/10 shadow-sm";
    }
    return "border-border/50 bg-background/50 hover:bg-background/80";
  };

  const getIconClassName = () => {
    if (hasError) {
      return "text-destructive";
    }
    if (isCompleted) {
      return "text-primary";
    }
    return "text-muted-foreground";
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <fieldset>
            <legend className="sr-only">
              Step 2 of 4: Select Drink Volume
            </legend>
            <Label
              className="flex items-center gap-2 font-medium text-caption"
              htmlFor="drink-size"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-overline transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {isCompleted ? <Icon className="h-3 w-3" name="Check" /> : "2"}
              </span>
              What is your drink size? ({VOLUME_UNITS[drinkUnit].abbreviation})
            </Label>
          </fieldset>

          {/* Enhanced unit switcher with glass treatment */}
          <div className="glass-panel rounded-lg p-1">
            <div className="flex gap-1">
              {Object.keys(VOLUME_UNITS).map((unit) => (
                <Button
                  className={`h-7 px-3 text-overline transition-all duration-300 ${
                    drinkUnit === unit
                      ? "scale-[1.02] bg-primary text-primary-foreground shadow-sm"
                      : "hover:scale-[1.02] hover:bg-background/50"
                  }`}
                  key={unit}
                  onClick={() => handleDrinkUnitChange(unit as VolumeUnit)}
                  size="sm"
                  variant={drinkUnit === unit ? "default" : "ghost"}
                >
                  {VOLUME_UNITS[unit].abbreviation}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mb-2">
          <Input
            className={`h-12 border pr-16 pl-10 text-center font-medium text-subheading backdrop-blur-sm transition-all duration-300 ${getInputClassName()}`}
            id="drink-size"
            max="2000"
            min="50"
            onChange={(e) => {
              const inputValue = Number(e.target.value) || 0;
              handleInputChange(inputValue);
            }}
            placeholder="300"
            type="number"
            value={displayDrinkSize || ""}
          />
          <Icon
            className={`-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transition-colors ${getIconClassName()}`}
            name="Coffee"
          />
          <span className="-translate-y-1/2 absolute top-1/2 right-3 font-medium text-muted-foreground text-caption">
            {VOLUME_UNITS[drinkUnit].abbreviation}
          </span>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-2 text-destructive text-caption backdrop-blur-sm">
            <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" name="Warning" />
            <p>{validationError}</p>
          </div>
        )}

        {/* Helper Text */}
        {!validationError && (
          <p className="mb-3 text-center text-muted-foreground text-overline">
            Valid range: {convertVolume(MIN_SIZE_ML, "ml", drinkUnit)}-
            {convertVolume(MAX_SIZE_ML, "ml", drinkUnit)}{" "}
            {VOLUME_UNITS[drinkUnit].abbreviation}
          </p>
        )}

        {/* Enhanced presets with glass cards */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {(() => {
            let presets: Array<{ label: string; value: number }>;
            if (drinkUnit === "ml") {
              presets = [
                { label: "Small (150ml)", value: 150 },
                { label: "Cup (250ml)", value: 250 },
                { label: "Mug (300ml)", value: 300 },
                { label: "Large (350ml)", value: 350 },
                { label: "Thermos (500ml)", value: 500 },
                { label: "XL (600ml)", value: 600 },
              ];
            } else if (drinkUnit === "cups") {
              presets = [
                { label: "1 Cup", value: 1 },
                { label: "1.5 Cups", value: 1.5 },
                { label: "2 Cups", value: 2 },
                { label: "3 Cups", value: 3 },
                { label: "4 Cups", value: 4 },
                { label: "6 Cups", value: 6 },
              ];
            } else {
              presets = [
                { label: "6 fl oz", value: 6 },
                { label: "8 fl oz", value: 8 },
                { label: "12 fl oz", value: 12 },
                { label: "16 fl oz", value: 16 },
                { label: "20 fl oz", value: 20 },
                { label: "24 fl oz", value: 24 },
              ];
            }

            return presets.map((preset) => {
              const isActive =
                Math.abs(displayDrinkSize - preset.value) <
                (drinkUnit === "cups" ? 0.1 : 1);

              return (
                <Badge
                  className={`cursor-pointer justify-center border px-3 py-2 text-overline backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                      : "border-border/50 bg-background/30 hover:bg-background/50"
                  }`}
                  key={preset.label}
                  onClick={() => {
                    const mlValue = convertVolume(
                      preset.value,
                      drinkUnit,
                      "ml"
                    );
                    onDrinkSizeChange(mlValue);
                  }}
                  variant="outline"
                >
                  {preset.label}
                </Badge>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
