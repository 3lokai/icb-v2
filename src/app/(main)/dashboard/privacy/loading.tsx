import CoffeeFact from "@/components/common/CoffeeFact";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Stack } from "@/components/primitives/stack";

export default function PrivacyLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-6 z-50">
      <div className="mx-auto text-center">
        <Stack gap="12" className="items-center">
          <LoadingSpinner size="lg" text="Loading privacy settings..." />

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
