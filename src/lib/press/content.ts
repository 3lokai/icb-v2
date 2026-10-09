/**
 * /press content — the single source for press copy. The page renders it and
 * `npm run press:kit` writes it into the media kit ZIP, so the two never drift.
 * Founder name/links live on FOUNDER (@/lib/seo/schema), shared with /about.
 *
 * Copy rules (see docs/press-kit.md): no live numbers here (they go stale —
 * the page pulls those from the DB), no superlatives, not a marketplace.
 */

export const PRESS_CONTACT_EMAIL = "thrilok.gt@indiancoffeebeans.com";

export const DATA_ATTRIBUTION =
  "Source: IndianCoffeeBeans.com — Industry Insights";
export const INSIGHTS_HREF = "/learn/insights";

export const DESCRIPTIONS = [
  {
    key: "short",
    label: "Short",
    text: "IndianCoffeeBeans is an independent platform for discovering Indian specialty coffee: roasters, coffees, community ratings, industry data, and guides to how Indian coffee is grown and brewed.",
  },
  {
    key: "standard",
    label: "Standard",
    text: "IndianCoffeeBeans is an independent discovery platform for India's specialty coffee ecosystem. It catalogues Indian roasters and the coffees they sell, with structured details such as origin region, estate, processing method, roast level and price, so people can compare beans side by side. Coffee drinkers add ratings and reviews, and the platform publishes original catalog data through its Industry Insights dashboard, alongside an editorial field guide on Indian coffee regions, processing and brewing.",
  },
  {
    key: "extended",
    label: "Extended",
    text: "IndianCoffeeBeans is an independent discovery platform for India's specialty coffee ecosystem, founded in 2024 by Thrilok Abhishek.\n\nThe platform catalogues Indian specialty roasters and the coffees they sell, recording structured details for each coffee: origin region and estate, processing method, roast level, varieties, tasting notes and price. Coffee drinkers can filter the catalogue by what matters to them, from brew method to process, and follow each listing through to the roaster's own store. Community members rate and review the coffees they have tried, building a shared record of how Indian coffees taste in practice.\n\nBecause the catalogue is structured, it also works as a lens on the industry. The Industry Insights dashboard publishes aggregated, regularly refreshed data on processing trends, origin regions, pricing and roaster geography. The editorial field guide adds multi-part series on India's coffee regions, processing methods, pricing and home brewing, written for curious newcomers and experienced drinkers alike.\n\nIndianCoffeeBeans does not sell coffee; it links to roasters directly.",
  },
] as const;

export const FOUNDER_BIO = {
  short:
    "Thrilok Abhishek is the founder of IndianCoffeeBeans. A sales and marketing professional by trade, he built the platform in 2024 as the straightforward, independent resource on Indian specialty coffee he wished he had when he started brewing.",
  long: [
    "Thrilok Abhishek is the founder of IndianCoffeeBeans, an independent discovery platform for Indian specialty coffee.",
    "His interest in coffee began with South Indian filter coffee at home, and deepened during six to seven months in Italy in 2012, where he was drawn into its espresso culture. After the pandemic, a casual habit became a serious one: from instant coffee to a full home brewing station and a growing collection of Indian beans.",
    "A sales and marketing professional by trade, Thrilok approached the project from the drinker's side, asking what he would have wanted when starting out. The answer was a comprehensive resource focused on Indian coffee and free of marketing noise. He credits the r/IndianCoffee community as his main guide through India's coffee landscape, and describes IndianCoffeeBeans as his way of giving back to it.",
  ],
  /** Verbatim from /about. */
  why: "What would I have wanted when I was just starting my specialty coffee journey? The answer was simple: a straightforward, comprehensive resource focused on Indian coffee, free from marketing noise.",
} as const;

/** Sanity series slugs, in display order. */
export const FEATURED_SERIES = [
  "state-of-indian-specialty-coffee",
  "atlas-of-indian-coffee-regions",
  "processing-explained",
] as const;

/** Sanity article slugs, in display order. Picked for reporting value, not recency. */
export const FEATURED_ARTICLES = [
  "indian-specialty-coffee-by-the-numbers",
  "indian-coffee-industry-timeline",
  "coffee-gi-tags-india",
  "indian-coffee-export-vs-domestic-specialty",
] as const;

export type StoryAngle = {
  title: string;
  premise: string;
  links: { label: string; href: string }[];
};

export const STORY_ANGLES: StoryAngle[] = [
  {
    title: "Beyond washed and natural",
    premise:
      "Indian roasters now list anaerobic, carbonic maceration and other experimental lots alongside traditional washed and natural coffees. What is driving the experimentation, and how is it changing what Indian coffee tastes like?",
    links: [
      {
        label: "How India's process mix is changing",
        href: "/learn/how-coffee-process-mix-changing-india",
      },
      {
        label: "Processing Explained series",
        href: "/learn/series/processing-explained",
      },
      { label: "Processing data", href: `${INSIGHTS_HREF}#process` },
    ],
  },
  {
    title: "The map is bigger than Chikmagalur",
    premise:
      "Karnataka dominates Indian coffee, but specialty roasters increasingly name estates and regions from Kerala, Tamil Nadu, the Eastern Ghats and the Northeast. How do these regions differ, and which are drinkers discovering?",
    links: [
      {
        label: "Coffee regions of India",
        href: "/learn/coffee-regions-of-india-complete-guide",
      },
      {
        label: "Northeast India's coffee regions",
        href: "/learn/northeast-india-coffee-regions",
      },
      { label: "Origin region data", href: `${INSIGHTS_HREF}#regions` },
    ],
  },
  {
    title: "Where India's roasters are",
    premise:
      "Where are India's specialty roasters and independent cafes setting up, and what do local coffee scenes look like beyond the headline metros?",
    links: [
      {
        label: "Specialty coffee cities in India",
        href: "/learn/specialty-coffee-cities-india",
      },
      {
        label: "Independent cafes, city by city",
        href: "/learn/independent-specialty-cafes-india-city-landscape",
      },
      { label: "Roaster geography", href: `${INSIGHTS_HREF}#roasters` },
    ],
  },
  {
    title: "What's in the price of a bag",
    premise:
      "What goes into the price of an Indian specialty coffee — farming, processing, roasting and the pull of export markets — and how should drinkers judge value?",
    links: [
      {
        label: "Specialty coffee pricing in India",
        href: "/learn/specialty-coffee-pricing-india",
      },
      {
        label: "The Price of a Bag series",
        href: "/learn/series/the-price-of-a-bag",
      },
      { label: "Pricing data", href: `${INSIGHTS_HREF}#pricing` },
    ],
  },
];

export type PressCoverage = {
  publication: string;
  headline: string;
  /** ISO date */
  date: string;
  url: string;
  type: "feature" | "interview" | "mention" | "recognition" | "event";
  description?: string;
  /** Path under /public, only if the publication permits logo use. */
  logo?: string;
};

/** Published coverage only — add YourStory once the article is live. Empty hides the section. */
export const PRESS_COVERAGE: PressCoverage[] = [];

export type PressAsset = {
  label: string;
  /** What it's for — shown under the label. */
  note: string;
  preview: string;
  files: { format: string; href: string }[];
  /** Preview background: wordmarks need a backdrop that matches their intent. */
  tone?: "light" | "dark";
};

export const LOGO_ASSETS: PressAsset[] = [
  {
    label: "Primary wordmark",
    note: "Brand brown, for light backgrounds",
    preview: "/press/icb-wordmark.svg",
    tone: "light",
    files: [
      { format: "SVG", href: "/press/icb-wordmark.svg" },
      { format: "PNG", href: "/press/icb-wordmark.png" },
    ],
  },
  {
    label: "Dark wordmark",
    note: "Dark-on-light, for print and pale backgrounds",
    preview: "/press/icb-wordmark-dark.svg",
    tone: "light",
    files: [
      { format: "SVG", href: "/press/icb-wordmark-dark.svg" },
      { format: "PNG", href: "/press/icb-wordmark-dark.png" },
    ],
  },
  {
    label: "Light wordmark",
    note: "Light-on-dark, for dark backgrounds",
    preview: "/press/icb-wordmark-light.svg",
    tone: "dark",
    files: [
      { format: "SVG", href: "/press/icb-wordmark-light.svg" },
      { format: "PNG", href: "/press/icb-wordmark-light.png" },
    ],
  },
  {
    label: "Icon",
    note: "Square mark, 1024 × 1024 transparent PNG",
    preview: "/press/icb-icon.png",
    tone: "light",
    files: [{ format: "PNG", href: "/press/icb-icon.png" }],
  },
];

export const SCREENSHOT_ASSETS: PressAsset[] = [
  {
    label: "Coffee directory",
    note: "Browsing and filtering the coffee catalogue",
    preview: "/press/screenshots/icb-coffee-directory.jpg",
    files: [
      { format: "JPG", href: "/press/screenshots/icb-coffee-directory.jpg" },
    ],
  },
  {
    label: "Coffee detail",
    note: "A coffee page with community rating and price",
    preview: "/press/screenshots/icb-coffee-detail.jpg",
    files: [
      { format: "JPG", href: "/press/screenshots/icb-coffee-detail.jpg" },
    ],
  },
  {
    label: "Roaster directory",
    note: "Indian specialty roasters by location",
    preview: "/press/screenshots/icb-roaster-directory.jpg",
    files: [
      { format: "JPG", href: "/press/screenshots/icb-roaster-directory.jpg" },
    ],
  },
  {
    label: "Industry Insights",
    note: "The live catalog data dashboard",
    preview: "/press/screenshots/icb-industry-insights.jpg",
    files: [
      { format: "JPG", href: "/press/screenshots/icb-industry-insights.jpg" },
    ],
  },
];

export const FOUNDER_PHOTO = {
  href: "/press/thrilok-abhishek-founder.jpg",
  credit: "Photo: courtesy of IndianCoffeeBeans",
} as const;

export const MEDIA_KIT_HREF = "/press/icb-media-kit.zip";

export const BRAND_GUIDELINES = [
  "Keep the logo's original proportions; don't stretch, skew or crop it.",
  "Don't recolour the logo or add effects. Use the light wordmark on dark backgrounds and the primary or dark wordmark on light ones.",
  "Leave clear space around the logo of at least the height of the icon's smaller bean.",
  "Don't use the logo in a way that suggests IndianCoffeeBeans endorses a third party, product or roaster.",
  "Credit IndianCoffeeBeans when reproducing its data or editorial material, and link to the source page where possible.",
];
