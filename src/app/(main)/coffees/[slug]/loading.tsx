import CoffeeFact from "@/components/common/CoffeeFact";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "@/components/primitives/stack";

/**
 * Loading UI for /coffees/[slug]: your Lottie overlay + in-flow skeleton to prevent CLS.
 * The skeleton reserves layout space; the overlay shows the preferred design until the page resolves.
 */
export default function Loading() {
  return (
    <>
      {/* In-flow skeleton: reserves space so when overlay unmounts, no layout jump (CLS fix) */}
      <div className="w-full max-w-2xl mx-auto px-4 py-12" aria-hidden="true">
        <Skeleton className="h-9 w-3/4 max-w-md mb-2" />
        <Skeleton className="h-5 w-full max-w-lg mb-8" />
        <ul className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <Skeleton className="h-14 w-full rounded-md" />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
        </div>
      </div>

      {/* Your loading design: Lottie spinner + coffee fact + tagline (fixed overlay) */}
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-6 z-50">
        <div className="mx-auto text-center">
          <Stack gap="12" className="items-center">
            <LoadingSpinner size="lg" text="Grinding the details..." />

            <div className="relative w-full overflow-hidden pt-12">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-accent/40" />
              <CoffeeFact />
            </div>

            <p className="text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic">
              Quality takes time. One bean at a time.
            </p>
          </Stack>
        </div>
      </div>
    </>
  );
}
