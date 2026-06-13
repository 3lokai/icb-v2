---
target: coffee detail page (/roasters/{roaster}/coffees/{slug})
total_score: 27
p0_count: 0
p1_count: 3
timestamp: 2026-06-13T18-50-31Z
slug: src-components-coffees-coffeedetailpage-tsx
---
## Critique: Coffee detail page (`/roasters/{roaster}/coffees/{slug}`)

Target: `src/components/coffees/CoffeeDetailPage.tsx` (rendered via `roasters/[slug]/coffees/[coffeeSlug]/page.tsx`)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scrollspy active state + loading spinner are good; no breadcrumb shows where you are in the roaster hierarchy. |
| 2 | Match System / Real World | 3 | Strong coffee vocabulary; process terms (Anaerobic Naturals, bean species) not explained inline. |
| 3 | User Control and Freedom | 3 | Tabs + floating CTA help; no rendered breadcrumb back to roaster/coffees (only JSON-LD). |
| 4 | Consistency and Standards | 2 | Two label styles, second radius (`rounded-2xl` vs system `rounded-xl`), raw amber vs accent token, hand-rolled sections/chips instead of primitives. |
| 5 | Error Prevention | 3 | Low-stakes surface; external buy link + rating form are safe. |
| 6 | Recognition Rather Than Recall | 3 | Info visible; but roast/process/region/estate duplicated across hero and Origin section. |
| 7 | Flexibility and Efficiency | 3 | Scrollspy jump-nav + floating Rate CTA are real accelerators. |
| 8 | Aesthetic and Minimalist Design | 2 | Body is a stack of near-identical surface cards, each opened by the same eyebrow; metadata padded/duplicated. |
| 9 | Error Recovery | 3 | Empty states handled ("No tasting notes cataloged", "Be the first to rate"). |
| 10 | Help and Documentation | 2 | Glossary deep-links exist via inline links; processing/species jargon not defined at point of use. |
| **Total** | | **27/40** | **Acceptable (top edge — solid bones, templated middle)** |

### Anti-Patterns Verdict

**LLM assessment:** The hero is genuinely good and does *not* read as AI — distinctive italic-Fraunces title, real product imagery, a confident at-a-glance grid. The failure is everything below the fold: Sections 2–5 are a vertical stack of near-identical `surface-1 rounded-2xl` cards, each opened by the *same* decorative kicker (an 8px accent rule + small-caps overline) — "Coffee Story", "Origin & Production", "Roaster's Take", "Available Options". That eyebrow-on-every-section cadence is exactly the AI grammar the project's own DESIGN.md bans (≤1 per 3 sections). Strong top, templated body.

**Deterministic scan:** `detect.mjs` flagged **1 warning** — `side-tab` "Side-tab accent border" at `CoffeeDetailPage.tsx:506` (`border-l-4 border-l-accent/40` on the Coffee Story card). This is an *absolute ban* in both the Impeccable skill and the project DESIGN.md ("magazine accents live on the top edge, never the side"). Sub-components (`CoffeeSensoryProfile`, `CoffeeVariantSelector`, `SimilarCoffees`) scanned clean. The detector confirmed the LLM finding; it did not catch the eyebrow-repetition or the amber palette break (both LLM-only).

**Visual evidence:** Captured desktop light/dark + mobile, full-page and fold. The full-page shots make the templated card-stack and the repeated kicker obvious; the mobile full-page is extremely tall, largely because the same metadata appears twice.

### Overall Impression

A well-built, content-rich page with a strong editorial hero that loses its nerve below the fold and reverts to a templated card stack. The single biggest opportunity: break the "card + identical eyebrow" rhythm and stop showing the same roast/process/region/estate twice — the page would feel half as long and twice as designed.

### What's Working

1. **The hero composition.** Two-column image/info split, italic Fraunces display, at-a-glance grid, clear dual CTAs. Distinctive and on-brand.
2. **Scrollspy + floating Rate CTA.** Real wayfinding and a persistent primary action — genuine flexibility/efficiency wins.
3. **Empty states are handled.** "No tasting notes cataloged", "Be the first to rate/review" — Riley (stress tester) finds graceful fallbacks, not blanks.

### Priority Issues

- **[P1] Side-stripe accent border (absolute ban, detector-confirmed).** `border-l-4 border-l-accent/40` on the Coffee Story card (line 506).
  - *Why:* It's the single most recognizable AI-UI tell and the project explicitly bans side accents in favor of top rules (`<Decor stripe>`).
  - *Fix:* Remove the left border; if the card needs emphasis use a top rule or just the `surface-1` step + hairline.
  - *Command:* `/impeccable polish`

- **[P1] Eyebrow on every section.** Four consecutive hand-rolled kickers (line + `text-overline`) open Story, Origin, Roaster's Take, Pricing.
  - *Why:* DESIGN.md caps this at ≤1 per 3 sections and routes headers through the `Section` primitive; repeating a bespoke kicker on every card is the AI scaffolding the brand rejects.
  - *Fix:* Route section headers through `Section` (which owns the eyebrow budget), drop the kicker on most sections, and vary the section openings.
  - *Command:* `/impeccable layout`

- **[P1] Duplicated metadata.** Roast, Process, Region, Estate appear in the hero "At a Glance" grid *and* again in "Origin & Production."
  - *Why:* Burns the most valuable scroll real estate, inflates page length (badly on mobile), and makes the page feel padded rather than authoritative.
  - *Fix:* Pick one home for each fact — keep the quick scan in the hero, let Origin add only what the hero doesn't (variety, species, crop year, harvest), or collapse the two into a single richer block.
  - *Command:* `/impeccable distill`

- **[P2] Second accent color (raw amber).** The rating badge and star use `amber-500/600/300` directly (lines 317, 454) instead of accent/primary tokens.
  - *Why:* DESIGN.md commits to one accent (terracotta). Raw amber is a second accent and bypasses the token system / theme parity.
  - *Fix:* Map the star/rating to `accent` (or a dedicated tokenized "rating" color) so it themes correctly in dark mode.
  - *Command:* `/impeccable colorize`

- **[P2] Templated card-stack + second radius.** Every section is the same `surface-1 rounded-2xl` card; the system card radius is `rounded-xl` (14px), so `rounded-2xl` is an off-system second radius.
  - *Why:* "Editorial over templated" is principle #1; identical card rhythm + a stray radius scale is the opposite.
  - *Fix:* Vary section layout family (full-bleed, two-column, ruled list — not always a boxed card) and standardize on `rounded-xl`.
  - *Command:* `/impeccable layout`

### Persona Red Flags

**Jordan (first-timer):** The loudest CTA is the amber-starred "Rate this coffee" (primary), while "Buy from roaster" is a muted outline button. ICB's stated job is to convert outward to the roaster — the visual hierarchy points the newcomer at rating, not buying. Process jargon ("Anaerobic Naturals", species) sits unexplained next to the fold.

**Casey (mobile, one-handed):** The full mobile page is very long, largely from the duplicated roast/process/region/estate. Floating Rate CTA is a good thumb-zone anchor, but the duplicated content means a lot of scrolling to reach pricing/reviews. The cookie banner overlays the fold.

**Sam (a11y):** Rating badge meaning leans on color (amber) + star; verify the amber-600-on-amber/10 pill clears 4.5:1 and that dark-mode amber holds contrast (it's outside the contrast-tuned token set).

### Minor Observations

- `font-serif` on the h1 (line 297) is redundant — `text-display` is already Fraunces.
- Flavor notes are hand-rolled pill `<div>`s instead of the `Tag`/`badge` primitive — another consistency drift.
- Scrollspy tabs are Overview/Flavor/Pricing/Reviews, but the "Coffee Story" section (`#coffee-story`) has no tab, so a whole section is unreachable from the jump-nav.
- Two label styles coexist: hero `text-label` vs Origin `text-label uppercase tracking-widest font-bold`.
- Hero "Rate this coffee" carries `shadow-xl` (modal-tier) at rest + `hover:scale-[1.02]` — heavier than the flat-paper elevation rules call for.

### Questions to Consider

- What if the body sections stopped being boxes? A ruled editorial list for Origin and a full-bleed flavor band would break the stack instantly.
- Does the same fact need to appear twice? What does the hero owe the reader vs. the Origin section?
- Should "Buy from roaster" be the confident primary, given ICB converts outward — with "Rate" as the secondary engagement action?
