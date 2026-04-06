// src/lib/discovery/landing-pages/price-bucket-pages.ts
import type { LandingPageConfig } from "./types";

export const priceBucketPages: LandingPageConfig[] = [
  {
    slug: "budget",
    type: "price_bucket",
    h1: "Best Coffees Under ₹500 in India",
    displayRange: "Under ₹500",
    ctaLabel: "Browse all coffees under ₹500",
    intro:
      "Discover excellent Indian specialty coffees under ₹500. Quality coffee doesn't have to break the bank — find great value options that deliver exceptional flavour from India's best roasters.",
    headerNudge:
      "Great value doesn't mean compromising on quality — these coffees deliver exceptional flavour.",
    gridNudge:
      "Look for 250g packs and coffees from well-known Indian origins for the best value.",
    heroBadge: "Best Value",
    utilityNudge:
      "Proper brewing technique maximizes flavour regardless of price point.",

    priceBucketProfile: {
      // What this price range actually gets you
      whatYouGet:
        "Under ₹500 (normalized to 250g) is the entry point for Indian specialty — you're not getting compromise coffees here. Most established Indian roasters have at least one or two lots in this range, typically medium roasts from Karnataka estates or approachable blends. Expect clean, well-processed coffee with clear origin information. What you won't find at this price: rare microlots, experimental processing, or very high-altitude single-estate lots — those start at ₹500+.",
      // What to look for specifically
      buyingGuide: [
        {
          tip: "Check the roast date first",
          detail:
            "Freshness matters more than price. A ₹400 coffee roasted last week beats a ₹800 coffee roasted two months ago. Look for roasters who print the roast date clearly — it's a sign of quality consciousness.",
        },
        {
          tip: "Prioritize clear origin over marketing copy",
          detail:
            '"Premium blend" tells you nothing. "Chikmagalur washed arabica, light roast" tells you what you\'re getting. Choose coffees with estate name, region, and process on the label.',
        },
        {
          tip: "250g packs give the best per-cup value",
          detail:
            "All prices on ICB are normalized to 250g equivalent. At this range, a 250g bag gives you roughly 15–18 cups of pour-over. Work out your per-cup cost before assuming something is cheap or expensive.",
        },
      ],
      // Which roast levels and processes to expect
      whatToExpect: {
        roastLevels: ["medium-roast", "light-medium-roast", "dark-roast"],
        processes: ["washed", "natural", "honey"],
        roastNote:
          "Medium and light-medium roasts dominate this price range — most Indian roasters' entry offerings. Dark roasts and filter coffee blends are also well-represented, often from traditional roasters with established supply chains.",
        processNote:
          "Washed and natural are most common. Honey and anaerobic lots start appearing but are rarer — when you find them under ₹500, they're worth trying.",
      },
      // Normalized price disclosure
      priceNormalizationNote:
        "All prices are normalized to 250g equivalent across all pack sizes. A 100g bag at ₹200 and a 500g bag at ₹1,000 both appear as ₹400/250g. The price you pay on the roaster's site depends on the pack size you choose.",
      // ICB data note
      icbDataNote:
        "This is the largest price segment in the ICB catalogue — the majority of listed coffees fall under ₹500 normalized. It's also where community rating density is highest, giving you the most comparison data before you buy. Medium roasts from established Karnataka roasters consistently score well in this range.",
    },

    valueTips: [
      "Prioritize coffees with clear origin, roast date, and processing notes.",
      "250g bags often give the best per-cup value when you compare normalized prices.",
      "Use the directory filters to match roast and brew method to your setup — no need to overspend to get a great cup.",
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
          "Yes — most established Indian roasters have quality lots under ₹500. Focus on medium and light-medium roasts from Karnataka origins like Chikmagalur and Coorg. These are well-represented in this range and consistently rated well by the ICB community.",
      },
      {
        question: "What should I look for in budget specialty coffee?",
        answer:
          "Roast date (freshness beats price every time), clear origin information (estate name, region, process), and a roaster you can look up. Avoid coffees with vague descriptions like 'premium blend' — specificity is a quality signal.",
      },
      {
        question: "Are cheaper coffees lower quality?",
        answer:
          "Not at all — price reflects origin rarity, processing complexity, and roaster overhead, not just cup quality. Many excellent coffees land under ₹500 because the origin is accessible and the roaster runs efficient operations. The ICB community ratings are your best guide.",
      },
      {
        question: "Why does the price differ from the roaster's site?",
        answer:
          "ICB normalizes all prices to a 250g equivalent for fair comparison across different pack sizes. The actual price you pay on the roaster's site depends on which pack size you choose — a 500g bag will cost more in total but the same or less per 250g.",
      },
      {
        question: "How many cups do I get per bag?",
        answer:
          "A 250g bag gives roughly 15–18 cups of pour-over at a 1:15 ratio, or 12–15 cups of French Press at a slightly higher dose. At ₹500 normalized, that's under ₹35 per cup — significantly cheaper than any café.",
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
    related: ["light-roast", "medium-roast", "mid-range", "washed"],
  },

  {
    slug: "mid-range",
    type: "price_bucket",
    h1: "Best Coffees Between ₹500–₹1000 in India",
    displayRange: "₹500–₹1000",
    ctaLabel: "Browse all mid-range coffees",
    intro:
      "Explore premium Indian specialty coffees in the ₹500–₹1000 range — where processing gets interesting, estate provenance gets specific, and the community ratings get competitive.",
    headerNudge:
      "Where unique processing methods and exceptional quality meet.",
    gridNudge:
      "These coffees often feature natural, honey, or anaerobic processing for distinctive flavours.",
    heroBadge: "Premium Selection",
    utilityNudge:
      "Store properly and brew with care to fully appreciate these premium coffees.",

    priceBucketProfile: {
      whatYouGet:
        "₹500–₹1000 is where Indian specialty coffee gets genuinely interesting. At this range you'll find high-altitude single-estate lots with varietal specificity (SL-795, Chandragiri, Cauvery), experimental processing (honey, anaerobic natural, extended fermentation), and limited harvest lots that only appear seasonally. Most top-rated coffees in the ICB catalogue sit here. This isn't about paying more for the same thing — the processing complexity and sourcing transparency at this price point are qualitatively different from the sub-₹500 range.",
      buyingGuide: [
        {
          tip: "Look for processing specificity",
          detail:
            "At this price, you should know exactly what process was used — not just 'natural' but ideally the fermentation approach, drying method, and duration. Red honey, anaerobic natural, extended washed fermentation — these details tell you what you're buying.",
        },
        {
          tip: "Check for varietal information",
          detail:
            "SL-795, Chandragiri, Cauvery, and S795 are Indian arabica varieties with distinct cup profiles. Lots that specify varietal are usually better sourced and more transparently produced. If the roaster knows the variety, they know the producer.",
        },
        {
          tip: "Compare tasting notes across roasters for the same region",
          detail:
            "Two roasters might both carry a Chikmagalur natural — compare their tasting notes side by side on ICB before buying. Community ratings and reviews give you actual buyer experience rather than marketing copy.",
        },
      ],
      whatToExpect: {
        roastLevels: ["light-roast", "light-medium-roast", "medium-roast"],
        processes: ["natural", "honey", "anaerobic", "washed"],
        roastNote:
          "Light and light-medium roasts dominate the top end of this range — roasters producing high-quality lots tend to roast lighter to preserve the processing and terroir investment. Medium roasts are also well-represented.",
        processNote:
          "Natural, honey, and anaerobic lots are heavily concentrated here — these processes add cost and complexity, and producers price accordingly. You'll also find the best washed estate lots in this range.",
      },
      priceNormalizationNote:
        "All prices are normalized to 250g equivalent across all pack sizes. A 100g bag at ₹300 and a 500g bag at ₹1,500 both appear as ₹600/250g. The price you pay on the roaster's site depends on which pack size you choose.",
      icbDataNote:
        "The ₹500–₹1000 range contains the highest concentration of top-rated coffees in the ICB catalogue — community ratings are most competitive here. Natural and honey lots from Chikmagalur and Coorg estates dominate the highest-rated spots. This is where the ICB rating data is most useful — use it before buying.",
    },

    valueTips: [
      "Look for unique processing (natural, honey, anaerobic) and transparent farm or estate names.",
      "Limited lots often land in this band — compare tasting notes across roasters before you commit.",
      "Check freshness and brew recipes on the label — premium beans reward careful grinding and water temperature.",
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
          "Processing complexity, sourcing transparency, and estate specificity. You'll find natural, honey, and anaerobic lots with named estates, varietal information, and harvest dates — details that aren't economically viable at lower price points.",
      },
      {
        question: "Are these coffees worth the price?",
        answer:
          "For the right buyer, yes. If you're curious about what processing actually does to flavour, or want to understand Indian terroir differences between Chikmagalur and Araku, this is where that exploration becomes meaningful. Use ICB community ratings to narrow down before buying.",
      },
      {
        question: "What is SL-795 and why does it matter?",
        answer:
          "SL-795 is India's most celebrated arabica variety — developed at the Scott Laboratories in the 1940s and still widely grown in Karnataka. At high altitude with washed processing, it produces jasmine, stone fruit, and bright acidity that's world-competitive. Most top-rated Indian coffees in this price range are SL-795.",
      },
      {
        question: "How should I store premium coffee?",
        answer:
          "Airtight container, away from light, heat, and moisture. Grind just before brewing. Use within 2–3 weeks of roast date for best flavour — premium beans are more sensitive to staleness than commodity coffee.",
      },
      {
        question: "Why does the price differ from the roaster's site?",
        answer:
          "ICB normalizes all prices to a 250g equivalent for fair comparison across pack sizes. The actual price on the roaster's site depends on which pack size you buy.",
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
    related: ["natural", "honey", "light-roast", "budget"],
  },
];
