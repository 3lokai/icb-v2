import type { HeroSegment } from "@/types/hero-segment";

export type HeroPrimaryCopy = {
  eyebrow: string;
  /** Single SSR h1 — keep “coffee” / “Indian coffee” in the keyword base */
  headline: string;
  subheadline: string;
};

export type HeroPrimaryCopyOptions = {
  /** First name or username — only used when signed-in segments allow personalization */
  displayNameShort?: string | null;
  isAuthenticated?: boolean;
};

export function getHeroPrimaryCopy(
  segment: HeroSegment,
  ratingCount: number,
  opts?: HeroPrimaryCopyOptions
): HeroPrimaryCopy {
  const name = opts?.displayNameShort?.trim() || null;
  const authed = opts?.isAuthenticated === true;

  switch (segment) {
    case "discovery":
      return {
        // Signed-in, zero ratings, no recent views → discovery; personalized welcome is intentional.
        eyebrow:
          authed && name ? `Welcome, ${name}` : "India’s coffee directory",
        headline: "Find your next Indian coffee",
        subheadline:
          "Search by roast, brew method, origin, or flavor — then rate coffees to build your taste profile.",
      };
    case "returning_browser":
      return {
        eyebrow: name ? `Welcome back, ${name}` : "Welcome back",
        headline: "Rate an Indian coffee you’ve explored",
        subheadline:
          "You’ve been browsing — start building your coffee journey with your first rating.",
      };
    case "rating_progress": {
      const coffeeWord = ratingCount === 1 ? "coffee" : "coffees";
      const headline = `You’ve rated ${ratingCount} Indian ${coffeeWord}`;
      if (ratingCount <= 1) {
        return {
          eyebrow: name
            ? `Your coffee journey, ${name}`
            : "Your coffee journey",
          headline,
          subheadline:
            "Rate another coffee to grow your profile and sharpen recommendations.",
        };
      }
      return {
        eyebrow: name ? `Your coffee journey, ${name}` : "Your coffee journey",
        headline,
        subheadline:
          "One more coffee rating and your journey is worth saving to your profile.",
      };
    }
    case "anon_conversion": {
      const coffeeWord = ratingCount === 1 ? "coffee" : "coffees";
      return {
        eyebrow: "Your coffee journey",
        headline: `You’ve rated ${ratingCount} Indian ${coffeeWord}`,
        subheadline:
          "Your coffee journey isn’t saved yet. Create your profile to keep your ratings and build your Indian coffee history.",
      };
    }
    case "authenticated_profile":
      return {
        eyebrow: name ? `Your coffee profile, ${name}` : "Your coffee profile",
        headline: "Your coffee taste profile is taking shape",
        subheadline:
          "Keep rating coffees to sharpen your profile and get better recommendations across the directory.",
      };
    default:
      return {
        eyebrow: "India’s coffee directory",
        headline: "Find your next Indian coffee",
        subheadline:
          "Search by roast, brew method, origin, or flavor — then rate coffees to build your taste profile.",
      };
  }
}
