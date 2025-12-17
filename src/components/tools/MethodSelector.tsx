// src/components/tools/calculator/MethodSelector.tsx

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BREWING_METHODS_ARRAY,
  type BrewingMethodKey,
} from "@/lib/tools/brewing-guide";
import { SelectorBase } from "./SelectorBase";

type MethodSelectorProps = {
  value: BrewingMethodKey | null;
  onChange: (method: BrewingMethodKey) => void;
  className?: string;
  isCompleted?: boolean;
};

export function MethodSelector({
  value,
  onChange,
  className,
  isCompleted,
}: MethodSelectorProps) {
  const selectedMethod = BREWING_METHODS_ARRAY.find((m) => m.id === value);

  return (
    <SelectorBase
      className={className}
      isCompleted={isCompleted}
      labelId="brewing-method"
      labelText="What is your brewing method?"
      legend="Step 1 of 4: Select Brewing Method"
      stepNumber={1}
    >
      <DropdownMenu modal={false} open={undefined}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Select brewing method"
            className={`h-12 w-full justify-between border backdrop-blur-sm transition-all duration-300 ${
              isCompleted
                ? "border-primary/30 bg-primary/10 shadow-sm"
                : "border-border/50 bg-background/50 hover:bg-background/80"
            }`}
            id="brewing-method"
            variant="outline"
          >
            <div className="flex items-center gap-2">
              <Icon
                className={`h-4 w-4 transition-colors ${
                  isCompleted ? "text-primary" : "text-muted-foreground"
                }`}
                name="Coffee"
              />
              <span className={value ? "" : "text-muted-foreground"}>
                {selectedMethod?.name || "Select brewing method"}
              </span>
            </div>
            <Icon className="h-4 w-4 opacity-50" name="CaretDown" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          avoidCollisions={true}
          className="max-h-[60vh] w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto border border-border/50 bg-popover/95 shadow-xl backdrop-blur-md [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuRadioGroup
            onValueChange={(val) => onChange(val as BrewingMethodKey)}
            value={value ?? undefined}
          >
            {BREWING_METHODS_ARRAY.map(
              (method: (typeof BREWING_METHODS_ARRAY)[number]) => (
                <DropdownMenuRadioItem
                  className="py-3 transition-colors hover:bg-primary/10 focus:bg-primary/10"
                  key={method.id}
                  value={method.id}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" name="Coffee" />
                    <div className="flex flex-col">
                      <span className="font-medium">{method.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {method.flavorProfile} • {method.grindSize} •{" "}
                        {method.brewTime}
                      </span>
                    </div>
                  </div>
                </DropdownMenuRadioItem>
              )
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SelectorBase>
  );
}
