// src/lib/discovery/landing-pages/types.ts
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";

export type LandingPageType =
  | "brew_method"
  | "roast_level"
  | "price_bucket"
  | "process"
  | "region";

export type UtilityCardType = "brew_guide" | "calculator" | "tips";

export type UtilityCardConfig = {
  type: UtilityCardType;
  title: string;
  description: string;
  href: string;
  ctaText: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

/** Roast level landing pages — see `roast-level-pages.ts` for canonical data shape */
export type RoastProfileConfig = {
  visual: {
    color: string;
    density: string;
    grindNote: string;
    agtronRange: string;
  };
  roastingProcess: {
    stage: string;
    firstCrack: string;
    secondCrack: string;
    developmentNote: string;
  };
  flavourProfile: {
    typical: string[];
    indianContext: string;
  };
  brewParams: {
    waterTemp: string;
    ratio: string;
    brewTime: string;
    note: string;
  };
  brewMethods: string[];
  whoIsItFor: string;
  icbDataNote: string;
};

export type LandingPageConfig = {
  slug: string;
  type: LandingPageType;
  h1: string;
  intro: string;
  filter: CoffeeFilters;
  faqs: FAQItem[];
  utilityCard?: UtilityCardConfig;
  related: string[];
  sortOrder: CoffeeSort;
  // Editorial enhancements
  heroBackgroundImage?: string;
  heroBadge?: string;
  teaserTitle?: string;
  teaserDescription?: string;
  // FAQ section enhancements
  faqOverline?: string;
  faqTitle?: string;
  faqDescription?: string;
  faqBadge?: string;
  // Price bucket display
  displayRange?: string;
  ctaLabel?: string;
  // Micro guidance nudges
  headerNudge?: string; // Appears under header/intro
  gridNudge?: string; // Appears above coffee grid
  utilityNudge?: string; // Appears near utility card
  /** Brew method pages: starting point for grind, ratio, and time */
  brewParams?: {
    grindSize: string;
    grindSub: string;
    ratio: string;
    brewTime: string;
  };
  /** Region pages: snapshot stats for RegionSnapshot */
  regionSnapshot?: {
    state: string;
    elevation: string;
    knownFor: string;
  };
  /** Price bucket pages: three bullets for ValueTips */
  valueTips?: string[];
  /** Process pages: optional deep link for ProcessExplainer CTA */
  blogArticleHref?: string;
  /** Roast level pages: profile explainer content */
  roastProfile?: RoastProfileConfig;
};

/** Roast level data files — `roastProfile` is always present */
export type RoastLevelLandingPageConfig = Omit<
  LandingPageConfig,
  "roastProfile"
> & {
  roastProfile: RoastProfileConfig;
};
