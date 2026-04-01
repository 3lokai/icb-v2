import { DISCOVERY_PILL_ROWS } from "@/components/discovery/DiscoveryPillGrid";
import type { DiscoveryPillRow } from "@/components/discovery/DiscoveryPillGrid";

/** Allowed hrefs per row title for the homepage hero discovery variant */
const HERO_PILL_HREFS_BY_ROW: Partial<Record<string, string[]>> = {
  Roast: [
    "/coffees/light-roast",
    "/coffees/medium-roast",
    "/coffees/dark-roast",
  ],
  "Brew method": [
    "/coffees/aeropress",
    "/coffees/v60",
    "/coffees/french-press",
  ],
  Budget: ["/coffees/budget"],
};

/**
 * Subset of DISCOVERY_PILL_ROWS for hero quick links (keeps labels/hrefs in sync with directory).
 */
export function getHeroDiscoveryPillRows(): DiscoveryPillRow[] {
  return DISCOVERY_PILL_ROWS.map((row) => {
    const allow = HERO_PILL_HREFS_BY_ROW[row.title];
    if (!allow?.length) return null;
    const pills = row.pills.filter((p) => allow.includes(p.href));
    if (!pills.length) return null;
    return { title: row.title, pills };
  }).filter((r): r is DiscoveryPillRow => r !== null);
}
