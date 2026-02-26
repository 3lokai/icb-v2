"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { KeyUsage } from "@/app/actions/api-keys";

function formatDateKey(dateKey: string): string {
  if (dateKey.length !== 8) return dateKey;
  const y = dateKey.slice(0, 4);
  const m = dateKey.slice(4, 6);
  const d = dateKey.slice(6, 8);
  const date = new Date(`${y}-${m}-${d}`);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

type UsageChartsProps = {
  keyId: string;
  keyName: string;
  usage: KeyUsage;
};

function UsageBarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { label: string; count: number } }>;
}) {
  if (active && payload?.[0]) {
    return (
      <div className="rounded-lg border border-border/50 bg-card px-3 py-2 shadow-md">
        <p className="text-caption font-medium">{payload[0].payload.label}</p>
        <p className="text-body font-semibold">
          {payload[0].payload.count} requests
        </p>
      </div>
    );
  }
  return null;
}

export function UsageCharts({ keyName, usage }: UsageChartsProps) {
  const todayLabel = "Today";
  const sevenDaysData = [
    { label: todayLabel, count: usage.todayTotal, fullDate: "Today" },
    ...usage.dailyTotals.map((d) => ({
      label: formatDateKey(d.date),
      count: d.count,
      fullDate: d.date,
    })),
  ].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>
          Request volume for <strong>{keyName}</strong>. Data updates in real
          time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-muted-foreground text-caption mb-1">Today</p>
          <p className="text-heading font-bold">{usage.todayTotal} requests</p>
        </div>
        {sevenDaysData.some((d) => d.count > 0) && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sevenDaysData}
                margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<UsageBarTooltip />} />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
