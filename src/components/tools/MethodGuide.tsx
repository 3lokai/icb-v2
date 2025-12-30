// Enhanced MethodGuide.tsx with Clean Magazine Style
"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
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
      className="card-bordered card-hover hover-lift group relative w-full cursor-pointer overflow-hidden rounded-xl bg-background p-6 text-left transition-all hover:bg-muted/10"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
    >
      <Stack gap="6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon
              className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110"
              name="Coffee"
            />
            <h3 className="text-subheading transition-colors group-hover:text-primary">
              {method.name}
            </h3>
          </div>
          <Badge variant="outline" className="text-overline">
            {method.brewTime}
          </Badge>
        </div>

        <p className="text-muted-foreground text-caption leading-relaxed line-clamp-2">
          {method.description}
        </p>

        {/* Flavor Profile */}
        <div className="rounded-lg bg-muted/30 p-3">
          <Cluster gap="2" align="center">
            <Icon className="h-3.5 w-3.5 text-accent" name="Palette" />
            <span className="font-medium text-accent text-overline">
              Flavor Profile
            </span>
            <span className="text-foreground text-overline italic truncate ml-auto">
              {method.flavorProfile}
            </span>
          </Cluster>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-caption rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ratio</span>
            <span className="font-medium text-primary">
              1:{method.ratios.average}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Grind</span>
            <span className="font-medium text-overline">
              {method.grindSize}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Temp</span>
            <span className="font-medium text-overline">
              {method.temperatures.medium}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium text-overline">{method.brewTime}</span>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Strength Options */}
        <div>
          <h5 className="mb-3 font-medium text-muted-foreground text-overline">
            Strength Ratios
          </h5>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-medium text-amber-600 text-overline">
                1:{method.ratios.mild}
              </span>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-orange-500" />
              <span className="font-bold text-orange-600 text-overline">
                1:{method.ratios.average}
              </span>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-red-500" />
              <span className="font-medium text-red-600 text-overline">
                1:{method.ratios.robust}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="hover-lift group w-full"
          size="sm"
          variant="secondary"
        >
          Use This Method
          <Icon
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            name="ArrowRight"
          />
        </Button>
      </Stack>
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
    <Stack gap="16" className={className}>
      {/* Popular Methods */}
      <section id="popular">
        <Stack gap="8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <Stack gap="4">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    Everyday Essentials
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Popular <span className="text-accent italic">Methods.</span>
                </h2>
              </Stack>
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
        </Stack>
      </section>

      {/* Espresso Methods */}
      <section id="espresso">
        <Stack gap="8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <Stack gap="4">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    High Intensity
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Espresso &{" "}
                  <span className="text-accent italic">Pressure.</span>
                </h2>
              </Stack>
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
        </Stack>
      </section>

      {/* Specialty Methods */}
      <section id="specialty">
        <Stack gap="8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <Stack gap="4">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    Unique Techniques
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Specialty &{" "}
                  <span className="text-accent italic">Traditional.</span>
                </h2>
              </Stack>
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
        </Stack>
      </section>

      {/* Other Methods */}
      {otherMethods.length > 0 && (
        <section id="other">
          <Stack gap="8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-8">
                <Stack gap="4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      More Ways to Brew
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                    Other <span className="text-accent italic">Methods.</span>
                  </h2>
                </Stack>
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
          </Stack>
        </section>
      )}

      {/* Pro Tips Section */}
      <section>
        <div className="card-bordered overflow-hidden rounded-2xl bg-muted/20 p-8 md:p-12">
          <Stack gap="12">
            <div className="text-center">
              <Stack gap="4" className="items-center">
                <Cluster gap="3" align="center" className="justify-center">
                  <Icon className="h-8 w-8 text-accent" name="Lightbulb" />
                  <h2 className="text-title text-primary">Pro Tips</h2>
                </Cluster>
                <div className="h-0.5 w-16 bg-accent" />
              </Stack>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Water Quality */}
              <div className="card-bordered bg-background p-6 rounded-xl border-t-4 border-t-chart-2">
                <Stack gap="3">
                  <h4 className="flex items-center gap-2 font-semibold text-primary">
                    <Icon className="h-4 w-4 text-chart-2" name="Drop" />
                    Water Quality Matters
                  </h4>
                  <p className="text-muted-foreground text-caption leading-relaxed">
                    Use filtered water with 150-300 TDS for optimal extraction.
                    Water temperature should be 90-96°C. If water tastes good to
                    drink, it's good for coffee.
                  </p>
                </Stack>
              </div>

              {/* Coffee Freshness */}
              <div className="card-bordered bg-background p-6 rounded-xl border-t-4 border-t-primary">
                <Stack gap="3">
                  <h4 className="flex items-center gap-2 font-semibold text-primary">
                    <Icon className="h-4 w-4 text-primary" name="Coffee" />
                    Fresh Coffee is Key
                  </h4>
                  <p className="text-muted-foreground text-caption leading-relaxed">
                    Use coffee beans roasted 7-30 days ago. Grind just before
                    brewing for best results. Store beans in airtight container
                    away from light and heat.
                  </p>
                </Stack>
              </div>

              {/* Grind Consistency */}
              <div className="card-bordered bg-background p-6 rounded-xl border-t-4 border-t-accent">
                <Stack gap="3">
                  <h4 className="flex items-center gap-2 font-semibold text-primary">
                    <Icon className="h-4 w-4 text-accent" name="Gear" />
                    Consistent Grind Size
                  </h4>
                  <p className="text-muted-foreground text-caption leading-relaxed">
                    Invest in a quality burr grinder for consistent particle
                    size. Adjust grind size if brew time is too fast (coarser)
                    or slow (finer).
                  </p>
                </Stack>
              </div>

              {/* Timing & Ratios */}
              <div className="card-bordered bg-background p-6 rounded-xl border-t-4 border-t-chart-4">
                <Stack gap="3">
                  <h4 className="flex items-center gap-2 font-semibold text-primary">
                    <Icon className="h-4 w-4 text-chart-4" name="Timer" />
                    Precise Measurements
                  </h4>
                  <p className="text-muted-foreground text-caption leading-relaxed">
                    Use a scale for accuracy. Start with 1:15-1:17 ratios and
                    adjust to taste. Weaker coffee? Increase ratio. Bitter? Try
                    coarser grind or cooler water.
                  </p>
                </Stack>
              </div>
            </div>

            {/* Quick Ratio Reference */}
            <Separator className="bg-border/50" />

            <div>
              <h4 className="mb-6 text-center font-semibold text-primary">
                Quick Ratio Reference
              </h4>
              <div className="grid grid-cols-2 gap-4 text-caption md:grid-cols-4">
                <div className="card-bordered p-4 text-center rounded-lg bg-background hover:border-primary/50 transition-colors">
                  <div className="mb-1 font-medium">Mild</div>
                  <div className="text-muted-foreground">1:16 - 1:18</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-amber-500" />
                </div>
                <div className="card-bordered p-4 text-center rounded-lg bg-background hover:border-primary/50 transition-colors">
                  <div className="mb-1 font-medium">Balanced</div>
                  <div className="text-muted-foreground">1:15 - 1:16</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-orange-500" />
                </div>
                <div className="card-bordered p-4 text-center rounded-lg bg-background hover:border-primary/50 transition-colors">
                  <div className="mb-1 font-medium">Strong</div>
                  <div className="text-muted-foreground">1:12 - 1:15</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-red-500" />
                </div>
                <div className="card-bordered p-4 text-center rounded-lg bg-background hover:border-primary/50 transition-colors">
                  <div className="mb-1 font-medium">Espresso</div>
                  <div className="text-muted-foreground">1:2 - 1:3</div>
                  <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-purple-500" />
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </section>
    </Stack>
  );
}
