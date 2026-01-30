"use client";

import type { CoffeeDetail } from "@/types/coffee-types";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { SensoryRadarChart } from "./SensoryRadarChart";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

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
    <Section
      contained={false}
      className={cn("border-t border-border/60", className)}
    >
      <Stack gap="6">
        <div>
          <div className="inline-flex items-center gap-4 mb-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.2em]">
              Taste Experience
            </span>
          </div>
          <h2 className="text-title text-balance leading-[1.1] tracking-tight font-serif italic">
            Flavor <span className="text-accent">Profile.</span>
          </h2>
          <p className="text-body text-muted-foreground leading-relaxed max-w-2xl mt-4">
            Our sensory profile maps the defining characteristics of this
            coffee, helping you understand its unique character and choose the
            perfect bean for your palate.
          </p>
        </div>

        {/* Sensory Radar Chart */}
        <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-accent/[0.02] border border-accent/5">
          {hasSensory && coffee.sensory ? (
            <SensoryRadarChart
              data={{
                acidity: coffee.sensory.acidity,
                sweetness: coffee.sensory.sweetness,
                body: coffee.sensory.body,
                bitterness: coffee.sensory.bitterness,
                clarity: coffee.sensory.clarity,
              }}
              size={280}
            />
          ) : (
            <div className="flex h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-muted/30 p-8 text-center">
              <Icon
                name="Coffee"
                size={32}
                className="text-muted-foreground/40 mb-3"
              />
              <span className="text-body text-muted-foreground">
                Sensory mapping not yet available for this release.
              </span>
            </div>
          )}
        </div>

        {/* Flavor Notes */}
        <Stack gap="3">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-6 bg-accent/40" />
            <span className="text-label text-muted-foreground uppercase tracking-widest font-bold">
              Tasting Notes
            </span>
          </div>
          {hasFlavorNotes ? (
            <div className="flex flex-wrap gap-2">
              {coffee.flavor_notes.map((note) => (
                <div
                  key={note.id}
                  className="px-3 py-1.5 rounded-full border border-border/60 bg-card text-label font-medium hover:border-accent/40 transition-colors"
                >
                  {note.label}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-body text-muted-foreground italic">
              Specific flavor notes haven't been cataloged yet.
            </span>
          )}
        </Stack>
      </Stack>
    </Section>
  );
}
