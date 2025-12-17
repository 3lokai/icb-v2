// src/lib/tools/brewing-guide.ts

export type StrengthLevel = "mild" | "average" | "robust";
export type RoastLevel = "light" | "medium" | "dark";
export type BrewingMethodKey =
  | "pourover"
  | "frenchpress"
  | "chemex"
  | "aeropress"
  | "autodrip"
  | "mokapot"
  | "siphon"
  | "coldbrew"
  | "espresso"
  | "turkish"
  | "southindianfilter"
  | "v60"
  | "kalitawave";

export type BrewingMethod = {
  id: BrewingMethodKey;
  name: string;
  ratios: Record<StrengthLevel, number>; // 1:X ratio (coffee to water)
  grindSize: string;
  brewTime: string;
  temperatures: Record<RoastLevel, string>;
  description: string;
  flavorProfile: string;
  recommendedRoast: RoastLevel[];
  tips: string[];
};

export const BREWING_METHODS: Record<BrewingMethodKey, BrewingMethod> = {
  pourover: {
    id: "pourover",
    name: "Pour Over",
    ratios: { mild: 18, average: 16, robust: 13 },
    grindSize: "Medium-fine",
    brewTime: "3-4 minutes (total)",
    temperatures: {
      light: "95-100°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "Manual brewing that highlights subtle flavors and clarity — great for showcasing origin characteristics.",
    flavorProfile: "Clean, balanced, nuanced",
    recommendedRoast: ["light", "medium"],
    tips: [
      "Use a gooseneck kettle for controlled, circular pouring",
      "Wet the filter with hot water before adding coffee",
      "Bloom for 30-45 seconds with 2x coffee weight in water",
      "Maintain steady pour rate to hit target brew time",
    ],
  },
  frenchpress: {
    id: "frenchpress",
    name: "French Press",
    ratios: { mild: 18, average: 15, robust: 13 },
    grindSize: "Coarse",
    brewTime: "4 minutes (steep time)",
    temperatures: {
      light: "95-100°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "Immersion brewing that produces full-bodied cups with rich oils and deep flavor.",
    flavorProfile: "Full-bodied, rich, slightly textured",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Use coarse, even grind to prevent over-extraction",
      "Stir coffee grounds after adding water for even saturation",
      "Steep for exactly 4 minutes, then press slowly",
      "Serve immediately to prevent over-extraction",
    ],
  },
  chemex: {
    id: "chemex",
    name: "Chemex",
    ratios: { mild: 18, average: 16, robust: 13 },
    grindSize: "Medium-coarse",
    brewTime: "4-6 minutes (total)",
    temperatures: {
      light: "95-100°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "Pour-over method using thick filters for exceptionally clean, bright cups with no sediment.",
    flavorProfile: "Ultra-clean, bright, tea-like clarity",
    recommendedRoast: ["light", "medium"],
    tips: [
      "Use Chemex-branded filters for proper thickness",
      "Rinse filter thoroughly to remove papery taste",
      "Grind slightly coarser than V60 to compensate for thick filter",
      "Focus on even saturation with slower pour rate",
    ],
  },
  aeropress: {
    id: "aeropress",
    name: "AeroPress",
    ratios: { mild: 18, average: 15, robust: 12 },
    grindSize: "Medium-fine",
    brewTime: "1-2 minutes (including steep & press)",
    temperatures: {
      light: "85-90°C",
      medium: "80-85°C",
      dark: "74-79°C",
    },
    description:
      "Pressure-based brewing creating concentrated, espresso-like results with incredible versatility.",
    flavorProfile: "Concentrated, smooth, low-bitterness",
    recommendedRoast: ["light", "medium", "dark"],
    tips: [
      "Experiment with inverted method for longer steep times",
      "Use lower temperatures than other methods due to pressure",
      "Press slowly and steadily over 20-30 seconds",
      "Dilute concentrate to taste with hot water if desired",
    ],
  },
  autodrip: {
    id: "autodrip",
    name: "Auto Drip",
    ratios: { mild: 18, average: 17, robust: 13 },
    grindSize: "Medium",
    brewTime: "5-6 minutes (machine cycle)",
    temperatures: {
      light: "93-96°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "Automatic brewing method for consistent, convenient coffee with minimal hands-on time.",
    flavorProfile: "Balanced, familiar, consistent",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Use SCA certified machines for proper temperature and timing",
      "Clean machine regularly to prevent mineral buildup",
      "Use filtered water for best taste and machine longevity",
      "Replace heating element if brew temperature drops below 90°C",
    ],
  },
  mokapot: {
    id: "mokapot",
    name: "Moka Pot",
    ratios: { mild: 9, average: 8, robust: 6 },
    grindSize: "Fine (but not powder)",
    brewTime: "5-8 minutes (heating time)",
    temperatures: {
      light: "Medium heat",
      medium: "Medium-low heat",
      dark: "Low heat",
    },
    description:
      "Stovetop brewing creating strong, espresso-like coffee with distinctive bold character.",
    flavorProfile: "Strong, bold, slightly bitter",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Use medium heat to avoid burning and over-extraction",
      "Fill water chamber to safety valve level only",
      "Pack coffee grounds lightly, level but not compressed",
      "Remove from heat when gurgling starts, let sit 30 seconds before serving",
    ],
  },
  siphon: {
    id: "siphon",
    name: "Siphon",
    ratios: { mild: 16, average: 14, robust: 12 },
    grindSize: "Medium-fine",
    brewTime: "3-5 minutes (brewing cycle)",
    temperatures: {
      light: "95-100°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "Vacuum brewing method producing exceptionally clean, complex flavors with theatrical presentation.",
    flavorProfile: "Clean, complex, wine-like clarity",
    recommendedRoast: ["light", "medium"],
    tips: [
      "Maintain consistent heat throughout brewing cycle",
      "Stir once gently after adding coffee to ensure saturation",
      "Time the brewing carefully - 1-2 minutes is optimal",
      "Let vacuum draw coffee down naturally for clean finish",
    ],
  },
  coldbrew: {
    id: "coldbrew",
    name: "Cold Brew",
    ratios: { mild: 8, average: 6, robust: 4 },
    grindSize: "Extra coarse",
    brewTime: "12-24 hours (steep time)",
    temperatures: {
      light: "Room temperature",
      medium: "Room temperature",
      dark: "Room temperature",
    },
    description:
      "Long extraction in cold water for smooth, low-acid coffee with natural sweetness.",
    flavorProfile: "Smooth, sweet, low-acid, chocolaty",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Steep for 12-24 hours depending on desired strength",
      "Use extra coarse grind to avoid over-extraction and cloudiness",
      "Filter through fine mesh or paper filter before serving",
      "Dilute concentrate 1:1 with water, ice, or milk to taste",
    ],
  },
  espresso: {
    id: "espresso",
    name: "Espresso",
    ratios: { mild: 3, average: 2, robust: 1.5 },
    grindSize: "Extra fine",
    brewTime: "25-30 seconds (extraction time)",
    temperatures: {
      light: "93-96°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "High-pressure extraction creating concentrated, rich coffee with distinctive crema layer.",
    flavorProfile: "Intense, rich, complex with crema",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Use machines with 15-20 bars pressure; 9 bars is optimal for extraction",
      "Tamp evenly with 30lbs pressure for consistent extraction",
      "Aim for 25-30 second extraction time for balanced flavor",
      "Fresh grind is crucial for proper crema formation",
    ],
  },
  turkish: {
    id: "turkish",
    name: "Turkish Coffee",
    ratios: { mild: 12, average: 10, robust: 8 },
    grindSize: "Powder fine (finest possible)",
    brewTime: "3-4 minutes (simmering time)",
    temperatures: {
      light: "Slow simmer (~90°C)",
      medium: "Slow simmer (~90°C)",
      dark: "Slow simmer (~90°C)",
    },
    description:
      "Traditional method brewing ultra-fine grounds in a cezve for an authentic, cultural experience.",
    flavorProfile: "Rich, thick, intense with grounds",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Grind to flour-like powder consistency for proper texture",
      "Add sugar before brewing if desired - cannot be added after",
      "Watch for foam formation carefully - remove just as it rises",
      "Serve immediately with grounds settled at bottom, do not stir",
    ],
  },
  southindianfilter: {
    id: "southindianfilter",
    name: "South Indian Filter",
    ratios: { mild: 4, average: 3, robust: 2.5 },
    grindSize: "Fine to medium-fine",
    brewTime: "15-20 minutes (drip time)",
    temperatures: {
      light: "100°C (boiling)",
      medium: "100°C (boiling)",
      dark: "100°C (boiling)",
    },
    description:
      "Slow-drip method producing strong, chicory-blended decoction — best enjoyed with milk.",
    flavorProfile: "Strong, aromatic, chicory-enhanced",
    recommendedRoast: ["medium", "dark"],
    tips: [
      "Use freshly ground coffee with 10-20% chicory blend for authenticity",
      "Pack grounds firmly but not too tight in upper chamber",
      "Let decoction drip slowly - patience creates better extraction",
      "Mix decoction with hot milk in 1:3 or 1:4 ratio, add sugar to taste",
    ],
  },
  v60: {
    id: "v60",
    name: "Hario V60",
    ratios: { mild: 18, average: 16, robust: 14 },
    grindSize: "Medium-fine",
    brewTime: "2:30-3:30 minutes (total)",
    temperatures: {
      light: "95-100°C",
      medium: "92-95°C",
      dark: "88-92°C",
    },
    description:
      "Iconic cone-shaped dripper with spiral ridges for maximum control and clarity.",
    flavorProfile: "Clean, bright, nuanced",
    recommendedRoast: ["light", "medium"],
    tips: [
      "Requires precise pouring technique for best results",
      "Large single hole allows for flow rate control",
      "Spiral ridges promote even extraction",
      "Excellent for highlighting origin characteristics",
    ],
  },
  kalitawave: {
    id: "kalitawave",
    name: "Kalita Wave",
    ratios: { mild: 17, average: 15, robust: 13 },
    grindSize: "Medium",
    brewTime: "3-4 minutes (total)",
    temperatures: {
      light: "95-100°C",
      medium: "90-93°C",
      dark: "87-90°C",
    },
    description:
      "Flat-bottom dripper with wave filters for even extraction and forgiving, balanced cups.",
    flavorProfile: "Balanced, even, consistent",
    recommendedRoast: ["light", "medium", "dark"],
    tips: [
      "Flat bottom provides even water contact with coffee bed",
      "Three small holes control flow rate for consistent extraction",
      "Less technique-sensitive than V60 - great for beginners",
      "Wave filters prevent clogging and over-extraction",
    ],
  },
};

// Calculator utilities
export type CalculatorInputs = {
  method: BrewingMethodKey;
  volume: number; // in ml
  strength: StrengthLevel;
  roastLevel: RoastLevel;
};

export type CalculatorResults = {
  coffeeAmount: number; // in grams
  waterAmount: number; // in ml
  ratio: string; // formatted as "1:X"
  grindSize: string;
  brewTime: string;
  temperature: string;
  method: BrewingMethod;
};

export function calculateBrewRatio(
  inputs: CalculatorInputs
): CalculatorResults {
  const method = BREWING_METHODS[inputs.method];
  const ratio = method.ratios[inputs.strength];
  const coffeeAmount = Math.round((inputs.volume / ratio) * 10) / 10; // Round to 1 decimal

  return {
    coffeeAmount,
    waterAmount: inputs.volume,
    ratio: `1:${ratio}`,
    grindSize: method.grindSize,
    brewTime: method.brewTime,
    temperature: method.temperatures[inputs.roastLevel],
    method,
  };
}

// Unit conversion utilities
export type VolumeUnit = {
  name: string;
  abbreviation: string;
  mlMultiplier: number;
};

export const VOLUME_UNITS: Record<string, VolumeUnit> = {
  ml: { name: "Milliliters", abbreviation: "ml", mlMultiplier: 1 },
  cups: { name: "Cups", abbreviation: "cups", mlMultiplier: 236.588 },
  oz: { name: "Fluid Ounces", abbreviation: "fl oz", mlMultiplier: 29.5735 },
};

export function convertVolume(
  amount: number,
  fromUnit: string,
  toUnit: string
): number {
  const fromMultiplier = VOLUME_UNITS[fromUnit]?.mlMultiplier || 1;
  const toMultiplier = VOLUME_UNITS[toUnit]?.mlMultiplier || 1;

  const mlAmount = amount * fromMultiplier;
  return Math.round((mlAmount / toMultiplier) * 100) / 100; // Round to 2 decimals
}

export function formatCoffeeAmount(grams: number): string {
  const tablespoons = Math.round((grams / 6) * 10) / 10; // Rough conversion: 1 tbsp ≈ 6g coffee
  return `${grams}g (${tablespoons} tbsp)`;
}

// Helper to get display labels for strength levels
export const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  mild: "Mild",
  average: "Medium",
  robust: "Robust",
};

export function getStrengthLabel(strength: StrengthLevel): string {
  return STRENGTH_LABELS[strength];
}

// Common volume presets
export const COMMON_VOLUMES = [
  { label: "1 Cup", ml: 237, cups: 1, oz: 8 },
  { label: "2 Cups", ml: 474, cups: 2, oz: 16 },
  { label: "3 Cups", ml: 711, cups: 3, oz: 24 },
  { label: "4 Cups", ml: 948, cups: 4, oz: 32 },
  { label: "6 Cups", ml: 1422, cups: 6, oz: 48 },
  { label: "8 Cups", ml: 1896, cups: 8, oz: 64 },
  { label: "Single Serve (250ml)", ml: 250, cups: 1.05, oz: 8.5 },
  { label: "Large Mug (350ml)", ml: 350, cups: 1.5, oz: 12 },
  { label: "Thermos (500ml)", ml: 500, cups: 2.1, oz: 17 },
];

// Export default methods array for dropdowns
export const BREWING_METHODS_ARRAY = Object.values(BREWING_METHODS);
