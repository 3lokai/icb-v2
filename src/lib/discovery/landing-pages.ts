// src/lib/discovery/landing-pages.ts
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";
import type { RoastLevelEnum } from "@/types/db-enums";

export type LandingPageType = "brew_method" | "roast_level" | "price_bucket";

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
};

/**
 * Landing page configurations for Phase 1
 */
export const LANDING_PAGES: LandingPageConfig[] = [
  // Brew Method Pages
  {
    slug: "aeropress-coffee",
    type: "brew_method",
    h1: "Best Coffees for AeroPress in India",
    intro:
      "Discover Indian specialty coffees that shine in AeroPress brewing. These coffees are selected for their ability to produce clean, concentrated cups with low bitterness.",
    headerNudge:
      "Great for clean, bright cups and experimenting with different origins.",
    teaserTitle: "Top Rated Coffees for AeroPress",
    teaserDescription:
      "A curated selection of the best coffees optimized for AeroPress brewing.",
    gridNudge:
      "New to AeroPress? Start with medium or light roasts for balanced extraction.",
    heroBackgroundImage: "/images/discovery/aeropress-hero.jpg",
    heroBadge: "Light to Medium Roast",
    utilityNudge:
      "Dialling in grind size and water temperature makes a big difference with AeroPress.",
    faqOverline: "AeroPress Queries",
    faqTitle: "Brewing with *AeroPress*",
    faqDescription:
      "Common questions about getting the most from your AeroPress.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["aeropress"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes a coffee good for AeroPress?",
        answer:
          "AeroPress works well with most coffees, but medium to light roasts with balanced acidity and clear flavor notes tend to produce the best results.",
      },
      {
        question: "What grind size should I use for AeroPress?",
        answer:
          "Use a medium-fine grind, similar to table salt. This allows for proper extraction while preventing over-extraction from the pressure.",
      },
      {
        question: "Can I use dark roast coffee in AeroPress?",
        answer:
          "Yes, but use lower water temperature (74-79°C) to avoid bitterness. Dark roasts work well with the inverted method for longer steep times.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "AeroPress Brewing Guide",
      description:
        "Learn expert techniques and recipes for brewing with AeroPress.",
      href: "/tools/expert-recipes?method=aeropress",
      ctaText: "View Recipes",
    },
    related: ["light-roast", "budget-coffee", "v60-coffee"],
  },
  {
    slug: "v60-coffee",
    type: "brew_method",
    h1: "Best Coffees for V60 in India",
    intro:
      "Find Indian specialty coffees perfect for V60 pour-over brewing. These coffees highlight clarity, brightness, and nuanced flavor profiles that V60 excels at extracting.",
    headerNudge:
      "Perfect for highlighting delicate origin flavors and bright acidity.",
    teaserTitle: "Top Rated Coffees for V60",
    teaserDescription:
      "Explore coffees that excel in pour-over brewing, highlighting clarity and brightness.",
    gridNudge:
      "Light roasts shine here—they reveal complexity that darker roasts can mask.",
    heroBackgroundImage: "/images/discovery/v60-hero.jpg",
    heroBadge: "Light to Medium Roast",
    utilityNudge:
      "Mastering the pour technique and bloom phase transforms your V60 results.",
    faqOverline: "V60 Queries",
    faqTitle: "Brewing with *V60*",
    faqDescription:
      "Common questions about mastering the V60 pour-over technique.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["pour-over"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Why is V60 popular for specialty coffee?",
        answer:
          "V60's spiral ridges and large single hole allow for precise control over extraction, making it ideal for highlighting delicate flavor notes in specialty coffees.",
      },
      {
        question: "What roast level works best with V60?",
        answer:
          "Light to medium roasts work best, as V60 excels at extracting bright, clean flavors. Dark roasts can work but may require coarser grinds and lower temperatures.",
      },
      {
        question: "How long should a V60 brew take?",
        answer:
          "A typical V60 brew takes 3-4 minutes total, including a 30-45 second bloom phase. Adjust grind size to hit this target time.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "V60 Brewing Guide",
      description:
        "Master the V60 technique with expert recipes and brewing tips.",
      href: "/tools/expert-recipes?method=v60",
      ctaText: "View Recipes",
    },
    related: ["light-roast", "medium-roast", "aeropress-coffee"],
  },
  {
    slug: "french-press-coffee",
    type: "brew_method",
    h1: "Best Coffees for French Press in India",
    intro:
      "Explore Indian specialty coffees that excel in French Press brewing. These coffees deliver full-bodied, rich cups with deep flavors and natural oils.",
    headerNudge:
      "Ideal for bold, full-bodied cups that showcase natural coffee oils.",
    gridNudge:
      "Medium to dark roasts work best—they develop rich body during the immersion steep.",
    heroBadge: "Medium to Dark Roast",
    utilityNudge:
      "A coarse grind and consistent 4-minute steep time are key to French Press success.",
    faqOverline: "French Press Queries",
    faqTitle: "Brewing with *French Press*",
    faqDescription:
      "Common questions about getting rich, full-bodied coffee from your French Press.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["french_press"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes coffee good for French Press?",
        answer:
          "Medium to dark roasts with bold, rich flavors work exceptionally well. The immersion method extracts oils and body that complement these roast profiles.",
      },
      {
        question: "What grind size should I use?",
        answer:
          "Use a coarse grind, similar to sea salt. This prevents over-extraction and sediment in your cup while allowing proper extraction during the 4-minute steep.",
      },
      {
        question: "How long should I steep French Press coffee?",
        answer:
          "Steep for exactly 4 minutes after adding water. Stir once after adding water, then press slowly and serve immediately to prevent over-extraction.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "French Press Brewing Guide",
      description:
        "Learn the perfect French Press technique for rich, full-bodied coffee.",
      href: "/tools/expert-recipes?method=frenchpress",
      ctaText: "View Recipes",
    },
    related: ["medium-roast", "dark-roast", "mid-range-coffee"],
  },
  // Roast Level Pages
  {
    slug: "light-roast",
    type: "roast_level",
    h1: "Light Roast Coffee in India",
    intro:
      "Discover Indian specialty coffees roasted light to highlight origin characteristics, bright acidity, and delicate flavor notes.",
    headerNudge:
      "Best for those who love bright, tea-like coffees with complex origin notes.",
    teaserTitle: "Featured Light Roasts",
    teaserDescription:
      "Bright, acidic, and complex coffees roasted to preserve origin characteristics.",
    gridNudge:
      "Pour-over methods like V60 and AeroPress really make these coffees sing.",
    heroBackgroundImage: "/images/discovery/light-roast-hero.jpg",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Use higher water temperatures (95-100°C) to fully extract light roast complexity.",
    faqOverline: "Light Roast Queries",
    faqTitle: "Understanding *Light Roast* Coffee",
    faqDescription:
      "Common questions about light roast coffees and how to brew them perfectly.",
    faqBadge: "Knowledge Base",
    filter: {
      roast_levels: ["light" as RoastLevelEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines a light roast coffee?",
        answer:
          "Light roasts are roasted until first crack, preserving origin flavors, bright acidity, and complex flavor notes. They often have a lighter body and higher caffeine content.",
      },
      {
        question: "What brewing methods work best with light roasts?",
        answer:
          "Pour-over methods like V60, Chemex, and AeroPress excel with light roasts, as they highlight clarity and delicate flavors. Higher water temperatures (95-100°C) are recommended.",
      },
      {
        question: "Are light roasts more acidic?",
        answer:
          "Light roasts have brighter, more pronounced acidity, but this is often balanced with sweetness and complexity. They're ideal for those who enjoy nuanced, tea-like coffees.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Brewing Light Roast Coffee",
      description:
        "Learn how to extract the best flavors from light roast coffees.",
      href: "/learn",
      ctaText: "Learn More",
    },
    related: ["aeropress-coffee", "v60-coffee", "budget-coffee"],
  },
  {
    slug: "medium-roast",
    type: "roast_level",
    h1: "Medium Roast Coffee in India",
    intro:
      "Explore Indian specialty coffees with balanced medium roasts, offering the perfect harmony between origin flavors and roast characteristics.",
    headerNudge:
      "The most versatile roast—works beautifully with any brewing method.",
    gridNudge:
      "Perfect for beginners and experts alike—forgiving and consistently delicious.",
    heroBadge: "Curated Selection",
    utilityNudge:
      "These coffees shine in espresso, pour-over, and French Press equally well.",
    faqOverline: "Medium Roast Queries",
    faqTitle: "Understanding *Medium Roast* Coffee",
    faqDescription:
      "Common questions about versatile medium roast coffees and their brewing methods.",
    faqBadge: "Knowledge Base",
    filter: {
      roast_levels: ["medium" as RoastLevelEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes medium roast coffee popular?",
        answer:
          "Medium roasts balance origin characteristics with roast flavors, creating versatile coffees that work well across all brewing methods. They offer good body, balanced acidity, and approachable flavors.",
      },
      {
        question: "Can I use medium roast for espresso?",
        answer:
          "Yes, medium roasts are excellent for espresso. They provide good crema, balanced flavors, and work well in milk-based drinks while still showcasing origin notes.",
      },
      {
        question: "What brewing methods suit medium roasts?",
        answer:
          "Medium roasts are versatile and work well with all brewing methods, from pour-over to French Press to espresso. They're forgiving and produce consistent results.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Brewing Medium Roast Coffee",
      description:
        "Discover the versatility of medium roast coffees across different brewing methods.",
      href: "/learn",
      ctaText: "Learn More",
    },
    related: ["v60-coffee", "french-press-coffee", "mid-range-coffee"],
  },
  {
    slug: "dark-roast",
    type: "roast_level",
    h1: "Dark Roast Coffee in India",
    intro:
      "Find Indian specialty coffees roasted dark for bold, rich flavors with low acidity and full body, perfect for those who prefer intense coffee experiences.",
    headerNudge:
      "Bold, full-bodied coffees with rich oils and intense flavors.",
    gridNudge:
      "French Press and espresso methods really bring out the best in dark roasts.",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Use lower water temperatures (87-90°C) to avoid bitterness and extract smooth flavors.",
    faqOverline: "Dark Roast Queries",
    faqTitle: "Understanding *Dark Roast* Coffee",
    faqDescription:
      "Common questions about bold dark roast coffees and brewing techniques.",
    faqBadge: "Knowledge Base",
    filter: {
      roast_levels: ["dark" as RoastLevelEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines a dark roast coffee?",
        answer:
          "Dark roasts are roasted past second crack, developing bold, smoky flavors with low acidity. They have a full body, rich oils on the surface, and work well in milk-based drinks.",
      },
      {
        question: "Do dark roasts have less caffeine?",
        answer:
          "Slightly less caffeine per bean due to longer roasting, but the difference is minimal. The stronger flavor often makes people think they're more caffeinated.",
      },
      {
        question: "What brewing methods work best with dark roasts?",
        answer:
          "French Press, espresso, and cold brew work excellently with dark roasts. Use lower water temperatures (87-90°C) to avoid bitterness and extract smooth, rich flavors.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Brewing Dark Roast Coffee",
      description:
        "Learn techniques for extracting smooth, rich flavors from dark roast coffees.",
      href: "/learn",
      ctaText: "Learn More",
    },
    related: ["french-press-coffee", "mid-range-coffee", "medium-roast"],
  },
  // Price Bucket Pages
  {
    slug: "budget-coffee",
    type: "price_bucket",
    h1: "Best Coffees Under ₹500 in India",
    displayRange: "Under ₹500",
    ctaLabel: "Browse all coffees under ₹500",
    intro:
      "Discover excellent Indian specialty coffees under ₹500. Quality coffee doesn't have to break the bank—find great value options that deliver exceptional flavor.",
    headerNudge:
      "Great value doesn't mean compromising on quality—these coffees deliver exceptional flavor.",
    gridNudge:
      "Look for 250g packs and coffees from well-known Indian origins for the best value.",
    heroBadge: "Best Value",
    utilityNudge:
      "Proper brewing technique maximizes flavor, regardless of price point.",
    faqOverline: "Budget Coffee Queries",
    faqTitle: "Finding *Great Value* Coffee",
    faqDescription:
      "Common questions about finding quality specialty coffee on a budget.",
    faqBadge: "Smart Shopping",
    filter: {
      max_price: 500,
    },
    sortOrder: "best_value",
    faqs: [
      {
        question: "Can I find good specialty coffee under ₹500?",
        answer:
          "Yes, many Indian roasters offer excellent specialty coffees under ₹500. Look for 250g packs and coffees from well-known origins like Chikmagalur or Coorg.",
      },
      {
        question: "What should I look for in budget specialty coffee?",
        answer:
          "Focus on coffees with clear origin information, roast dates, and transparent pricing. Many roasters offer sampler packs or smaller sizes that fit this budget.",
      },
      {
        question: "Are cheaper coffees lower quality?",
        answer:
          "Not necessarily. Price reflects many factors including origin, processing, and roaster overhead. Many excellent coffees are priced accessibly to reach more coffee lovers.",
      },
    ],
    utilityCard: {
      type: "calculator",
      title: "Coffee Calculator",
      description:
        "Calculate the perfect coffee-to-water ratio for your budget and brewing method.",
      href: "/tools/coffee-calculator",
      ctaText: "Try Calculator",
    },
    related: ["light-roast", "medium-roast", "mid-range-coffee"],
  },
  {
    slug: "mid-range-coffee",
    type: "price_bucket",
    h1: "Best Coffees Between ₹500–₹1000 in India",
    displayRange: "₹500–₹1000",
    ctaLabel: "Browse all mid-range coffees",
    intro:
      "Explore premium Indian specialty coffees in the ₹500-₹1000 range. These coffees offer exceptional quality, unique processing methods, and distinctive flavor profiles.",
    headerNudge:
      "Where unique processing methods and exceptional quality meet.",
    gridNudge:
      "These coffees often feature natural, honey, or anaerobic processing for distinctive flavors.",
    heroBadge: "Premium Selection",
    utilityNudge:
      "Store properly and brew with care to fully appreciate these premium coffees.",
    faqOverline: "Premium Coffee Queries",
    faqTitle: "Exploring *Premium* Coffee",
    faqDescription:
      "Common questions about premium specialty coffees and what makes them special.",
    faqBadge: "Expert Guide",
    filter: {
      min_price: 500,
      max_price: 1000,
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes coffees in this price range special?",
        answer:
          "Coffees in this range often feature unique processing methods (natural, honey, anaerobic), single-origin lots, limited editions, or coffees from renowned estates with exceptional cupping scores.",
      },
      {
        question: "Are these coffees worth the price?",
        answer:
          "Yes, if you value unique flavor experiences, traceability, and supporting Indian specialty coffee. These coffees often represent the best of what Indian roasters have to offer.",
      },
      {
        question: "How should I store premium coffee?",
        answer:
          "Store in an airtight container away from light, heat, and moisture. Use within 2-3 weeks of roast date for best flavor. Grind just before brewing to preserve freshness.",
      },
    ],
    utilityCard: {
      type: "calculator",
      title: "Coffee Calculator",
      description:
        "Optimize your brewing to get the most from premium coffees.",
      href: "/tools/coffee-calculator",
      ctaText: "Try Calculator",
    },
    related: ["medium-roast", "dark-roast", "budget-coffee"],
  },
];

/**
 * Get landing page config by slug
 */
export function getLandingPageConfig(
  slug: string
): LandingPageConfig | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}

/**
 * Get all landing page slugs
 */
export function getAllLandingPageSlugs(): string[] {
  return LANDING_PAGES.map((page) => page.slug);
}
