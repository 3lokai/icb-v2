"use client";

import { cn } from "@/lib/utils";

type SensoryData = {
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  bitterness: number | null;
  clarity: number | null;
};

type SensoryRadarChartProps = {
  data: SensoryData;
  size?: number;
  className?: string;
};

const SENSORY_LABELS = [
  { key: "acidity", label: "Acidity" },
  { key: "sweetness", label: "Sweetness" },
  { key: "body", label: "Body" },
  { key: "bitterness", label: "Bitterness" },
  { key: "clarity", label: "Clarity" },
] as const;

const MAX_VALUE = 5;

export function SensoryRadarChart({
  data,
  size = 240,
  className,
}: SensoryRadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35; // Leave some padding
  const numPoints = SENSORY_LABELS.length;
  const angleStep = (2 * Math.PI) / numPoints;

  // Convert data to points on the radar chart
  const getPoint = (
    index: number,
    value: number | null,
    customRadius?: number
  ) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const r =
      customRadius !== undefined
        ? customRadius
        : value !== null
          ? radius * (value / MAX_VALUE)
          : 0;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Create polygon points for the data
  const dataPoints = SENSORY_LABELS.map((_, index) => {
    const key = SENSORY_LABELS[index].key as keyof SensoryData;
    const value = data[key];
    return getPoint(index, value);
  });

  const dataPath = dataPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create polygon points for grid levels
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    return (
      SENSORY_LABELS.map((_, index) => {
        return getPoint(index, null, radius * level);
      })
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ") + " Z"
    );
  });

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <radialGradient
            id="radarGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop
              offset="0%"
              stopColor="hsl(var(--accent))"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--accent))"
              stopOpacity="0.1"
            />
          </radialGradient>
        </defs>

        {/* Grid Polygons */}
        {gridPolygons.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/10"
          />
        ))}

        {/* Grid lines (axes) */}
        {SENSORY_LABELS.map((_, index) => {
          const { x, y } = getPoint(index, null, radius);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/10"
            />
          );
        })}

        {/* Data path with gradient fill and stroke */}
        <path
          d={`${dataPath} Z`}
          fill="url(#radarGradient)"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]"
        />

        {/* Data points (dots) */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            className="fill-accent stroke-background stroke-2"
          />
        ))}

        {/* Labels */}
        {SENSORY_LABELS.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 30;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          const key = item.key as keyof SensoryData;
          const value = data[key];

          // Adjust text anchor based on position
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (Math.cos(angle) > 0.1) textAnchor = "start";
          else if (Math.cos(angle) < -0.1) textAnchor = "end";

          return (
            <g key={item.key}>
              <text
                x={x}
                y={y - 5}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-label fill-muted-foreground uppercase tracking-widest font-bold"
              >
                {item.label}
              </text>
              {value !== null && (
                <text
                  x={x}
                  y={y + 8}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  className="text-caption fill-foreground font-serif italic font-medium"
                >
                  {value.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
