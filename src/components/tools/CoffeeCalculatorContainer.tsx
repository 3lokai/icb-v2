// src/components/tools/CoffeeCalculatorContainer.tsx
"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { trackToolsEngagement } from "@/lib/analytics/enhanced-tracking";
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

  // Analytics tracking
  useEffect(() => {
    const startTime = Date.now();

    // Track calculator tool entry
    trackToolsEngagement("calculator", {
      sessionDuration: 0,
      interactionCount: 0,
      completionStatus: "started",
    });

    return () => {
      const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
      if (sessionDuration > 30) {
        // Only track meaningful engagement
        trackToolsEngagement("calculator", {
          sessionDuration,
          interactionCount: 1, // Estimate based on calculator usage
          completionStatus: sessionDuration > 300 ? "completed" : "partial",
        });
      }
    };
  }, []);

  // Handle method selection from guide - switches to calculator tab
  const handleMethodSelect = (method: BrewingMethodKey) => {
    setActiveTab("calculator");
    setSelectedBrewingMethod(method);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={className}>
      {/* Glassmorphed Tab Navigation */}
      <div className="mb-8 flex justify-center">
        <div className="surface-1 rounded-2xl p-2">
          <div className="flex gap-2">
            <Button
              className={`group flex items-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 ${
                activeTab === "calculator"
                  ? "scale-[1.02] bg-primary text-primary-foreground shadow-lg"
                  : "hover:scale-[1.02] hover:bg-background/50"
              }`}
              onClick={() => setActiveTab("calculator")}
              variant={activeTab === "calculator" ? "default" : "ghost"}
            >
              <Icon
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                name="Calculator"
              />
              <span className="font-medium">Calculator</span>
              {activeTab === "calculator" && (
                <div className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground" />
              )}
            </Button>
            <Button
              className={`group flex items-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 ${
                activeTab === "guide"
                  ? "scale-[1.02] bg-primary text-primary-foreground shadow-lg"
                  : "hover:scale-[1.02] hover:bg-background/50"
              }`}
              onClick={() => setActiveTab("guide")}
              variant={activeTab === "guide" ? "default" : "ghost"}
            >
              <Icon
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                name="BookOpen"
              />
              <span className="font-medium">Brewing Guide</span>
              {activeTab === "guide" && (
                <div className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground" />
              )}
            </Button>
          </div>
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
