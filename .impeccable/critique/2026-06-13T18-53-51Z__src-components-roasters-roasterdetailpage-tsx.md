---
target: /roasters/{slug} page
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-06-13T18-53-51Z
slug: src-components-roasters-roasterdetailpage-tsx
---
# Critique (re-run): /roasters/{slug} page

## Design Health Score: 32/40 (Good, upper band) — up from 29

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scrollspy + rating feedback |
| 2 | Match System / Real World | 3 | Coffee-domain language natural |
| 3 | User Control and Freedom | 3 | Jump-nav + dismissible modal |
| 4 | Consistency and Standards | 4 | Emphasis/italic/tracking/chip chrome now unified |
| 5 | Error Prevention | 3 | Low-risk surface |
| 6 | Recognition Rather Than Recall | 4 | Everything visible/labeled |
| 7 | Flexibility and Efficiency | 3 | Scrollspy accelerator |
| 8 | Aesthetic and Minimalist Design | 3 | Slop gone; hero still a few stacked blocks |
| 9 | Error Recovery | 3 | Delegated to QuickRating |
| 10 | Help and Documentation | 3 | Claim-your-page + site-wide learn |

## Anti-Patterns Verdict
No longer reads AI-generated. Detector: 0 findings (was 1, the side-stripe). Eyebrow scaffolding, side-stripe, off-palette amber chrome, and modal-weight CTA shadow all removed. Smear is now a consistent, documented per-section brand signature (per ignore.md). Render-checked at 200; removed patterns confirmed absent. No browser overlay this session.

## What's Working
1. Coherent emphasis system — smear is the single consistent name-highlight across all section headings.
2. Ratings-first hierarchy holds — Rate CTA clearly primary; rating chip now quiet evidence.
3. Accessible icon links — real aria-label names, glyph aria-hidden.

## Remaining Issues (all P3, minor)
- [P3] Hero density — two stat chips not folded into "At a glance". → /impeccable distill
- [P3] Long-bio edge case — untruncated whitespace-pre-line wall, no clamp/read-more. → /impeccable harden
- [P3] Structural tidiness — raw <section> vs Section primitive (not user-visible). → /impeccable polish

## Persona Check
- Sam: social-link names fixed; focus rings; rating = star + numeric (not color-alone). Clear.
- Riley: empty states handled; long-bio wall remains.
- Casey: tall hero but FloatingRateCTA keeps primary action reachable; exit-intent 45s is a product choice.

## Changes since last critique
- Hero rating chip conformed to palette tokens (border-border/40 bg-muted/20), gold star kept as semantic.
- Emphasis unified to <Accent> smear across About/Coffees/Reviews; all three h2 now font-serif italic.
- Removed "Our Story"/"Curated Selection" overline kickers.
- Side-stripe (border-l-4 border-l-accent/40) -> full hairline border.
- Resting shadow-xl on Rate CTA -> shadow-md hover:shadow-lg.
- About body: muted-foreground/80 italic -> upright muted-foreground, max-w-2xl.
- Social icon links: added aria-label + aria-hidden glyph.
- Overline tracking standardized to 0.2em.
- Deleted dead RoasterHero.tsx.
