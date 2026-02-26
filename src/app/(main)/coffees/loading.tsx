import { CoffeesPageContentSkeleton } from "@/components/coffees/CoffeesPageContentSkeleton";

/**
 * Route-level loading UI for /coffees.
 * Same skeleton as Suspense fallback to prevent CLS on navigation.
 */
export default function CoffeesLoading() {
  return <CoffeesPageContentSkeleton />;
}
