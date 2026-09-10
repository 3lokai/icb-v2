import CoffeeFact from "@/components/common/CoffeeFact";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Stack } from "@/components/primitives/stack";

type LoadingOverlayProps = {
  text?: string;
};

/**
 * Fixed Lottie loading overlay. Pair with an in-flow skeleton sibling so
 * document height is reserved (footer CLS) while the familiar spinner shows.
 */
export function LoadingOverlay({ text = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6">
      {/* Declared width, not content-derived: with only `mx-auto` this column
          sized to its widest child, and measured a 251px→1333px horizontal jump
          on /roasters at desktop widths (CLS 0.26 — the desktop-only residual;
          mobile never hit it because the column is viewport-wide there). */}
      <div className="mx-auto w-full max-w-md text-center">
        <Stack gap="12" className="items-center">
          <LoadingSpinner size="xl" text={text} />

          {/* Reserve stable space: CoffeeFact renders null on first paint then
              pops in a variable-height card post-mount. */}
          <div className="relative w-full overflow-hidden pt-12 min-h-[320px]">
            <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-accent/40" />
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
