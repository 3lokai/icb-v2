import { Stack } from "@/components/primitives/stack";
import { HeroVideoBackground } from "./HeroVideoBackground";

/**
 * Placeholder while PostHog feature flag variant loads (avoids layout shift).
 */
export function HeroSkeleton() {
  return (
    <section className="relative flex min-h-[90dvh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-6 sm:px-12 md:px-24">
      <HeroVideoBackground />

      <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/80 via-black/40 to-black/60" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.3)_0%,transparent_70%)]" />

      <div className="hero-content relative z-10 w-full max-w-2xl text-left">
        <Stack gap="8">
          <div className="flex justify-center">
            <div className="h-8 w-64 max-w-full animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="space-y-4">
            <div className="mx-auto h-12 w-full max-w-lg animate-pulse rounded-lg bg-white/10" />
            <div className="mx-auto h-6 w-full max-w-md animate-pulse rounded-lg bg-white/5" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-11 w-44 animate-pulse rounded-lg bg-white/15" />
              <div className="h-11 w-40 animate-pulse rounded-lg bg-white/10" />
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </Stack>
      </div>
    </section>
  );
}
