"use client";

import type { CoffeeDetail } from "@/types/coffee-types";
import { Icon } from "@/components/common/Icon";
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
      <Stack gap="4">
        <div className="flex items-center gap-2">
          <Icon name="SparkleIcon" size={18} className="text-accent" />
          <h2 className="text-subheading">Flavor Profile</h2>
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
            <Stack gap="3">
              <span className="text-caption text-muted-foreground font-medium">
                Flavor Notes
              </span>
              {hasFlavorNotes ? (
                <TagList>
                  {coffee.flavor_notes.map((note) => (
                    <Tag key={note.id} variant="outline" className="text-body">
                      {note.label}
                    </Tag>
                  ))}
                </TagList>
              ) : (
                <span className="text-body text-muted-foreground">
                  Flavor notes not available
                </span>
              )}
            </Stack>
          </div>
        </Stack>
      </Stack>
    </div>
  );
}
