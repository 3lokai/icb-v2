// src/lib/tools/compass/wheelSegments.ts
// Defines every segment on the compass wheel with its angular position.
// Angles: 0° = top (12 o'clock), clockwise positive.
// Segments within a ring must not overlap — gaps of ~2° separate them.

export type SegmentRing = "outer" | "middle" | "inner";
export type SegmentQuadrant =
  | "under"
  | "over"
  | "weak"
  | "strong"
  | "diagnostic"
  | "positive";

export interface WheelSegment {
  key: string;
  label: string;
  angle: number; // center angle (0=top, CW)
  span: number; // arc width in degrees
  ring: SegmentRing;
  quadrant: SegmentQuadrant;
  clickable: boolean;
}

// Quadrant fill colours (Tailwind hex values — resolved from design tokens)
export const QUADRANT_COLORS: Record<
  SegmentQuadrant,
  { fill: string; text: string }
> = {
  under: { fill: "#fbbf24", text: "#92400e" }, // amber
  over: { fill: "#f87171", text: "#7f1d1d" }, // rose
  weak: { fill: "#60a5fa", text: "#1e3a5f" }, // blue
  strong: { fill: "#c084fc", text: "#4c1d95" }, // purple
  diagnostic: { fill: "#94a3b8", text: "#1e293b" }, // slate
  positive: { fill: "#4ade80", text: "#14532d" }, // green
};

export const MIDDLE_RING_OPACITY = 0.55;
export const OUTER_RING_OPACITY = 0.8;
export const INNER_RING_OPACITY = 0.25;

// ---------------------------------------------------------------------------
// Segment layout
// Each group is spaced so no adjacent segments overlap.
// ---------------------------------------------------------------------------

export const WHEEL_SEGMENTS: WheelSegment[] = [
  // ── OUTER RING (r 196–262) ── problem chips, high severity
  // Quadrant boundaries: Under 315°-45°, Strong 45°-135°, Over 135°-225°, Weak 225°-315°

  // Under (centered at 0°, range ~315°-45°)
  {
    key: "sour",
    label: "Sour",
    angle: 0,
    span: 24,
    ring: "outer",
    quadrant: "under",
    clickable: true,
  },
  {
    key: "vegetal",
    label: "Vegetal",
    angle: 26,
    span: 18,
    ring: "outer",
    quadrant: "under",
    clickable: true,
  },
  {
    key: "salty",
    label: "Salty",
    angle: 336,
    span: 18,
    ring: "outer",
    quadrant: "under",
    clickable: true,
  },

  // Under+Strong diagonal (45° zone)
  {
    key: "intense",
    label: "Intense",
    angle: 52,
    span: 16,
    ring: "outer",
    quadrant: "strong",
    clickable: true,
  },

  // Strong (centered at 90°, range ~45°-135°)
  {
    key: "muddy",
    label: "Muddy",
    angle: 75,
    span: 16,
    ring: "outer",
    quadrant: "strong",
    clickable: true,
  },
  {
    key: "heavy",
    label: "Heavy",
    angle: 95,
    span: 18,
    ring: "outer",
    quadrant: "strong",
    clickable: true,
  },
  {
    key: "too_strong",
    label: "Too Strong",
    angle: 118,
    span: 20,
    ring: "outer",
    quadrant: "strong",
    clickable: true,
  },

  // Over+Strong diagonal (135° zone)
  {
    key: "astringent",
    label: "Astringent",
    angle: 145,
    span: 20,
    ring: "outer",
    quadrant: "over",
    clickable: true,
  },

  // Over (centered at 180°, range ~135°-225°)
  {
    key: "harsh",
    label: "Harsh",
    angle: 170,
    span: 18,
    ring: "outer",
    quadrant: "over",
    clickable: true,
  },
  {
    key: "bitter",
    label: "Bitter",
    angle: 192,
    span: 22,
    ring: "outer",
    quadrant: "over",
    clickable: true,
  },
  {
    key: "smoky",
    label: "Smoky",
    angle: 216,
    span: 16,
    ring: "outer",
    quadrant: "over",
    clickable: true,
  },

  // Over+Weak diagonal (225° zone)
  {
    key: "watery",
    label: "Watery",
    angle: 238,
    span: 18,
    ring: "outer",
    quadrant: "weak",
    clickable: true,
  },

  // Weak (centered at 270°, range ~225°-315°)
  {
    key: "weak",
    label: "Weak",
    angle: 262,
    span: 18,
    ring: "outer",
    quadrant: "weak",
    clickable: true,
  },
  {
    key: "thin",
    label: "Thin",
    angle: 284,
    span: 18,
    ring: "outer",
    quadrant: "weak",
    clickable: true,
  },

  // Under+Weak diagonal (315° zone)
  {
    key: "hollow",
    label: "Hollow",
    angle: 308,
    span: 16,
    ring: "outer",
    quadrant: "under",
    clickable: true,
  },

  // ── MIDDLE RING (r 128–194) ── milder symptoms

  // Under zone (middle ring)
  {
    key: "sharp",
    label: "Sharp",
    angle: 12,
    span: 18,
    ring: "middle",
    quadrant: "under",
    clickable: true,
  },
  {
    key: "acidic",
    label: "Acidic",
    angle: 348,
    span: 16,
    ring: "middle",
    quadrant: "under",
    clickable: true,
  },
  {
    key: "flat",
    label: "Flat",
    angle: 330,
    span: 16,
    ring: "middle",
    quadrant: "under",
    clickable: true,
  },

  // Under+Weak diagonal — middle ring
  {
    key: "thin_sour",
    label: "Thin Sour",
    angle: 302,
    span: 16,
    ring: "middle",
    quadrant: "diagnostic",
    clickable: true,
  },

  // Weak zone — middle ring
  {
    key: "tea_like",
    label: "Tea-like",
    angle: 270,
    span: 16,
    ring: "middle",
    quadrant: "weak",
    clickable: true,
  },

  // Over+Strong diagonal — middle ring
  {
    key: "dry",
    label: "Dry",
    angle: 155,
    span: 16,
    ring: "middle",
    quadrant: "over",
    clickable: true,
  },

  // Over zone — middle ring
  {
    key: "chalky",
    label: "Chalky",
    angle: 205,
    span: 16,
    ring: "middle",
    quadrant: "over",
    clickable: true,
  },

  // Diagnostic symptoms (temperature-related) — middle ring
  {
    key: "dull",
    label: "Dull",
    angle: 38,
    span: 14,
    ring: "middle",
    quadrant: "diagnostic",
    clickable: true,
  },
  {
    key: "lifeless",
    label: "Lifeless",
    angle: 322,
    span: 14,
    ring: "middle",
    quadrant: "diagnostic",
    clickable: true,
  },

  // Special diagnostic (center-ish)
  {
    key: "sour_and_bitter",
    label: "Sour & Bitter",
    angle: 0,
    span: 28,
    ring: "inner",
    quadrant: "diagnostic",
    clickable: true,
  },

  // ── INNER RING (r 78–126) — positive / balanced zone, decorative ──
  {
    key: "pos_clean",
    label: "Clean",
    angle: 0,
    span: 50,
    ring: "inner",
    quadrant: "positive",
    clickable: false,
  },
  {
    key: "pos_vibrant",
    label: "Vibrant",
    angle: 90,
    span: 50,
    ring: "inner",
    quadrant: "positive",
    clickable: false,
  },
  {
    key: "pos_full",
    label: "Full",
    angle: 180,
    span: 50,
    ring: "inner",
    quadrant: "positive",
    clickable: false,
  },
  {
    key: "pos_smooth",
    label: "Smooth",
    angle: 270,
    span: 50,
    ring: "inner",
    quadrant: "positive",
    clickable: false,
  },
];

// Compass ring directional labels (these live on the wheel and rotate with it)
export const COMPASS_LABELS = [
  { label: "Under Extracted", angle: 0, major: true },
  { label: "UE / S", angle: 45, major: false },
  { label: "Strong", angle: 90, major: true },
  { label: "OE / S", angle: 135, major: false },
  { label: "Over Extracted", angle: 180, major: true },
  { label: "OE / W", angle: 225, major: false },
  { label: "Weak", angle: 270, major: true },
  { label: "UE / W", angle: 315, major: false },
];

// Clickable segments as a quick lookup map
export const CLICKABLE_KEYS = new Set(
  WHEEL_SEGMENTS.filter((s) => s.clickable && s.key !== "sour_and_bitter").map(
    (s) => s.key
  )
);
