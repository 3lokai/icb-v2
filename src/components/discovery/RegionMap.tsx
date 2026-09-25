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
 * the same seven states those are 6,092 ha and 674 ha. Putting them on one ramp would say
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

/** Western grouping, to match the hectares line the page already renders. */
const numberFormat = new Intl.NumberFormat("en-US");

const coffees = (n: number) => `${n} ${n === 1 ? "coffee" : "coffees"}`;

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
  /*
    Hover and focus are separate states, not one `active`. They used to share it, and hover
    always won: leaving the map with the pointer wiped the panel of a shape the keyboard was
    still focused on, and crossing shapes on the way to the card swapped it out from under
    you. Pointer intent is explicit, so hover takes precedence while it exists — but when
    the pointer leaves, the display falls back to whatever still holds focus.
  */
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = hovered ?? focused;

  const linkByDistrict = new Map(links.map((link) => [link.district, link]));
  const markerBySlug = new Map(
    markerLinks.map((link) => [link.canonSlug, link])
  );

  const activeDistrict = MAP_DISTRICTS.find((d) => d.name === active);
  const activeLink = active ? linkByDistrict.get(active) : undefined;
  const activeMarker = active ? markerBySlug.get(active) : undefined;
  const activeNeState = NE_STATES.find((state) => neKey(state.name) === active);

  /*
    One text summary of the current selection, used by the compact mobile panel and by the
    desktop slot whenever there is no plate to show. Mobile gets this instead of the full
    `RegionCard`: the plate is ~440px tall stacked under the map, and swapping it in and out
    shoved the grid down the page. A fixed-height text block says the same facts and holds
    its position.
  */
  const summary = activeNeState
    ? {
        name: activeNeState.name,
        facts: `${numberFormat.format(activeNeState.areaHa)} ha planted`,
        destination: northEast,
      }
    : activeMarker
      ? {
          name: activeMarker.label,
          facts: coffees(activeMarker.coffeeCount),
          destination: activeMarker,
        }
      : activeDistrict
        ? {
            name: activeLink?.label ?? activeDistrict.name,
            // A district with a link but no plate is a region the directory carries without
            // a guide of its own — it has coffees, so it must not be described as empty.
            facts: `${numberFormat.format(activeDistrict.areaHa)} ha under coffee · ${
              activeLink
                ? coffees(activeLink.coffeeCount)
                : "no coffees listed yet"
            }`,
            destination: activeLink,
          }
        : undefined;
  // All seven inset states share the one `northeast-india` card; everything else keys on
  // its own district name or marker slug.
  const activeCard = activeNeState
    ? northEastCard
    : active
      ? cardSlots[active]
      : undefined;

  return (
    /*
      Capped and centred rather than filling the 7xl shell. The map and its panel are only
      ~784px of intrinsic content, so at full width they sat in the left two-thirds with a
      dead column beside them, above a grid that does span edge to edge. Capping also pulls
      the citation paragraphs back to a readable measure — at 1216px they ran to ~180
      characters a line.
    */
    <figure className="mx-auto my-0 flex max-w-4xl flex-col gap-6">
      <h2 className="sr-only">Coffee-growing districts of India</h2>
      {/*
        Both states are cleared here, not on the shapes. The card is a link, and clearing on
        each shape's mouseleave meant the card vanished the instant you moved toward it —
        it could be read but never clicked. Keyboard has the same trap: blur fires before
        focus reaches the card. So shapes only ever set; leaving the pair clears.
      */}
      <div
        className="flex flex-col gap-4 md:flex-row md:items-start md:justify-center md:gap-8"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(null);
        }}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="relative mx-auto w-full max-w-[26rem] md:mx-0 md:max-w-[30rem]">
          <svg
            aria-labelledby={titleId}
            className="h-auto w-full"
            role="img"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          >
            {/* One child, not two: React 19 renders nothing at all for a `<title>` given an
                array of children, which silently strips the map's accessible name. */}
            <title id={titleId}>
              {`Peninsular India, with the ${MAP_DISTRICTS.length} districts the plantation atlas records coffee in shaded by area under coffee.${
                northEast
                  ? " A separate inset, on its own scale, shows the seven North-Eastern states."
                  : ""
              }`}
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
                  className="transition-[fill-opacity] duration-150 motion-reduce:transition-none"
                  d={district.d}
                  fill={fill(district.areaHa)}
                  fillOpacity={active && !isActive ? 0.55 : 1}
                  stroke={isActive ? "var(--accent)" : "var(--background)"}
                  strokeWidth={isActive ? 2 : 0.6}
                  vectorEffect="non-scaling-stroke"
                />
              );

              // A district with a destination is a real link, so the keyboard path is the
              // shape itself: Tab to it, hear the title, press Enter. Nothing in the panel
              // is unreachable, because the panel's link and the shape share an href.
              //
              // A district with no destination carries only facts, and those used to be
              // pointer-only. It is focusable in its own right so the panel is reachable;
              // `group` rather than `img` because it has no graphical meaning to convey,
              // just a label and a description the panel expands on.
              return link ? (
                <Link
                  className="cursor-pointer outline-none"
                  href={link.href}
                  key={district.name}
                  onFocus={() => setFocused(district.name)}
                  onMouseEnter={() => setHovered(district.name)}
                >
                  <title>{`${district.name} — ${numberFormat.format(district.areaHa)} ha, ${coffees(link.coffeeCount)} on ${link.label}`}</title>
                  {shape}
                </Link>
              ) : (
                <g
                  aria-label={`${district.name} — ${numberFormat.format(district.areaHa)} ha, no coffees listed yet`}
                  className="outline-none"
                  key={district.name}
                  onFocus={() => setFocused(district.name)}
                  onMouseEnter={() => setHovered(district.name)}
                  role="group"
                  tabIndex={0}
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
                      onFocus={() => setFocused(neKey(state.name))}
                      onMouseEnter={() => setHovered(neKey(state.name))}
                    >
                      {/* All seven open the same aggregate page, which the title has to
                          say outright — otherwise seven differently-named links that go to
                          one destination read as seven destinations. */}
                      <title>{`${state.name} — ${numberFormat.format(state.areaHa)} ha planted, on ${northEast.label}`}</title>
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
                {/*
                  SVG text scales with the map, so this is sized against the worst case:
                  at a 390px viewport the map renders ~358px wide, a 0.58 scale, and the
                  old 17 units landed at ~9.8px. 24 units lands at ~13.9px there and
                  ~18.6px on desktop. "India" is dropped because 16 characters at this size
                  overrun NE_WIDTH, and the map is already India.
                */}
                <text
                  fill="var(--muted-foreground)"
                  fontSize={24}
                  x={0}
                  y={NE_HEIGHT + 30}
                >
                  North-East
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
                  onFocus={() => setFocused(marker.canonSlug)}
                  onMouseEnter={() => setHovered(marker.canonSlug)}
                >
                  <title>{`${link.label} — ${coffees(link.coffeeCount)}`}</title>
                  {/*
                    Hit area first, drawn invisible and larger than the dot. The visible
                    marker was a ~9px target on desktop and ~7px on mobile; 16 units of
                    radius brings that to ~25px and ~18.5px. It does overlap the
                    Chikkamagaluru polygon beneath — which is the right trade here, because
                    that spot IS Baba Budangiri. Mobile still misses the 24px guideline; the
                    real fix is a text alternative beside the map, not a bigger circle.
                  */}
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    fill="transparent"
                    r={16}
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    fill="var(--accent)"
                    r={active === marker.canonSlug ? 10 : 7}
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                </Link>
              );
            })}
          </svg>
        </div>

        {/*
        Width-capped and height-reserved so that moving across the map never reflows the
        row — an empty slot and the widest card occupy the same box. Two reservations,
        because the two panels are different heights: the desktop plate needs 22rem, the
        mobile text block needs 6rem. Both are constant, so neither shifts the grid below.
      */}
        <div className="mx-auto min-h-[6rem] w-full max-w-[17rem] md:mx-0 md:min-h-[22rem]">
          {/*
            Desktop: the full plate, the same one the grid below shows.
            Mobile: never the plate. Tapping a linked shape navigates straight through (it
            is a real anchor, and going direct is the right mobile behaviour), so this panel
            is what makes the six destination-less districts worth touching at all.
          */}
          <div className="hidden md:block md:h-full">
            {activeCard ?? (
              <div className="flex h-full flex-col justify-center gap-1 py-4">
                {summary ? (
                  <>
                    <p className="text-title">{summary.name}</p>
                    <p className="text-body-muted">{summary.facts}</p>
                  </>
                ) : (
                  <p className="text-body-muted">
                    {numberFormat.format(MAPPED_TOTAL_HA)} hectares across{" "}
                    {MAP_DISTRICTS.length} districts. Select a region to see it.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex h-[6rem] flex-col justify-center gap-0.5 md:hidden">
            {summary ? (
              <>
                <p className="text-heading">{summary.name}</p>
                <p className="text-caption">{summary.facts}</p>
                {summary.destination ? (
                  <Link
                    className="text-label text-accent hover:underline"
                    href={summary.destination.href}
                  >
                    {`Explore ${summary.destination.label} →`}
                  </Link>
                ) : null}
              </>
            ) : (
              <p className="text-caption">
                {numberFormat.format(MAPPED_TOTAL_HA)} hectares across{" "}
                {MAP_DISTRICTS.length} districts. Select a region to see it.
              </p>
            )}
          </div>

          {/*
          The card carries the coffee count; this line carries the sourced area figure,
          which the card has no slot for. Reported against whatever the hovered shape
          actually is — the district for the main map, the state for the inset.
        */}
          {activeCard ? (
            <p className="text-micro mt-2 hidden tabular-nums opacity-70 md:block">
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
        {/*
          The ramp used to label only its endpoints and never said what it measured — four
          colour bands and two numbers, with "area under coffee" stranded in the paragraph
          below. Every stop is labelled now, and the swatches are aria-hidden because the
          numbers carry the scale for anyone who cannot see the colour.
        */}
        <div className="flex flex-col gap-1.5 sm:max-w-sm">
          <p className="text-micro font-medium">
            Area under coffee, per district
          </p>
          <div aria-hidden="true" className="flex items-center gap-1">
            {LEGEND_STOPS.map((stop) => (
              <span
                className="h-3 flex-1 first:rounded-l-xs last:rounded-r-xs"
                key={stop}
                style={{ background: fill(stop) }}
              />
            ))}
          </div>
          <div className="text-micro flex justify-between tabular-nums opacity-70">
            {LEGEND_STOPS.map((stop, index) => (
              <span key={stop}>
                {numberFormat.format(stop)}
                {index === LEGEND_STOPS.length - 1 ? " ha" : ""}
              </span>
            ))}
          </div>
        </div>

        <p className="text-micro opacity-70">
          Main map: area under coffee mapped by {AREA_SOURCE}, {AREA_AS_OF}.
          Shading is log-scaled.
        </p>

        {/*
          Moved down from the page intro, where it was the third caveat a reader met before
          seeing anything. It belongs with the other provenance, not ahead of the map.
        */}
        <p className="text-micro opacity-70">
          Coffee counts include every sub-region, so a district total covers the
          estates and hill belts inside it. Parent and sub-region totals overlap
          and should not be added together.
        </p>

        {/*
          The inset's citation is separate and states the conflict outright, because the
          two figures are not comparable and a reader who assumes one scale will misread
          the map. This is the `area_source` rule in the handover doc, at 9x. Gated on the
          same condition as the inset itself: describing a scale the reader cannot see is
          worse than saying nothing.
        */}
        {northEast ? (
          <p className="text-micro opacity-70">
            Inset: {numberFormat.format(NE_TOTAL_HA)} ha planted across seven
            states, {NE_AREA_SOURCE}, {NE_AREA_AS_OF}, on its own scale. The
            atlas maps only {numberFormat.format(NRSC_NE_AREA_HA)} ha of
            North-Eastern canopy and publishes no breakdown by state — the
            Coffee Board counts registered planted area, including stock not yet
            bearing, so the two are not comparable.
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
