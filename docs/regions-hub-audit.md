# Regions hub audit — triage and status

**Audited:** 2026-09-25 · **Triaged and actioned:** 2026-09-25 · **Route:** `/regions`

The original audit raised 16 findings (0 P0, 5 P1, 11 P2). Each was checked against live
data and against how the sibling directory pages (`/coffees`, `/roasters`, `/estates`)
actually behave. **10 were confirmed and fixed, 3 were rejected as non-defects, 3 remain
open.** This doc is the record of that triage — the reasoning matters more than the
original severity labels, several of which did not survive verification.

Verdict on direction is unchanged: keep the illustrated region plates, the geographic
overview, state navigation, and links into the coffee directory. No redesign, no mapping
library.

## Fixed

| ID | Finding | What shipped |
| --- | --- | --- |
| **C1** | "No coffees listed yet" was inferred from a missing landing page, not from inventory | Map links now resolve in two passes: cards claim their polygon first (they bring a preview plate), then page-less regions that still carry coffees claim what is left, linking to `/coffees?regions=<slug>`. Only genuinely empty districts keep the empty label. |
| **T7** | Link identity and preview identity were resolved separately | The plate is keyed off the same claim object that built the `href`, so the second district lookup is gone. Folded into C1 — same loop. |
| **T2** | Hierarchy walks were not cycle-safe | `visited` sets on `descendantsOf` and `ancestorHasPage`. |
| **T4** | Meta description was cut mid-source-name | Separate `REGIONS_META_DESCRIPTION` (143 chars), independent of the visible hero copy. |
| **C2** | Inset citation outlived the inset it described | Caption gated on the same `northEast` condition as the geometry. |
| **C3** (part) | Hardcoded and stale figures | `444,696` and `18` derive from `MAP_DISTRICTS`; three "six states" comments corrected to seven; the parent/sub-region overlap caveat is now in the intro. |
| **U3** | Full-size preview caused ~440 px of mobile movement | Preview panel is `md`-only. The grid below is the mobile browse path and carries the same plates; the hover preview was always a pointer affordance. |
| **T6** (part) | `ItemList.position` did not match the visible order | Schema items are built from the flattened state groups. |
| **U2** | Hover and focus shared one `active`, and hover always won | Split into `hovered` and `focused`; display is `hovered ?? focused`. Pointer intent takes precedence while it exists, and when the pointer leaves the map the panel falls back to whatever still holds keyboard focus instead of blanking. `onMouseLeave` clears only hover; container `onBlur` clears only focus. |
| **U1** (keyboard) | Inert districts were pointer-only | The six remaining destination-less districts are `tabIndex={0}` / `role="group"` with `onFocus`, so their panel is reachable. Districts *with* a destination needed nothing: the shape is itself the link, so Tab-then-Enter already worked and the panel's link is never the only route to the href. |
| **U5** (part) | Heading structure and map descriptions | `sr-only` `h2` above the figure, so a hovered card's `h3` no longer precedes the first state `h2`. The SVG title names the inset when it renders. North-East link titles now say which aggregate page they open — seven differently-named links to one destination otherwise read as seven destinations. |

## Fixed in the critique round (`/impeccable critique`, 2026-09-25)

A dual-agent critique scored the page **25/36 (69%)** and surfaced three P1s the audit had
missed or under-rated. All were fixed:

| Finding | What shipped |
| --- | --- |
| **Mobile lost the map entirely** | The `hidden md:block` panel from the U3 fix traded a 440px jump for no mobile interaction at all. Now there are two panels: the full plate from `md` up, and a fixed-height (6rem) text summary below it — name, facts, and an explicit "Explore …" link. Both heights are reserved, so neither shifts the grid. Tapping a *linked* shape still navigates straight through, which is correct on mobile; the panel is what makes the six destination-less districts worth touching. |
| **Sub-24px interactive targets** | Inset label was `fontSize={17}` → ~9.8px at a 390px viewport. Now 24 units (~13.9px mobile, ~18.6px desktop), with "India" dropped so it fits `NE_WIDTH`. Marker gained a transparent `r={16}` hit circle: ~7px → ~18.5px mobile, ~9px → ~25px desktop. |
| **Reduced-motion commitment unmet** | `html { scroll-behavior: smooth }` was unguarded in `globals.css` — and this page's jump nav is built entirely on anchor links, making it the site's one long vestibular trigger. Now gated behind `prefers-reduced-motion: no-preference`. `motion-reduce:transition-none` added to the map's fill transition and the page's colour transitions. |
| **Legend never said what it measured** | Four swatches labelled only at the endpoints, with "area under coffee" stranded in a separate paragraph. Now titled "Area under coffee, per district", all four stops labelled, swatches `aria-hidden` since the numbers carry the scale. |
| **Intro front-loaded three caveats** | The sub-region and overlap caveats moved into the map's figcaption beside the provenance they qualify. The intro is one fact again. |
| **Jump nav had no scroll-spy** | New `StateJumpNav` client component with an `IntersectionObserver` and `aria-current`. Top-biased `rootMargin` so the bottom group isn't "current" on first paint. Anchors still work without JS. |

### Accepted with reason, not fixed

- **26 tab stops inside the map SVG** (20 links + 6 focusable inert groups), no skip mechanism.
  Cutting the seven North-East shapes to one stop would drop it to 20, but each carries a
  *different* hectare figure — that is content, not noise, and removing it to shorten the tab
  ring trades information for convenience. The real fix is the text alternative beside the map
  (*Suggested additions* #2), which resolves this, the marker target size, and the mobile touch
  story together.
- **Mobile markers still miss 24px** (~18.5px after the hit-circle change). Reaching 24px needs
  ~42 SVG units of radius, which would swallow taps meant for the Chikmagalur polygon.
- **`unoptimized` on the 13 region plates** (`RegionCard.tsx:88`, fixed 440px ImageKit
  transformation, no responsive variants). Left alone pending the DPR 2/3 sharpness check U6
  calls for — changing image widths blind is how you ship a blurry grid.
- **"North-East India" renders as both `h2` and `h3`.** Inherent to a single-card stateless
  group; the `h2` carries the jump-nav anchor. Not a level skip, and removing it costs more
  than it returns.
- **`PEER_REGIONS` is invisible to users.** Already mitigated: `RegionCard` renders the district
  as a footnote, so Baba Budangiri shows "· Chikkamagaluru" and the containment is legible.

### Verification

Rendered locally against production data.

- `Coimbatore — 2,244 ha, 1 coffee on Valparai` and `Palakkad — 5,245 ha, 1 coffee on
  Nelliyampathy`; both previously rendered as empty. `Idukki`, `Theni`, and `Shivamogga`
  correctly keep "no coffees listed yet" — their zero is real.
- Six focusable inert groups in the SSR markup (18 districts − 12 now claimed).
- `type-check` and `lint` clean; no dev-server warnings.
- Critique round re-verified in SSR HTML: legend title and all four stop labels present, the
  overlap caveat moved out of the intro and into the figcaption, `fontSize="24"` on the inset
  label, the transparent hit circle, the mobile panel block, and the scroll-spy nav.
- `detect.mjs` returns `[]` / exit 0 on `page.tsx`, `RegionMap.tsx`, and `RegionCard.tsx`.

**Not verified:** the interactive focus/hover behaviour was reasoned from the event
implementation, not exercised in a real browser — no browser automation was available in
that session. Tab order, Shift+Tab, rapid hover, map-to-card pointer movement, and
pointer/keyboard mixing still need a manual pass, as does the `tabIndex` on an SVG `<g>`
in Safari specifically.

**Regression caught during verification, worth remembering:** React 19 renders *nothing*
for a `<title>` given an array of children, silently stripping the element. Splitting the
SVG title into two JSX expressions blanked the map's accessible name with no warning and
no type error. Keep `<title>` children to a single expression.

## Rejected — verified non-defects

### T1 — cached region query could read cookies

Downgraded from P1, then fixed anyway as a one-word change.

The code path was real: `fetchRegions` fell back to `createClient()` (which calls
`cookies()`) when `SUPABASE_SECRET_KEY` was absent, inside `unstable_cache`. But
`vercel env ls` confirms `SUPABASE_SECRET_KEY` is set in **Development, Preview, and
Production**, so the fallback branch never executed. This was never a live failure and
could not have become one without an env change.

`fetch-regions.ts` now uses `createAnonServerClient()` regardless — it costs nothing and
makes the dead branch correct rather than broken. **The identical pattern in
`fetch-coffees.ts:23`, `fetch-roasters.ts:225`, and `fetch-estates.ts:61` was deliberately
left alone**: same dead branch, and changing the coffee directory's data path carries real
blast radius for no live benefit. Fix them only if the secret key is ever removed.

### T3 — incomplete catalog above the 200-row cap

`canon_regions` holds **49** rows with `country = 'India'`. The cap is 4× current
inventory. The associated asks — distinguishing empty from error, retryable error states,
honest empty states — are speculative for a route whose data set would have to quadruple
first. Revisit if the region count passes ~150.

### T5 — sharing uses the generic logo image

Not a regions defect: `/coffees` and `/roasters` also pass no `image` to
`generateMetadata`. This is the site-wide convention for directory pages. If a
regions-specific OG composition is wanted, that is a site-wide decision about directory
sharing, not a bug on this route.

### T6 (sitemap half) — `lastModified: new Date()`

Every static route in `src/app/sitemap.ts` does this, not just `/regions`. Same call for
all of them or none; not a finding against this page.

## Open — real, deferred

Ordered by value per unit of work.

### U1 (remainder) — P2: touch target sizes

The keyboard half is fixed. What remains is physical: at 390 px the measured bounding boxes
were ~21×24 px for Kodagu, ~17×14 px for Wayanad, and ~7×7 px for the Baba Budangiri marker.
State jump links were 16 px tall.

Deliberately **not** fixed by enlarging hit areas. A transparent circle big enough to reach
44 px on the marker would span ~65 SVG units and swallow clicks meant for the Chikmagalur
polygon underneath it — trading a small target for a wrong destination. The right fix is a
text alternative beside the map (*Suggested additions* #2), which also serves as the
non-geographic selection path. The card grid remains the reliable browse route in the
meantime, which is why this is deferred rather than blocking.

Treat 44 px as a usability target here, not an automatic WCAG 2.1 AA violation; target-size
rules and their exceptions need separate assessment.

### U2 / U5 (remainder) — P2: panel semantics

The state model and heading structure are fixed. Still worth doing if the panel grows:

- No explicit programmatic association between the map shapes and the panel that updates.
  Deliberately not wired to `aria-live` — announcing a whole image-heavy `RegionCard` on
  every hover is worse than silence. If announcements are added, announce the short
  selected-region summary, not the card.
- The panel still inherits the grid's `h3` from `RegionCard` rather than using
  panel-appropriate heading markup. Only matters once the panel diverges from the grid plate.

**Semantics, for whoever picks this up:** this is an interactive detail panel, not a tooltip
— it contains a link. The [ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
does not contain focusable controls. Do not report the absent Escape handler as an automatic
WCAG failure; non-obscuring additional content can meet the dismissibility exception.
Persistence and hoverability still need assessment under
[WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus).

### U4 — P2: map boundaries, orientation, and legends

Hairline cracks and triangles in the context silhouette and the North-East geometry.
No persistent place labels or marker key. The four legend swatches label only their
endpoints; the inset uses a different scale with no visible ramp of its own. The inset
label renders at roughly 10 px at mobile width (`fontSize={17}` in a 620-unit SVG).

Fix at build time: dissolve shared boundaries for the silhouette and inset states rather
than stroking around independently simplified districts. Preserve intentional coffee-district
outlines. Add restrained orientation labels, a Baba Budangiri marker key, and a "separate
location/scale" cue for the inset.

### U6 — P2: preview imagery warmth and sizing

The stale "image is already in cache, switching costs no new request" claim is still in the
`RegionMap` props doc and should go — later grid images are lazy and unloaded before
scrolling. `RegionCard` uses `unoptimized` with a fixed 440 px ImageKit transformation;
`sizes` alone does not create responsive variants. Verify grid sharpness at mobile DPR 2/3
before changing widths, and inspect real production transfer sizes before touching the
server/client split.

### C3 (remainder) — P2: provenance and copy

The hardcoded numbers and stale state counts are fixed. Still open:

- The hero still promises "Every Indian coffee region in the directory", though only
  page-bearing positive-count regions get cards. It also says "how much of it is under
  coffee", but hectares are district/state map figures and are absent from the grid.
- Sources are named but not linked. Link the actual atlas and Coffee Board table/report
  with title, year, and page/table reference, keeping their metrics separate.
- Note rounding where relevant: committed North-East state figures sum to 6,091 ha while
  the published total in the UI is 6,092 ha. Do not silently reconcile them, and never add
  the two datasets into one national total.
- The boundary source downloads from an unpinned `main` URL. Pin the revision; record
  license, attribution, and transformation provenance.
- Add "Elevation" where a bare metre range is unclear. Explain that a district's coffee
  hectares do not describe the exact hill belt or the entire linked region. Keep
  Chikmagalur/Chikkamagaluru and Coorg/Kodagu aliases connected consistently.

Suggested visible intro, if the hero is reworked:

> Explore Indian coffee origins by state. Compare elevation and flavour profiles, then
> browse coffees from each region.

"Select a region to see its details" only becomes accurate after U1/U2 ship.

## Suggested additions — optional, not defects

1. **A compact map/list switch on mobile.** Reach origins without scrolling the hero, intro,
   map, and citations. Keep state jump navigation prominent and the illustrated grid available.
2. **A concise facts-list alternative to the map.** State, region/district, coffee hectares
   with source, catalog destination. Also supplies the accessible selection path U1 needs,
   without building a complex map widget.
3. **Clear geographic selection feedback.** Persistent selected name, highlighted grid entry,
   optional "View in list". Avoid a filter that hides unrelated regions.
4. **Reciprocal editorial linking.** Verify the complete guide links back to the hub —
   a Sanity-side follow-up, unverified in the CMS during this audit.
5. **Analytics, if useful.** Distinguish map selection from navigation; record destination and
   input method through the existing consent-aware system. Do not log every hover.
6. **A light content-quality check.** Missing images/profiles, unknown districts, ambiguous
   map ownership, stale source years, card/schema count mismatches.

## What to preserve

- Server-rendered list content and crawlable real links; India filtering; centralized
  destination resolution.
- Server-composed preview slots, which keep the landing-page config out of the client map.
- Generated SVG geometry rather than a runtime GIS dependency; responsive viewBox and
  theme-token fills.
- One link per grid card, sub-region links outside the card, state anchors built from actual
  groups.
- The illustrated plates, elevation/profile hierarchy, and compact cross-link variant.
- Separate map datasets and explicit source years; no false equivalence between mapped canopy
  and planted-area totals.
- Existing metadata, sitemap inclusion, collection/breadcrumb schema, escaped JSON-LD.
- Reduced-motion handling on default cards and the shared-container hover/blur behaviour —
  extend these rather than replacing them.

## Original audit scope and limits

Reviewed the route, `RegionMap`, `RegionCard`, map generator and generated geometry, region
fetchers, count migration, metadata/schema helpers, OG endpoint, sitemap, robots, shared
layout, and the regions handover doc. Rendered locally; inspected Chromium screenshots at
1440×1000 and touch-emulated 390×844 plus dark theme; exercised focus/Tab and the
accessibility snapshot.

Not performed: production deployment checks, real-device Safari, NVDA/VoiceOver, measured
contrast audit, Lighthouse/Core Web Vitals, database mutation tests. The U3 figures are a
measured interaction shift, not a CLS score. Local metadata resolved to `localhost`, which
establishes nothing about the production canonical.

## Acceptance matrix

Outstanding for what already shipped (the interaction work was reasoned, not browser-tested):
keyboard Tab and Shift+Tab through the map, rapid hover, map-to-card pointer movement,
pointer/keyboard mixing, and `tabIndex` on an SVG `<g>` in Safari.

Full pass, when U4 and the remaining copy work land: desktop/mobile/tablet; light/dark;
keyboard, pointer, and real touch; reduced motion; increased text size; cold/slow/failed
image loads; empty and missing counts; no dedicated page; duplicate district ownership;
cyclic hierarchy. Fetch production HTML, validate schema, fetch the actual sharing image.
