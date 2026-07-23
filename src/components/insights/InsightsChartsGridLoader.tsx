"use client";

import dynamic from "next/dynamic";

// Dynamic-imported so recharts (~283 KB) code-splits out of first-load JS.
const InsightsChartsGrid = dynamic(() =>
  import("@/components/insights/InsightsCharts").then(
    (m) => m.InsightsChartsGrid
  )
);

export function InsightsChartsGridLoader() {
  return <InsightsChartsGrid />;
}
