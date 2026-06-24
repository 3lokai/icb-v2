// src/lib/tools/grind-guide.ts
//
// Data + conversion logic for the Grind Size Converter tool.
//
// Model (reverse-engineered from the Honest Coffee Guide grind-size widget):
//   - The grind universe is a fixed micron axis [0, 1400].
//   - Each brew method is a micron band on that axis.
//   - Each grinder stores only the micron span its setting range covers
//     (micronMin..micronMax) plus its setting scale. Settings ↔ microns are
//     LINEARLY INTERPOLATED — there is no per-click calibration table, so the
//     numbers below are sensible starting points, not exact factory values.

export const MICRON_AXIS_MIN = 0;
export const MICRON_AXIS_MAX = 1400;

// ─── Grind categories (fixed 200µm bands over the axis) ──────────────────────

export type GrindCategory =
  | "extra-fine"
  | "fine"
  | "medium-fine"
  | "medium"
  | "medium-coarse"
  | "coarse"
  | "extra-coarse";

export interface GrindCategoryBand {
  key: GrindCategory;
  label: string;
  micronMin: number;
  micronMax: number;
}

export const GRIND_CATEGORIES: GrindCategoryBand[] = [
  { key: "extra-fine", label: "Extra Fine", micronMin: 0, micronMax: 200 },
  { key: "fine", label: "Fine", micronMin: 200, micronMax: 400 },
  { key: "medium-fine", label: "Medium Fine", micronMin: 400, micronMax: 600 },
  { key: "medium", label: "Medium", micronMin: 600, micronMax: 800 },
  {
    key: "medium-coarse",
    label: "Medium Coarse",
    micronMin: 800,
    micronMax: 1000,
  },
  { key: "coarse", label: "Coarse", micronMin: 1000, micronMax: 1200 },
  {
    key: "extra-coarse",
    label: "Extra Coarse",
    micronMin: 1200,
    micronMax: 1400,
  },
];

// ─── Brew methods (canonical micron bands) ───────────────────────────────────

export interface BrewMethodGrind {
  key: string;
  name: string;
  micronMin: number;
  micronMax: number;
}

export const BREW_METHODS: BrewMethodGrind[] = [
  { key: "turkish", name: "Turkish", micronMin: 40, micronMax: 220 },
  { key: "espresso", name: "Espresso", micronMin: 180, micronMax: 380 },
  { key: "mokapot", name: "Moka Pot", micronMin: 360, micronMax: 660 },
  { key: "v60", name: "V60", micronMin: 400, micronMax: 700 },
  { key: "aeropress", name: "AeroPress", micronMin: 320, micronMax: 960 },
  { key: "pourover", name: "Pour Over", micronMin: 410, micronMax: 930 },
  { key: "siphon", name: "Siphon", micronMin: 375, micronMax: 800 },
  {
    key: "autodrip",
    name: "Filter Coffee Machine",
    micronMin: 300,
    micronMax: 900,
  },
  { key: "cupping", name: "Cupping", micronMin: 460, micronMax: 850 },
  { key: "frenchpress", name: "French Press", micronMin: 690, micronMax: 1300 },
  { key: "coldbrew", name: "Cold Brew", micronMin: 800, micronMax: 1400 },
  { key: "colddrip", name: "Cold Drip", micronMin: 820, micronMax: 1270 },
];

// ─── Grinders (India-available focus) ────────────────────────────────────────
//
// `style` controls how a numeric setting position is rendered:
//   "clicks"   → whole click count from zero (e.g. "18 clicks")
//   "numbered" → dial number (e.g. "23")
//   "rotation" → rotations + clicks (e.g. "2 rot · 15 clk"); needs perRotation
//   "compound" → number.click (e.g. "4.5"); needs perRotation (clicks per number)
//
// settingMin/settingMax are the displayed positions at the FINEST (micronMin)
// and COARSEST (micronMax) ends of the grinder's usable range.

export type GrinderStyle = "clicks" | "numbered" | "rotation" | "compound";

export interface Grinder {
  key: string;
  brand: string;
  model: string;
  label: string; // "Brand Model" for the selector
  units: string;
  style: GrinderStyle;
  settingMin: number;
  settingMax: number;
  perRotation?: number; // clicks per rotation / clicks per number
  micronMin: number;
  micronMax: number;
}

export const GRINDERS: Grinder[] = [
  {
    key: "timemore-c2",
    brand: "Timemore",
    model: "Chestnut C2",
    label: "Timemore Chestnut C2",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 12,
    micronMin: 0,
    micronMax: 1400,
  },
  {
    key: "timemore-c3",
    brand: "Timemore",
    model: "Chestnut C3",
    label: "Timemore Chestnut C3",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 30,
    micronMin: 0,
    micronMax: 950,
  },
  {
    key: "timemore-078",
    brand: "Timemore",
    model: "Sculptor 078",
    label: "Timemore Sculptor 078",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 30,
    micronMin: 0,
    micronMax: 825,
  },
  {
    key: "1zpresso-q2",
    brand: "1Zpresso",
    model: "Q2 (Heptagonal)",
    label: "1Zpresso Q2 (Heptagonal)",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 90,
    micronMin: 135,
    micronMax: 870,
  },
  {
    key: "1zpresso-jx-s",
    brand: "1Zpresso",
    model: "JX-S",
    label: "1Zpresso JX-S",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 28,
    micronMin: 0,
    micronMax: 1400,
  },
  {
    key: "1zpresso-jmax",
    brand: "1Zpresso",
    model: "J-Max",
    label: "1Zpresso J-Max",
    units: "Rotations + clicks (40 clicks / rotation)",
    style: "rotation",
    settingMin: 0,
    settingMax: 200,
    perRotation: 40,
    micronMin: 0,
    micronMax: 915,
  },
  {
    key: "hario-skerton-pro",
    brand: "Hario",
    model: "Skerton Pro",
    label: "Hario Skerton Pro",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 1,
    settingMax: 20,
    micronMin: 200,
    micronMax: 1400,
  },
  {
    key: "hario-mini-mill",
    brand: "Hario",
    model: "Mini Mill Plus",
    label: "Hario Mini Mill Plus",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 1,
    settingMax: 14,
    micronMin: 230,
    micronMax: 1420,
  },
  {
    key: "baratza-encore",
    brand: "Baratza",
    model: "Encore",
    label: "Baratza Encore",
    units: "Numbered dial",
    style: "numbered",
    settingMin: 0,
    settingMax: 40,
    micronMin: 0,
    micronMax: 1240,
  },
  {
    key: "baratza-encore-esp",
    brand: "Baratza",
    model: "Encore ESP",
    label: "Baratza Encore ESP",
    units: "Number.click (10 clicks / number)",
    style: "compound",
    settingMin: 0,
    settingMax: 90,
    perRotation: 10,
    micronMin: 240,
    micronMax: 1050,
  },
  {
    key: "generic",
    brand: "Generic",
    model: "Numbered grinder (1–40)",
    label: "Generic numbered grinder (1–40)",
    units: "Numbered dial",
    style: "numbered",
    settingMin: 1,
    settingMax: 40,
    micronMin: 0,
    micronMax: 1400,
  },
];

// ─── Lookups ─────────────────────────────────────────────────────────────────

export function getBrewMethod(key: string): BrewMethodGrind | undefined {
  return BREW_METHODS.find((m) => m.key === key);
}

export function getGrinder(key: string): Grinder | undefined {
  return GRINDERS.find((g) => g.key === key);
}

export function categoryForMicron(micron: number): GrindCategoryBand {
  const clamped = Math.min(
    MICRON_AXIS_MAX - 1,
    Math.max(MICRON_AXIS_MIN, micron)
  );
  return (
    GRIND_CATEGORIES.find(
      (c) => clamped >= c.micronMin && clamped < c.micronMax
    ) ?? GRIND_CATEGORIES[GRIND_CATEGORIES.length - 1]
  );
}

/** Category label spanning a method's whole band (e.g. "Medium Fine – Medium"). */
export function categoryLabelForRange(min: number, max: number): string {
  const lo = categoryForMicron(min);
  const hi = categoryForMicron(max);
  return lo.key === hi.key ? lo.label : `${lo.label} – ${hi.label}`;
}

// ─── Conversion (linear interpolation, mirrors the source widget) ────────────

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * Continuous setting position for a target micron value, linearly interpolated
 * across the grinder's usable range and clamped to it.
 */
export function settingPositionForMicron(g: Grinder, micron: number): number {
  if (g.micronMax === g.micronMin) {
    return g.settingMin;
  }
  const t = (micron - g.micronMin) / (g.micronMax - g.micronMin);
  const raw = g.settingMin + clamp(t, 0, 1) * (g.settingMax - g.settingMin);
  return clamp(raw, g.settingMin, g.settingMax);
}

/** Render a numeric setting position in the grinder's native units. */
export function formatSetting(g: Grinder, position: number): string {
  switch (g.style) {
    case "rotation": {
      const per = g.perRotation ?? 40;
      const total = Math.round(position);
      const rot = Math.floor(total / per);
      const clk = total % per;
      return `${rot} rot · ${clk} clk`;
    }
    case "compound": {
      const per = g.perRotation ?? 10;
      const total = Math.round(position);
      const whole = Math.floor(total / per);
      const frac = total % per;
      return `${whole}.${frac}`;
    }
    case "clicks":
      return `${Math.round(position)} clicks`;
    default:
      return `${Math.round(position)}`;
  }
}

export interface GrindResult {
  /** Method band sits entirely outside what this grinder can reach. */
  outOfRange: boolean;
  /** Method band is only partially reachable (clamped). */
  partial: boolean;
  minLabel: string;
  maxLabel: string;
  /** Combined display, e.g. "12–18 clicks" or "12 clicks". */
  rangeLabel: string;
}

/**
 * The grinder setting range that lands a given brew method's grind, with
 * out-of-range / partial flags so the UI can be honest about reachability.
 */
export function settingRangeForMethod(
  g: Grinder,
  m: BrewMethodGrind
): GrindResult {
  const outOfRange = m.micronMax < g.micronMin || m.micronMin > g.micronMax;
  const partial =
    !outOfRange && (m.micronMin < g.micronMin || m.micronMax > g.micronMax);

  const lo = settingPositionForMicron(g, m.micronMin);
  const hi = settingPositionForMicron(g, m.micronMax);
  const minLabel = formatSetting(g, lo);
  const maxLabel = formatSetting(g, hi);

  // Collapse "12 clicks – 12 clicks" to a single value; keep the unit suffix.
  let rangeLabel: string;
  if (minLabel === maxLabel) {
    rangeLabel = minLabel;
  } else if (g.style === "clicks") {
    rangeLabel = `${Math.round(lo)}–${Math.round(hi)} clicks`;
  } else {
    rangeLabel = `${minLabel} – ${maxLabel}`;
  }

  return { outOfRange, partial, minLabel, maxLabel, rangeLabel };
}
