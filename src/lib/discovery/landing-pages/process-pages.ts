// src/lib/discovery/landing-pages/process-pages.ts
import type { ProcessEnum } from "@/types/db-enums";

import type { LandingPageConfig } from "./types";

export const processPages: LandingPageConfig[] = [
  // Process pages
  {
    slug: "natural",
    type: "process",
    h1: "Natural Process Coffee in India",
    intro:
      "Explore Indian specialty coffees processed naturally—dried in the cherry for bold fruit, wine-like complexity, and heavy body.",
    headerNudge:
      "Expect pronounced fruit and fermentation-forward profiles when dialed in.",
    teaserTitle: "Natural process picks",
    teaserDescription:
      "Lots where the fruit stayed on the bean longer for intense sweetness and complexity.",
    gridNudge:
      "Grind a touch coarser if shots run slow; naturals can extract quickly on pour over.",
    heroBadge: "Processing",
    faqOverline: "Natural process",
    faqTitle: "About *natural* coffee",
    faqDescription: "How natural processing shapes flavour in the cup.",
    faqBadge: "Processing",
    filter: {
      processes: ["natural" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn",
    faqs: [
      {
        question: "What is natural process coffee?",
        answer:
          "Cherries are typically dried with the fruit intact, allowing sugars to influence the bean—often yielding fruity, wine-like, or fermented notes.",
      },
      {
        question: "Is natural the same as unwashed?",
        answer:
          "In common specialty usage, “natural” and dry-processed naturals refer to this style; wording varies by region.",
      },
      {
        question: "Best brew methods for naturals?",
        answer:
          "Pour-over and immersion can both work; control grind and temperature to balance intense fruit and sweetness.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about processing",
      description: "More on how processing changes flavour in Indian coffees.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["honey", "washed", "light-roast"],
  },
  {
    slug: "washed",
    type: "process",
    h1: "Washed Process Coffee in India",
    intro:
      "Find washed Indian specialty coffees—clean cups, vibrant acidity, and clarity that lets origin and varietal shine.",
    headerNudge:
      "Great when you want crisp definition and less ferment than naturals.",
    teaserTitle: "Washed process picks",
    teaserDescription: "Fermented and washed to remove mucilage before drying.",
    gridNudge:
      "Slightly finer grind can highlight acidity; keep an eye on brew time.",
    heroBadge: "Processing",
    faqOverline: "Washed process",
    faqTitle: "About *washed* coffee",
    faqDescription: "Why washed lots taste clean and bright.",
    faqBadge: "Processing",
    filter: {
      processes: ["washed" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn",
    faqs: [
      {
        question: "What is washed coffee?",
        answer:
          "After pulping, mucilage is removed through fermentation and washing before drying—often producing cleaner, brighter cups.",
      },
      {
        question: "Washed vs natural?",
        answer:
          "Washed tends toward clarity and acidity; natural often brings heavier body and fruit. Both can be excellent.",
      },
      {
        question: "Best brewing for washed coffees?",
        answer:
          "Pour-over methods highlight clarity; espresso can emphasize sweetness and balance.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about processing",
      description: "Explore how washing affects flavour.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["natural", "v60", "light-roast"],
  },
  {
    slug: "honey",
    type: "process",
    h1: "Honey Process Coffee in India",
    intro:
      "Discover honey and pulped-natural style Indian coffees—sweetness, body, and balance between washed clarity and natural fruit.",
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
    faqDescription: "What “honey” means in specialty coffee.",
    faqBadge: "Processing",
    filter: {
      processes: ["honey" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn",
    faqs: [
      {
        question: "What is honey process?",
        answer:
          "Mucilage is partially left on the bean while drying—black/red/yellow/white honey usually refers to how much mucilage remains, affecting sweetness and risk.",
      },
      {
        question: "Honey vs natural?",
        answer:
          "Honey often sits between washed and natural: more body than washed, often less intense ferment than heavy naturals.",
      },
      {
        question: "Brew tips?",
        answer:
          "Balanced pour-over recipes work well; adjust ratio to taste for sweetness vs clarity.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about processing",
      description: "More on honey and pulped-natural styles.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["natural", "washed", "medium-roast"],
  },
  {
    slug: "anaerobic",
    type: "process",
    h1: "Anaerobic Process Coffee in India",
    intro:
      "Browse anaerobic and experimental ferment Indian specialty coffees—intense aromatics, complex fruit, and distinctive cup profiles.",
    headerNudge:
      "Fermentation in controlled low-oxygen environments can amplify fruit and spice notes.",
    teaserTitle: "Anaerobic picks",
    teaserDescription:
      "Experimental lots with bold, often wine-like or tropical profiles.",
    gridNudge: "Use soft water and careful ratios—these cups can be intense.",
    heroBadge: "Experimental",
    faqOverline: "Anaerobic",
    faqTitle: "About *anaerobic* coffee",
    faqDescription: "Controlled fermentation and flavour impact.",
    faqBadge: "Processing",
    filter: {
      processes: ["anaerobic" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn",
    faqs: [
      {
        question: "What does anaerobic mean here?",
        answer:
          "Coffee is fermented with limited oxygen—often in sealed tanks—allowing specific microbes to shape flavour differently than open fermentation.",
      },
      {
        question: "Are anaerobic coffees for everyone?",
        answer:
          "They can be polarising—very fruit-forward or fermented. Great if you enjoy bold, wine-like cups.",
      },
      {
        question: "How to brew?",
        answer:
          "Start with familiar pour-over parameters; grind slightly coarser if flavours feel too concentrated.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn more",
      description: "Processing and flavour on the learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["natural", "mid-range", "light-roast"],
  },
  {
    slug: "monsooned-malabar",
    type: "process",
    h1: "Monsooned Malabar Coffee in India",
    intro:
      "Explore monsooned coffees from India—low acidity, mellow spice, and a distinct heritage profile associated with the Malabar coast.",
    headerNudge:
      "Monsooning swells beans and mellows acidity; profiles are often earthy and smooth.",
    teaserTitle: "Monsooned Malabar picks",
    teaserDescription:
      "Heritage-processed lots valued for their mild, heavy-bodied cup.",
    gridNudge:
      "Works well in espresso blends or milk; try French Press for body.",
    heroBadge: "Heritage",
    faqOverline: "Monsooned",
    faqTitle: "About *monsooned* coffee",
    faqDescription: "India’s monsooning tradition in brief.",
    faqBadge: "Processing",
    filter: {
      processes: ["monsooned" as ProcessEnum],
    },
    sortOrder: "rating_desc",
    blogArticleHref: "/learn",
    faqs: [
      {
        question: "What is monsooned coffee?",
        answer:
          "Beans are exposed to monsoon winds and humidity in a controlled manner, swelling them and muting acidity while developing mellow, earthy sweetness.",
      },
      {
        question: "Why is it associated with Malabar?",
        answer:
          "The style originated with storage in coastal Malabar warehouses; today it’s a defined specialty category with protected terminology in some contexts.",
      },
      {
        question: "How should I brew it?",
        answer:
          "Espresso and milk drinks, French Press, or South Indian filter—embrace the low-acid, full-bodied profile.",
      },
    ],
    utilityCard: {
      type: "tips",
      title: "Learn about Indian coffee",
      description: "Regions, processes, and brewing on our learn hub.",
      href: "/learn",
      ctaText: "Learn",
    },
    related: ["dark-roast", "french-press", "coorg"],
  },
];
