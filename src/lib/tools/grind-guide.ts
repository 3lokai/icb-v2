// src/lib/tools/grind-guide.ts
//
// Data + conversion logic for the Grind Size Converter tool.
//
// Model (reverse-engineered from the Honest Coffee Guide grind-size widget):
//   - The grind universe is a fixed micron axis [0, 1400].
//   - Each brew method is a micron band on that axis.
//   - Each grinder stores the micron span its setting range covers
//     (micronMin..micronMax) plus its setting scale. Settings ↔ microns are
//     LINEARLY INTERPOLATED.
//
// Level 1 of the grinder database adds `brewRanges`: published, attributed
// per-method setting ranges. When one exists for the selected method it is used
// verbatim (manufacturer over Honest Coffee Guide); interpolation is only the
// fallback. Every grinder's setting scale and micron span below was re-derived
// from its Honest Coffee Guide page rather than guessed — see `sources`.
//
// Sourcing rule: `source: "manufacturer"` and the `adjustment` block are only
// ever populated from a manufacturer-controlled page. Review sites and
// aggregators are useful but are not manufacturers, and several of their widely
// repeated figures turned out to be wrong. Where the two disagree the conflict
// is recorded in a comment on the record rather than averaged away.

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
//   "numbered" → dial number, half steps allowed (e.g. "23", "6.5")
//   "rotation" → rotations + clicks (e.g. "2 rot · 15 clk"); needs perRotation
//   "compound" → rotation.click (e.g. "2.42"); needs perRotation
//   "triple"   → rotation.number.tick (e.g. "1.5.2"); 1Zpresso external dials.
//                needs perRotation (ticks per rotation) + perNumber
//
// For "compound" and "triple" the stored setting is always an ABSOLUTE count of
// the smallest increment from zero; the display splits it back up.
//
// settingMin/settingMax are the displayed positions at the FINEST (micronMin)
// and COARSEST (micronMax) ends of the grinder's usable range.

export type GrinderStyle =
  | "clicks"
  | "numbered"
  | "rotation"
  | "compound"
  | "triple";

/** A published setting range for one brew method on one grinder. */
export interface GrinderBrewRange {
  /** Key into `BREW_METHODS`. */
  method: string;
  settingMin: number;
  settingMax: number;
  source: "manufacturer" | "honest-coffee-guide";
  url?: string;
}

/**
 * Manufacturer-published adjustment mechanics. Descriptive only — nothing in
 * the conversion path reads this yet. `source` is required and must be a
 * manufacturer-controlled URL: if the only citation available is a review site,
 * the spec does not belong here.
 */
export interface GrinderAdjustmentSpec {
  /** Official clicks (or ticks) per full rotation of the adjuster. */
  stepsPerRotation?: number;
  /** Official steps per numbered mark, where the dial has them. */
  stepsPerNumber?: number;
  /** Official burr movement per step, in microns. */
  micronsPerStep?: number;
  rpm?: {
    type: "manual" | "fixed" | "variable";
    min?: number;
    max?: number;
  };
  source: string;
}

export interface Grinder {
  key: string;
  brand: string;
  model: string;
  label: string; // "Brand Model" for the selector
  units: string;
  style: GrinderStyle;
  settingMin: number;
  settingMax: number;
  perRotation?: number; // clicks (or ticks) per rotation
  perNumber?: number; // ticks per numbered mark — "triple" only
  micronMin: number;
  micronMax: number;
  driveType?: "manual" | "electric";
  adjustment?: GrinderAdjustmentSpec;
  /**
   * Models that share one published setting map. Members must have an
   * identical setting scale and identical `brewRanges` — enforced by test.
   */
  calibrationFamily?: string;
  /** Published per-method ranges. Absent method ⇒ fall back to interpolation. */
  brewRanges?: GrinderBrewRange[];
  /** URLs this record was built from. */
  sources?: string[];
  /**
   * Confidence in the record as a whole:
   *   high   — manufacturer-published setting ranges
   *   medium — Honest Coffee Guide, or consistent reviewer consensus
   *   low    — setting scale inferred, no published per-method ranges
   */
  confidence?: "high" | "medium" | "low";
}

// Every range below comes from the grinder's Honest Coffee Guide page, so the
// source + url are folded in here rather than repeated ~170 times.
const HCG = (
  slug: string,
  rows: Record<string, readonly [number, number]>
): GrinderBrewRange[] =>
  Object.entries(rows).map(([method, [settingMin, settingMax]]) => ({
    method,
    settingMin,
    settingMax,
    source: "honest-coffee-guide" as const,
    url: `https://honestcoffeeguide.com/${slug}-grind-settings/`,
  }));

const hcgUrl = (slug: string) =>
  `https://honestcoffeeguide.com/${slug}-grind-settings/`;

export const GRINDERS: Grinder[] = [
  {
    key: "timemore-c2",
    brand: "Timemore",
    model: "Chestnut C2",
    label: "Timemore Chestnut C2",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 30,
    micronMin: 0,
    micronMax: 950,
    driveType: "manual",
    confidence: "medium",
    sources: [hcgUrl("timemore-c2")],
    // HCG also warns: avoid settings below 6 clicks, they can dull the burrs.
    brewRanges: HCG("timemore-c2", {
      turkish: [2, 6],
      espresso: [6, 12],
      mokapot: [12, 20],
      v60: [13, 22],
      aeropress: [11, 30],
      pourover: [13, 29],
      siphon: [12, 25],
      autodrip: [10, 28],
      cupping: [15, 26],
      frenchpress: [22, 30],
      coldbrew: [26, 30],
      colddrip: [26, 30],
    }),
  },
  {
    key: "timemore-c3",
    brand: "Timemore",
    model: "Chestnut C3",
    label: "Timemore Chestnut C3",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 25,
    micronMin: 0,
    micronMax: 950,
    driveType: "manual",
    confidence: "medium",
    calibrationFamily: "timemore-c3",
    // Timemore publishes no clicks-per-rotation or micron-per-click figure for
    // the C3; the numbers that circulate come from reviewers, so no
    // `adjustment` block here.
    sources: [hcgUrl("timemore-c3")],
    brewRanges: HCG("timemore-c3", {
      turkish: [2, 5],
      espresso: [5, 10],
      mokapot: [10, 17],
      v60: [11, 18],
      aeropress: [9, 25],
      pourover: [11, 24],
      siphon: [10, 21],
      autodrip: [8, 23],
      cupping: [13, 22],
      frenchpress: [19, 25],
      coldbrew: [22, 25],
      colddrip: [22, 25],
    }),
  },
  {
    key: "timemore-c3s",
    brand: "Timemore",
    model: "Chestnut C3S",
    label: "Timemore Chestnut C3S",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 0,
    settingMax: 25,
    micronMin: 0,
    micronMax: 950,
    driveType: "manual",
    confidence: "medium",
    calibrationFamily: "timemore-c3",
    sources: [hcgUrl("timemore-c3s")],
    // HCG publishes an identical table to the C3 — same burr set, S-stem only.
    brewRanges: HCG("timemore-c3s", {
      turkish: [2, 5],
      espresso: [5, 10],
      mokapot: [10, 17],
      v60: [11, 18],
      aeropress: [9, 25],
      pourover: [11, 24],
      siphon: [10, 21],
      autodrip: [8, 23],
      cupping: [13, 22],
      frenchpress: [19, 25],
      coldbrew: [22, 25],
      colddrip: [22, 25],
    }),
  },
  {
    key: "timemore-078",
    brand: "Timemore",
    model: "Sculptor 078",
    label: "Timemore Sculptor 078",
    units: "Numbered dial (half steps)",
    style: "numbered",
    settingMin: 0,
    settingMax: 18,
    micronMin: 370,
    micronMax: 1270,
    driveType: "electric",
    confidence: "medium",
    sources: [hcgUrl("timemore-sculptor-078")],
    // No Turkish entry — the 078 does not grind fine enough to reach that band.
    brewRanges: HCG("timemore-sculptor-078", {
      espresso: [0, 0],
      mokapot: [0, 5.5],
      v60: [1, 6.5],
      aeropress: [0, 11.5],
      pourover: [1, 11],
      siphon: [0.5, 8.5],
      autodrip: [0, 10.5],
      cupping: [2, 9.5],
      frenchpress: [6.5, 18],
      coldbrew: [9, 18],
      colddrip: [9, 18],
    }),
  },
  {
    key: "1zpresso-q2",
    brand: "1Zpresso",
    model: "Q2 (Heptagonal)",
    label: "1Zpresso Q2 (Heptagonal)",
    units: "Rotation.number.tick (10 numbers / rotation, 3 ticks / number)",
    style: "triple",
    settingMin: 0,
    settingMax: 120,
    perRotation: 30,
    perNumber: 3,
    micronMin: 0,
    micronMax: 1360,
    driveType: "manual",
    confidence: "medium",
    // 1Zpresso: Q series internal adjustment — 30 clicks/rotation, 3 clicks per
    // number, 25µm/click. Confirms the scale derived from the HCG table.
    adjustment: {
      stepsPerRotation: 30,
      stepsPerNumber: 3,
      micronsPerStep: 25,
      rpm: { type: "manual" },
      source: "https://1zpresso.coffee/grind-setting/",
    },
    sources: [
      hcgUrl("1zpresso-q2-heptagonal-burrs"),
      "https://1zpresso.coffee/grind-setting/",
    ],
    // HCG prints these as r.n.t; stored as absolute ticks (r*30 + n*3 + t).
    brewRanges: HCG("1zpresso-q2-heptagonal-burrs", {
      turkish: [4, 19], // 0.1.1 – 0.6.1
      espresso: [16, 33], // 0.5.1 – 1.1.0
      mokapot: [32, 58], // 1.0.2 – 1.9.1
      v60: [36, 61], // 1.2.0 – 2.0.1
      aeropress: [29, 84], // 0.9.2 – 2.8.0
      pourover: [37, 82], // 1.2.1 – 2.7.1
      siphon: [34, 70], // 1.1.1 – 2.3.1
      autodrip: [27, 79], // 0.9.0 – 2.6.1
      cupping: [41, 75], // 1.3.2 – 2.5.0
      frenchpress: [61, 114], // 2.0.1 – 3.8.0
      coldbrew: [71, 120], // 2.3.2 – 4.0.0
      colddrip: [73, 112], // 2.4.1 – 3.7.1
    }),
  },
  {
    key: "1zpresso-jx",
    brand: "1Zpresso",
    model: "JX",
    label: "1Zpresso JX",
    units: "Rotation.number.tick (10 numbers / rotation, 3 ticks / number)",
    style: "triple",
    settingMin: 0,
    settingMax: 120,
    perRotation: 30,
    perNumber: 3,
    micronMin: 0,
    micronMax: 1080,
    driveType: "manual",
    confidence: "medium",
    calibrationFamily: "1zpresso-jx",
    // 1Zpresso: JX uses the internal-adjustment scale — 30 clicks/rotation,
    // 3 clicks per number, 25µm/click. Matches the scale derived from HCG.
    adjustment: {
      stepsPerRotation: 30,
      stepsPerNumber: 3,
      micronsPerStep: 25,
      rpm: { type: "manual" },
      source: "https://1zpresso.coffee/jx-vs-jxpro/",
    },
    sources: [hcgUrl("1zpresso-jx"), "https://1zpresso.coffee/jx-vs-jxpro/"],
    brewRanges: HCG("1zpresso-jx", {
      turkish: [5, 24], // 0.1.2 – 0.8.0
      espresso: [20, 42], // 0.6.2 – 1.4.0
      mokapot: [40, 73], // 1.3.1 – 2.4.1
      v60: [45, 77], // 1.5.0 – 2.5.2
      aeropress: [36, 106], // 1.2.0 – 3.5.1
      pourover: [46, 103], // 1.5.1 – 3.4.1
      siphon: [42, 88], // 1.4.0 – 2.9.1
      autodrip: [34, 100], // 1.1.1 – 3.3.1
      cupping: [52, 94], // 1.7.1 – 3.1.1
      frenchpress: [77, 120], // 2.5.2 – 4.0.0
      coldbrew: [89, 120], // 2.9.2 – 4.0.0
      colddrip: [92, 120], // 3.0.2 – 4.0.0
    }),
  },
  {
    key: "1zpresso-jx-s",
    brand: "1Zpresso",
    model: "JX-S",
    label: "1Zpresso JX-S",
    units: "Rotation.number.tick (10 numbers / rotation, 3 ticks / number)",
    style: "triple",
    settingMin: 0,
    settingMax: 120,
    perRotation: 30,
    perNumber: 3,
    micronMin: 0,
    micronMax: 1080,
    driveType: "manual",
    confidence: "low",
    calibrationFamily: "1zpresso-jx",
    sources: [hcgUrl("1zpresso-jx-s")],
    // Deliberately no `adjustment` block: 1Zpresso's own model list has JX,
    // JX-Pro and JX-Pro S but no plain "JX-S", and the two candidates use
    // different scales (JX 30 clicks/rotation @ 25µm vs JX-Pro S 40 @ 12.5µm).
    // HCG's JX-S table is byte-identical to its JX table, so this record is
    // treated as a JX clone until the model can be pinned down — hence
    // confidence "low". Do not attach manufacturer specs before resolving it.
    brewRanges: HCG("1zpresso-jx-s", {
      turkish: [5, 24],
      espresso: [20, 42],
      mokapot: [40, 73],
      v60: [45, 77],
      aeropress: [36, 106],
      pourover: [46, 103],
      siphon: [42, 88],
      autodrip: [34, 100],
      cupping: [52, 94],
      frenchpress: [77, 120],
      coldbrew: [89, 120],
      colddrip: [92, 120],
    }),
  },
  {
    key: "1zpresso-jmax",
    brand: "1Zpresso",
    model: "J-Max",
    label: "1Zpresso J-Max",
    units: "Rotation.number.tick (9 numbers / rotation, 10 ticks / number)",
    style: "triple",
    settingMin: 0,
    settingMax: 450,
    perRotation: 90,
    perNumber: 10,
    micronMin: 0,
    micronMax: 1190,
    driveType: "manual",
    confidence: "medium",
    // 1Zpresso: external adjustment — 90 clicks/rotation, 10 clicks per number,
    // 8.8µm/click. Confirms the scale derived from the HCG table.
    adjustment: {
      stepsPerRotation: 90,
      stepsPerNumber: 10,
      micronsPerStep: 8.8,
      rpm: { type: "manual" },
      source: "https://1zpresso.coffee/grind-setting/",
    },
    sources: [
      hcgUrl("1zpresso-j-max"),
      "https://1zpresso.coffee/grind-setting/",
    ],
    // Stored as absolute ticks (r*90 + n*10 + t).
    brewRanges: HCG("1zpresso-j-max", {
      turkish: [16, 83], // 0.1.6 – 0.8.3
      espresso: [69, 143], // 0.6.9 – 1.5.3
      mokapot: [137, 249], // 1.4.7 – 2.6.9
      v60: [152, 264], // 1.6.2 – 2.8.4
      aeropress: [122, 363], // 1.3.2 – 4.0.3
      pourover: [156, 351], // 1.6.6 – 3.8.1
      siphon: [142, 302], // 1.5.2 – 3.3.2
      autodrip: [114, 340], // 1.2.4 – 3.7.0
      cupping: [174, 321], // 1.8.4 – 3.5.1
      frenchpress: [261, 450], // 2.8.1 – 5.0.0
      coldbrew: [303, 450], // 3.3.3 – 5.0.0
      colddrip: [311, 450], // 3.4.1 – 5.0.0
    }),
  },
  {
    key: "kingrinder-k6",
    brand: "KINGrinder",
    model: "K6",
    label: "KINGrinder K6",
    units: "Rotation.click (60 clicks / rotation)",
    style: "compound",
    settingMin: 0,
    settingMax: 162,
    perRotation: 60,
    micronMin: 0,
    micronMax: 1350,
    driveType: "manual",
    confidence: "medium",
    // KINGrinder: 60 clicks/rotation, 16µm/click. The clicks/rotation confirms
    // the display scale, but the micron figure does NOT reconcile with HCG's
    // map: 16µm × 162 clicks ⇒ ~2600µm, while HCG measures the usable span at
    // 1350µm (~8.3µm/click). The HCG map is kept because it is internally
    // consistent and lands every brew band correctly; the nominal spec is
    // recorded here so the disagreement stays visible rather than averaged away.
    adjustment: {
      stepsPerRotation: 60,
      micronsPerStep: 16,
      rpm: { type: "manual" },
      source: "https://www.kingrinder.com/store/products/k6",
    },
    sources: [
      hcgUrl("kingrinder-k6"),
      "https://www.kingrinder.com/store/products/k6",
    ],
    // HCG prints these as rotation.click; stored as absolute clicks (r*60 + c).
    brewRanges: HCG("kingrinder-k6", {
      turkish: [5, 26], // 0.05 – 0.26
      espresso: [22, 45], // 0.22 – 0.45
      mokapot: [43, 78], // 0.43 – 1.18
      v60: [48, 82], // 0.48 – 1.22
      aeropress: [38, 113], // 0.38 – 1.53
      pourover: [49, 110], // 0.49 – 1.50
      siphon: [45, 94], // 0.45 – 1.34
      autodrip: [36, 106], // 0.36 – 1.46
      cupping: [55, 100], // 0.55 – 1.40
      frenchpress: [82, 154], // 1.22 – 2.34
      coldbrew: [95, 160], // 1.35 – 2.40
      colddrip: [98, 150], // 1.38 – 2.30
    }),
  },
  {
    key: "comandante-c40",
    brand: "Comandante",
    model: "C40 MK4",
    label: "Comandante C40 MK4",
    units: "Clicks from zero (40 clicks / rotation)",
    style: "clicks",
    settingMin: 0,
    settingMax: 40,
    perRotation: 40,
    micronMin: 0,
    micronMax: 1090,
    driveType: "manual",
    confidence: "medium",
    // ~30µm/click (15µm with the Red Clix axle) is widely quoted, but it could
    // not be traced to a Comandante-controlled page, so no `adjustment` block.
    sources: [hcgUrl("comandante-c40-mk4")],
    brewRanges: HCG("comandante-c40-mk4", {
      turkish: [2, 8],
      espresso: [7, 13],
      mokapot: [14, 24],
      v60: [15, 25],
      aeropress: [12, 35],
      pourover: [16, 34],
      siphon: [14, 29],
      autodrip: [12, 33],
      cupping: [17, 31],
      frenchpress: [26, 40],
      coldbrew: [30, 40],
      colddrip: [31, 40],
    }),
  },
  {
    key: "hario-skerton-pro",
    brand: "Hario",
    model: "Skerton Pro",
    label: "Hario Skerton Pro",
    units: "Notches from zero",
    style: "clicks",
    settingMin: 1,
    settingMax: 9,
    micronMin: 350,
    micronMax: 1400,
    driveType: "manual",
    confidence: "medium",
    sources: [hcgUrl("hario-skerton-pro")],
    // No Turkish entry — 350µm is as fine as the Skerton Pro goes.
    brewRanges: HCG("hario-skerton-pro", {
      espresso: [1, 1],
      mokapot: [2, 3],
      v60: [2, 3],
      aeropress: [1, 5],
      pourover: [2, 5],
      siphon: [2, 4],
      autodrip: [1, 5],
      cupping: [2, 4],
      frenchpress: [4, 8],
      coldbrew: [5, 9],
      colddrip: [5, 8],
    }),
  },
  {
    key: "hario-mini-mill",
    brand: "Hario",
    model: "Mini Mill Plus",
    label: "Hario Mini Mill Plus",
    units: "Clicks from zero",
    style: "clicks",
    settingMin: 1,
    settingMax: 20,
    micronMin: 200,
    micronMax: 1400,
    driveType: "manual",
    confidence: "medium",
    sources: [hcgUrl("hario-mini-mill-plus")],
    brewRanges: HCG("hario-mini-mill-plus", {
      turkish: [1, 1],
      espresso: [1, 3],
      mokapot: [4, 8],
      v60: [5, 8],
      aeropress: [3, 13],
      pourover: [5, 12],
      siphon: [4, 10],
      autodrip: [3, 12],
      cupping: [6, 11],
      frenchpress: [9, 18],
      coldbrew: [11, 20],
      colddrip: [11, 17],
    }),
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
    micronMin: 250,
    micronMax: 1200,
    driveType: "electric",
    confidence: "medium",
    // Baratza publishes 40 settings and a 250–1200µm range — an independent
    // confirmation of the span derived from HCG — plus 550 RPM. No official
    // per-method dial chart exists, so brewRanges stay HCG-sourced.
    // 40 dial positions, not 40 clicks per rotation — no stepsPerRotation.
    adjustment: {
      rpm: { type: "fixed", min: 550, max: 550 },
      source: "https://www.baratza.com/en-us/product/encore-zcg485",
    },
    sources: [
      hcgUrl("baratza-encore"),
      "https://www.baratza.com/en-us/product/encore-zcg485",
    ],
    // No Turkish entry, and HCG notes the Encore is not an espresso grinder —
    // the espresso row is the closest it reaches, not a recommendation.
    brewRanges: HCG("baratza-encore", {
      espresso: [0, 5],
      mokapot: [5, 17],
      v60: [7, 18],
      aeropress: [3, 29],
      pourover: [7, 28],
      siphon: [6, 23],
      autodrip: [3, 27],
      cupping: [9, 25],
      frenchpress: [19, 40],
      coldbrew: [24, 40],
      colddrip: [24, 40],
    }),
  },
  {
    key: "baratza-encore-esp",
    brand: "Baratza",
    model: "Encore ESP",
    label: "Baratza Encore ESP",
    units: "Numbered dial",
    style: "numbered",
    settingMin: 0,
    settingMax: 40,
    micronMin: 230,
    micronMax: 1380,
    driveType: "electric",
    confidence: "high",
    adjustment: {
      rpm: { type: "fixed", min: 550, max: 550 },
      source: "https://www.baratza.com/en-us/product/encoretm-esp-zcg495",
    },
    sources: [
      hcgUrl("baratza-encore-esp"),
      "https://www.baratza.com/en-us/product/encoretm-esp-zcg495",
      "https://www.baratza.com/en-us/blog/product-guides/dialing-in-espresso",
    ],
    brewRanges: [
      // Baratza publishes two bands rather than a per-method chart: the ESP is
      // "optimized for espresso from #1-20" and "produces excellent filter
      // grinds from #21-40". The filter band is recorded against the Filter
      // Coffee Machine method only — extending it to V60/pour over would be our
      // inference, not Baratza's.
      {
        method: "espresso",
        settingMin: 1,
        settingMax: 20,
        source: "manufacturer",
        url: "https://www.baratza.com/en-us/blog/product-guides/dialing-in-espresso",
      },
      {
        method: "autodrip",
        settingMin: 21,
        settingMax: 40,
        source: "manufacturer",
        url: "https://www.baratza.com/en-us/product/encoretm-esp-zcg495",
      },
      ...HCG("baratza-encore-esp", {
        espresso: [0, 13],
        mokapot: [12, 24],
        v60: [15, 25],
        aeropress: [8, 30],
        pourover: [16, 30],
        siphon: [13, 27],
        autodrip: [7, 29],
        cupping: [20, 28],
        frenchpress: [25, 38],
        coldbrew: [27, 40],
        colddrip: [28, 37],
      }),
    ],
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
    // Deliberately no brewRanges — this is the interpolation fallback grinder.
    confidence: "low",
  },
];

// ─── Lookups ─────────────────────────────────────────────────────────────────

/** Look up a brew method by its stable key (e.g. `"v60"`, `"espresso"`). */
export function getBrewMethod(key: string): BrewMethodGrind | undefined {
  return BREW_METHODS.find((m) => m.key === key);
}

/** Look up a grinder by its stable key (e.g. `"timemore-c2"`). */
export function getGrinder(key: string): Grinder | undefined {
  return GRINDERS.find((g) => g.key === key);
}

/**
 * The published setting range for a method, preferring the manufacturer over
 * the Honest Coffee Guide when both are recorded.
 */
export function publishedRangeForMethod(
  g: Grinder,
  methodKey: string
): GrinderBrewRange | undefined {
  const rows = g.brewRanges?.filter((r) => r.method === methodKey) ?? [];
  return rows.find((r) => r.source === "manufacturer") ?? rows[0];
}

/** Map a micron value to the fixed grind category band it falls in on the axis. */
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

/** Clamp a number to the inclusive range `[lo, hi]`. */
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

/** Micron estimate for a setting position — the inverse of the above. */
export function micronForSetting(g: Grinder, setting: number): number {
  if (g.settingMax === g.settingMin) {
    return g.micronMin;
  }
  const t =
    (clamp(setting, g.settingMin, g.settingMax) - g.settingMin) /
    (g.settingMax - g.settingMin);
  return g.micronMin + t * (g.micronMax - g.micronMin);
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
      // Pad so a 60-click rotation reads "0.05", not "0.5".
      const frac = String(total % per).padStart(String(per - 1).length, "0");
      return `${whole}.${frac}`;
    }
    case "triple": {
      const per = g.perRotation ?? 30; // ticks per rotation
      const perNum = g.perNumber ?? 3; // ticks per numbered mark
      const total = Math.round(position);
      const rem = total % per;
      return `${Math.floor(total / per)}.${Math.floor(rem / perNum)}.${rem % perNum}`;
    }
    case "clicks": {
      const n = Math.round(position);
      return `${n} click${n === 1 ? "" : "s"}`;
    }
    default:
      // Numbered dials are continuous — half steps are actionable, so keep them.
      return `${Math.round(position * 2) / 2}`;
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
  /** Where the range came from. */
  source: "manufacturer" | "honest-coffee-guide" | "estimated";
  sourceUrl?: string;
}

/** Join two formatted endpoints, collapsing an identical pair to one value. */
function rangeLabelFor(g: Grinder, lo: number, hi: number): string {
  const minLabel = formatSetting(g, lo);
  const maxLabel = formatSetting(g, hi);
  if (minLabel === maxLabel) {
    return minLabel;
  }
  // Keep the unit suffix once rather than on both ends.
  return g.style === "clicks"
    ? `${Math.round(lo)}–${Math.round(hi)} clicks`
    : `${minLabel} – ${maxLabel}`;
}

/**
 * The grinder setting range that lands a given brew method's grind.
 *
 * Prefers a published range for the method; falls back to interpolating the
 * method's micron band across the grinder's span, with out-of-range / partial
 * flags so the UI can be honest about reachability.
 */
export function settingRangeForMethod(
  g: Grinder,
  m: BrewMethodGrind
): GrindResult {
  const published = publishedRangeForMethod(g, m.key);
  if (published) {
    return {
      outOfRange: false,
      partial: false,
      minLabel: formatSetting(g, published.settingMin),
      maxLabel: formatSetting(g, published.settingMax),
      rangeLabel: rangeLabelFor(g, published.settingMin, published.settingMax),
      source: published.source,
      sourceUrl: published.url,
    };
  }

  const outOfRange = m.micronMax < g.micronMin || m.micronMin > g.micronMax;
  const partial =
    !outOfRange && (m.micronMin < g.micronMin || m.micronMax > g.micronMax);

  const lo = settingPositionForMicron(g, m.micronMin);
  const hi = settingPositionForMicron(g, m.micronMax);

  return {
    outOfRange,
    partial,
    minLabel: formatSetting(g, lo),
    maxLabel: formatSetting(g, hi),
    rangeLabel: rangeLabelFor(g, lo, hi),
    source: "estimated",
  };
}
