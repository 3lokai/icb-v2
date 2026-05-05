"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Data ──────────────────────────────────────────────────────────── */
const roasters = [
  {
    city: "Bangalore",
    state: "Karnataka",
    count: 18,
    lat: 12.9716,
    lng: 77.5946,
  },
  { city: "New Delhi", state: "Delhi", count: 10, lat: 28.6139, lng: 77.209 },
  { city: "Mumbai", state: "Maharashtra", count: 9, lat: 19.076, lng: 72.8777 },
  {
    city: "Hyderabad",
    state: "Telangana",
    count: 4,
    lat: 17.385,
    lng: 78.4867,
  },
  { city: "Pune", state: "Maharashtra", count: 4, lat: 18.5204, lng: 73.8567 },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    count: 3,
    lat: 13.0827,
    lng: 80.2707,
  },
  { city: "Coorg", state: "Karnataka", count: 3, lat: 12.3375, lng: 75.8069 },
  { city: "Gurugram", state: "Haryana", count: 2, lat: 28.4595, lng: 77.0266 },
  { city: "Jaipur", state: "Rajasthan", count: 2, lat: 26.9124, lng: 75.7873 },
  {
    city: "Chikmagalur",
    state: "Karnataka",
    count: 2,
    lat: 13.3161,
    lng: 75.772,
  },
  { city: "Kohima", state: "Nagaland", count: 1, lat: 25.6751, lng: 94.1086 },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */
// Scale radius: smallest city = 8px, Bangalore = ~24px
function markerRadius(count: number): number {
  return 8 + Math.sqrt(count) * 4;
}

/** Matches UI tokens so markers track light/dark theme */
function markerColor(city: string): { fill: string; stroke: string } {
  if (city === "Bangalore") {
    return {
      fill: "var(--primary)",
      stroke: "color-mix(in oklch, var(--foreground) 42%, var(--primary))",
    };
  }
  if (city === "Kohima") {
    return {
      fill: "var(--accent)",
      stroke: "color-mix(in oklch, var(--foreground) 42%, var(--accent))",
    };
  }
  return {
    fill: "var(--muted-foreground)",
    stroke:
      "color-mix(in oklch, var(--foreground) 35%, var(--muted-foreground))",
  };
}

/* ─── Map Component ────────────────────────────────────────────────── */
export function RoasterMap() {
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

        {roasters.map((r) => {
          const { fill, stroke } = markerColor(r.city);
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
