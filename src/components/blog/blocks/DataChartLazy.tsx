"use client";
// src/components/blog/blocks/DataChartLazy.tsx
import dynamic from "next/dynamic";

// Code-split recharts (~382 KB raw) — only loads on articles that embed a chart.
// `ssr: false` is load-bearing: without it Next server-renders the chart and
// preloads the recharts chunk into the *initial* script set, so the dynamic()
// saved nothing on the articles that actually have a chart (measured: the
// varieties article shipped 2,417 KB vs 1,839 KB on `/`, ~382 KB of it recharts
// — the whole of its stuck 1,050 ms "reduce unused JS" opportunity).
// Chart SVG isn't indexable content, so losing it from SSR HTML costs no SEO.
// Sized loading fallback (matches DataChart's own internal loading state)
// prevents a layout shift while the chart bundle streams in (CLS fix).
//
// This lives in its own client module because `ssr: false` is not allowed in a
// Server Component — keeping it here is what lets ArticleContent render on the
// server. The boundary is the only reason this file exists.
export const DataChartLazy = dynamic(
  () => import("@/components/blog/blocks/DataChart").then((m) => m.DataChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-80 my-12 rounded-2xl border border-border/40 bg-muted/50 animate-pulse pointer-events-none"
        aria-hidden="true"
      />
    ),
  }
);
