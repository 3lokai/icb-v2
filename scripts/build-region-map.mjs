/**
 * Projects India's coffee-district boundaries into SVG path strings, once, at author
 * time. The output (src/lib/discovery/region-map-geometry.ts) is committed; nothing
 * geographic ships to the browser and nothing is projected at runtime, because district
 * boundaries do not change between deploys.
 *
 *   node scripts/build-region-map.mjs
 *
 * Sources (downloaded into scripts/data/, gitignored -- see downloadSources below):
 *   - udit-001/india-maps-data, per-state district GeoJSON (post-2022 districts, which
 *     is what gets us Alluri Sitharama Raju instead of pre-split Visakhapatnam)
 *   - hectares under coffee from the Coffee Board / NRSC plantation atlas, transcribed
 *     in icb-claude/docs/reference/nrsc-atlas-2024.json
 *
 * Frame: the five southern coffee states, not all of India. Fitting to the full country
 * puts every district in the bottom-left eighth of the box and makes Kodagu a 25px
 * target. The North-East gets its own projection, drawn as an inset -- the two are ~1,800km
 * apart, and one frame holding both wastes the whole middle of the canvas on Madhya Pradesh.
 */

import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { geoMercator } from "d3-geo";

const DATA_DIR = path.join(import.meta.dirname, "data");
const OUT_FILE = path.join(
  import.meta.dirname,
  "..",
  "src",
  "lib",
  "discovery",
  "region-map-geometry.ts"
);

/** The five states the plantation atlas reports coffee in. Districts come only from these. */
const STATES = [
  "karnataka",
  "kerala",
  "tamil-nadu",
  "andhra-pradesh",
  "odisha",
];

/**
 * Geometry loaded for the silhouette only. Telangana grows no coffee, but leaving it out
 * bites a Telangana-shaped hole out of the middle of the map, which reads as a rendering
 * bug rather than as "not a coffee state". Goa closes the north-west corner of the coast.
 */
const CONTEXT_STATES = ["telangana", "goa"];

/**
 * The North-East, shaded by a different source from the main map, on purpose.
 *
 * The NRSC atlas treats these six states as one unit -- "NORTH-EASTERN COFFEE GROWING
 * REGION ... 674" -- and publishes no per-state breakdown, so there is nothing to
 * shade with. The Coffee Board does publish per-state figures, and they are the only
 * per-state numbers that exist, so the inset uses those and carries its own citation.
 *
 * The two are NOT comparable and must never share a colour scale: NRSC maps remotely
 * sensed plantation canopy (674 ha), the Coffee Board counts registered planted area
 * including immature stock (6,092 ha, of which only 2,094 ha is bearing). That is the
 * `area_source` rule in the handover doc, at 9x instead of the 65% it warns about.
 *
 * Manipur is here and absent from the NRSC six -- another reason the two cannot be mixed.
 *
 * Source: Coffee Board of India, "Database on Coffee" July 2024 Table 1.5, and Annual
 * Report 2023-24 s3.1. Crop year 2023-24, provisional. Planted area, hectares.
 */
const NE_STATE_AREA_HA = {
  Nagaland: 1505,
  Mizoram: 1503,
  Meghalaya: 1320,
  Assam: 578,
  "Arunachal Pradesh": 561,
  Tripura: 402,
  Manipur: 222,
};

const NE_STATES = [
  "assam",
  "arunachal-pradesh",
  "mizoram",
  "meghalaya",
  "nagaland",
  "tripura",
  "manipur",
];

/** What the NRSC atlas reports for its six NE states, as the contrast in the footnote. */
const NRSC_NE_AREA_HA = 674;

/**
 * The Coffee Board's published NER total, 6,092.32 ha. Taken from the source rather than
 * summed from the rounded per-state values above, which come to 6,091.
 */
const NE_TOTAL_HA = 6092;

/** Inset canvas, sized to the North-East's own bounding box. */
const NE_WIDTH = 190;
const NE_HEIGHT = 170;
const STATE_GEOJSON_BASE =
  "https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/states";
/**
 * Douglas-Peucker tolerance, in projected pixels. The district files are survey
 * resolution -- 868 KB of path string at full fidelity, for shapes drawn 620px wide.
 * 0.6px is under half a CSS pixel of error and cuts that by ~95%.
 */
const SIMPLIFY_PX = 0.6;

/**
 * Tolerance for the faint state silhouettes behind the choropleth. They carry no detail,
 * so they can lose an order of magnitude more. Simplifying neighbours independently can
 * open hairline cracks between them; the silhouette is stroked in its own fill colour to
 * close those, which also means it must be drawn before the districts, never over them.
 */
const CONTEXT_SIMPLIFY_PX = 2.5;

/** Projected canvas. ~0.92 w/h matches the five-state bounding box, so fitSize wastes no margin. */
const WIDTH = 620;
const HEIGHT = 680;

/**
 * Hectares under coffee per district, Coffee Plantation Atlas of India (NRSC/ISRO +
 * Coffee Board, September 2024), `published_district_totals`. Sums to the published
 * national 445,369 ha. Keys are the atlas's spellings -- DISTRICT_ALIASES bridges them
 * to the boundary file where they differ.
 */
const AREA_HA = {
  Kodagu: 135796,
  Chikkamagaluru: 106654,
  Hassan: 57705,
  Chamarajanagar: 635,
  Shivamogga: 153,
  Dindigul: 13862,
  Salem: 8486,
  Nilgiris: 7228,
  Theni: 3997,
  Coimbatore: 2244,
  Namakkal: 1144,
  Wayanad: 52762,
  Idukki: 9465,
  Palakkad: 5245,
  "Alluri Sitharama Raju": 35423,
  Koraput: 2918,
  Rayagada: 624,
  Kalahandi: 355,
};

/** atlas spelling -> boundary-file spelling. One entry today; the rest match exactly. */
const DISTRICT_ALIASES = {
  Chamarajanagar: "Chamarajanagara",
};

/**
 * ponytail: one hardcoded point, not a table. Baba Budangiri is the only page-bearing
 * region whose district (Chikkamagaluru) is already claimed by another card, so it is the
 * only one that needs a dot instead of a polygon. Sakleshpur is also sub-district, but
 * nothing else competes for Hassan, so the Hassan polygon carries it. Real taluk and
 * hill-range boundaries would replace this -- see the taluk note in the handover doc.
 */
const MARKERS = [
  {
    canonSlug: "baba-budangiri",
    label: "Baba Budangiri",
    lngLat: [75.73, 13.4],
  },
];

async function download(url, name) {
  const file = path.join(DATA_DIR, name);
  if (existsSync(file)) return file;
  process.stdout.write(`  downloading ${name}\n`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${name} -> HTTP ${response.status}`);
  }
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
  return file;
}

async function downloadSources() {
  await mkdir(DATA_DIR, { recursive: true });
  for (const state of [...STATES, ...CONTEXT_STATES, ...NE_STATES]) {
    await download(
      `${STATE_GEOJSON_BASE}/${state}.geojson`,
      `${state}.geojson`
    );
  }
}

/**
 * Ramer-Douglas-Peucker over one projected ring. Iterative rather than recursive: a few
 * of these rings are 20k points and the recursive form blows the stack on the worst of them.
 */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  const toleranceSq = tolerance * tolerance;

  while (stack.length > 0) {
    const [first, last] = stack.pop();
    const [ax, ay] = points[first];
    const [bx, by] = points[last];
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSq = dx * dx + dy * dy;

    let farthest = -1;
    let farthestDistSq = toleranceSq;
    for (let i = first + 1; i < last; i += 1) {
      const [px, py] = points[i];
      // Perpendicular distance to the segment, squared. A degenerate segment (both ends
      // on the same point, which closed rings produce) falls back to distance from `a`.
      let distSq;
      if (lengthSq === 0) {
        distSq = (px - ax) ** 2 + (py - ay) ** 2;
      } else {
        let t = ((px - ax) * dx + (py - ay) * dy) / lengthSq;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        distSq = (px - (ax + t * dx)) ** 2 + (py - (ay + t * dy)) ** 2;
      }
      if (distSq > farthestDistSq) {
        farthest = i;
        farthestDistSq = distSq;
      }
    }

    if (farthest !== -1) {
      keep[farthest] = 1;
      stack.push([first, farthest], [farthest, last]);
    }
  }

  return points.filter((_, index) => keep[index] === 1);
}

/** GeoJSON ring (lng/lat) -> simplified projected ring, as an SVG subpath. */
function ringToSubpath(ring, projection, closed, tolerance = SIMPLIFY_PX) {
  const projected = [];
  for (const coordinate of ring) {
    const point = projection(coordinate);
    // Points outside the projection's clip extent come back null.
    if (point) projected.push(point);
  }
  const simplified = simplify(projected, tolerance);
  if (simplified.length < 2) return "";
  const d = simplified
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    )
    .join("");
  return closed ? `${d}Z` : d;
}

/** Polygon / MultiPolygon / LineString / MultiLineString -> one SVG path string. */
function geometryToPath(geometry, projection, tolerance = SIMPLIFY_PX) {
  const { type, coordinates } = geometry;
  if (type === "Polygon") {
    return coordinates
      .map((ring) => ringToSubpath(ring, projection, true, tolerance))
      .join("");
  }
  if (type === "MultiPolygon") {
    return coordinates
      .flat()
      .map((ring) => ringToSubpath(ring, projection, true, tolerance))
      .join("");
  }
  throw new Error(`Unsupported geometry: ${type}`);
}

async function loadFeatures(states) {
  const features = [];
  for (const state of states) {
    const raw = await readFile(path.join(DATA_DIR, `${state}.geojson`), "utf8");
    features.push(...JSON.parse(raw).features);
  }
  return features;
}

function main() {
  return downloadSources().then(async () => {
    const features = await loadFeatures(STATES);
    const contextFeatures = [
      ...features,
      ...(await loadFeatures(CONTEXT_STATES)),
    ];

    const byDistrict = new Map(
      features.map((feature) => [feature.properties.district, feature])
    );

    // Resolve every atlas district up front and fail on the first miss. A district that
    // silently fell out would read as a hole in the map that nobody would think to look for.
    const resolved = Object.entries(AREA_HA).map(([atlasName, areaHa]) => {
      const boundaryName = DISTRICT_ALIASES[atlasName] ?? atlasName;
      const feature = byDistrict.get(boundaryName);
      if (!feature) {
        throw new Error(
          `No boundary for "${atlasName}" (looked up "${boundaryName}"). ` +
            `Add an entry to DISTRICT_ALIASES.`
        );
      }
      return {
        name: atlasName,
        state: feature.properties.st_nm,
        areaHa,
        feature,
      };
    });

    // One projection for the whole canvas, fitted to the five states rather than to the
    // districts alone, so there is room around the belt for the coastline to read.
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], {
      type: "FeatureCollection",
      features: contextFeatures,
    });

    // The North-East on its own projection, drawn as an inset, and shaded per state from
    // the Coffee Board rather than from the atlas -- see NE_STATE_AREA_HA for why.
    const neFeatures = await loadFeatures(NE_STATES);
    const neProjection = geoMercator().fitSize([NE_WIDTH, NE_HEIGHT], {
      type: "FeatureCollection",
      features: neFeatures,
    });
    const neStates = Object.entries(NE_STATE_AREA_HA)
      .map(([name, areaHa]) => {
        const members = neFeatures.filter(
          (feature) => feature.properties.st_nm === name
        );
        if (members.length === 0) {
          throw new Error(`No boundary features for NE state "${name}".`);
        }
        return {
          name,
          areaHa,
          // Every district of the state as one path. Stroked in its own fill colour at
          // render time, which is what dissolves the internal borders.
          d: members
            .map((feature) =>
              geometryToPath(
                feature.geometry,
                neProjection,
                CONTEXT_SIMPLIFY_PX
              )
            )
            .join(""),
        };
      })
      .sort((a, b) => b.areaHa - a.areaHa);

    const silhouette = contextFeatures
      .map((feature) =>
        geometryToPath(feature.geometry, projection, CONTEXT_SIMPLIFY_PX)
      )
      .join("");

    const districts = resolved
      // Largest first so the tiny ones (Shivamogga, 153 ha) paint on top and stay clickable.
      .sort((a, b) => b.areaHa - a.areaHa)
      .map(({ name, state, areaHa, feature }) => ({
        name,
        state,
        areaHa,
        d: geometryToPath(feature.geometry, projection),
      }));

    const markers = MARKERS.map(({ canonSlug, label, lngLat }) => {
      const point = projection(lngLat);
      return {
        canonSlug,
        label,
        x: Number(point[0].toFixed(1)),
        y: Number(point[1].toFixed(1)),
      };
    });

    const out = `// GENERATED by scripts/build-region-map.mjs -- do not edit by hand.
// Boundaries: udit-001/india-maps-data (post-2022 districts).
// Hectares: Coffee Plantation Atlas of India, NRSC/ISRO + Coffee Board, September 2024.

/** A district the plantation atlas reports coffee in, projected onto the canvas below. */
export type MapDistrict = {
  /** The atlas's spelling, which is also the join key against \`canon_regions.district\`. */
  name: string;
  state: string;
  /** Hectares under coffee. Never render this without AREA_SOURCE / AREA_AS_OF. */
  areaHa: number;
  d: string;
};

/** A page-bearing region that sits inside a drawn district, so it gets a dot. */
export type MapMarker = {
  canonSlug: string;
  label: string;
  x: number;
  y: number;
};

export const MAP_WIDTH = ${WIDTH};
export const MAP_HEIGHT = ${HEIGHT};

export const AREA_SOURCE = "ISRO and the Coffee Board";
export const AREA_AS_OF = "September 2024";
export const NATIONAL_TOTAL_HA = 445369;

/** Peninsular India as one filled shape. Draw first, under the districts. */
export const STATE_SILHOUETTE = ${JSON.stringify(silhouette)};

export const MAP_DISTRICTS: MapDistrict[] = ${JSON.stringify(districts, null, 2)};

export const MAP_MARKERS: MapMarker[] = ${JSON.stringify(markers, null, 2)};

// --- North-East inset, its own projection AND its own source ---------------------------
// Shaded from the Coffee Board's per-state planted area, not from the NRSC atlas, because
// the atlas publishes a single ${NRSC_NE_AREA_HA} ha figure for the whole region with no
// breakdown. The two count different things and must never share a colour scale.

export const NE_WIDTH = ${NE_WIDTH};
export const NE_HEIGHT = ${NE_HEIGHT};

/**
 * Coffee Board published total for the seven states below, hectares planted. The rounded
 * per-state figures sum to 6,091, one less -- the published total is the citable number.
 */
export const NE_TOTAL_HA = ${NE_TOTAL_HA};
/** What the NRSC atlas reports for its six NE states, for the footnote's contrast. */
export const NRSC_NE_AREA_HA = ${NRSC_NE_AREA_HA};

export const NE_AREA_SOURCE = "the Coffee Board of India";
export const NE_AREA_AS_OF = "2023-24, provisional";

export type MapNeState = { name: string; areaHa: number; d: string };

/** The seven North-Eastern states with registered coffee, largest planted area first. */
export const NE_STATES: MapNeState[] = ${JSON.stringify(neStates, null, 2)};
`;

    await writeFile(OUT_FILE, out);
    // Formatted here rather than left for the caller: the repo runs prettier in a
    // pre-commit hook, and the one other generated file in this codebase (supabase
    // types) has a documented trap about forgetting exactly this step.
    execFileSync("npx", [
      "prettier",
      "--write",
      "--log-level",
      "warn",
      OUT_FILE,
    ]);

    process.stdout.write(
      `Wrote ${path.relative(process.cwd(), OUT_FILE)} -- ` +
        `${districts.length} districts, ${markers.length} markers, ` +
        `${(out.length / 1024).toFixed(0)} KB\n`
    );
  });
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
