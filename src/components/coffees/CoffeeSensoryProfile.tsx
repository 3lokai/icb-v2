"use client";

import type { CoffeeDetail } from "@/types/coffee-types";
import Tag, { TagList } from "@/components/common/Tag";
import { Stack } from "@/components/primitives/stack";
import { SensoryRadarChart } from "./SensoryRadarChart";
import { cn } from "@/lib/utils";

type CoffeeSensoryProfileProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeSensoryProfile({
  coffee,
  className,
}: CoffeeSensoryProfileProps) {
  const hasSensory =
    coffee.sensory &&
    (coffee.sensory.acidity !== null ||
      coffee.sensory.sweetness !== null ||
      coffee.sensory.body !== null ||
      coffee.sensory.bitterness !== null ||
      coffee.sensory.clarity !== null);

  const hasFlavorNotes = coffee.flavor_notes.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <Stack gap="6">
        <div>
          <div className="inline-flex items-center gap-4 mb-3">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              Taste Experience
            </span>
          </div>
          <h2 className="text-title text-balance leading-[1.1] tracking-tight">
            Flavor <span className="text-accent italic">Profile.</span>
          </h2>
        </div>

        <Stack gap="8">
          {/* Sensory Radar Chart */}
          <div className="flex flex-col items-center justify-start">
            {hasSensory && coffee.sensory ? (
              <SensoryRadarChart
                data={{
                  acidity: coffee.sensory.acidity,
                  sweetness: coffee.sensory.sweetness,
                  body: coffee.sensory.body,
                  bitterness: coffee.sensory.bitterness,
                  clarity: coffee.sensory.clarity,
                }}
                size={240}
              />
            ) : (
              <div className="flex h-[240px] w-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30">
                <span className="text-body text-muted-foreground">
                  Sensory data not available
                </span>
              </div>
            )}
          </div>

          {/* Flavor Notes */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-4 mb-3">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Tasting Notes
                </span>
              </div>
              <h3 className="text-title text-balance leading-[1.1] tracking-tight">
                Flavor <span className="text-accent italic">Notes.</span>
              </h3>
            </div>
            {hasFlavorNotes ? (
              <TagList>
                {coffee.flavor_notes.map((note) => (
                  <Tag key={note.id} variant="outline">
                    {note.label}
                  </Tag>
                ))}
              </TagList>
            ) : (
              <span className="text-body text-muted-foreground">
                Flavor notes not available
              </span>
            )}
          </div>
        </Stack>
      </Stack>
    </div>
  );
}
