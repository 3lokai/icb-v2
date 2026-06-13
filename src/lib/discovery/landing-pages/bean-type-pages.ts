// src/lib/discovery/landing-pages/bean-type-pages.ts
import type { SpeciesEnum } from "@/types/db-enums";
import type { LandingPageConfig } from "./types";

/**
 * Bean type / species landing pages.
 *
 * Most pages filter on `bean_species`. The single-origin page is the exception —
 * it filters on the `is_single_origin` boolean (see CoffeeFilters), since
 * single-origin is a sourcing concept rather than a species value.
 */
export const beanTypePages: LandingPageConfig[] = [
  {
    slug: "arabica",
    type: "bean_type",
    h1: "Arabica Coffee in India",
    intro:
      "Explore Indian Arabica — the species behind almost all of the country's specialty coffee. Grown at altitude across Karnataka, Tamil Nadu, and Andhra Pradesh for clarity, aromatic complexity, and gentle acidity.",
    headerNudge:
      "Arabica rewards careful brewing — clean water and accurate ratios let the aromatics show.",
    teaserTitle: "Top Arabica picks",
    teaserDescription:
      "High-grown Indian Arabica lots, sorted by community rating.",
    gridNudge:
      "Lighter roasts highlight Arabica's florals and fruit — try a pour-over first.",
    heroBadge: "Species",
    faqOverline: "Arabica",
    faqTitle: "About *Arabica* coffee",
    faqDescription: "Why Arabica dominates Indian specialty coffee.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Caffeine", value: "Lower (~1.2–1.5%)" },
        { label: "Body", value: "Light to medium" },
        { label: "Acidity", value: "Bright, complex" },
        { label: "Best for", value: "Filter, pour-over, single origin" },
      ],
      flavourProfile: {
        typical: [
          "Floral",
          "Citrus",
          "Stone fruit",
          "Chocolate",
          "Brown sugar",
          "Clean finish",
        ],
        indianContext:
          "Indian Arabica is grown almost entirely under shade at 1,000–1,700m across Karnataka (Chikmagalur, Coorg, Baba Budangiri), Tamil Nadu (Shevaroy Hills, Nilgiris), and Andhra Pradesh (Araku Valley). The dominant varieties — SL-795, Cauvery (Catimor), Chandragiri, and Kent — give Indian Arabica a recognisable profile: medium body, restrained acidity, and chocolate-and-spice sweetness rather than the sharp brightness of African or Central American washed lots. High-altitude SL-795 from Chikmagalur and Araku is where Indian Arabica reaches genuine competition quality — jasmine, peach, and clean citrus when washed; ripe stone fruit and berry when natural.",
      },
      indiaContext:
        "Arabica is the foundation of Indian specialty coffee. While India grows more Robusta by volume, almost every coffee positioned as 'specialty' — estate lots, single origins, competition coffees — is Arabica. Shade-grown under native canopy alongside pepper and cardamom, Indian Arabica has a distinct terroir signature. The challenge is altitude: most Indian growing regions sit lower than the prime Arabica belts elsewhere, so the best lots come from the highest estates with careful processing.",
      brewGuidance: {
        recommended: ["v60", "chemex", "aeropress", "kalita", "filter-coffee"],
        notes:
          "Arabica is most rewarding on pour-over — V60 and Chemex let the aromatics and acidity show without added body. Use 92–96°C for light roasts and a 1:15–1:16 ratio. Indian Arabica also suits the traditional South Indian filter when you want a cleaner, brighter decoction than a Robusta-heavy blend gives. AeroPress is a forgiving everyday option.",
      },
      comparison: {
        relatedSlugs: ["robusta", "blends", "single-origin"],
        note: "If Arabica feels too delicate or you want more body, crema, and caffeine, try Robusta or an Arabica–Robusta blend. For the purest expression of a single estate, see single-origin coffees.",
      },
      icbDataNote:
        "Arabica is the most represented species across the ICB catalogue and accounts for the overwhelming majority of top-rated single origins. Most estate and competition lots listed by Indian roasters are Arabica.",
    },

    filter: {
      bean_species: ["arabica" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Arabica coffee?",
        answer:
          "Coffea arabica is the species prized in specialty coffee for its aromatic complexity, gentle acidity, and lower caffeine. It grows best at altitude and is more delicate to cultivate than Robusta.",
      },
      {
        question: "Is all Indian specialty coffee Arabica?",
        answer:
          "Almost all of it. India grows more Robusta by volume, but the estate lots, single origins, and competition coffees that define Indian specialty are overwhelmingly Arabica — particularly SL-795 and Cauvery from high-altitude Karnataka and Araku estates.",
      },
      {
        question:
          "Why does Indian Arabica taste different from African coffee?",
        answer:
          "Lower average altitude, distinctive shade-grown terroir, and varieties like Cauvery and SL-795 give Indian Arabica a softer, chocolate-and-spice profile with restrained acidity, rather than the sharp, bright fruit of high-grown African washed coffees.",
      },
      {
        question: "How should I brew Arabica?",
        answer:
          "Pour-over methods — V60, Chemex, Kalita — show Arabica best. Use 92–96°C water for light roasts and a 1:15–1:16 ratio. It also makes an excellent, cleaner South Indian filter coffee.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, varieties, and processing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["robusta", "blends", "single-origin", "chikmagalur", "washed"],
  },

  {
    slug: "robusta",
    type: "bean_type",
    h1: "Robusta Coffee in India",
    intro:
      "Discover Indian Robusta — bold, full-bodied, and high in caffeine. India is one of the world's most respected Robusta origins, and fine Robusta is now finding its place in specialty espresso and filter coffee.",
    headerNudge:
      "Robusta carries more bitterness and body — slightly coarser grinds and lower temperatures keep it smooth.",
    teaserTitle: "Top Robusta picks",
    teaserDescription:
      "Indian Robusta lots, from washed fine robusta to filter staples.",
    gridNudge:
      "Robusta shines in espresso and milk drinks — try it where body and crema matter.",
    heroBadge: "Species",
    faqOverline: "Robusta",
    faqTitle: "About *Robusta* coffee",
    faqDescription: "India's underrated specialty Robusta.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Caffeine", value: "Higher (~2.2–2.7%)" },
        { label: "Body", value: "Heavy, full" },
        { label: "Acidity", value: "Low" },
        { label: "Best for", value: "Espresso, filter coffee, milk drinks" },
      ],
      flavourProfile: {
        typical: [
          "Dark chocolate",
          "Roasted nuts",
          "Heavy body",
          "Low acidity",
          "Grain",
          "Bittersweet",
        ],
        indianContext:
          "India is the world's second-largest Robusta producer and its Robusta has a strong global reputation — 'Indian Kaapi Royale' and Monsooned Robusta are recognised names in the export trade. Most Indian Robusta grows in Karnataka and Kerala at lower elevations than Arabica. The recent shift is fine Robusta: a small but growing number of estates are applying specialty processing (washed, honey, natural) to Robusta, producing clean, sweet, low-bitterness cups that overturn the assumption that Robusta is only a commodity filler. Fine Indian Robusta can show dark chocolate, hazelnut, and a smooth syrupy body.",
      },
      indiaContext:
        "Robusta is the workhorse of Indian coffee — the majority of the country's production by volume, and the backbone of both the export trade and traditional South Indian filter coffee. For decades it was treated purely as a commodity. That's changing: fine Robusta processed with specialty care is now appearing from progressive estates, and roasters are starting to list single-estate Robusta on its own merits rather than only as a blend component.",
      brewGuidance: {
        recommended: ["espresso", "moka-pot", "filter-coffee", "french-press"],
        notes:
          "Robusta is built for body and crema — it excels in espresso (where it adds thick crema and a caffeine kick) and in South Indian filter coffee with milk and sugar. Use slightly lower water temperatures (88–92°C) to keep bitterness in check, and a touch coarser grind than you'd use for Arabica. French Press and Moka Pot suit its heavy body. As a black pour-over it can taste flat — it's happiest with milk or under pressure.",
      },
      comparison: {
        relatedSlugs: ["arabica", "blends", "chicory-mixes"],
        note: "Robusta brings body and caffeine where Arabica brings aromatics and acidity. Many Indian coffees blend the two; with chicory, Robusta forms the classic South Indian filter coffee base.",
      },
      icbDataNote:
        "Robusta is a smaller but growing segment of the ICB catalogue as fine, specialty-processed Robusta gains traction with Indian roasters. It appears both as single-estate lots and as the base of espresso and filter blends.",
    },

    filter: {
      bean_species: ["robusta" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Robusta coffee?",
        answer:
          "Coffea canephora (Robusta) is a hardier, lower-altitude species with roughly double the caffeine of Arabica, heavier body, lower acidity, and a more bitter, chocolatey profile. It produces thick crema in espresso.",
      },
      {
        question: "Is Robusta lower quality than Arabica?",
        answer:
          "Not inherently. Commodity Robusta is processed carelessly, which earned it a poor reputation. Fine Robusta — grown and processed with specialty care — can be clean, sweet, and complex. India is a leading producer of high-grade Robusta.",
      },
      {
        question: "Why is India known for Robusta?",
        answer:
          "India is the world's second-largest Robusta producer, and Indian Robusta ('Kaapi Royale', Monsooned Robusta) is prized internationally for espresso blends. It's also the traditional base of South Indian filter coffee.",
      },
      {
        question: "How should I brew Robusta?",
        answer:
          "Espresso, Moka Pot, and South Indian filter coffee suit it best — body, crema, and milk-friendliness are its strengths. Use lower water temperatures (88–92°C) and a slightly coarser grind to keep bitterness down.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, varieties, and processing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: [
      "arabica",
      "blends",
      "chicory-mixes",
      "espresso",
      "filter-coffee",
    ],
  },

  {
    slug: "liberica",
    type: "bean_type",
    h1: "Liberica Coffee in India",
    intro:
      "Discover Liberica — the rare third coffee species. Large, irregular beans with a smoky, jackfruit-and-woody character unlike anything Arabica or Robusta produces. Genuinely scarce in India.",
    headerNudge:
      "Liberica is a curiosity, not an everyday cup — expect a bold, polarising, unconventional profile.",
    teaserTitle: "Liberica picks",
    teaserDescription:
      "Rare Liberica lots — if and when Indian roasters list them.",
    gridNudge:
      "Brew long and embrace the funk — Liberica is unlike Arabica or Robusta.",
    heroBadge: "Rare species",
    faqOverline: "Liberica",
    faqTitle: "About *Liberica* coffee",
    faqDescription: "The rare third species, briefly explained.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Caffeine", value: "Low (~1.2%)" },
        { label: "Body", value: "Heavy, syrupy" },
        { label: "Acidity", value: "Low" },
        { label: "Best for", value: "Curiosity, immersion brewing" },
      ],
      flavourProfile: {
        typical: [
          "Jackfruit",
          "Smoky",
          "Woody",
          "Dark fruit",
          "Floral",
          "Savoury",
        ],
        indianContext:
          "Liberica (Coffea liberica) is the rarest of the three commercial coffee species and is barely grown in India — it accounts for a tiny fraction of global production, concentrated mostly in the Philippines, Malaysia, and West Africa. Indian Liberica, where it exists, is experimental and almost never reaches the specialty market in any volume. The beans are large and irregularly shaped, and the cup is divisive: smoky, woody, jackfruit-like, with a heavy body and unusual savoury-floral aromatics. It is a curiosity for adventurous drinkers rather than a daily coffee.",
      },
      indiaContext:
        "Liberica has almost no commercial footprint in India. Coffee here is overwhelmingly Arabica and Robusta; Liberica appears, if at all, in tiny experimental plantings or heritage trees. If you find an Indian Liberica lot, treat it as a rare find — these are novelty offerings rather than established estate coffees.",
      brewGuidance: {
        recommended: ["french-press", "aeropress", "moka-pot"],
        notes:
          "Liberica's heavy body and bold, smoky character suit immersion methods. French Press lets the syrupy body and dark fruit come through; AeroPress gives more control over the intensity. It's typically enjoyed darker-roasted and often with milk, in the Southeast Asian tradition. As a delicate light-roast pour-over it rarely works — the profile is too heavy and unconventional.",
      },
      comparison: {
        relatedSlugs: ["excelsa", "arabica", "robusta"],
        note: "Liberica and Excelsa are the two rare species beyond Arabica and Robusta. Excelsa is botanically close to Liberica but tends tarter and fruitier; Liberica is smokier and more savoury.",
      },
      icbDataNote:
        "Liberica is extremely rare in the ICB catalogue — Indian roasters seldom list it. Expect few or no results at any given time; this page exists for completeness and education.",
    },

    filter: {
      bean_species: ["liberica" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Liberica coffee?",
        answer:
          "Coffea liberica is the rare third commercial coffee species, after Arabica and Robusta. It has large, irregular beans and a distinctive smoky, woody, jackfruit-like flavour with heavy body and low acidity.",
      },
      {
        question: "Is Liberica grown in India?",
        answer:
          "Barely. Indian coffee is overwhelmingly Arabica and Robusta. Liberica has almost no commercial presence here and is found only in rare experimental or heritage plantings — so it's seldom available from Indian roasters.",
      },
      {
        question: "What does Liberica taste like?",
        answer:
          "Bold and polarising — smoky, woody, with jackfruit and dark-fruit notes, a heavy syrupy body, and savoury-floral aromatics. It's unlike anything Arabica or Robusta produces and is best approached as a curiosity.",
      },
      {
        question: "How should I brew Liberica?",
        answer:
          "Immersion methods like French Press and AeroPress suit its heavy body, often at a darker roast and frequently with milk. Light-roast pour-over rarely flatters it.",
      },
    ],
    related: ["excelsa", "arabica", "robusta"],
  },

  {
    slug: "excelsa",
    type: "bean_type",
    h1: "Excelsa Coffee in India",
    intro:
      "Explore Excelsa — a rare, tart-and-fruity member of the Liberica family. Prized for adding a dark, complex, almost wine-like layer to blends. Very scarce in India.",
    headerNudge:
      "Excelsa is uncommon and often used in blends — expect tart, dark-fruit complexity.",
    teaserTitle: "Excelsa picks",
    teaserDescription:
      "Rare Excelsa lots — uncommon offerings from Indian roasters.",
    gridNudge:
      "Excelsa adds a tart, fruity layer — interesting solo or in a blend.",
    heroBadge: "Rare species",
    faqOverline: "Excelsa",
    faqTitle: "About *Excelsa* coffee",
    faqDescription: "The tart, fruity cousin of Liberica.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Caffeine", value: "Low" },
        { label: "Body", value: "Medium to full" },
        { label: "Acidity", value: "Tart, bright" },
        { label: "Best for", value: "Blends, curiosity, immersion" },
      ],
      flavourProfile: {
        typical: [
          "Tart fruit",
          "Dark berry",
          "Wine-like",
          "Jackfruit",
          "Savoury",
          "Complex",
        ],
        indianContext:
          "Excelsa (often classified as Coffea liberica var. dewevrei) is botanically part of the Liberica family but cups quite differently — tarter, fruitier, and more wine-like, with a dark complexity that has earned it a niche following. Like Liberica, it is extremely rare in India and barely registers in commercial production. Where it appears, it's usually as a small experimental lot or a blend component that adds an unusual fruity-tart layer. Indian Excelsa is a genuine rarity rather than an established category.",
      },
      indiaContext:
        "Excelsa has a negligible commercial presence in India. The country's coffee is dominated by Arabica and Robusta, and Excelsa — like Liberica — exists only in scattered experimental plantings. Treat any Indian Excelsa offering as a rare, novelty find.",
      brewGuidance: {
        recommended: ["aeropress", "french-press", "v60"],
        notes:
          "Excelsa's tart, fruity character can take more brewing approaches than Liberica. AeroPress and French Press handle its body well, while a careful V60 can tease out the bright, wine-like fruit. It's often used in small proportions in blends to add complexity rather than brewed alone.",
      },
      comparison: {
        relatedSlugs: ["liberica", "blends", "arabica"],
        note: "Excelsa is the tarter, fruitier sibling of Liberica. It's frequently used in blends for a complex, dark-fruit layer rather than as a standalone single origin.",
      },
      icbDataNote:
        "Excelsa is among the rarest entries in the ICB catalogue — Indian roasters rarely list it. Expect few or no results; this page is provided for completeness and education.",
    },

    filter: {
      bean_species: ["excelsa" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Excelsa coffee?",
        answer:
          "Excelsa is a rare coffee classified within the Liberica family (Coffea liberica var. dewevrei). It's known for a tart, fruity, wine-like profile that's distinct from both Arabica and Robusta, and it's often used to add complexity to blends.",
      },
      {
        question: "Is Excelsa the same as Liberica?",
        answer:
          "It's botanically part of the Liberica family but cups differently — tarter, fruitier, and more wine-like, where Liberica is smokier and more savoury. Many trade catalogues list them separately.",
      },
      {
        question: "Is Excelsa available in India?",
        answer:
          "Very rarely. Indian production is dominated by Arabica and Robusta, and Excelsa appears only in scattered experimental plantings, so it's seldom listed by Indian roasters.",
      },
      {
        question: "How is Excelsa used?",
        answer:
          "Often as a small blend component to add tart, dark-fruit complexity, though it can be brewed alone via AeroPress, French Press, or a careful V60.",
      },
    ],
    related: ["liberica", "blends", "arabica"],
  },

  {
    slug: "blends",
    type: "bean_type",
    h1: "Coffee Blends in India",
    intro:
      "Browse Indian coffee blends — Arabica–Robusta combinations and house blends built for balance, body, and consistency. The backbone of espresso and traditional South Indian filter coffee.",
    headerNudge:
      "Blends are designed for consistency — great for espresso, milk drinks, and everyday brewing.",
    teaserTitle: "Top blend picks",
    teaserDescription:
      "Arabica–Robusta and house blends, sorted by community rating.",
    gridNudge:
      "Blends with Robusta hold up beautifully in milk — ideal for espresso and filter.",
    heroBadge: "Blends",
    faqOverline: "Blends",
    faqTitle: "About coffee *blends*",
    faqDescription: "Why blends exist and where they shine.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Make-up", value: "Arabica + Robusta, or multi-origin" },
        { label: "Body", value: "Medium to full" },
        { label: "Acidity", value: "Balanced, lower" },
        { label: "Best for", value: "Espresso, filter coffee, milk drinks" },
      ],
      flavourProfile: {
        typical: [
          "Balanced",
          "Chocolate",
          "Nutty",
          "Full body",
          "Crema",
          "Consistent",
        ],
        indianContext:
          "Blending is central to Indian coffee culture. The classic Arabica–Robusta blend — anywhere from 80:20 to 50:50, and Robusta-dominant for traditional filter coffee — balances Arabica's aroma and sweetness with Robusta's body, crema, and strength. Espresso blends lean on Robusta for crema and a caffeine kick; South Indian filter coffee blends are built to stand up to milk and chicory. Many Indian roasters build a signature house blend designed for year-round consistency, where single origins come and go with the harvest.",
      },
      indiaContext:
        "Blends are how most Indians actually drink coffee. The South Indian filter coffee tradition is built on Arabica–Robusta blends (often with chicory), and espresso blends dominate café menus. Where single origins celebrate the character of one estate, blends prioritise balance and repeatability — a consistent cup the roaster can deliver every batch regardless of season.",
      brewGuidance: {
        recommended: ["espresso", "moka-pot", "filter-coffee", "french-press"],
        notes:
          "Blends are built for body and consistency, so they shine in espresso, Moka Pot, and South Indian filter coffee — especially with milk. Robusta-forward blends give thick crema and strength; higher-Arabica blends stay smoother and more aromatic. Dial espresso slightly coarser if a Robusta-heavy blend runs bitter, and use 90–93°C on filter methods.",
      },
      comparison: {
        relatedSlugs: ["single-origin", "arabica", "robusta", "chicory-mixes"],
        note: "Blends trade the distinct terroir of a single origin for balance and consistency. Add chicory and an Arabica–Robusta blend becomes the classic South Indian filter coffee mix.",
      },
      icbDataNote:
        "Blends — both generic and specified Arabica–Robusta ratios — are a substantial part of the ICB catalogue, concentrated in espresso and everyday filter offerings rather than the top-rated single origins.",
    },

    filter: {
      bean_species: [
        "blend" as SpeciesEnum,
        "arabica_80_robusta_20" as SpeciesEnum,
        "arabica_70_robusta_30" as SpeciesEnum,
        "arabica_60_robusta_40" as SpeciesEnum,
        "arabica_50_robusta_50" as SpeciesEnum,
        "robusta_80_arabica_20" as SpeciesEnum,
      ],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is a coffee blend?",
        answer:
          "A blend combines beans of different species, origins, or roast profiles into one product. In India that usually means Arabica with Robusta — balancing Arabica's aroma and sweetness with Robusta's body, crema, and strength.",
      },
      {
        question: "Are blends lower quality than single origins?",
        answer:
          "No — they serve a different purpose. Single origins showcase one estate's character; blends are engineered for balance and consistency. A well-built blend delivers the same reliable cup every batch, which is exactly what espresso and filter coffee need.",
      },
      {
        question: "What's a typical Indian filter coffee blend?",
        answer:
          "A Robusta-forward Arabica–Robusta blend, frequently with chicory added. The Robusta provides body and strength to stand up to milk and sugar, while Arabica adds aroma and smoothness.",
      },
      {
        question: "How should I brew a blend?",
        answer:
          "Espresso, Moka Pot, and South Indian filter coffee suit blends best, especially with milk. Robusta-heavy blends give thick crema and strength; dial slightly coarser if espresso runs bitter.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, varieties, and processing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: [
      "single-origin",
      "arabica",
      "robusta",
      "chicory-mixes",
      "espresso",
    ],
  },

  {
    slug: "chicory-mixes",
    type: "bean_type",
    h1: "Chicory Coffee Mixes in India",
    intro:
      "Explore Indian coffee–chicory blends — the heart of South Indian filter coffee. Chicory root adds body, a gentle bittersweetness, and that distinctive, milk-friendly cup that defines the tradition.",
    headerNudge:
      "Chicory mixes are made for milk and decoction-style brewing — not black pour-over.",
    teaserTitle: "Top chicory mix picks",
    teaserDescription:
      "Coffee–chicory blends and filter coffee mixes, by rating.",
    gridNudge:
      "Brew as a decoction in a South Indian filter and finish with hot milk and sugar.",
    heroBadge: "Tradition",
    faqOverline: "Chicory",
    faqTitle: "About *chicory* coffee",
    faqDescription: "The South Indian filter coffee tradition.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Make-up", value: "Coffee + roasted chicory root" },
        { label: "Typical chicory", value: "10–30%" },
        { label: "Body", value: "Full, syrupy" },
        { label: "Best for", value: "South Indian filter coffee, milk" },
      ],
      flavourProfile: {
        typical: [
          "Bittersweet",
          "Caramel",
          "Earthy",
          "Full body",
          "Roasted",
          "Smooth with milk",
        ],
        indianContext:
          "Chicory — the roasted, ground root of the chicory plant — has been blended into South Indian coffee for generations. It adds body, a dark caramel bittersweetness, and a syrupy texture that holds up beautifully to milk and sugar in the classic filter coffee preparation. Typical mixes run 10–30% chicory with an Arabica–Robusta coffee base; higher chicory ratios give a stronger, more bittersweet decoction. The combination is inseparable from the South Indian filter coffee ritual: a slow drip decoction served frothy with hot milk in a tumbler and dabarah.",
      },
      indiaContext:
        "Chicory coffee is a cultural institution in South India. Originally adopted to stretch coffee and add body, the coffee–chicory blend became the defining taste of filter coffee in Tamil Nadu, Karnataka, Andhra Pradesh, and Kerala. Far from being a cheap substitute, the chicory character is now what many people specifically love about the cup — it's the flavour of home for millions of Indian coffee drinkers.",
      brewGuidance: {
        recommended: ["filter-coffee", "moka-pot", "french-press"],
        notes:
          "Chicory mixes are made for the South Indian filter — a slow drip through the two-chamber stainless steel filter produces a concentrated decoction that's then cut with hot milk and sugar. The chicory keeps the body full and smooth under milk. These mixes are not designed for black pour-over; the earthy bittersweetness needs milk to balance. Use a fine-to-medium grind and freshly boiled water for the decoction.",
      },
      comparison: {
        relatedSlugs: ["blends", "robusta", "arabica"],
        note: "Chicory mixes are essentially an Arabica–Robusta blend with roasted chicory added. For the same coffee base without chicory, see blends; for a black, milk-free filter, choose a pure Arabica or Robusta.",
      },
      icbDataNote:
        "Coffee–chicory mixes occupy a distinct, tradition-driven niche in the ICB catalogue, listed mainly by roasters serving the South Indian filter coffee market rather than the third-wave single-origin segment.",
    },

    filter: {
      bean_species: [
        "arabica_chicory" as SpeciesEnum,
        "robusta_chicory" as SpeciesEnum,
        "blend_chicory" as SpeciesEnum,
        "filter_coffee_mix" as SpeciesEnum,
      ],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is chicory coffee?",
        answer:
          "It's coffee blended with roasted, ground chicory root. Chicory contains no caffeine but adds body, a dark caramel bittersweetness, and a syrupy texture — the signature character of South Indian filter coffee.",
      },
      {
        question: "Why is chicory added to Indian filter coffee?",
        answer:
          "Originally to add body and stretch the coffee, but the chicory character became central to the taste of South Indian filter coffee. It gives the decoction the strength and smoothness needed to pair with hot milk and sugar.",
      },
      {
        question: "How much chicory is in a typical mix?",
        answer:
          "Usually 10–30%, blended with an Arabica–Robusta coffee base. Higher chicory ratios give a stronger, more bittersweet and earthy decoction.",
      },
      {
        question: "How should I brew a chicory mix?",
        answer:
          "Use a South Indian filter to make a concentrated decoction, then add hot milk and sugar to taste. Chicory mixes are made for milk-based filter coffee, not black pour-over.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "The filter coffee tradition and more on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["blends", "robusta", "arabica", "filter-coffee"],
  },

  {
    slug: "single-origin",
    type: "bean_type",
    h1: "Single Origin Coffee in India",
    intro:
      "Discover Indian single-origin coffees — lots traceable to one estate or region, unblended, so the terroir, variety, and processing speak for themselves. Where Indian specialty coffee shows its character.",
    headerNudge:
      "Single origins reward attention — brew them clean to taste exactly what one estate produced.",
    teaserTitle: "Top single-origin picks",
    teaserDescription:
      "Traceable single-estate and single-region lots, by rating.",
    gridNudge:
      "Pour-over highlights the terroir — start there before trying milk or espresso.",
    heroBadge: "Sourcing",
    faqOverline: "Single origin",
    faqTitle: "About *single-origin* coffee",
    faqDescription: "Traceability and why it matters.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Sourcing", value: "One estate or region" },
        { label: "Traceability", value: "High" },
        { label: "Character", value: "Terroir-driven" },
        { label: "Best for", value: "Pour-over, tasting, exploring origin" },
      ],
      flavourProfile: {
        typical: [
          "Terroir-specific",
          "Distinctive",
          "Clean",
          "Variety-driven",
          "Process-led",
          "Expressive",
        ],
        indianContext:
          "Single origin is where Indian specialty coffee makes its case. A single-origin lot comes from one estate (or one tightly defined region) and isn't blended with anything else, so the altitude, variety, soil, and processing all show through unmasked. High-altitude SL-795 from Chikmagalur or Baba Budangiri, washed lots from Coorg, naturals from Araku Valley — each tastes recognisably of its place. Single origins change with the harvest, so they're seasonal by nature, unlike the year-round consistency of a house blend.",
      },
      indiaContext:
        "The single-origin movement is what put Indian specialty coffee on the map. By tracing a coffee to a specific estate and being transparent about variety and processing, roasters let drinkers taste the difference between Chikmagalur and Araku, washed and natural, SL-795 and Cauvery. It's the opposite philosophy to blending: instead of balance and repeatability, single origins prize distinctiveness and a sense of place.",
      brewGuidance: {
        recommended: ["v60", "chemex", "aeropress", "kalita"],
        notes:
          "Single origins are best on pour-over, where clarity lets the terroir and variety express fully — V60, Chemex, and Kalita are ideal. Match temperature and grind to the roast and processing: lighter washed lots like 93–96°C and a finer grind; naturals extract faster, so go slightly coarser. Tasting the same origin across two brew methods is a great way to understand what the estate produced.",
      },
      comparison: {
        relatedSlugs: ["blends", "arabica", "robusta"],
        note: "Single origins celebrate one estate's distinct character; blends prioritise balance and consistency across batches. Most Indian single origins are Arabica, though fine single-estate Robusta is emerging.",
      },
      icbDataNote:
        "Single-origin lots make up the most highly rated part of the ICB catalogue — the estate-traceable Arabica coffees that define Indian specialty. This page lists every coffee flagged as single origin, regardless of species.",
    },

    filter: {
      single_origin_only: true,
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is single-origin coffee?",
        answer:
          "Coffee sourced from one place — a single estate or a tightly defined region — and not blended with beans from elsewhere. This traceability lets the terroir, variety, and processing of that one source show through clearly.",
      },
      {
        question: "Single origin vs blend — what's the difference?",
        answer:
          "Single origins showcase the distinct character of one estate and change with the harvest. Blends combine sources for balance and year-round consistency. Neither is 'better' — they serve different goals.",
      },
      {
        question: "Are Indian single origins always Arabica?",
        answer:
          "Mostly. The estate-traceable lots that define Indian specialty are overwhelmingly Arabica, though a growing number of roasters now offer fine single-estate Robusta as well.",
      },
      {
        question: "How should I brew a single origin?",
        answer:
          "Pour-over methods — V60, Chemex, Kalita — show terroir best. Adjust temperature and grind to the roast and processing: finer and hotter for light washed lots, slightly coarser for naturals.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, varieties, and processing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["blends", "arabica", "chikmagalur", "washed", "araku"],
  },
];
