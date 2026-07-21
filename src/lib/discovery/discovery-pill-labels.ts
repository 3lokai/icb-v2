// server-only: pulls the full LANDING_PAGES dataset (~270KB) — compute rows on the
// server and pass them as props to client components (see DiscoveryAccordionGrid).
import "server-only";
import {
  discoveryPagePath,
  getLandingPageConfig,
} from "@/lib/discovery/landing-pages";
import { brewMethodPages } from "@/lib/discovery/landing-pages/brew-method-pages";

export type DiscoveryPillRow = {
  title: string;
  pills: Array<{ label: string; href: string }>;
};

/** Short pill label from a discovery landing page slug (uses entityLabel). */
export function discoveryPillLabel(slug: string): string {
  const page = getLandingPageConfig(slug);
  if (!page) {
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  if (page.type === "roast_level") {
    return page.entityLabel.replace(/\s*Roast$/, "");
  }
  if (page.type === "process") {
    return page.entityLabel.replace(/\s*Process$/, "");
  }
  return page.entityLabel;
}

export function discoveryPillsFromSlugs(
  slugs: string[]
): Array<{ label: string; href: string }> {
  return slugs.map((slug) => ({
    label: discoveryPillLabel(slug),
    href: discoveryPagePath(slug),
  }));
}

const brewMethodSlugs = brewMethodPages.map((page) => page.slug);

/** Shared discovery navigation rows — pill labels derive from landing-page entityLabel. */
export const DISCOVERY_PILL_ROWS: DiscoveryPillRow[] = [
  {
    title: "Roast",
    pills: discoveryPillsFromSlugs([
      "light-roast",
      "light-medium-roast",
      "medium-roast",
      "medium-dark-roast",
      "dark-roast",
    ]),
  },
  {
    title: "Brew method",
    pills: discoveryPillsFromSlugs(brewMethodSlugs),
  },
  {
    title: "Process",
    pills: discoveryPillsFromSlugs([
      "natural",
      "washed",
      "honey",
      "anaerobic",
      "monsooned-malabar",
    ]),
  },
  {
    title: "Bean type",
    pills: discoveryPillsFromSlugs([
      "arabica",
      "robusta",
      "single-origin",
      "blends",
      "chicory-mixes",
      "liberica",
      "excelsa",
    ]),
  },
  {
    title: "Budget",
    pills: discoveryPillsFromSlugs([
      "budget",
      "mid-range",
      "under-1000",
      "premium",
    ]),
  },
  {
    title: "Region",
    pills: discoveryPillsFromSlugs([
      "chikmagalur",
      "coorg",
      "araku",
      "koraput",
      "northeast-india",
      "nilgiris",
      "wayanad",
    ]),
  },
];
