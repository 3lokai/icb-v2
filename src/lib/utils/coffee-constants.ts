// src/lib/coffee-constants.ts
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";
import type { LandingPageType } from "@/lib/discovery/landing-pages";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
} from "@/types/db-enums";

export type LookupOption = {
  value: string;
  label: string;
  id?: string;
};

// These probably won't change much, so keep as constants
// Match database enum format (underscores, not hyphens)
export const ROAST_LEVELS: LookupOption[] = [
  { value: "light", label: "Light" },
  { value: "light_medium", label: "Light Medium" },
  { value: "medium", label: "Medium" },
  { value: "medium_dark", label: "Medium Dark" },
  { value: "dark", label: "Dark" },
];

export const BEAN_TYPES: LookupOption[] = [
  { value: "arabica", label: "Arabica" },
  { value: "robusta", label: "Robusta" },
  { value: "liberica", label: "Liberica" },
  { value: "blend", label: "Blend" },
  { value: "arabica_80_robusta_20", label: "Arabica 80% / Robusta 20%" },
  { value: "arabica_70_robusta_30", label: "Arabica 70% / Robusta 30%" },
  { value: "arabica_60_robusta_40", label: "Arabica 60% / Robusta 40%" },
  { value: "arabica_50_robusta_50", label: "Arabica 50% / Robusta 50%" },
  { value: "robusta_80_arabica_20", label: "Robusta 80% / Arabica 20%" },
  { value: "arabica_chicory", label: "Arabica Chicory" },
  { value: "robusta_chicory", label: "Robusta Chicory" },
  { value: "blend_chicory", label: "Blend Chicory" },
  { value: "filter_coffee_mix", label: "Filter Coffee Mix" },
  { value: "excelsa", label: "Excelsa" },
];

// Processing methods - match database enum format
export const PROCESSING_METHODS: LookupOption[] = [
  { value: "washed", label: "Washed" },
  { value: "natural", label: "Natural" },
  { value: "honey", label: "Honey" },
  { value: "pulped_natural", label: "Pulped Natural" },
  { value: "monsooned", label: "Monsooned" },
  { value: "wet_hulled", label: "Wet Hulled" },
  { value: "anaerobic", label: "Anaerobic" },
  { value: "carbonic_maceration", label: "Carbonic Maceration" },
  { value: "double_fermented", label: "Double Fermented" },
  { value: "experimental", label: "Experimental" },
  { value: "other", label: "Other" },
];

// Coffee status enum
export const COFFEE_STATUS: LookupOption[] = [
  { value: "active", label: "Active" },
  { value: "seasonal", label: "Seasonal" },
  { value: "discontinued", label: "Discontinued" },
  { value: "draft", label: "Draft" },
  { value: "hidden", label: "Hidden" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "archived", label: "Archived" },
];

// Coffee directory/search default visibility.
// These are the only statuses we want shown in public listings.
export const PUBLIC_COFFEE_STATUSES: CoffeeStatusEnum[] = [
  "active",
  "seasonal",
];

// Grind types enum - matches database grind_enum
export const GRIND_TYPES: LookupOption[] = [
  { value: "whole", label: "Whole Bean" },
  { value: "filter", label: "Filter" },
  { value: "espresso", label: "Espresso" },
  { value: "drip", label: "Drip" },
  { value: "other", label: "Other" },
  { value: "turkish", label: "Turkish" },
  { value: "moka_pot", label: "Moka Pot" },
  { value: "cold_brew", label: "Cold Brew" },
  { value: "aeropress", label: "AeroPress" },
  { value: "channi", label: "Channi" },
  { value: "coffee_filter", label: "Coffee Filter" },
  { value: "french_press", label: "French Press" },
  { value: "south_indian_filter", label: "South Indian Filter" },
  { value: "pour_over", label: "Pour Over" },
  { value: "syphon", label: "Syphon" },
];

// Sensory confidence enum
export const SENSORY_CONFIDENCE: LookupOption[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

// Sensory source enum
export const SENSORY_SOURCE: LookupOption[] = [
  { value: "roaster", label: "Roaster" },
  { value: "icb_inferred", label: "ICB Inferred" },
  { value: "icb_manual", label: "ICB Manual" },
];

export const popularRoastLevels = ["Light", "Medium", "Dark"];
export const popularFlavorProfiles = [
  "Chocolate",
  "Fruity",
  "Nutty",
  "Floral",
  "Spicy",
  "Earthy",
  "Bright",
  "Sweet",
];
export const popularBrewingMethods = [
  "Pour Over",
  "French Press",
  "Espresso",
  "AeroPress",
  "Cold Brew",
  "Chemex",
  "V60",
  "Moka Pot",
];
export const popularRegions = [
  "Chikamagalur",
  "Araku Valley",
  "Coorg",
  "Manipur",
  "Nilgiris",
];
export const popularBeanTypes = ["Arabica", "Robusta", "Blend"];
export const popularProcessingMethods = [
  "Washed",
  "Natural",
  "Honey",
  "Anaerobic",
  "Monsooned",
];

// ─── Discovery page slugs (/coffees/[slug]) — guarded by landing config ───

function slugIfLanding(
  slug: string,
  allowedTypes: LandingPageType[]
): string | null {
  const page = getLandingPageConfig(slug);
  if (!page || !allowedTypes.includes(page.type)) return null;
  return slug;
}

const ROAST_ENUM_TO_DISCOVERY_SLUG: Record<RoastLevelEnum, string> = {
  light: "light-roast",
  light_medium: "light-medium-roast",
  medium: "medium-roast",
  medium_dark: "medium-dark-roast",
  dark: "dark-roast",
};

/** Roast level enum → discovery slug, or null if no landing. */
export function discoverySlugForRoastLevel(
  level: RoastLevelEnum | null | undefined
): string | null {
  if (!level) return null;
  const candidate = ROAST_ENUM_TO_DISCOVERY_SLUG[level];
  if (!candidate) return null;
  return slugIfLanding(candidate, ["roast_level"]);
}

const PROCESS_ENUM_TO_DISCOVERY_SLUG: Partial<Record<ProcessEnum, string>> = {
  natural: "natural",
  washed: "washed",
  honey: "honey",
  monsooned: "monsooned-malabar",
  anaerobic: "anaerobic",
};

/** Process enum → discovery slug, or null if no curated page. */
export function discoverySlugForProcess(
  process: ProcessEnum | null | undefined
): string | null {
  if (!process) return null;
  const candidate = PROCESS_ENUM_TO_DISCOVERY_SLUG[process];
  if (!candidate) return null;
  return slugIfLanding(candidate, ["process"]);
}

/**
 * Brew method canonical key (brew_methods.key) → discovery slug.
 * Generic pour_over maps to V60 (Chemex/Kalita share the same filter key in data).
 */
const BREW_KEY_TO_DISCOVERY_SLUG: Record<string, string> = {
  aeropress: "aeropress",
  french_press: "french-press",
  pour_over: "v60",
};

export function discoverySlugForBrewMethodKey(
  key: string | null | undefined
): string | null {
  if (!key) return null;
  const candidate = BREW_KEY_TO_DISCOVERY_SLUG[key];
  if (!candidate) return null;
  return slugIfLanding(candidate, ["brew_method"]);
}

const NE_SUBREGIONS = new Set([
  "garo-hills",
  "khasi-hills",
  "west-khasi-hills",
]);

/** Normalized token (lowercase, hyphens) → canonical region landing slug */
const REGION_SLUG_ALIASES: Record<string, string> = {
  chikamagalur: "chikmagalur",
  "araku-valley": "araku",
};

function normalizeRegionToken(raw: string): string {
  return raw.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
}

/**
 * Region subregion string (or normalized display token) → discovery slug.
 */
export function discoverySlugForRegionSubregion(
  subregion: string | null | undefined
): string | null {
  if (!subregion) return null;
  let normalized = normalizeRegionToken(subregion);
  normalized = REGION_SLUG_ALIASES[normalized] ?? normalized;
  if (NE_SUBREGIONS.has(normalized)) {
    return slugIfLanding("northeast-india", ["region"]);
  }
  return slugIfLanding(normalized, ["region"]);
}

export function discoverySlugForRegionDisplayOrSubregion(region: {
  subregion: string;
  display_name: string | null;
}): string | null {
  const fromSub = discoverySlugForRegionSubregion(region.subregion);
  if (fromSub) return fromSub;
  if (region.display_name) {
    return discoverySlugForRegionSubregion(
      normalizeRegionToken(region.display_name)
    );
  }
  return null;
}
