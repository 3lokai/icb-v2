import { Stack } from "@/components/primitives/stack";
import { Curator } from "./types";

type CurationHeaderProps = {
  title: string;
  subtitle: string;
  curator: Curator;
};

export function CurationHeader({ title, subtitle }: CurationHeaderProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  CURATION
                </span>
              </div>
              <h1 className="text-hero text-balance leading-[1.1] tracking-tight">
                {title.split(" × ").map((part, i) => (
                  <span key={part}>
                    {i > 0 && <span className="text-accent/60 mx-2">×</span>}
                    {part}
                  </span>
                ))}
              </h1>
              <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed font-serif italic">
                &quot;{subtitle}&quot;
              </p>
            </Stack>
          </div>
        </div>
      </div>
    </section>
  );
}
