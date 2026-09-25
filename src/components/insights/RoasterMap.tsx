"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { InsightsStats } from "@/lib/data/fetch-insights-stats";

/* ─── Helpers ──────────────────────────────────────────────────────── */
// Scale radius: 1 roaster = 12px, ~20 roasters = ~26px
function markerRadius(count: number): number {
  return 8 + Math.sqrt(count) * 4;
}

/** Matches UI tokens so markers track light/dark theme; top city highlighted */
function markerColor(isTop: boolean): { fill: string; stroke: string } {
  if (isTop) {
    return {
      fill: "var(--primary)",
      stroke: "color-mix(in oklch, var(--foreground) 42%, var(--primary))",
    };
  }
  return {
    fill: "var(--muted-foreground)",
    stroke:
      "color-mix(in oklch, var(--foreground) 35%, var(--muted-foreground))",
  };
}

/* ─── Map Component ────────────────────────────────────────────────── */
export function RoasterMap({
  cities,
}: {
  cities: InsightsStats["roaster_cities"];
}) {
  return (
    <div
      className="relative overflow-hidden rounded-sm"
      style={{ height: 380 }}
    >
      <MapContainer
        center={[22.5, 82.5]}
        zoom={4.3}
        zoomSnap={0}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        style={{ height: "100%", width: "100%", background: "transparent" }}
        attributionControl={false}
      >
        {/* CartoDB Positron — clean editorial tiles, no clutter */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* City labels layer (separate from base so labels sit on top of markers) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          zIndex={600}
        />

        {cities.map((r, i) => {
          if (r.lat == null || r.lng == null) return null;
          const { fill, stroke } = markerColor(i === 0);
          const radius = markerRadius(r.count);
          return (
            <CircleMarker
              key={r.city}
              center={[r.lat, r.lng]}
              radius={radius}
              pathOptions={{
                fillColor: fill,
                fillOpacity: 0.82,
                color: stroke,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="text-caption leading-snug">
                  <p className="text-label-large text-foreground">{r.city}</p>
                  <p>{r.state}</p>
                  <p className="mt-1 font-medium text-foreground">
                    {r.count} active roaster{r.count > 1 ? "s" : ""}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Subtle vignette — card token blends into ChartCard */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, color-mix(in oklch, var(--card) 72%, transparent) 100%)",
        }}
      />

      {/* Attribution — small, bottom-right */}
      <p className="text-micro absolute bottom-1 right-2 z-[1000] pointer-events-none text-muted-foreground/60">
        © CartoDB © OpenStreetMap contributors
      </p>
    </div>
  );
}
