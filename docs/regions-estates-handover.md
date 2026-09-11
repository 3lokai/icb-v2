# Regions & Estates — Handover

**Written:** 2026-09-11 · **Updated:** 2026-09-11 (4a–4e shipped; only 4f remains) · **Branch:** `estates-and-regions`
**For:** the next session picking up the regions/estates frontend in this repo.

The database and type layers are **done and live**. What remains is UI wiring. This doc is the
frontend-side summary; the full reasoning lives in the ops workspace:

| doc | what's in it |
|---|---|
| [`icb-claude/docs/canon-regions-nrsc-alignment.md`](../../icb-claude/docs/canon-regions-nrsc-alignment.md) | the data plan — schema, mapping, 6 phases, retention rule |
| [`icb-claude/docs/canon-regions-frontend-plan.md`](../../icb-claude/docs/canon-regions-frontend-plan.md) | the frontend plan — routing, slug rules, hub spec, estates |
| [`icb-claude/seo/site-recommendations/backlog.md`](../../icb-claude/seo/site-recommendations/backlog.md) | 9 tracked items under "Regions & estates surfaces" |
| [`icb-claude/docs/reference/Coffee_Plantation_Atlas_of_India_NRSC_2024.pdf`](../../icb-claude/docs/reference/Coffee_Plantation_Atlas_of_India_NRSC_2024.pdf) | the source for every area figure |

---

## 1. The three ideas you need before touching anything

**`tier` is precision, not page-worthiness.** `canon_regions.tier` says how specific an origin
claim is, *not* whether a region gets a page. `baba-budangiri` is a `locality` with 183 coffees and
its own page; `virajpet` is a `taluk` with the largest coffee area in India (62,110 ha) and zero
coffees, so no page. **Page decisions live in [`src/lib/discovery/landing-pages/region-pages.ts`](../src/lib/discovery/landing-pages/region-pages.ts)**,
never in the tier column.

**Page slugs ≠ canon slugs, and that's deliberate.** The bridge is `filter.region_slugs[]` in the
landing-page config, and it is one-directional (config → canon). Do **not** rename page slugs to
match canon — they're live, indexed and shorter.

```
page slug     canon slug(s)
coorg      →  kodagu-coorg
araku      →  araku-valley, paderu-valley
nilgiris   →  nilgiri-hills, coonoor, gudalur, …
```

**Popular name wins the URL; the Coffee Board name is secondary.** Decided 2026-09-11 on ICB's own
Search Console data — Chikmagalur beats Chikkamagaluru 681:9 impressions, Coorg beats Kodagu 349:0,
and the Coffee Board's Manjarabad / Pulneys / Brahmaputra have **zero** measured demand. So the
searched name is the slug and primary H1; the Coffee Board name lives in the H1 as a secondary
(`"Best Sakleshpur & Manjarabad Coffee in India"`), in the intro prose, and as a 301 alias in
`next.config.ts` (14 of them). Every region config must mention its official alternate at least
once. Two Coffee Board regions have **no page on purpose** — Anamalais (`valparai`) and Travancore
(`idukki`) have zero active coffees. Full rationale in the frontend plan §3.

**The UI is India-only, by filter — not by deleting data.** 46 international `canon_regions` rows
exist so a foreign coffee maps somewhere instead of orphaning, and are retained for a possible later
expansion. Every hub query and `generateStaticParams` must carry `country = 'India'`. Foreign
origins still appear on coffee cards and SKU pages; only region/estate *browse* surfaces are gated.

---

## 2. What's already done

### Database (live on ICB-v3, `fnpsnzqedznsgzxjsowe`)

**Migration `20260910120000_canon_region_tier_parent_district.sql`** — applied, in the Supabase
ledger, `migration list` shows nothing pending. Adds to `canon_regions`:

| column | meaning |
|---|---|
| `tier` | `region` \| `district` \| `taluk` \| `locality` \| `aggregate` \| `non-terroir` |
| `parent_id` | self-FK. Coffee counts roll **up** this edge. |
| `district` | NRSC/administrative district. Null for non-India and aggregates. |
| `area_source` | provenance of `area_hectares`, e.g. `"NRSC 2024"` |
| `area_as_of` | as-of date for the figure |

Plus a `tier` value check, `parent_id <> id`, and indexes on `parent_id` and `(tier, country)`.

**`canon_regions_area_needs_source` is `NOT VALID`** — deliberately. It enforces
"no `area_hectares` without `area_source` + `area_as_of`" on every write, while grandfathering four
pre-existing unsourced rows that would otherwise have aborted the migration. Don't "fix" it by
validating until those are resolved.

**Data backfilled** (both scripts live in [`icb-claude/canon/`](../../icb-claude/canon/), both idempotent with a `--check`):
- `region_structure.py` — all 96 rows tiered, 11 rows created, hierarchy verified acyclic
- `nrsc_backfill.py` — 26 rows carry an atlas-matched, sourced, dated `area_hectares`; 13 carry
  NRSC's own per-unit prose in `notes` (was 0/85)

### This repo

- **Types updated** ([`src/types/region-types.ts`](../src/types/region-types.ts)): new `RegionTier` union; `RegionDetail` gains
  `tier`, `parent_id`, `district`, `area_source`, `area_as_of`; `RegionSummary` gains the same minus
  `area_as_of`, plus `area_hectares`; `RegionFilters` gains `tiers?: RegionTier[]`.
- **[`src/lib/data/fetch-regions.ts`](../src/lib/data/fetch-regions.ts)**: selects the new columns, maps them, and applies a `tiers`
  filter so the hub can ask for `tier = 'region'`.
- **Data layer already existed** on this branch (commit `04c58e6`) and needed no changes:
  `src/app/api/{regions,estates}/route.ts` + `[slug]/route.ts`, `src/lib/data/fetch-{regions,estates}.ts`
  and `fetch-{region,estate}-by-slug.ts`, `src/hooks/use-{regions,estates}.ts`,
  `src/lib/filters/{region,estate}-url.ts`, `src/types/{region,estate}-types.ts`, query keys.
- **`get_region_detail` / `get_estate_detail` are wired.** `fetch-region-by-slug.ts:37` and
  `fetch-estate-by-slug.ts:36` call them; both cast the RPC's jsonb straight to the detail type. The
  RPCs use `to_jsonb(cr)`, so they already return the new columns with no SQL change.

Verified live:

```
get_region_detail('chikmagalur') → tier='region'  district='Chikkamagaluru'
                                   area_hectares=106654  area_source='NRSC 2024'
                                   area_as_of='2024-09-01'  estates=57  coffee_count=357
get_region_detail('sakleshpur')  → tier='taluk'  parent_id=<hassan>  district='Hassan'
                                   area_hectares=35620
```

`tsc --noEmit`, `eslint` and `prettier --check` all pass on the branch.

---

## 3. Live data — Indian rows

`own` = coffees tagged directly · `rolled` = including all descendants via `parent_id` ·
`page` = has a `/coffees/<slug>` discovery config today.

| canon slug | tier | district | area (ha) | own | rolled | page |
|---|---|---|---|---|---|---|
| `chikmagalur` | region | Chikkamagaluru | 106,654 | 460 | **666** | ✅ |
| `kodagu-coorg` | region | Kodagu | 135,796 | 162 | 162 | ✅ (`coorg`) |
| `hassan` | region | Hassan | 57,705 | 8 | **101** | — |
| `shevaroy-hills` | region | Salem | 8,485 | 66 | 66 | ✅ |
| `koraput` | region | Koraput | 2,918 | 46 | 46 | ✅ |
| `palani-hills` | region | Dindigul | 13,862 | 40 | 40 | — |
| `biligiriranga-hills` | region | Chamarajanagar | 635 | 36 | 36 | — |
| `araku-valley` | region | Alluri Sitharama Raju | 35,423 | 24 | 26 | ✅ (`araku`) |
| `wayanad` | region | Wayanad | 52,762 | 14 | 14 | ✅ |
| `nilgiri-hills` | region | Nilgiris | 7,228 | 6 | 7 | ✅ (`nilgiris`) |
| `valparai` | region | Coimbatore | 2,244 | 3 | 3 | — |
| `palakkad` | district | Palakkad | 5,245 | 0 | 3 | — |
| `idukki` | district | Idukki | 9,465 | 0 | 0 | — |
| `northeast-india` | aggregate | — | 674 | 0 | 15 | ✅ |
| `malnad` | aggregate | — | — | 1 | 1 | — |
| `sakleshpur` | taluk ⊂ hassan | Hassan | 35,620 | 76 | 93 | — |
| `mudigere` | taluk ⊂ chikmagalur | Chikkamagaluru | 43,020 | 11 | 11 | — |
| `virajpet` | taluk ⊂ kodagu-coorg | Kodagu | 62,110 | 0 | 0 | — |
| `madikeri` | taluk ⊂ kodagu-coorg | Kodagu | 40,676 | 0 | 0 | — |
| `somavarpet` | taluk ⊂ kodagu-coorg | Kodagu | 33,010 | 0 | 0 | — |
| `belur` | taluk ⊂ hassan | Hassan | 15,269 | 0 | 0 | — |
| `gk-veedhi` | taluk ⊂ araku-valley | Alluri Sitharama Raju | 8,347 | 0 | 0 | — |
| `chintapalli` | taluk ⊂ araku-valley | Alluri Sitharama Raju | 7,840 | 0 | 0 | — |
| `g-madugula` | taluk ⊂ araku-valley | Alluri Sitharama Raju | 5,042 | 0 | 0 | — |
| `gudalur` | taluk ⊂ nilgiri-hills | Nilgiris | 3,918 | 0 | 0 | — |
| `paderu-valley` | taluk ⊂ araku-valley | Alluri Sitharama Raju | 1,673 | 2 | 2 | — |
| `coonoor` | taluk ⊂ nilgiri-hills | Nilgiris | 541 | 1 | 1 | — |
| `baba-budangiri` | locality ⊂ chikmagalur | Chikkamagaluru | — | 183 | 183 | ✅ |
| `manjarabad` | locality ⊂ sakleshpur | Hassan | — | 17 | 17 | — |
| `malabar` | non-terroir | — | — | 13 | 13 | — |

Plus 18 more localities with 1–5 coffees each (12 under `northeast-india`, 5 under `chikmagalur`,
1 under `palakkad`) and 2 deliberately unparented (`punajur-state-forest-karnataka`, `malavalli`).

**Localities have no `area_hectares` on purpose.** The atlas maps no unit for hill ranges and estate
belts — a null is a fact about the source, not a gap. Same for every North-Eastern row: the atlas
publishes one 674 ha figure for all six states with no breakdown.

**`malabar` is `non-terroir`.** The Coffee Board files Monsooned Malabar under *Specialty Coffees*,
not regions — it's a curing process done at West Coast works, and NRSC maps no such unit.
`/coffees/monsooned-malabar` already exists as a **process** page. Never give `malabar` a terroir
profile; route it to the process page.

---

## 4. What to build, in order

### ~~4a. `/regions` hub~~ — SHIPPED 2026-09-11

Live at [`src/app/(main)/regions/page.tsx`](<../src/app/(main)/regions/page.tsx>). A **directory**, not an
essay. Static route, no `generateStaticParams`, no slug handling.

What shipped: cards for the 11 `tier='region'` rows plus `northeast-india` (an aggregate earns a card
only when it already has a landing page, which drops `malnad`), grouped by `state` with the NE
aggregate under a "North-East India" group since its `state` is null. Each card carries the rolled-up
coffee count, `district`, `signature_profile`, and the area figure gated behind `area_source` **and**
`area_as_of` in one `formatArea` helper. Descendants with coffees render as chips (top 6 by count).
Links resolve through `regionBrowseHref` — landing page when one exists, `/coffees?regions=<canon>`
otherwise. Sitemap entry added; **not** in `discovery-pages.json`.

Still open on the hub: the India map asset (`[regions-guide-map-asset]`), and the reverse cross-link
from `/learn/coffee-regions-of-india-complete-guide` (Sanity-side, not in this repo). The hub links
out to the guide already.

**Cannibalization guard:** `/learn/coffee-regions-of-india-complete-guide` owns the explainer
intent. Keep the hub to cards + counts + map, never prose.

Two follow-ups taken during review: state groups are now built from the data and merely *ordered* by
`STATE_ORDER` (the old code iterated the constant, so a region in an unlisted state — Meghalaya,
Maharashtra — would have silently vanished), and the sub-region chips cap at 6 with a `+N more` link
to the parent's own page instead of truncating in silence.

`RegionSpotlight` deliberately links `/coffees?regions=<slug>` rather than reusing `regionBrowseHref`:
it's a `"use client"` component, and the helper's module pulls the whole `regionPages` config (~1,000
lines) into the client bundle. `?regions=` accepts page and canon slugs alike and never 404s; the
richer landing-page link needs that block server-rendered first.

**Also fixed with it (4c is done too):** header nav Regions flipped live (Estates still
`disabled: true`); the `REGION_GUIDES_LIVE` / `guideHref` dead path deleted from `RegionSnapshot.tsx`
along with the now-unused `regionSlug` prop threading (and `slug` on `RegionOverviewSection`);
`RegionSpotlight.tsx`'s `/regions/${regionId}` fallback repointed at `/coffees?regions=<slug>` — not
at the landing config, because it's a client component and importing `regionPages` would drag ~1,000
lines of config into the client bundle; `?regions=` accepts page slugs and canon slugs alike. The two
live 404s at `about/page.tsx:301` and `RegionCollection.tsx:71` resolve for free.

### ~~4b. Fix the region undercount~~ — SHIPPED 2026-09-11

`/coffees/chikmagalur` sets `filter.region_slugs: ["chikmagalur"]` and therefore **omits 206
coffees** that live in its sub-units. `/coffees/hassan` doesn't exist, but `hassan` shows 8 vs 101
rolled. Expand each array to include descendants — the mechanism already works, `northeast-india` is
`["garo-hills","khasi-hills","west-khasi-hills"]`.

Source the descendant list from `parent_id`, don't hardcode a second copy of the hierarchy.

**Done in the resolver, not the configs.** All slug→id resolution now lives in
[`src/lib/data/resolve-region-slugs.ts`](../src/lib/data/resolve-region-slugs.ts) — the landing-slug bridge, one read of `canon_regions`,
and a walk down `parent_id`. `resolveRegionSlugsToRegionIds` returns `regions.id[]` for coffee
queries; `resolveRegionSlugsToCanonIds` returns `canon_regions.id[]` for anything keyed on
`canon_region_id`. `fetch-coffees.ts` and `fetch-estates.ts` both use it, so the nine landing configs,
`?regions=` URLs typed from the filter sidebar, `fetchRoastersForRegionSlugs` and the estate directory
were all fixed by one change, with no config edited and no second copy of the hierarchy in TS.

Measured after (`/api/coffees?regions=…&limit=1`, `total`):

```
chikmagalur 357 → 514      hassan 4 → 75       northeast-india 3 → 8
araku       20  → 21       coorg  137 (unchanged, no sub-units with coffees)
```

Every one now matches its hub card exactly.

**The filter also failed open, and no longer does.** `resolveRegionSlugsToIds` returned `[]` when
nothing matched and the caller read that as "no filter", so `?regions=virajpet`, `?regions=idukki` and
`?regions=nonexistent-slug-xyz` each returned the **entire 1,488-coffee catalogue**. Pre-existing, but
newly reachable: the tier/parent backfill added ten canon rows with zero coffees. Both resolvers now
fail closed on the `NO_MATCH_ID` sentinel that `estate_keys` already used — those three URLs return 0.
The same sentinel now guards the `international_only` intersection, which could also empty out to a
dropped filter.

`baba-budangiri` keeps its own page and is now also counted inside `chikmagalur` — a valid subset, as
intended.

### ~~4c. Three cleanups the "no `/regions/<slug>`" decision forces~~ — DONE with 4a

| what | where |
|---|---|
| `REGION_GUIDES_LIVE = false` + `guideHref = /regions/${regionSlug}` — dead path, delete it | `src/components/discovery/RegionSnapshot.tsx:17,66` |
| Fallback `/regions/${regionId}` emits 404s from published articles — repoint to `/coffees/<page-slug>` via the landing config | [`src/components/blog/blocks/RegionSpotlight.tsx:90`](../src/components/blog/blocks/RegionSpotlight.tsx#L90) |
| Header nav `disabled: true` on Regions and Estates — flip per hub as each ships | `src/components/layout/header.tsx:85-96` |

### ~~4d. Four new region configs~~ — THREE SHIPPED, ONE DROPPED 2026-09-11

| planned | shipped as | public coffees |
|---|---|---|
| Manjarabad | `/coffees/sakleshpur` — "Sakleshpur & Manjarabad" | 71 |
| Pulneys | `/coffees/palani-hills` — "Palani Hills (Pulneys)" | 30 |
| Biligiris | `/coffees/biligiriranga-hills` — "BR Hills (Biligiriranga)" | 29 |
| Anamalais | — dropped | **0** |

**Page slugs match canon slugs for both new pages.** The "page slugs ≠ canon slugs" rule is about not
*renaming* the live ones; for new pages, matching keeps the hub chip and its destination consistent.
A page at `/coffees/manjarabad` filtering on `hassan` would have shown 75 against a hub chip reading
16 — the same string meaning two scopes. `sakleshpur` (71) reads the same on both surfaces, and the
h1, FAQ and intro all carry "Manjarabad" for the search term.

Both configs carry editorial voice only — 4e means every terroir fact renders from `canon_regions`
with no fact-writing per page. The copy is grounded in measured catalogue data, not invented: e.g.
Sakleshpur's anaerobic/honey/experimental lots (33 of 71) outnumbering its washed and natural ones,
its Liberica and Excelsa lots, Classic Coffees' 22-lot depth; and the Palani Hills tension where the
highest elevations in Indian coffee are mostly roasted medium-or-darker into caramel and chocolate.

**Biligiris shipped after the audit ran, and the audit answered the question.** The 29 lots against
635 mapped hectares are not mis-mapped — the concentration is two sources, both verifiable in the
catalogue:

- **Attikan Estate, 12 lots across 11 different roasters** (Blue Tokai, Beachville, Kruti, El Bueno,
  Rossette, Quick Brown Fox, Naivo, Coffee Plus, Caarabi, Coffeeverse, Bean By Nation). One 1888
  Sangameshwar farm selling green widely, so one farm shows up eleven times.
- **Black Baza Coffee, 15 lots** — a single biodiversity-led roaster's Soliga/smallholder network,
  five of them blends that also carry Wayanad, Chikmagalur, Sakleshpur or the Nilgiris.

That leaves 2 of 29 from anywhere else. 635 ha is also the correct atlas Chamarajanagar figure
(§4h), so nothing was asserted that the source doesn't support — the page says the count is
concentration, not scale, in as many words.

⚠️ **One conflict the page has to hold open:** `canon_regions` gives the range 900–1,500m, while
Sangameshwar describes Attikan as the highest coffee ground cultivated in South India at ~1,650m —
above the range band, and in tension with §4d's finding that the Nilgiris are India's highest
traditional coffee district. Both are attributed in the copy rather than reconciled. Don't "fix"
the canon altitude to match an estate's marketing; this is one for the ops-side altitude sweep
(§4g).

`canon_estates` for `attikan-estate` still carries a stale note saying its region "is currently
linked to Chikmagalur". Its `canon_region_id` is `biligiriranga-hills`; the note is wrong and should
be dropped in the next enrichment pass.

**Three more regions were considered and deliberately have no page:**

| canon slug | public coffees | why not |
|---|---|---|
| `hassan` | 75 rolled / 4 own | 71 of the 75 are Sakleshpur, which already has a page. A `/coffees/hassan` page is a near-duplicate of `/coffees/sakleshpur` — self-cannibalization for one extra query. |
| `mudigere` | 8 | Below anything shipped (palani-hills, the smallest, has 30). Four estates, one roaster deep. Revisit past ~20. |
| `valparai` | 0 | Still zero in a public status. Unchanged from the original drop. |

Everything else without a page is a locality or taluk with 1–16 coffees. The hub chips link
`?regions=<canon>` for all of them, which is the right surface at that size and never 404s.

**Copy is sourced, not invented.** Both configs were written against the catalogue, then checked
against the NRSC atlas PDF and the Specialty Coffee Association of India's region pages. Two claims
died in that check and are worth remembering:

- *"India's highest coffee elevations"* for the Palanis is **wrong**. The peaks pass 2,000m; the
  coffee sits on the middle and lower slopes. The Nilgiris are India's highest traditional coffee
  district. The atlas gives no per-region altitude, only a general Arabica band of 1,000–1,500m.
- The Coffee Board's own line on Pulney coffee — "medium body, slight flavour with little aroma" —
  is a better anchor than any floral-terroir claim, and it matches what the catalogue tastes like.

**Sakleshpur is a Robusta taluk.** The atlas maps it as Robusta-dominant under mixed shade across
35,620 ha, while ICB's specialty lots from it run 53 Arabica to 4 Robusta. The page says so — that
gap between what a belt grows and what gets roasted for specialty is the most interesting fact about
the region, and it generalises to other pages.

**Anamalais was dropped: `valparai` has zero public coffees.** §3's table shows 3, counting all
statuses; none are `active` or `seasonal`, so a page would render an empty grid. Revisit if lots
appear.

### ~~4e. Region profiles from `canon_regions`~~ — SHIPPED 2026-09-11

Done as the **full swap** in the frontend plan's §5 table. [`src/lib/discovery/region-facts.ts`](../src/lib/discovery/region-facts.ts)
reads the canon row (page slug first, then `filter.region_slugs[0]`, so `coorg` → `kodagu-coorg`) and
returns a card list; `DiscoveryLandingLayout` fetches it for `type === "region"` and passes it to
`RegionOverviewSection`, which now renders the terroir grid from data instead of four hardcoded slots.

Deleted from `region-pages.ts`: nine `terroir` blocks, and `state` + `elevation` from both the
`regionProfile.snapshot` and `regionSnapshot` objects — those were the drifting copies. `knownFor`
stays; it's editorial. `terroir` is gone from `RegionProfileConfig`, and snapshot `state`/`elevation`
are now optional.

Cards render only when the DB has the value, so the grid grew where data exists and shrinks where it
doesn't: Chikmagalur now shows climate, soil, 900–1,800m, varieties, 1,800mm rainfall, harvest window,
intercrops and a sourced area figure; `northeast-india`, an aggregate with no terroir of its own,
shows only its sourced area and drops the State/Elevation snapshot cards entirely. Area still passes
the `area_source` + `area_as_of` gate.

Open decision 2 (bespoke vs templated copy) is untouched — this moved facts, not voice.

### 4g. Three regions carried hill-range altitudes, not coffee altitudes

Migration `20260911160000_fix_region_coffee_altitudes.sql` (applied). `altitude_min_m`/`max_m` on
three rows recorded the elevation of the mountain range rather than the band coffee grows in — the
Palanis' 2,200m is the massif above Kodaikanal, the Nilgiris' 2,500m is near Doddabetta, Wayanad's
2,100m is Chembra Peak. Harmless while the figures sat unread; 4e put them on the page.

Corrected to SICC's published coffee bands (`sicc.coffee/regions/{pulneys,nilgiris,wayanad}`, read
2026-09-11): Palanis 800–1,500m, Nilgiris 900–1,800m, Wayanad 700–1,200m. **The NRSC atlas publishes
no per-region altitudes** — only a general Arabica 1,000–1,500m / Robusta 500–1,000m table (p. ~12) —
so it neither confirms nor contradicts these; it does make the old peak-height values clearly wrong.
Rainfall left alone: SICC publishes ranges, and a midpoint would invent precision.

⚠️ **Worth an ops-side sweep.** If three rows carried range summits, others may too. `malnad`
(700–1,800), `wayanad` before the fix, and `nilgiri-hills` all came from the same enrichment pass.

### 4h. Atlas audit — what was checked and what it found

Everything below was verified against the atlas PDF and its extracted `nrsc-atlas-2024.json`, not
from memory.

**Fixed in the copy:** stale elevations that survived 4e because they sit in prose rather than in the
terroir grid — Chikmagalur read 900–1,700m against the canon 900–1,800m (in two places), Coorg read
800–1,600m against 1,000–1,750m, and the Nilgiris read "up to 2,000m" in three places, which is the
range's height, not the coffee's. Baba Budangiri's contrast with its parent district was rewritten:
its 1,800m ceiling is the same as Chikmagalur's, so the distinction is its 1,500m *floor*.

**Fixed on the hub:** the credibility line claimed "445,369 ha across **57 taluks**". The 445,369 ha
is right — it's the atlas's own NATIONAL TOTAL — but the national table is **district-level, 18
rows**; the atlas carries about 30 taluk detail pages and never claims 57 of anything. Now reads
"across 18 districts".

**Checked and correct, don't 'fix' these:**

- `shevaroy-hills` = 8,485 ha where the atlas's Salem district row says 8,486. The Yercaud taluk page
  says 8,485, and Salem's coffee is essentially all Yercaud. The atlas is internally inconsistent by
  1 ha: its district rows sum to 445,370 against its own 445,369 national total.
- Every other Indian `area_hectares` matches its atlas district or taluk figure exactly.

**Left for the ops workspace:**

- **The atlas publishes no altitudes**, only a general Arabica 1,000–1,500m / Robusta 500–1,000m
  table. Every altitude in `canon_regions` therefore comes from enrichment, and three of them were
  range summits (§4g). `malnad` (700–1,800) is from the same pass and unverified.
- `araku-valley` carries 900–1,100m; the atlas highlight puts Araku Valley "at an elevation of about
  1300m above MSL". Worth reconciling — it may be a valley-floor vs plateau distinction.
- Five districts with atlas area have no `canon_regions` row: **Shivamogga** (153 ha), **Theni**
  (3,997), **Namakkal & Rasipuram** (1,144), **Rayagada** (624), **Kalahandi** (355). None has
  coffees today, so nothing renders wrong — but Phase 5 reconciliation should decide whether they
  belong.

### ~~4i. Region card images~~ — SHIPPED 2026-09-12

All 12 page-bearing regions have a commissioned illustrated plate in ImageKit at
`/regions/<canon-slug>/card-1`, with `canon_regions.logo_url` set. The hub card renders it
above the title, linked to the same destination as the title.

- Rendered via `coffeeImagePresets.regionCard` in `src/lib/imagekit/index.ts`. The preset
  already existed, unused, at `600x450 c-force`; it is now **width-only at q-82**, because the
  plates are `1122x1402` (4:5) and carry their own painted frame that a forced crop would cut.
  The card container is `aspect-[4/5]`, so the delivered `600x750` fills it exactly.
- **Fallback:** `REGION_CARD_FALLBACK` (`/images/discovery/region-landscape.png`), exported
  from the same file. A region with no plate renders the shared landscape, never a broken
  image — which is what every non-card region would hit if one were ever promoted.
- `unoptimized` on `next/image`, matching `CoffeeCard`: ImageKit is the optimizer, Next is not.
- **Do not pre-convert masters to AVIF.** ImageKit content-negotiates with no `f-` param — the
  2.5 MB PNG delivers as a 91 KB WebP through the card transform. An AVIF master saves nothing
  and forces a lossy-on-lossy re-encode for browsers served WebP. (This is the reverse of
  `public/images/discovery/*.avif`, which are pre-converted because they ship with no CDN in
  front.) ImageKit currently returns WebP even when AVIF is accepted — that is an account-level
  toggle worth enabling.
- **Cache trap:** `fetchRegionsCached` is `unstable_cache(..., { revalidate: 86400, tags:
  ["regions"] })`. After an upload the hub keeps the old image for up to 24 h. There is no
  revalidate endpoint in this repo; `/api/regions` is uncached and is how you confirm an upload
  landed. If image swaps become frequent, a route calling `revalidateTag("regions")` is the fix.

**Still unrendered:** `hero_image_url`, `terroir_image_url`, `context_image_url`. The columns
exist and are selected, but no images have been generated yet, so nothing displays them. Do
those together with the images, not before — the aspect ratio has to be decided against a real
crop.

### 4f. Estates — blocked on content, not code

`/estates/<canon_estates.slug>` (187/187 slugs filled, no bridge needed), rendered from
`get_estate_detail`, which is **already wired** in `fetch-estate-by-slug.ts`.

Generate from a **query, not a config list** — the pages are templated:

```
country = 'India' and description is not null and coffee_count >= 3
```

~20–25 pages of 187 initially, growing as enrichment lands, no code change per page.

⚠️ **Do not ship all 187.** 179 have no description, `quote` is 0/187, `hero_image_url` 0/187,
`canon_media` has 2 rows. That's doorway content and a sitewide quality risk. The query gate is a
guard, not an optimisation. Blocked on `/enrich-canon --table canon_estates` in the ops workspace.

`/estates` hub after that, same shape as `/regions`.

---

## 5. Known gaps and traps

**~~`RegionSummary` has no `coffee_count`.~~ Resolved: `get_region_coffee_counts()`**
(migration `20260911120000`, applied). Returns `own_count` and `rolled_count` per Indian canon region
in one call; `rolled_count` walks `parent_id` with a recursive CTE and `COUNT(DISTINCT coffee_id)`, so
a coffee tagged to both a parent and its child counts once. Fetch via
[`src/lib/data/fetch-region-coffee-counts.ts`](../src/lib/data/fetch-region-coffee-counts.ts) (24h cache, `coffees` + `regions` tags).

Two cheaper options were rejected: `get_coffee_filter_meta`'s `regions` facet is keyed on raw
`regions.id`, so several rows share a canon slug and summing them double-counts; a client-side rollup
has the same flaw.

**The RPC counts only `status IN ('active','seasonal')`**, matching `PUBLIC_COFFEE_STATUSES` and the
public directory — so its numbers are *lower* than §3's table, which counts all statuses. Chikmagalur
reads 357 own / 514 rolled, and `get_region_detail`'s per-region `coffee_count` for Chikmagalur is the
same 357. §3 stays the data-side view; the site shows the public-status view.

**`npm run supabase:types` output is unformatted.** Raw generator output produced a 6,359-line diff
for a 5-column change. Run `prettier --write src/types/supabase-types.ts` after regenerating and it
collapses to the real 25 lines. (lint-staged catches it on commit, but the diff is alarming first.)

**Canon DDL does not live in this repo's sibling.** [`icb-claude/canon/migrations/`](../../icb-claude/canon/migrations/) holds two
*historical duplicates* and a README saying so. All new canon migrations go in
[`supabase/migrations/`](../supabase/migrations/) here and are applied with the CLI, because this repo owns
`supabase_migrations.schema_migrations`. Applying raw SQL from the ops workspace would desync the
ledger.

**`/regions` is not a discovery page.** It's a hub. It needs a sitemap entry but must **not** go into
`discovery-pages.json`, whose contract is "one filter dimension, one value". Same for `/estates/*`,
which additionally needs an `estate` type added to that snapshot — otherwise `wiki-refresh-site`
keeps telling content agents that estates have no page (`routes.md:59-65` currently says exactly
that).

**Estate links in published content.** Articles link estates as `/coffees?estates=<slug>`. Once
`/estates/<slug>` exists that becomes canonical — a `wiki-lint` rule change plus a link sweep over
[`icb-claude/content/output/06_humanized`](../../icb-claude/content/output/06_humanized). Keep `?estates=` working; it's still right for multi-filter
combos.

**Never render an area figure without its `area_source` and `area_as_of`.** That's the whole point of
the constraint. The Coffee Board's 2014 web figures disagree with NRSC 2024 by up to 65% (Coorg:
82,000 vs 135,796 ha), so an unattributed number is worse than none.

---

## 6. Open decisions

1. ~~**Rolled-up `coffee_count`**~~ — decided: recursive-CTE RPC, `get_region_coffee_counts()`. (§5)
2. **Bespoke vs templated region copy** — bespoke is better for the top 5, unsustainable past ~15.
   Lean: bespoke for the existing 9, templated for new additions, config allowing either. Cheaper
   since 4e: a config now holds voice only, so "templated" means a shorter config, not a worse page.
3. **`/estates` index at launch or later?** 20 pages arguably don't need one.
4. ~~**Does `/regions` ship with the map or without?**~~ — shipped without; the asset drops in as a
   sibling section whenever it lands.

---

## 7. Verifying the DB state yourself

From the ops workspace (`icb-claude`), both are read-only:

```bash
python canon/region_structure.py --check   # tiers, hierarchy acyclic, districts consistent
python canon/nrsc_backfill.py --check      # every area figure matches the atlas, all sourced
```

Remaining data phases (ops workspace, not this repo): Phase 3 Coffee Board figures
(rainfall/varieties/intercrops/production), Phase 4 cleaning, Phase 5 raw `regions` reconciliation
(75 of 319 rows unmapped), Phase 6 enrichment gaps. None of them block the `/regions` hub.
