// src/components/tools/CoffeeCalculatorContainer.tsx
"use client";

import { useState } from "react";
import { BookOpenIcon, CalculatorIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BrewingMethodKey } from "@/lib/tools/brewing-guide";
// Import our components
import { CoffeeCalculator } from "./CoffeeCalculator";
import { MethodGuide } from "./MethodGuide";

type TabType = "calculator" | "guide";

type CoffeeCalculatorContainerProps = {
  defaultTab?: TabType;
  className?: string;
};

export function CoffeeCalculatorContainer({
  defaultTab = "calculator",
  className,
}: CoffeeCalculatorContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [selectedBrewingMethod, setSelectedBrewingMethod] = useState<
    BrewingMethodKey | undefined
  >(undefined);

  // Handle method selection from guide - switches to calculator tab
  const handleMethodSelect = (method: BrewingMethodKey) => {
    setActiveTab("calculator");
    setSelectedBrewingMethod(method);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={className}>
      {/* Clean Tab Navigation */}
      <div className="mb-8">
        <div className="flex justify-center">
          <Cluster gap="2" className="bg-muted p-1 rounded-xl inline-flex">
            <Button
              className={cn(
                "rounded-lg px-6 transition-colors duration-200",
                activeTab === "calculator"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              onClick={() => setActiveTab("calculator")}
              variant="ghost"
              size="default"
            >
              <Cluster gap="2" align="center">
                <Icon className="h-4 w-4" icon={CalculatorIcon} />
                <span className="font-medium">Calculator</span>
              </Cluster>
            </Button>
            <Button
              className={cn(
                "rounded-lg px-6 transition-colors duration-200",
                activeTab === "guide"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              onClick={() => setActiveTab("guide")}
              variant="ghost"
              size="default"
            >
              <Cluster gap="2" align="center">
                <Icon className="h-4 w-4" icon={BookOpenIcon} />
                <span className="font-medium">Brewing Guide</span>
              </Cluster>
            </Button>
          </Cluster>
        </div>
      </div>
      {/* Tab Content with Enhanced Transitions */}
      <div className="transition-opacity duration-500">
        {activeTab === "calculator" && (
          <div className="fade-in animate-in duration-300">
            <CoffeeCalculator initialMethod={selectedBrewingMethod} />
          </div>
        )}

        {activeTab === "guide" && (
          <div className="fade-in animate-in duration-300">
            <MethodGuide onMethodSelect={handleMethodSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
