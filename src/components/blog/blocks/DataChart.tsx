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
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { ChartDataItem } from "@/lib/data/fetch-chart-data";

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
    queryKey: queryKeys.blog.dataChart(value.dataKey, value.limit),
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
      <div className="h-80 flex items-center justify-center bg-muted/50 animate-pulse rounded-2xl border border-border/40 my-12">
        <span className="text-caption text-muted-foreground font-medium">
          Loading {value.dataKey.replace("_", " ")}...
        </span>
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
        className="relative h-[450px] w-full rounded-2xl border border-border/40 bg-card p-8 shadow-lg overflow-hidden transition-all hover:shadow-xl hover:border-border/60"
      >
        <ResponsiveContainer width="100%" height="100%">
          {value.chartType === "bar" ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
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
                width={120}
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
                    fill="var(--chart-1)"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />,
                  <Bar
                    key="light"
                    dataKey="light"
                    name="Light roast"
                    fill="var(--chart-3)"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />,
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
                </Bar>
              )}
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={value.chartType === "donut" ? 90 : 0}
                outerRadius={130}
                paddingAngle={value.chartType === "donut" ? 6 : 2}
                dataKey="value"
                nameKey="label"
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
              <Tooltip content={<CustomTooltip />} />
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
