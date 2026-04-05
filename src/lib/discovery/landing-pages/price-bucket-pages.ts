// src/lib/discovery/landing-pages/price-bucket-pages.ts
import type { LandingPageConfig } from "./types";

export const priceBucketPages: LandingPageConfig[] = [
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
    valueTips: [
      "Prioritize coffees with clear origin, roast date, and processing notes.",
      "250g bags often give the best per-cup value when you compare normalized prices.",
      "Use the directory filters to match roast and brew method to your setup—no need to overspend to get a great cup.",
    ],
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
    valueTips: [
      "Look for unique processing (natural, honey, anaerobic) and transparent farm or estate names.",
      "Limited lots often land in this band—compare tasting notes across roasters before you commit.",
      "Check freshness and brew recipes on the label; premium beans reward careful grinding and water.",
    ],
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
];
