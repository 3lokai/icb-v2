// src/lib/tools/compass/compassSymptoms.ts
import { CompassSymptomKey, SymptomMapping } from "./compassTypes";

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
