// src/lib/discovery/landing-pages/price-bucket-pages.ts
import type { LandingPageConfig } from "./types";

export const priceBucketPages: LandingPageConfig[] = [
  {
    slug: "budget",
    type: "price_bucket",
    h1: "Best Coffees Under ₹500 in India",
    entityLabel: "Under ₹500",
    displayRange: "Under ₹500",
    ctaLabel: "Browse all coffees under ₹500",
    intro:
      "Good Indian specialty coffee under ₹500 is more common than the price suggests. This is the value end of the catalogue — single-origin daily drinkers and approachable blends from established roasters, every one community-rated and normalized to 250g so you can compare honestly before you buy.",
    headerNudge:
      "Under ₹500 buys honest daily-drinker coffee — clean blends and dependable single origins, not leftovers.",
    gridNudge:
      "Look for 250g packs and coffees from well-known Indian origins for the best value.",
    heroBadge: "Best Value",
    utilityNudge:
      "Dial in your grind and ratio — technique closes most of the gap between a ₹400 bag and a ₹900 one.",

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
        roastLevels: ["medium-roast", "dark-roast", "medium-dark-roast"],
        processes: ["washed", "natural", "honey"],
        roastNote:
          "Medium roasts lead this price range, with dark and medium-dark roasts close behind — traditional, comfort-leaning profiles from roasters with established supply chains. Lighter roasts are comparatively rare under ₹500.",
        processNote:
          "Among coffees with a stated process, washed and natural are most common. Honey and anaerobic lots start appearing but are rarer — when you find them under ₹500, they're worth trying.",
      },
      // Normalized price disclosure
      priceNormalizationNote:
        "All prices are normalized to 250g equivalent across all pack sizes. A 100g bag at ₹200 and a 500g bag at ₹1,000 both appear as ₹400/250g. The price you pay on the roaster's site depends on the pack size you choose.",
      // ICB data note
      icbDataNote:
        "Under ₹500 is the value entry point to the catalogue — fewer coffees land here than in the ₹500–₹1000 range, and they're rated less often, so lean on the roast date and clear origin as much as the score. Medium roasts from established Karnataka roasters consistently show up well in this range.",
    },

    valueTips: [
      "Prioritize coffees with clear origin, roast date, and processing notes.",
      "250g bags often give the best per-cup value when you compare normalized prices.",
      "Use the directory filters to match roast and brew method to your setup — no need to overspend to get a great cup.",
    ],
    faqOverline: "Under ₹500",
    faqTitle: "Finding *Great Value* Coffee",
    faqDescription: "How to find genuinely good coffee without overspending.",
    faqBadge: "Price guide",
    filter: {
      max_price: 500,
    },
    sortOrder: "best_value",
    faqs: [
      {
        question: "Can I find good specialty coffee under ₹500?",
        answer:
          "Yes — most established Indian roasters have quality lots under ₹500. Medium, medium-dark, and dark roasts from Karnataka origins like Chikmagalur and Coorg are well-represented in this range and consistently rated well by the ICB community.",
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
    related: [
      "light-roast",
      "medium-roast",
      "mid-range",
      "under-1000",
      "washed",
    ],
  },

  {
    slug: "mid-range",
    type: "price_bucket",
    h1: "Best Coffees Between ₹500–₹1000 in India",
    entityLabel: "₹500–₹1000",
    displayRange: "₹500–₹1000",
    ctaLabel: "Browse all mid-range coffees",
    intro:
      "The ₹500–₹1000 range is where Indian specialty coffee gets interesting — processing turns experimental, estate provenance gets specific, and the community ratings turn genuinely competitive. Most of the catalogue's standout single origins live in this band.",
    headerNudge:
      "The range where naturals, honeys, and experimental ferments start showing up in force.",
    gridNudge:
      "These coffees often feature natural, honey, or anaerobic processing for distinctive flavours.",
    heroBadge: "Premium Selection",
    utilityNudge:
      "Keep the beans airtight and out of the light, and brew them fresh — provenance this specific earns the care.",

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
        roastLevels: ["medium-roast", "medium-dark-roast", "light-roast"],
        processes: ["washed", "natural", "anaerobic", "honey"],
        roastNote:
          "Roasts span the whole spectrum here, with medium the most common, followed by medium-dark and light. Roasters producing high-quality lots often roast lighter to preserve the processing and terroir investment.",
        processNote:
          "Washed lots lead by count, followed by natural — but this is also where experimental processing concentrates: anaerobic, honey, and double-fermented lots are far more common here than under ₹500. These processes add cost and complexity, and producers price accordingly.",
      },
      priceNormalizationNote:
        "All prices are normalized to 250g equivalent across all pack sizes. A 100g bag at ₹300 and a 500g bag at ₹1,500 both appear as ₹600/250g. The price you pay on the roaster's site depends on which pack size you choose.",
      icbDataNote:
        "The ₹500–₹1000 range is the largest and most-rated segment of the ICB catalogue, and it holds more top-rated coffees than any other price band — community ratings are most competitive here. This is where the ICB rating data is most useful, so use it before buying.",
    },

    valueTips: [
      "Look for unique processing (natural, honey, anaerobic) and transparent farm or estate names.",
      "Limited lots often land in this band — compare tasting notes across roasters before you commit.",
      "Check freshness and brew recipes on the label — premium beans reward careful grinding and water temperature.",
    ],
    faqOverline: "₹500–₹1000",
    faqTitle: "Exploring *Premium* Coffee",
    faqDescription: "What the extra spend actually buys you at this tier.",
    faqBadge: "Price guide",
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
    related: [
      "natural",
      "honey",
      "light-roast",
      "budget",
      "under-1000",
      "premium",
    ],
  },

  {
    slug: "under-1000",
    type: "price_bucket",
    h1: "Best Coffee Under ₹1000 in India",
    entityLabel: "Under ₹1000",
    displayRange: "Under ₹1000",
    seoTitle: "Best Coffee Under ₹1000 in India",
    metaDescription:
      "Compare the best Indian specialty coffees under ₹1000, ranked by community ratings. Filter by roast, process, region and brew method — real normalized prices.",
    ctaLabel: "Browse all coffees under ₹1000",
    intro:
      "Find the best coffee under ₹1000 in India — the full spectrum of specialty, from great-value daily drinkers to high-altitude single-estate lots. Every coffee here is community-rated and price-normalized to 250g, so you can compare like for like before you buy.",
    headerNudge:
      "₹1000 covers almost the entire Indian specialty range — value blends and experimental microlots both live here.",
    gridNudge:
      "Sorted by community rating. Look for clear origin, a recent roast date, and processing notes to spot the standouts.",
    heroBadge: "Best Rated Under ₹1000",
    utilityNudge:
      "Dial in your ratio and grind to get the most from whatever you pick in this range.",

    priceBucketProfile: {
      whatYouGet:
        "Under ₹1000 (normalized to 250g) is where the large majority of Indian specialty coffee lives — roughly four in five priced coffees in the catalogue. At the lower end you get clean, well-processed daily drinkers — medium roasts from Karnataka estates and approachable single origins. As you move toward ₹1000 you unlock high-altitude single-estate lots, named varieties (SL-795, Chandragiri, Cauvery), and experimental processing (honey, anaerobic natural, extended fermentation). Most of the catalogue's top-rated coffees sit inside this band — which is exactly why 'under ₹1000' is the sweet spot most buyers should start from.",
      buyingGuide: [
        {
          tip: "Decide your sub-tier before you shop under ₹1000",
          detail:
            "₹500–₹700 buys reliable, clean single origins and estate blends — your everyday cup. ₹700–₹1000 is where experimental processing and named-varietal microlots appear. Knowing which half you're shopping in keeps expectations (and value judgements) honest.",
        },
        {
          tip: "Prioritise roast date and clear origin",
          detail:
            "Freshness beats price at every tier. A ₹450 coffee roasted last week often outdrinks an ₹900 coffee that's two months old. Favour labels that print the roast date plus estate, region, and process — specificity is the strongest quality signal under ₹1000.",
        },
        {
          tip: "Use community ratings to break ties",
          detail:
            "This band is the most heavily rated part of the catalogue, so you rarely have to guess. When two coffees look similar on paper, compare their ICB ratings and tasting notes side by side rather than trusting marketing copy.",
        },
      ],
      whatToExpect: {
        roastLevels: ["medium-roast", "medium-dark-roast", "light-roast"],
        processes: ["washed", "natural", "anaerobic", "honey"],
        roastNote:
          "Medium roasts are the backbone of this range, with medium-dark and lighter roasts also well represented. Lighter roasts cluster toward the ₹1000 end, where producers roast to preserve terroir and processing investment.",
        processNote:
          "Washed lots lead by count, followed by natural. Anaerobic and honey lots become more common as you approach ₹1000 — these add cost and complexity, and producers price accordingly. The best washed estate lots also live near the top of this band.",
      },
      priceNormalizationNote:
        "All prices are normalized to a 250g equivalent across pack sizes, so a 100g bag at ₹300 and a 500g bag at ₹1,500 both appear as ₹600/250g. 'Under ₹1000' here means the normalized 250g price — the total you pay on the roaster's site depends on the pack size you choose.",
      icbDataNote:
        "Most of the ICB catalogue — and most of its top-rated coffees — falls under ₹1000 normalized, and this is the most heavily rated price range, giving you the most comparison data before you buy. Use the ratings to shortlist before committing.",
    },

    valueTips: [
      "Match the sub-tier to the occasion: ₹500–₹700 for daily brewing, ₹700–₹1000 for exploring processing and varieties.",
      "Sort by rating, then filter by your brew method and roast level to shortlist quickly.",
      "Check the roast date and buy 250g where you can — it usually gives the best per-cup value in this range.",
    ],
    faqOverline: "Best Coffee Under ₹1000",
    faqTitle: "Choosing Coffee *Under ₹1000*",
    faqDescription:
      "Picking well across the full ₹1000 range, from daily drinkers to standout lots.",
    faqBadge: "Price guide",
    filter: {
      max_price: 1000,
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is the best coffee under ₹1000 in India?",
        answer:
          "The best coffee under ₹1000 depends on how you brew, but the highest community-rated lots in this range are typically high-altitude Karnataka arabicas — washed SL-795 and natural or honey-processed lots from Chikmagalur and Coorg estates. Sort this page by rating and filter to your brew method to see the current top picks, all normalized to a 250g price.",
      },
      {
        question: "Is there a big difference between ₹500–₹700 and ₹700–₹1000?",
        answer:
          "Yes. ₹500–₹700 gets you clean, well-processed single origins and estate blends — excellent everyday coffee. ₹700–₹1000 is where experimental processing (honey, anaerobic, extended fermentation), named varieties, and limited harvest lots appear. Both are great value; they just serve different goals.",
      },
      {
        question: "What is SL-795 and why does it matter?",
        answer:
          "SL-795 is India's most celebrated arabica variety, developed at Scott Laboratories in the 1940s and still widely grown in Karnataka. At high altitude with washed processing it delivers jasmine, stone fruit, and bright acidity that's world-competitive — and many of the best-rated Indian coffees under ₹1000 are SL-795.",
      },
      {
        question: "How should I store coffee to keep it fresh?",
        answer:
          "Keep beans in an airtight container away from light, heat, and moisture, and grind just before brewing. Aim to use within 2–3 weeks of the roast date for peak flavour — the lighter, more delicate lots near the ₹1000 end are especially sensitive to staleness.",
      },
      {
        question: "Why does the price differ from the roaster's site?",
        answer:
          "ICB normalizes every price to a 250g equivalent for fair comparison across pack sizes. The actual amount you pay on the roaster's site depends on the pack size you choose — a 500g bag costs more in total but often the same or less per 250g.",
      },
    ],
    utilityCard: {
      type: "calculator",
      title: "Coffee Calculator",
      description:
        "Calculate the perfect coffee-to-water ratio for any coffee in this range.",
      href: "/tools/coffee-calculator",
      ctaText: "Try Calculator",
    },
    learnLinks: [
      {
        label: "Indian coffee varieties: S795, Chandragiri & Catuai",
        href: "/learn/indian-coffee-varietals-s795-chandragiri-catuai-selection-9",
      },
      {
        label: "Indian coffee regions: how geography shapes flavour",
        href: "/learn/indian-coffee-regions-geography-shapes-flavor",
      },
    ],
    related: ["budget", "mid-range", "light-roast", "natural", "premium"],
  },

  {
    slug: "premium",
    type: "price_bucket",
    h1: "Best Premium Coffee in India",
    entityLabel: "Over ₹1000",
    displayRange: "Over ₹1000",
    seoTitle: "Best Premium Coffee in India",
    metaDescription:
      "Discover the best premium Indian coffees over ₹1000 — competition-grade microlots, rare varieties, and experimental processing, ranked by community ratings.",
    ctaLabel: "Browse all premium coffees",
    intro:
      "Explore the best premium coffee in India — the top of the catalogue, above ₹1000 per 250g. This is where competition-grade microlots, sought-after varieties, and the most ambitious processing live. Every coffee here is community-rated and price-normalized to 250g, so even at the high end you can compare like for like.",
    headerNudge:
      "Above ₹1000 is small-batch territory — limited lots, experimental ferments, and beans roasters are proud to put their name on.",
    gridNudge:
      "Sorted by community rating. At this level, look for harvest dates, named producers, and a clear processing story.",
    heroBadge: "Top Rated Premium",
    utilityNudge:
      "Premium lots reward precision — dial in your grind, ratio, and water temperature to do them justice.",

    priceBucketProfile: {
      whatYouGet:
        "Above ₹1000 (normalized to 250g) is the top end of Indian specialty — the coffees roasters reserve for their best harvests. Expect competition-grade and award-winning microlots, premium and rare varieties (you'll find SLN-9, Catuai, SLN-795, Chandragiri, and even Geisha lots here), and the most ambitious processing on the market: anaerobic and carbonic-maceration ferments, double-fermented and other experimental lots alongside the cleanest washed and natural estate coffees. Traceability typically goes down to the producer and lot. You're paying for rarity and craft, not just a bigger bag.",
      buyingGuide: [
        {
          tip: "Treat these as experiences, not your daily driver",
          detail:
            "Premium lots are usually limited microlots bought to explore a specific variety, producer, or process — not to brew twice a day. Buy a smaller bag, taste deliberately, and note what you like so you can chase it again.",
        },
        {
          tip: "Demand full traceability at this price",
          detail:
            "Above ₹1000 you should know the estate, producer, variety, harvest date, and exact process — including the fermentation approach and duration. If a coffee this expensive is vague about its origin, that's a red flag.",
        },
        {
          tip: "Brew clean to reveal the lot",
          detail:
            "Most premium coffees are roasted light to light-medium to showcase processing and terroir. Favour pour-over or other filter methods, grind fresh, and use good water — milk and dark-roast habits will mask exactly what you paid for.",
        },
      ],
      whatToExpect: {
        roastLevels: ["medium-roast", "light-medium-roast", "light-roast"],
        processes: ["washed", "natural", "anaerobic", "experimental"],
        roastNote:
          "Roasts span medium, light-medium, and light fairly evenly — roasters tend to roast premium lots on the lighter side to protect the processing and terroir investment, though richer medium-roasted lots are equally well represented.",
        processNote:
          "Washed and natural estate lots still lead by count, but this band holds the catalogue's heaviest concentration of experimental processing — anaerobic, carbonic maceration, and double-fermented lots are far more common here than at lower prices.",
      },
      priceNormalizationNote:
        "All prices are normalized to a 250g equivalent across pack sizes. 250g is still the most common pack here, but premium lots also show up in smaller 100–200g sample sizes — 'Over ₹1000' refers to the normalized 250g price, so always check which pack size the roaster's headline price is for.",
      icbDataNote:
        "This is the most expensive tier in the ICB catalogue, and it carries the highest average community rating of any price band — these are the coffees buyers rate most highly. Fewer coffees here have been rated yet, and reviews come from a smaller, more experienced pool, so read them closely alongside the score before committing.",
    },

    valueTips: [
      "Start with a smaller pack where offered — it's a low-risk way to find out whether a variety or process is worth chasing.",
      "Sort by rating, then filter to your brew method — premium lots reward filter brewing over milk drinks.",
      "Check the harvest and roast dates; rarity is no excuse for stale coffee at this price.",
    ],
    faqOverline: "Premium Coffee Queries",
    faqTitle: "Buying *Premium* Coffee",
    faqDescription:
      "What you're actually paying for at the top of the Indian specialty range.",
    faqBadge: "Expert guide",
    filter: {
      min_price: 1000,
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is the best premium coffee in India?",
        answer:
          "The best premium Indian coffees over ₹1000 are typically competition-grade microlots — high-altitude estates running varieties like SLN-9, Catuai, Chandragiri, and Geisha through processing that ranges from meticulous washed and natural to anaerobic and carbonic maceration. This is the highest-rated price band in the ICB catalogue, so sort by community rating to see the current top picks, all normalized to a 250g price.",
      },
      {
        question: "Is premium coffee over ₹1000 worth it?",
        answer:
          "If you want to taste what Indian coffee can do at its absolute peak — a specific variety, producer, or rare process — then yes. These are experiences, not everyday coffee. For daily brewing, the under-₹1000 range offers better value; premium is for deliberate exploration.",
      },
      {
        question: "Why are some Indian coffees over ₹1000 per 250g?",
        answer:
          "Rarity and craft. Premium lots are small harvests of sought-after varieties, often run through labour-intensive experimental processing with full traceability to the producer and lot. Low volume, high effort, and high demand all push the normalized price above ₹1000.",
      },
      {
        question: "How should I brew and store premium coffee?",
        answer:
          "Brew light and clean — pour-over or filter, fresh grind, good water — to reveal the processing and terroir you paid for. Store beans airtight, away from light and heat, and use within 2–3 weeks of roast; delicate light-roasted premium lots fade fast.",
      },
      {
        question: "Why does the price differ from the roaster's site?",
        answer:
          "ICB normalizes every price to a 250g equivalent for fair comparison. Premium lots are sometimes sold in smaller sample packs, so the roaster's headline price can look lower while the normalized 250g value is higher — the total you pay depends on the pack size you choose.",
      },
    ],
    utilityCard: {
      type: "calculator",
      title: "Coffee Calculator",
      description:
        "Dial in the exact ratio and dose to get the most from a premium lot.",
      href: "/tools/coffee-calculator",
      ctaText: "Try Calculator",
    },
    learnLinks: [
      {
        label: "Indian coffee varieties: S795, Chandragiri & Catuai",
        href: "/learn/indian-coffee-varietals-s795-chandragiri-catuai-selection-9",
      },
      {
        label: "Indian coffee regions: how geography shapes flavour",
        href: "/learn/indian-coffee-regions-geography-shapes-flavor",
      },
    ],
    related: ["under-1000", "mid-range", "light-roast", "anaerobic"],
  },
];
