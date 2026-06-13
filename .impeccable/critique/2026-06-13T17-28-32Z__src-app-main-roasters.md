---
target: roasters directory page
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-06-13T17-28-32Z
slug: src-app-main-roasters
---
# Critique — Coffees & Roasters Directory Pages

Target: `/coffees` and `/roasters` directory listing pages (page.tsx, CoffeeDirectory, RoasterDirectory, CoffeeCard, RoasterCard, filter components). Reviewed against Sprint 4 scope. Dev server :3002, walked light + dark, desktop + mobile.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeletons, "Showing X of Y", CLS reserves, dynamic facet counts — strong. Filter-change feedback is just a count flip to "Loading…". |
| 2 | Match System / Real World | 3 | Coffee vocabulary is natural; "—" rating block is slightly cryptic for unrated items. |
| 3 | User Control and Freedom | 3 | URL-as-source-of-truth (shareable/back works), Reset, mobile drawer. |
| 4 | Consistency and Standards | 2 | Two sibling directories diverge: top faceted bar (coffees) vs left sidebar (roasters); RoasterDirectory hand-rolls `container mx-auto` instead of PageShell; double headers; 2 accent smears/page. |
| 5 | Error Prevention | 3 | Constrained inputs, debounced search, one-click reset, no destructive actions. |
| 6 | Recognition Rather Than Recall | 3 | Filters + counts visible, active-filter badges; coffee facets partly hidden behind "Refine". |
| 7 | Flexibility and Efficiency | 3 | Sort, filter combos, URL sharing, search — but no keyboard accelerators, saved filters, or favorites. |
| 8 | Aesthetic and Minimalist Design | 2 | Editorial hero (65–80vh) + redundant second header eat the first screen; roaster grid patchwork; otherwise clean. |
| 9 | Error Recovery | 2 | Generic centered "Error loading… Please try refreshing." — no retry button, no diagnosis. |
| 10 | Help and Documentation | 3 | Per-directory FAQ blocks + glossary/learn layer. |
| **Total** | | **27/40** | **Acceptable (top edge) — strong functional foundation, editorial-polish inconsistencies.** |

## Anti-Patterns Verdict

**LLM assessment:** Does NOT read as generic AI slop. The brand system (Fraunces hero at weight 400, warm OKLCH palette, the `<Accent>` brush-smear, opinion-first cards) is committed and distinctive. The failures here are not "AI made this" — they're internal-consistency and information-architecture lapses against the project's own DESIGN.md. Two self-imposed rules are broken: the "One Smear Rule" (2 `<Accent>` phrases per page) and eyebrow rationing (stacked hero overline + section eyebrow).

**Deterministic scan:** detect.mjs over coffees/roasters/cards components returned only 2 findings — `border-l-4` side-tab borders in `CoffeeDetailPage.tsx:506` and `RoasterDetailPage.tsx:479`. Both are on **detail** pages, outside this directory critique's scope. The directory listing surfaces themselves are clean per the detector — consistent with Sprint 4's "already strong" assessment.

**Visual evidence:** Full-page + grid-region captures in light and dark confirm: (1) the hero occupies the entire first viewport on both pages; (2) the roaster grid is a patchwork of light/dark logo-background tiles that inverts between themes (e.g. "7000Steps" is a black tile in light mode; "7 Elements" becomes a glaring white tile in dark mode).

## Overall Impression

These are genuinely strong, well-engineered browse surfaces wearing an editorial coat that's a half-size too big. The cards, the filter mechanics, and the loading/CLS hygiene are the best parts of the codebase. The single biggest opportunity: **the pages are styled as if discovery is the job, but the job is browsing** — a user who arrives to find a coffee scrolls past a full-screen dark hero and a redundant second intro before reaching a single product. Tighten the top of the page and unify the two siblings, and these jump from "acceptable" to "good."

## What's Working

- **CoffeeCard opinion-first hierarchy.** Name → roaster → bean-count roast indicator → price → community rating footer with inline quick-rate. It's a real magazine tile with a genuine point of view, not an icon-heading-text clone. Keep it.
- **Engineering-as-UX hygiene.** URL is the single source of truth for filters (shareable, bookmarkable, back-button-correct), CLS space is reserved before data loads, skeletons cover fetches, facet counts update dynamically, search is debounced. Visibility-of-status is a strength.
- **The hero craft itself.** Fraunces hero at weight 400 with the Accent smear over warm dark imagery is on-brand and beautiful. The problem is size/placement on a functional surface, not the execution.

## Priority Issues

- **[P1] Editorial hero + redundant second header consume the entire first screen on a browse surface.** PageHeader is `min-h-[80vh]` mobile / `md:min-h-[65vh]` desktop, full-bleed dark image. Immediately below, the directory repeats a near-identical intro: hero "India's Passionate Roasters / Artisan Roaster Directory / Discover specialty coffee roasters…" then "Explore India's Roaster Network / The Directory / Discover specialty coffee roasters…". The grid starts ~1.5 screens down (worse on mobile at 80vh). Same on coffees, which also injects a third discovery layer (DiscoveryAccordionGrid) before results.
  - *Why it matters:* The primary job is finding a coffee/roaster. Burying results below a full screen of photo + duplicate copy adds friction precisely where Casey (mobile) and the impatient browser bail.
  - *Fix:* Drop the hero to ~40–48vh on these two routes, and collapse the duplicate intro — the page needs one header, not the hero's plus the directory section's. Let filters/grid reach the first fold (or near it) on desktop.
  - *Suggested command:* `/impeccable layout`

- **[P1] The two sibling directories diverge in pattern and plumbing.** Coffees = top faceted filter bar + full-width grid, wrapped in PageShell. Roasters = left `md:w-64` sidebar + grid, and RoasterDirectory hand-rolls `container mx-auto p-4 pt-16 md:pt-24` (bypassing PageShell — which DESIGN.md calls "the only horizontal padding scale… never hand-roll a container"; Sprint 4 notes `.container-default` was removed in favor of PageShell). Heading styling also diverges (sidebar "Filters" is an `h2.text-subheading`, breaking the h2→`.text-title` contract).
  - *Why it matters:* A user learns the filter model on one page and finds a different one on its sibling. Consistency is the lowest-scoring heuristic here.
  - *Fix:* Decide one filter paradigm (a faceted top bar likely wins for coffees' many facets; roasters could adopt the same with location facets, or both share a sidebar). Route RoasterDirectory through PageShell. Normalize heading levels.
  - *Suggested command:* `/impeccable layout`

- **[P2] Roaster grid reads as a patchwork.** Per-card dynamic logo-color extraction sets each tile's background light or dark for logo legibility. In light mode "7000Steps" is a stark black tile among cream tiles; in dark mode "7 Elements" becomes a glaring white block. The inversion makes the grid feel uncohesive in both themes.
  - *Why it matters:* The eye snaps to the odd tile, not the content; the set stops reading as one directory.
  - *Fix:* Use one consistent neutral logo plate per theme (e.g. always `surface-1`/`surface-2`) and solve logo legibility with a subtle inner container or padding rather than flipping the whole card background. If contrast variety is wanted, cap it to a narrow tonal band, not full black↔white.
  - *Suggested command:* `/impeccable quieter`

- **[P2] Brand-rule self-violations: two accent smears and stacked eyebrows per page.** Coffees: hero `<Accent>Exceptional</Accent>` + directory `<Accent>Coffee Catalogue</Accent>`. Roasters: hero `<Accent>Passionate</Accent>` + directory `<Accent>Roaster Network</Accent>`. Plus hero overline AND a "The Directory" section eyebrow. DESIGN.md's "One Smear Rule" = one accented phrase per page, and eyebrows are rationed to ≤1 per 3 sections.
  - *Why it matters:* The smear's power is its rarity; two per page halves the signature's impact and contradicts the documented system.
  - *Fix:* Keep the smear on the hero only; the directory section title goes plain. Drop one eyebrow (the duplicate intro removal in P1 handles most of this).
  - *Suggested command:* `/impeccable typeset`

- **[P2] Filter-label contrast risk.** Filter group labels use `text-muted-foreground/60` at `text-micro`, bold + uppercase (Countries, States, Cities, Options, Filter by Name). `muted-foreground` is tuned for AA at full opacity; at 60% over cream and at micro size it very likely drops below 4.5:1.
  - *Why it matters:* These are the labels that tell users what each filter group controls — they must be legible (WCAG AA is a stated project commitment).
  - *Fix:* Drop the `/60` (use full `muted-foreground`) or bump toward foreground; verify ≥4.5:1 in both themes.
  - *Suggested command:* `/impeccable audit`

## Persona Red Flags

**Casey (Distracted Mobile User):** Hero is 80vh on mobile — a full thumb-scroll of photo before the page even names what's below; then a second duplicate intro before the grid. First product is ~2 screens down. Filters are behind a drawer toggle (fine), but the cost of entry to "see coffees" is high for someone browsing one-handed on the go.

**Riley (Deliberate Stress Tester):** The error state is a dead end — "Error loading roasters / Please try refreshing the page." centered, no retry button, no preserved filter state shown. Empty-filter results (over-narrowing location + active-only) weren't surfaced with guidance in the captures; verify the zero-results state gives a way back, not just an empty grid.

**Jordan (Confused First-Timer):** The opinion-first rating footer shows a large "—" + "Rating" on every unrated card; with sparse community data most cards lead with an empty number block, and a single 1-star vote renders as a bold "1.0 Rating (1)" — disproportionate prominence for n=1. A newcomer can misread "—" as broken or "1.0" as a verdict.

**The Curious Newcomer (project persona — exploring Indian coffee, doesn't know the vocabulary):** Served well by the roast-bean indicator and FAQ, but the coffees page stacks three discovery framings (hero → DiscoveryAccordionGrid → directory header) before results, which can read as "where do I even start?" rather than "here are the coffees."

## Minor Observations

- Heading-level contract: sidebar "Filters" `h2.text-subheading` vs directory `h2.text-title` — same level, two styles.
- Coffee grid: single-vote ratings ("1.0 (1)") get full number-block prominence; consider a threshold before showing a numeric average.
- Third-party cookie-consent banner overlaps the bottom of the grid in every capture (out of scope, but it covers content on first load).
- `RoasterDirectory` results count is centered and italic; `CoffeeDirectory`'s is also centered — fine, but the centered placement is unusual for a left-aligned grid header.

## Questions to Consider

- What if the grid (or at least the filter bar) reached the first fold on desktop — would the hero lose anything essential by dropping to ~45vh?
- Do `/coffees` and `/roasters` need different filter layouts, or is that an accident of being built at different times?
- Is the second "The Directory" header saying anything the hero didn't already say?
- What would the roaster grid feel like with one calm, consistent logo plate instead of per-logo background inversion?
