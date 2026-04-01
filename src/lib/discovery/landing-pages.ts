// src/lib/discovery/landing-pages.ts
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";
import type { ProcessEnum, RoastLevelEnum } from "@/types/db-enums";

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

/** Canonical path for discovery landing pages (under /coffees) */
export function discoveryPagePath(slug: string): string {
  return `/coffees/${slug}`;
}

/**
 * Landing page configurations
 */
export const LANDING_PAGES: LandingPageConfig[] = [
  // Brew Method Pages
  {
    slug: "aeropress",
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
    related: ["light-roast", "budget", "v60"],
  },
  {
    slug: "v60",
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
      brew_method_ids: ["pour_over"],
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
    related: ["light-roast", "medium-roast", "aeropress"],
  },
  {
    slug: "chemex",
    type: "brew_method",
    h1: "Best Coffees for Chemex in India",
    intro:
      "Discover Indian specialty coffees suited to Chemex brewing—clean cups, silky body, and clarity from a slower drawdown and thick filter paper.",
    headerNudge:
      "Chemex highlights sweetness and clarity; choose coffees with defined origin character.",
    teaserTitle: "Top Rated Coffees for Chemex",
    teaserDescription:
      "Pour-over friendly lots that shine with Chemex’s classic paper filter profile.",
    gridNudge:
      "Use a medium-coarse grind and keep a steady spiral pour for even extraction.",
    heroBadge: "Pour Over",
    utilityNudge:
      "A slightly coarser grind than V60 often works best for Chemex’s slower flow.",
    faqOverline: "Chemex Queries",
    faqTitle: "Brewing with *Chemex*",
    faqDescription:
      "Tips for getting the most from Chemex with Indian specialty coffees.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["pour_over"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Why use Chemex instead of other pour overs?",
        answer:
          "The thick bonded filter removes more oils and fines, giving a very clean cup—great for highlighting delicate notes and a tea-like clarity.",
      },
      {
        question: "What coffees work best on Chemex?",
        answer:
          "Light to medium roasts with bright acidity and floral or fruit notes often shine; the same pour-over friendly lots we list here work well.",
      },
      {
        question: "Grind size for Chemex?",
        answer:
          "Start medium-coarse, like coarse sand, and adjust until drawdown lands around 4–5 minutes for a typical batch brew.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Pour-over recipes",
      description: "Dial in pour-over recipes and ratios for cleaner cups.",
      href: "/tools/expert-recipes?method=v60",
      ctaText: "View Recipes",
    },
    related: ["kalita", "v60", "light-roast"],
  },
  {
    slug: "kalita",
    type: "brew_method",
    h1: "Best Coffees for Kalita Wave in India",
    intro:
      "Find Indian specialty coffees that work beautifully on the Kalita Wave—balanced extraction, forgiving flat bed, and consistent pour-over results.",
    headerNudge:
      "Kalita’s flat bottom and wave filters encourage even extraction—great for daily pour overs.",
    teaserTitle: "Top Rated Coffees for Kalita Wave",
    teaserDescription:
      "Coffees that reward Kalita’s steady flow and balanced profile.",
    gridNudge: "Try a medium-fine grind and pulse pours to keep the bed flat.",
    heroBadge: "Pour Over",
    utilityNudge:
      "Slightly finer grind than Chemex is common; tune to your drawdown time.",
    faqOverline: "Kalita Queries",
    faqTitle: "Brewing with *Kalita Wave*",
    faqDescription:
      "Get consistent cups from your Kalita with these Indian specialty picks.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["pour_over"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Is Kalita easier than V60?",
        answer:
          "Many people find the flat bed and three small holes more forgiving of small pour mistakes, while still delivering a clean cup.",
      },
      {
        question: "Same coffees as V60?",
        answer:
          "Often yes—both are pour-over methods. We filter for pour-over friendly profiles; you can compare V60, Kalita, and Chemex pages for copy tailored to each brewer.",
      },
      {
        question: "Kalita Wave grind size?",
        answer:
          "Start medium-fine (between V60 and Chemex), then adjust so a typical brew finishes in a similar window to your favorite recipe.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Pour-over recipes",
      description: "Recipes and ratios for pour-over brewers.",
      href: "/tools/expert-recipes?method=v60",
      ctaText: "View Recipes",
    },
    related: ["chemex", "v60", "medium-roast"],
  },
  {
    slug: "french-press",
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
    related: ["medium-roast", "dark-roast", "mid-range"],
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
    related: ["aeropress", "light-medium-roast", "budget"],
  },
  {
    slug: "light-medium-roast",
    type: "roast_level",
    h1: "Light-Medium Roast Coffee in India",
    intro:
      "Explore Indian specialty coffees roasted at light-medium levels for a balance of origin clarity and approachable sweetness.",
    headerNudge:
      "Great bridge roast if light feels too bright and medium feels too heavy.",
    teaserTitle: "Featured Light-Medium Roasts",
    teaserDescription:
      "Balanced cups with both origin character and gentle roast sweetness.",
    gridNudge:
      "Ideal for pour-over and AeroPress when you want clarity with a bit more body.",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Use standard brew temperatures (92-96°C) and tweak grind for sweetness.",
    faqOverline: "Light-Medium Roast Queries",
    faqTitle: "Understanding *Light-Medium Roast* Coffee",
    faqDescription:
      "Common questions about light-medium roasts and when to choose them.",
    faqBadge: "Knowledge Base",
    filter: {
      roast_levels: ["light_medium" as RoastLevelEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is a light-medium roast?",
        answer:
          "It sits between light and medium, preserving more origin detail than medium while adding extra sweetness and body compared to very light roasts.",
      },
      {
        question: "Who should choose light-medium?",
        answer:
          "It is ideal if you want nuanced flavors without intense acidity, especially for everyday filter brews.",
      },
      {
        question: "Best brew methods?",
        answer:
          "Pour-over, AeroPress, and drip all work well; it is a forgiving roast level for most setups.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Brewing Light-Medium Roast Coffee",
      description:
        "Learn how to get balanced sweetness and clarity from light-medium roasts.",
      href: "/learn",
      ctaText: "Learn More",
    },
    related: ["light-roast", "medium-roast", "v60"],
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
    related: ["light-medium-roast", "medium-dark-roast", "mid-range"],
  },
  {
    slug: "medium-dark-roast",
    type: "roast_level",
    h1: "Medium-Dark Roast Coffee in India",
    intro:
      "Find medium-dark Indian specialty coffees with richer body and deeper sweetness while retaining some origin nuance.",
    headerNudge:
      "A great choice for fuller cups and lower perceived acidity without going fully dark.",
    teaserTitle: "Featured Medium-Dark Roasts",
    teaserDescription:
      "Richer, rounder profiles for espresso, French Press, and milk drinks.",
    gridNudge:
      "Great for espresso and French Press when you want boldness without heavy smokiness.",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Lower temperatures (89-93°C) can help avoid bitterness on finer grinds.",
    faqOverline: "Medium-Dark Roast Queries",
    faqTitle: "Understanding *Medium-Dark Roast* Coffee",
    faqDescription:
      "Common questions about medium-dark profiles and brewing choices.",
    faqBadge: "Knowledge Base",
    filter: {
      roast_levels: ["medium_dark" as RoastLevelEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "How is medium-dark different from medium?",
        answer:
          "Medium-dark has more caramelized, chocolate-forward notes and fuller body, with less brightness than medium.",
      },
      {
        question: "How is it different from dark roast?",
        answer:
          "Medium-dark is generally less smoky and keeps more origin character while still offering a bold cup.",
      },
      {
        question: "Best brewing methods?",
        answer:
          "Espresso, moka pot, and French Press are popular choices; it also works well for milk-based drinks.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Brewing Medium-Dark Roast Coffee",
      description:
        "Tips for extracting sweetness and body from medium-dark roasts.",
      href: "/learn",
      ctaText: "Learn More",
    },
    related: ["medium-roast", "dark-roast", "french-press"],
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
    related: ["medium-dark-roast", "french-press", "mid-range"],
  },
  // Price Bucket Pages
  {
    slug: "budget",
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
      {
        question: "Why does the price differ from the roaster's site?",
        answer:
          "We normalize all prices to a 250g equivalent for fair comparison. The actual price you pay depends on the pack size you choose on the roaster's website.",
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
    related: ["light-roast", "medium-roast", "mid-range"],
  },
  {
    slug: "mid-range",
    type: "price_bucket",
    h1: "Best Coffees Between ₹500–₹1000 in India",
    displayRange: "₹500–₹1000",
    ctaLabel: "Browse all mid-range coffees",
    intro:
      "Explore premium Indian specialty coffees in the ₹500-1000 range. These coffees offer exceptional quality, unique processing methods, and distinctive flavor profiles.",
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
      {
        question: "Why does the price differ from the roaster's site?",
        answer:
          "We normalize all prices to a 250g equivalent for fair comparison. The actual price you pay depends on the pack size you choose on the roaster's website.",
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
    related: ["medium-roast", "dark-roast", "budget"],
  },
  // Process pages
  {
    slug: "natural",
    type: "process",
    h1: "Natural Process Coffee in India",
    intro:
      "Explore Indian specialty coffees processed naturally—dried in the cherry for bold fruit, wine-like complexity, and heavy body.",
    headerNudge:
      "Expect pronounced fruit and fermentation-forward profiles when dialed in.",
    teaserTitle: "Natural process picks",
    teaserDescription:
      "Lots where the fruit stayed on the bean longer for intense sweetness and complexity.",
    gridNudge:
      "Grind a touch coarser if shots run slow; naturals can extract quickly on pour over.",
    heroBadge: "Processing",
    faqOverline: "Natural process",
    faqTitle: "About *natural* coffee",
    faqDescription: "How natural processing shapes flavour in the cup.",
    faqBadge: "Processing",
    filter: {
      processes: ["natural" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is natural process coffee?",
        answer:
          "Cherries are typically dried with the fruit intact, allowing sugars to influence the bean—often yielding fruity, wine-like, or fermented notes.",
      },
      {
        question: "Is natural the same as unwashed?",
        answer:
          "In common specialty usage, “natural” and dry-processed naturals refer to this style; wording varies by region.",
      },
      {
        question: "Best brew methods for naturals?",
        answer:
          "Pour-over and immersion can both work; control grind and temperature to balance intense fruit and sweetness.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about processing",
      description: "More on how processing changes flavour in Indian coffees.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["honey", "washed", "light-roast"],
  },
  {
    slug: "washed",
    type: "process",
    h1: "Washed Process Coffee in India",
    intro:
      "Find washed Indian specialty coffees—clean cups, vibrant acidity, and clarity that lets origin and varietal shine.",
    headerNudge:
      "Great when you want crisp definition and less ferment than naturals.",
    teaserTitle: "Washed process picks",
    teaserDescription: "Fermented and washed to remove mucilage before drying.",
    gridNudge:
      "Slightly finer grind can highlight acidity; keep an eye on brew time.",
    heroBadge: "Processing",
    faqOverline: "Washed process",
    faqTitle: "About *washed* coffee",
    faqDescription: "Why washed lots taste clean and bright.",
    faqBadge: "Processing",
    filter: {
      processes: ["washed" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is washed coffee?",
        answer:
          "After pulping, mucilage is removed through fermentation and washing before drying—often producing cleaner, brighter cups.",
      },
      {
        question: "Washed vs natural?",
        answer:
          "Washed tends toward clarity and acidity; natural often brings heavier body and fruit. Both can be excellent.",
      },
      {
        question: "Best brewing for washed coffees?",
        answer:
          "Pour-over methods highlight clarity; espresso can emphasize sweetness and balance.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about processing",
      description: "Explore how washing affects flavour.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["natural", "v60", "light-roast"],
  },
  {
    slug: "honey",
    type: "process",
    h1: "Honey Process Coffee in India",
    intro:
      "Discover honey and pulped-natural style Indian coffees—sweetness, body, and balance between washed clarity and natural fruit.",
    headerNudge:
      "Mucilage left on the bean during drying adds sweetness and mouthfeel.",
    teaserTitle: "Honey process picks",
    teaserDescription:
      "Profiles between washed and natural with signature sweetness.",
    gridNudge:
      "Try a slightly lower temperature if you taste roasty sharpness on pour over.",
    heroBadge: "Processing",
    faqOverline: "Honey process",
    faqTitle: "About *honey* coffee",
    faqDescription: "What “honey” means in specialty coffee.",
    faqBadge: "Processing",
    filter: {
      processes: ["honey" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is honey process?",
        answer:
          "Mucilage is partially left on the bean while drying—black/red/yellow/white honey usually refers to how much mucilage remains, affecting sweetness and risk.",
      },
      {
        question: "Honey vs natural?",
        answer:
          "Honey often sits between washed and natural: more body than washed, often less intense ferment than heavy naturals.",
      },
      {
        question: "Brew tips?",
        answer:
          "Balanced pour-over recipes work well; adjust ratio to taste for sweetness vs clarity.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about processing",
      description: "More on honey and pulped-natural styles.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["natural", "washed", "medium-roast"],
  },
  {
    slug: "anaerobic",
    type: "process",
    h1: "Anaerobic Process Coffee in India",
    intro:
      "Browse anaerobic and experimental ferment Indian specialty coffees—intense aromatics, complex fruit, and distinctive cup profiles.",
    headerNudge:
      "Fermentation in controlled low-oxygen environments can amplify fruit and spice notes.",
    teaserTitle: "Anaerobic picks",
    teaserDescription:
      "Experimental lots with bold, often wine-like or tropical profiles.",
    gridNudge: "Use soft water and careful ratios—these cups can be intense.",
    heroBadge: "Experimental",
    faqOverline: "Anaerobic",
    faqTitle: "About *anaerobic* coffee",
    faqDescription: "Controlled fermentation and flavour impact.",
    faqBadge: "Processing",
    filter: {
      processes: ["anaerobic" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What does anaerobic mean here?",
        answer:
          "Coffee is fermented with limited oxygen—often in sealed tanks—allowing specific microbes to shape flavour differently than open fermentation.",
      },
      {
        question: "Are anaerobic coffees for everyone?",
        answer:
          "They can be polarising—very fruit-forward or fermented. Great if you enjoy bold, wine-like cups.",
      },
      {
        question: "How to brew?",
        answer:
          "Start with familiar pour-over parameters; grind slightly coarser if flavours feel too concentrated.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn more",
      description: "Processing and flavour on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["natural", "mid-range", "light-roast"],
  },
  {
    slug: "monsooned-malabar",
    type: "process",
    h1: "Monsooned Malabar Coffee in India",
    intro:
      "Explore monsooned coffees from India—low acidity, mellow spice, and a distinct heritage profile associated with the Malabar coast.",
    headerNudge:
      "Monsooning swells beans and mellows acidity; profiles are often earthy and smooth.",
    teaserTitle: "Monsooned Malabar picks",
    teaserDescription:
      "Heritage-processed lots valued for their mild, heavy-bodied cup.",
    gridNudge:
      "Works well in espresso blends or milk; try French Press for body.",
    heroBadge: "Heritage",
    faqOverline: "Monsooned",
    faqTitle: "About *monsooned* coffee",
    faqDescription: "India’s monsooning tradition in brief.",
    faqBadge: "Processing",
    filter: {
      processes: ["monsooned" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is monsooned coffee?",
        answer:
          "Beans are exposed to monsoon winds and humidity in a controlled manner, swelling them and muting acidity while developing mellow, earthy sweetness.",
      },
      {
        question: "Why is it associated with Malabar?",
        answer:
          "The style originated with storage in coastal Malabar warehouses; today it’s a defined specialty category with protected terminology in some contexts.",
      },
      {
        question: "How should I brew it?",
        answer:
          "Espresso and milk drinks, French Press, or South Indian filter—embrace the low-acid, full-bodied profile.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, processes, and brewing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["dark-roast", "french-press", "coorg"],
  },
  // Region pages
  {
    slug: "chikmagalur",
    type: "region",
    h1: "Chikmagalur Coffee in India",
    intro:
      "Discover specialty coffees from Chikmagalur—Karnataka’s historic coffee heartland with diverse estates, washed and experimental lots, and iconic Indian arabica.",
    headerNudge:
      "A default origin name for many Indian specialty drinkers—wide range of roast styles.",
    teaserTitle: "Chikmagalur coffees",
    teaserDescription: "From classic washed estate lots to microlots.",
    gridNudge:
      "Compare processes and roast levels across roasters on the directory.",
    heroBadge: "Origin",
    faqOverline: "Chikmagalur",
    faqTitle: "About *Chikmagalur* coffee",
    faqDescription: "What to expect from this region.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["chikmagalur"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Why is Chikmagalur famous for coffee?",
        answer:
          "It’s one of India’s oldest continuous coffee-growing areas, with altitude and climate suited to arabica and significant heritage estates.",
      },
      {
        question: "What flavours are common?",
        answer:
          "Profiles vary by process and roast—spice, cocoa, nuts, and fruit all appear across roasters.",
      },
      {
        question: "How do I choose?",
        answer:
          "Use roast level and process filters alongside this region to narrow down.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "More regional guides on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["coorg", "wayanad", "light-roast"],
  },
  {
    slug: "coorg",
    type: "region",
    h1: "Coorg Coffee in India",
    intro:
      "Browse Indian specialty coffees from Coorg (Kodagu)—lush hills, established estates, and coffees spanning classic and modern processing.",
    headerNudge:
      "Often bold and full in body; great for espresso and milk drinks depending on roast.",
    teaserTitle: "Coorg coffees",
    teaserDescription: "Kodagu-origin lots from roasters across India.",
    gridNudge:
      "Pair with process filters to find naturals or washed estate lots.",
    heroBadge: "Origin",
    faqOverline: "Coorg",
    faqTitle: "About *Coorg* coffee",
    faqDescription: "Flavour and buying tips.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["coorg"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Coorg known for?",
        answer:
          "Kodagu is a major producing district in Karnataka with both large estates and smaller lots showing up in specialty.",
      },
      {
        question: "Coorg vs Chikmagalur?",
        answer:
          "Both are Karnataka heavyweights; cup profiles depend on elevation, variety, and process—compare side by side.",
      },
      {
        question: "Brew suggestions?",
        answer:
          "Espresso, South Indian filter, or French Press for heavier roasts; pour-over for lighter lots.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Regional deep dives on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["chikmagalur", "wayanad", "medium-roast"],
  },
  {
    slug: "araku",
    type: "region",
    h1: "Araku Valley Coffee in India",
    intro:
      "Find specialty coffees from Araku—Andhra Pradesh’s highland terroir known for emerging microlots and distinctive smallholder lots.",
    headerNudge:
      "Profiles can be floral and bright; worth exploring with pour-over.",
    teaserTitle: "Araku coffees",
    teaserDescription: "Highland lots from the Eastern Ghats.",
    gridNudge: "Light roasts often highlight florals—check tasting notes.",
    heroBadge: "Origin",
    faqOverline: "Araku",
    faqTitle: "About *Araku* coffee",
    faqDescription: "Terroir and flavour cues.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["araku"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Araku?",
        answer:
          "Araku Valley sits in the Eastern Ghats of Andhra Pradesh, with elevations favourable for arabica.",
      },
      {
        question: "What to expect in the cup?",
        answer:
          "Many lots show brightness and floral or fruit notes; exact profiles vary by harvest and process.",
      },
      {
        question: "How to brew?",
        answer:
          "Pour-over and AeroPress often suit lighter roasts; adjust to tasting notes.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Learn more about Indian origins.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["nilgiris", "light-roast", "v60"],
  },
  {
    slug: "nilgiris",
    type: "region",
    h1: "Nilgiris Coffee in India",
    intro:
      "Explore coffees from the Nilgiris—cool Tamil Nadu highlands with estates and small growers producing nuanced Indian arabica.",
    headerNudge:
      "Cool climate and distinct terroir—look for elegant profiles in lighter roasts.",
    teaserTitle: "Nilgiris coffees",
    teaserDescription: "Blue Mountain slopes and surrounding areas.",
    gridNudge:
      "Compare with Wayanad and Karnataka origins for terroir contrast.",
    heroBadge: "Origin",
    faqOverline: "Nilgiris",
    faqTitle: "About *Nilgiris* coffee",
    faqDescription: "Regional snapshot.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["nilgiris"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines Nilgiris coffee?",
        answer:
          "Grown in the Nilgiri district’s high elevations—cups often show clarity when roasted light.",
      },
      {
        question: "Is it similar to Karnataka coffees?",
        answer:
          "It’s neighbouring terroir but with its own microclimates; always taste and compare.",
      },
      {
        question: "Buying tips?",
        answer:
          "Check harvest, process, and roast date like any specialty coffee.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "More on Indian coffee origins.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["wayanad", "chikmagalur", "light-roast"],
  },
  {
    slug: "wayanad",
    type: "region",
    h1: "Wayanad Coffee in India",
    intro:
      "Discover specialty coffees from Wayanad—Kerala’s hilly district with spice-country terroir and a growing specialty presence.",
    headerNudge:
      "Earthy, chocolate, and spice notes appear often; great for daily drinkers.",
    teaserTitle: "Wayanad coffees",
    teaserDescription: "Kerala highland lots from Indian roasters.",
    gridNudge: "Use brew method filters to match your routine.",
    heroBadge: "Origin",
    faqOverline: "Wayanad",
    faqTitle: "About *Wayanad* coffee",
    faqDescription: "Regional overview.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["wayanad"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Wayanad?",
        answer:
          "A hilly district in north-eastern Kerala, neighbouring Karnataka’s coffee belt.",
      },
      {
        question: "Flavour profile?",
        answer:
          "Varies by lot; expect approachable, often chocolate-forward or spice-toned cups on medium roasts.",
      },
      {
        question: "How to explore?",
        answer:
          "Start here then compare Coorg or Chikmagalur lots with similar roast levels.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Learn hub articles on origins and brewing.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["coorg", "nilgiris", "french-press"],
  },
  {
    slug: "koraput",
    type: "region",
    h1: "Koraput (Odisha) Coffee in India",
    intro:
      "Discover specialty coffees from Koraput and Odisha’s Eastern Ghats—emerging highland terroir with smallholder and estate lots worth exploring.",
    headerNudge:
      "Often fruit-forward or chocolate-toned depending on process and roast.",
    teaserTitle: "Koraput & Odisha coffees",
    teaserDescription:
      "Eastern Ghats origin lots listed on Indian Coffee Beans.",
    gridNudge:
      "Compare with Araku (AP) or Northeast lots for a tour of non-Karnataka origins.",
    heroBadge: "Origin",
    faqOverline: "Koraput",
    faqTitle: "About *Koraput* coffee",
    faqDescription: "Odisha’s coffee-growing pocket in brief.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["koraput"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Koraput coffee grown?",
        answer:
          "Koraput is a hilly district in southern Odisha; coffee grows at elevation in the Eastern Ghats alongside tribal and smallholder farming contexts.",
      },
      {
        question: "Why list it separately from “Odisha”?",
        answer:
          "Our directory keys off canonical origin regions; Koraput is the main specialty-relevant pocket we surface for Odisha in the dataset.",
      },
      {
        question: "What flavours are common?",
        answer:
          "Profiles vary by harvest and process—look for tasting notes on each coffee and compare roasters.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "More on Indian origins on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["araku", "northeast-india", "light-roast"],
  },
  {
    slug: "northeast-india",
    type: "region",
    h1: "Northeast India Coffee in India",
    intro:
      "Browse Indian specialty coffees from the Northeast—distinct hill terroirs and small-lot profiles beyond the traditional Western Ghats belt.",
    headerNudge:
      "Expect different flavour cues from Karnataka/Kerala classics—great for curious palates.",
    teaserTitle: "Northeast India coffees",
    teaserDescription:
      "Meghalaya hill regions in our directory; more NE origins may appear over time.",
    gridNudge:
      "Pour-over and AeroPress suit lighter roasts; espresso works when roasters target fuller profiles.",
    heroBadge: "Origin",
    faqOverline: "Northeast",
    faqTitle: "About *Northeast India* coffee",
    faqDescription: "What this filter includes on ICB.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["garo-hills", "khasi-hills", "west-khasi-hills"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What does “Northeast India” include here?",
        answer:
          "We aggregate coffees linked to Meghalaya’s Garo, Khasi, and West Khasi Hills canonical regions—where we currently have structured origin data.",
      },
      {
        question: "Will more Northeast states appear?",
        answer:
          "As roasters list more traceable lots from Assam, Nagaland, Manipur, and elsewhere, we can expand this view.",
      },
      {
        question: "How does it differ from Eastern Ghats coffees?",
        answer:
          "Terroir and varieties differ; compare with Araku or Koraput pages for a side-by-side exploration.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Learn hub content on Indian coffee geography.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["koraput", "araku", "medium-roast"],
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
