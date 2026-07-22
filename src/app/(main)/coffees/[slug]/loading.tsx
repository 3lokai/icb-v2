import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for /coffees/[slug]: Lottie overlay + in-flow skeleton to prevent CLS.
 * The skeleton reserves layout space; the overlay shows the preferred design until the page resolves.
 */
export default function Loading() {
  return (
    <>
      {/* In-flow skeleton: reserves space so when overlay unmounts, no layout jump (CLS fix) */}
      <div className="mx-auto w-full max-w-2xl px-4 py-12" aria-hidden="true">
        <Skeleton className="mb-2 h-9 w-3/4 max-w-md" />
        <Skeleton className="mb-8 h-5 w-full max-w-lg" />
        <ul className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <Skeleton className="h-14 w-full rounded-md" />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Skeleton className="h-10 w-full rounded-md sm:w-40" />
          <Skeleton className="h-10 w-full rounded-md sm:w-40" />
        </div>
      </div>

      <LoadingOverlay text="Grinding the details..." />
    </>
  );
}
