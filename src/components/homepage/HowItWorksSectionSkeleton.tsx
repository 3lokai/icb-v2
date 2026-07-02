import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the header + 3-step icon grid layout.
 * Kept in its own file so statically importing it doesn't drag HowItWorksSection's
 * motion/react usage into the eagerly-loaded route bundle. */
export function HowItWorksSectionSkeleton() {
  return (
    <Section spacing="default">
      <div className="mx-auto max-w-6xl w-full">
        <Stack gap="12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="8">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full max-w-lg" />
                <Skeleton className="h-6 w-full max-w-xl" />
              </Stack>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center md:items-start"
              >
                <Skeleton className="mb-6 h-24 w-24 rounded-2xl" />
                <Skeleton className="mb-4 h-6 w-24" />
                <Skeleton className="h-4 w-full max-w-[280px]" />
              </div>
            ))}
          </div>
        </Stack>
      </div>
    </Section>
  );
}
