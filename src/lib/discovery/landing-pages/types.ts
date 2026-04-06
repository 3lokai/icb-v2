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

/** Brew method landing pages — see `brew-method-pages.ts` */
export type BrewMethodMistake = {
  mistake: string;
  fix: string;
};

export type BrewMethodProfileConfig = {
  brewerCharacteristics: {
    mechanism: string;
    howItWorks: string;
    keyAdvantage: string;
    filterType: string;
  };
  indianCoffeeContext: string;
  commonMistakes: BrewMethodMistake[];
  roastPairing: {
    best: string[];
    works: string[];
    avoid: string;
  };
  siblingMethods: string[];
  icbDataNote: string;
};

/** Process landing pages — see `process-pages.ts` for canonical data shape */
export type ProcessProfileStep = {
  stage: string;
  description: string;
};

export type ProcessProfileConfig = {
  steps: ProcessProfileStep[];
  flavourImpact: {
    typical: string[];
    indianContext: string;
    comparedTo: string;
  };
  indiaContext: string;
  brewGuidance: {
    recommended: string[];
    notes: string;
  };
  processComparison: {
    moreIntense: string[];
    lessIntense: string[];
    comparisonNote: string;
  };
  icbDataNote: string;
};

/** Price bucket pages — see `price-bucket-pages.ts` */
export type PriceBucketBuyingGuideTip = {
  tip: string;
  detail: string;
};

export type PriceBucketProfileConfig = {
  whatYouGet: string;
  buyingGuide: PriceBucketBuyingGuideTip[];
  whatToExpect: {
    roastLevels: string[];
    processes: string[];
    roastNote: string;
    processNote: string;
  };
  priceNormalizationNote: string;
  icbDataNote: string;
};

/** Region landing pages — see `region-pages.ts` */
export type RegionProfileConfig = {
  snapshot: {
    state: string;
    elevation: string;
    knownFor: string;
  };
  overview: string;
  terroir: {
    climate: string;
    soil: string;
    altitude: string;
    varieties: string;
  };
  flavourProfile: {
    typical: string[];
    indianContext: string;
    processVariation: string;
  };
  roasterContext: string;
  brewGuidance: {
    recommended: string[];
    notes: string;
  };
  nearbyRegions: string[];
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
  /** Brew method pages: deep profile (mechanics, context, pairings) */
  brewMethodProfile?: BrewMethodProfileConfig;
  /** Process pages: deep profile (steps, flavour, context, brew guidance) */
  processProfile?: ProcessProfileConfig;
  /** Price bucket pages: deep profile (what you get, buying guide, expectations) */
  priceBucketProfile?: PriceBucketProfileConfig;
  /** Region pages: deep profile */
  regionProfile?: RegionProfileConfig;
};

/** Roast level data files — `roastProfile` is always present */
export type RoastLevelLandingPageConfig = Omit<
  LandingPageConfig,
  "roastProfile"
> & {
  roastProfile: RoastProfileConfig;
};
