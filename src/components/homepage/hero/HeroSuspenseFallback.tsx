import { HERO_SEGMENT_FALLBACK } from "@/lib/data/fetch-hero-segment";
import { HeroPrimaryEyebrow, HeroPrimaryHeadline } from "./HeroPrimaryCopy";

/**
 * Contentful Suspense fallback for the homepage hero.
 *
 * Uses discovery copy from {@link HERO_SEGMENT_FALLBACK} so FCP can fire on the
 * immediately flushed shell (pulse-only placeholders are not contentful).
 * Anonymous discovery visitors see no headline/subhead swap when HeroSection streams in.
 */
export function HeroSuspenseFallback() {
  const hero = HERO_SEGMENT_FALLBACK;

  return (
    <section className="relative flex min-h-[90svh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-4 md:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 bg-black/70" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
          <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
            <HeroPrimaryEyebrow hero={hero} />
          </div>

          <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-2">
            <HeroPrimaryHeadline hero={hero} />
          </div>

          <div className="order-4 min-h-[200px] min-w-0 rounded-2xl border border-white/10 bg-white/5 lg:order-none lg:col-start-2 lg:row-start-2 lg:self-start" />

          <div className="order-3 flex min-w-0 flex-wrap gap-3 lg:col-start-1 lg:row-start-3 lg:mt-4">
            <div className="h-11 w-44 animate-pulse rounded-lg bg-white/15" />
            <div className="h-11 w-40 animate-pulse rounded-lg bg-white/10" />
          </div>

          <div className="order-5 mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-6 lg:col-span-2 lg:row-start-4 lg:mt-16">
            <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
