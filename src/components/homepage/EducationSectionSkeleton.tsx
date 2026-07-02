import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the list-column + carousel-card layout.
 * Kept in its own file so statically importing it doesn't drag EducationContent's
 * motion/react + Carousel usage into the eagerly-loaded route bundle. */
export function EducationSectionSkeleton() {
  return (
    <Section id="learn" spacing="loose" ground="warm">
      <div className="relative mx-auto max-w-6xl w-full">
        <Stack gap="12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <Stack gap="12">
                <Stack gap="6">
                  <Skeleton className="h-10 w-full max-w-md" />
                  <Skeleton className="h-6 w-full max-w-xl" />
                </Stack>
                <div className="flex flex-col gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-0.5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-11 w-56" />
              </Stack>
            </div>
            <div className="relative order-2">
              <Skeleton className="mx-auto aspect-square w-full max-w-[540px] rounded-2xl" />
            </div>
          </div>
        </Stack>
      </div>
    </Section>
  );
}
