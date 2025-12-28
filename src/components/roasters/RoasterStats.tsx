"use client";

import type { RoasterDetail } from "@/types/roaster-types";

type RoasterStatsProps = {
  roaster: RoasterDetail;
};

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toLocaleString("en-IN");
}

function formatPercentage(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return `${Math.round(num)}%`;
}

function formatRating(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toFixed(1);
}

export function RoasterStats({ roaster }: RoasterStatsProps) {
  const stats = [
    {
      label: "Total Coffees",
      value: formatNumber(roaster.coffee_count),
      icon: "☕",
    },
    {
      label: "Active Coffees",
      value: formatNumber(roaster.active_coffee_count),
      icon: "✓",
    },
    {
      label: "Avg Coffee Rating",
      value: formatRating(roaster.avg_coffee_rating),
      icon: "⭐",
    },
    {
      label: "Roaster Rating",
      value: formatRating(roaster.avg_rating),
      icon: "🌟",
    },
    {
      label: "Total Ratings",
      value: formatNumber(roaster.total_ratings_count),
      icon: "📊",
    },
    {
      label: "Recommend %",
      value: formatPercentage(roaster.recommend_percentage),
      icon: "👍",
    },
  ];

  const ratingBreakdown = [
    {
      label: "Customer Support",
      value: roaster.avg_customer_support,
    },
    {
      label: "Delivery Experience",
      value: roaster.avg_delivery_experience,
    },
    {
      label: "Packaging",
      value: roaster.avg_packaging,
    },
    {
      label: "Value for Money",
      value: roaster.avg_value_for_money,
    },
  ].filter((item) => item.value !== null && item.value !== undefined);

  return (
    <div className="card-shell card-padding">
      <h2 className="text-title mb-6">Statistics</h2>

      {/* Main stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-center"
          >
            <div className="mb-2 text-title">{stat.icon}</div>
            <div className="text-heading mb-1">{stat.value}</div>
            <div className="text-caption text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Rating breakdown */}
      {ratingBreakdown.length > 0 && (
        <div>
          <h3 className="text-subheading mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-body">{item.label}</span>
                  <span className="text-body font-semibold">
                    {formatRating(item.value)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${((item.value as number) / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
