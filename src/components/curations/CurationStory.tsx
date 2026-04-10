"use client";

import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import { Curator } from "./types";

type CurationStoryProps = {
  curator: Curator;
};

export function CurationStory({ curator }: CurationStoryProps) {
  if (!curator.story && !curator.philosophy) return null;

  return (
    <section className="pt-8 pb-16 md:pt-10 md:pb-24 bg-accent/[0.02]">
      <div className="mx-auto max-w-4xl w-full px-4 md:px-6 lg:px-8">
        <Stack gap="12">
          <Stack gap="2">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                The perspective
              </span>
            </div>
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              Beyond the <span className="text-accent italic">bean.</span>
            </h2>
          </Stack>

          {/* Grid: Story & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {curator.story && (
              <Stack gap="6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon name="BookOpen" size={20} />
                  </div>
                  <h3 className="text-label font-bold uppercase tracking-tight">
                    The story
                  </h3>
                </div>
                <div>
                  <p className="text-body-large text-muted-foreground leading-relaxed font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left">
                    {curator.story}
                  </p>
                </div>
              </Stack>
            )}

            {curator.philosophy && (
              <Stack gap="6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon name="Lightbulb" size={20} />
                  </div>
                  <h3 className="text-label font-bold uppercase tracking-tight">
                    Philosophy
                  </h3>
                </div>
                <div className="bg-card/50 border border-border/40 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                  <p className="text-body-large text-foreground font-serif italic leading-relaxed relative z-10">
                    &quot;{curator.philosophy}&quot;
                  </p>
                  <Icon
                    name="Quotes"
                    size={48}
                    className="absolute bottom-6 right-8 text-accent/5 rotate-0 z-0"
                  />
                </div>
              </Stack>
            )}
          </div>
        </Stack>
      </div>
    </section>
  );
}
