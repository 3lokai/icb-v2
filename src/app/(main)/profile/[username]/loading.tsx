import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Profile route loading: in-flow skeleton reserves height,
 * Lottie overlay keeps the familiar loading UX.
 */
export default function ProfileLoading() {
  return (
    <>
      <div className="space-y-8" aria-hidden="true">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-48 w-full" />
      </div>
      <LoadingOverlay text="Loading profile..." />
    </>
  );
}
