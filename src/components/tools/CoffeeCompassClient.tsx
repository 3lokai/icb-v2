"use client";
// src/components/tools/CoffeeCompassClient.tsx
// Split layout: chip selector on left, rotating SVG wheel on right (half-visible)
// Bidirectional sync: chips drive wheel rotation; wheel scroll/arrows drive chip highlight

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  startTransition,
} from "react";
import { computeCompass } from "@/lib/tools/compass/compassEngine";
import {
  CompassMethodKey,
  CompassResult,
  CompassSymptomKey,
  RoastLevel,
} from "@/lib/tools/compass/compassTypes";
import { arcPath, polar } from "@/lib/tools/compass/wheelGeometry";
import {
  WHEEL_SEGMENTS,
  COMPASS_LABELS,
  QUADRANT_COLORS,
  WheelSegment,
} from "@/lib/tools/compass/wheelSegments";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── SVG radii ───────────────────────────────────────────────────────────────
const CX = 300,
  CY = 300;
const R_CENTER = 76;
const R_INNER_IN = 78,
  R_INNER_OUT = 126;
const R_MIDDLE_IN = 128,
  R_MIDDLE_OUT = 194;
const R_OUTER_IN = 196,
  R_OUTER_OUT = 262;
const R_COMPASS_IN = 264,
  R_COMPASS_OUT = 304;
const R_COMPASS_MID = (R_COMPASS_IN + R_COMPASS_OUT) / 2;
const R_TICK = 308;

// ─── Methods ─────────────────────────────────────────────────────────────────
const METHODS: { key: CompassMethodKey; label: string }[] = [
  { key: "pour_over", label: "Pour Over" },
  { key: "v60", label: "V60" },
  { key: "aeropress", label: "AeroPress" },
  { key: "french_press", label: "French Press" },
  { key: "espresso", label: "Espresso" },
  { key: "chemex", label: "Chemex" },
  { key: "moka_pot", label: "Moka Pot" },
  { key: "cold_brew", label: "Cold Brew" },
  { key: "south_indian_filter", label: "South Indian" },
  { key: "kalita_wave", label: "Kalita" },
];

/** Map DB roast_level (5-level) to compass RoastLevel (3-level) */
function dbRoastToCompass(dbRoast: string | null): RoastLevel | undefined {
  if (!dbRoast) return undefined;
  if (dbRoast === "light" || dbRoast === "light_medium") return "light";
  if (dbRoast === "medium") return "medium";
  if (dbRoast === "medium_dark" || dbRoast === "dark") return "dark";
  return undefined;
}

export type CoffeeCompassClientProps = {
  roasters: { id: string; name: string }[];
  coffees: {
    id: string;
    name: string;
    roaster_id: string;
    roast_level: string | null;
  }[];
  initialCoffeeId?: string;
};

// ─── Chip groups for left panel ───────────────────────────────────────────────
const CHIP_GROUPS = [
  {
    label: "Acidity / Under-Extracted",
    chipColor: "amber",
    keys: ["sour", "sharp", "vegetal", "acidic", "salty", "flat", "hollow"],
  },
  {
    label: "Bitterness / Over-Extracted",
    chipColor: "rose",
    keys: ["bitter", "harsh", "astringent", "dry", "chalky", "smoky"],
  },
  {
    label: "Strength",
    chipColor: "mixed",
    keys: ["watery", "thin", "weak", "too_strong", "heavy", "muddy"],
  },
  {
    label: "Diagnostic",
    chipColor: "slate",
    keys: [
      "sour_and_bitter",
      "tea_like",
      "thin_sour",
      "intense",
      "dull",
      "lifeless",
    ],
  },
] as const;

const CHIP_DISPLAY: Record<string, string> = {
  sour: "Sour",
  sharp: "Sharp",
  vegetal: "Vegetal",
  acidic: "Acidic",
  salty: "Salty",
  flat: "Flat",
  hollow: "Hollow",
  bitter: "Bitter",
  harsh: "Harsh",
  astringent: "Astringent",
  dry: "Dry",
  chalky: "Chalky",
  smoky: "Smoky",
  watery: "Watery",
  thin: "Thin",
  weak: "Weak",
  too_strong: "Too Strong",
  heavy: "Heavy",
  muddy: "Muddy",
  sour_and_bitter: "Sour & Bitter",
  tea_like: "Tea-like",
  thin_sour: "Thin Sour",
  intense: "Intense",
  dull: "Dull",
  lifeless: "Lifeless",
};

const GROUP_STYLES: Record<string, { active: string; dot: string }> = {
  amber: {
    active:
      "border-amber-400 bg-amber-400/15 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-400",
  },
  rose: {
    active: "border-rose-400 bg-rose-400/15 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-400",
  },
  mixed: {
    active:
      "border-purple-400 bg-purple-400/15 text-purple-700 dark:text-purple-300",
    dot: "bg-purple-400",
  },
  slate: {
    active:
      "border-slate-400 bg-slate-400/15 text-slate-600 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

// ─── Wheel helpers ────────────────────────────────────────────────────────────
function innerR(ring: string) {
  return ring === "outer"
    ? R_OUTER_IN
    : ring === "middle"
      ? R_MIDDLE_IN
      : R_INNER_IN;
}
function outerR(ring: string) {
  return ring === "outer"
    ? R_OUTER_OUT
    : ring === "middle"
      ? R_MIDDLE_OUT
      : R_INNER_OUT;
}
function midR(ring: string) {
  return (innerR(ring) + outerR(ring)) / 2;
}
function fSize(ring: string) {
  return ring === "outer" ? 9.5 : ring === "middle" ? 8 : 7;
}
function fillOp(ring: string) {
  return ring === "outer" ? 0.8 : ring === "middle" ? 0.55 : 0.22;
}

/** Find which clickable segment is closest to the 12-o'clock pointer */
function getSegmentAtTop(rotation: number): WheelSegment | null {
  const topAngle = ((-rotation % 360) + 360) % 360;
  let best: WheelSegment | null = null;
  let minDist = Infinity;
  for (const seg of WHEEL_SEGMENTS) {
    if (!seg.clickable || !CHIP_DISPLAY[seg.key]) continue;
    const dist = Math.min(
      Math.abs(seg.angle - topAngle),
      360 - Math.abs(seg.angle - topAngle)
    );
    if (dist < minDist) {
      minDist = dist;
      best = seg;
    }
  }
  return best;
}

/** Shortest-path rotation diff */
function shortestDiff(from: number, to: number) {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

// ─── Bucket label ─────────────────────────────────────────────────────────────
function bucketLabel(b: string) {
  return (
    (
      {
        UNDER: "Under-Extracted",
        OVER: "Over-Extracted",
        WEAK: "Weak",
        STRONG: "Too Strong",
        UNDER_WEAK: "Under-Extracted & Weak",
        UNDER_STRONG: "Under-Extracted & Strong",
        OVER_WEAK: "Over-Extracted & Weak",
        OVER_STRONG: "Over-Extracted & Strong",
        BALANCED: "Balanced",
      } as Record<string, string>
    )[b] ?? b
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CoffeeCompassClient({
  roasters,
  coffees,
  initialCoffeeId,
}: CoffeeCompassClientProps) {
  const [method, setMethod] = useState<CompassMethodKey>("pour_over");
  const [selectedRoasterId, setSelectedRoasterId] = useState<string>("");
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string>("");
  const [chips, setChips] = useState<Set<string>>(new Set());
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<CompassResult | null>(null);
  const [driver, setDriver] = useState<"chips" | "wheel">("chips");
  const [wheelFocused, setWheelFocused] = useState(false);
  const [wheelHovered, setWheelHovered] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Roast derived from selected coffee
  const selectedCoffee = useMemo(
    () => coffees.find((c) => c.id === selectedCoffeeId),
    [coffees, selectedCoffeeId]
  );
  const roast = useMemo<RoastLevel | undefined>(
    () =>
      selectedCoffee ? dbRoastToCompass(selectedCoffee.roast_level) : undefined,
    [selectedCoffee]
  );

  // Pre-select coffee when arriving from rating flow (initialCoffeeId in URL)
  useEffect(() => {
    if (!initialCoffeeId || coffees.length === 0) return;
    const coffee = coffees.find((c) => c.id === initialCoffeeId);
    if (coffee) {
      startTransition(() => {
        setSelectedRoasterId(coffee.roaster_id);
        setSelectedCoffeeId(coffee.id);
      });
    }
  }, [initialCoffeeId, coffees]);

  // ── Chips → Wheel ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (driver !== "chips" || chips.size === 0) {
      if (chips.size === 0) {
        startTransition(() => setResult(null));
      }
      return;
    }
    const symptoms = [...chips] as CompassSymptomKey[];
    const r = computeCompass({ symptoms, method, roast });
    const targetSvg = (90 - r.angle + 360) % 360;
    const targetRot = -targetSvg;
    startTransition(() => {
      setResult(r);
      setRotation(
        (prev) =>
          prev + shortestDiff(prev, targetRot + Math.round(prev / 360) * 360)
      );
    });
  }, [chips, method, roast, driver]);

  // ── Wheel → Chips (debounced 350ms) ───────────────────────────────────────
  useEffect(() => {
    if (driver !== "wheel") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const seg = getSegmentAtTop(rotation);
      if (!seg) return;
      const key = seg.key as CompassSymptomKey;
      const r = computeCompass({ symptoms: [key], method, roast });
      setResult(r);
      setChips(new Set([key]));
    }, 350);
    return () => clearTimeout(timerRef.current);
  }, [rotation, driver, method, roast]);

  // ── Mouse wheel + arrow keys ───────────────────────────────────────────────
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setDriver("wheel");
      setRotation((p) => p + e.deltaY * 0.28);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!wheelFocused && !wheelHovered) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDriver("wheel");
        setRotation((p) => p - 15);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setDriver("wheel");
        setRotation((p) => p + 15);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [wheelFocused, wheelHovered]);

  const toggleChip = useCallback((key: string) => {
    setDriver("chips");
    setChips((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleSegmentClick = useCallback((seg: WheelSegment) => {
    if (!seg.clickable || !CHIP_DISPLAY[seg.key]) return;
    setDriver("chips");
    setChips(new Set([seg.key]));
    setRotation((prev) => {
      const targetRot = -seg.angle;
      return (
        prev + shortestDiff(prev, targetRot + Math.round(prev / 360) * 360)
      );
    });
  }, []);

  const resetAll = useCallback(() => {
    setChips(new Set());
    setResult(null);
    setRotation(0);
    setDriver("chips");
  }, []);

  const segmentAtTop = useMemo(() => getSegmentAtTop(rotation), [rotation]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Method */}
          <div>
            <p className="text-label font-semibold uppercase tracking-widest mb-2.5">
              Brewing Method
            </p>
            <Select
              value={method}
              onValueChange={(val) => {
                setMethod(val as CompassMethodKey);
                setResult(null);
              }}
            >
              <SelectTrigger className="w-full rounded-full text-body font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Roaster */}
          <div>
            <p className="text-label font-semibold uppercase tracking-widest mb-2.5">
              Roaster{" "}
              <span className="normal-case font-normal opacity-50">
                (optional)
              </span>
            </p>
            <Select
              value={selectedRoasterId || "__none__"}
              onValueChange={(val) => {
                setSelectedRoasterId(val === "__none__" ? "" : val);
                setSelectedCoffeeId("");
              }}
            >
              <SelectTrigger className="w-full rounded-full text-body font-semibold">
                <SelectValue placeholder="Select roaster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {roasters.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coffee */}
          <div>
            <p className="text-label font-semibold uppercase tracking-widest mb-2.5">
              Coffee{" "}
              <span className="normal-case font-normal opacity-50">
                (optional)
              </span>
            </p>
            <Select
              value={selectedCoffeeId || "__none__"}
              onValueChange={(val) =>
                setSelectedCoffeeId(val === "__none__" ? "" : val)
              }
              disabled={!selectedRoasterId}
            >
              <SelectTrigger className="w-full rounded-full text-body font-semibold">
                <SelectValue
                  placeholder={
                    selectedRoasterId ? "Select coffee" : "Select roaster first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {coffees
                  .filter((c) => c.roaster_id === selectedRoasterId)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Symptom chips */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-label font-semibold uppercase tracking-widest">
                What do you taste?
              </p>
              {chips.size > 0 && (
                <button
                  onClick={resetAll}
                  className="text-caption hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {CHIP_GROUPS.map((group) => {
              const style = GROUP_STYLES[group.chipColor];
              return (
                <div key={group.label}>
                  <p className="text-label mb-1.5 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-block h-1.5 w-1.5 rounded-full",
                        style.dot
                      )}
                    />
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.keys.map((key) => {
                      const isActive = chips.has(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleChip(key)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-overline font-medium transition-all duration-200",
                            isActive
                              ? style.active
                              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                          )}
                        >
                          {CHIP_DISPLAY[key]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result banner */}
          {result && (
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-border/30 flex items-start justify-between gap-3">
                <div>
                  <p className="text-label font-semibold uppercase tracking-widest mb-0.5">
                    Diagnosis
                  </p>
                  <p className="text-body font-bold leading-tight">
                    {bucketLabel(result.bucket)}
                  </p>
                  <p className="text-caption mt-0.5">
                    {result.recommendedMoveVector}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-label">Confidence</p>
                  <p className="text-body font-bold tabular-nums">
                    {Math.round(result.confidence * 100)}%
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-micro font-bold text-primary">
                    1
                  </span>
                  <p className="text-caption font-semibold pt-0.5">
                    {result.primaryAction}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted/50 text-micro font-bold text-muted-foreground">
                    2
                  </span>
                  <p className="text-caption text-muted-foreground pt-0.5">
                    {result.secondaryAction}
                  </p>
                </div>
              </div>

              {result.notes.length > 0 && (
                <div className="px-5 pb-4 border-t border-border/20 pt-3 space-y-1">
                  {result.notes.map((n, i) => (
                    <p
                      key={i}
                      className="text-caption flex items-start gap-1.5"
                    >
                      <span className="text-accent shrink-0 mt-0.5">›</span>
                      {n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL — Wheel (half-visible on desktop) ─────────────────── */}
        <div className="w-full lg:w-[560px] lg:shrink-0 lg:-mr-36 xl:-mr-44 pt-10 lg:pt-0">
          <div
            ref={wheelRef}
            tabIndex={0}
            onFocus={() => setWheelFocused(true)}
            onBlur={() => setWheelFocused(false)}
            onMouseEnter={() => setWheelHovered(true)}
            onMouseLeave={() => setWheelHovered(false)}
            className={cn(
              "relative cursor-grab rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              "active:cursor-grabbing"
            )}
          >
            {/* Right-edge fade vignette */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent hidden lg:block" />

            {/* Focus ring glow */}
            {(wheelFocused || wheelHovered) && (
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-primary/20 z-10" />
            )}

            <svg
              viewBox="0 0 600 600"
              className="w-full h-auto overflow-visible"
              aria-label="Coffee Compass Wheel — scroll or use arrow keys to rotate"
            >
              {/* Fixed pointer */}
              <polygon
                points={`${CX},${CY - R_COMPASS_OUT - 5} ${CX - 7},${CY - R_COMPASS_OUT - 19} ${CX + 7},${CY - R_COMPASS_OUT - 19}`}
                className="fill-foreground pointer-events-none"
              />

              {/* Name of segment at top pointer */}
              {segmentAtTop && CHIP_DISPLAY[segmentAtTop.key] && (
                <text
                  x={CX}
                  y={CY - R_COMPASS_OUT - 28}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  className="fill-foreground pointer-events-none"
                >
                  {CHIP_DISPLAY[segmentAtTop.key]}
                </text>
              )}

              {/* ── Rotating group ── */}
              <g
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: `${CX}px ${CY}px`,
                  transition:
                    "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {/* Compass ring borders */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_COMPASS_OUT}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border/40"
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_COMPASS_IN}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border/40"
                />

                {/* Tick marks */}
                {Array.from({ length: 72 }, (_, i) => {
                  const ang = i * 5;
                  const isMajor = ang % 45 === 0;
                  const o = polar(CX, CY, R_TICK, ang);
                  const inn = polar(CX, CY, R_TICK - (isMajor ? 8 : 4), ang);
                  return (
                    <line
                      key={ang}
                      x1={o.x}
                      y1={o.y}
                      x2={inn.x}
                      y2={inn.y}
                      stroke="currentColor"
                      strokeWidth={isMajor ? 1.2 : 0.6}
                      className="text-border/50"
                    />
                  );
                })}

                {/* Compass directional labels */}
                {COMPASS_LABELS.map(({ label, angle, major }) => {
                  const p = polar(CX, CY, R_COMPASS_MID, angle);
                  const flip = angle > 90 && angle <= 270;
                  return (
                    <text
                      key={label}
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={major ? 9 : 7}
                      fontWeight={major ? "700" : "500"}
                      letterSpacing="0.08em"
                      className="fill-muted-foreground pointer-events-none uppercase"
                      transform={`rotate(${flip ? angle + 180 : angle}, ${p.x.toFixed(1)}, ${p.y.toFixed(1)})`}
                    >
                      {label}
                    </text>
                  );
                })}

                {/* Segments */}
                {WHEEL_SEGMENTS.map((seg) => {
                  const iR = innerR(seg.ring),
                    oR = outerR(seg.ring);
                  const half = seg.span / 2;
                  const pth = arcPath(
                    CX,
                    CY,
                    iR,
                    oR,
                    seg.angle - half + 1.2,
                    seg.angle + half - 1.2
                  );
                  const { fill, text } = QUADRANT_COLORS[seg.quadrant];
                  const isActive =
                    chips.has(seg.key) ||
                    (driver === "wheel" && segmentAtTop?.key === seg.key);
                  const mr = midR(seg.ring);
                  const p = polar(CX, CY, mr, seg.angle);
                  const flip = seg.angle > 90 && seg.angle <= 270;

                  return (
                    <g
                      key={seg.key}
                      onClick={() => handleSegmentClick(seg)}
                      style={{ cursor: seg.clickable ? "pointer" : "default" }}
                    >
                      <path
                        d={pth}
                        fill={fill}
                        fillOpacity={isActive ? 1 : fillOp(seg.ring)}
                        stroke="white"
                        strokeWidth={isActive ? 2 : 0.8}
                        strokeOpacity={0.5}
                        style={{
                          transition: "fill-opacity 0.2s, stroke-width 0.2s",
                        }}
                      />
                      {isActive && seg.clickable && (
                        <path
                          d={arcPath(
                            CX,
                            CY,
                            iR - 2,
                            oR + 3,
                            seg.angle - half,
                            seg.angle + half
                          )}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeDasharray="3 2"
                          className="text-foreground pointer-events-none"
                        />
                      )}
                      {/* Label */}
                      <text
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={fSize(seg.ring)}
                        fontWeight="600"
                        fill={text}
                        className="pointer-events-none"
                        transform={`rotate(${flip ? seg.angle + 180 : seg.angle}, ${p.x.toFixed(1)}, ${p.y.toFixed(1)})`}
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}

                {/* Center */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_CENTER - 1}
                  fill="hsl(var(--primary) / 0.12)"
                  stroke="hsl(var(--primary) / 0.3)"
                  strokeWidth="1.5"
                />
                <text
                  x={CX}
                  y={CY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="hsl(var(--primary))"
                  className="pointer-events-none italic"
                >
                  Balanced
                </text>
              </g>
            </svg>
          </div>

          {/* Hints below wheel so they're never hidden behind it */}
          <div
            className={cn(
              "mt-3 flex flex-col items-center justify-center gap-1 text-caption text-muted-foreground/60 transition-opacity duration-300",
              wheelFocused || wheelHovered ? "opacity-100" : "opacity-70"
            )}
          >
            <p className="hidden lg:flex items-center gap-2">
              <kbd className="rounded border border-border/40 px-1.5 py-0.5 font-mono text-micro">
                ←
              </kbd>
              <kbd className="rounded border border-border/40 px-1.5 py-0.5 font-mono text-micro">
                →
              </kbd>
              <span>or scroll to rotate</span>
            </p>
            <p className="lg:hidden">Tap a segment to diagnose</p>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <p className="mt-8 text-center text-caption text-muted-foreground/60">
        Inspired by the{" "}
        <a
          href="https://www.baristahustle.com/app-archive-main/the-coffee-compass/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Coffee Compass
        </a>{" "}
        by Barista Hustle
      </p>
    </div>
  );
}
