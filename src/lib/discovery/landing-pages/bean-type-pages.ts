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
      "Explore Indian Arabica — the species behind almost all of the country's specialty coffee. Grown under shade at 1,000–1,700m across Karnataka, Tamil Nadu, and Andhra Pradesh, Indian Arabica delivers clarity, aromatic complexity, and a chocolate-and-spice sweetness that sets it apart from its African and Central American counterparts.",
    headerNudge:
      "Start with 15g coffee to 250ml water at 93°C on a V60 — Indian Arabica's florals open up with a medium-fine grind and 3-minute brew.",
    teaserTitle: "Top Arabica picks",
    teaserDescription:
      "High-grown Indian Arabica lots, sorted by community rating.",
    gridNudge:
      "Light and light-medium roasts reveal the most variety character — try SL-795 lots on pour-over before reaching for milk.",
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
          "Indian Arabica is grown almost entirely under shade at 1,000–1,700m across Karnataka (Chikmagalur, Coorg, Baba Budangiri), Tamil Nadu (Shevaroy Hills, Nilgiris), and Andhra Pradesh (Araku Valley). The dominant varieties — SL-795, Cauvery (Catimor), Chandragiri, and Kent — give Indian Arabica a recognisable profile: medium body, restrained acidity, and chocolate-and-spice sweetness rather than the sharp brightness of African or Central American washed lots. SL-795 is the variety to watch: high-altitude SL-795 from Chikmagalur and Araku reaches genuine competition quality — jasmine, peach, and clean citrus when washed; ripe stone fruit and berry when natural. Cauvery is hardier and more widely planted, producing a rounder, nuttier cup. Kent, one of India's oldest cultivated varieties, gives gentle citrus and tea-like lightness at its best.",
      },
      indiaContext:
        "Arabica is the foundation of Indian specialty coffee. While India grows more Robusta by volume, almost every coffee positioned as 'specialty' — estate lots, single origins, competition coffees — is Arabica. Shade-grown under native canopy alongside pepper and cardamom, Indian Arabica has a distinct terroir signature that international cuppers describe as 'soft, sweet, and spice-forward'. The challenge is altitude: most Indian growing regions sit lower than the prime Arabica belts of East Africa or Central America (1,800–2,200m), so the best lots come from the highest estates — above 1,200m — with careful processing. This is why washed SL-795 from Baba Budangiri and high-altitude Chikmagalur estates consistently score highest in cupping competitions.",
      brewGuidance: {
        recommended: ["v60", "chemex", "aeropress", "kalita", "filter-coffee"],
        notes:
          "Arabica is most rewarding on pour-over — V60 and Chemex let the aromatics and acidity show without added body. Start with 15g to 250ml (1:16.7 ratio), medium-fine grind, and 92–96°C water for light roasts. Brew time should land around 2:45–3:15 on a V60. Drop to 90–93°C for light-medium roasts to avoid sharpness. For Chemex, go slightly coarser and extend to 3:30–4:00. Indian Arabica also suits the traditional South Indian filter when you want a cleaner, brighter decoction than a Robusta-heavy blend — use the same coffee but grind finer for the metal filter. AeroPress at 85°C with a 1:14 ratio and 2-minute steep is a forgiving everyday option that brings out Arabica's sweetness without demanding precision.",
      },
      comparison: {
        relatedSlugs: ["robusta", "blends", "single-origin"],
        note: "Arabica vs Robusta is the fundamental choice in Indian coffee. Where Arabica gives you aromatic complexity, bright acidity, and lighter body, Robusta delivers thick crema, heavy body, and nearly double the caffeine — but less nuance. If Arabica feels too delicate or you miss the body in milk drinks, try an Arabica–Robusta blend (70:30 is a good starting point). For the purest expression of what one estate can produce, see single-origin lots — they're almost always Arabica.",
      },
      varietyHighlights: [
        {
          name: "SL-795",
          cup: "Jasmine, peach, clean citrus — India's competition variety. At altitude, the most aromatic and complex Indian Arabica.",
          cultivation:
            "High-altitude Chikmagalur, Baba Budangiri, Araku Valley. Susceptible to leaf rust but produces the best lots.",
        },
        {
          name: "Cauvery (Catimor)",
          cup: "Round, nutty, chocolate with mild sweetness. Less aromatic complexity than SL-795 but consistently solid.",
          cultivation:
            "Widely planted across Karnataka. Hardy, disease-resistant, higher yield — the reliable workhorse of Indian estates.",
        },
        {
          name: "Chandragiri",
          cup: "Similar to Cauvery with slightly more delicacy and brightness. A newer variety gaining favour.",
          cultivation:
            "Developed as a Cauvery successor with better rust resistance. Increasingly planted to replace ageing Kent trees.",
        },
        {
          name: "Kent",
          cup: "Gentle citrus, tea-like lightness, delicate body. One of India's heritage Arabica varieties.",
          cultivation:
            "Heritage variety with lower yields and higher rust susceptibility. Being replaced by Chandragiri on many estates.",
        },
      ],
      roastPairing: {
        best: ["light-roast", "light-medium-roast"],
        works: ["medium-roast"],
        avoid:
          "Dark roast buries Arabica's aromatics and acidity — the qualities that make it worth choosing over Robusta. If you want a dark, heavy cup, Robusta or a blend is a better fit.",
      },
      commonMistakes: [
        {
          mistake: "Water too hot for light roasts",
          fix: "Use 92–96°C, not boiling. Boiling water scorches delicate Arabica and kills the florals and fruit — let the kettle rest 30 seconds off the boil.",
        },
        {
          mistake: "Grinding too fine for pour-over",
          fix: "Medium-fine for V60, medium for Chemex. Too fine creates a bitter, slow, channel-prone pour. If drawdown takes over 4 minutes, go coarser.",
        },
        {
          mistake: "Storing beans in the fridge or freezer",
          fix: "Room temperature in an airtight container away from light and heat. Fridge humidity and temperature cycling damage Arabica's delicate aromatics.",
        },
      ],
      icbDataNote:
        "Arabica is the largest species category in the ICB catalogue, accounting for the majority of listed coffees and the overwhelming share of top-rated single origins. Community-rated Arabica lots average higher than any other species. Most estate and competition lots listed by Indian roasters are Arabica, with SL-795 and Cauvery the most frequently listed varieties.",
    },

    filter: {
      bean_species: ["arabica" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Arabica coffee?",
        answer:
          "Coffea arabica is the species prized in specialty coffee for its aromatic complexity, gentle acidity, and lower caffeine (~1.2–1.5% vs Robusta's ~2.5%). It grows best above 1,000m altitude, requires shade and careful husbandry, and is more susceptible to leaf rust and pests than Robusta — which is why it commands higher prices.",
      },
      {
        question: "Is all Indian specialty coffee Arabica?",
        answer:
          "Almost all of it. India grows more Robusta by volume, but the estate lots, single origins, and competition coffees that define Indian specialty are overwhelmingly Arabica — particularly SL-795 and Cauvery from high-altitude Karnataka and Araku estates. Fine single-estate Robusta is a growing niche, but Arabica remains the default for anything labelled 'specialty'.",
      },
      {
        question:
          "Why does Indian Arabica taste different from African or Central American coffee?",
        answer:
          "Three factors: lower average altitude (1,000–1,700m vs 1,800–2,200m elsewhere), distinctive shade-grown terroir under mixed canopy with pepper and cardamom, and varieties like SL-795 and Cauvery that are adapted to Indian conditions. The result is a softer, chocolate-and-spice profile with restrained acidity — less sharp brightness than high-grown East African washed lots, more warmth and sweetness.",
      },
      {
        question: "What's the difference between SL-795 and Cauvery?",
        answer:
          "SL-795 is Indian Arabica's competition variety — at altitude it produces jasmine, peach, and clean citrus notes with delicate body. Cauvery (a Catimor hybrid) is hardier, more disease-resistant, and more widely planted, giving a rounder, nuttier cup with less aromatic complexity. SL-795 is what producers show at cuppings; Cauvery is the reliable workhorse of Indian estate coffee.",
      },
      {
        question: "How should I brew Indian Arabica?",
        answer:
          "Pour-over methods — V60, Chemex, Kalita — show Arabica best. Use 92–96°C water for light roasts, 90–93°C for light-medium, a 1:15–1:17 ratio, and target a 2:45–3:15 brew time. AeroPress at 85°C is forgiving for everyday brewing. Indian Arabica also makes a clean, bright South Indian filter coffee with a finer grind and boiled water.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Indian coffee varieties explained",
      description:
        "SL-795, Cauvery, Chandragiri, Kent — what each variety brings to the cup.",
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
      "Discover Indian Robusta — bold, full-bodied, and high in caffeine. India is one of the world's most respected Robusta origins, producing everything from export-grade Kaapi Royale to fine specialty-processed lots that challenge assumptions about what Robusta can be.",
    headerNudge:
      "Pull espresso at 90–92°C with a slightly coarser grind than Arabica — Robusta's bitterness softens and the crema thickens.",
    teaserTitle: "Top Robusta picks",
    teaserDescription:
      "Indian Robusta lots, from washed fine robusta to filter staples.",
    gridNudge:
      "Robusta shines in espresso and milk drinks — dark chocolate and crema that cut through steamed milk. Try it where body matters.",
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
          "India is the world's second-largest Robusta producer (after Vietnam) and its Robusta has a strong global reputation — 'Indian Kaapi Royale' and Monsooned Robusta are recognised names in the international export trade. Most Indian Robusta grows in Karnataka and Kerala at 600–1,000m, lower than Arabica's elevation band. The profile is classic Robusta at commodity level — earthy, grainy, bitter — but the shift toward fine Robusta is changing perceptions. A growing number of estates are applying specialty processing (washed, honey, natural, even anaerobic) to carefully sorted Robusta, producing clean, sweet, low-bitterness cups: dark chocolate, hazelnut, and a smooth syrupy body with none of the harsh rubber or burnt grain of carelessly processed commodity lots.",
      },
      indiaContext:
        "Robusta is the workhorse of Indian coffee — the majority of the country's production by volume, and the backbone of both the export trade and traditional South Indian filter coffee. For decades it was treated purely as a commodity, graded and exported in bulk. That's changing: fine Robusta processed with specialty care is now appearing from progressive estates in Karnataka's Kodagu and Hassan districts, and roasters are starting to list single-estate Robusta on its own merits rather than only as a blend component. The Coffee Board of India's quality programmes and international competitions like Cup of Excellence's Robusta category have given Indian producers new incentives to invest in Robusta quality.",
      brewGuidance: {
        recommended: ["espresso", "moka-pot", "filter-coffee", "french-press"],
        notes:
          "Robusta is built for body and crema — it excels in espresso, where it adds thick, persistent crema and a caffeine kick. Pull at 90–92°C (lower than Arabica's 93–96°C) with a slightly coarser grind and a 1:2–1:2.5 yield ratio to keep bitterness in check. For South Indian filter coffee, use a fine grind and boiled water through the metal filter, then mix the decoction 1:1 with hot milk and sugar — the Robusta body stands up to dilution. Moka Pot at a medium grind produces strong, low-acid cups at home. French Press works well with a 4-minute steep and coarse grind — the metal filter preserves the heavy body. As a black pour-over Robusta can taste flat and bitter — it's happiest with milk, under pressure, or in a blend.",
      },
      comparison: {
        relatedSlugs: ["arabica", "blends", "chicory-mixes"],
        note: "Robusta brings body and nearly double the caffeine where Arabica brings aromatics and acidity — they're complementary rather than competing. Most Indian blends combine the two: Arabica for aroma and sweetness, Robusta for strength and crema. With chicory added, a Robusta-dominant blend forms the classic South Indian filter coffee base. If you want Robusta's body but more nuance, look for fine or specialty-processed Robusta lots.",
      },
      roastPairing: {
        best: ["medium-roast", "medium-dark-roast"],
        works: ["dark-roast"],
        avoid:
          "Light roast Robusta is rarely pleasant — the low acidity and heavy body need roast development to show their best. Under-roasted Robusta tastes grainy, astringent, and vegetal.",
      },
      commonMistakes: [
        {
          mistake: "Brewing too hot",
          fix: "Use 88–92°C for Robusta, not Arabica's 93–96°C. Higher temperatures amplify Robusta's bitterness and harshness.",
        },
        {
          mistake: "Using pour-over for pure Robusta",
          fix: "Robusta's heavy body and low acidity suit pressure and immersion methods. Espresso, Moka Pot, French Press, or South Indian filter — these bring out its strengths instead of exposing its flatness.",
        },
        {
          mistake: "Assuming all Robusta tastes the same",
          fix: "Fine Robusta processed with specialty care is clean and sweet — dark chocolate and hazelnut, not rubber and grain. Sourcing and processing matter as much as species. Taste before judging.",
        },
      ],
      icbDataNote:
        "Robusta is a smaller but growing segment of the ICB catalogue as fine, specialty-processed Robusta gains traction with Indian roasters. It appears both as single-estate lots and as the base of espresso and filter blends. Community engagement on Robusta listings is increasing as more roasters offer it as a named single-origin rather than an anonymous blend component.",
    },

    filter: {
      bean_species: ["robusta" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Robusta coffee?",
        answer:
          "Coffea canephora (Robusta) is a hardier, lower-altitude species with roughly double the caffeine of Arabica (~2.2–2.7%), heavier body, lower acidity, and a more bitter, chocolatey profile. The plant resists diseases like coffee leaf rust far better than Arabica, grows at lower altitudes (sea level to 1,000m), and produces thick crema in espresso.",
      },
      {
        question: "Is Robusta lower quality than Arabica?",
        answer:
          "Not inherently — it's a different species with different strengths. Commodity Robusta is processed carelessly and tastes harsh, which earned it a poor reputation. Fine Robusta — grown at altitude, carefully sorted, and processed with specialty care (washed, honey, or natural) — can be clean, sweet, and complex. India is a leading producer of this high-grade Robusta.",
      },
      {
        question: "Why is India known for Robusta?",
        answer:
          "India is the world's second-largest Robusta producer after Vietnam. Indian Robusta ('Kaapi Royale' grade, Monsooned Robusta) is prized internationally for espresso blends because it adds body and crema without the harsh flavours of lower-grade origins. It's also the traditional base of South Indian filter coffee — a cultural institution across four states.",
      },
      {
        question: "What is fine Robusta?",
        answer:
          "Fine Robusta refers to specialty-grade Robusta that's been carefully grown, sorted, and processed — typically washed or honey-processed — to produce a clean, sweet cup without the harsh bitterness of commodity lots. Indian estates in Kodagu and Hassan are leading this movement, producing single-estate Robusta with dark chocolate, hazelnut, and syrupy body.",
      },
      {
        question: "How should I brew Robusta?",
        answer:
          "Espresso at 90–92°C with a coarser grind than Arabica, Moka Pot at medium grind, and South Indian filter coffee with boiled water are its best formats. Use lower temperatures and slightly coarser grinds to keep bitterness down. French Press with a 4-minute steep preserves the heavy body. Robusta is happiest with milk or under pressure — black pour-over rarely flatters it.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Fine Robusta explained",
      description:
        "How specialty processing is transforming Indian Robusta from commodity to craft.",
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
      "Discover Liberica — the rare third coffee species. Large, irregular, almond-shaped beans with a smoky, jackfruit-and-woody character unlike anything Arabica or Robusta produces. Prized in Southeast Asia and genuinely scarce in India.",
    headerNudge:
      "Liberica is a curiosity, not an everyday cup — brew it darker, use immersion methods, and expect a bold, polarising, unconventional profile.",
    teaserTitle: "Liberica picks",
    teaserDescription:
      "Rare Liberica lots — if and when Indian roasters list them.",
    gridNudge:
      "Grind coarser than Arabica, brew at 88–92°C, and lean into milk or sugar — Liberica's funk rewards bold preparation.",
    heroBadge: "Rare species",
    faqOverline: "Liberica",
    faqTitle: "About *Liberica* coffee",
    faqDescription: "The rare third species and its place in Indian coffee.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Caffeine", value: "Low (~1.2%)" },
        { label: "Body", value: "Heavy, syrupy" },
        { label: "Acidity", value: "Low" },
        { label: "Best for", value: "Curiosity, immersion brewing, milk" },
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
          "Liberica (Coffea liberica) is the rarest of the three commercial coffee species and accounts for less than 2% of global production, concentrated in the Philippines (where it's called 'Barako'), Malaysia, and parts of West Africa. The beans are distinctive: large, irregular, and almond-shaped — noticeably bigger than Arabica or Robusta. The cup is divisive: smoky, woody, jackfruit-like, with a heavy syrupy body, unusual savoury-floral aromatics, and a lingering finish that some describe as tobacco-like. Indian Liberica, where it exists, is grown experimentally and almost never reaches the specialty market in volume. It's a curiosity for adventurous drinkers: rewarding for those who enjoy bold, unconventional flavours, but genuinely polarising for anyone expecting Arabica-like clarity.",
      },
      indiaContext:
        "Liberica has almost no commercial footprint in India. Coffee here is overwhelmingly Arabica and Robusta; Liberica appears, if at all, in tiny experimental plantings or heritage trees maintained for genetic diversity on a handful of Karnataka and Kerala estates. India's Coffee Board doesn't track Liberica as a separate category in production statistics — it's that marginal. If you find an Indian Liberica lot, treat it as a genuine rarity. In Southeast Asia, particularly the Philippines, Liberica ('Barako') is culturally important and commands premium prices. India could theoretically grow it in its lower-altitude, humid coastal regions, but there's no established supply chain or processing infrastructure.",
      brewGuidance: {
        recommended: ["french-press", "aeropress", "moka-pot"],
        notes:
          "Liberica's heavy body and bold, smoky character suit immersion and pressure methods — pour-over clarity works against it. French Press with a coarse grind, 88–92°C water, and a 4–5 minute steep lets the syrupy body and dark fruit come through without amplifying bitterness. AeroPress with a metal filter, 1:12 ratio, and 2-minute inverted steep gives more control over intensity. Moka Pot produces a concentrated, espresso-like Liberica that's excellent with steamed milk. In Southeast Asia, Liberica is traditionally dark-roasted and served with condensed milk or sugar — these preparations suit its character well. As a delicate light-roast pour-over it rarely works; the profile is too heavy and unconventional for a paper filter to flatter.",
      },
      comparison: {
        relatedSlugs: ["excelsa", "arabica", "robusta"],
        note: "Liberica and Excelsa are the two rare species beyond the Arabica–Robusta mainstream. Excelsa (botanically a Liberica variety) is tarter and fruitier with more acidity — closer to an intense natural-process Arabica in character. Liberica proper is smokier, heavier, and more savoury — closer to the 'dark and bold' end of the spectrum. Neither tastes like Arabica or Robusta; they're their own category entirely.",
      },
      commonMistakes: [
        {
          mistake: "Expecting it to taste like Arabica",
          fix: "Liberica is a different species entirely — smoky, savoury, and heavy where Arabica is bright and floral. Approach it with no expectations and let it be what it is.",
        },
        {
          mistake: "Brewing light-roast Liberica on pour-over",
          fix: "Liberica's heavy body and bold character need immersion or pressure methods. French Press, AeroPress, or Moka Pot — paper filter pour-over strips what makes it interesting.",
        },
        {
          mistake: "Using too-hot water",
          fix: "Keep it at 88–92°C. Liberica's smokiness and bitterness intensify at higher temperatures. A slightly lower temperature smooths the cup.",
        },
      ],
      icbDataNote:
        "Liberica is extremely rare in the ICB catalogue — Indian roasters seldom list it and availability is sporadic at best. Expect few or no results at any given time. This page exists for education and completeness so that drinkers who encounter Liberica elsewhere can understand the species in an Indian context.",
    },

    filter: {
      bean_species: ["liberica" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Liberica coffee?",
        answer:
          "Coffea liberica is the rare third commercial coffee species, after Arabica and Robusta. It has large, almond-shaped, irregular beans and a distinctive smoky, woody, jackfruit-like flavour with heavy syrupy body and low acidity. It accounts for less than 2% of global coffee production.",
      },
      {
        question: "Is Liberica grown in India?",
        answer:
          "Barely. Indian coffee is overwhelmingly Arabica (~40% of production) and Robusta (~60%). Liberica has almost no commercial presence here and is found only in rare experimental or heritage plantings on a handful of Karnataka and Kerala estates — it's seldom if ever available from Indian roasters.",
      },
      {
        question: "What does Liberica taste like compared to Arabica?",
        answer:
          "Completely different. Where Arabica is prized for clarity, acidity, and floral-citrus complexity, Liberica is smoky, woody, heavy-bodied, and savoury-floral — with jackfruit and dark fruit notes. It has lower caffeine than Arabica (~1.2%) despite its bold taste. Most Arabica drinkers find it challenging; it rewards those who enjoy unconventional, bold flavours.",
      },
      {
        question: "Where is Liberica popular?",
        answer:
          "The Philippines (where it's known as 'Barako' and is culturally significant), Malaysia, Indonesia, and parts of West Africa. Filipino Barako is typically dark-roasted and served strong with sugar. Malaysia's Liberica is gaining specialty attention, with producers experimenting with honey and natural processing.",
      },
      {
        question: "How should I brew Liberica?",
        answer:
          "Immersion methods — French Press (coarse grind, 88–92°C, 4–5 minutes) and AeroPress (metal filter, inverted, 2 minutes) — suit its heavy body. Moka Pot works well with milk. Traditionally served dark-roasted with condensed milk or sugar in Southeast Asia. Light-roast pour-over rarely flatters it.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Coffee species explained",
      description:
        "Arabica, Robusta, Liberica, Excelsa — the four commercial coffee species and how they differ.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["excelsa", "arabica", "robusta", "french-press"],
  },

  {
    slug: "excelsa",
    type: "bean_type",
    h1: "Excelsa Coffee in India",
    intro:
      "Explore Excelsa — a rare, tart-and-fruity member of the Liberica family. Prized for adding a dark, complex, almost wine-like layer to blends, and increasingly interesting to specialty producers in Southeast Asia. Very scarce in India.",
    headerNudge:
      "Excelsa is tarter and fruitier than Liberica — try it on AeroPress at 90°C to tease out the wine-like notes.",
    teaserTitle: "Excelsa picks",
    teaserDescription:
      "Rare Excelsa lots — uncommon offerings from Indian roasters.",
    gridNudge:
      "Treat Excelsa like an intense natural-process coffee — slightly coarser grind, lower temperature, and attention to brew time.",
    heroBadge: "Rare species",
    faqOverline: "Excelsa",
    faqTitle: "About *Excelsa* coffee",
    faqDescription: "The tart, fruity cousin of Liberica.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Caffeine", value: "Low (~1.0–1.2%)" },
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
          "Excelsa (classified as Coffea liberica var. dewevrei, though many trade catalogues list it as a separate species) is botanically part of the Liberica family but cups quite differently — tarter, fruitier, and more wine-like, with a dark complexity and bright acidity that Liberica lacks. In Southeast Asia, where most Excelsa is grown, it's valued as a blend component: 5–20% Excelsa in an Arabica or Robusta blend adds a tart, dark-fruit complexity that neither species can produce alone. Some Vietnamese producers use it as the 'secret ingredient' in their signature blends. In India, Excelsa barely registers in commercial production — it exists in scattered experimental plantings, if at all. Indian Excelsa is a genuine rarity, but the species is gaining attention globally as specialty roasters look beyond Arabica and Robusta.",
      },
      indiaContext:
        "Excelsa has a negligible commercial presence in India — the country's coffee is dominated by Arabica and Robusta, and Excelsa, like Liberica, is absent from Coffee Board production statistics. It exists only in scattered experimental plantings at research stations or adventurous estates. Treat any Indian Excelsa offering as a rare find and a chance to taste a species almost nobody in India has encountered. Globally, Excelsa is gaining interest: Southeast Asian producers in the Philippines and Vietnam are beginning to apply specialty processing to Excelsa, and it featured in international cupping competitions for the first time in the early 2020s.",
      brewGuidance: {
        recommended: ["aeropress", "french-press", "v60"],
        notes:
          "Excelsa's tart, fruity character can take more brewing approaches than Liberica — its brighter acidity makes it less one-dimensional. AeroPress (90°C, 1:14 ratio, 90-second inverted steep with a metal filter) handles the body while preserving the tartness. French Press (coarse grind, 92°C, 4 minutes) lets the dark fruit and wine-like complexity fill out. A careful V60 (medium grind, 90–93°C, slow pour) can tease out the bright, wine-like fruit if the roast isn't too dark — this is the one rare species where pour-over can actually work. It's most commonly used in small proportions (5–20%) in blends to add complexity rather than brewed alone.",
      },
      comparison: {
        relatedSlugs: ["liberica", "blends", "arabica"],
        note: "Excelsa and Liberica are siblings — both in the Liberica botanical family — but the cup difference is significant. Liberica is smoky, savoury, and heavy; Excelsa is tart, fruity, and brighter, with acidity closer to a natural-process Arabica than to Liberica proper. Excelsa works better in blends because its tartness adds contrast; Liberica is better as a standalone curiosity. Both are worlds apart from standard Arabica or Robusta.",
      },
      commonMistakes: [
        {
          mistake: "Treating it like Liberica",
          fix: "Despite being botanical siblings, Excelsa is tarter and brighter. It can handle pour-over where Liberica can't — don't default to immersion just because they're related.",
        },
        {
          mistake: "Brewing at Arabica temperatures",
          fix: "Start at 90°C, not 93–96°C. Excelsa's tartness intensifies at high temperatures and can tip from pleasantly wine-like to unpleasantly sour.",
        },
        {
          mistake: "Using too much in a blend",
          fix: "Excelsa is best at 5–20% of a blend. More than that and the tart, dark-fruit character dominates instead of adding complexity.",
        },
      ],
      icbDataNote:
        "Excelsa is among the rarest entries in the ICB catalogue — Indian roasters rarely if ever list it. Expect few or no results at any given time. This page is provided for education and completeness, recognising Excelsa's growing global interest even though Indian supply is essentially non-existent.",
    },

    filter: {
      bean_species: ["excelsa" as SpeciesEnum],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Excelsa coffee?",
        answer:
          "Excelsa is a rare coffee classified within the Liberica family (Coffea liberica var. dewevrei), though it's often listed as a distinct species in trade. It's known for a tart, fruity, wine-like profile with dark berry and savoury notes — distinctly different from both Arabica and Robusta, and quite different from Liberica proper.",
      },
      {
        question: "Is Excelsa the same as Liberica?",
        answer:
          "Botanically they're related — Excelsa is a variety of Liberica — but the cup profiles are different enough that the trade treats them separately. Excelsa is tarter, fruitier, and brighter with notable acidity. Liberica is smokier, heavier, and more savoury. Think of them as siblings with very different personalities.",
      },
      {
        question: "Is Excelsa available in India?",
        answer:
          "Very rarely — effectively not at commercial scale. Indian production is dominated by Arabica and Robusta, and Excelsa appears only in scattered experimental plantings. It's more available in the Philippines, Vietnam, and Malaysia, where some producers are beginning to apply specialty processing to it.",
      },
      {
        question: "Why is Excelsa used in blends?",
        answer:
          "Its tart, dark-fruit complexity adds a layer that neither Arabica nor Robusta can produce. At 5–20% in a blend, Excelsa gives a wine-like depth and brightness without dominating. Some Vietnamese coffee blends use it as a signature component. Solo, it's interesting but can be intense.",
      },
      {
        question: "How should I brew Excelsa?",
        answer:
          "AeroPress (90°C, inverted, 90 seconds) and French Press (92°C, 4 minutes) handle it well. Unlike Liberica, a careful V60 can work — the acidity responds to pour-over clarity. Use slightly lower temperatures than Arabica to manage the tartness. It's the one rare species where pour-over is worth trying.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Coffee species explained",
      description:
        "Arabica, Robusta, Liberica, Excelsa — how the four commercial species differ in cup, cultivation, and character.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["liberica", "blends", "arabica", "natural"],
  },

  {
    slug: "blends",
    type: "bean_type",
    h1: "Coffee Blends in India",
    intro:
      "Browse Indian coffee blends — Arabica–Robusta combinations and house blends built for balance, body, and consistency. From espresso blends engineered for crema and milk to the Robusta-forward mixes that define South Indian filter coffee, blends are how most Indians drink coffee.",
    headerNudge:
      "Dial espresso at 92°C with a 1:2 yield and adjust grind for bitterness — Robusta-heavy blends run hotter and more bitter than pure Arabica.",
    teaserTitle: "Top blend picks",
    teaserDescription:
      "Arabica–Robusta and house blends, sorted by community rating.",
    gridNudge:
      "Check the Arabica:Robusta ratio — 80:20 drinks cleaner; 50:50 and below punches through milk and sugar.",
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
          "Blending is central to Indian coffee culture and the ratios tell a story. An 80:20 Arabica–Robusta blend keeps Arabica's aromatics and sweetness but adds Robusta's body and crema — a good all-rounder for espresso and filter. At 70:30, the balance shifts: more body, more caffeine, and better resistance to milk. 60:40 and 50:50 are traditional filter coffee territory — robust, strong, designed to be diluted with hot milk. Below 50% Arabica (Robusta-dominant blends), you're in classic South Indian filter coffee and commercial espresso blend territory — maximum body and strength, less subtlety. Roasters design their house blend ratio around the intended preparation: espresso blends lean higher-Arabica for aroma; filter coffee blends lean Robusta for strength under milk and chicory.",
      },
      indiaContext:
        "Blends are how most Indians actually drink coffee — the South Indian filter coffee tradition is built on Arabica–Robusta blends (often with chicory), and espresso blends dominate café menus from Bengaluru to Mumbai. Where single origins celebrate the character of one estate, blends prioritise balance, body, and repeatability — a consistent cup the roaster can deliver every batch regardless of seasonal variation in green coffee supply. Many Indian roasters maintain a signature house blend for years, adjusting component coffees behind the scenes while keeping the cup profile stable. This engineering is its own craft, distinct from single-origin curation.",
      brewGuidance: {
        recommended: ["espresso", "moka-pot", "filter-coffee", "french-press"],
        notes:
          "Blends are built for body and consistency, so they shine under pressure and with milk. Espresso: pull at 90–93°C with a fine grind and 1:2 yield ratio — start with 18g in, 36g out in 25–30 seconds. Robusta-forward blends produce thicker crema but can run bitter, so dial slightly coarser if bitterness dominates. Moka Pot: medium-fine grind, fill the basket level, low-medium heat — yields a strong, concentrated cup in 4–5 minutes. South Indian filter: fine grind, pack the upper chamber loosely, pour boiled water, and let it drip 10–15 minutes. French Press: coarse grind, 92°C, 4 minutes — the metal filter preserves the full body of blends with Robusta. Higher-Arabica blends (80:20) also work on pour-over if you want a cleaner cup with some body.",
      },
      comparison: {
        relatedSlugs: ["single-origin", "arabica", "robusta", "chicory-mixes"],
        note: "Blends vs single origin is philosophy, not quality. Single origins show you what one place tastes like in one season — distinctive but variable. Blends show you what a roaster can engineer — balanced, repeatable, and optimised for a specific brew method. The best Indian blends are carefully crafted for espresso crema or filter coffee strength; the best single origins are curated for clarity and character. Add chicory to an Arabica–Robusta blend and it becomes the classic South Indian filter coffee mix.",
      },
      roastPairing: {
        best: ["medium-roast", "medium-dark-roast"],
        works: ["dark-roast", "light-medium-roast"],
        avoid:
          "Light roast blends are uncommon and often awkward — Robusta components taste grainy and astringent when under-roasted, and the blend was designed for body and balance, not bright acidity.",
      },
      commonMistakes: [
        {
          mistake: "Using Arabica espresso settings for Robusta-heavy blends",
          fix: "Grind coarser and pull at 90–92°C instead of 93–96°C. Robusta extracts differently — Arabica settings on a 50:50 blend will run bitter and harsh.",
        },
        {
          mistake: "Judging a blend on pour-over",
          fix: "Most Indian blends are engineered for espresso or filter coffee with milk. Evaluate them in their intended method before deciding — a blend that's boring on V60 might be excellent as espresso.",
        },
        {
          mistake: "Ignoring the Arabica:Robusta ratio",
          fix: "80:20 and 50:50 are very different cups. Check the ratio to match your preference: higher Arabica for aroma, higher Robusta for body and milk compatibility.",
        },
      ],
      icbDataNote:
        "Blends — including generic blends and specified Arabica–Robusta ratios (80:20, 70:30, 60:40, 50:50) — are a substantial segment of the ICB catalogue. They're concentrated in the espresso and everyday filter coffee categories rather than the top-rated single origins. The most common listed ratios are 70:30 and 80:20, reflecting the espresso-forward preferences of Indian specialty café culture.",
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
          "A blend combines beans of different species, origins, or roast profiles into one product. In India that usually means Arabica with Robusta at a specific ratio — balancing Arabica's aroma and sweetness with Robusta's body, crema, and strength. Multi-origin Arabica blends also exist, combining beans from different estates or regions.",
      },
      {
        question: "Are blends lower quality than single origins?",
        answer:
          "No — they serve a different purpose and require a different skill. Single origins showcase one estate's character; blends are engineered for balance, consistency, and performance in a specific brew method. A well-built espresso blend delivers the same reliable crema, body, and taste every batch — that engineering is its own craft.",
      },
      {
        question: "What do the Arabica:Robusta ratios mean for taste?",
        answer:
          "80:20 is aromatic and balanced — good for espresso and clean filter. 70:30 adds more body and crema, the sweet spot for many Indian espresso blends. 60:40 and 50:50 are traditional filter coffee territory — strong, milky, and designed for South Indian preparation. Robusta-dominant blends (below 50% Arabica) are maximum strength, built for heavy milk dilution.",
      },
      {
        question: "What's a typical Indian filter coffee blend?",
        answer:
          "A Robusta-forward blend — often 60:40 or 50:50 Arabica–Robusta, frequently with 10–20% chicory added. The Robusta provides body and strength to stand up to milk and sugar, while Arabica adds aroma and smoothness. The chicory deepens the body and adds caramel bittersweetness.",
      },
      {
        question: "How should I brew a blend?",
        answer:
          "Espresso (90–93°C, 18g dose, 1:2 yield, 25–30 seconds), Moka Pot (medium-fine grind, low heat), and South Indian filter (fine grind, boiled water, 10–15 minute drip) suit blends best. Robusta-heavy blends give thick crema and strength; dial slightly coarser if espresso runs bitter. Higher-Arabica blends (80:20) can also work on pour-over.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Espresso blend guide",
      description:
        "How Arabica–Robusta ratios affect crema, body, and flavour in espresso and filter coffee.",
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
      "Explore Indian coffee–chicory blends — the heart of South Indian filter coffee. Roasted chicory root adds body, a gentle bittersweetness, and that distinctive, milk-friendly syrupy character that defines the tradition for millions of coffee drinkers across Tamil Nadu, Karnataka, Andhra Pradesh, and Kerala.",
    headerNudge:
      "Use a fine grind, boiled water, and let the decoction drip slowly through the metal filter — 10–15 minutes for full extraction. Always serve with hot milk.",
    teaserTitle: "Top chicory mix picks",
    teaserDescription:
      "Coffee–chicory blends and filter coffee mixes, by rating.",
    gridNudge:
      "Higher chicory percentages (20–30%) give a stronger, more bittersweet decoction — start at 15% if you're new to the tradition.",
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
          "Chicory — the roasted, ground root of the Cichorium intybus plant — has been blended into South Indian coffee for generations. It's caffeine-free but adds body, a dark caramel bittersweetness, and a syrupy texture that holds up beautifully to milk and sugar in the classic filter coffee preparation. Typical mixes run 10–30% chicory with an Arabica–Robusta coffee base; at 10–15% the chicory adds smoothness without dominating, at 20% the bittersweetness becomes prominent, and at 30% the chicory character is front and centre — dark, earthy, and heavily bodied. The combination is inseparable from the South Indian filter coffee ritual: a slow-drip decoction served frothy with hot milk in a tumbler and dabarah, the pouring between the two vessels aerating the coffee into a smooth, frothy layer.",
      },
      indiaContext:
        "Chicory coffee is a cultural institution in South India. The tradition traces to the colonial era — some attribute it to wartime rationing, others to French influence via Pondicherry — but regardless of origin, the coffee–chicory blend became the defining taste of filter coffee in Tamil Nadu, Karnataka, Andhra Pradesh, and Kerala. Far from being a cheap substitute (as critics sometimes claim), the chicory character is now what millions of people specifically love about the cup — it's the flavour of home, of railway station coffee, of hotel breakfast, and of the tumbler-and-dabarah ritual that defines South Indian hospitality. Brands like Narasu's, Cothas, Leo, and Bru built their reputations on precisely calibrated chicory-blend formulas.",
      brewGuidance: {
        recommended: ["filter-coffee", "moka-pot", "french-press"],
        notes:
          "Chicory mixes are made for the South Indian filter — a stainless steel two-chamber drip device. Pack the upper chamber loosely with fine-ground mix (about 3 tablespoons for one serving), pour freshly boiled water, cover, and let it drip for 10–15 minutes. The resulting decoction is concentrated and potent — mix it 1:1 or 1:2 with hot milk, add sugar to taste, and pour between tumbler and dabarah to froth. Moka Pot produces a similar concentrated result with a medium-fine grind — excellent if you don't have a traditional filter. French Press at a coarse grind and 4-minute steep works in a pinch but loses some of the concentration. These mixes are not designed for black pour-over; the earthy bittersweetness needs milk to balance and round out.",
      },
      comparison: {
        relatedSlugs: ["blends", "robusta", "filter-coffee"],
        note: "Chicory mixes are essentially an Arabica–Robusta blend with roasted chicory added — remove the chicory and you have a standard coffee blend. The chicory adds body, bittersweetness, and that distinctive earthy-caramel character but contributes no caffeine. For the same coffee base without chicory, see blends; for a cleaner, black filter experience, choose a pure Arabica single origin. If you enjoy chicory's character, you'll also like Robusta-heavy blends — similar body and strength, minus the chicory earthiness.",
      },
      commonMistakes: [
        {
          mistake: "Drinking chicory mixes black",
          fix: "Chicory mixes are designed for milk. The earthy bittersweetness balances beautifully with hot milk and sugar — black, it's overwhelming and unpleasant for most palates.",
        },
        {
          mistake: "Using a paper-filter pour-over dripper",
          fix: "Use the South Indian metal filter or a Moka Pot. Paper filters strip the body and syrupy texture that make chicory mixes special — the metal filter preserves them.",
        },
        {
          mistake: "Rushing the decoction",
          fix: "Let the South Indian filter drip for 10–15 minutes. Speed produces a weak, watery decoction. Patience produces a thick, concentrated extract that holds up under milk.",
        },
      ],
      icbDataNote:
        "Coffee–chicory mixes occupy a distinct, tradition-driven niche in the ICB catalogue, listed mainly by roasters serving the South Indian filter coffee market. They sit apart from the third-wave single-origin segment and are concentrated in the budget and mid-range price brackets. Community ratings are consistently positive from drinkers who judge them in their intended context — as a milk-based filter coffee base, not a black pour-over.",
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
          "It's coffee blended with roasted, ground chicory root (Cichorium intybus). Chicory contains no caffeine but adds body, a dark caramel bittersweetness, and a syrupy texture — the signature character of South Indian filter coffee. It's not a substitute for coffee; it's a deliberate flavour component.",
      },
      {
        question: "Why is chicory added to Indian filter coffee?",
        answer:
          "Originally to add body and stretch the coffee during periods of scarcity, but the chicory character became central to the taste of South Indian filter coffee over generations. Today it's a deliberate choice: the chicory gives the decoction the strength, body, and smoothness needed to pair with hot milk and sugar in the traditional preparation.",
      },
      {
        question: "How much chicory is in a typical mix?",
        answer:
          "Usually 10–30%, blended with an Arabica–Robusta coffee base. At 10–15% the chicory smooths the cup without dominating. At 20% the bittersweetness is prominent. At 30% the chicory character is front and centre — dark, earthy, and fully bodied. Most commercial South Indian filter mixes sit at 20–25%.",
      },
      {
        question: "How should I brew a chicory mix?",
        answer:
          "Use a South Indian filter (fine grind, boiled water, 10–15 minute drip) to make a concentrated decoction, then mix 1:1 or 1:2 with hot milk and sugar. Pour between tumbler and dabarah to froth. Moka Pot is a good alternative. These mixes are made for milk-based filter coffee, not black pour-over.",
      },
      {
        question: "Does chicory have caffeine?",
        answer:
          "No — chicory root is caffeine-free. A chicory mix has less caffeine per gram than pure coffee because some of the weight is chicory. A 20% chicory mix contains roughly 20% less caffeine than the same weight of pure coffee. The energy and alertness come from the coffee component only.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "South Indian filter coffee guide",
      description:
        "The traditional preparation: decoction, milk ratios, frothing, and the tumbler-and-dabarah ritual.",
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
      "Discover Indian single-origin coffees — lots traceable to one estate or region, unblended, so the terroir, variety, and processing speak for themselves. This is where Indian specialty coffee shows its character: the difference between Chikmagalur and Araku, washed and natural, SL-795 and Cauvery — all unmasked.",
    headerNudge:
      "Brew clean and precise — 15g to 250ml at 93°C on a V60 lets the estate character speak without interference.",
    teaserTitle: "Top single-origin picks",
    teaserDescription:
      "Traceable single-estate and single-region lots, by rating.",
    gridNudge:
      "Check the variety and process before brewing — SL-795 washed and Cauvery natural want different temperatures and grind sizes.",
    heroBadge: "Sourcing",
    faqOverline: "Single origin",
    faqTitle: "About *single-origin* coffee",
    faqDescription: "Traceability and why it matters in Indian coffee.",
    faqBadge: "Bean Type",

    beanTypeProfile: {
      characteristics: [
        { label: "Sourcing", value: "One estate or region" },
        { label: "Traceability", value: "High — estate, variety, process" },
        { label: "Character", value: "Terroir-driven, seasonal" },
        { label: "Best for", value: "Pour-over, tasting, exploring origin" },
      ],
      flavourProfile: {
        typical: [
          "Terroir-specific",
          "Distinctive",
          "Clean",
          "Variety-driven",
          "Process-led",
          "Seasonal",
        ],
        indianContext:
          "Single origin is where Indian specialty coffee makes its case internationally. A single-origin lot comes from one estate (or one tightly defined region) and isn't blended with anything else, so altitude, variety, soil, and processing show through unmasked. The flavour range across Indian single origins is wider than most people expect: washed SL-795 from Baba Budangiri at 1,400m tastes like jasmine and bergamot; natural Cauvery from a Coorg estate at 1,100m tastes like ripe plum and dark chocolate; anaerobic lots from progressive Karnataka estates taste like tropical fruit and red wine. Indian single origins change with the harvest — each crop year brings variation — so they're seasonal by nature, unlike the year-round consistency of a house blend. The best lots sell out within weeks of release.",
      },
      indiaContext:
        "The single-origin movement is what put Indian specialty coffee on the international map. By tracing a coffee to a specific estate and being transparent about variety, altitude, and processing, roasters let drinkers taste the difference between Chikmagalur and Araku, washed and natural, SL-795 and Cauvery — differences that blending deliberately smooths over. It's the opposite philosophy to blending: instead of balance and repeatability, single origins prize distinctiveness and a sense of place. Indian single origins are now appearing in international cupping competitions and speciality importers' portfolios alongside established origins like Ethiopia, Colombia, and Kenya — proof that Indian terroir can stand on its own.",
      brewGuidance: {
        recommended: ["v60", "chemex", "aeropress", "kalita"],
        notes:
          "Single origins are best on pour-over, where clarity lets the terroir and variety express fully. Match your parameters to the processing: washed lots like 93–96°C, a medium-fine grind, and a 1:15–1:16.7 ratio — target 2:45–3:15 total brew time on V60. Natural-process lots extract faster, so grind slightly coarser and drop temperature to 90–93°C to manage the sweetness and fruit intensity. Honey-process sits between the two — start at 92°C and adjust. Chemex suits medium and medium-dark single origins with its thicker paper filtering out heavy oils. AeroPress is versatile for any processing — try 85°C inverted for 2 minutes for a sweeter, lower-acidity cup. Tasting the same origin across two brew methods (V60 vs AeroPress, for example) is a great way to understand what the estate produced that season.",
      },
      comparison: {
        relatedSlugs: ["blends", "arabica", "robusta"],
        note: "Single origins vs blends is philosophy, not hierarchy. Single origins celebrate what one estate produced in one season — distinctive, traceable, and variable by nature. Blends prioritise balance, consistency, and performance across batches. Most Indian single origins are Arabica, though fine single-estate Robusta is emerging from Karnataka. If you enjoy exploring different flavour profiles and don't mind seasonal variation, single origins are the format that rewards attention. If you want a reliable everyday cup, blends are built for that.",
      },
      roastPairing: {
        best: ["light-roast", "light-medium-roast"],
        works: ["medium-roast"],
        avoid:
          "Dark roast masks the terroir, variety, and processing character that make single origins worth buying. You're paying for distinctiveness — dark roast erases it. If you want a dark, heavy cup, a blend is better value.",
      },
      commonMistakes: [
        {
          mistake: "Using stale beans",
          fix: "Single origins are best 7–21 days post-roast. Freshness matters more here than for blends — stale single origins lose the distinctive character that justifies the premium.",
        },
        {
          mistake: "One recipe for all single origins",
          fix: "Match parameters to the processing: 93–96°C and finer grind for washed, 90–93°C and coarser for naturals, somewhere in between for honeys. Same origin, different process = different recipe.",
        },
        {
          mistake: "Adding milk to light-roast single origins",
          fix: "Milk buries the delicate terroir notes you're paying a premium for. Taste it black first to understand the estate's character — you can always add milk later if you prefer.",
        },
      ],
      icbDataNote:
        "Single-origin lots make up the most highly rated segment of the ICB catalogue — the estate-traceable coffees that define Indian specialty. They account for the majority of top-rated listings and the highest community engagement. This page lists every coffee flagged as single origin, regardless of species, and includes both Arabica and the growing number of fine single-estate Robusta lots.",
    },

    filter: {
      single_origin_only: true,
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is single-origin coffee?",
        answer:
          "Coffee sourced from one place — a single estate, a specific lot within an estate, or a tightly defined region — and not blended with beans from elsewhere. This traceability lets the terroir, variety, altitude, and processing of that one source show through clearly in the cup.",
      },
      {
        question: "Single origin vs blend — what's the difference?",
        answer:
          "Single origins showcase the distinct character of one estate and change with each harvest — they're seasonal and variable by nature. Blends combine sources for balance and year-round consistency. Neither is 'better' — they serve different goals. Single origins reward exploration; blends reward reliability.",
      },
      {
        question: "Are Indian single origins always Arabica?",
        answer:
          "Mostly, but not exclusively. The estate-traceable lots that define Indian specialty are overwhelmingly Arabica — particularly SL-795, Cauvery, and Chandragiri — but a growing number of roasters now offer fine single-estate Robusta processed with specialty care. Look for 'fine Robusta' or 'specialty Robusta' in the listing.",
      },
      {
        question: "Why do single origins sell out quickly?",
        answer:
          "Because they're seasonal — each lot is produced from one harvest, and quantities are limited. A specific estate's washed SL-795 might yield only a few hundred kilograms of top-grade green coffee per year. Once roasted and sold, it's gone until the next harvest. Popular lots from well-known estates sell out within weeks of release.",
      },
      {
        question: "How should I brew a single origin?",
        answer:
          "Pour-over — V60, Chemex, Kalita — shows terroir best. Match parameters to processing: washed lots at 93–96°C with finer grind; naturals at 90–93°C with coarser grind; honeys in between. AeroPress at 85°C inverted is versatile for any processing. Try the same origin on two different methods to understand the estate's character.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Indian single-origin guide",
      description:
        "How to read estate labels, understand seasonal lots, and taste the difference between Indian growing regions.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["blends", "arabica", "chikmagalur", "washed", "araku"],
  },
];
