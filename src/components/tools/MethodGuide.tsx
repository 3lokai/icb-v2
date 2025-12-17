// Enhanced MethodGuide.tsx with Glassmorphism
"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BREWING_METHODS_ARRAY,
  type BrewingMethodKey,
} from "@/lib/tools/brewing-guide";

type MethodGuideProps = {
  onMethodSelect: (method: BrewingMethodKey) => void;
  className?: string;
};

type MethodCardProps = {
  method: (typeof BREWING_METHODS_ARRAY)[0];
  onSelect: (method: BrewingMethodKey) => void;
};

function MethodCard({ method, onSelect }: MethodCardProps) {
  const handleClick = () => {
    onSelect(method.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(method.id);
    }
  };

  return (
    <button
      className="glass-card card-padding hover-lift group relative w-full cursor-pointer overflow-hidden text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
    >
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-primary/5 blur-xl" />
      <div className="absolute bottom-0 left-0 h-12 w-12 rounded-full bg-accent/5 blur-lg" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110"
              name="Coffee"
            />
            <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
              {method.name}
            </h3>
          </div>
          <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
            {method.brewTime}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed transition-colors group-hover:text-foreground">
          {method.description}
        </p>

        {/* Flavor Profile - Enhanced glass panel */}
        <div className="glass-panel relative overflow-hidden rounded-lg p-3">
          <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-accent/10 blur-lg" />
          <div className="relative z-10">
            <div className="mb-1 flex items-center gap-2">
              <Icon className="h-3 w-3 text-accent" name="Palette" />
              <span className="font-medium text-accent text-xs uppercase tracking-wide">
                Flavor Profile
              </span>
            </div>
            <p className="text-muted-foreground text-xs italic leading-relaxed">
              {method.flavorProfile}
            </p>
          </div>
        </div>

        {/* Quick Stats Grid - Enhanced with glass treatment */}
        <div className="glass-panel relative overflow-hidden rounded-lg p-3">
          <div className="absolute right-0 bottom-0 h-6 w-6 rounded-full bg-primary/5 blur-sm" />
          <div className="relative z-10 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ratio</span>
              <span className="font-medium text-primary">
                1:{method.ratios.average}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Grind</span>
              <span className="font-medium text-xs">{method.grindSize}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Temp</span>
              <span className="font-medium text-xs">
                {method.temperatures.medium}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-xs">{method.brewTime}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Strength Options - Enhanced */}
        <div>
          <h5 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Strength Ratios
          </h5>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-medium text-amber-600 text-xs">
                1:{method.ratios.mild}
              </span>
              <div className="text-muted-foreground text-xs">Mild</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-orange-500" />
              <span className="font-bold text-orange-600 text-xs">
                1:{method.ratios.average}
              </span>
              <div className="text-muted-foreground text-xs">Perfect</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-red-500" />
              <span className="font-medium text-red-600 text-xs">
                1:{method.ratios.robust}
              </span>
              <div className="text-muted-foreground text-xs">Strong</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="glass-button hover-lift group w-full" size="sm">
          Use This Method
          <Icon
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            name="ArrowRight"
          />
        </Button>
      </div>
    </button>
  );
}

export function MethodGuide({ onMethodSelect, className }: MethodGuideProps) {
  // Group methods with max 2 per row for better readability
  const popularMethods = BREWING_METHODS_ARRAY.filter((method) =>
    [
      "pourover",
      "v60",
      "kalitawave",
      "frenchpress",
      "chemex",
      "aeropress",
    ].includes(method.id)
  );

  const espressoMethods = BREWING_METHODS_ARRAY.filter((method) =>
    ["espresso", "mokapot"].includes(method.id)
  );

  const specialtyMethods = BREWING_METHODS_ARRAY.filter((method) =>
    ["coldbrew", "siphon", "turkish", "southindianfilter"].includes(method.id)
  );

  const otherMethods = BREWING_METHODS_ARRAY.filter((method) =>
    ["autodrip"].includes(method.id)
  );

  return (
    <div className={className}>
      {/* Popular Methods */}
      <section className="mb-16" id="popular">
        <div className="glass-panel relative mb-8 overflow-hidden rounded-2xl p-6">
          <div className="absolute top-0 right-0 h-20 w-20 animate-float rounded-full bg-primary/10 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Icon className="h-6 w-6 text-primary" name="Coffee" />
              <h2 className="font-bold text-2xl text-primary">
                Popular Methods
              </h2>
              <Badge className="badge bg-accent/90 text-accent-foreground text-xs">
                Most Used
              </Badge>
            </div>
            <div className="h-1 w-16 rounded-full bg-accent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {popularMethods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              onSelect={onMethodSelect}
            />
          ))}
        </div>
      </section>

      {/* Espresso Methods */}
      <section className="mb-16" id="espresso">
        <div className="glass-panel relative mb-8 overflow-hidden rounded-2xl p-6">
          <div className="absolute top-0 left-0 h-20 w-20 animate-float rounded-full bg-accent/10 blur-2xl delay-300" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Icon className="h-6 w-6 text-accent" name="Gear" />
              <h2 className="font-bold text-2xl text-primary">
                Espresso & Pressure
              </h2>
              <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                High Intensity
              </Badge>
            </div>
            <div className="h-1 w-16 rounded-full bg-accent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {espressoMethods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              onSelect={onMethodSelect}
            />
          ))}
        </div>
      </section>

      {/* Specialty Methods */}
      <section className="mb-16" id="specialty">
        <div className="glass-panel relative mb-8 overflow-hidden rounded-2xl p-6">
          <div className="absolute right-0 bottom-0 h-20 w-20 animate-float rounded-full bg-chart-2/10 blur-2xl delay-700" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Icon className="h-6 w-6 text-chart-2" name="Drop" />
              <h2 className="font-bold text-2xl text-primary">
                Specialty & Traditional
              </h2>
              <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                Unique Techniques
              </Badge>
            </div>
            <div className="h-1 w-16 rounded-full bg-accent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {specialtyMethods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              onSelect={onMethodSelect}
            />
          ))}
        </div>
      </section>

      {/* Other Methods */}
      {otherMethods.length > 0 && (
        <section className="mb-16" id="other">
          <div className="glass-panel relative mb-8 overflow-hidden rounded-2xl p-6">
            <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-muted/10 blur-xl" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <Icon className="h-6 w-6 text-muted-foreground" name="Coffee" />
                <h2 className="font-bold text-2xl text-primary">
                  Other Methods
                </h2>
              </div>
              <div className="h-1 w-16 rounded-full bg-accent" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {otherMethods.map((method) => (
              <MethodCard
                key={method.id}
                method={method}
                onSelect={onMethodSelect}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pro Tips Section - Enhanced glass modal */}
      <section>
        <div className="glass-modal card-padding relative overflow-hidden rounded-3xl">
          {/* Enhanced decorative elements */}
          <div className="absolute top-0 right-0 h-32 w-32 animate-float rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 animate-float rounded-full bg-primary/20 blur-2xl delay-500" />
          <div className="absolute top-1/2 left-1/3 h-16 w-16 animate-float rounded-full bg-chart-2/10 blur-xl delay-1000" />

          <div className="relative z-10">
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <Icon className="h-8 w-8 text-accent" name="Lightbulb" />
                <h2 className="font-bold text-2xl text-primary">Pro Tips</h2>
              </div>
              <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Water Quality */}
              <div className="glass-card card-padding relative overflow-hidden">
                <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-chart-2/10 blur-lg" />
                <div className="relative z-10">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <Icon className="h-4 w-4 text-chart-2" name="Drop" />
                    Water Quality Matters
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Use filtered water with 150-300 TDS for optimal extraction.
                    Water temperature should be 90-96°C. If water tastes good to
                    drink, it's good for coffee.
                  </p>
                </div>
              </div>

              {/* Coffee Freshness */}
              <div className="glass-card card-padding relative overflow-hidden">
                <div className="absolute top-0 left-0 h-12 w-12 rounded-full bg-primary/10 blur-lg" />
                <div className="relative z-10">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <Icon className="h-4 w-4 text-primary" name="Coffee" />
                    Fresh Coffee is Key
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Use coffee beans roasted 7-30 days ago. Grind just before
                    brewing for best results. Store beans in airtight container
                    away from light and heat.
                  </p>
                </div>
              </div>

              {/* Grind Consistency */}
              <div className="glass-card card-padding relative overflow-hidden">
                <div className="absolute right-0 bottom-0 h-10 w-10 rounded-full bg-accent/10 blur-sm" />
                <div className="relative z-10">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <Icon
                      className="h-4 w-4 text-muted-foreground"
                      name="Gear"
                    />
                    Consistent Grind Size
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Invest in a quality burr grinder for consistent particle
                    size. Adjust grind size if brew time is too fast (coarser)
                    or slow (finer).
                  </p>
                </div>
              </div>

              {/* Timing & Ratios */}
              <div className="glass-card card-padding relative overflow-hidden">
                <div className="absolute top-0 right-0 h-10 w-10 rounded-full bg-chart-4/10 blur-sm" />
                <div className="relative z-10">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <Icon
                      className="h-4 w-4 text-muted-foreground"
                      name="Timer"
                    />
                    Precise Measurements
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Use a scale for accuracy. Start with 1:15-1:17 ratios and
                    adjust to taste. Weaker coffee? Increase ratio. Bitter? Try
                    coarser grind or cooler water.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Ratio Reference */}
            <Separator className="my-8 bg-border/50" />

            <div>
              <h4 className="mb-6 text-center font-semibold text-primary">
                Quick Ratio Reference
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div className="glass-card card-padding group text-center transition-all duration-300 hover:scale-[1.02]">
                  <div className="mb-1 font-medium transition-colors group-hover:text-primary">
                    Mild
                  </div>
                  <div className="text-muted-foreground">1:16 - 1:18</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-amber-500" />
                </div>
                <div className="glass-card card-padding group text-center transition-all duration-300 hover:scale-[1.02]">
                  <div className="mb-1 font-medium transition-colors group-hover:text-primary">
                    Balanced
                  </div>
                  <div className="text-muted-foreground">1:15 - 1:16</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-orange-500" />
                </div>
                <div className="glass-card card-padding group text-center transition-all duration-300 hover:scale-[1.02]">
                  <div className="mb-1 font-medium transition-colors group-hover:text-primary">
                    Strong
                  </div>
                  <div className="text-muted-foreground">1:12 - 1:15</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-red-500" />
                </div>
                <div className="glass-card card-padding group text-center transition-all duration-300 hover:scale-[1.02]">
                  <div className="mb-1 font-medium transition-colors group-hover:text-primary">
                    Espresso
                  </div>
                  <div className="text-muted-foreground">1:2 - 1:3</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
