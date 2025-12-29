import CoffeeFact from "@/components/common/CoffeeFact";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Stack } from "@/components/primitives/stack";

export default function NotificationsLoading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background p-6">
      <div className="mx-auto max-w-2xl text-center">
        <Stack gap="12" className="items-center">
          <LoadingSpinner size="lg" text="Fetching your notifications..." />

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
  );
}
