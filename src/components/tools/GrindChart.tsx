"use client";
// src/components/tools/GrindChart.tsx
// Inline-SVG micron-scale grind chart. Renders the fixed 0–1400µm axis with the
// 7 category bands, one bar per brew method, and (when a grinder is picked) the
// grinder's setting scale along the bottom plus the selected method's setting
// range marked on its bar. No external deps — same hand-rolled approach as the
// Coffee Compass wheel.

import {
  BREW_METHODS,
  GRIND_CATEGORIES,
  type Grinder,
  MICRON_AXIS_MAX,
  MICRON_AXIS_MIN,
  formatSetting,
} from "@/lib/tools/grind-guide";

type GrindChartProps = {
  selectedMethodKey: string | null;
  grinder?: Grinder | null;
};

// Geometry (SVG user units; the viewBox scales to the container width).
const W = 820;
const GUTTER = 120; // left column for method labels
const PAD_R = 24;
const PLOT_X0 = GUTTER;
const PLOT_X1 = W - PAD_R;
const PLOT_W = PLOT_X1 - PLOT_X0;

const CAT_Y = 8;
const CAT_H = 30;
const ROW_Y0 = CAT_H + 28;
const ROW_H = 26;
const ROW_GAP = 6;
const AXIS_GAP = 26;
const TICK_H = 30;

/** Map a micron value to an SVG x-coordinate on the chart plot area. */
const x = (micron: number) =>
  PLOT_X0 +
  ((micron - MICRON_AXIS_MIN) / (MICRON_AXIS_MAX - MICRON_AXIS_MIN)) * PLOT_W;

/** Inline-SVG grind chart: category bands, brew-method bars, and grinder ticks. */
export function GrindChart({ selectedMethodKey, grinder }: GrindChartProps) {
  const rowsTop = ROW_Y0;
  const methodsHeight = BREW_METHODS.length * (ROW_H + ROW_GAP);
  const axisY = rowsTop + methodsHeight + AXIS_GAP;
  const H = axisY + TICK_H + 28;

  // Grinder setting ticks (only spans the grinder's reachable micron range).
  const grinderTicks: { setting: number; micron: number; label: string }[] = [];
  if (grinder) {
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const setting =
        grinder.settingMin +
        (i / steps) * (grinder.settingMax - grinder.settingMin);
      const micron =
        grinder.micronMin +
        (i / steps) * (grinder.micronMax - grinder.micronMin);
      grinderTicks.push({
        setting,
        micron,
        label: formatSetting(grinder, setting),
      });
    }
  }

  return (
    <figure className="not-prose w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Coffee grind size chart mapping brew methods to a micron scale"
        className="h-auto w-full min-w-[680px]"
      >
        {/* Category bands */}
        {GRIND_CATEGORIES.map((c, i) => {
          const bx = x(c.micronMin);
          const bw = x(c.micronMax) - bx;
          return (
            <g key={c.key}>
              <rect
                x={bx}
                y={CAT_Y}
                width={bw}
                height={CAT_H}
                fill="var(--primary)"
                fillOpacity={0.06 + i * 0.03}
                stroke="var(--border)"
                strokeWidth={0.5}
              />
              <text
                x={bx + bw / 2}
                y={CAT_Y + CAT_H / 2 + 3}
                textAnchor="middle"
                fontSize={9.5}
                fill="var(--muted-foreground)"
                style={{ fontWeight: 500 }}
              >
                {c.label}
              </text>
            </g>
          );
        })}

        {/* Method bars */}
        {BREW_METHODS.map((m, i) => {
          const y = rowsTop + i * (ROW_H + ROW_GAP);
          const bx = x(m.micronMin);
          const bw = Math.max(2, x(m.micronMax) - bx);
          const selected = m.key === selectedMethodKey;

          // Selected-method setting markers (when a grinder is chosen).
          let markers: React.ReactNode = null;
          if (selected && grinder) {
            const loMicron = Math.max(m.micronMin, grinder.micronMin);
            const hiMicron = Math.min(m.micronMax, grinder.micronMax);
            if (hiMicron >= loMicron) {
              const lx = x(loMicron);
              const lw = Math.max(2, x(hiMicron) - lx);
              markers = (
                <rect
                  x={lx}
                  y={y + 3}
                  width={lw}
                  height={ROW_H - 6}
                  rx={3}
                  fill="var(--accent)"
                  fillOpacity={0.9}
                />
              );
            }
          }

          return (
            <g key={m.key}>
              <text
                x={GUTTER - 10}
                y={y + ROW_H / 2 + 3.5}
                textAnchor="end"
                fontSize={11}
                fill={
                  selected ? "var(--foreground)" : "var(--muted-foreground)"
                }
                style={{ fontWeight: selected ? 600 : 400 }}
              >
                {m.name}
              </text>
              <rect
                x={bx}
                y={y}
                width={bw}
                height={ROW_H}
                rx={4}
                fill={selected ? "var(--primary)" : "var(--muted-foreground)"}
                fillOpacity={selected ? 0.85 : 0.22}
              />
              {markers}
            </g>
          );
        })}

        {/* Grinder setting axis */}
        {grinder && (
          <g>
            <line
              x1={x(grinder.micronMin)}
              x2={x(grinder.micronMax)}
              y1={axisY}
              y2={axisY}
              stroke="var(--border)"
              strokeWidth={1.5}
            />
            {grinderTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={x(t.micron)}
                  x2={x(t.micron)}
                  y1={axisY}
                  y2={axisY + 6}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={x(t.micron)}
                  y={axisY + 18}
                  textAnchor="middle"
                  fontSize={9}
                  fill="var(--muted-foreground)"
                >
                  {t.label}
                </text>
              </g>
            ))}
            <text
              x={x(grinder.micronMin)}
              y={axisY + 32}
              textAnchor="start"
              fontSize={9.5}
              fill="var(--muted-foreground)"
              style={{ fontWeight: 600 }}
            >
              {grinder.label} setting
            </text>
          </g>
        )}

        {/* Micron scale caption */}
        <text
          x={PLOT_X0}
          y={H - 4}
          fontSize={9}
          fill="var(--muted-foreground)"
          fillOpacity={0.8}
        >
          0 µm
        </text>
        <text
          x={PLOT_X1}
          y={H - 4}
          textAnchor="end"
          fontSize={9}
          fill="var(--muted-foreground)"
          fillOpacity={0.8}
        >
          1400 µm
        </text>
      </svg>
    </figure>
  );
}
