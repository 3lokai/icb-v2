// src/lib/discovery/landing-pages/process-pages.ts
import type { ProcessEnum } from "@/types/db-enums";
import type { LandingPageConfig } from "./types";

export const processPages: LandingPageConfig[] = [
  {
    slug: "natural",
    type: "process",
    h1: "Natural Process Coffee in India",
    intro:
      "Explore Indian specialty coffees processed naturally — dried whole in the cherry for bold fruit, wine-like complexity, and heavy body. The oldest processing method, and still the most expressive.",
    headerNudge:
      "Expect pronounced fruit and fermentation-forward profiles when dialed in.",
    teaserTitle: "Natural process picks",
    teaserDescription:
      "Lots where the fruit stayed on the bean longer for intense sweetness and complexity.",
    gridNudge:
      "Grind a touch coarser if shots run slow — naturals can extract quickly on pour over.",
    heroBadge: "Processing",
    faqOverline: "Natural process",
    faqTitle: "About *natural* coffee",
    faqDescription: "How natural processing shapes flavour in the cup.",
    faqBadge: "Processing",

    processProfile: {
      // How the process works step by step
      steps: [
        {
          stage: "Harvest",
          description:
            "Ripe cherries are hand-picked and sorted by density — floaters and unripes removed. Sorting quality at this stage determines everything that follows.",
        },
        {
          stage: "Dry whole",
          description:
            "Entire cherry — skin, mucilage, fruit, and bean — is spread on raised drying beds or patios. Cherries are turned regularly over 3–6 weeks to prevent mould and ensure even drying.",
        },
        {
          stage: "Rest and hull",
          description:
            "Once dried to target moisture content, the cherries rest before milling. The dried fruit husk is then removed mechanically to reveal the processed green bean inside.",
        },
      ],
      // What the process does to flavour
      flavourImpact: {
        typical: [
          "Blueberry",
          "Stone fruit",
          "Tropical fruit",
          "Wine-like",
          "Heavy body",
          "Chocolate sweetness",
        ],
        indianContext:
          "Indian naturals vary significantly by region and producer. Karnataka estate naturals — particularly from Chikmagalur and Coorg — tend toward ripe stone fruit, dark berry, and chocolate. Araku Valley naturals often show brighter tropical fruit. The challenge with Indian naturals is consistency: fermentation is harder to control in humid conditions, so quality varies more than washed lots from the same region. The best Indian naturals rival Ethiopian naturals in complexity; mediocre ones can taste muddy or over-fermented.",
        comparedTo:
          "Natural vs washed: heavier body, lower perceived acidity, more sweetness, and more fermentation character. Natural vs honey: naturals are typically more intense — honey process is the bridge between the two.",
      },
      // Where India fits in this process globally
      indiaContext:
        "Natural processing has a long history in India — it was the dominant method before wet processing infrastructure arrived. Today it's experiencing a revival in specialty. Karnataka estates are the primary source of quality Indian naturals, with a growing number of small-lot producers experimenting with raised-bed drying to improve consistency. The humid coastal climate makes drying challenging — producers who invest in covered or raised beds produce noticeably better naturals.",
      // Brew guidance specific to this process
      brewGuidance: {
        recommended: ["v60", "aeropress", "french-press", "cold-brew"],
        notes:
          "Naturals extract faster than washed coffees — grind slightly coarser than your usual setting and watch brew time carefully. On pour-over, a slower first pour and longer bloom (45 seconds) helps manage the intense sweetness. French Press suits heavy-body naturals well — the metal filter keeps the richness in the cup. Cold brew suits medium and medium-dark naturals — chocolate and berry sweetness come through smooth and low-acid. Avoid very high water temperatures on light roast naturals — 90–93°C tends to balance fruit and sweetness better than 96°C.",
      },
      // Process comparison for cross-linking
      processComparison: {
        moreIntense: [],
        lessIntense: ["honey", "washed"],
        comparisonNote:
          "Natural is the most flavour-intense process — if natural feels too heavy or fermented, try honey process next. Washed is the cleanest and most restrained.",
      },
      icbDataNote:
        "Natural process is well-represented in the ICB catalogue and consistently produces the highest community ratings among process categories. Karnataka estate naturals dominate the top-rated lots — light and light-medium roast naturals score highest.",
    },

    filter: {
      processes: ["natural" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn/indian-coffee-processing-methods",
    faqs: [
      {
        question: "What is natural process coffee?",
        answer:
          "The whole cherry — skin, fruit, mucilage, and bean — is dried together before milling. Sugars from the fruit ferment into the bean during drying, producing fruit-forward, wine-like, and sweet flavour profiles.",
      },
      {
        question: "Is natural the same as unwashed?",
        answer:
          "Yes — natural, dry-processed, and unwashed all refer to the same method. The terminology varies by region and producer.",
      },
      {
        question: "Why do some Indian naturals taste fermented or funky?",
        answer:
          "Inconsistent drying — from humidity, uneven turning, or poor sorting — creates over-fermentation. Good Indian naturals from producers with raised beds and proper sorting are clean and fruity, not funky. It's a producer quality indicator.",
      },
      {
        question: "Best brew methods for naturals?",
        answer:
          "V60, AeroPress, and French Press all work well. Cold brew is excellent for medium and medium-dark naturals — smooth sweetness with less acidity. Naturals extract faster than washed — grind slightly coarser and use a temperature around 90–93°C for light roasts to balance sweetness without tipping into heavy ferment.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Indian coffee processing guide",
      description:
        "How natural, washed, honey, and anaerobic processing affects flavour in Indian specialty coffees.",
      href: "/learn/indian-coffee-processing-methods",
      ctaText: "Read the guide",
    },
    related: ["honey", "washed", "light-roast", "chikmagalur"],
  },

  {
    slug: "washed",
    type: "process",
    h1: "Washed Process Coffee in India",
    intro:
      "Find washed Indian specialty coffees — clean cups, vibrant acidity, and remarkable clarity that lets origin character and varietal shine without interference from fermentation.",
    headerNudge:
      "Great when you want crisp definition and less ferment than naturals.",
    teaserTitle: "Washed process picks",
    teaserDescription: "Fermented and washed to remove mucilage before drying.",
    gridNudge:
      "Slightly finer grind can highlight acidity — keep an eye on brew time.",
    heroBadge: "Processing",
    faqOverline: "Washed process",
    faqTitle: "About *washed* coffee",
    faqDescription: "Why washed lots taste clean and bright.",
    faqBadge: "Processing",

    processProfile: {
      steps: [
        {
          stage: "Harvest and pulp",
          description:
            "Ripe cherries are harvested and immediately run through a pulper that removes the outer skin. The bean, still coated in sticky mucilage, enters a fermentation tank.",
        },
        {
          stage: "Ferment and wash",
          description:
            "Beans ferment in water or dry for 12–72 hours — the fermentation breaks down the mucilage. They're then thoroughly washed with clean water to remove all remaining fruit material.",
        },
        {
          stage: "Dry and mill",
          description:
            "Washed beans are dried on raised beds or patios to target moisture content, then milled to remove the parchment layer. The resulting green bean has had all fruit contact removed.",
        },
      ],
      flavourImpact: {
        typical: [
          "Bright acidity",
          "Clean finish",
          "Citrus",
          "Floral",
          "Stone fruit",
          "Tea-like clarity",
        ],
        indianContext:
          "Washed Indian coffees are where varietal and terroir express most clearly. SL-795 washed lots from Chikmagalur estates show jasmine, peach, and clean bergamot — profiles that are only visible because fermentation isn't masking them. Washed Coorg arabica tends toward citrus and brown sugar. Araku Valley washed coffees are lighter and more delicate. This is the process that made Indian specialty coffee credible internationally — washed Karnataka lots are what producers show at international competitions.",
        comparedTo:
          "Washed vs natural: more clarity, higher perceived acidity, lighter body, less sweetness. Washed vs honey: cleaner and brighter than honey, less body and sweetness.",
      },
      indiaContext:
        "Washed processing requires clean water and infrastructure — it's more capital-intensive than natural processing. Large Karnataka estates have had wet mills for decades; smaller producers are increasingly building wet-processing capacity as specialty demand grows. India's washed coffees are most concentrated in Chikmagalur, Coorg, and Araku Valley — these regions consistently produce the most competition-grade lots.",
      brewGuidance: {
        recommended: ["v60", "chemex", "aeropress", "kalita", "espresso"],
        notes:
          "Washed coffees are the most rewarding on pour-over — the clarity of V60 and Chemex lets the acidity and florals come through unmuddied. Use higher water temperatures (93–96°C) for light roasts. Washed coffees are more forgiving of grind inconsistency than naturals — a good starting point if you're new to pour-over. Espresso works well too: washed light-mediums produce bright, clean shots with good clarity in milk.",
      },
      processComparison: {
        moreIntense: ["natural", "honey"],
        lessIntense: [],
        comparisonNote:
          "Washed is the cleanest and most restrained process — if you want more sweetness and body, try honey next. For maximum fruit intensity, try natural.",
      },
      icbDataNote:
        "Washed is the most represented process in the ICB catalogue by volume. It's also the process with the most competition-grade lots — the highest-rated coffees on ICB from Chikmagalur and Coorg estates are predominantly washed. Light and light-medium roast washed coffees dominate the top ratings.",
    },

    filter: {
      processes: ["washed" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn/indian-coffee-processing-methods",
    faqs: [
      {
        question: "What is washed coffee?",
        answer:
          "After pulping, all fruit mucilage is removed through fermentation and washing before drying. The result is a bean with no fruit contact during drying — producing clean, bright, clarity-focused cups.",
      },
      {
        question: "Washed vs natural — which should I try first?",
        answer:
          "Start with washed if you want to understand what origin and varietal actually taste like — it's the clearest expression of terroir. Try natural when you want more sweetness, body, and fruit intensity.",
      },
      {
        question: "Why do Indian washed coffees win competitions?",
        answer:
          "Washed processing lets varietal character — particularly SL-795 from high-altitude Chikmagalur estates — express clearly. When the processing is clean, the terroir speaks. Indian estates at 1,200m+ with SL-795 and proper washed processing produce genuinely world-class coffees.",
      },
      {
        question: "Best brewing for washed coffees?",
        answer:
          "Pour-over methods — V60, Chemex, Kalita — are the best match. They highlight clarity and acidity without adding body. Espresso suits washed light-medium roasts — bright, clean shots that hold up in milk. Use 93–96°C for light roasts, 90–93°C for light-mediums.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Indian coffee processing guide",
      description:
        "How natural, washed, honey, and anaerobic processing affects flavour in Indian specialty coffees.",
      href: "/learn/indian-coffee-processing-methods",
      ctaText: "Read the guide",
    },
    related: ["natural", "honey", "v60", "chikmagalur"],
  },

  {
    slug: "honey",
    type: "process",
    h1: "Honey Process Coffee in India",
    intro:
      "Discover honey and pulped-natural style Indian coffees — sweetness, body, and balance between washed clarity and natural fruit intensity. The most versatile process for everyday drinkers.",
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
    faqDescription: "What honey process means in specialty coffee.",
    faqBadge: "Processing",

    processProfile: {
      steps: [
        {
          stage: "Harvest and pulp",
          description:
            "Cherries are picked and pulped to remove the outer skin — same as washed processing. The difference starts here: instead of washing off the mucilage, it's left on.",
        },
        {
          stage: "Dry with mucilage intact",
          description:
            "The pulped bean — still coated in sticky, honey-like mucilage — is dried on raised beds. The amount of mucilage left on determines the honey classification: black honey (most) → red → yellow → white honey (least). More mucilage means more sweetness and risk.",
        },
        {
          stage: "Mill",
          description:
            "Once dried, the parchment and any remaining dried mucilage is milled off to reveal the green bean. The result sits between washed (clean) and natural (fruit-heavy) in character.",
        },
      ],
      flavourImpact: {
        typical: [
          "Caramel sweetness",
          "Stone fruit",
          "Syrupy body",
          "Mild acidity",
          "Brown sugar",
          "Smooth finish",
        ],
        indianContext:
          "Honey process is where Indian specialty coffees often surprise — the sweetness and body work particularly well with Indian arabica varieties that can sometimes taste thin on washed processing. Coorg and Chikmagalur honey lots tend toward caramel, apricot, and brown sugar. Yellow and red honeys are most common in India — black honey is rarer but produces richer, more complex cups when done well. Honey-processed Cauvery and Chandragiri varieties from Karnataka are especially good: the varieties' inherent sweetness amplifies beautifully with the mucilage contact.",
        comparedTo:
          "Honey vs washed: more body, more sweetness, less acidity and clarity. Honey vs natural: less fruit intensity and fermentation character, more control and consistency. Honey is the bridge — most approachable of the three for new specialty drinkers.",
      },
      indiaContext:
        "Honey processing has grown significantly in Indian specialty over the last 5 years — producers discovered it as a way to add sweetness and complexity to lots that weren't quite exciting enough for specialty on washed processing. It's now common across Karnataka estates. The classification system (black/red/yellow/white honey) isn't always labelled clearly by Indian roasters — the terms 'pulped natural' and 'honey' are often used interchangeably.",
      brewGuidance: {
        recommended: [
          "v60",
          "aeropress",
          "french-press",
          "espresso",
          "moka-pot",
        ],
        notes:
          "Honey coffees are forgiving and versatile — they work well across pour-over and immersion methods. On V60, use 91–94°C and a standard ratio (1:15–1:16). The sweetness balances well with medium water temperatures. For AeroPress, honey process lots are excellent — the slight pressure amplifies the caramel and brown sugar notes. French Press suits black and red honeys particularly well — the body comes through fully with the metal filter. Espresso and Moka Pot highlight body and sweetness on medium honeys — classic single-origin choices.",
      },
      processComparison: {
        moreIntense: ["natural"],
        lessIntense: ["washed"],
        comparisonNote:
          "Honey sits between washed and natural. If washed tastes too sharp, honey adds sweetness and body. If natural is too heavy or fermented, honey gives you fruit notes with more control.",
      },
      icbDataNote:
        "Honey process is the fastest-growing process category in the ICB catalogue — more roasters are listing honey lots each quarter. Yellow and red honeys dominate; black honeys are rarer but consistently score high when available. Coorg and Chikmagalur are the primary sources.",
    },

    filter: {
      processes: ["honey" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn/indian-coffee-processing-methods",
    faqs: [
      {
        question: "What is honey process — does it contain honey?",
        answer:
          "No honey is added — the name comes from the sticky, honey-like texture of the mucilage left on the bean during drying. The mucilage ferments gently and imparts sweetness and body to the final cup.",
      },
      {
        question: "What do black, red, yellow, and white honey mean?",
        answer:
          "They refer to how much mucilage is left on the bean: black honey has the most (closest to natural), white honey has the least (closest to washed). More mucilage means more sweetness and body, and more fermentation risk.",
      },
      {
        question: "Who should try honey process?",
        answer:
          "Anyone who finds washed coffees too sharp or naturals too heavy. Honey is the most approachable specialty process — sweet, smooth, and balanced. It's often the gateway process for new specialty coffee drinkers.",
      },
      {
        question: "Best brew methods for honey coffees?",
        answer:
          "V60, AeroPress, and French Press all work well. Espresso and Moka Pot suit medium honeys — syrupy body and caramel sweetness. The sweetness and body translate across methods. Aim for 91–94°C water temperature on filter — too hot and the sweetness tips into roasty sharpness.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Indian coffee processing guide",
      description:
        "How natural, washed, honey, and anaerobic processing affects flavour in Indian specialty coffees.",
      href: "/learn/indian-coffee-processing-methods",
      ctaText: "Read the guide",
    },
    related: ["natural", "washed", "medium-roast", "coorg"],
  },

  {
    slug: "anaerobic",
    type: "process",
    h1: "Anaerobic Process Coffee in India",
    intro:
      "Browse anaerobic and experimental ferment Indian specialty coffees — intense aromatics, complex fruit, and distinctive cup profiles unlike anything traditional processing produces.",
    headerNudge:
      "Fermentation in controlled low-oxygen environments amplifies fruit, spice, and fermentation character.",
    teaserTitle: "Anaerobic picks",
    teaserDescription:
      "Experimental lots with bold, often wine-like or tropical profiles.",
    gridNudge: "Use soft water and careful ratios — these cups can be intense.",
    heroBadge: "Experimental",
    faqOverline: "Anaerobic",
    faqTitle: "About *anaerobic* coffee",
    faqDescription: "Controlled fermentation and flavour impact.",
    faqBadge: "Processing",

    processProfile: {
      steps: [
        {
          stage: "Seal in tanks",
          description:
            "Whole cherries or pulped beans are placed in sealed, airtight tanks — stainless steel or food-grade plastic. CO2 produced by the fermenting fruit purges oxygen from the tank, creating an anaerobic (oxygen-free) environment.",
        },
        {
          stage: "Controlled fermentation",
          description:
            "Without oxygen, different microbial populations take over fermentation — producing lactic acid and specific aromatic compounds that don't develop in open-air fermentation. Fermentation time, temperature, and pressure are monitored closely. Duration ranges from 24 to 200+ hours depending on the producer's target profile.",
        },
        {
          stage: "Dry and mill",
          description:
            "After fermentation, cherries or beans are dried — either on raised beds (if whole cherry anaerobic) or patio-dried (if pulped). Processing then follows either natural or washed steps to complete the lot.",
        },
      ],
      flavourImpact: {
        typical: [
          "Tropical fruit",
          "Red wine",
          "Spice",
          "Intense aromatics",
          "Fermentation funk",
          "Syrupy body",
        ],
        indianContext:
          "Indian anaerobic coffees are still emerging — most are produced by progressive Karnataka estates experimenting with fermentation. The best Indian anaerobics show tropical fruit (mango, pineapple, passionfruit), complex spice notes, and a distinctive funkiness that polarises opinion. They tend toward wine-like profiles rather than the cleaner citrus anaerobics you get from other origins. Some Indian producers are combining anaerobic fermentation with natural drying (anaerobic natural) for maximum intensity — these are among the most experimental and highest-priced lots in the ICB catalogue.",
        comparedTo:
          "Anaerobic vs natural: more controlled fermentation — the flavour is intense but usually cleaner and more intentional than an over-fermented natural. Anaerobic vs washed: far more fermentation character, heavier body, lower clarity. Not a comparison — these are fundamentally different cups.",
      },
      indiaContext:
        "Anaerobic processing arrived in India relatively recently — most Indian anaerobic lots have appeared in the last 3–5 years. A small number of progressive Karnataka estates are leading: they're investing in stainless steel fermentation tanks and working with fermentation consultants to develop consistent profiles. Demand is primarily from urban specialty buyers and competition circuits — these aren't everyday coffees. Expect to pay a premium: anaerobic lots from India are priced at the top of the market.",
      brewGuidance: {
        recommended: ["v60", "aeropress", "cold-brew"],
        notes:
          "Anaerobic coffees are intense — start with lower doses and standard ratios, then adjust. On V60, use 90–93°C and a slightly coarser grind than usual — high temperature and fine grind amplify the fermentation notes into something overwhelming. AeroPress works well for a shorter, more controlled brew. Cold brew is an interesting option for anaerobics — 24-hour cold extraction mellows the intensity while preserving the complex fruit. Avoid French Press — the metal filter plus immersion tends to make anaerobics taste muddy.",
      },
      processComparison: {
        moreIntense: [],
        lessIntense: ["natural", "honey", "washed"],
        comparisonNote:
          "Anaerobic is the most experimental and intense process category. If it feels too much, try natural next — similar fruit intensity but more familiar fermentation character.",
      },
      icbDataNote:
        "Anaerobic lots are the smallest process category in the ICB catalogue by volume but attract disproportionate community interest — they're reviewed more per listing than any other process. Ratings are polarised: very high from enthusiasts, lower from drinkers who find the fermentation character off-putting. Karnataka estate anaerobics dominate the listings currently available.",
    },

    filter: {
      processes: ["anaerobic" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn/indian-coffee-processing-methods",
    faqs: [
      {
        question: "What does anaerobic mean?",
        answer:
          "Coffee is fermented in sealed, oxygen-free tanks. Without oxygen, different microorganisms drive fermentation — producing aromatic compounds not possible in open-air processing. The result is intense, unusual flavour profiles.",
      },
      {
        question: "Are anaerobic coffees for everyone?",
        answer:
          "No — and that's fine. They're polarising by design. If you enjoy natural wine, aged cheese, or strongly fermented foods, you'll likely love them. If you prefer clean, bright coffees, start with washed or honey instead.",
      },
      {
        question: "Why are anaerobic coffees more expensive?",
        answer:
          "The equipment (sealed fermentation tanks, monitoring systems), extended fermentation time, and higher risk of batch failure make anaerobic processing significantly more expensive than traditional methods. Indian anaerobic lots are priced at the top of the specialty market.",
      },
      {
        question: "How should I brew anaerobic coffee?",
        answer:
          "Start cautious — lower water temperature (90–93°C), slightly coarser grind, standard ratio. High temperature amplifies fermentation intensity. V60 and AeroPress work best. Cold brew can mellow intensity while keeping fruit. Avoid French Press, which muddies the complex aromatics.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Indian coffee processing guide",
      description:
        "How natural, washed, honey, and anaerobic processing affects flavour in Indian specialty coffees.",
      href: "/learn/indian-coffee-processing-methods",
      ctaText: "Read the guide",
    },
    related: ["natural", "mid-range", "light-roast"],
  },

  {
    slug: "monsooned-malabar",
    type: "process",
    h1: "Monsooned Malabar Coffee in India",
    intro:
      "Explore monsooned coffees from India's Malabar coast — low acidity, mellow spice, and a distinctive heritage profile that exists nowhere else in the world of specialty coffee.",
    headerNudge:
      "Monsooning swells beans and mellows acidity — profiles are earthy, smooth, and unlike anything else.",
    teaserTitle: "Monsooned Malabar picks",
    teaserDescription:
      "Heritage-processed lots valued for their mild, heavy-bodied cup.",
    gridNudge:
      "Works well in espresso blends or with milk — try French Press for full body.",
    heroBadge: "Heritage",
    faqOverline: "Monsooned",
    faqTitle: "About *monsooned* coffee",
    faqDescription: "India's monsooning tradition in brief.",
    faqBadge: "Processing",

    processProfile: {
      steps: [
        {
          stage: "Post-harvest exposure",
          description:
            "After initial processing (usually washed or natural), green beans are stored in open warehouses on the Malabar coast during the monsoon season — June to September. Warehouse walls have open slats to allow monsoon winds and humid air to circulate freely through the beans.",
        },
        {
          stage: "Monsoon absorption",
          description:
            "Over 12–16 weeks, the beans absorb monsoon moisture and swell — sometimes doubling in volume. The high humidity and warm temperatures trigger a slow, controlled oxidation. Beans are turned and raked regularly to prevent clumping and ensure even exposure.",
        },
        {
          stage: "Dry and grade",
          description:
            "Beans are allowed to dry back to stable moisture levels, then graded and sorted. The swollen, pale-yellow beans are distinctly different from conventionally processed green coffee — they look and behave differently in the roaster too.",
        },
      ],
      flavourImpact: {
        typical: [
          "Earthy",
          "Mellow spice",
          "Low acidity",
          "Full body",
          "Musty sweetness",
          "Woody",
          "Mild fermentation",
        ],
        indianContext:
          "Monsooned Malabar is India's most unique contribution to global coffee — there is nothing else like it. The profile is deliberately low-acid, heavy-bodied, and earthy — the opposite of what specialty coffee usually aims for. Yet it has a dedicated following: in South Indian filter coffee culture, Monsooned Malabar is often blended in for body and smoothness. In European markets, particularly Italy, it's used in espresso blends for the same reason. In specialty circles, it's interesting as a single origin curiosity — best appreciated by those who understand its context rather than judging it against a washed light roast.",
        comparedTo:
          "Monsooned Malabar vs dark roast: similar low acidity and heavy body, but the earthiness comes from the processing rather than roasting — it can be appreciated at medium roast without bitterness. Monsooned Malabar vs natural: both are unconventional, but monsooned is earthier and less fruit-forward.",
      },
      indiaContext:
        "Monsooning originated accidentally — during the colonial era, green coffee shipped from India to Europe in wooden sailing vessels absorbed sea moisture during the months-long voyage, arriving swollen and flavour-transformed. When steam ships made the journey faster, Indian exporters discovered their European customers preferred the old, weathered taste. The monsooning process was developed deliberately to replicate the effect on land. Today it's produced almost exclusively in Karnataka's Malabar coast warehouses and is one of India's most recognised coffee exports. Monsooned Malabar AA is the premium grade.",
      brewGuidance: {
        recommended: [
          "french-press",
          "filter-coffee",
          "aeropress",
          "espresso",
          "moka-pot",
        ],
        notes:
          "Monsooned Malabar suits immersion methods and milk-based preparations best — the heavy body and low acidity work with French Press and South Indian filter coffee decoction. Espresso blending is traditional: 10–20% Monsooned Malabar in an espresso blend adds body and smoothness. Moka Pot delivers strong, low-acid cups at home without a machine — similar spirit to espresso for this profile. As a single origin pour-over it's unusual — the earthiness can feel muddy on V60. Use medium-dark to dark roast and embrace the profile for what it is rather than trying to brew it like a light roast. Lower water temperature (87–90°C) suits it well.",
      },
      processComparison: {
        moreIntense: [],
        lessIntense: [],
        comparisonNote:
          "Monsooned Malabar doesn't sit on the natural–washed–honey spectrum — it's a separate category entirely. Compare it to dark roast for body and low acidity, but understand it's a different kind of cup.",
      },
      icbDataNote:
        "Monsooned Malabar is a niche but consistent category in the ICB catalogue — multiple roasters carry it year-round. It attracts a specific audience: traditional Indian filter coffee drinkers, espresso blenders, and curious specialty enthusiasts. Community ratings tend to reflect the polarising nature of the profile — it scores well with those who understand what it is.",
    },

    filter: {
      processes: ["monsooned" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn/what-is-monsooned-malabar-coffee",
    faqs: [
      {
        question: "What is Monsooned Malabar coffee?",
        answer:
          "Green beans are exposed to monsoon winds and humidity in coastal Karnataka warehouses for 12–16 weeks. The beans swell, mellow, and develop a distinctive earthy, low-acid profile that's unique to this process.",
      },
      {
        question: "Why does it taste so different from other Indian coffees?",
        answer:
          "The months of monsoon exposure fundamentally transform the bean — acidity drops dramatically, body increases, and earthy, spicy notes develop. It's the opposite of what modern specialty processing aims for, which is exactly why it has a dedicated following.",
      },
      {
        question: "Why is it associated with Malabar?",
        answer:
          "The process originated in Malabar coast warehouses where colonial-era coffee was stored before shipment. The accidental monsoon transformation became deliberate when European buyers preferred the aged flavour. Today it's still produced in Karnataka's coastal belt.",
      },
      {
        question: "How should I brew Monsooned Malabar?",
        answer:
          "French Press, South Indian filter, espresso blending, or Moka Pot. The heavy body and low acidity suit immersion and pressure methods. As a pour-over single origin it can taste muddy — it's better appreciated in a blend or with milk. Use 87–90°C water temperature.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, processes, and brewing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["dark-roast", "french-press", "coorg", "filter-coffee"],
  },
];
