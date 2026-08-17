"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { ChartDataItem } from "@/lib/data/fetch-chart-data";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface DataChartProps {
  value: {
    title?: string;
    description?: string;
    chartType: "bar" | "pie" | "donut";
    dataKey: string;
    limit?: number;
    region?: string;
  };
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const BAR_VALUE_LABEL = {
  position: "right" as const,
  fill: "var(--muted-foreground)",
  fontSize: 12,
  fontWeight: 600,
};

const renderPieSliceLabel = (props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
  value?: number;
}) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    percent = 0,
    name = "",
    value = 0,
  } = props;

  // Skip callouts on slivers — they overlap and read as noise.
  if (percent < 0.04) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? "start" : "end";

  return (
    <text
      x={x}
      y={y}
      fill="var(--muted-foreground)"
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${name} · ${value}`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const grouped = payload.length > 1;
    return (
      <div className="rounded-xl border border-border/50 bg-card/90 p-3 shadow-xl backdrop-blur-md">
        <p className="text-micro font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {payload[0].payload.label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-heading font-black text-primary">
            {grouped ? `${p.name}: ${p.value}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function DataChart({ value }: DataChartProps) {
  const { data, isLoading, error } = useQuery<ChartDataItem[]>({
    queryKey: queryKeys.blog.dataChart(
      value.dataKey,
      value.limit,
      value.region
    ),
    queryFn: async () => {
      let url = `/api/blog/chart-data?dataKey=${value.dataKey}&limit=${
        value.limit || 10
      }`;
      if (value.region) {
        url += `&region=${encodeURIComponent(value.region)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch chart data");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div
        className="h-80 flex items-center justify-center bg-muted/50 rounded-2xl border border-border/40 my-12 pointer-events-none"
        role="status"
      >
        <LoadingSpinner size="sm" text="" />
        <span className="sr-only">Loading chart data…</span>
      </div>
    );
  }

  if (error || !data || data.length === 0) return null;

  // Grouped (multi-series) charts — e.g. flavor_by_roast dark-vs-light — carry per-band
  // tallies instead of a single `value`. Detect them to switch the bar renderer.
  const isGrouped = data.some(
    (d) => d.dark !== undefined || d.light !== undefined
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="not-prose my-12"
    >
      <div className="mb-6 px-2">
        {value.title && (
          <motion.h2
            variants={itemVariants}
            className="text-title font-bold text-foreground tracking-tight mb-2"
          >
            {value.title}
          </motion.h2>
        )}
        {value.description && (
          <motion.p
            variants={itemVariants}
            className="text-body-large text-muted-foreground leading-relaxed max-w-2xl"
          >
            {value.description}
          </motion.p>
        )}
      </div>

      <motion.div
        variants={itemVariants}
        className="relative h-[450px] w-full rounded-2xl border border-border/40 bg-card p-8 shadow-lg overflow-visible transition-all hover:shadow-xl hover:border-border/60"
      >
        <ResponsiveContainer width="100%" height="100%">
          {value.chartType === "bar" ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 48, top: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                horizontal={false}
                stroke="var(--border)"
                opacity={0.1}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="label"
                type="category"
                width={140}
                tick={{
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                  fontWeight: 600,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", radius: 8 }}
                content={<CustomTooltip />}
              />
              {isGrouped ? (
                [
                  <Legend
                    key="legend"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
                  />,
                  <Bar
                    key="dark"
                    dataKey="dark"
                    name="Dark roast"
                    fill="var(--chart-3)"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    <LabelList dataKey="dark" {...BAR_VALUE_LABEL} />
                  </Bar>,
                  <Bar
                    key="light"
                    dataKey="light"
                    name="Light roast"
                    fill="var(--chart-4)"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    <LabelList dataKey="light" {...BAR_VALUE_LABEL} />
                  </Bar>,
                ]
              ) : (
                <Bar
                  dataKey="value"
                  fill="var(--chart-1)"
                  radius={[0, 8, 8, 0]}
                  barSize={32}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <LabelList dataKey="value" {...BAR_VALUE_LABEL} />
                </Bar>
              )}
            </BarChart>
          ) : (
            <PieChart margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={value.chartType === "donut" ? 80 : 0}
                outerRadius={100}
                paddingAngle={value.chartType === "donut" ? 6 : 2}
                dataKey="value"
                nameKey="label"
                label={renderPieSliceLabel}
                labelLine={{
                  stroke: "var(--muted-foreground)",
                  strokeWidth: 1,
                  strokeOpacity: 0.35,
                }}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="var(--card)"
                    strokeWidth={4}
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* SEO Fallback: Hidden Data for Search Engine Bots */}
      <div className="sr-only" aria-hidden="true">
        <h4>Data points for {value.title || value.dataKey}</h4>
        <table>
          <thead>
            {isGrouped ? (
              <tr>
                <th>Feature</th>
                <th>Dark roast</th>
                <th>Light roast</th>
              </tr>
            ) : (
              <tr>
                <th>Feature</th>
                <th>Count</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.label}</td>
                {isGrouped ? (
                  <>
                    <td>{item.dark ?? 0}</td>
                    <td>{item.light ?? 0}</td>
                  </>
                ) : (
                  <td>{item.value}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
