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
  micronForSetting,
  publishedRangeForMethod,
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

// Round increments for the grinder setting axis, smallest that fits first.
const NICE_STEPS = [1, 2, 5, 10, 20, 25, 30, 50, 100, 250, 500];
// Plot units. Below this two tick labels overlap; likewise the out-of-range
// caption needs this much clear axis before it is worth drawing.
const MIN_TICK_GAP = 30;
const MIN_CAPTION_W = 95;

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

  // Grinder setting ticks (only span the grinder's reachable micron range).
  // Ticks step by a round number rather than span/6, so a 1-9 scale reads
  // 1,3,5,7,9 instead of 1,2,4,5,6,8,9.
  const grinderTicks: { setting: number; micron: number; label: string }[] = [];
  if (grinder) {
    const span = grinder.settingMax - grinder.settingMin;
    const step = NICE_STEPS.find((n) => n >= span / 6) ?? span;
    const settings: number[] = [];
    for (let s = grinder.settingMin; s < grinder.settingMax; s += step) {
      settings.push(s);
    }
    // Drop a last tick only if its label would actually collide with the end
    // one — measured in plot units, since equal setting gaps are not equal
    // pixel gaps once the grinder's micron span is narrower than the axis.
    const last = settings[settings.length - 1];
    if (
      settings.length > 1 &&
      x(micronForSetting(grinder, grinder.settingMax)) -
        x(micronForSetting(grinder, last)) <
        MIN_TICK_GAP
    ) {
      settings.pop();
    }
    settings.push(grinder.settingMax);

    for (const setting of settings) {
      grinderTicks.push({
        setting,
        micron: micronForSetting(grinder, setting),
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
            // Prefer the published setting range so the marker matches the
            // number on the result card; fall back to the method's own band.
            const published = publishedRangeForMethod(grinder, m.key);
            const loMicron = published
              ? micronForSetting(grinder, published.settingMin)
              : Math.max(m.micronMin, grinder.micronMin);
            const hiMicron = published
              ? micronForSetting(grinder, published.settingMax)
              : Math.min(m.micronMax, grinder.micronMax);
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
            {/* Micron span the grinder cannot reach — dashed so the solid axis
                stopping short reads as a limit, not a truncated drawing. */}
            {grinder.micronMin > MICRON_AXIS_MIN && (
              <line
                x1={PLOT_X0}
                x2={x(grinder.micronMin)}
                y1={axisY}
                y2={axisY}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeOpacity={0.45}
                strokeDasharray="3 4"
              />
            )}
            {grinder.micronMax < MICRON_AXIS_MAX && (
              <>
                <line
                  x1={x(grinder.micronMax)}
                  x2={PLOT_X1}
                  y1={axisY}
                  y2={axisY}
                  stroke="var(--border)"
                  strokeWidth={1.5}
                  strokeOpacity={0.45}
                  strokeDasharray="3 4"
                />
                {PLOT_X1 - x(grinder.micronMax) >= MIN_CAPTION_W && (
                  <text
                    x={(x(grinder.micronMax) + PLOT_X1) / 2}
                    y={axisY + 18}
                    textAnchor="middle"
                    fontSize={9}
                    fill="var(--muted-foreground)"
                    fillOpacity={0.7}
                  >
                    out of range
                  </text>
                )}
              </>
            )}
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
