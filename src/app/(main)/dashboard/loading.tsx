import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard route loading: in-flow skeleton reserves height (footer CLS),
 * Lottie overlay keeps the familiar loading UX.
 */
export default function DashboardLoading() {
  return (
    <>
      <div className="space-y-8" aria-hidden="true">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>

      <LoadingOverlay text="Brewing your dashboard..." />
    </>
  );
}
