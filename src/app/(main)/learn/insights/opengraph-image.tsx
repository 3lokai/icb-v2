import { ImageResponse } from "next/og";
import {
  EMPTY_INSIGHTS_STATS,
  fetchInsightsStats,
} from "@/lib/data/fetch-insights-stats";
import { fetchPublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";

// Same cached fetches (and cache tags) as the page, so the card regenerates with
// it when the scraper's MV-refresh webhook revalidates "coffees"/"roasters".

export const alt = "Indian Specialty Coffee by the Numbers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// DESIGN.md tokens as hex (Satori doesn't parse oklch()).
const INK = "#26170d"; // foreground
const CREAM = "#fcf9f2"; // background
const WHEAT = "#eedcb9"; // muted
const BORDER = "#dbd3c6"; // border
const TERRACOTTA = "#d06b4c"; // chart-2
const BAR_COLORS = ["#6d4024", "#995503", "#d06b4c", "#b08d3f", "#6a5b44"]; // chart-3, primary, chart-2, chart-4, muted-foreground

export default async function Image() {
  // Same fallbacks as the page: a transient data failure renders a sparse card
  // rather than failing the share image.
  const [stats, totals] = await Promise.all([
    fetchInsightsStats().catch(() => EMPTY_INSIGHTS_STATS),
    fetchPublicDirectoryTotals().catch(() => ({
      coffees: 0,
      roasters: 0,
      asOf: null,
    })),
  ]);

  const total = stats.process.reduce((sum, p) => sum + p.skus, 0);
  const top = stats.process.slice(0, 4);
  const rest = total - top.reduce((sum, p) => sum + p.skus, 0);
  const bars = [
    ...top.map((p) => ({ label: p.label, skus: p.skus })),
    ...(rest > 0 ? [{ label: "Other", skus: rest }] : []),
  ].map((b) => ({
    ...b,
    pct: total > 0 ? Math.round((b.skus / total) * 100) : 0,
  }));
  const maxPct = Math.max(1, ...bars.map((b) => b.pct));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: CREAM,
        color: INK,
      }}
    >
      <div style={{ display: "flex", flex: 1, padding: "60px 60px 30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
            width: 590,
            paddingRight: 40,
            borderRight: `2px solid ${BORDER}`,
          }}
        >
          {bars.map((b, i) => (
            <div
              key={b.label}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                style={{
                  width: 210,
                  flexShrink: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {b.label}
              </div>
              <div
                style={{
                  height: 52,
                  width: Math.max(8, (b.pct / maxPct) * 260),
                  background: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
              <div style={{ marginLeft: 18, fontSize: 32, fontWeight: 700 }}>
                {`${b.pct}%`}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 50,
          }}
        >
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>
            Indian
          </div>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>
            Specialty
          </div>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>
            Coffee
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: TERRACOTTA,
              marginTop: 12,
            }}
          >
            by the Numbers
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          height: 110,
          background: WHEAT,
          fontSize: 46,
          fontWeight: 700,
        }}
      >
        <span>{`${totals.roasters.toLocaleString("en-IN")}+ roasters`}</span>
        <span style={{ color: TERRACOTTA }}>•</span>
        <span>{`${totals.coffees.toLocaleString("en-IN")}+ SKUs`}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 56,
          fontSize: 20,
          letterSpacing: 6,
        }}
      >
        INDIANCOFFEEBEANS.COM/INSIGHTS
      </div>
    </div>,
    size
  );
}
