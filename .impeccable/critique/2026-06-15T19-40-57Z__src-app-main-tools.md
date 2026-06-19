---
target: the tools pages
total_score: 30
p0_count: 1
p1_count: 2
timestamp: 2026-06-15T19-40-57Z
slug: src-app-main-tools
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Compass has no initial empty/"pick a symptom" state; otherwise strong (step checkmarks, "showing X of Y", confidence %) |
| 2 | Match System / Real World | 3 | Strength axis named three ways (average / Medium / Balanced); compass diagnosis surfaces extraction jargon unscaffolded |
| 3 | User Control and Freedom | 4 | Excellent — reset, clear-all, removable chips, copy-link state, timer pause/reset |
| 4 | Consistency and Standards | 2 | Two divergent recipe filter UIs (dropdowns vs pills), counts on mobile only, hard-coded `bg-white`, expert-name drift |
| 5 | Error Prevention | 3 | Good range validation; invalid `?method=` URL silently resets, generic catch is a dead-end |
| 6 | Recognition Rather Than Recall | 3 | Compass wheel interactivity relies on a faded hint; otherwise good (presets, dropdown metadata, facet counts) |
| 7 | Flexibility and Efficiency | 4 | Copy-link sharing, URL prefill, keyboard wheel control, presets — strong dual-track |
| 8 | Aesthetic and Minimalist Design | 2 | Landing-page triple icon-card grid + value props + ghost cards; glassmorphism orbs; marketing apron buries each tool |
| 9 | Error Recovery | 3 | RecipeDetail clipboard fallback is exemplary; RecipeDisplay swallows the same failure silently |
| 10 | Help and Documentation | 3 | MethodGuide / Pro Tips / FAQ / "How It Works" are genuinely helpful; compass diagnosis has no glossary |
| **Total** | | **30/40** | **Good — solid foundation, dragged down by consistency (4) and minimalism (8)** |

## Anti-Patterns Verdict

**It's a tale of two codebases.** The interactive cores — Coffee Compass, the calculator engine, the faceted recipe filter — are real, senior-level interaction design and do NOT read as AI slop. The *packaging* around them does.

**LLM assessment:** The tools landing page (`src/app/(main)/tools/page.tsx`) hits the banned slop trifecta almost perfectly: three near-identical centered icon-circle → centered-title → centered-description card grids stacked vertically (Featured 192–230, Coming Soon 242–278, Value Props 296–321); the "Always Free / Mobile-First / Built by Coffee Lovers" value-prop grid (the single most recognizable AI-landing cliché); ghost coming-soon cards with already-slipped dates ("Coming Q1 2026" — today is 2026-06-16); double-nested `hover:scale-[1.02]` + `group-hover:scale-110` on card *and* icon; and an eyebrow on every section including a CTA overline ("Ready to Level Up") that duplicates its own H2 verbatim. Secondary tell across the interactive components: glassmorphism — `animate-float … blur-2xl` orbs and `backdrop-blur-sm` (BrewTimer even self-labels "with Glassmorphism") — which is off-brand for a cream-paper, depth-via-surface field guide.

**Deterministic scan:** `detect.mjs` over both tools directories (29 files, exit 2) returned 6 warnings:
- **`border-accent-on-rounded` ×4** — `border-t-4` thick top borders on `rounded-xl` cards in `MethodGuide.tsx:328/343/358/373`, colored `chart-2`/`primary`/`accent`. *Partly defensible:* the design system permits magazine accents on the **top** edge (this is not the banned side-stripe). *But* it's hand-rolled raw `border-t-4` rather than the `<Decor stripe>` primitive, and `chart-2` introduces a color beyond the single-accent system. Downgrade to minor, but worth normalizing.
- **`bounce-easing` ×1** — `cubic-bezier(0.34, 1.56, 0.64, 1)` on the compass rotation (`CoffeeCompassClient.tsx:635`). Overshoot curve; the parent skill discourages bounce/elastic. A judgment call — playful on a compass — but it does match the dated-bounce rule.
- **`layout-transition` ×1** — false positive: substring match on SVG `stroke-width`, not CSS layout `width` (`CoffeeCompassClient.tsx:735`). Discounted.

Detector and LLM agree the glass/bounce flourishes are off-brand; the detector additionally caught the MethodGuide top-border color drift the design review folded into "consistency."

**Visual overlays:** Unavailable. The running dev server 404s on all `/tools` routes (stale/prod build on another branch), so no live browser injection or user-visible overlay was produced. Findings are static source review + deterministic scan only.

## Overall Impression

The tools *work* and several are delightful — the Compass especially is a standout. The problem is that genuinely good tools are wrapped in generic marketing scaffolding that makes the section look AI-generated on arrival and buries the craft. The single biggest opportunity: **strip the packaging** (landing-page card grids, glass orbs, per-page marketing CTAs) so the tools speak for themselves, and **unify the two recipe filter UIs**.

## What's Working

1. **The Coffee Compass interaction model** (`CoffeeCompassClient.tsx`) — bidirectional chip↔wheel sync with a 350ms debounce, shortest-path rotation math, keyboard + scroll + click affordances, and honest "No AI / No API — pure coffee physics" framing that flatters a skeptical specialty audience. No generator produces this.
2. **The calculator's deliberate one-directional constraint** ("ONE WAY ONLY," lines 75/113) — refusing the confusing bidirectional solver, plus URL-state + copy-link sharing on top. Choosing *not* to build something is a senior move.
3. **Faceted recipe filtering with honest live counts** — each facet's count computed by re-filtering with that facet excluded (`RecipeClient.tsx:97–198`), with removable applied-filter chips. Correct, non-trivial, clean control/freedom.

## Priority Issues

### [P0] The tools landing page is the banned slop trifecta
- **Why it matters:** It's the entry point to the whole section and the most generic surface in the set — three identical icon-card grids, hollow value props, ghost cards with slipped dates — directly violating the project's explicit DON'Ts and underselling three good tools one click away.
- **Fix:** Replace with an editorial 3-tool index: one field-guide intro line, then three *differentiated* tool entries (asymmetric, real "what it does for you" copy, not centered icon-circle clones). Delete the value-props grid (fold "free, no signup" into one quiet footer line). Delete or demote the coming-soon ghost grid to a single text line. Remove nested icon scale-on-hover; cards flat at rest, coffee-tinted shadow on hover only.
- **Suggested command:** `/impeccable distill` (then `/impeccable quieter`)

### [P1] Glassmorphism / floating blur orbs are off-brand across the interactive components
- **Files:** `BrewTimer.tsx`, `RecipeDisplay.tsx`, `RecipeDetail.tsx`, `FilterSection.tsx`, `DrinkSizeInput.tsx`.
- **Why it matters:** ICB's identity is cream paper + tonal surfaces, depth *without* shadow, no glass/gradient. `animate-float … blur-2xl` orbs and `backdrop-blur-sm` on inputs/buttons import a generic dark-SaaS glass aesthetic and add noise to dense surfaces where clarity should win.
- **Fix:** Strip decorative `absolute rounded-full bg-*/5 blur-*` orbs and `animate-float`; replace `backdrop-blur-sm` on controls with solid `surface-1` tokens; keep depth via `surface-0/1/2`.
- **Suggested command:** `/impeccable quieter` (then `/impeccable polish`)

### [P1] Recipe filtering is two divergent UIs with split capabilities
- **Files:** `RecipeFacetedFilterBar.tsx` (desktop dropdowns, no counts), `RecipeSidebar.tsx` + `MobileRecipeFilterDrawer.tsx` (mobile pills, with counts), orphaned `FilterSection.tsx`, duplicated hard-coded method/expert lists (Garay vs Ibarra Garay drift).
- **Why it matters:** Desktop and mobile users get materially different filtering (counts only on mobile), data is duplicated and already drifting, and a third unused filter primitive lingers. Consistency failure + maintenance hazard.
- **Fix:** Pick one filter model (recommend the count-bearing pill pattern for both viewports), source all facet lists from the single config `filterRecipes` uses, surface counts on desktop too, delete `FilterSection.tsx` if dead.
- **Suggested command:** `/impeccable clarify` (consolidate IA) / `/impeccable harden` (de-dupe sources)

### [P2] Every tool page ends on a marketing CTA instead of task completion
- **Files:** calculator page:361 and expert-recipes page:426 render `ExpertRecipesCta`; landing page has its own near-clone CTA (327–397) with hollow `100% Control` / `5+ Methods` stats.
- **Why it matters:** Peak-end — the last thing after using a precision tool is "Shop Coffee Beans" + fabricated stats, converting a satisfying task ending into an ad and diluting the trust the Compass works to build.
- **Fix:** End the calculator on the result with a quiet "save / copy / try on a recipe" continuation; reserve one honest cross-link instead of a full hero CTA; drop the invented stat numbers.
- **Suggested command:** `/impeccable delight` / `/impeccable clarify`

### [P2] Compass diagnosis lacks novice scaffolding at the decision moment
- **File:** `CoffeeCompassClient.tsx` (result banner 524–579; interactivity hint 798–815).
- **Why it matters:** Newcomers hit a wheel that reads as decorative (interactivity is a faded 70%-opacity hint below it) and a diagnosis ("Under-Extracted & Strong," move vector) with no glossary or "do this first, then re-taste" reassurance. The best moment is the least explained.
- **Fix:** Add a left-panel empty state ("Pick what you taste to begin"), make the wheel's interactivity a persistent affordance, add a one-line plain gloss + "what does this mean?" link under the diagnosis.
- **Suggested command:** `/impeccable onboard`

## Persona Red Flags

**Alex (power user) — calculator/recipes:** Method counts disagree across tools (11 vs 5 vs 10) — which is authoritative? No recipe compare/pin (detail fully replaces grid). Desktop recipe filters lack the counts mobile gets — the laptop power user is *worse* served than on a phone.

**Jordan (first-timer) — compass:** Wheel reads as decorative; the "scroll/arrow to rotate" hint is faded and below it. 25 symptom chips at once with no explicit "start here." Diagnosis jargon with no glossary. No initial guidance state.

**Casey (distracted mobile) — recipe filters:** Two-tap path via a small low-contrast "Detailed Filters" ghost link; the drawer is a *different* UI than desktop so cross-device muscle memory fails; two filtering entry points coexist on one small screen.

**The curious newcomer (no coffee vocabulary) — project persona:** Hit hardest. Compass chips ("vegetal," "astringent," "chalky," "hollow," "tea-like") are tasting jargon with zero inline definition. "Ratio 1:15" appears everywhere unexplained until you dig into MethodGuide. Strength named three ways (average/Medium/Balanced) — can't tell they're the same axis. Defaults exist but aren't framed as "not sure? pick this."

## Minor Observations

- Two clipboard UX standards in one feature: `RecipeDetail` shows a proper error w/ `role="alert"`; `RecipeDisplay` only `console.error`s.
- `Icon name={tool.icon as any}` casts lose type safety — an icon-name typo ships silently.
- BrewTimer builds a fresh `AudioContext` per step and never closes it; failure path uses `console.log` (stripped in prod).
- `expertRecipesCollectionSchema` hardcodes `numberOfItems: 8` while the page computes the count dynamically — structured data can drift.
- `min-h-[55vh]` PageHeader pushes the actual tool below the fold on laptops; only the compass compensates with `-mt-20`.
- `StrengthSelector` declares Circle/CircleHalf/CircleFilled icons but renders manual dots — the `icon` field is dead data.

## Questions to Consider

1. If the Compass is the best thing here, why is it third, buried under a 55vh hero, and given the same generic card as a calculator?
2. Do the four marketing sections below each tool convert anyone, or are they SEO keyword farms wearing UI? If SEO, can they live behind a clear tool boundary so they stop competing for hierarchy?
3. The Compass proudly says "No AI." The landing page screams "built by a generator." Which claim does a discerning user believe?
4. Is there a single source of truth for tool vocabulary (methods, strength labels), or does each component re-invent it?
5. Why does mobile get better recipe filters than desktop?
6. Should a "Field Guide" ever ship dated promises ("Coming Q1 2026") that structurally guarantee the page looks stale?
