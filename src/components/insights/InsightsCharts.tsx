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
import { Stack } from "@/components/primitives/stack";
import type { InsightsStats } from "@/lib/data/fetch-insights-stats";
import type { ProcessEnum } from "@/types/db-enums";
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

/** Share as a one-decimal percentage; 0 when the denominator is empty. */
function pct(n: number, total: number): number {
  return total > 0 ? Math.round((n / total) * 1000) / 10 : 0;
}

const FERMENTATION_PROCESSES: ProcessEnum[] = [
  "anaerobic",
  "carbonic_maceration",
  "double_fermented",
  "experimental",
];

/** Below this many SKUs a process median is flagged as directional only. */
const LOW_SAMPLE_SKUS = 5;

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
          {p.value?.toLocaleString("en-IN")}
          {suffix}
        </p>
      ))}
    </div>
  );
}

/* ─── Chart 1: Process Breakdown ─────────────────────────────────── */
export function ProcessBreakdownChart({
  data,
}: {
  data: InsightsStats["process"];
}) {
  const total = data.reduce((sum, d) => sum + d.skus, 0);
  const processData = data.map((d) => ({
    process: d.label,
    skus: d.skus,
    pct: pct(d.skus, total),
  }));
  const fermentPct = pct(
    data
      .filter((d) => FERMENTATION_PROCESSES.includes(d.key))
      .reduce((sum, d) => sum + d.skus, 0),
    total
  );
  const naturalPct = pct(
    data.find((d) => d.key === "natural")?.skus ?? 0,
    total
  );

  return (
    <ChartCard
      id="process"
      title="How India Processes Its Specialty Coffee"
      subtitle="Share of active SKUs with a known processing method"
      callout={`Fermentation-forward methods (anaerobic + carbonic + double-fermented + experimental) now make up ${fermentPct}% of these SKUs — ${
        fermentPct > naturalPct
          ? "bigger than natural alone"
          : `against ${naturalPct}% for natural`
      }.`}
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
            width={140}
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
const NORTHEAST_STATES = new Set([
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
]);

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

export function StateConcentrationChart({
  data,
  regionTaggedTotal,
  catalogTotal,
}: {
  data: InsightsStats["states"];
  regionTaggedTotal: number;
  catalogTotal: number;
}) {
  const stateData = data.map((d) => ({
    ...d,
    pct: pct(d.skus, regionTaggedTotal),
  }));
  const top = stateData[0];
  const northeast = stateData
    .filter((d) => NORTHEAST_STATES.has(d.name))
    .map((d) => d.name);
  const callout = [
    top &&
      `${top.name} accounts for ${top.pct}% of region-identified Indian specialty SKUs.`,
    northeast.length > 0 &&
      `The Northeast — ${northeast.join(", ")} — is small but present.`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ChartCard
      id="states"
      title="Where India's Specialty Coffee Comes From"
      subtitle="Active SKUs by Indian state of origin (region-tagged coffees only)"
      callout={callout || undefined}
      footnote={`Percentages reflect share of region-tagged SKUs (${regionTaggedTotal.toLocaleString("en-IN")} total), not the full catalog of ${catalogTotal.toLocaleString("en-IN")} SKUs.`}
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
export function TopRegionsChart({
  data,
  regionTaggedTotal,
}: {
  data: InsightsStats["regions"];
  regionTaggedTotal: number;
}) {
  const regionData = data.map((d) => ({
    region: d.name,
    state: d.state ?? "",
    skus: d.skus,
  }));
  const top = regionData[0];

  return (
    <ChartCard
      id="regions"
      title="India's Specialty Coffee Map"
      subtitle={`Top ${regionData.length} origin regions by active SKU count (sub-regions roll up into their parent)`}
      callout={
        top
          ? `${top.region} alone accounts for ${pct(top.skus, regionTaggedTotal)}% of region-identified Indian specialty SKUs.`
          : undefined
      }
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
export function PriceByProcessChart({
  data,
}: {
  data: InsightsStats["price"];
}) {
  const priceData = data.map((d) => ({ process: d.label, price: d.median }));
  const baseline = data.find((d) => d.key === "washed")?.median;
  const prices = priceData.map((d) => d.price);
  const domain: [number, number] | undefined = prices.length
    ? [
        Math.max(0, Math.floor((Math.min(...prices) - 150) / 100) * 100),
        Math.ceil((Math.max(...prices) + 100) / 100) * 100,
      ]
    : undefined;

  // Headline premium ignores thin samples so one outlier can't lead the story.
  const topPremium = baseline
    ? data.find(
        (d) =>
          d.key !== "washed" && d.skus >= LOW_SAMPLE_SKUS && d.median > baseline
      )
    : undefined;
  const callout = topPremium
    ? `${topPremium.label} commands a ~${Math.round(((topPremium.median - baseline!) / baseline!) * 100)}% premium over washed-process coffees.${
        FERMENTATION_PROCESSES.includes(topPremium.key)
          ? " Fermentation isn't just experimental — it's monetized."
          : ""
      }`
    : undefined;

  const lowSample = data.filter((d) => d.skus < LOW_SAMPLE_SKUS);
  const footnote =
    lowSample.length > 0
      ? `${lowSample
          .map((d) => `${d.label} (${d.skus} SKU${d.skus === 1 ? "" : "s"})`)
          .join(
            ", "
          )} ${lowSample.length === 1 ? "has" : "have"} a thin sample — treat as directional, not a market benchmark.`
      : undefined;

  return (
    <ChartCard
      id="pricing"
      title="What You Pay for Process"
      subtitle="Median price per 250g by processing method (₹, normalized across all variants)"
      callout={callout}
      footnote={footnote}
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
            domain={domain}
            tick={{ fontSize: 11, fill: TICK }}
            tickFormatter={(v) => `₹${v}`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="process"
            width={140}
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
          {baseline && (
            <ReferenceLine
              x={baseline}
              stroke="var(--accent)"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: `Washed baseline ₹${baseline}`,
                position: "insideTopRight",
                fill: "var(--accent)",
                fontSize: 10,
                dy: -4,
              }}
            />
          )}
          <Bar dataKey="price" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {priceData.map((entry) => (
              <Cell
                key={entry.process}
                fill={
                  baseline && entry.price > baseline
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
// Not in the DB (no canon varieties table): CCRI "Selection" lines + named
// Indian releases. Anything else is treated as a global/imported cultivar.
const INDIAN_BRED = new Set(["chandragiri", "cauvery", "kent", "hemavathi"]);
function isIndianBred(name: string): boolean {
  return (
    /^(sln|s\.?\s?\d|selection)/i.test(name) ||
    INDIAN_BRED.has(name.toLowerCase())
  );
}

export function VarietyDistributionChart({
  data,
}: {
  data: InsightsStats["varieties"];
}) {
  const varietyData = data.map((d) => ({
    ...d,
    origin: isIndianBred(d.name) ? "India" : "Global",
  }));
  const radialData = [...varietyData].reverse().map((v) => ({
    ...v,
    fill: v.origin === "India" ? INDIAN_VARIETY_FILL : GLOBAL_VARIETY_FILL,
  }));
  const top3 = varietyData.slice(0, 3);
  const top = varietyData[0];
  const callout = top
    ? `${
        top3.length === 3 && top3.every((v) => v.origin === "India")
          ? `Indian-bred varieties — ${top3.map((v) => v.name).join(", ")} — dominate. `
          : ""
      }${top.name} alone appears in ${top.skus} SKUs.`
    : undefined;

  return (
    <ChartCard
      id="varieties"
      title="What's Actually Growing on Indian Estates"
      subtitle="Top coffee varieties by active SKU count"
      callout={callout}
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
export function RoasterCityChart({
  data,
}: {
  data: InsightsStats["roaster_cities"];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const top3 = data.slice(0, 3);
  const roasterLegend = data.slice(0, 12);

  return (
    <ChartCard
      id="roasters"
      title="Where India Roasts"
      subtitle="Active specialty roasters by city of operation"
      callout={
        top3.length === 3
          ? `${top3[0].city}, ${top3[1].city} and ${top3[2].city} host ${Math.round(
              pct(
                top3.reduce((sum, d) => sum + d.count, 0),
                total
              )
            )}% of India's active specialty roasters, spread across ${data.length} cities.`
          : undefined
      }
      fileName="icb-roaster-cities"
    >
      {/* The map itself */}
      <RoasterMap cities={data} />

      {/* City legend below */}
      <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {roasterLegend.map((d, i) => (
          <div key={d.city} className="flex items-center gap-2">
            <span
              className={cn(
                "text-micro inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold tracking-tighter tabular-nums",
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted-foreground text-background"
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

/**
 * Single client boundary for the whole insights grid so InsightsChartsGridLoader
 * can dynamic-import it once, keeping recharts (~283 KB) out of first-load JS.
 */
export function InsightsChartsGrid({
  stats,
  catalogTotal,
}: {
  stats: InsightsStats;
  catalogTotal: number;
}) {
  return (
    <Stack gap="12">
      {/* Row 1: full-width lead chart */}
      <ProcessBreakdownChart data={stats.process} />

      {/* Row 2: 2-col — State treemap + Top regions bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StateConcentrationChart
          data={stats.states}
          regionTaggedTotal={stats.region_tagged_total}
          catalogTotal={catalogTotal}
        />
        <TopRegionsChart
          data={stats.regions}
          regionTaggedTotal={stats.region_tagged_total}
        />
      </div>

      {/* Row 3: full-width pricing */}
      <PriceByProcessChart data={stats.price} />

      {/* Row 4: 2-col — Variety radial + Roaster bubbles */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VarietyDistributionChart data={stats.varieties} />
        <RoasterCityChart data={stats.roaster_cities} />
      </div>
    </Stack>
  );
}
