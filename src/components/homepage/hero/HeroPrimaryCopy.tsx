import { Announcement, AnnouncementTitle } from "@/components/ui/announcement";
import { Icon } from "@/components/common/Icon";
import type { IconName } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import type { HeroSegmentPayload } from "@/types/hero-segment";
import type { HeroSegment } from "@/types/hero-segment";
import { getHeroPrimaryCopy } from "./heroCopy";

const EYEBROW_ICON: Record<HeroSegment, IconName> = {
  discovery: "MapPin",
  returning_browser: "ArrowBendUpLeft",
  rating_progress: "Path",
  anon_conversion: "Path",
  authenticated_profile: "UserCircle",
};

type HeroPrimaryCopyProps = {
  hero: HeroSegmentPayload;
};

function getPrimaryCopyParts(hero: HeroSegmentPayload) {
  const copy = getHeroPrimaryCopy(hero.segment, hero.ratingCount, {
    displayNameShort: hero.displayNameShort,
    isAuthenticated: hero.isAuthenticated,
  });
  const iconName = EYEBROW_ICON[hero.segment] ?? "MapPin";
  return { copy, iconName };
}

/**
 * Server component: eyebrow only (for grid row above the headline + context panel).
 */
export function HeroPrimaryEyebrow({ hero }: HeroPrimaryCopyProps) {
  const { copy, iconName } = getPrimaryCopyParts(hero);

  return (
    <div className="flex items-center justify-start">
      <Announcement variant="onMedia">
        <AnnouncementTitle className="gap-2">
          <Icon className="text-accent" name={iconName} size={16} />
          {copy.eyebrow}
        </AnnouncementTitle>
      </Announcement>
    </div>
  );
}

/**
 * Server component: Composes eyebrow and headline for complete hero primary copy.
 */
export function HeroPrimaryHeadline({ hero }: HeroPrimaryCopyProps) {
  const { copy } = getPrimaryCopyParts(hero);

  return (
    <div className="lcp-optimized min-w-0 lg:mt-6">
      <Stack gap="2" className="w-full max-w-[520px] text-left lg:max-w-none">
        <h1 className="text-display text-white text-balance leading-[1.15] pb-[0.08em]">
          {copy.headline}
        </h1>
        <p className="text-body-large md:text-subheading text-white/90 leading-relaxed text-pretty font-sans">
          {copy.subheadline}
        </p>
      </Stack>
    </div>
  );
}

/**
 * Server component: SSR headline and subcopy for LCP + SEO (no client swap).
 */
export function HeroPrimaryCopy({ hero }: HeroPrimaryCopyProps) {
  return (
    <>
      <HeroPrimaryEyebrow hero={hero} />
      <HeroPrimaryHeadline hero={hero} />
    </>
  );
}
