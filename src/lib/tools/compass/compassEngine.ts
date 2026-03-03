// src/lib/tools/compass/compassEngine.ts
import {
  CompassInput,
  CompassResult,
  CompassBucket,
  ActionRecommendation,
  CompassSymptomKey,
} from "./compassTypes";
import { symptomMap } from "./compassSymptoms";
import { methodActions, unevenExtractionActions } from "./compassActions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Compute extraction / strength scores.
 *
 * We use a WEIGHTED AVERAGE rather than a raw sum so that selecting 4-5 chips
 * doesn't collapse every result to the clamped wall at ±3. The average
 * preserves the directional signal; we then scale it back up to the full
 * [-3, 3] range before returning.
 *
 * Effective range stays [-3, 3] because the max weight for any single chip is
 * already 2 (and we only scale by 1.5x on top of the mean).
 */
export function computeScores(symptoms: CompassSymptomKey[]) {
  if (symptoms.length === 0) {
    return { extraction: 0, strength: 0, flags: [], tempHints: [] };
  }

  let rawExtraction = 0;
  let rawStrength = 0;
  const flags: string[] = [];
  const tempHints: ("increase" | "decrease")[] = [];

  symptoms.forEach((s) => {
    const map = symptomMap[s];
    if (!map) return;

    rawExtraction += map.extraction;
    rawStrength += map.strength;

    if (map.flag) flags.push(map.flag);
    if (map.tempHint) tempHints.push(map.tempHint);
  });

  // Weighted average — preserves signal whether user picks 1 chip or 12
  const count = symptoms.length;
  const avgExtraction = rawExtraction / count;
  const avgStrength = rawStrength / count;

  // Scale up: multiply by 1.5 to amplify signal, then clamp to [-3, 3].
  // This means a single strong chip (raw -2) → -2, but two aligned chips
  // average to -2 → scaled -3 (clamped), while three mixed chips might
  // average to -0.3 → scaled -0.45 (stays near centre).
  const extraction = clamp(avgExtraction * 1.5, -3, 3);
  const strength = clamp(avgStrength * 1.5, -3, 3);

  return { extraction, strength, flags, tempHints };
}

// ---------------------------------------------------------------------------
// Bucket
// ---------------------------------------------------------------------------

export function determineBucket(
  extraction: number,
  strength: number
): CompassBucket {
  const threshold = 0.5;

  if (Math.abs(extraction) <= threshold && Math.abs(strength) <= threshold) {
    return "BALANCED";
  }

  if (extraction < -threshold && strength < -threshold) return "UNDER_WEAK";
  if (extraction < -threshold && strength > threshold) return "UNDER_STRONG";
  if (extraction > threshold && strength < -threshold) return "OVER_WEAK";
  if (extraction > threshold && strength > threshold) return "OVER_STRONG";

  if (extraction < -threshold) return "UNDER";
  if (extraction > threshold) return "OVER";
  if (strength < -threshold) return "WEAK";
  if (strength > threshold) return "STRONG";

  return "BALANCED";
}

// ---------------------------------------------------------------------------
// Move vector
// ---------------------------------------------------------------------------

/**
 * Returns a plain-English directional instruction pointing back toward centre,
 * e.g. "Extract more + use less coffee". This is the BH-style compass arrow.
 */
function buildMoveVector(bucket: CompassBucket, isUneven: boolean): string {
  if (isUneven)
    return "Fix technique first — improve distribution and evenness";

  const vectors: Record<CompassBucket, string> = {
    UNDER: "Extract more (finer grind / higher temp / longer time)",
    OVER: "Extract less (coarser grind / lower temp / shorter time)",
    WEAK: "Use more coffee (stronger ratio)",
    STRONG: "Use less coffee or more water (weaker ratio)",
    UNDER_WEAK: "Extract more + use more coffee",
    UNDER_STRONG: "Extract more + use more water",
    OVER_WEAK: "Extract less + use more coffee",
    OVER_STRONG: "Extract less + use more water",
    BALANCED: "No adjustment needed — you're already in the zone",
  };

  return vectors[bucket];
}

// ---------------------------------------------------------------------------
// Core engine
// ---------------------------------------------------------------------------

export function computeCompass(input: CompassInput): CompassResult {
  const { symptoms, method, roast, temp, ratio } = input;
  const { extraction, strength, flags, tempHints } = computeScores(symptoms);

  // Wheel angle: top = sour/under, bottom = bitter/over
  // Map extraction → y-inverted (negative extraction = top), strength → x
  const rad = Math.atan2(-extraction, strength);
  let angle = (rad * 180) / Math.PI;
  if (angle < 0) angle += 360;

  const bucket = determineBucket(extraction, strength);

  // -------------------------------------------------------------------------
  // Uneven extraction detection
  // -------------------------------------------------------------------------
  // Triggered by: explicit "sour_and_bitter" chip OR mixed under/over symptoms
  const hasUnder = symptoms.some(
    (s) => symptomMap[s] && symptomMap[s].extraction < -0.5
  );
  const hasOver = symptoms.some(
    (s) => symptomMap[s] && symptomMap[s].extraction > 0.5
  );
  const isUneven = flags.includes("uneven") || (hasUnder && hasOver);

  let actions: ActionRecommendation =
    methodActions[method]?.[bucket] ?? methodActions.pour_over[bucket];

  const notes: string[] = [];

  if (isUneven) {
    actions = unevenExtractionActions;
    notes.push(
      "Mixed extraction signals detected — fix pour consistency and distribution before adjusting grind or ratio."
    );
  }

  // -------------------------------------------------------------------------
  // tempHints → surfaced in notes (fix: we were collecting and ignoring these)
  // -------------------------------------------------------------------------
  const uniqueHints = [...new Set(tempHints)];
  if (uniqueHints.includes("increase") && !isUneven) {
    notes.push(
      "Flat / dull flavour often signals water that's too cool — try increasing temperature."
    );
    // If the current action says nothing about temp, bump it into secondary advice
    if (
      !actions.primary.toLowerCase().includes("temp") &&
      !actions.secondary.toLowerCase().includes("temp")
    ) {
      actions = { ...actions, secondary: "Increase water temperature" };
    }
  }
  if (uniqueHints.includes("decrease") && !isUneven) {
    notes.push(
      "High extraction can be worsened by excessive heat — consider lowering temperature."
    );
  }

  // -------------------------------------------------------------------------
  // Roast-aware guardrails
  // -------------------------------------------------------------------------
  if (roast === "dark") {
    const suppressIncrease = (text: string) =>
      text.toLowerCase().includes("increase") &&
      (text.toLowerCase().includes("temp") ||
        text.toLowerCase().includes("temperature"));

    if (suppressIncrease(actions.primary)) {
      actions = {
        ...actions,
        primary: "Grind finer rather than increasing temperature",
      };
    }
    if (suppressIncrease(actions.secondary)) {
      actions = {
        ...actions,
        secondary: "Increase agitation rather than increasing temperature",
      };
    }
    notes.push(
      "Dark roast: high temps risk masking bitterness — keep within 88–92°C."
    );
  } else if (roast === "light") {
    if (bucket === "UNDER" || bucket === "UNDER_WEAK") {
      notes.push(
        "Light roast: target 94–100°C — these coffees need full heat for proper extraction."
      );
    }
  }

  // -------------------------------------------------------------------------
  // Parameter-aware adjustments (temp / ratio bounds)
  // -------------------------------------------------------------------------
  if (temp !== undefined) {
    if (temp >= 97) {
      const fix = (text: string) =>
        text.replace(
          /increase (water |brew |)temp(erature)?( by [\d–°C]+)?/gi,
          `grind finer (temp already at ${temp}°C, near ceiling)`
        );
      actions = {
        primary: fix(actions.primary),
        secondary: fix(actions.secondary),
      };
    } else if (temp <= 85) {
      const fix = (text: string) =>
        text.replace(
          /lower (water |brew |)temp(erature)?( by [\d–°C]+)?/gi,
          `grind coarser (temp already at ${temp}°C, near floor)`
        );
      actions = {
        primary: fix(actions.primary),
        secondary: fix(actions.secondary),
      };
    } else {
      // Specific suggestion: "+2°C (92 → 94)" style
      const fix = (text: string) => {
        if (
          text.toLowerCase().includes("increase") &&
          text.toLowerCase().includes("temp")
        ) {
          return text.replace(
            /increase (water |brew |)?temp(erature)?/gi,
            `increase temp (+2°C → ${temp + 2}°C)`
          );
        }
        if (
          text.toLowerCase().includes("lower") &&
          text.toLowerCase().includes("temp")
        ) {
          return text.replace(
            /lower (water |brew |)?temp(erature)?/gi,
            `lower temp (-2°C → ${temp - 2}°C)`
          );
        }
        return text;
      };
      actions = {
        primary: fix(actions.primary),
        secondary: fix(actions.secondary),
      };
    }
  }

  if (ratio !== undefined) {
    if (ratio <= 13 && (bucket === "STRONG" || bucket === "OVER_STRONG")) {
      notes.push(
        `Ratio is already very strong (1:${ratio.toFixed(0)}) — try adjusting grind before changing dose.`
      );
    }
    if (ratio >= 19 && (bucket === "WEAK" || bucket === "UNDER_WEAK")) {
      notes.push(
        `Ratio is already very lean (1:${ratio.toFixed(0)}) — add more coffee rather than just adjusting grind.`
      );
    }
  }

  // -------------------------------------------------------------------------
  // Confidence
  // -------------------------------------------------------------------------
  // Base confidence starts higher, boosted by more symptoms and coffee selection
  const count = symptoms.length;

  // Base confidence: starts at 0.65 for 1 symptom, scales up with more
  const baseConfidence = Math.min(0.65 + (count - 1) * 0.1, 0.95);

  // Consistency penalty for conflicting signals
  let consistency = 1.0;
  if (isUneven) consistency = 0.6;

  // Boost when coffee is selected (roast info makes advice more tailored)
  const coffeeBoost = roast ? 0.1 : 0;

  // Hint to select coffee for better results
  if (!roast && !isUneven) {
    notes.push(
      "Tip: Select a coffee above for roast-specific recommendations."
    );
  }

  const confidence = clamp(
    (baseConfidence + coffeeBoost) * consistency,
    0.1,
    1.0
  );

  return {
    extractionScore: Math.round(extraction * 100) / 100,
    strengthScore: Math.round(strength * 100) / 100,
    angle: Math.round(angle),
    bucket,
    primaryAction: actions.primary,
    secondaryAction: actions.secondary,
    notes,
    confidence: Math.round(confidence * 100) / 100,
    flags: [...new Set([...flags, ...(isUneven ? ["uneven"] : [])])],
    recommendedMoveVector: buildMoveVector(bucket, isUneven),
  };
}
