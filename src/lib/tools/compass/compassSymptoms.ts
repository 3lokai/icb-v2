// src/lib/tools/compass/compassSymptoms.ts
import {
  CompassSymptomKey,
  SymptomMapping,
  SymptomMetadata,
} from "./compassTypes";

export const symptomMap: Record<CompassSymptomKey, SymptomMapping> = {
  // Under-extracted (Sour side)
  sour: { extraction: -2, strength: 0 },
  sharp: { extraction: -1, strength: 0 },
  acidic: { extraction: -1, strength: 0 },
  vegetal: { extraction: -2, strength: 0 },
  salty: { extraction: -2, strength: 0 },
  hollow: { extraction: -1, strength: -1 },
  thin_sour: { extraction: -1, strength: -1 },

  // Over-extracted (Bitter side)
  bitter: { extraction: 2, strength: 0 },
  harsh: { extraction: 2, strength: 1 },
  astringent: { extraction: 2, strength: 1 },
  dry: { extraction: 1, strength: 0 },
  chalky: { extraction: 1, strength: 0 },
  woody: { extraction: 2, strength: 0 },
  smoky: { extraction: 2, strength: 0 },

  // Weak side
  watery: { extraction: 0, strength: -2 },
  thin: { extraction: -1, strength: -2 },
  weak: { extraction: 0, strength: -2 },
  tea_like: { extraction: -1, strength: -1 },

  // Strong side
  too_strong: { extraction: 1, strength: 2 },
  heavy: { extraction: 0, strength: 2 },
  muddy: { extraction: 1, strength: 2 },
  intense: { extraction: 1, strength: 1 },

  // Temperature / Diagnostic
  flat: { extraction: -1, strength: 0, tempHint: "increase" },
  dull: { extraction: -1, strength: 0, tempHint: "increase" },
  lifeless: { extraction: -1, strength: 0, tempHint: "increase" },

  // Special
  sour_and_bitter: { extraction: 0, strength: 0, flag: "uneven" },
};

export const symptomMetadata: SymptomMetadata[] = [
  // Primary - Acidity
  { key: "sour", label: "Sour", category: "acidic", isPrimary: true },
  { key: "sharp", label: "Sharp", category: "acidic", isPrimary: true },
  { key: "vegetal", label: "Vegetal", category: "acidic", isPrimary: true },

  // Primary - Bitter
  { key: "bitter", label: "Bitter", category: "bitter", isPrimary: true },
  {
    key: "astringent",
    label: "Astringent",
    category: "bitter",
    isPrimary: true,
  },
  { key: "dry", label: "Dry", category: "bitter", isPrimary: true },

  // Primary - Strength (Weak)
  { key: "watery", label: "Watery", category: "weak", isPrimary: true },
  { key: "thin", label: "Thin", category: "weak", isPrimary: true },
  { key: "weak", label: "Weak", category: "weak", isPrimary: true },

  // Primary - Strength (Strong)
  {
    key: "too_strong",
    label: "Too Strong",
    category: "strong",
    isPrimary: true,
  },
  { key: "heavy", label: "Heavy", category: "strong", isPrimary: true },

  // Secondary / Advanced
  { key: "acidic", label: "Acidic", category: "acidic", isPrimary: false },
  { key: "salty", label: "Salty", category: "acidic", isPrimary: false },
  { key: "hollow", label: "Hollow", category: "acidic", isPrimary: false },
  {
    key: "thin_sour",
    label: "Thin Sour",
    category: "acidic",
    isPrimary: false,
  },
  { key: "harsh", label: "Harsh", category: "bitter", isPrimary: false },
  { key: "chalky", label: "Chalky", category: "bitter", isPrimary: false },
  { key: "woody", label: "Woody", category: "bitter", isPrimary: false },
  { key: "smoky", label: "Smoky", category: "bitter", isPrimary: false },
  { key: "tea_like", label: "Tea-like", category: "weak", isPrimary: false },
  { key: "muddy", label: "Muddy", category: "strong", isPrimary: false },
  { key: "intense", label: "Intense", category: "strong", isPrimary: false },
  { key: "flat", label: "Flat", category: "diagnostic", isPrimary: false },
  { key: "dull", label: "Dull", category: "diagnostic", isPrimary: false },
  {
    key: "lifeless",
    label: "Lifeless",
    category: "diagnostic",
    isPrimary: false,
  },

  // Secret/Special Primary
  {
    key: "sour_and_bitter",
    label: "Sour & Bitter",
    category: "diagnostic",
    isPrimary: true,
  },
];
