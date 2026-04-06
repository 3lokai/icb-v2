// src/lib/discovery/landing-pages/roast-level-pages.ts
import type { RoastLevelEnum } from "@/types/db-enums";
import type { RoastLevelLandingPageConfig } from "./types";

export const roastLevelPages: RoastLevelLandingPageConfig[] = [
  {
    slug: "light-roast",
    type: "roast_level",
    h1: "Light Roast Coffee in India",
    intro:
      "Discover Indian specialty coffees roasted light to highlight origin characteristics, bright acidity, and delicate flavor notes. The least processed roast — and the most expressive of where the coffee came from.",
    headerNudge:
      "Best for those who love bright, tea-like coffees with complex origin notes.",
    teaserTitle: "Top Rated Light Roasts",
    teaserDescription:
      "Bright, acidic, and complex coffees roasted to preserve origin characteristics.",
    gridNudge:
      "Pour-over methods like V60 and AeroPress really make these coffees sing.",
    heroBackgroundImage: "/images/discovery/light-roast-hero.avif",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Use higher water temperatures (95-100°C) to fully extract light roast complexity.",
    faqOverline: "Light Roast Queries",
    faqTitle: "Understanding *Light Roast* Coffee",
    faqDescription:
      "Common questions about light roast coffees and how to brew them perfectly.",
    faqBadge: "Knowledge Base",

    roastProfile: {
      // Visual characteristics
      visual: {
        color: "Pale to medium brown — no surface oil",
        density: "Denser bean — retains more moisture",
        grindNote: "Grinds lighter in colour; fines can appear almost sandy",
        agtronRange: "Agtron 60–75 (light end of the specialty range)",
      },
      // What happens during roasting
      roastingProcess: {
        stage: "Stopped at or just after first crack",
        firstCrack: "Reached — the defining boundary for light roast",
        secondCrack: "Not reached — no caramelisation of sugars",
        developmentNote:
          "Short development time preserves volatile aromatics and fruit-forward acids. Roasters targeting specialty profiles often stop within 30–60 seconds of first crack.",
      },
      // Flavour profile anchored to Indian coffees
      flavourProfile: {
        typical: [
          "Bright acidity",
          "Stone fruit",
          "Floral",
          "Citrus",
          "Tea-like body",
        ],
        indianContext:
          "Indian light roasts from Chikmagalur and Coorg tend toward stone fruit and jasmine. Araku Valley lights often show more citrus and bergamot. Natural-processed light roasts from Karnataka estates can push into blueberry and tropical fruit territory.",
      },
      // Brew parameters
      brewParams: {
        waterTemp: "95–100°C",
        ratio: "1:15–1:17",
        brewTime: "3–4 min (pour over), 1.5–2 min (AeroPress)",
        note: "Higher temperatures are needed to fully extract the complex acids in lightly roasted beans. Under-extraction is the most common mistake.",
      },
      // Brew method pairing
      brewMethods: ["v60", "aeropress", "chemex", "kalita", "espresso"],
      // Who it's for
      whoIsItFor:
        "If you're switching from dark roast or instant coffee, light roast will taste unfamiliar at first — less bitter, more acidic, almost fruity. Give it 2–3 brews before judging. If you love tea, wine, or fresh fruit juice, this is likely your roast level.",
      // ICB data callout — populate dynamically if possible, or update quarterly
      icbDataNote:
        "Light roast has 192 coffees in the ICB catalogue with a community average rating of 4.08 across 26 ratings. Natural light roasts are less common than washed but tend to score higher — consistent with the natural process category's overall average of 4.64 being the highest in the catalogue.",
    },

    filter: {
      roast_levels: ["light"] satisfies RoastLevelEnum[],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines a light roast coffee?",
        answer:
          "Light roasts are stopped at or just after first crack, preserving origin flavors, bright acidity, and complex aromatics. The bean retains more density and moisture than darker roasts, and the surface is dry with no visible oil.",
      },
      {
        question: "What brewing methods work best with light roasts?",
        answer:
          "Pour-over methods like V60, Chemex, and AeroPress excel with light roasts — they highlight clarity and delicate flavors. Use higher water temperatures (95–100°C) for full extraction. Espresso is possible but requires careful dialling in.",
      },
      {
        question: "Are light roasts more acidic?",
        answer:
          "Yes — light roasts retain more of the bean's natural acids, which express as brightness rather than sourness when properly extracted. If a light roast tastes sour, it's under-extracted: try a finer grind or higher temperature.",
      },
      {
        question: "Do light roasts have more caffeine?",
        answer:
          "Marginally — caffeine degrades slightly with heat, so lighter roasts retain fractionally more. In practice the difference is negligible. What matters more is your dose and brew ratio.",
      },
      {
        question: "Can I use light roast for espresso?",
        answer:
          "While tricky, light roast espresso pulls out brilliant vibrant fruit notes. It requires very fine grinding, high temperatures, and longer yield ratios (like 1:2.5 or 1:3) to effectively extract sweetness and avoid tasting overly sour.",
      },
      {
        question: "Why do light roasts taste sour sometimes?",
        answer:
          "Sourness usually indicates under-extraction. Light roasts are very dense and harder to extract. If it tastes sour, try grinding finer, using hotter water (near boiling), or increasing your brew time to pull out more balancing sweetness.",
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
    related: ["aeropress", "v60", "natural", "light-medium-roast"],
  },

  {
    slug: "light-medium-roast",
    type: "roast_level",
    h1: "Light-Medium Roast Coffee in India",
    intro:
      "Explore Indian specialty coffees roasted at light-medium levels — a balance of origin clarity and approachable sweetness. The everyday sweet spot for most pour-over drinkers.",
    headerNudge:
      "Great bridge roast if light feels too bright and medium feels too heavy.",
    teaserTitle: "Top Rated Light-Medium Roasts",
    teaserDescription:
      "Balanced cups with both origin character and gentle roast sweetness.",
    gridNudge:
      "Ideal for pour-over and AeroPress when you want clarity with a bit more body.",
    heroBackgroundImage: "/images/discovery/light-medium-roast-hero.avif",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Use standard brew temperatures (92–96°C) and tweak grind for sweetness.",
    faqOverline: "Light-Medium Roast Queries",
    faqTitle: "Understanding *Light-Medium Roast* Coffee",
    faqDescription:
      "Common questions about light-medium roasts and when to choose them.",
    faqBadge: "Knowledge Base",

    roastProfile: {
      visual: {
        color: "Medium brown — uniform, dry surface with no visible oil",
        density: "Slightly less dense than light; still firm to grind",
        grindNote:
          "Grinds evenly; medium-brown powder with good aromatic release",
        agtronRange: "Agtron 50–60 (mid-specialty range)",
      },
      roastingProcess: {
        stage:
          "Stopped shortly after first crack with slightly longer development",
        firstCrack: "Reached and developed past",
        secondCrack: "Not reached",
        developmentNote:
          "A longer development window than light roast adds body and sweetness while still preserving most origin character. Common in Indian specialty roasting — many roasters target this range for their flagship offerings.",
      },
      flavourProfile: {
        typical: [
          "Balanced acidity",
          "Caramel sweetness",
          "Mild fruit",
          "Nutty",
          "Clean finish",
        ],
        indianContext:
          "This is the most common roast level for Indian specialty coffees on ICB. Chikmagalur and Coorg washed coffees at this level tend toward brown sugar, mild citrus, and clean milk chocolate. Honey-processed lots add stone fruit sweetness without the intensity of a full natural.",
      },
      brewParams: {
        waterTemp: "92–96°C",
        ratio: "1:15–1:16",
        brewTime: "3–4 min (pour over), 2–2.5 min (AeroPress)",
        note: "The most forgiving roast level to brew — tolerant of minor temperature and grind variations. A good starting point if you're new to specialty coffee.",
      },
      brewMethods: [
        "v60",
        "aeropress",
        "french-press",
        "chemex",
        "espresso",
        "moka-pot",
      ],
      whoIsItFor:
        "This is the entry roast for specialty coffee. If you're moving away from dark roast or commercial blends, light-medium gives you sweetness and body you're used to, with more flavour clarity than you've had before. Also the everyday roast for experienced drinkers who want consistency.",
      icbDataNote:
        "Light-medium is the most represented roast level in the ICB catalogue. It accounts for a significant share of coffees from established Indian roasters — most flagship single-origins from Blue Tokai, Third Wave, and Corridor Seven sit in this range.",
    },

    filter: {
      roast_levels: ["light_medium"] satisfies RoastLevelEnum[],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is a light-medium roast?",
        answer:
          "Stopped just after first crack with slightly more development time than a light roast. It preserves origin detail while adding body and sweetness — the most common roast level in Indian specialty coffee.",
      },
      {
        question: "Who should choose light-medium?",
        answer:
          "Anyone moving from commercial coffee into specialty, or specialty drinkers who find light roasts too acidic for daily use. It's the most forgiving roast level to brew consistently.",
      },
      {
        question: "What are the best brew methods for light-medium roasts?",
        answer:
          "Pour-over, AeroPress, and drip all work well. It's versatile enough for most setups and doesn't demand precision the way very light roasts do.",
      },
      {
        question: "Does light-medium roast coffee taste sour?",
        answer:
          "No, properly brewed light-medium roast coffee should not taste sour. The slightly longer roasting time softens the intense acidity found in light roasts, transforming it into a sweet, vibrant brightness often compared to ripe fruit.",
      },
      {
        question:
          "What is the difference between light and light-medium roast?",
        answer:
          "Light-medium roasts are kept in the roaster just a bit longer after first crack. This extra time allows more sugars to caramelize, giving you a sweeter, slightly heavier bodied cup while still retaining the coffee's unique origin flavors.",
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
    related: ["light-roast", "medium-roast", "v60", "washed"],
  },

  {
    slug: "medium-roast",
    type: "roast_level",
    h1: "Medium Roast Coffee in India",
    intro:
      "Explore Indian specialty coffees with balanced medium roasts — the perfect harmony between origin character and roast development. Versatile, approachable, and consistently satisfying across any brew method.",
    headerNudge:
      "The most versatile roast — works beautifully with any brewing method.",
    teaserTitle: "Top Rated Medium Roasts",
    teaserDescription:
      "Balanced chocolate, caramel, and mild acidity — the everyday sweet spot for most brew methods.",
    gridNudge:
      "Perfect for beginners and experts alike — forgiving and consistently delicious.",
    heroBackgroundImage: "/images/discovery/medium-roast-hero.avif",
    heroBadge: "Curated Selection",
    utilityNudge:
      "These coffees shine in espresso, pour-over, and French Press equally well.",
    faqOverline: "Medium Roast Queries",
    faqTitle: "Understanding *Medium Roast* Coffee",
    faqDescription:
      "Common questions about versatile medium roast coffees and their brewing methods.",
    faqBadge: "Knowledge Base",

    roastProfile: {
      visual: {
        color: "Medium to rich brown — dry surface, no oil",
        density: "Noticeably lighter than green bean; expanded cell structure",
        grindNote: "Grinds to a warm brown powder; aromatic on grind",
        agtronRange: "Agtron 40–50",
      },
      roastingProcess: {
        stage:
          "Well past first crack, approaching but not reaching second crack",
        firstCrack: "Well past",
        secondCrack: "Not reached — this distinguishes medium from dark",
        developmentNote:
          "Sugars are more developed than lighter roasts, producing caramel and chocolate notes. Most origin acidity is still present but softened. Indian roasters often use this level for espresso blends and approachable single-origins.",
      },
      flavourProfile: {
        typical: [
          "Chocolate",
          "Caramel",
          "Mild acidity",
          "Full body",
          "Brown sugar",
          "Nuts",
        ],
        indianContext:
          "Medium-roasted Indian arabicas from Karnataka often show milk chocolate, hazelnut, and gentle orange. Robusta blends at medium roast produce a heavier body and earthy sweetness — common in traditional South Indian filter coffee blends.",
      },
      brewParams: {
        waterTemp: "90–95°C",
        ratio: "1:14–1:16 (filter), 1:2–1:2.5 (espresso)",
        brewTime: "3–4 min (pour over), 25–30 sec (espresso)",
        note: "Medium roast is the most versatile for brew parameters — it's tolerant of a wide range of temperatures and ratios. A good default if you're not sure where to start.",
      },
      brewMethods: [
        "french-press",
        "aeropress",
        "v60",
        "filter-coffee",
        "espresso",
        "moka-pot",
        "cold-brew",
      ],
      whoIsItFor:
        "The default roast for most coffee drinkers. If you enjoy coffee with milk, this is your level — it holds up to milk without disappearing. If you drink black coffee and want something familiar but better than commercial brands, medium roast Indian specialty is the place to start.",
      icbDataNote:
        "Medium roast is the highest rated roast level in the ICB catalogue — community average of 4.49 across 53 ratings, more ratings than any other roast level. It also has the largest catalogue count at 245 coffees. If you want the most community comparison data before buying, medium roast is where to start.",
    },

    filter: {
      roast_levels: ["medium"] satisfies RoastLevelEnum[],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes medium roast coffee popular?",
        answer:
          "Medium roasts balance origin characteristics with roast flavors, producing approachable cups with good body, mild acidity, and chocolate or caramel notes. They work well across all brew methods and hold up to milk.",
      },
      {
        question: "Can I use medium roast for espresso?",
        answer:
          "Yes — medium roasts are excellent for espresso. They produce good crema, balanced extraction, and work well in milk drinks while retaining some origin character. Most Indian specialty espresso blends are medium roasted.",
      },
      {
        question: "What brewing methods suit medium roasts?",
        answer:
          "All of them. Medium roast is genuinely versatile — pour-over, French Press, espresso, moka pot, and South Indian filter all work well. Adjust grind size to the method rather than changing temperature significantly.",
      },
      {
        question: "Is medium roast stronger than dark roast?",
        answer:
          "Strength usually refers to caffeine content or flavor intensity. Medium roasts actually retain slightly more caffeine than dark roasts, but dark roasts have a bolder, smokier flavor. Medium roasts offer the most balanced complexity.",
      },
      {
        question: "Does medium roast coffee have oil on the beans?",
        answer:
          "No, high-quality medium roast coffee beans should have a dry surface. Oils visible on the surface of the bean generally indicate a much darker roast where the cellular structure has broken down enough to release internal lipids.",
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
    related: [
      "light-medium-roast",
      "medium-dark-roast",
      "french-press",
      "filter-coffee",
    ],
  },

  {
    slug: "medium-dark-roast",
    type: "roast_level",
    h1: "Medium-Dark Roast Coffee in India",
    intro:
      "Find Indian specialty coffees roasted to medium-dark — richer body, deeper sweetness, and bolder flavour while retaining some origin nuance. The roast for espresso lovers who want more than just bitterness.",
    headerNudge:
      "A great choice for fuller cups and lower perceived acidity without going fully dark.",
    teaserTitle: "Top Rated Medium-Dark Roasts",
    teaserDescription:
      "Richer, rounder profiles for espresso, French Press, and milk drinks.",
    gridNudge:
      "Great for espresso and French Press when you want boldness without heavy smokiness.",
    heroBackgroundImage: "/images/discovery/medium-dark-roast-hero.avif",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Lower temperatures (89–93°C) can help avoid bitterness on finer grinds.",
    faqOverline: "Medium-Dark Roast Queries",
    faqTitle: "Understanding *Medium-Dark Roast* Coffee",
    faqDescription:
      "Common questions about medium-dark profiles and brewing choices.",
    faqBadge: "Knowledge Base",

    roastProfile: {
      visual: {
        color: "Deep brown — light oil sheen beginning to appear on surface",
        density: "Noticeably lighter and more porous than medium",
        grindNote: "Darker brown powder; oils release quickly on grind",
        agtronRange: "Agtron 30–40",
      },
      roastingProcess: {
        stage:
          "Approaching second crack — some beans may just begin second crack",
        firstCrack: "Long past",
        secondCrack: "Beginning or just at threshold",
        developmentNote:
          "Sugars are heavily caramelised, producing dark chocolate and bittersweet notes. Origin character is receding but not fully masked — a skilled roaster can still preserve estate or regional character at this level.",
      },
      flavourProfile: {
        typical: [
          "Dark chocolate",
          "Toasted nuts",
          "Caramel",
          "Low acidity",
          "Heavy body",
          "Mild smokiness",
        ],
        indianContext:
          "Indian robusta at medium-dark is where traditional filter coffee blends live — bold, heavy body, low acid, designed to cut through hot milk. Arabica at this level from Karnataka estates often shows bittersweet chocolate and dried fruit without the smokiness of a full dark roast.",
      },
      brewParams: {
        waterTemp: "89–93°C",
        ratio: "1:13–1:15 (filter), 1:2–1:2.2 (espresso)",
        brewTime: "3–4 min (pour over / French Press), 25–28 sec (espresso)",
        note: "Lower temperatures than medium roast help manage bitterness. For espresso, a shorter pull time or coarser grind can balance the heavier body.",
      },
      brewMethods: [
        "french-press",
        "filter-coffee",
        "aeropress",
        "espresso",
        "moka-pot",
        "cold-brew",
      ],
      whoIsItFor:
        "Traditional South Indian filter coffee drinkers stepping into specialty will feel at home here — the body and boldness are familiar, but the quality of the bean is higher. Also suits espresso drinkers who find light-to-medium roast espresso too sour or thin.",
      icbDataNote:
        "Medium-dark is the dominant roast level for robusta and robusta-arabica blends in the ICB catalogue. Many traditional Indian roasters who are moving into specialty territory start here — it bridges the gap between commodity dark roast and full specialty.",
    },

    filter: {
      roast_levels: ["medium_dark"] satisfies RoastLevelEnum[],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "How is medium-dark different from medium roast?",
        answer:
          "Medium-dark has more caramelised sugars, heavier body, and lower perceived acidity. A light oil sheen may appear on the bean surface. Origin character is present but softer than a medium roast.",
      },
      {
        question: "How is it different from dark roast?",
        answer:
          "Medium-dark stops before or at the very beginning of second crack — it avoids the smoky, bitter notes that define a full dark roast. It's bolder than medium but more nuanced than dark.",
      },
      {
        question: "What are the best brewing methods for medium-dark roast?",
        answer:
          "Espresso, moka pot, French Press, and South Indian filter. It also works for milk-based drinks — the body holds up well to milk without becoming bitter or lost in the cup.",
      },
      {
        question: "Is medium-dark roast good for cold brew?",
        answer:
          "Yes! Medium-dark roasts are excellent for cold brew. Their heavier body, chocolatey sweetness, and lower natural acidity translate perfectly to the smooth, rich profile that cold brew drinkers love.",
      },
      {
        question: "Does medium-dark roast coffee have a lot of acid?",
        answer:
          "No, the longer roasting process of a medium-dark roast significantly reduces the bean's natural acidity. You can expect a smooth, heavy-bodied cup with deep, bold flavors rather than bright, fruity tartness.",
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
    related: ["medium-roast", "dark-roast", "french-press", "filter-coffee"],
  },

  {
    slug: "dark-roast",
    type: "roast_level",
    h1: "Dark Roast Coffee in India",
    intro:
      "Find Indian specialty coffees roasted dark for bold, intense flavour with low acidity and full body. The roast most associated with traditional Indian coffee culture — and now being reimagined by specialty roasters.",
    headerNudge:
      "Bold, full-bodied coffees with rich oils and intense flavors.",
    teaserTitle: "Top Rated Dark Roasts",
    teaserDescription:
      "Low-acid, heavy-bodied cups — from specialty bittersweet to traditional South Indian boldness.",
    gridNudge:
      "French Press and espresso methods really bring out the best in dark roasts.",
    heroBackgroundImage: "/images/discovery/dark-roast-hero.avif",
    heroBadge: "Curated Selection",
    utilityNudge:
      "Use lower water temperatures (87–90°C) to avoid bitterness and extract smooth flavors.",
    faqOverline: "Dark Roast Queries",
    faqTitle: "Understanding *Dark Roast* Coffee",
    faqDescription:
      "Common questions about bold dark roast coffees and brewing techniques.",
    faqBadge: "Knowledge Base",

    roastProfile: {
      visual: {
        color: "Deep brown to near-black — visible oil coating on the surface",
        density: "Significantly lighter and more porous than green bean",
        grindNote:
          "Very dark powder, oily to touch; clumps more than lighter roasts",
        agtronRange: "Agtron below 30",
      },
      roastingProcess: {
        stage: "Well into or past second crack",
        firstCrack: "Long past",
        secondCrack: "Reached and developed past — this defines dark roast",
        developmentNote:
          "At this stage, roast character dominates over origin character. Sugars are fully caramelised or beginning to carbonise. Oils migrate to the surface. Specialty dark roasts aim to stop just past second crack to preserve body and sweetness without going to char.",
      },
      flavourProfile: {
        typical: [
          "Dark chocolate",
          "Smoky",
          "Bitter cocoa",
          "Low acidity",
          "Heavy body",
          "Roasted nuts",
          "Molasses",
        ],
        indianContext:
          "Dark roast is deeply embedded in Indian coffee culture — the traditional South Indian filter blend is typically a dark-roasted robusta or robusta-arabica mix, sometimes with chicory added. Specialty dark roasts from Indian arabica estates are rarer but exist — they tend to show bittersweet chocolate and dried fruit rather than smoke when the roaster stops at second crack rather than past it.",
      },
      brewParams: {
        waterTemp: "87–90°C",
        ratio: "1:12–1:14 (filter), 1:2 (espresso)",
        brewTime: "4 min (French Press), 25–27 sec (espresso)",
        note: "Lower water temperatures are essential with dark roast — high temperatures extract more bitter compounds from already-developed sugars. Coarser grinds also help. If your dark roast tastes ashy, try cooler water first.",
      },
      brewMethods: [
        "french-press",
        "filter-coffee",
        "aeropress",
        "espresso",
        "moka-pot",
        "cold-brew",
      ],
      whoIsItFor:
        "Traditional Indian filter coffee drinkers, those who take coffee with a lot of milk and sugar, and anyone who finds lighter roasts too acidic or thin. Dark roast is also where cold brew shines — the low acidity and heavy body translate exceptionally well to cold extraction.",
      icbDataNote:
        "Dark roast has the lowest average community rating of any roast level in the ICB catalogue — 3.27 across 12 ratings — which reflects the mix of commodity blends and specialty lots in the 143-coffee segment. Traditional South Indian filter blends dominate the listings.",
    },

    filter: {
      roast_levels: ["dark"] satisfies RoastLevelEnum[],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines a dark roast coffee?",
        answer:
          "Dark roasts are taken well into or past second crack, producing bold, smoky flavours with low acidity and full body. Oils are visible on the bean surface. Roast character dominates over origin character at this level.",
      },
      {
        question: "Is dark roast bitter by definition?",
        answer:
          "Not necessarily — bitterness comes from over-extraction or taking the roast too far. A well-roasted dark stopped just past second crack can be smooth, rich, and bittersweet rather than harsh. Lower water temperatures and coarser grinds help significantly.",
      },
      {
        question: "Do dark roasts have less caffeine?",
        answer:
          "Marginally — caffeine degrades slightly with longer roasting. But the difference is minimal and less significant than your dose and brew ratio. The stronger flavour often makes people assume more caffeine.",
      },
      {
        question: "What brewing methods work best with dark roasts?",
        answer:
          "French Press, South Indian filter, espresso, and cold brew. These methods suit the heavy body and low acidity of dark roast. Use water at 87–90°C to avoid amplifying bitterness.",
      },
      {
        question: "Why are dark roast coffee beans oily?",
        answer:
          "The extended dark roasting process breaks down the cellular structure of the coffee bean much more than lighter roasts, causing its natural lipids (oils) to migrate to the surface. This is perfectly normal and contributes to a heavier mouthfeel.",
      },
      {
        question: "Is dark roast coffee good for cold brew?",
        answer:
          "Dark roast is a classic and highly popular choice for cold brew. The extended extraction process of cold water perfectly complements the smoky, chocolatey, and low-acid profile of dark roasted beans, resulting in a bold and smooth beverage.",
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
    related: [
      "medium-dark-roast",
      "french-press",
      "filter-coffee",
      "mid-range",
    ],
  },
];
