// src/lib/discovery/landing-pages/brew-method-pages.ts
import type { LandingPageConfig } from "./types";

export const brewMethodPages: LandingPageConfig[] = [
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
    brewParams: {
      grindSize: "Medium-fine",
      grindSub: "Similar to table salt",
      ratio: "1:15",
      brewTime: "2–3 min",
    },
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
    brewParams: {
      grindSize: "Medium-fine",
      grindSub: "A touch finer than sea salt",
      ratio: "1:16",
      brewTime: "3–4 min",
    },
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
    brewParams: {
      grindSize: "Medium-coarse",
      grindSub: "Closer to coarse sand",
      ratio: "1:16",
      brewTime: "4–5 min",
    },
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
    brewParams: {
      grindSize: "Medium-fine",
      grindSub: "Between V60 and Chemex",
      ratio: "1:16",
      brewTime: "3–4 min",
    },
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
    brewParams: {
      grindSize: "Coarse",
      grindSub: "Similar to sea salt",
      ratio: "1:15",
      brewTime: "4 min steep",
    },
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
];
