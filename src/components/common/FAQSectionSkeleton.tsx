import { Section } from "@/components/primitives/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching FAQSection's header + accordion-row layout.
 * Server-renderable — kept in its own file so statically importing it doesn't
 * drag FAQ.tsx's motion/react + Accordion usage into the eagerly-loaded route bundle. */
export function FAQSectionSkeleton() {
  return (
    <Section spacing="loose">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-b border-border/40 pb-7 md:grid-cols-12">
          <div className="md:col-span-8 flex flex-col gap-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl surface-1 rounded-2xl px-5 md:px-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="my-4 h-6 w-full max-w-md rounded" />
        ))}
      </div>
    </Section>
  );
}
