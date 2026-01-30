// src/lib/coffee-constants.ts
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

// Grind types enum
export const GRIND_TYPES: LookupOption[] = [
  { value: "whole", label: "Whole Bean" },
  { value: "filter", label: "Filter" },
  { value: "espresso", label: "Espresso" },
  { value: "omni", label: "Omni" },
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
