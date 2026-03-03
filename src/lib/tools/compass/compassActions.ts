// src/lib/tools/compass/compassActions.ts
import {
  ActionRecommendation,
  CompassBucket,
  CompassMethodKey,
} from "./compassTypes";

type ActionMatrix = Record<CompassBucket, ActionRecommendation>;

const pourOverDefaults: ActionMatrix = {
  UNDER: {
    primary: "Grind finer",
    secondary: "Increase water temperature",
  },
  OVER: {
    primary: "Grind coarser",
    secondary: "Lower water temperature",
  },
  WEAK: {
    primary: "Use more coffee (stronger ratio)",
    secondary: "Increase agitation during pour",
  },
  STRONG: {
    primary: "Use more water (weaker ratio)",
    secondary: "Grind coarser",
  },
  UNDER_WEAK: {
    primary: "Grind finer and increase ratio",
    secondary: "Increase water temperature",
  },
  UNDER_STRONG: {
    primary: "Grind finer and use more water",
    secondary: "Lower water temperature",
  },
  OVER_WEAK: {
    primary: "Grind coarser and use more coffee",
    secondary: "Increase steep time slightly",
  },
  OVER_STRONG: {
    primary: "Grind coarser and use more water",
    secondary: "Lower temperature / faster pour",
  },
  BALANCED: {
    primary: "Perfect extraction reached",
    secondary: "Maintain current parameters",
  },
};

const immersionDefaults: ActionMatrix = {
  UNDER: {
    primary: "Increase brew time",
    secondary: "Use hotter water",
  },
  OVER: {
    primary: "Reduce brew time",
    secondary: "Use cooler water",
  },
  WEAK: {
    primary: "Use more coffee",
    secondary: "Agitate grounds mid-steep",
  },
  STRONG: {
    primary: "Use more water",
    secondary: "Reduce brew time",
  },
  UNDER_WEAK: {
    primary: "Increase brew time and coffee amount",
    secondary: "Increase temperature",
  },
  UNDER_STRONG: {
    primary: "Increase brew time and use more water",
    secondary: "Lower temperature",
  },
  OVER_WEAK: {
    primary: "Reduce brew time and use more coffee",
    secondary: "Grind coarser",
  },
  OVER_STRONG: {
    primary: "Reduce brew time and use more water",
    secondary: "Grind coarser",
  },
  BALANCED: {
    primary: "Perfect extraction reached",
    secondary: "Maintain current parameters",
  },
};

const espressoDefaults: ActionMatrix = {
  UNDER: {
    primary: "Grind finer to slow the shot and extend extraction",
    secondary: "Increase brew temperature by 1–2°C",
  },
  OVER: {
    primary: "Grind coarser to speed up flow and shorten extraction time",
    secondary: "Lower brew temperature by 1–2°C",
  },
  WEAK: {
    primary: "Increase dose (add 1–2g of coffee)",
    secondary: "Shorten yield — aim for a shorter ratio (e.g. 1:1.5 ristretto)",
  },
  STRONG: {
    primary: "Increase yield — pull a longer shot (e.g. 1:2.5–3)",
    secondary: "Decrease dose slightly",
  },
  UNDER_WEAK: {
    primary: "Grind finer and increase dose",
    secondary: "Increase temperature by 2°C",
  },
  UNDER_STRONG: {
    primary: "Grind finer — shot is fast and thin, needs slower extraction",
    secondary: "Shorten yield to concentrate",
  },
  OVER_WEAK: {
    primary: "Grind coarser and increase dose",
    secondary: "Extend yield — pull a longer shot",
  },
  OVER_STRONG: {
    primary: "Grind coarser to open up flow and reduce extraction",
    secondary: "Increase yield (longer ratio dilutes intensity)",
  },
  BALANCED: {
    primary: "Dialed in — shot is balanced",
    secondary: "Lock in your parameters and repeat",
  },
};

const aeropressDefaults: ActionMatrix = {
  ...immersionDefaults,
  UNDER: {
    primary: "Increase steep time",
    secondary: "Press slower",
  },
  OVER: {
    primary: "Reduce steep time",
    secondary: "Press faster or stop before hiss",
  },
};

const southIndianFilterDefaults: ActionMatrix = {
  UNDER: {
    primary: "Pack grounds tighter",
    secondary: "Use hotter water",
  },
  OVER: {
    primary: "Pack grounds looser",
    secondary: "Use slightly coarser coffee",
  },
  WEAK: {
    primary: "Use more coffee powder",
    secondary: "Wait longer for drip to complete",
  },
  STRONG: {
    primary: "Use less decoction or more milk",
    secondary: "Add more hot milk/water",
  },
  UNDER_WEAK: {
    primary: "Pack tighter and use more coffee",
    secondary: "Boil water longer",
  },
  UNDER_STRONG: {
    primary: "Pack tighter and use more water",
    secondary: "Wait longer",
  },
  OVER_WEAK: {
    primary: "Pack looser and use more coffee",
    secondary: "Check grind size",
  },
  OVER_STRONG: {
    primary: "Pack looser and use less coffee",
    secondary: "Add more milk to finish",
  },
  BALANCED: {
    primary: "Strong decoction achieved",
    secondary: "Perfect with hot frothed milk",
  },
};

export const methodActions: Record<CompassMethodKey, ActionMatrix> = {
  pour_over: pourOverDefaults,
  v60: pourOverDefaults,
  chemex: {
    ...pourOverDefaults,
    UNDER: {
      primary: "Grind finer / slower pour",
      secondary: "Increase temperature",
    },
  },
  kalita_wave: pourOverDefaults,
  aeropress: aeropressDefaults,
  french_press: immersionDefaults,
  immersion: immersionDefaults,
  cold_brew: {
    ...immersionDefaults,
    UNDER: {
      primary: "Increase steep time (up to 24h)",
      secondary: "Stir grounds initially",
    },
    OVER: {
      primary: "Reduce steep time",
      secondary: "Check water ratio",
    },
  },
  south_indian_filter: southIndianFilterDefaults,
  espresso: espressoDefaults,
  moka_pot: {
    ...immersionDefaults,
    UNDER: {
      primary: "Use warmer starting water",
      secondary: "Reduce heat intensity",
    },
    OVER: {
      primary: "Remove from heat earlier",
      secondary: "Cool base immediately after gurgle",
    },
  },
};

export const unevenExtractionActions: ActionRecommendation = {
  primary: "Improve pour consistency / reduce channeling",
  secondary: "Use better distribution / reduce agitation spikes",
};
