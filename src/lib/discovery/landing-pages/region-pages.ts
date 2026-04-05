// src/lib/discovery/landing-pages/region-pages.ts
import type { LandingPageConfig } from "./types";

export const regionPages: LandingPageConfig[] = [
  // Region pages
  {
    slug: "chikmagalur",
    type: "region",
    h1: "Chikmagalur Coffee in India",
    intro:
      "Discover specialty coffees from Chikmagalur—Karnataka’s historic coffee heartland with diverse estates, washed and experimental lots, and iconic Indian arabica.",
    headerNudge:
      "A default origin name for many Indian specialty drinkers—wide range of roast styles.",
    teaserTitle: "Chikmagalur coffees",
    teaserDescription: "From classic washed estate lots to microlots.",
    gridNudge:
      "Compare processes and roast levels across roasters on the directory.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Karnataka",
      elevation: "Roughly 900–1,500 m in many specialty lots",
      knownFor:
        "Heritage estates, washed arabica, and wide roast-style variety",
    },
    faqOverline: "Chikmagalur",
    faqTitle: "About *Chikmagalur* coffee",
    faqDescription: "What to expect from this region.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["chikmagalur"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Why is Chikmagalur famous for coffee?",
        answer:
          "It’s one of India’s oldest continuous coffee-growing areas, with altitude and climate suited to arabica and significant heritage estates.",
      },
      {
        question: "What flavours are common?",
        answer:
          "Profiles vary by process and roast—spice, cocoa, nuts, and fruit all appear across roasters.",
      },
      {
        question: "How do I choose?",
        answer:
          "Use roast level and process filters alongside this region to narrow down.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "More regional guides on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["coorg", "wayanad", "light-roast"],
  },
  {
    slug: "coorg",
    type: "region",
    h1: "Coorg Coffee in India",
    intro:
      "Browse Indian specialty coffees from Coorg (Kodagu)—lush hills, established estates, and coffees spanning classic and modern processing.",
    headerNudge:
      "Often bold and full in body; great for espresso and milk drinks depending on roast.",
    teaserTitle: "Coorg coffees",
    teaserDescription: "Kodagu-origin lots from roasters across India.",
    gridNudge:
      "Pair with process filters to find naturals or washed estate lots.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Karnataka (Kodagu district)",
      elevation: "Roughly 800–1,600 m depending on lot",
      knownFor: "Full-bodied cups, popular in espresso and milk drinks",
    },
    faqOverline: "Coorg",
    faqTitle: "About *Coorg* coffee",
    faqDescription: "Flavour and buying tips.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["coorg"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What is Coorg known for?",
        answer:
          "Kodagu is a major producing district in Karnataka with both large estates and smaller lots showing up in specialty.",
      },
      {
        question: "Coorg vs Chikmagalur?",
        answer:
          "Both are Karnataka heavyweights; cup profiles depend on elevation, variety, and process—compare side by side.",
      },
      {
        question: "Brew suggestions?",
        answer:
          "Espresso, South Indian filter, or French Press for heavier roasts; pour-over for lighter lots.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Regional deep dives on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["chikmagalur", "wayanad", "medium-roast"],
  },
  {
    slug: "araku",
    type: "region",
    h1: "Araku Valley Coffee in India",
    intro:
      "Find specialty coffees from Araku—Andhra Pradesh’s highland terroir known for emerging microlots and distinctive smallholder lots.",
    headerNudge:
      "Profiles can be floral and bright; worth exploring with pour-over.",
    teaserTitle: "Araku coffees",
    teaserDescription: "Highland lots from the Eastern Ghats.",
    gridNudge: "Light roasts often highlight florals—check tasting notes.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Andhra Pradesh (Eastern Ghats)",
      elevation: "Often ~900–1,300 m in valley areas",
      knownFor: "Bright, floral-forward lots in lighter roasts",
    },
    faqOverline: "Araku",
    faqTitle: "About *Araku* coffee",
    faqDescription: "Terroir and flavour cues.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["araku"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Araku?",
        answer:
          "Araku Valley sits in the Eastern Ghats of Andhra Pradesh, with elevations favourable for arabica.",
      },
      {
        question: "What to expect in the cup?",
        answer:
          "Many lots show brightness and floral or fruit notes; exact profiles vary by harvest and process.",
      },
      {
        question: "How to brew?",
        answer:
          "Pour-over and AeroPress often suit lighter roasts; adjust to tasting notes.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Learn more about Indian origins.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["nilgiris", "light-roast", "v60"],
  },
  {
    slug: "nilgiris",
    type: "region",
    h1: "Nilgiris Coffee in India",
    intro:
      "Explore coffees from the Nilgiris—cool Tamil Nadu highlands with estates and small growers producing nuanced Indian arabica.",
    headerNudge:
      "Cool climate and distinct terroir—look for elegant profiles in lighter roasts.",
    teaserTitle: "Nilgiris coffees",
    teaserDescription: "Blue Mountain slopes and surrounding areas.",
    gridNudge:
      "Compare with Wayanad and Karnataka origins for terroir contrast.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Tamil Nadu",
      elevation: "Often ~1,200–2,000 m on higher slopes",
      knownFor: "Cool-climate arabica with clarity in lighter roasts",
    },
    faqOverline: "Nilgiris",
    faqTitle: "About *Nilgiris* coffee",
    faqDescription: "Regional snapshot.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["nilgiris"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What defines Nilgiris coffee?",
        answer:
          "Grown in the Nilgiri district’s high elevations—cups often show clarity when roasted light.",
      },
      {
        question: "Is it similar to Karnataka coffees?",
        answer:
          "It’s neighbouring terroir but with its own microclimates; always taste and compare.",
      },
      {
        question: "Buying tips?",
        answer:
          "Check harvest, process, and roast date like any specialty coffee.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "More on Indian coffee origins.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["wayanad", "chikmagalur", "light-roast"],
  },
  {
    slug: "wayanad",
    type: "region",
    h1: "Wayanad Coffee in India",
    intro:
      "Discover specialty coffees from Wayanad—Kerala’s hilly district with spice-country terroir and a growing specialty presence.",
    headerNudge:
      "Earthy, chocolate, and spice notes appear often; great for daily drinkers.",
    teaserTitle: "Wayanad coffees",
    teaserDescription: "Kerala highland lots from Indian roasters.",
    gridNudge: "Use brew method filters to match your routine.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Kerala",
      elevation: "Roughly 700–1,200 m in many growing areas",
      knownFor: "Chocolate and spice tones, approachable daily cups",
    },
    faqOverline: "Wayanad",
    faqTitle: "About *Wayanad* coffee",
    faqDescription: "Regional overview.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["wayanad"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Wayanad?",
        answer:
          "A hilly district in north-eastern Kerala, neighbouring Karnataka’s coffee belt.",
      },
      {
        question: "Flavour profile?",
        answer:
          "Varies by lot; expect approachable, often chocolate-forward or spice-toned cups on medium roasts.",
      },
      {
        question: "How to explore?",
        answer:
          "Start here then compare Coorg or Chikmagalur lots with similar roast levels.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Learn hub articles on origins and brewing.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["coorg", "nilgiris", "french-press"],
  },
  {
    slug: "koraput",
    type: "region",
    h1: "Koraput (Odisha) Coffee in India",
    intro:
      "Discover specialty coffees from Koraput and Odisha’s Eastern Ghats—emerging highland terroir with smallholder and estate lots worth exploring.",
    headerNudge:
      "Often fruit-forward or chocolate-toned depending on process and roast.",
    teaserTitle: "Koraput & Odisha coffees",
    teaserDescription:
      "Eastern Ghats origin lots listed on Indian Coffee Beans.",
    gridNudge:
      "Compare with Araku (AP) or Northeast lots for a tour of non-Karnataka origins.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Odisha (Koraput district)",
      elevation: "Roughly 800–1,500 m in Eastern Ghats pockets",
      knownFor: "Emerging specialty lots from tribal and smallholder contexts",
    },
    faqOverline: "Koraput",
    faqTitle: "About *Koraput* coffee",
    faqDescription: "Odisha’s coffee-growing pocket in brief.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["koraput"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "Where is Koraput coffee grown?",
        answer:
          "Koraput is a hilly district in southern Odisha; coffee grows at elevation in the Eastern Ghats alongside tribal and smallholder farming contexts.",
      },
      {
        question: "Why list it separately from “Odisha”?",
        answer:
          "Our directory keys off canonical origin regions; Koraput is the main specialty-relevant pocket we surface for Odisha in the dataset.",
      },
      {
        question: "What flavours are common?",
        answer:
          "Profiles vary by harvest and process—look for tasting notes on each coffee and compare roasters.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "More on Indian origins on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["araku", "northeast-india", "light-roast"],
  },
  {
    slug: "northeast-india",
    type: "region",
    h1: "Northeast India Coffee in India",
    intro:
      "Browse Indian specialty coffees from the Northeast—distinct hill terroirs and small-lot profiles beyond the traditional Western Ghats belt.",
    headerNudge:
      "Expect different flavour cues from Karnataka/Kerala classics—great for curious palates.",
    teaserTitle: "Northeast India coffees",
    teaserDescription:
      "Meghalaya hill regions in our directory; more NE origins may appear over time.",
    gridNudge:
      "Pour-over and AeroPress suit lighter roasts; espresso works when roasters target fuller profiles.",
    heroBadge: "Origin",
    regionSnapshot: {
      state: "Meghalaya (Garo, Khasi & West Khasi Hills)",
      elevation: "Roughly 800–1,700 m across hill areas",
      knownFor: "Distinct hill terroir beyond the classic Western Ghats belt",
    },
    faqOverline: "Northeast",
    faqTitle: "About *Northeast India* coffee",
    faqDescription: "What this filter includes on ICB.",
    faqBadge: "Regions",
    filter: {
      region_slugs: ["garo-hills", "khasi-hills", "west-khasi-hills"],
    },
    sortOrder: "rating_desc",
    faqs: [
      {
        question: "What does “Northeast India” include here?",
        answer:
          "We aggregate coffees linked to Meghalaya’s Garo, Khasi, and West Khasi Hills canonical regions—where we currently have structured origin data.",
      },
      {
        question: "Will more Northeast states appear?",
        answer:
          "As roasters list more traceable lots from Assam, Nagaland, Manipur, and elsewhere, we can expand this view.",
      },
      {
        question: "How does it differ from Eastern Ghats coffees?",
        answer:
          "Terroir and varieties differ; compare with Araku or Koraput pages for a side-by-side exploration.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Explore regions",
      description: "Learn hub content on Indian coffee geography.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["koraput", "araku", "medium-roast"],
  },
];
