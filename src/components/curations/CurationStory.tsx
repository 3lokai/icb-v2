"use client";

import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";

type CurationStoryProps = {
  story: string;
  quote?: string;
};

export function CurationStory({ story, quote }: CurationStoryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 py-10 md:py-14">
      <div className="lg:col-span-1 border-l border-accent/20 h-full hidden lg:block" />

      <div className="lg:col-span-7">
        <Stack gap="6">
          <p className="text-body-large text-muted-foreground font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-accent first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            {story}
          </p>
        </Stack>
      </div>

      {quote && (
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="relative p-6 rounded-2xl bg-muted/50 border border-border/40">
            <Icon
              name="Quotes"
              size={28}
              className="absolute -top-3 -left-1 text-accent/20 rotate-180"
            />
            <blockquote className="text-subheading font-serif italic text-accent/80">
              &quot;{quote}&quot;
            </blockquote>
          </div>
        </div>
      )}
    </div>
  );
}
