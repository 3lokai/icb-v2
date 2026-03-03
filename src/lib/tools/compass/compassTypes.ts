// src/lib/tools/compass/compassTypes.ts

export type RoastLevel = "light" | "medium" | "dark";

export type CompassMethodKey =
  | "pour_over"
  | "aeropress"
  | "french_press"
  | "immersion"
  | "chemex"
  | "v60"
  | "kalita_wave"
  | "south_indian_filter"
  | "cold_brew"
  | "espresso"
  | "moka_pot";

export type CompassBucket =
  | "UNDER"
  | "OVER"
  | "WEAK"
  | "STRONG"
  | "UNDER_WEAK"
  | "UNDER_STRONG"
  | "OVER_WEAK"
  | "OVER_STRONG"
  | "BALANCED";

export type CompassSymptomKey =
  | "sour"
  | "sharp"
  | "acidic"
  | "vegetal"
  | "salty"
  | "hollow"
  | "thin_sour"
  | "bitter"
  | "harsh"
  | "astringent"
  | "dry"
  | "chalky"
  | "woody"
  | "smoky"
  | "watery"
  | "thin"
  | "weak"
  | "tea_like"
  | "too_strong"
  | "heavy"
  | "muddy"
  | "intense"
  | "flat"
  | "dull"
  | "lifeless"
  | "sour_and_bitter";

export interface SymptomMapping {
  extraction: number;
  strength: number;
  flag?: "uneven";
  tempHint?: "increase" | "decrease";
}

export interface CompassInput {
  symptoms: CompassSymptomKey[];
  method: CompassMethodKey;
  roast?: RoastLevel;
  temp?: number; // In Celsius
  ratio?: number; // 1:X (e.g., 15 for 1:15)
}

export interface ActionRecommendation {
  primary: string;
  secondary: string;
}

export interface CompassResult {
  extractionScore: number;
  strengthScore: number;
  angle: number; // 0-360 degrees
  bucket: CompassBucket;
  primaryAction: string;
  secondaryAction: string;
  notes: string[];
  confidence: number;
  flags: string[];
  /** Human-readable direction back to center, e.g. "Extract more + use less coffee" */
  recommendedMoveVector: string;
}

export interface SymptomMetadata {
  key: CompassSymptomKey;
  label: string;
  category: "acidic" | "bitter" | "weak" | "strong" | "diagnostic";
  isPrimary: boolean;
}
