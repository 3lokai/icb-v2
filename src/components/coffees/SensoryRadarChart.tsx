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
  const getPoint = (index: number, value: number | null) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const normalizedValue = value !== null ? value / MAX_VALUE : 0;
    const distance = radius * normalizedValue;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Create polygon points
  const points = SENSORY_LABELS.map((_, index) => {
    const key = SENSORY_LABELS[index].key as keyof SensoryData;
    const value = data[key];
    return getPoint(index, value);
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create grid circles (3 levels)
  const gridLevels = [0.33, 0.66, 1.0];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Grid circles */}
        {gridLevels.map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/20"
          />
        ))}

        {/* Grid lines (axes) */}
        {SENSORY_LABELS.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
          );
        })}

        {/* Data path */}
        <path
          d={`${pathData} Z`}
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent"
        />

        {/* Labels */}
        {SENSORY_LABELS.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 20;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          const key = item.key as keyof SensoryData;
          const value = data[key];

          return (
            <g key={item.key}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-caption fill-foreground font-medium"
                fontSize="11"
              >
                {item.label}
              </text>
              {value !== null && (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-caption fill-muted-foreground"
                  fontSize="9"
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
