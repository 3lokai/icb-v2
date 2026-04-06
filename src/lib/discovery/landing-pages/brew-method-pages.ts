// src/lib/discovery/landing-pages/brew-method-pages.ts
import type { LandingPageConfig } from "./types";

export const brewMethodPages: LandingPageConfig[] = [
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

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Pressure-assisted immersion",
        howItWorks:
          "Coffee steeps in a chamber, then a plunger forces water through a paper or metal micro-filter under gentle pressure. The combination of immersion and pressure produces a clean, concentrated cup with more body than pour-over but less sediment than French Press.",
        keyAdvantage:
          "Extremely forgiving and fast — a full brew takes under 3 minutes. The pressure variable lets you experiment: longer steep with inverted method, shorter steep for espresso-style concentrate.",
        filterType: "Paper micro-filter (included) or reusable metal disk",
      },
      indianCoffeeContext:
        "AeroPress is arguably the best method for exploring Indian specialty coffees — its short brew time and pressure variable let you dial in wildly different profiles. Indian naturals from Karnataka produce jammy, concentrated cups on AeroPress that taste almost like a filter coffee-espresso hybrid. Washed Chikmagalur lots come out clean and bright. Araku naturals show tropical fruit with none of the funky edge you can get on longer pour-over brews. It's also forgiving enough for medium-dark roasts that would over-extract on V60.",
      commonMistakes: [
        {
          mistake: "Plunging too fast",
          fix: "Press slowly and steadily over 20–30 seconds. Rushing forces bitter compounds through the filter.",
        },
        {
          mistake: "Water too hot for dark roasts",
          fix: "Drop to 80–85°C for medium-dark and dark roasts. AeroPress amplifies bitterness from over-heated dark beans.",
        },
        {
          mistake: "Skipping the bloom",
          fix: "Add 2x coffee weight in water, stir, wait 30 seconds before filling. Indian naturals especially benefit — they off-gas significantly.",
        },
      ],
      roastPairing: {
        best: ["light-roast", "light-medium-roast", "medium-roast"],
        works: ["medium-dark-roast"],
        avoid:
          "Very dark roasts can turn harsh under AeroPress pressure — French Press handles them better.",
      },
      siblingMethods: [],
      icbDataNote:
        "AeroPress is listed as a recommended brew method across a significant share of light and light-medium roast coffees in the ICB catalogue. It's the most versatile brewer in our community's kit — referenced in more user reviews than any other single brewer.",
    },

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
          "AeroPress works well with most coffees, but medium to light roasts with balanced acidity and clear flavor notes tend to produce the best results. Indian naturals from Karnataka are particularly good — they produce jammy, concentrated cups.",
      },
      {
        question: "What grind size should I use for AeroPress?",
        answer:
          "Use a medium-fine grind, similar to table salt. This allows for proper extraction while preventing over-extraction from the pressure. Adjust finer if the cup tastes weak, coarser if it tastes bitter.",
      },
      {
        question: "Can I use dark roast coffee in AeroPress?",
        answer:
          "Yes, but drop water temperature to 80–85°C to avoid bitterness. Dark roasts work well with the inverted method and a longer steep time of 3–4 minutes.",
      },
      {
        question: "What is the inverted AeroPress method?",
        answer:
          "Flip the AeroPress upside down during brewing so water doesn't drip through until you're ready to press. It gives you more control over steep time — useful for lighter roasts where you want a longer extraction.",
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
    related: ["light-roast", "budget", "v60", "natural"],
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
      "Light roasts shine here — they reveal complexity that darker roasts can mask.",
    heroBackgroundImage: "/images/discovery/v60-hero.jpg",
    heroBadge: "Light to Medium Roast",
    utilityNudge:
      "Mastering the pour technique and bloom phase transforms your V60 results.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Gravity-fed pour-over with cone dripper",
        howItWorks:
          "Hot water is poured over grounds in a cone-shaped dripper with spiral ridges and a single large hole at the base. The ridges hold the paper filter away from the cone walls, allowing air to escape evenly and giving the brewer precise control over extraction through pour speed and technique.",
        keyAdvantage:
          "Maximum clarity and flavour transparency — V60 reveals origin character more clearly than almost any other brew method. The single hole means flow rate is determined entirely by grind size and pour technique, giving you precise extraction control.",
        filterType:
          "Thin paper filter — removes oils and fines for a very clean cup",
      },
      indianCoffeeContext:
        "V60 is where Indian washed coffees from Chikmagalur and Coorg show their best. The clarity of the brew lets the terroir speak — SL-795 washed lots from high-altitude estates come through with jasmine, stone fruit, and clean acidity that would be muddied in French Press. Indian naturals are excellent on V60 too but extract faster — a slightly coarser grind and shorter pour helps. Araku Valley light roasts are exceptional on V60: the citrus and bergamot notes that define the region's identity are cleanest through a thin paper filter.",
      commonMistakes: [
        {
          mistake: "Pouring too fast",
          fix: "Slow, controlled pours in concentric circles keep the bed even. Rushing channels water through one path and underextracts the rest.",
        },
        {
          mistake: "Skipping or rushing the bloom",
          fix: "Pour 2–3x coffee weight in water, wait 30–45 seconds. Indian coffees, especially naturals, release significant CO2 — skipping bloom produces uneven extraction.",
        },
        {
          mistake: "Grind too coarse for light roasts",
          fix: "Light roasts are denser and need a finer grind than you'd expect. If the brew finishes in under 2.5 minutes and tastes sour, grind finer.",
        },
      ],
      roastPairing: {
        best: ["light-roast", "light-medium-roast"],
        works: ["medium-roast"],
        avoid:
          "Dark roasts lose nuance on V60 and can taste flat — French Press or filter coffee brings them out better.",
      },
      siblingMethods: ["chemex", "kalita"],
      icbDataNote:
        "V60 and pour-over are the most commonly recommended brew methods for light and light-medium roast coffees in the ICB catalogue. Washed single-origins from Chikmagalur and Coorg estates dominate the top-rated coffees filtered to pour-over.",
    },

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
          "V60's spiral ridges and large single hole allow for precise control over extraction, making it ideal for highlighting delicate flavor notes. It produces a cleaner, more transparent cup than immersion methods — origin character comes through clearly.",
      },
      {
        question: "What roast level works best with V60?",
        answer:
          "Light to medium roasts work best. V60 excels at extracting bright, clean flavours — Indian washed coffees from Chikmagalur and Araku naturals are particularly good. Dark roasts tend to taste flat rather than bold on V60.",
      },
      {
        question: "How long should a V60 brew take?",
        answer:
          "3–4 minutes total, including a 30–45 second bloom. If it finishes under 2.5 minutes, grind finer. If it takes over 5 minutes, grind coarser. Brew time is your main diagnostic tool.",
      },
      {
        question: "V60 vs AeroPress — which should I start with?",
        answer:
          "AeroPress is more forgiving and faster — better for beginners or those who want flexibility. V60 rewards technique and produces a cleaner cup — better if you want to explore origin flavours precisely. Both work well with Indian specialty coffees.",
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
    related: ["light-roast", "medium-roast", "aeropress", "washed"],
  },

  {
    slug: "chemex",
    type: "brew_method",
    h1: "Best Coffees for Chemex in India",
    intro:
      "Discover Indian specialty coffees suited to Chemex brewing — clean cups, silky body, and remarkable clarity from a slower drawdown and thick bonded filter paper.",
    headerNudge:
      "Chemex highlights sweetness and clarity — choose coffees with defined origin character.",
    teaserTitle: "Top Rated Coffees for Chemex",
    teaserDescription:
      "Pour-over friendly lots that shine with Chemex's classic paper filter profile.",
    gridNudge:
      "Use a medium-coarse grind and keep a steady spiral pour for even extraction.",
    heroBadge: "Pour Over",
    utilityNudge:
      "A slightly coarser grind than V60 often works best for Chemex's slower flow.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Gravity-fed pour-over with thick bonded filter",
        howItWorks:
          "Water pours through a thick bonded paper filter — 20–30% thicker than standard filters — into an elegant hourglass vessel. The thick filter removes almost all oils and fine particles, producing one of the cleanest cups possible. The slower drawdown gives more contact time than V60.",
        keyAdvantage:
          "Exceptionally clean, almost tea-like clarity. The thick filter removes oils that V60 and AeroPress let through — if you want to taste only the pure flavour of the coffee without any body or texture, Chemex is the answer.",
        filterType: "Thick bonded paper filter — maximum oil and fine removal",
      },
      indianCoffeeContext:
        "Chemex rewards Indian coffees with inherent sweetness and defined fruit character — the filter strips out any murkiness and lets clean acidity and floral notes come forward. Washed light roasts from Chikmagalur estates are exceptional on Chemex: jasmine, peach, and clean citrus come through with none of the heaviness you'd get on French Press. Honey-processed light-mediums from Coorg are also worth trying — the sweetness translates beautifully. Avoid very heavy naturals on Chemex — the thick filter can mute the fruit intensity that makes them interesting.",
      commonMistakes: [
        {
          mistake: "Grinding too fine",
          fix: "Chemex needs a medium-coarse grind — finer than French Press but coarser than V60. Too fine and the thick filter chokes, brew takes 8+ minutes and over-extracts.",
        },
        {
          mistake: "Uneven pour",
          fix: "Keep a steady spiral pour starting from the centre. The larger vessel makes channelling more likely — slow and controlled matters more here than on V60.",
        },
        {
          mistake: "Too small a batch",
          fix: "Chemex performs best at 400ml+ of water. Smaller batches don't fill the filter properly and extract unevenly. It's a batch brewer — use it as one.",
        },
      ],
      roastPairing: {
        best: ["light-roast", "light-medium-roast"],
        works: ["medium-roast"],
        avoid:
          "Heavy naturals and dark roasts — the thick filter mutes body and intensity that these coffees depend on.",
      },
      siblingMethods: ["v60", "kalita"],
      icbDataNote:
        "Chemex ownership is less common in India than V60 or AeroPress, but the coffees that suit it — washed light roasts from Karnataka estates — are well represented in the ICB catalogue. The same pour-over filter on ICB surfaces these lots.",
    },

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
        question: "Why use Chemex instead of V60?",
        answer:
          "The thick bonded filter removes more oils and fines than V60, giving an exceptionally clean, almost tea-like cup. If you want maximum clarity and don't mind a slower brew, Chemex is worth it.",
      },
      {
        question: "What Indian coffees work best on Chemex?",
        answer:
          "Washed light roasts from Chikmagalur and honey-processed light-mediums from Coorg are excellent — the filter lets their clean acidity and sweetness come through clearly. Avoid very heavy naturals — the thick filter mutes the body.",
      },
      {
        question: "Grind size for Chemex?",
        answer:
          "Medium-coarse — coarser than V60, finer than French Press. If your brew takes over 6 minutes, grind coarser. Under 3 minutes, grind finer. Target 4–5 minutes total.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Pour-over recipes",
      description: "Dial in pour-over recipes and ratios for cleaner cups.",
      href: "/tools/expert-recipes?method=v60",
      ctaText: "View Recipes",
    },
    related: ["kalita", "v60", "light-roast", "washed"],
  },

  {
    slug: "kalita",
    type: "brew_method",
    h1: "Best Coffees for Kalita Wave in India",
    intro:
      "Find Indian specialty coffees that work beautifully on the Kalita Wave — balanced extraction, forgiving flat bed, and consistent pour-over results every time.",
    headerNudge:
      "Kalita's flat bottom and wave filters encourage even extraction — great for daily pour overs.",
    teaserTitle: "Top Rated Coffees for Kalita Wave",
    teaserDescription:
      "Coffees that reward Kalita's steady flow and balanced profile.",
    gridNudge: "Try a medium-fine grind and pulse pours to keep the bed flat.",
    heroBadge: "Pour Over",
    utilityNudge:
      "Slightly finer grind than Chemex is common — tune to your drawdown time.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Flat-bed gravity pour-over with wave filter",
        howItWorks:
          "Unlike V60's cone, the Kalita Wave has a flat bottom with three small holes. The proprietary wave filter sits away from the dripper walls, creating an even bed of coffee rather than a cone. Water passes through more evenly, reducing the risk of channelling.",
        keyAdvantage:
          "The most forgiving pour-over for beginners. The flat bed means pour technique matters less than on V60 — even an imperfect pour produces a consistent extraction. The wave filter also insulates the brew bed, keeping temperature stable throughout.",
        filterType:
          "Proprietary wave paper filter — medium oil retention, even extraction",
      },
      indianCoffeeContext:
        "Kalita Wave is a strong everyday brewer for Indian specialty coffees — its consistency makes it reliable across different origins and roast levels. Light-medium washed coffees from Karnataka estates produce a balanced, clean cup that's slightly more forgiving than V60. Indian naturals work particularly well on Kalita — the flat bed slows extraction slightly compared to V60, which prevents the over-extraction that can turn heavy Indian naturals muddy. For daily drinkers who want pour-over quality without V60's precision demands, Kalita is the answer.",
      commonMistakes: [
        {
          mistake: "Using V60 filters",
          fix: "Kalita Wave requires its own wave-style filters — they're shaped to sit away from the dripper walls. Standard cone filters don't work and will choke the brew.",
        },
        {
          mistake: "Single continuous pour",
          fix: "Pulse pours — 3–4 additions of water rather than one continuous pour — keep the flat bed even and prevent the grounds from drying out between pours.",
        },
        {
          mistake: "Grinding too coarse",
          fix: "Kalita's three small holes restrict flow less than V60's single large hole — grind medium-fine, not medium-coarse. Too coarse and the cup will taste weak.",
        },
      ],
      roastPairing: {
        best: ["light-medium-roast", "medium-roast"],
        works: ["light-roast", "medium-dark-roast"],
        avoid:
          "Very dark roasts — the even extraction highlights bitterness rather than hiding it.",
      },
      siblingMethods: ["v60", "chemex"],
      icbDataNote:
        "Kalita Wave ownership is growing in the Indian specialty community but remains less common than V60 and AeroPress. The pour-over filter on ICB captures the same coffees — washed and honey-processed light-mediums from Karnataka are the sweet spot.",
    },

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
          "Yes — the flat bed and three small holes are more forgiving of imperfect pour technique. You still get a clean pour-over cup, but consistency is easier to achieve. A good starting pour-over if V60 feels too demanding.",
      },
      {
        question: "Same coffees as V60?",
        answer:
          "Mostly yes — both suit washed and honey light roasts from Indian estates. The difference is in the cup: Kalita produces a slightly rounder, more balanced result; V60 is more transparent and precise.",
      },
      {
        question: "Kalita Wave grind size?",
        answer:
          "Medium-fine — between V60 (finer) and Chemex (coarser). Target a 3–4 minute brew time. Adjust grind if you're outside that window.",
      },
      {
        question: "Do I need specific Kalita filters?",
        answer:
          "Yes — the wave filters are proprietary and the shape matters. They create an air gap between the filter and the dripper walls that's essential for even extraction. Standard cone filters won't work.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Pour-over recipes",
      description: "Recipes and ratios for pour-over brewers.",
      href: "/tools/expert-recipes?method=v60",
      ctaText: "View Recipes",
    },
    related: ["chemex", "v60", "medium-roast", "honey"],
  },

  {
    slug: "french-press",
    type: "brew_method",
    h1: "Best Coffees for French Press in India",
    intro:
      "Explore Indian specialty coffees that excel in French Press brewing. These coffees deliver full-bodied, rich cups with deep flavors and natural oils — the closest specialty equivalent to traditional Indian filter coffee.",
    headerNudge:
      "Ideal for bold, full-bodied cups that showcase natural coffee oils.",
    gridNudge:
      "Medium to dark roasts work best — they develop rich body during the immersion steep.",
    heroBadge: "Medium to Dark Roast",
    utilityNudge:
      "A coarse grind and consistent 4-minute steep time are key to French Press success.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Full immersion with metal mesh filter",
        howItWorks:
          "Coffee grounds steep fully submerged in hot water for 4 minutes, then a metal mesh plunger is pressed down to separate grounds from liquid. Unlike paper-filtered methods, the metal mesh allows oils and fine particles through — producing a heavier, fuller-bodied cup with more texture.",
        keyAdvantage:
          "The richest, most full-bodied brew method. Coffee oils that paper filters strip away stay in the cup — this is where Indian robusta blends and heavy natural-processed arabicas shine. Also the most forgiving grind method: coarse and consistent is all you need.",
        filterType: "Metal mesh — oils and fines pass through for full body",
      },
      indianCoffeeContext:
        "French Press has a natural affinity with Indian coffee culture — the full body and low acidity profile mirrors what filter coffee drinkers are used to. Medium-dark arabica from Karnataka and robusta-arabica blends produce exceptional French Press cups: chocolate, nuts, low acid, heavy body. Indian naturals from Coorg at medium roast are a revelation on French Press — the fruit notes become jammy and rich rather than sharp. Traditional South Indian filter coffee blends, which are usually dark-roasted robusta, translate directly to French Press for anyone wanting filter coffee quality without the traditional apparatus.",
      commonMistakes: [
        {
          mistake: "Grinding too fine",
          fix: "Fine grounds slip through the metal mesh and make the cup gritty and over-extracted. Use a coarse grind — similar to sea salt or coarse breadcrumbs.",
        },
        {
          mistake: "Leaving it to steep too long",
          fix: "Press at exactly 4 minutes and pour immediately — don't leave it sitting on the grounds. Every extra minute increases bitterness significantly.",
        },
        {
          mistake: "Plunging with force",
          fix: "Press slowly and steadily. Forcing the plunger stirs up sediment and pushes fines through the mesh into your cup.",
        },
      ],
      roastPairing: {
        best: ["medium-roast", "medium-dark-roast", "dark-roast"],
        works: ["light-medium-roast"],
        avoid:
          "Very light roasts — the immersion can over-extract their delicate acids into sourness. V60 or AeroPress handle them better.",
      },
      siblingMethods: ["cold-brew"],
      icbDataNote:
        "French Press is the most recommended brew method for medium-dark and dark roast coffees in the ICB catalogue. It's also strongly represented in traditional South Indian filter coffee blends — if you're looking for specialty-grade filter coffee alternatives, this is the filter to use on ICB.",
    },

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
          "Medium to dark roasts with bold, rich flavours work exceptionally well — the immersion extracts oils and body that complement these profiles. Indian naturals at medium roast and traditional South Indian filter blends are particularly good.",
      },
      {
        question: "What grind size should I use?",
        answer:
          "Coarse — similar to sea salt or coarse breadcrumbs. This prevents over-extraction and keeps sediment out of your cup while allowing full extraction during the 4-minute steep.",
      },
      {
        question: "How long should I steep French Press coffee?",
        answer:
          "Exactly 4 minutes. Stir once after adding water, then leave undisturbed. Press slowly and pour immediately — don't leave the coffee sitting on the grounds or it keeps extracting and turns bitter.",
      },
      {
        question: "Is French Press similar to South Indian filter coffee?",
        answer:
          "In spirit, yes — both are full-immersion methods that produce heavy-bodied, low-acid cups. French Press is cleaner (no chicory, no decoction step) but the body and boldness feel familiar. Medium-dark Indian robusta-arabica blends on French Press are the closest specialty equivalent.",
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
    related: [
      "medium-roast",
      "dark-roast",
      "mid-range",
      "filter-coffee",
      "espresso",
      "cold-brew",
    ],
  },

  {
    slug: "espresso",
    type: "brew_method",
    h1: "Best Coffees for Espresso in India",
    intro:
      "Discover Indian specialty coffees crafted for espresso extraction — rich crema, intense flavour, and the concentrated body that defines the perfect shot. These coffees are selected for their ability to produce balanced, syrupy espresso with distinctly Indian character.",
    headerNudge:
      "Espresso rewards medium to dark roasts with chocolatey, nutty, and caramel profiles.",
    teaserTitle: "Top Rated Coffees for Espresso",
    teaserDescription:
      "Coffees selected for their espresso performance — crema quality, body, and balance under pressure.",
    gridNudge:
      "Look for medium-dark roasts from Karnataka estates — they pull rich, balanced shots with natural sweetness.",
    heroBackgroundImage: "/images/discovery/espresso-hero.jpg",
    heroBadge: "Medium to Dark Roast",
    utilityNudge:
      "Dialling in grind size and dose is critical — small changes make a big difference in espresso.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "High-pressure forced extraction (9 bars)",
        howItWorks:
          "Hot water is forced through a tightly packed bed of finely ground coffee at approximately 9 bars of pressure. The combination of pressure, fine grind, and short contact time (25–30 seconds) extracts a concentrated shot with dissolved solids, oils, and CO2 that forms the characteristic crema layer on top.",
        keyAdvantage:
          "Maximum intensity and concentration — espresso extracts more dissolved flavour per gram of coffee than any other method. The pressure creates emulsified oils and crema that no gravity-based brewer can produce. Serves as the base for milk drinks like cappuccinos and lattes.",
        filterType:
          "Metal portafilter basket — no paper, all oils and body pass through",
      },
      indianCoffeeContext:
        "India has a deep espresso culture — from the Italian-style café scene in metros to the espresso-based drinks at specialty roasters like Blue Tokai, Corridor Seven, and Third Wave. Indian coffees, particularly medium-dark arabica from Chikmagalur and Coorg, produce exceptional espresso: chocolate, caramel, and roasted nut notes with enough body to cut through milk. Robusta-arabica blends from Karnataka are classic espresso material — the robusta adds crema thickness and body while arabica contributes sweetness and complexity. Monsooned Malabar, with its low acidity and heavy body, is a legendary espresso component — Italian roasters have used it in blends for decades. For single-origin espresso, look for honey-processed or natural medium roasts — they deliver the sweetness and body that espresso demands.",
      commonMistakes: [
        {
          mistake: "Grind too coarse",
          fix: "Espresso requires an extra-fine grind — if the shot runs in under 20 seconds, grind finer. The espresso should flow like warm honey, not water.",
        },
        {
          mistake: "Not warming up the machine",
          fix: "Run water through the group head and warm your cup before pulling a shot. Cold metal drops brew temperature significantly and produces sour, under-extracted shots.",
        },
        {
          mistake: "Using light roasts without adjustment",
          fix: "Light roasts are denser and harder to extract under pressure. If you must use them, grind significantly finer and increase dose. Most Indian light roasts perform better on pour-over.",
        },
      ],
      roastPairing: {
        best: ["medium-roast", "medium-dark-roast", "dark-roast"],
        works: ["light-medium-roast"],
        avoid:
          "Very light roasts — they tend to pull sour, thin shots without enough body for espresso. V60 or AeroPress will serve them better.",
      },
      siblingMethods: ["moka-pot"],
      icbDataNote:
        "Espresso is one of the most recommended brew methods for medium-dark and dark roast coffees in the ICB catalogue, particularly for robusta-arabica blends and Monsooned Malabar. A significant number of Indian roasters specifically label their coffees as espresso-suitable.",
    },

    brewParams: {
      grindSize: "Extra fine",
      grindSub: "Powdery, like caster sugar",
      ratio: "1:2",
      brewTime: "25–30 sec",
    },
    faqOverline: "Espresso Queries",
    faqTitle: "Brewing *Espresso*",
    faqDescription:
      "Common questions about pulling great espresso with Indian coffees.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["espresso"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes a coffee good for espresso?",
        answer:
          "Espresso rewards coffees with body, sweetness, and low to moderate acidity. Medium to dark roasts with chocolate, caramel, and nutty profiles pull the best shots. Indian arabica-robusta blends and medium-dark single origins from Karnataka are excellent choices.",
      },
      {
        question: "Can I use single-origin Indian coffee for espresso?",
        answer:
          "Yes — honey-processed and natural medium roasts from Chikmagalur and Coorg can produce outstanding single-origin espresso with fruity sweetness and thick body. Expect a different character from traditional espresso blends but often more interesting.",
      },
      {
        question: "Why is Monsooned Malabar popular in espresso?",
        answer:
          "Monsooned Malabar's near-zero acidity, heavy body, and earthy-spicy profile make it a natural espresso component. Italian roasters have blended it into their espresso for decades — it adds base and body that rounds out brighter coffees.",
      },
      {
        question: "Do I need an expensive espresso machine?",
        answer:
          "A good grinder matters more than the machine. Entry-level machines with proper 9-bar pressure (Flair, Cafelat Robot, Breville Bambino) can pull excellent shots with Indian specialty coffees. Invest in the grinder first — consistency is everything in espresso.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Espresso Brewing Guide",
      description:
        "Dial in your espresso with expert recipes and extraction tips.",
      href: "/tools/expert-recipes?method=espresso",
      ctaText: "View Recipes",
    },
    related: ["dark-roast", "medium-dark-roast", "moka-pot", "french-press"],
  },

  {
    slug: "cold-brew",
    type: "brew_method",
    h1: "Best Coffees for Cold Brew in India",
    intro:
      "Find Indian specialty coffees perfect for cold brew — smooth, naturally sweet, and low-acid. These coffees are selected for their ability to produce clean, refreshing cold brew concentrate that shines on its own or with milk.",
    headerNudge:
      "Cold brew extracts smoothness and sweetness — choose coffees with chocolate, nut, and caramel notes.",
    teaserTitle: "Top Rated Coffees for Cold Brew",
    teaserDescription:
      "Coffees selected for their cold brew performance — smoothness, natural sweetness, and low bitterness.",
    gridNudge:
      "Medium to dark roasts with chocolatey, nutty profiles make the best cold brew. Avoid very light roasts.",
    heroBackgroundImage: "/images/discovery/cold-brew-hero.jpg",
    heroBadge: "Medium to Dark Roast",
    utilityNudge:
      "Patience pays off — 16–24 hours of steeping produces the smoothest, sweetest cold brew.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Extended cold-water immersion (no heat)",
        howItWorks:
          "Coarsely ground coffee steeps in cold or room-temperature water for 12–24 hours, slowly extracting flavour without heat. The lack of heat means fewer bitter compounds and acids are extracted — cold brew is naturally smooth and sweet. The resulting concentrate is typically diluted 1:1 with water, milk, or ice before drinking.",
        keyAdvantage:
          "The smoothest, lowest-acid coffee possible. Cold extraction avoids the harsh, bitter compounds that hot water pulls out — making it ideal for people with acid-sensitive stomachs and for iced coffee that doesn't taste watered-down. Cold brew concentrate lasts up to two weeks refrigerated.",
        filterType:
          "Fine mesh or paper filter — strain after steeping to remove all grounds",
      },
      indianCoffeeContext:
        "Cold brew is booming in Indian metros — from Blue Tokai's bottled cold brews to local café menus, it's one of the fastest-growing segments. Indian coffees are naturally suited to cold brew: the chocolate, nut, and spice notes that define Karnataka arabica translate beautifully into cold extraction. Natural-processed medium roasts from Chikmagalur produce cold brew with chocolate and berry sweetness that's exceptional over ice. Robusta blends also work surprisingly well — the extra body and lower acidity that robusta brings are exactly what cold brew needs. For something unique, try Monsooned Malabar as cold brew — the earthy, spicy character becomes smooth and mellow with a lingering sweetness that's hard to get from any other origin.",
      commonMistakes: [
        {
          mistake: "Steeping too short",
          fix: "Cold brew needs at least 12 hours, ideally 16–20 hours. Under-steeped cold brew tastes thin and watery — patience is the only technique that matters here.",
        },
        {
          mistake: "Grinding too fine",
          fix: "Use an extra-coarse grind — like raw sugar or coarse breadcrumbs. Fine grounds make cold brew cloudy, gritty, and over-extracted. They also clog filters during straining.",
        },
        {
          mistake: "Not diluting the concentrate",
          fix: "Cold brew concentrate is intentionally strong — dilute 1:1 with water, ice, or milk. Drinking it straight is overwhelming and masks the nuanced flavours.",
        },
      ],
      roastPairing: {
        best: ["medium-roast", "medium-dark-roast"],
        works: ["dark-roast", "light-medium-roast"],
        avoid:
          "Very light roasts — cold extraction can't develop their delicate acidity, and the result often tastes flat and vegetal. Pour-over handles these better.",
      },
      siblingMethods: ["french-press"],
      icbDataNote:
        "Cold brew is increasingly popular in India's specialty coffee scene. Medium and medium-dark roasts with chocolate and nut notes from Karnataka dominate the cold brew recommendations across the ICB catalogue. Several Indian roasters now offer dedicated cold brew blends.",
    },

    brewParams: {
      grindSize: "Extra coarse",
      grindSub: "Like raw sugar or coarse breadcrumbs",
      ratio: "1:6",
      brewTime: "16–24 hrs",
    },
    faqOverline: "Cold Brew Queries",
    faqTitle: "Brewing *Cold Brew*",
    faqDescription:
      "Common questions about making smooth, sweet cold brew with Indian coffees.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["cold_brew"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes a coffee good for cold brew?",
        answer:
          "Medium to dark roasts with chocolate, caramel, and nut profiles produce the smoothest, sweetest cold brew. Indian arabica from Karnataka is naturally suited — the low acidity and chocolaty character come through beautifully in cold extraction.",
      },
      {
        question: "How long should I steep cold brew?",
        answer:
          "16–20 hours at room temperature, or up to 24 hours in the refrigerator. Shorter steeps taste thin; longer than 24 hours can start extracting unpleasant bitter compounds. Find your sweet spot within this window.",
      },
      {
        question: "Cold brew vs iced coffee — what's the difference?",
        answer:
          "Iced coffee is regular hot-brewed coffee poured over ice. Cold brew is never heated — it steeps in cold water for hours. Cold brew is smoother, sweeter, less acidic, and has about 60% less acidity than hot-brewed coffee. They produce very different cups.",
      },
      {
        question: "How long does cold brew concentrate last?",
        answer:
          "Properly refrigerated cold brew concentrate lasts 10–14 days in a sealed container. The flavour peaks in the first 5–7 days and gradually flattens after that. Always dilute concentrate 1:1 before drinking.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Cold Brew Guide",
      description:
        "Learn how to make perfect cold brew concentrate with Indian coffees.",
      href: "/tools/expert-recipes?method=coldbrew",
      ctaText: "View Recipes",
    },
    related: ["medium-roast", "dark-roast", "french-press", "natural"],
  },

  {
    slug: "moka-pot",
    type: "brew_method",
    h1: "Best Coffees for Moka Pot in India",
    intro:
      "Explore Indian specialty coffees that produce rich, strong, espresso-style coffee on the stovetop Moka Pot. These coffees deliver bold body, intense flavour, and the concentrated character that makes Moka Pot a kitchen staple across India.",
    headerNudge:
      "Moka Pot produces intense, espresso-like coffee — choose medium-dark roasts for the best balance.",
    teaserTitle: "Top Rated Coffees for Moka Pot",
    teaserDescription:
      "Coffees selected for their Moka Pot performance — bold body, intensity, and clean finish.",
    gridNudge:
      "Medium-dark roasts from Karnataka work beautifully — they deliver bold flavour without bitterness.",
    heroBackgroundImage: "/images/discovery/moka-pot-hero.jpg",
    heroBadge: "Medium to Dark Roast",
    utilityNudge:
      "Medium heat and fresh, properly ground coffee are the keys to great Moka Pot coffee.",

    brewMethodProfile: {
      brewerCharacteristics: {
        mechanism: "Stovetop steam-pressure extraction (~1.5 bars)",
        howItWorks:
          "Water in the bottom chamber heats up and creates steam pressure, which forces water upward through a bed of fine coffee grounds and into the upper chamber. The pressure is lower than true espresso (~1.5 bars vs 9 bars) but higher than any gravity-based method — producing a strong, concentrated brew with more body than drip coffee but without the crema of espresso.",
        keyAdvantage:
          "The most accessible way to make espresso-style coffee at home. No electricity, no expensive machines — just a stovetop and a Moka Pot. It produces strong, intense coffee that works well with milk, making it a natural bridge between South Indian filter coffee and Western espresso culture.",
        filterType:
          "Built-in metal filter basket — oils pass through for full body",
      },
      indianCoffeeContext:
        "Moka Pot has a growing following in India, especially among home brewers looking for an affordable way to make strong, concentrated coffee. Indian medium-dark roasts from Chikmagalur and Coorg produce excellent Moka Pot coffee — the chocolate, spice, and roasted nut notes come through intensely without the bitterness you get from lighter roasts under pressure. Robusta-arabica blends are particularly good on Moka Pot — the robusta adds body and intensity while arabica brings sweetness. For anyone transitioning from South Indian filter coffee, Moka Pot at home is the closest equivalent in terms of strength and body. Natural-processed medium roasts from Karnataka produce a surprisingly fruity, syrupy Moka Pot cup that converts pour-over sceptics.",
      commonMistakes: [
        {
          mistake: "Using high heat",
          fix: "Always use medium to medium-low heat. High heat forces water through too fast, over-extracts the coffee, and produces a bitter, metallic taste. Slow and steady makes better coffee.",
        },
        {
          mistake: "Tamping the coffee grounds",
          fix: "Never tamp or compress the grounds in a Moka Pot — fill the basket loosely and level with a finger. Tamping creates too much resistance and can cause pressure to build dangerously.",
        },
        {
          mistake: "Leaving it on heat too long",
          fix: "Remove from heat as soon as the upper chamber is about three-quarters full and you hear a hissing or gurgling sound. Leaving it on extracts bitter, burnt flavours from the last drops of water.",
        },
      ],
      roastPairing: {
        best: ["medium-roast", "medium-dark-roast", "dark-roast"],
        works: ["light-medium-roast"],
        avoid:
          "Very light roasts — the pressure and concentrated extraction amplifies sourness and thinness. French Press or AeroPress handle light roasts better.",
      },
      siblingMethods: ["espresso"],
      icbDataNote:
        "Moka Pot is increasingly popular among Indian home brewers and is commonly recommended for medium-dark and dark roast coffees in the ICB catalogue. It's a popular entry point into specialty coffee for South Indian filter coffee drinkers looking for a similar strength profile.",
    },

    brewParams: {
      grindSize: "Fine",
      grindSub: "Finer than drip, coarser than espresso",
      ratio: "1:8",
      brewTime: "5–8 min",
    },
    faqOverline: "Moka Pot Queries",
    faqTitle: "Brewing with *Moka Pot*",
    faqDescription:
      "Common questions about getting the best coffee from your stovetop Moka Pot.",
    faqBadge: "Pro Tips",
    filter: {
      brew_method_ids: ["moka_pot"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What makes a coffee good for Moka Pot?",
        answer:
          "Medium to dark roasts with bold, chocolatey, and nutty profiles work best. The concentrated extraction amplifies whatever's in the coffee — so choose coffees with inherent sweetness and body. Indian medium-dark arabica from Karnataka is a natural fit.",
      },
      {
        question: "What grind size should I use for Moka Pot?",
        answer:
          "Fine — but not espresso-fine. Think slightly finer than drip coffee, like fine sand. Too fine and the pot chokes; too coarse and the coffee tastes weak and watery. The brew should flow out in a steady, gentle stream.",
      },
      {
        question: "Is Moka Pot coffee the same as espresso?",
        answer:
          "No — Moka Pot brews at about 1.5 bars compared to espresso's 9 bars. The result is strong and concentrated, but lacks espresso's crema and has less emulsified oils. It's the closest you can get to espresso without a machine, though — especially with Indian medium-dark roasts.",
      },
      {
        question: "Moka Pot vs South Indian filter — which is stronger?",
        answer:
          "Both produce strong, concentrated coffee but differently. South Indian filter uses gravity drip with a very fine grind and chicory; Moka Pot uses steam pressure. Moka Pot is faster (5–8 min vs 15–20 min) and produces a cleaner cup but without the chicory character. Try both with the same Indian coffee to compare.",
      },
    ],
    utilityCard: {
      type: "brew_guide",
      title: "Moka Pot Brewing Guide",
      description:
        "Learn expert techniques for brewing bold, rich coffee on the Moka Pot.",
      href: "/tools/expert-recipes?method=mokapot",
      ctaText: "View Recipes",
    },
    related: ["espresso", "dark-roast", "medium-dark-roast", "french-press"],
  },
];
