// Site navigation config, separate from rendering (header, mobile menu, footer).
// Structure is owner-approved: docs/experience-redesign/24-information-architecture.md §6.
// navigation.test.ts fails if a /coffees/<slug> link here stops matching a landing page.

export type NavLink = { name: string; link: string };
export type NavGroup = { label?: string; items: NavLink[] };
/** Every top-level label is itself a link; `groups` is the optional panel. */
export type NavItem = NavLink & { groups?: NavGroup[] };

const landing = (name: string, slug: string): NavLink => ({
  name,
  link: `/coffees/${slug}`,
});

const TOP_RATED: NavLink = {
  name: "Top rated",
  link: "/coffees?sort=rating_desc",
};

export const HEADER_NAV: NavItem[] = [
  {
    name: "Coffees",
    link: "/coffees",
    groups: [
      // "Just added" is omitted: newest is the directory's default sort, so it
      // would be a second link to /coffees.
      {
        label: "Browse",
        items: [{ name: "All coffees", link: "/coffees" }, TOP_RATED],
      },
      {
        label: "Roast",
        items: [
          landing("Light", "light-roast"),
          landing("Light-medium", "light-medium-roast"),
          landing("Medium", "medium-roast"),
          landing("Medium-dark", "medium-dark-roast"),
          landing("Dark", "dark-roast"),
        ],
      },
      {
        label: "Brew method",
        items: [
          landing("South Indian filter", "filter-coffee"),
          landing("V60", "v60"),
          landing("AeroPress", "aeropress"),
          landing("French press", "french-press"),
          landing("Espresso", "espresso"),
          landing("Moka pot", "moka-pot"),
          landing("Cold brew", "cold-brew"),
          landing("Chemex", "chemex"),
          landing("Kalita", "kalita"),
        ],
      },
      {
        label: "Process",
        items: [
          landing("Washed", "washed"),
          landing("Natural", "natural"),
          landing("Honey", "honey"),
          landing("Anaerobic", "anaerobic"),
          landing("Monsooned Malabar", "monsooned-malabar"),
        ],
      },
      {
        label: "Bean type",
        items: [
          landing("Arabica", "arabica"),
          landing("Robusta", "robusta"),
          landing("Liberica", "liberica"),
          landing("Excelsa", "excelsa"),
          landing("Single origin", "single-origin"),
          landing("Blends", "blends"),
          landing("Chicory mixes", "chicory-mixes"),
        ],
      },
      {
        label: "Price",
        items: [
          landing("Under ₹500", "budget"),
          landing("₹500–₹1,000", "mid-range"),
          landing("Under ₹1,000", "under-1000"),
          landing("Premium", "premium"),
        ],
      },
    ],
  },
  { name: "Roasters", link: "/roasters" },
  {
    name: "Origins",
    link: "/regions",
    groups: [
      {
        // Region page slugs, not canon slugs (see CLAUDE.md). Estates join when live.
        items: [
          landing("Chikmagalur", "chikmagalur"),
          landing("Coorg", "coorg"),
          landing("Araku", "araku"),
          landing("Nilgiris", "nilgiris"),
          landing("Wayanad", "wayanad"),
          landing("Baba Budangiri", "baba-budangiri"),
          { name: "All regions", link: "/regions" },
        ],
      },
    ],
  },
  {
    name: "Learn",
    link: "/learn",
    groups: [
      {
        // ponytail: the five Learn categories live in Sanity, not in code; add them
        // here once their slugs are fixed or the header gets a server-fetched list.
        items: [
          { name: "Articles", link: "/learn" },
          { name: "Series", link: "/learn/series" },
          { name: "Glossary", link: "/learn/glossary" },
          { name: "Insights", link: "/learn/insights" },
        ],
      },
    ],
  },
  // Becomes "Brew" (gear + tools) when /gear ships.
  { name: "Tools", link: "/tools" },
  {
    name: "More",
    // No page of its own; the label leads to the first item.
    link: "/communities",
    groups: [
      {
        items: [
          { name: "Communities", link: "/communities" },
          { name: "Curations", link: "/curations" },
          { name: "Newsletter", link: "/newsletter" },
        ],
      },
    ],
  },
];

export const FOOTER_NAV: { label: string; items: NavLink[] }[] = [
  {
    label: "Directory",
    items: [
      { name: "Coffees", link: "/coffees" },
      { name: "Roasters", link: "/roasters" },
      { name: "Regions", link: "/regions" },
      TOP_RATED,
    ],
  },
  {
    label: "Learn",
    items: [
      { name: "Articles", link: "/learn" },
      { name: "Series", link: "/learn/series" },
      { name: "Glossary", link: "/learn/glossary" },
      { name: "Insights", link: "/learn/insights" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "All tools", link: "/tools" },
      { name: "Brew calculator", link: "/tools/coffee-calculator" },
      { name: "Expert recipes", link: "/tools/expert-recipes" },
      { name: "Coffee compass", link: "/tools/coffee-compass" },
      { name: "Grind size converter", link: "/tools/grind-size-converter" },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Communities", link: "/communities" },
      { name: "Curations", link: "/curations" },
      { name: "Newsletter", link: "/newsletter" },
    ],
  },
  {
    label: "For roasters",
    items: [
      { name: "List or claim your roastery", link: "/roasters/partner" },
      { name: "Roaster terms", link: "/roasters/terms" },
      { name: "Developers and API", link: "/developers" },
    ],
  },
  {
    label: "About",
    items: [
      { name: "About", link: "/about" },
      { name: "How ICB works", link: "/how-icb-works" },
      { name: "Press", link: "/press" },
      { name: "Contact", link: "/contact" },
    ],
  },
];

export const LEGAL_NAV: NavLink[] = [
  { name: "Privacy", link: "/privacy" },
  { name: "Terms", link: "/terms" },
  { name: "Data deletion", link: "/data-deletion" },
];

/** Profile ▸ submenu in the account menu: the sections of the profile page, by anchor. */
export const PROFILE_SECTIONS: NavLink[] = [
  { name: "Taste Foundations", link: "#insights" },
  { name: "Selections", link: "#selections" },
  { name: "Wishlist", link: "#wishlist" },
  { name: "Ratings", link: "#ratings" },
  { name: "Gear", link: "#gear-station" },
];
