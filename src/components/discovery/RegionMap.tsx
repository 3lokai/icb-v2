"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  AREA_AS_OF,
  AREA_SOURCE,
  MAP_DISTRICTS,
  MAP_HEIGHT,
  MAP_MARKERS,
  MAP_WIDTH,
  NE_AREA_AS_OF,
  NE_AREA_SOURCE,
  NE_HEIGHT,
  NE_STATES,
  NE_TOTAL_HA,
  NE_WIDTH,
  NRSC_NE_AREA_HA,
  STATE_SILHOUETTE,
} from "@/lib/discovery/region-map-geometry";

/**
 * A district's link into the directory, resolved on the server. Only districts that have a
 * page-bearing region appear here; the rest still render, shaded but inert, so the map
 * tells the truth about where coffee grows rather than only where ICB has pages.
 *
 * `href` is resolved by the caller on purpose. `regionBrowseHref` pulls ~1,300 lines of
 * landing-page config in with it, which is exactly the bundle problem `RegionSpotlight`
 * documents -- so this component never imports it.
 */
export type RegionMapLink = {
  /** Matches `MapDistrict.name` / `canon_regions.district`. */
  district: string;
  /**
   * The region the district links to, which is not always the district's own name --
   * Hassan's coffees live on the Sakleshpur page. Hectares are always reported against
   * the district, never against the region, because the atlas figure is a district figure
   * (Sakleshpur taluk is 35,620 of Hassan's 57,705).
   */
  label: string;
  href: string;
  coffeeCount: number;
};

/** Markers keyed by `canonSlug`, same shape, for regions drawn as a dot not a polygon. */
export type RegionMapMarkerLink = Omit<RegionMapLink, "district"> & {
  canonSlug: string;
};

type Props = {
  links: RegionMapLink[];
  markerLinks: RegionMapMarkerLink[];
  /** The `northeast-india` card, which the inset links to. Absent if it has no coffees. */
  northEast?: { label: string; href: string; coffeeCount: number };
  /**
   * Pre-rendered `RegionCard`s, keyed by district name or marker `canonSlug`.
   * Rendered on the server and passed in as nodes on purpose:
   * `RegionCard` imports `regionBrowseHref`, which pulls ~1,300 lines of landing-page
   * config with it, so importing the card here would ship all of that to the browser.
   * Only the active one is mounted, and its image is already loaded by the card grid
   * below, so switching regions costs no new request.
   */
  cardSlots: Record<string, ReactNode>;
  /**
   * The inset's card — all seven states share the one `northeast-india` card. Its own
   * prop rather than a key into `cardSlots`, because a shared key constant would have to
   * be exported from this file, and a Server Component importing a non-function export
   * from a `"use client"` module gets a client-reference proxy instead of the value.
   */
  northEastCard?: ReactNode;
};

/** Hover keys for the inset's states, namespaced so they cannot collide with a district. */
const neKey = (state: string) => `ne:${state}`;

/** Inset placement, in main-canvas units. Top-left is the only empty corner: the Arabian Sea. */
const NE_INSET_X = 2;
const NE_INSET_Y = 14;

/**
 * Fill strength per district, 0-1. Log-scaled because the range spans three orders of
 * magnitude (Kodagu 135,796 ha, Shivamogga 153) -- linear would render all but the top
 * three as blank paper and lose the fact that they grow coffee at all. Normalised across
 * the observed range, not against log(max) alone: log(153)/log(135796) is already 0.43,
 * so the naive form would spend none of the scale below its midpoint.
 */
/**
 * The area this map actually draws. NATIONAL_TOTAL_HA (445,369) is the atlas's national
 * figure and includes the 674 ha it records for the North-East, which the main map does
 * not shade — the inset carries the Coffee Board's separate 6,092 ha instead. Quoting the
 * national number beside "across 18 districts" claimed 673 ha the shapes never showed.
 */
const MAPPED_TOTAL_HA = MAP_DISTRICTS.reduce(
  (total, district) => total + district.areaHa,
  0
);

const MIN_LOG = Math.log(
  Math.min(...MAP_DISTRICTS.map((district) => district.areaHa))
);
const MAX_LOG = Math.log(
  Math.max(...MAP_DISTRICTS.map((district) => district.areaHa))
);

function intensity(areaHa: number): number {
  return (Math.log(areaHa) - MIN_LOG) / (MAX_LOG - MIN_LOG);
}

/**
 * The inset gets its own scale, deliberately. Its figures come from the Coffee Board
 * (registered planted area) and the main map's from the NRSC atlas (mapped canopy); for
 * the same six states those are 6,092 ha and 674 ha. Putting them on one ramp would say
 * Nagaland grows half as much coffee as Koraput, which is not a claim either source makes.
 */
const NE_MIN_LOG = Math.log(
  Math.min(...NE_STATES.map((state) => state.areaHa))
);
const NE_MAX_LOG = Math.log(
  Math.max(...NE_STATES.map((state) => state.areaHa))
);

function neFill(areaHa: number): string {
  const t = (Math.log(areaHa) - NE_MIN_LOG) / (NE_MAX_LOG - NE_MIN_LOG);
  return `color-mix(in oklch, var(--primary) ${Math.round(22 + t * 68)}%, var(--card))`;
}

/** Legend stops, chosen to sit on the real distribution rather than at even intervals. */
const LEGEND_STOPS = [153, 3997, 35423, 135796];

/** Western grouping, to match the "445,369 hectares" line the page already renders. */
const numberFormat = new Intl.NumberFormat("en-US");

function fill(areaHa: number): string {
  // Floor at 22% rather than 0: the lightest district still has to read against the land
  // silhouette behind it, or Shivamogga's 153 ha vanish into "no coffee here".
  const percent = Math.round(22 + intensity(areaHa) * 68);
  return `color-mix(in oklch, var(--primary) ${percent}%, var(--card))`;
}

export function RegionMap({
  links,
  markerLinks,
  northEast,
  cardSlots,
  northEastCard,
}: Props) {
  const titleId = useId();
  const [active, setActive] = useState<string | null>(null);

  const linkByDistrict = new Map(links.map((link) => [link.district, link]));
  const markerBySlug = new Map(
    markerLinks.map((link) => [link.canonSlug, link])
  );

  const activeDistrict = MAP_DISTRICTS.find((d) => d.name === active);
  const activeNeState = NE_STATES.find((state) => neKey(state.name) === active);
  // All seven inset states share the one `northeast-india` card; everything else keys on
  // its own district name or marker slug.
  const activeCard = activeNeState
    ? northEastCard
    : active
      ? cardSlots[active]
      : undefined;

  return (
    <figure className="m-0 flex flex-col gap-6">
      {/*
        active is cleared here, not on the shapes. The card is a link, and clearing it on
        each shape's mouseleave meant the card vanished the instant you moved toward it —
        it could be read but never clicked. Keyboard has the same trap: blur fires before
        focus reaches the card. So shapes only ever set active; leaving the pair clears it.
      */}
      <div
        className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
        }}
        onMouseLeave={() => setActive(null)}
      >
        <div className="relative mx-auto w-full max-w-[26rem] md:mx-0 md:max-w-[30rem]">
          <svg
            aria-labelledby={titleId}
            className="h-auto w-full"
            role="img"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          >
            <title id={titleId}>
              Peninsular India, with the eighteen districts the plantation atlas
              records coffee in shaded by area under coffee.
            </title>

            {/*
              Land under the choropleth. Stroked in its own fill colour because each district
              was simplified independently at build time, which can open hairline cracks
              between neighbours; a 1.5px stroke closes them.
            */}
            <path
              d={STATE_SILHOUETTE}
              fill="var(--muted)"
              stroke="var(--muted)"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />

            {MAP_DISTRICTS.map((district) => {
              const link = linkByDistrict.get(district.name);
              const isActive = active === district.name;
              const shape = (
                <path
                  className="transition-[fill-opacity] duration-150"
                  d={district.d}
                  fill={fill(district.areaHa)}
                  fillOpacity={active && !isActive ? 0.55 : 1}
                  stroke={isActive ? "var(--accent)" : "var(--background)"}
                  strokeWidth={isActive ? 2 : 0.6}
                  vectorEffect="non-scaling-stroke"
                />
              );

              // Districts with a page are real links: focusable, keyboard-reachable, and
              // announced by name. Districts without one are inert but still shaded.
              return link ? (
                <Link
                  className="cursor-pointer outline-none"
                  href={link.href}
                  key={district.name}
                  onFocus={() => setActive(district.name)}
                  onMouseEnter={() => setActive(district.name)}
                >
                  <title>{`${district.name} — ${numberFormat.format(district.areaHa)} ha, ${link.coffeeCount} coffees on ${link.label}`}</title>
                  {shape}
                </Link>
              ) : (
                <g
                  aria-label={`${district.name} — ${numberFormat.format(district.areaHa)} ha, no coffees listed yet`}
                  key={district.name}
                  onMouseEnter={() => setActive(district.name)}
                  role="img"
                >
                  <title>{`${district.name} — ${numberFormat.format(district.areaHa)} ha, no coffees listed yet`}</title>
                  {shape}
                </g>
              );
            })}

            {northEast ? (
              /*
                The North-East is ~1,800km from the rest and is shaded from a different
                source, so it is an inset on its own projection with its own scale. The rule
                and the separate legend line mark it as a separate claim, not a neighbour.
              */
              <g transform={`translate(${NE_INSET_X} ${NE_INSET_Y})`}>
                {NE_STATES.map((state) => {
                  const isActive = active === neKey(state.name);
                  return (
                    <Link
                      className="cursor-pointer outline-none"
                      href={northEast.href}
                      key={state.name}
                      onFocus={() => setActive(neKey(state.name))}
                      onMouseEnter={() => setActive(neKey(state.name))}
                    >
                      <title>{`${state.name} — ${numberFormat.format(state.areaHa)} ha planted`}</title>
                      {/*
                        Each state is all of its districts concatenated, so it is stroked in
                        its own fill colour: any contrasting stroke redraws every internal
                        district border and the state reads as a mesh. Hover is therefore a
                        fill change, since there is no dissolved perimeter to outline.
                      */}
                      <path
                        d={state.d}
                        fill={
                          isActive
                            ? "color-mix(in oklch, var(--accent) 55%, var(--card))"
                            : neFill(state.areaHa)
                        }
                        stroke={
                          isActive
                            ? "color-mix(in oklch, var(--accent) 55%, var(--card))"
                            : neFill(state.areaHa)
                        }
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                      />
                    </Link>
                  );
                })}
                <line
                  opacity={0.5}
                  stroke="var(--border)"
                  strokeWidth={1}
                  x1={0}
                  x2={NE_WIDTH}
                  y1={NE_HEIGHT + 8}
                  y2={NE_HEIGHT + 8}
                />
                <text
                  fill="var(--muted-foreground)"
                  fontSize={17}
                  x={0}
                  y={NE_HEIGHT + 26}
                >
                  North-East India
                </text>
              </g>
            ) : null}

            {MAP_MARKERS.map((marker) => {
              const link = markerBySlug.get(marker.canonSlug);
              if (!link) return null;
              return (
                <Link
                  className="cursor-pointer outline-none"
                  href={link.href}
                  key={marker.canonSlug}
                  onFocus={() => setActive(marker.canonSlug)}
                  onMouseEnter={() => setActive(marker.canonSlug)}
                >
                  <title>{`${link.label} — ${link.coffeeCount} coffees`}</title>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    fill="var(--accent)"
                    r={active === marker.canonSlug ? 9 : 6}
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                </Link>
              );
            })}
          </svg>
        </div>

        {/*
        The card slot is width-capped and min-height-reserved so that moving across the map
        never reflows the row — an empty slot and the widest card occupy the same box.
      */}
        <div className="mx-auto w-full max-w-[17rem] md:mx-0 md:min-h-[22rem]">
          {activeCard ? (
            activeCard
          ) : (
            <div className="flex h-full flex-col justify-center gap-1 py-4">
              {activeNeState ? (
                <>
                  <p className="text-title">{activeNeState.name}</p>
                  <p className="text-body-muted">
                    {numberFormat.format(activeNeState.areaHa)} ha planted
                  </p>
                </>
              ) : activeDistrict ? (
                <>
                  <p className="text-title">{activeDistrict.name}</p>
                  <p className="text-body-muted">
                    {numberFormat.format(activeDistrict.areaHa)} ha under coffee
                    · no coffees listed yet
                  </p>
                </>
              ) : (
                <p className="text-body-muted">
                  {numberFormat.format(MAPPED_TOTAL_HA)} hectares across 18
                  districts. Hover a region to see it.
                </p>
              )}
            </div>
          )}

          {/*
          The card carries the coffee count; this line carries the sourced area figure,
          which the card has no slot for. Reported against whatever the hovered shape
          actually is — the district for the main map, the state for the inset.
        */}
          {activeCard ? (
            <p className="text-micro mt-2 tabular-nums opacity-70">
              {activeNeState
                ? `${activeNeState.name} — ${numberFormat.format(activeNeState.areaHa)} ha planted`
                : activeDistrict
                  ? `${activeDistrict.name} — ${numberFormat.format(activeDistrict.areaHa)} ha under coffee`
                  : null}
            </p>
          ) : null}
        </div>
      </div>

      {/* Legend and citations run full width under both columns. */}
      <figcaption className="flex flex-col gap-3 border-t border-border/60 pt-4">
        <div className="flex flex-col gap-1.5 sm:max-w-xs">
          <div className="flex items-center gap-1">
            {LEGEND_STOPS.map((stop) => (
              <span
                className="h-3 flex-1 first:rounded-l-xs last:rounded-r-xs"
                key={stop}
                style={{ background: fill(stop) }}
              />
            ))}
          </div>
          <div className="text-micro flex justify-between tabular-nums opacity-70">
            <span>153 ha</span>
            <span>135,796 ha</span>
          </div>
        </div>

        <p className="text-micro opacity-70">
          Main map: area under coffee mapped by {AREA_SOURCE}, {AREA_AS_OF}.
          Shading is log-scaled.
        </p>

        {/*
          The inset's citation is separate and states the conflict outright, because the
          two figures are not comparable and a reader who assumes one scale will misread
          the map. This is the `area_source` rule in the handover doc, at 9x.
        */}
        <p className="text-micro opacity-70">
          Inset: {numberFormat.format(NE_TOTAL_HA)} ha planted across seven
          states, {NE_AREA_SOURCE}, {NE_AREA_AS_OF}, on its own scale. The atlas
          maps only {numberFormat.format(NRSC_NE_AREA_HA)} ha of North-Eastern
          canopy and publishes no breakdown by state — the Coffee Board counts
          registered planted area, including stock not yet bearing, so the two
          are not comparable.
        </p>
      </figcaption>
    </figure>
  );
}
