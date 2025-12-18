// src/components/tools/FilterSection.tsx

import { Icon, type IconName } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";

type FilterItem<T> = {
  value: T;
  label: string;
  icon?: IconName;
  color?: string;
  metadata?: React.ReactNode;
};

type FilterSectionProps<T> = {
  title: string;
  icon: IconName;
  items: FilterItem<T>[];
  selected: T | undefined;
  onSelect: (value: T | undefined) => void;
  blurPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
};

// Helper function for toggle logic
function toggleValue<T>(
  current: T | undefined,
  next: T,
  callback: (val: T | undefined) => void
) {
  callback(current === next ? undefined : next);
}

export function FilterSection<T extends string>({
  title,
  icon,
  items,
  selected,
  onSelect,
  blurPosition = "top-right",
}: FilterSectionProps<T>) {
  const blurClasses = {
    "top-right":
      "absolute top-0 right-0 h-12 w-12 rounded-full bg-primary/5 blur-xl",
    "top-left":
      "absolute top-0 left-0 h-12 w-12 rounded-full bg-accent/5 blur-xl",
    "bottom-right":
      "absolute right-0 bottom-0 h-10 w-10 rounded-full bg-chart-2/5 blur-lg",
    "bottom-left":
      "absolute bottom-0 left-0 h-12 w-12 rounded-full bg-accent/5 blur-xl",
  };

  return (
    <div className="glass-card card-padding relative space-y-4 overflow-hidden">
      <div className={blurClasses[blurPosition]} />
      <div className="relative z-10">
        <h4 className="mb-4 flex items-center gap-2 font-medium text-body text-primary">
          <Icon className="h-4 w-4" name={icon} />
          {title}
        </h4>
        <div className="mb-4 h-1 w-16 rounded-full bg-accent" />
        <div className="space-y-2">
          {items.map((item) => {
            const isSelected = selected === item.value;
            return (
              <Button
                className={`group w-full justify-start text-left transition-all duration-300 ${
                  isSelected
                    ? "scale-[1.02] bg-primary text-primary-foreground shadow-sm"
                    : "hover:scale-[1.02] hover:bg-background/50"
                }`}
                key={item.value}
                onClick={() => toggleValue(selected, item.value, onSelect)}
                size="sm"
                variant={isSelected ? "default" : "ghost"}
              >
                {item.icon && (
                  <Icon
                    className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                    name={item.icon}
                  />
                )}
                {item.color && (
                  <div
                    className={`mr-2 h-3 w-3 rounded-full ${item.color} transition-transform duration-300 group-hover:scale-125`}
                  />
                )}
                <div className="flex flex-col items-start">
                  <span className="font-medium text-caption transition-colors group-hover:text-inherit">
                    {item.label}
                  </span>
                  {item.metadata && (
                    <span className="text-overline opacity-80">
                      {item.metadata}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
