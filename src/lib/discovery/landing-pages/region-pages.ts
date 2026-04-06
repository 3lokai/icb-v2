// src/lib/discovery/landing-pages/region-pages.ts
import type { LandingPageConfig } from "./types";

export const regionPages: LandingPageConfig[] = [
  {
    slug: "chikmagalur",
    type: "region",
    h1: "Chikmagalur Coffee in India",
    intro:
      "Discover specialty coffees from Chikmagalur — Karnataka's historic coffee heartland, home to India's oldest arabica plantations, high-altitude estates, and the variety that put Indian coffee on the world map.",
    headerNudge:
      "India's most storied coffee region — wide range of roast styles and processes across roasters.",
    teaserTitle: "Chikmagalur coffees",
    teaserDescription:
      "From classic washed estate lots to experimental microlots.",
    gridNudge:
      "Compare processes and roast levels across roasters — the same region produces very different cups depending on who's sourcing.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Karnataka",
        elevation: "900–1,700m",
        knownFor: "SL-795 washed arabica, heritage estates",
      },
      overview:
        "Chikmagalur is where Indian specialty coffee begins. The district sits in the Western Ghats at elevations between 900 and 1,700 metres — high enough for slow cherry maturation and complex flavour development. Coffee arrived here in the 17th century, brought by Baba Budan from Yemen, and the region has been producing arabica continuously since. Today it's home to some of India's most celebrated estates — Yele Attikan, Hoysala, Kelachandra, and others — and the primary source of competition-grade Indian coffee.",
      terroir: {
        climate:
          "Tropical highland with distinct dry and wet seasons. Monsoon rains June–September, dry harvest season November–February. Dense shade from silver oak and indigenous trees moderates temperature.",
        soil: "Red laterite and loamy soils with good drainage. Iron-rich composition contributes to the mineral quality in the cup.",
        altitude:
          "Lower estates (900–1,100m) produce bolder, fuller-bodied coffees. High-altitude lots (1,400m+) develop slower, with more acidity and floral character.",
        varieties:
          "SL-795 dominates the specialty segment — developed at Scott Laboratories and prized for its cup quality at altitude. Chandragiri, Cauvery, and Selection 9 are also grown. Older estates have mixed plantings of heritage varieties.",
      },
      flavourProfile: {
        typical: [
          "Jasmine",
          "Stone fruit",
          "Bright acidity",
          "Brown sugar",
          "Clean finish",
          "Mild chocolate",
        ],
        indianContext:
          "Washed Chikmagalur SL-795 is India's benchmark specialty coffee — jasmine, peach, and clean citrus when roasted light, brown sugar and mild chocolate at light-medium. The region's high-altitude estates consistently produce India's most competition-worthy lots. Natural and honey lots from the same estates are more fruit-forward and heavier in body — the same terroir expressed differently through processing.",
        processVariation:
          "Washed lots show maximum terroir clarity — origin and varietal character come through cleanly. Natural lots from the same estates produce richer, fruit-heavy cups. Honey and anaerobic lots are increasingly common as producers experiment — these command premium pricing and produce some of ICB's highest-rated coffees.",
      },
      roasterContext:
        "Chikmagalur is the most sourced Indian coffee region — virtually every Indian specialty roaster has at least one Chikmagalur lot in their catalogue. Blue Tokai, Subko, Third Wave Coffee, Corridor Seven, and many others source consistently from the district. This broad sourcing base means you can compare the same region processed and roasted differently across multiple roasters — useful for understanding how producer and roaster decisions shape the cup.",
      brewGuidance: {
        recommended: ["v60", "aeropress", "chemex"],
        notes:
          "Washed Chikmagalur light roasts are ideally suited to V60 and Chemex — the clarity of paper-filtered pour-over lets the jasmine and stone fruit come through cleanly. AeroPress works well for a slightly more concentrated version. Natural Chikmagalur lots suit French Press for full body, or V60 with a slightly coarser grind and lower temperature.",
      },
      nearbyRegions: ["coorg", "wayanad"],
      icbDataNote:
        "Chikmagalur is the most represented region in the ICB catalogue — more coffees, more ratings, and more roasters than any other single origin. It's the best region to start comparing if you're new to Indian specialty: the data density gives you the most community comparison before buying.",
    },

    regionSnapshot: {
      state: "Karnataka",
      elevation: "900–1,700m",
      knownFor: "SL-795 washed arabica, heritage estates",
    },
    faqOverline: "Chikmagalur",
    faqTitle: "About *Chikmagalur* coffee",
    faqDescription:
      "What to expect from India's most celebrated coffee region.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["chikmagalur"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Why is Chikmagalur famous for coffee?",
        answer:
          "It's one of India's oldest continuous coffee-growing areas — arabica has been grown here since the 17th century. The combination of high altitude (up to 1,700m), Western Ghats climate, and SL-795 variety produces India's most competition-grade lots consistently.",
      },
      {
        question: "What is SL-795 and why does it matter?",
        answer:
          "SL-795 is India's most prized arabica variety, developed at the Scott Laboratories in the 1940s. At high altitude in Chikmagalur, it produces jasmine, stone fruit, and bright acidity — the flavour profile that's made Indian specialty coffee internationally credible.",
      },
      {
        question: "What flavours should I expect?",
        answer:
          "Washed light roasts: jasmine, peach, clean citrus, brown sugar. Natural lots: richer, darker fruit, heavier body. Honey lots: caramel sweetness, smooth finish. Roast level and process drive the variation more than the region itself — use filters to narrow down.",
      },
      {
        question: "Chikmagalur vs Coorg — what's the difference?",
        answer:
          "Both are Karnataka heavyweights. Chikmagalur estates tend toward brighter, more floral profiles especially at higher altitudes. Coorg often produces fuller-bodied, more chocolatey cups. The best way to understand the difference is to compare the same process and roast level from both regions side by side.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description:
        "Region guides, processing explainers, and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["coorg", "wayanad", "light-roast", "washed"],
  },

  {
    slug: "coorg",
    type: "region",
    h1: "Coorg Coffee in India",
    intro:
      "Browse Indian specialty coffees from Coorg (Kodagu) — lush Western Ghats hills, established estates, and coffees spanning classic washed arabica to modern experimental processing.",
    headerNudge:
      "Often bold and full in body — great for espresso, milk drinks, and everyday drinkers.",
    teaserTitle: "Coorg coffees",
    teaserDescription: "Kodagu-origin lots from roasters across India.",
    gridNudge:
      "Pair with process filters to find naturals or washed estate lots — the region produces both well.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Karnataka (Kodagu district)",
        elevation: "800–1,600m",
        knownFor: "Full-bodied arabica, espresso and milk drink suitability",
      },
      overview:
        "Coorg — officially Kodagu district — is Karnataka's other major coffee heartland, adjacent to Chikmagalur but with distinct character. The district is densely forested, with coffee grown under native shade at elevations ranging from 800 to 1,600 metres. It's the largest coffee-producing district in Karnataka by volume, with a mix of large estates, medium-sized family farms, and a growing number of specialty-focused producers. Coorg is also known for its spice cultivation alongside coffee — cardamom, pepper, and ginger grow alongside coffee plants, which some producers argue influences flavour.",
      terroir: {
        climate:
          "Heavy monsoon rainfall — one of India's wettest regions. Dense forest cover moderates temperature. The high rainfall means naturals are more challenging to produce here than in drier parts of Karnataka.",
        soil: "Rich red laterite soil with high organic content from the dense forest floor. Good drainage on slopes prevents waterlogging despite heavy rainfall.",
        altitude:
          "Lower-altitude Coorg (800–1,100m) produces heavier, more robust cups. Higher-altitude lots (1,400m+) develop more acidity and floral notes, closer in character to Chikmagalur.",
        varieties:
          "SL-795, Cauvery, and Chandragiri are the primary arabica varieties. Robusta is also grown at lower elevations — Coorg robusta is used in traditional South Indian filter blends.",
      },
      flavourProfile: {
        typical: [
          "Dark chocolate",
          "Caramel",
          "Spice",
          "Full body",
          "Mild acidity",
          "Nuts",
        ],
        indianContext:
          "Coorg arabica at medium roast is India's most approachable specialty coffee — chocolate-forward, full-bodied, and low enough in acidity for everyday drinking. It holds up exceptionally well to milk. Natural lots from Coorg estates are fruit-heavy and rich — a different expression of the same terroir. The spice notes that appear in some Coorg cups (cardamom, pepper) are a distinctive regional character — whether from the growing environment or proximity to spice cultivation, they're real and consistent.",
        processVariation:
          "Washed Coorg suits espresso and milk drinks best — the body holds up without becoming harsh. Natural Coorg lots are excellent on French Press and AeroPress. Honey-processed Coorg has grown significantly — the sweetness complements the region's naturally full body.",
      },
      roasterContext:
        "Coorg is well-sourced by Indian specialty roasters — Blue Tokai, Third Wave, Naivo, and many others carry Coorg lots. It's also the region most associated with traditional South Indian filter coffee blends, so both specialty and commodity roasters source here. On ICB, the specialty lots are distinguishable by estate name, varietal specification, and roast date — filter for these to avoid generic blends.",
      brewGuidance: {
        recommended: ["french-press", "filter-coffee", "aeropress"],
        notes:
          "Medium and medium-dark Coorg roasts are excellent in French Press — the full body and low acidity shine with the metal filter. South Indian filter coffee suits traditional Coorg blends well. For lighter Coorg roasts, AeroPress or V60 work — expect a slightly fuller cup than equivalent Chikmagalur lots at the same roast level.",
      },
      nearbyRegions: ["chikmagalur", "wayanad"],
      icbDataNote:
        "Coorg is the second most represented region in the ICB catalogue after Chikmagalur. Medium roasts and washed lots dominate the listings — it's the region with the most options for everyday drinkers who want reliable, approachable specialty coffee.",
    },

    regionSnapshot: {
      state: "Karnataka (Kodagu district)",
      elevation: "800–1,600m",
      knownFor: "Full-bodied arabica, espresso and milk drink suitability",
    },
    faqOverline: "Coorg",
    faqTitle: "About *Coorg* coffee",
    faqDescription: "Flavour, terroir, and buying tips for Kodagu coffee.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["coorg"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Coorg known for in coffee?",
        answer:
          "Full-bodied, chocolate-forward arabica that suits espresso and milk drinks. Kodagu is Karnataka's largest coffee-producing district by volume, with a mix of large estates and specialty-focused producers. It's also where most traditional South Indian filter coffee blends source their arabica.",
      },
      {
        question: "Coorg vs Chikmagalur — how are they different?",
        answer:
          "Coorg tends toward fuller body, chocolate, and spice — better suited to espresso and milk drinks. Chikmagalur (especially high-altitude lots) tends toward brighter acidity, jasmine, and fruit. Both produce excellent coffee — the difference is in character, not quality.",
      },
      {
        question:
          "Does the spice character in Coorg coffee come from the environment?",
        answer:
          "Possibly — Coorg is India's largest cardamom and pepper growing region, and coffee grows alongside these spices. Whether the flavour influence is environmental or varietal isn't settled, but the spice notes are real and consistent enough that experienced buyers recognise them.",
      },
      {
        question: "Best brew methods for Coorg coffee?",
        answer:
          "French Press and South Indian filter for medium to dark roasts — the body holds up well. AeroPress works across roast levels. For lighter Coorg lots, V60 shows the fruit and brightness that higher-altitude estates can produce.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description: "Region guides and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["chikmagalur", "wayanad", "medium-roast", "natural"],
  },

  {
    slug: "araku",
    type: "region",
    h1: "Araku Valley Coffee in India",
    intro:
      "Find specialty coffees from Araku Valley — Andhra Pradesh's highland coffee origin in the Eastern Ghats, known for bright, floral lots from tribal and cooperative producers.",
    headerNudge:
      "Floral, citrus-forward profiles at lighter roasts — India's most distinct non-Karnataka origin.",
    teaserTitle: "Araku coffees",
    teaserDescription:
      "Highland lots from the Eastern Ghats of Andhra Pradesh.",
    gridNudge:
      "Light roasts often highlight florals and citrus — check tasting notes and compare across roasters.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Andhra Pradesh (Visakhapatnam district)",
        elevation: "900–1,300m",
        knownFor: "Floral, citrus-forward arabica from tribal cooperatives",
      },
      overview:
        "Araku Valley sits in the Araku plateau of the Eastern Ghats at elevations between 900 and 1,300 metres — significantly different terrain from Karnataka's Western Ghats origins. Coffee here is primarily grown by tribal communities organised into cooperatives, with the Girijan Cooperative Corporation playing a significant role in production and marketing. Araku coffee gained international recognition in 2017 when it received a GI (Geographical Indication) tag — India's first coffee GI. It's also found a notable presence in European markets, particularly Paris, where it's served in high-end cafés.",
      terroir: {
        climate:
          "Eastern Ghats climate — drier than Karnataka's Western Ghats, with distinct seasons. Lower humidity during harvest makes natural processing more viable. The plateau's altitude moderates temperature despite the lower latitude.",
        soil: "Rich forest soil with high organic matter from dense tribal forest land. Much of the growing area is within reserve forests — low chemical input and high biodiversity are defining characteristics.",
        altitude:
          "The plateau's consistent elevation (900–1,300m) produces a relatively uniform growing environment compared to Karnataka's wider altitude range.",
        varieties:
          "Primarily Chandragiri and SL-795 arabica. The GI specification covers arabica grown in the designated geographic area. Varietal specificity is less commonly communicated by roasters compared to Karnataka origins.",
      },
      flavourProfile: {
        typical: [
          "Citrus",
          "Bergamot",
          "Floral",
          "Bright acidity",
          "Light body",
          "Clean finish",
        ],
        indianContext:
          "Araku is India's most distinctively non-Karnataka origin — the Eastern Ghats terroir produces a noticeably different cup from Chikmagalur or Coorg. Light roasts show bergamot, citrus, and jasmine with a lighter body than Karnataka equivalents. The tribal cooperative production model — low input, forest-grown — contributes to a clean, almost delicate cup character. Araku naturals are particularly interesting: the Eastern Ghats' lower humidity produces cleaner naturals than the wetter Karnataka coast.",
        processVariation:
          "Washed Araku at light roast is the clearest expression of the region's terroir — floral and citrus come through cleanly. Natural Araku lots are less common but worth trying — the drier climate produces fruit-forward naturals without the fermented edge that humid-climate naturals sometimes develop.",
      },
      roasterContext:
        "Araku is carried by a growing number of Indian specialty roasters — Blue Tokai, Corridor Seven, and others have featured it. The GI tag and international reputation have raised its profile, but it remains less widely sourced than Karnataka origins. On ICB, Araku lots are identifiable by their distinctly lighter, more citrus-forward tasting notes compared to Karnataka coffees from the same roaster.",
      brewGuidance: {
        recommended: ["v60", "aeropress", "chemex"],
        notes:
          "Araku light roasts are ideally suited to V60 and Chemex — the floral and citrus notes that define the region come through most clearly in clean, paper-filtered pour-over. AeroPress works well at slightly lower temperature (90–92°C) for a more concentrated version. Avoid French Press for light Araku roasts — the immersion can muddy the delicate floral character.",
      },
      nearbyRegions: ["nilgiris", "koraput"],
      icbDataNote:
        "Araku is a growing category in the ICB catalogue — representation is increasing as more roasters source from the region. Light and light-medium roasts dominate the listings, consistent with the region's profile. Community ratings are positive but sample size is smaller than Karnataka origins — as more lots appear, the comparison data will become more useful.",
    },

    regionSnapshot: {
      state: "Andhra Pradesh (Visakhapatnam district)",
      elevation: "900–1,300m",
      knownFor: "Floral, citrus-forward arabica, GI-tagged origin",
    },
    faqOverline: "Araku",
    faqTitle: "About *Araku Valley* coffee",
    faqDescription:
      "India's GI-tagged coffee origin — terroir and flavour explained.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["araku"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is the Araku GI tag?",
        answer:
          "Araku Valley coffee received India's first coffee Geographical Indication tag in 2017 — officially recognising it as a distinct regional product. The GI covers arabica coffee grown in the designated Araku plateau area of Andhra Pradesh's Eastern Ghats.",
      },
      {
        question: "How is Araku different from Karnataka coffees?",
        answer:
          "The Eastern Ghats terroir produces a noticeably lighter, more citrus and floral cup than Karnataka's Western Ghats origins. Araku is less chocolatey and full-bodied than Coorg, and often more delicate than Chikmagalur — a distinctly different Indian coffee experience.",
      },
      {
        question: "Who grows Araku coffee?",
        answer:
          "Primarily tribal communities organised into cooperatives, particularly the Girijan Cooperative Corporation. The forest-grown, low-input production model contributes to the clean, organic character of the cup.",
      },
      {
        question: "Best brew methods for Araku coffee?",
        answer:
          "V60 and Chemex for light roasts — the floral and citrus notes come through most clearly in clean pour-over. AeroPress works well at slightly lower temperature. Avoid French Press for lighter roasts — it muddies the delicate character that makes Araku distinctive.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description: "Region guides and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["nilgiris", "chikmagalur", "light-roast", "washed"],
  },

  {
    slug: "nilgiris",
    type: "region",
    h1: "Nilgiris Coffee in India",
    intro:
      "Explore coffees from the Nilgiris — Tamil Nadu's Blue Mountain highlands, with cool-climate arabica, established estates, and a distinct terroir that sets it apart from Karnataka origins.",
    headerNudge:
      "Cool climate, high altitude, distinct terroir — elegant profiles in lighter roasts.",
    teaserTitle: "Nilgiris coffees",
    teaserDescription: "Blue Mountain highland lots from Tamil Nadu.",
    gridNudge:
      "Compare with Wayanad and Karnataka origins at the same roast level to understand terroir contrast.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Tamil Nadu",
        elevation: "1,200–2,000m",
        knownFor:
          "Cool-climate arabica with clarity and elegance in light roasts",
      },
      overview:
        "The Nilgiris — meaning Blue Mountains — straddle the borders of Tamil Nadu, Kerala, and Karnataka at elevations reaching 2,000 metres. Coffee grows primarily on the Tamil Nadu side, in the Nilgiri district around Ooty and the surrounding slopes. The Nilgiris have historically been associated with tea — the famous Nilgiri tea is from this region — but arabica coffee has been grown here for well over a century. The cool temperatures, distinct seasons, and high altitude create growing conditions that produce slower-maturing cherries and more nuanced cup profiles than lower-altitude origins.",
      terroir: {
        climate:
          "Cool and misty — one of India's cooler growing climates for coffee. Temperatures rarely exceed 25°C even in summer. The cool climate slows cherry development significantly, allowing more complex sugars to develop.",
        soil: "Rich loamy soil with high humus content from the dense Shola forest ecosystem. Good moisture retention without waterlogging on the slopes.",
        altitude:
          "Among India's highest coffee-growing elevations — 1,200 to 2,000 metres. The higher elevations produce the most nuanced, specialty-grade lots.",
        varieties:
          "SL-795 and Chandragiri are grown alongside older heritage varieties. The cool climate expresses variety character differently than Karnataka — often more delicate and tea-like.",
      },
      flavourProfile: {
        typical: [
          "Delicate acidity",
          "Floral",
          "Tea-like body",
          "Clean finish",
          "Mild fruit",
          "Honey sweetness",
        ],
        indianContext:
          "Nilgiris arabica has a quieter, more restrained character than Karnataka equivalents — less fruit-forward than Chikmagalur, less full-bodied than Coorg. The cool climate produces a tea-like elegance that's distinctive in the Indian context. Light roasts from high-altitude Nilgiris estates can be genuinely delicate — almost white-tea-like in body with clean floral notes. It's India's most understated specialty region, which means it's often overlooked despite producing excellent coffee.",
        processVariation:
          "Washed lots are most common and best express the region's terroir clarity. Naturals from the Nilgiris are less common — the cool, moist climate makes drying more challenging. Washed light roasts are the recommended starting point.",
      },
      roasterContext:
        "The Nilgiris is less sourced than Karnataka origins by Indian specialty roasters — it's a smaller region with fewer estates producing specialty-grade lots. Roasters who do carry Nilgiris coffee tend to be those focused on regional diversity in their catalogue. On ICB, Nilgiris lots are worth comparing against Karnataka coffees at the same roast level to understand how terroir influences cup character independently of processing.",
      brewGuidance: {
        recommended: ["v60", "chemex", "aeropress"],
        notes:
          "The Nilgiris' delicate, tea-like character is best expressed on V60 and Chemex — clean paper-filtered pour-over preserves the restrained acidity and florals. Use standard light roast temperatures (93–96°C). AeroPress at slightly lower dose works well for a more concentrated version. The delicacy of high-altitude Nilgiris coffee is easily overwhelmed by French Press — pour-over is strongly recommended.",
      },
      nearbyRegions: ["wayanad", "coorg"],
      icbDataNote:
        "Nilgiris is one of the smaller categories in the ICB catalogue — fewer roasters source from here compared to Karnataka. Representation is growing as interest in regional diversity increases. Washed light roasts dominate the available listings.",
    },

    regionSnapshot: {
      state: "Tamil Nadu",
      elevation: "1,200–2,000m",
      knownFor:
        "Cool-climate arabica with clarity and elegance in light roasts",
    },
    faqOverline: "Nilgiris",
    faqTitle: "About *Nilgiris* coffee",
    faqDescription: "Tamil Nadu's Blue Mountain coffee region explained.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["nilgiris"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines Nilgiris coffee?",
        answer:
          "Cool temperatures, high altitude (up to 2,000m), and a distinct Shola forest ecosystem produce slower-maturing cherries with tea-like elegance. It's India's most restrained specialty origin — less fruit-forward than Chikmagalur, more delicate than Coorg.",
      },
      {
        question: "Is Nilgiris coffee similar to Darjeeling tea?",
        answer:
          "In character, there's an analogy — both are cool-climate, high-altitude products with a restrained, tea-like quality. Nilgiris coffee at light roast has a clean, floral delicacy that Indian tea drinkers sometimes find more intuitive than Karnataka's bolder profiles.",
      },
      {
        question: "How does it compare to Karnataka coffees?",
        answer:
          "Quieter and more restrained. Less fruit-forward than Chikmagalur, less full-bodied than Coorg. The cool climate produces a different expression of similar arabica varieties — more delicate, more tea-like.",
      },
      {
        question: "Best brew methods?",
        answer:
          "V60 and Chemex strongly recommended — the delicate character is preserved best in clean pour-over. French Press can overwhelm the subtlety. Use 93–96°C water temperature for light roasts.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description: "Region guides and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["wayanad", "chikmagalur", "light-roast", "v60"],
  },

  {
    slug: "wayanad",
    type: "region",
    h1: "Wayanad Coffee in India",
    intro:
      "Discover specialty coffees from Wayanad — Kerala's hilly northern district where spice-country terroir meets a growing specialty coffee presence.",
    headerNudge:
      "Earthy, chocolate, and spice notes — familiar and approachable for everyday drinkers.",
    teaserTitle: "Wayanad coffees",
    teaserDescription: "Kerala highland lots from Indian specialty roasters.",
    gridNudge:
      "Use brew method and roast level filters to match Wayanad's fuller-bodied profile to your setup.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Kerala",
        elevation: "700–1,200m",
        knownFor: "Chocolate and spice tones, approachable everyday cups",
      },
      overview:
        "Wayanad district sits in the northeastern corner of Kerala, bordering Karnataka's Mysuru and Kodagu districts. It's Kerala's primary coffee-growing region and one of South India's significant producers by volume. The landscape is a mix of hills, forests, and tribal land — coffee grows alongside cardamom, pepper, vanilla, and ginger. Wayanad has a different character from Karnataka's high-altitude estates: lower elevation, denser spice-farm integration, and a more full-bodied, approachable cup profile. It's increasingly represented in specialty roaster catalogues as demand for origin diversity grows.",
      terroir: {
        climate:
          "Tropical monsoon with heavy rainfall — among Kerala's wettest districts. Dense forest cover and high humidity create a lush growing environment. The heavy rainfall makes natural processing challenging — washed and honey lots dominate.",
        soil: "Rich red laterite with high organic content from forest floor. The spice cultivation alongside coffee contributes significant organic matter to the soil.",
        altitude:
          "700 to 1,200 metres — lower than Chikmagalur or Nilgiris. The lower altitude produces a fuller-bodied, less acidic cup than Karnataka's high-altitude origins.",
        varieties:
          "Robusta is grown extensively at lower elevations — Wayanad is a significant robusta producer for traditional South Indian blends. Arabica (SL-795, Cauvery) grows at the higher elevations and is the basis for specialty lots.",
      },
      flavourProfile: {
        typical: [
          "Milk chocolate",
          "Spice",
          "Earthy sweetness",
          "Full body",
          "Low acidity",
          "Caramel",
        ],
        indianContext:
          "Wayanad arabica has a warm, approachable character — chocolate-forward, spicy, and full-bodied with low acidity. It's comforting rather than complex, which makes it a great everyday drinking coffee. The spice notes — cardamom, pepper — appear consistently and are likely both environmental and varietal. Medium roast Wayanad is excellent with milk: the body holds up, the chocolate comes through, the acidity doesn't fight the dairy. For drinkers transitioning from traditional filter coffee, Wayanad specialty is the most intuitive step up.",
        processVariation:
          "Washed Wayanad is clean and chocolate-forward. Honey-processed lots add sweetness and body. Natural processing is less common given the high rainfall — when available, Wayanad naturals tend toward dark fruit and rich sweetness rather than the brighter naturals from drier Karnataka origins.",
      },
      roasterContext:
        "Wayanad is carried by an increasing number of Indian specialty roasters — it's a region that suits medium roast profiles well, which aligns with many roasters' everyday offerings. Several Kerala-based roasters source exclusively from Wayanad. On ICB, Wayanad lots are characterised by their fuller body and lower acidity compared to Karnataka — useful if you want specialty quality without Karnataka's brighter, more acidic profiles.",
      brewGuidance: {
        recommended: ["french-press", "filter-coffee", "aeropress"],
        notes:
          "Wayanad medium roasts are excellent in French Press — the full body and low acidity are complemented by the metal filter's oil retention. South Indian filter coffee suits the region's traditional blend character. AeroPress produces a good concentrated cup. For lighter Wayanad roasts, V60 works — expect a fuller, more chocolatey cup than equivalent Karnataka lots.",
      },
      nearbyRegions: ["coorg", "nilgiris"],
      icbDataNote:
        "Wayanad is a growing category in the ICB catalogue — more roasters are adding Kerala origin lots as regional diversity becomes a selling point. Medium roasts dominate the listings, consistent with the region's profile. It's a good starting region for drinkers who find Karnataka's brightness too intense.",
    },

    regionSnapshot: {
      state: "Kerala",
      elevation: "700–1,200m",
      knownFor: "Chocolate and spice tones, approachable everyday cups",
    },
    faqOverline: "Wayanad",
    faqTitle: "About *Wayanad* coffee",
    faqDescription:
      "Kerala's coffee region — terroir, flavour, and buying tips.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["wayanad"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Wayanad and why does it matter for coffee?",
        answer:
          "Wayanad is Kerala's northernmost hilly district, bordering Karnataka's Coorg. It's Kerala's primary specialty coffee origin — lower elevation than Karnataka (700–1,200m) but with distinct spice-country terroir and an approachable, chocolate-forward cup profile.",
      },
      {
        question: "What does Wayanad coffee taste like?",
        answer:
          "Warm and approachable — milk chocolate, spice (cardamom, pepper), full body, and low acidity. It's less complex than high-altitude Chikmagalur lots but more comforting. Medium roast Wayanad is excellent with milk and suits everyday drinking well.",
      },
      {
        question: "Is Wayanad good for beginners?",
        answer:
          "Yes — it's one of the most intuitive specialty origins for Indian coffee drinkers. The full body, low acidity, and chocolate-spice profile are familiar to traditional filter coffee palates. It's a natural step up from commodity coffee without demanding a complete palate adjustment.",
      },
      {
        question: "How does Wayanad compare to Coorg?",
        answer:
          "Similar body and approachability — both suit espresso and milk drinks. Wayanad tends to have more prominent spice notes and slightly lower elevation character. Coorg often shows slightly more fruit at lighter roasts. Both are better suited to everyday drinking than high-acidity Chikmagalur lots.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description: "Region guides and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["coorg", "nilgiris", "medium-roast", "french-press"],
  },

  {
    slug: "koraput",
    type: "region",
    h1: "Koraput Coffee in India",
    intro:
      "Discover specialty coffees from Koraput — Odisha's Eastern Ghats highland origin, where tribal smallholder farming and emerging specialty production are creating India's newest coffee story.",
    headerNudge:
      "Emerging origin — fruit-forward or chocolate-toned depending on process and roast.",
    teaserTitle: "Koraput & Odisha coffees",
    teaserDescription:
      "Eastern Ghats origin lots from India's newest specialty region.",
    gridNudge:
      "Compare with Araku Valley for a tour of Eastern Ghats origins — the terroir contrast is interesting.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Odisha (Koraput district)",
        elevation: "800–1,500m",
        knownFor:
          "Emerging tribal smallholder specialty, Eastern Ghats terroir",
      },
      overview:
        "Koraput is a hilly district in southern Odisha, where the Eastern Ghats rise to 1,500 metres. Coffee cultivation here is primarily by tribal communities on smallholder farms — part of a broader tribal agriculture system that includes millet, turmeric, and forest produce. Koraput coffee is genuinely emerging — awareness in specialty circles is recent, and the number of roasters sourcing from the region is small but growing. The Eastern Ghats terroir — drier than the Western Ghats, distinct forest ecosystem — produces a different flavour profile from Karnataka's mainstream origins.",
      terroir: {
        climate:
          "Eastern Ghats climate — distinct wet and dry seasons, less rainfall than Western Ghats origins. The drier climate makes natural processing more viable than in Wayanad or Coorg.",
        soil: "Red laterite and forest soil from the Eastern Ghats ecosystem. Low chemical input — most production is naturally low-intervention due to the smallholder tribal farming context.",
        altitude:
          "800 to 1,500 metres across the growing areas — significant elevation variation that influences cup profile.",
        varieties:
          "Arabica varieties predominate in the specialty-grade lots. Varietal specificity is less commonly communicated by roasters compared to Karnataka origins — this is an area where traceability is still developing.",
      },
      flavourProfile: {
        typical: [
          "Mild fruit",
          "Chocolate",
          "Earthy sweetness",
          "Medium body",
          "Mild acidity",
        ],
        indianContext:
          "Koraput specialty coffee is still being understood — each harvest brings more data and more roasters willing to share tasting notes. What's consistent: the Eastern Ghats terroir produces a different cup from Western Ghats origins — often with a mild, earthy sweetness and medium body that sits between Araku's brightness and Karnataka's boldness. Process and roast variation is significant — compare tasting notes across roasters carefully before buying, as lot-to-lot variation is wider than in more established regions.",
        processVariation:
          "Natural processing is more viable here than in wetter Western Ghats origins — the drier Eastern Ghats climate produces cleaner naturals. Washed lots show the terroir most clearly. Both are represented in the ICB catalogue from Koraput.",
      },
      roasterContext:
        "Koraput is carried by a small but growing number of Indian specialty roasters interested in origin diversity. It's not yet mainstream — roasters sourcing from here are generally those committed to exploring beyond the Karnataka mainstream. On ICB, Koraput lots are worth trying if you're curious about what Eastern Ghats terroir tastes like independently of the better-known Araku Valley.",
      brewGuidance: {
        recommended: ["v60", "aeropress", "french-press"],
        notes:
          "Approach Koraput like you'd approach any emerging origin — start with standard parameters for the roast level and adjust based on tasting notes on the specific lot. Light roasts suit V60 and AeroPress. Medium roasts work well in French Press. The lot-to-lot variation is wider than established regions — be more willing to adjust grind and temperature than you would with Chikmagalur or Coorg.",
      },
      nearbyRegions: ["araku", "northeast-india"],
      icbDataNote:
        "Koraput is a small but growing category in the ICB catalogue. Fewer ratings than Karnataka origins — the comparison data is thinner, so individual tasting notes from community reviewers are more valuable here than aggregate scores. Worth bookmarking for future exploration as more lots appear.",
    },

    regionSnapshot: {
      state: "Odisha (Koraput district)",
      elevation: "800–1,500m",
      knownFor: "Emerging tribal smallholder specialty, Eastern Ghats terroir",
    },
    faqOverline: "Koraput",
    faqTitle: "About *Koraput* coffee",
    faqDescription: "Odisha's emerging coffee origin in the Eastern Ghats.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["koraput"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Koraput coffee grown?",
        answer:
          "Koraput is a hilly district in southern Odisha, in the Eastern Ghats at elevations up to 1,500 metres. Coffee is grown by tribal communities on smallholder farms as part of a broader tribal agriculture system.",
      },
      {
        question: "How does Koraput compare to Araku Valley?",
        answer:
          "Both are Eastern Ghats origins, but Koraput is less established and less documented. Araku has GI recognition and international presence — Koraput is earlier in its specialty journey. The terroir is adjacent but distinct — comparing them side by side is worthwhile if you can find both.",
      },
      {
        question: "Why is Koraput listed separately from Odisha?",
        answer:
          "ICB keys off canonical origin regions in the data — Koraput is the main specialty-relevant pocket in Odisha with enough structured data to surface meaningfully. As more traceable lots from other Odisha districts appear, the coverage will expand.",
      },
      {
        question: "What flavours are common?",
        answer:
          "Mild fruit, earthy sweetness, and medium body — between Araku's brightness and Karnataka's boldness. Lot-to-lot variation is wider than established regions, so check tasting notes on each specific coffee rather than relying on regional generalizations.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description: "Region guides and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["araku", "northeast-india", "light-roast", "natural"],
  },

  {
    slug: "northeast-india",
    type: "region",
    h1: "Northeast India Coffee",
    intro:
      "Browse Indian specialty coffees from the Northeast — distinct hill terroirs from Meghalaya's Garo and Khasi Hills, beyond the traditional Western Ghats coffee belt.",
    headerNudge:
      "Expect different flavour cues from Karnataka and Kerala classics — great for curious palates.",
    teaserTitle: "Northeast India coffees",
    teaserDescription:
      "Meghalaya hill region lots — India's frontier specialty origin.",
    gridNudge:
      "Pour-over and AeroPress suit lighter roasts — compare with Araku and Koraput for an Eastern India tour.",
    heroBadge: "Origin",

    regionProfile: {
      snapshot: {
        state: "Meghalaya (Garo, Khasi & West Khasi Hills)",
        elevation: "800–1,700m",
        knownFor:
          "Frontier specialty origin, distinct hill terroir beyond the Western Ghats",
      },
      overview:
        "India's Northeast is coffee's newest frontier in specialty circles. The ICB catalogue currently captures lots from Meghalaya's Garo Hills, Khasi Hills, and West Khasi Hills — where arabica is grown by tribal communities at elevations between 800 and 1,700 metres. Meghalaya is one of India's wettest states, with Cherrapunji (in the Khasi Hills) holding world records for rainfall. This extreme moisture shapes the growing conditions dramatically — dense forest, rich soil, and challenging processing conditions. Coffee from the Northeast is genuinely rare in specialty roaster catalogues — roasters who carry it are making a deliberate origin diversity statement.",
      terroir: {
        climate:
          "Extremely high rainfall — among the world's wettest growing regions. Dense forest cover, cool temperatures at altitude, and distinct seasonal patterns create a unique growing environment. The high moisture makes natural processing very challenging — washed lots dominate.",
        soil: "Forest soil of extraordinary richness — the Meghalaya forest ecosystem is one of India's most biodiverse. Minimal agricultural chemical use in tribal farming contexts.",
        altitude:
          "800 to 1,700 metres across the hill areas — significant variation between the lower Garo Hills and higher Khasi plateau.",
        varieties:
          "Arabica varieties, but varietal specificity is rarely communicated — traceability is still developing in this region. The growing conditions (high altitude, cool temperatures, very high rainfall) are theoretically favourable for quality arabica.",
      },
      flavourProfile: {
        typical: [
          "Mild fruit",
          "Floral",
          "Light body",
          "Clean acidity",
          "Forest character",
        ],
        indianContext:
          "Northeast India specialty coffee is genuinely unexplored territory — there isn't yet enough data across enough lots to make confident regional generalizations. What's emerged so far: the extreme rainfall and forest environment produce a clean, light-bodied cup with mild fruit and floral notes — different from both Karnataka's boldness and Araku's brightness. Each new lot from the Northeast tells part of a story that's still being written. If you try one, your ICB rating contributes directly to building the regional flavour understanding.",
        processVariation:
          "Washed lots dominate due to the high rainfall making natural drying very difficult. Clean, paper-filtered pour-over is the best way to understand the region's terroir — the cup is typically delicate and benefits from the transparency of pour-over methods.",
      },
      roasterContext:
        "Northeast India coffee is carried by a very small number of Indian specialty roasters — those specifically committed to origin diversity and supporting emerging growing regions. It's not available year-round from most sources. On ICB, it's worth tracking — as more lots appear, the regional story will become clearer.",
      brewGuidance: {
        recommended: ["v60", "aeropress", "chemex"],
        notes:
          "Approach Northeast India coffee with curiosity and standard light roast parameters — 93–96°C, medium-fine grind, 1:15–1:16 ratio on V60. The delicate character responds well to clean pour-over. Adjust based on what you taste — there's less established guidance for this region than for Karnataka origins because it's so new to specialty.",
      },
      nearbyRegions: ["koraput", "araku"],
      icbDataNote:
        "Northeast India is the newest and smallest region category in the ICB catalogue. Rating data is thin — individual reviews are more valuable than aggregate scores at this stage. If you try a Northeast India lot and rate it on ICB, you're meaningfully contributing to the regional data that will help future buyers.",
    },

    regionSnapshot: {
      state: "Meghalaya (Garo, Khasi & West Khasi Hills)",
      elevation: "800–1,700m",
      knownFor:
        "Frontier specialty origin, distinct hill terroir beyond the Western Ghats",
    },
    faqOverline: "Northeast",
    faqTitle: "About *Northeast India* coffee",
    faqDescription:
      "India's frontier specialty origin — what ICB currently tracks.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["garo-hills", "khasi-hills", "west-khasi-hills"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What does Northeast India include on ICB?",
        answer:
          "Currently, coffees linked to Meghalaya's Garo Hills, Khasi Hills, and West Khasi Hills canonical regions — where structured origin data exists in the ICB catalogue. As roasters list traceable lots from Assam, Nagaland, Manipur, and other states, coverage will expand.",
      },
      {
        question: "Why is Northeast India coffee rare in specialty?",
        answer:
          "The region is genuinely early-stage in its specialty journey — infrastructure, traceability systems, and processing equipment are still developing. The extreme rainfall makes quality processing challenging. Roasters who source from here are making a deliberate commitment to an emerging origin.",
      },
      {
        question: "What does it taste like?",
        answer:
          "There isn't enough data yet for confident generalizations — which is part of what makes it interesting. What's emerged so far: clean, light-bodied cups with mild fruit and floral notes, different from both Karnataka's boldness and Araku's brightness. Each lot tells part of a story still being written.",
      },
      {
        question: "How does it differ from Eastern Ghats coffees like Araku?",
        answer:
          "Different terroir entirely — Meghalaya's extreme rainfall, forest ecosystem, and hill geography create different growing conditions from the Eastern Ghats. Araku has more established specialty infrastructure and data. Northeast India is earlier in its journey and harder to generalize about.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore Indian coffee regions",
      description: "Region guides and brewing tips on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["koraput", "araku", "light-roast", "washed"],
  },
];
