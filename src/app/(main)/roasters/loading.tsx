import { RoastersPageContentSkeleton } from "@/components/roasters/RoastersPageContentSkeleton";

/**
 * Route-level loading UI for /roasters.
 * Same skeleton as Suspense fallback to prevent CLS on navigation.
 */
export default function RoastersLoading() {
  return <RoastersPageContentSkeleton />;
}
