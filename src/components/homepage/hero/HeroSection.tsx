// Server component: totals + hero segment for SSR copy and panel.
import { fetchPublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import { fetchHeroSegment } from "@/lib/data/fetch-hero-segment";
import { HeroControl } from "./HeroControl";

type HeroSectionProps = {
  /** Raw `heroSegment` query string (development preview only) */
  devSegmentParam?: string | null;
};

export default async function HeroSection({
  devSegmentParam,
}: HeroSectionProps = {}) {
  const [totals, hero] = await Promise.all([
    fetchPublicDirectoryTotals(),
    fetchHeroSegment({ devSegmentParam: devSegmentParam ?? null }),
  ]);

  return <HeroControl hero={hero} totals={totals} />;
}
