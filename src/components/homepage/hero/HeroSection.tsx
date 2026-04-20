// Server component: totals + hero segment for SSR copy and panel.
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import { fetchPublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import {
  fetchHeroSegment,
  HERO_SEGMENT_FALLBACK,
} from "@/lib/data/fetch-hero-segment";
import type { HeroSegmentPayload } from "@/types/hero-segment";
import { HeroControl } from "./HeroControl";

/** When `fetchPublicDirectoryTotals` fails, show neutral counts (hero uses `HERO_SEGMENT_FALLBACK`). */
const TOTALS_FALLBACK: PublicDirectoryTotals = { coffees: 0, roasters: 0 };

type HeroSectionProps = {
  /** Raw `heroSegment` query string (development preview only) */
  devSegmentParam?: string | null;
};

/**
 * Loads directory totals and hero personalization in parallel. On failure, degrades to
 * discovery-style defaults so the homepage still renders; errors are still logged.
 * (Uncaught errors would also reach `src/app/error.tsx`, but we avoid a full error UI for partial fetch failures.)
 */
export default async function HeroSection({
  devSegmentParam,
}: HeroSectionProps = {}) {
  let totals: PublicDirectoryTotals;
  let hero: HeroSegmentPayload;

  try {
    [totals, hero] = await Promise.all([
      fetchPublicDirectoryTotals(),
      fetchHeroSegment({ devSegmentParam: devSegmentParam ?? null }),
    ]);
  } catch (e) {
    console.error(
      "[HeroSection] fetchPublicDirectoryTotals / fetchHeroSegment",
      e
    );
    totals = TOTALS_FALLBACK;
    hero = { ...HERO_SEGMENT_FALLBACK };
  }

  return <HeroControl hero={hero} totals={totals} />;
}
