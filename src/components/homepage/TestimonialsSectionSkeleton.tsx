import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the header + marquee-row-of-cards layout.
 * Kept in its own file so statically importing it doesn't drag TestimonialsSection's
 * Marquee + testimonial data into the eagerly-loaded route bundle. */
export function TestimonialsSectionSkeleton() {
  return (
    <Section
      spacing="default"
      ground="warm"
      title="What Coffee"
      accentWord="Lovers Say."
    >
      <Stack gap="12">
        <Skeleton className="-mt-6 h-5 w-full max-w-2xl" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-80 shrink-0 rounded-xl" />
          ))}
        </div>
      </Stack>
    </Section>
  );
}
