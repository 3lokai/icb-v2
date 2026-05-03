"use client";

import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Treemap,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartCard } from "./ChartCard";

/* Leaflet map — SSR-disabled (window / document required) */
const RoasterMap = dynamic(
  () => import("./RoasterMap").then((m) => ({ default: m.RoasterMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] animate-pulse rounded-sm bg-muted/40" />
    ),
  }
);

/** Theme-relative tokens for Recharts SVG (respects `.dark` via globals.css) */
const TICK = "var(--muted-foreground)";
const FALLBACK_SURFACE = "var(--muted)";

/** State fills: chart ramp + accents; Nagaland toned for white label contrast */
const STATE_COLORS: Record<string, string> = {
  Karnataka: "var(--chart-1)",
  "Tamil Nadu": "var(--chart-2)",
  Odisha: "var(--chart-3)",
  "Andhra Pradesh": "var(--chart-4)",
  Kerala: "var(--chart-5)",
  Meghalaya: "var(--primary)",
  Tripura: "var(--accent)",
  Nagaland:
    "color-mix(in oklch, var(--muted-foreground) 58%, var(--foreground))",
};

const INDIAN_VARIETY_FILL = "var(--primary)";
const GLOBAL_VARIETY_FILL = "var(--muted-foreground)";
const RADIAL_BG_TRACK = "color-mix(in oklch, var(--muted) 42%, transparent)";

/** Radial bar SKU labels — contrast on Indian (primary) vs Global (muted) segments */
function radialSkuLabelContent(props: {
  payload?: { skus?: number; origin?: string };
  value?: unknown;
  x?: string | number;
  y?: string | number;
}): ReactElement | null {
  const payload = props.payload;
  const val = props.value;
  const rawValue =
    typeof val === "number"
      ? val
      : typeof val === "string"
        ? Number.parseFloat(val)
        : Number.NaN;
  const skus =
    typeof payload?.skus === "number"
      ? payload.skus
      : Number.isFinite(rawValue)
        ? rawValue
        : 0;
  if (skus < 10) return null;
  const nx = props.x;
  const ny = props.y;
  const xf =
    typeof nx === "number"
      ? nx
      : typeof nx === "string"
        ? Number.parseFloat(nx)
        : 0;
  const yf =
    typeof ny === "number"
      ? ny
      : typeof ny === "string"
        ? Number.parseFloat(ny)
        : 0;
  const fill =
    payload?.origin === "India"
      ? "var(--primary-foreground)"
      : "var(--foreground)";
  return (
    <text
      x={xf}
      y={yf}
      fill={fill}
      fontSize={10}
      fontWeight={500}
      textAnchor="start"
      dominantBaseline="middle"
    >
      {skus}
    </text>
  );
}

/* Custom tooltip */
function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
  prefix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string; fill?: string }>;
  label?: string;
  suffix?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border/60 bg-popover px-3 py-2 shadow-lg">
      <p className="text-label-large mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-caption">
          {prefix}
          {p.value?.toLocaleString()}
          {suffix}
        </p>
      ))}
    </div>
  );
}

/* ─── Chart 1: Process Breakdown ─────────────────────────────────── */
const processData = [
  { process: "Washed", skus: 238, pct: 34.0 },
  { process: "Natural", skus: 134, pct: 19.1 },
  { process: "Anaerobic", skus: 76, pct: 10.8 },
  { process: "Honey", skus: 66, pct: 9.4 },
  { process: "Experimental", skus: 60, pct: 8.6 },
  { process: "Washed Natural", skus: 38, pct: 5.4 },
  { process: "Monsooned", skus: 30, pct: 4.3 },
  { process: "Carbonic Mac.", skus: 25, pct: 3.6 },
  { process: "Double Fermented", skus: 24, pct: 3.4 },
  { process: "Pulped Natural", skus: 7, pct: 1.0 },
  { process: "Wet Hulled", skus: 3, pct: 0.4 },
];

export function ProcessBreakdownChart() {
  return (
    <ChartCard
      id="process"
      title="How India Processes Its Specialty Coffee"
      subtitle="Share of active SKUs by processing method"
      callout="Fermentation-forward methods (anaerobic + carbonic + double-fermented + experimental) now make up 26.4% of active SKUs — bigger than natural alone."
      fileName="icb-process-breakdown"
    >
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={processData}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 8, bottom: 0 }}
          barCategoryGap="28%"
        >
          <XAxis
            type="number"
            dataKey="skus"
            tick={{ fontSize: 11, fill: TICK }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="process"
            width={110}
            tick={{ fontSize: 12, fill: TICK }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={
                  payload as Parameters<typeof ChartTooltip>[0]["payload"]
                }
                label={String(label ?? "")}
                suffix=" SKUs"
              />
            )}
          />
          <Bar dataKey="skus" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {processData.map((entry, index) => (
              <Cell
                key={entry.process}
                fill={
                  index < 3
                    ? "var(--primary)"
                    : index < 6
                      ? "var(--accent)"
                      : "var(--muted-foreground)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Chart 2: State Concentration (Treemap) ─────────────────────── */
const stateData = [
  { name: "Karnataka", skus: 462, pct: 76.3 },
  { name: "Tamil Nadu", skus: 59, pct: 9.8 },
  { name: "Odisha", skus: 27, pct: 4.5 },
  { name: "Andhra Pradesh", skus: 17, pct: 2.8 },
  { name: "Kerala", skus: 12, pct: 2.0 },
  { name: "Meghalaya", skus: 6, pct: 1.0 },
  { name: "Tripura", skus: 2, pct: 0.3 },
  { name: "Nagaland", skus: 1, pct: 0.2 },
];

interface TreemapContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  skus?: number;
  pct?: number;
}

function StateTreemapContent(props: TreemapContentProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name = "",
    skus = 0,
    pct = 0,
  } = props;
  const color = STATE_COLORS[name] ?? FALLBACK_SURFACE;
  const showLabel = width > 60 && height > 36;
  const showFull = width > 120 && height > 60;
  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        fill={color}
        fillOpacity={0.85}
        rx={4}
      />
      {showLabel && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (showFull ? 10 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={showFull ? 13 : 11}
            fontWeight={600}
          >
            {name}
          </text>
          {showFull && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.75)"
              fontSize={11}
            >
              {skus} SKUs · {pct}%
            </text>
          )}
        </>
      )}
    </g>
  );
}

export function StateConcentrationChart() {
  return (
    <ChartCard
      id="states"
      title="Where India's Specialty Coffee Comes From"
      subtitle="Active SKUs by Indian state of origin (region-tagged coffees only)"
      callout="Karnataka accounts for over three-quarters of region-identified Indian specialty SKUs. The Northeast — Meghalaya, Tripura, Nagaland — is small but newly present."
      footnote="Percentages reflect share of region-tagged SKUs (605 total), not the full catalog of 1,108 SKUs."
      fileName="icb-state-concentration"
    >
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={stateData}
          dataKey="skus"
          aspectRatio={4 / 3}
          content={<StateTreemapContent />}
        />
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Chart 3: Top Growing Regions ─────────────────────────────────── */
const regionData = [
  { region: "Chikmagalur", state: "Karnataka", skus: 256 },
  { region: "Baba Budangiri", state: "Karnataka", skus: 76 },
  { region: "Kodagu (Coorg)", state: "Karnataka", skus: 56 },
  { region: "Shevaroy Hills", state: "Tamil Nadu", skus: 39 },
  { region: "Sakleshpur", state: "Karnataka", skus: 37 },
  { region: "Koraput", state: "Odisha", skus: 27 },
  { region: "Biligiriranga Hills", state: "Karnataka", skus: 22 },
  { region: "Araku Valley", state: "Andhra Pradesh", skus: 16 },
  { region: "Palani Hills", state: "Tamil Nadu", skus: 15 },
  { region: "Wayanad", state: "Kerala", skus: 10 },
];

export function TopRegionsChart() {
  return (
    <ChartCard
      id="regions"
      title="India's Specialty Coffee Map"
      subtitle="Top 10 origin regions by active SKU count"
      callout="Chikmagalur alone accounts for 23% of all active Indian specialty SKUs."
      fileName="icb-top-regions"
    >
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={regionData}
          layout="vertical"
          margin={{ top: 0, right: 50, left: 8, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            type="number"
            dataKey="skus"
            tick={{ fontSize: 11, fill: TICK }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="region"
            width={130}
            tick={{ fontSize: 12, fill: TICK }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={
                  payload as Parameters<typeof ChartTooltip>[0]["payload"]
                }
                label={String(label ?? "")}
                suffix=" SKUs"
              />
            )}
          />
          <Bar dataKey="skus" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {regionData.map((entry) => (
              <Cell
                key={entry.region}
                fill={STATE_COLORS[entry.state] ?? "var(--muted-foreground)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* State legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(STATE_COLORS)
          .filter(([state]) => regionData.some((r) => r.state === state))
          .map(([state, color]) => (
            <div key={state} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-caption">{state}</span>
            </div>
          ))}
      </div>
    </ChartCard>
  );
}

/* ─── Chart 4: Price by Process (bar + reference line) ─────────────── */
const priceData = [
  { process: "Wet Hulled", price: 1200, vs: "+82%" },
  { process: "Carbonic Mac.", price: 986, vs: "+49%" },
  { process: "Anaerobic", price: 875, vs: "+33%" },
  { process: "Experimental", price: 855, vs: "+30%" },
  { process: "Honey", price: 800, vs: "+21%" },
  { process: "Natural", price: 793, vs: "+20%" },
  { process: "Double Fermented", price: 700, vs: "+6%" },
  { process: "Pulped Natural", price: 700, vs: "+6%" },
  { process: "Washed", price: 660, vs: "baseline" },
  { process: "Monsooned", price: 650, vs: "-2%" },
  { process: "Washed Natural", price: 606, vs: "-8%" },
];

export function PriceByProcessChart() {
  return (
    <ChartCard
      id="pricing"
      title="What You Pay for Process"
      subtitle="Median price per 250g by processing method (₹, normalized across all variants)"
      callout="Carbonic maceration commands a ~50% premium over washed-process coffees. Fermentation isn't just experimental — it's monetized."
      footnote="Wet hulled's sample is only 3 SKUs — treat as directional, not a market benchmark."
      fileName="icb-price-by-process"
    >
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={priceData}
          layout="vertical"
          margin={{ top: 0, right: 70, left: 8, bottom: 0 }}
          barCategoryGap="28%"
        >
          <XAxis
            type="number"
            dataKey="price"
            domain={[500, 1300]}
            tick={{ fontSize: 11, fill: TICK }}
            tickFormatter={(v) => `₹${v}`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="process"
            width={110}
            tick={{ fontSize: 12, fill: TICK }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={
                  payload as Parameters<typeof ChartTooltip>[0]["payload"]
                }
                label={String(label ?? "")}
                prefix="₹"
                suffix="/250g"
              />
            )}
          />
          <ReferenceLine
            x={660}
            stroke="var(--accent)"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{
              value: "Washed baseline ₹660",
              position: "insideTopRight",
              fill: "var(--accent)",
              fontSize: 10,
              dy: -4,
            }}
          />
          <Bar dataKey="price" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {priceData.map((entry) => (
              <Cell
                key={entry.process}
                fill={
                  entry.price > 660
                    ? "var(--primary)"
                    : "var(--muted-foreground)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Chart 5: Variety Distribution (Radial Bar) ─────────────────── */
const varietyData = [
  { name: "SLN 795", skus: 111, origin: "India" },
  { name: "SLN 9", skus: 81, origin: "India" },
  { name: "Chandragiri", skus: 62, origin: "India" },
  { name: "Catuai", skus: 27, origin: "Global" },
  { name: "Cauvery", skus: 13, origin: "India" },
  { name: "Catimor", skus: 13, origin: "Global" },
  { name: "SLN 5B", skus: 12, origin: "India" },
  { name: "Kent", skus: 10, origin: "India" },
  { name: "Caturra", skus: 10, origin: "Global" },
  { name: "Bourbon", skus: 6, origin: "Global" },
  { name: "Geisha", skus: 6, origin: "Global" },
  { name: "Hemavathi", skus: 6, origin: "India" },
];

const radialData = [...varietyData].reverse().map((v) => ({
  ...v,
  fill: v.origin === "India" ? INDIAN_VARIETY_FILL : GLOBAL_VARIETY_FILL,
}));

export function VarietyDistributionChart() {
  return (
    <ChartCard
      id="varieties"
      title="What's Actually Growing on Indian Estates"
      subtitle="Top coffee varieties by active SKU count"
      callout="Indian-bred varieties — SLN 795, SLN 9, Chandragiri — dominate. SLN 795 alone appears in 111 SKUs. Imports like Geisha and Bourbon remain rare in Indian production."
      fileName="icb-variety-distribution"
    >
      {/* Legend */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
          <span className="text-caption">Indian-bred</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted-foreground" />
          <span className="text-caption">Global / Imported</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <RadialBarChart
          innerRadius="15%"
          outerRadius="95%"
          data={radialData}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            dataKey="skus"
            cornerRadius={4}
            background={{ fill: RADIAL_BG_TRACK }}
            label={{
              position: "insideStart",
              // Polar label props are loosely typed upstream in Recharts.
              content: radialSkuLabelContent as React.ComponentProps<
                typeof RadialBar
              >["label"] extends { content?: infer C }
                ? C
                : never,
            }}
          >
            {radialData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </RadialBar>
          <Legend
            iconSize={8}
            formatter={(value) => <span className="text-caption">{value}</span>}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as (typeof radialData)[0];
              return (
                <div className="rounded-sm border border-border/60 bg-popover px-3 py-2 shadow-lg">
                  <p className="text-label-large mb-1">{d.name}</p>
                  <p className="text-caption">{d.skus} SKUs</p>
                  <p className="text-caption">{d.origin}</p>
                </div>
              );
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Chart 6: Roaster City (Leaflet Map) ─────────────────────────── */
const roasterLegend = [
  { city: "Bangalore", state: "Karnataka", count: 18 },
  { city: "New Delhi", state: "Delhi", count: 10 },
  { city: "Mumbai", state: "Maharashtra", count: 9 },
  { city: "Hyderabad", state: "Telangana", count: 4 },
  { city: "Pune", state: "Maharashtra", count: 4 },
  { city: "Chennai", state: "Tamil Nadu", count: 3 },
  { city: "Coorg", state: "Karnataka", count: 3 },
  { city: "Gurugram", state: "Haryana", count: 2 },
  { city: "Jaipur", state: "Rajasthan", count: 2 },
  { city: "Chikmagalur", state: "Karnataka", count: 2 },
  { city: "Kohima", state: "Nagaland", count: 1 },
];

export function RoasterCityChart() {
  return (
    <ChartCard
      id="roasters"
      title="Where India Roasts"
      subtitle="Active specialty roasters by city of operation"
      callout="Bangalore, Delhi and Mumbai host nearly half of India's active specialty roasters — but Kohima's emergence signals something quietly bigger."
      fileName="icb-roaster-cities"
    >
      {/* The map itself */}
      <RoasterMap />

      {/* City legend below */}
      <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {roasterLegend.map((d) => (
          <div key={d.city} className="flex items-center gap-2">
            <span
              className={cn(
                "text-micro inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold tracking-tighter tabular-nums",
                d.city === "Bangalore" && "bg-primary text-primary-foreground",
                d.city === "Kohima" && "bg-accent text-accent-foreground",
                d.city !== "Bangalore" &&
                  d.city !== "Kohima" &&
                  "bg-muted-foreground text-background"
              )}
            >
              {d.count}
            </span>
            <span className="text-caption truncate">{d.city}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
