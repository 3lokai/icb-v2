---
target: how icb works page
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-06-19T12-14-31Z
slug: src-app-main-public-how-icb-works-page-tsx
---
# Critique: How ICB Works page

Target: src/app/(main)/(public)/how-icb-works/page.tsx (inspected at localhost:3001, desktop 1440 + mobile 390)

## Design Health Score: 28/40 — Good (low band)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static page; link affordances fine |
| 2 | Match System / Real World | 3 | Clear, but "discovery infrastructure / reference layer" leans grand |
| 3 | User Control and Freedom | 3 | Nav + outbound links present |
| 4 | Consistency and Standards | 2 | Two+ eyebrow treatments, hand-rolled headers bypass Section, drifting bg/border opacities |
| 5 | Error Prevention | 3 | n/a — no forms |
| 6 | Recognition Rather Than Recall | 3 | Labels clear, nav visible |
| 7 | Flexibility and Efficiency | 3 | Single content path, fine |
| 8 | Aesthetic and Minimalist Design | 2 | Flat/forgettable; repeated motifs + banned side-stripe |
| 9 | Error Recovery | 3 | n/a |
| 10 | Help and Documentation | 3 | The page IS documentation; scannable |

## Anti-Patterns Verdict
- Deterministic scan: 1 hard finding — side-stripe border at page.tsx:78 (border-l-4 border-l-accent). On the project's own ban list. Confirmed.
- LLM: repeated identical card grids (For Whom 4-up, Trust 3-up); hairline-underline-under-every-title motif (h-px w-16 bg-accent/60 x4) = eyebrow trope by reflex.
- Failure mode is over-restraint, not gradient-slop: utility-grade, not the committed magazine voice.

## What's Working
1. Hero -> Essence card -mt-20 overlap (one strong editorial move).
2. Content architecture: "what it is / is not", "what Verified does not mean" — excellent trust framing.
3. Restraint partially fits a neutrality page — but reads flat, not deliberate.

## Priority Issues

### [P1] Terracotta accent used as body text & links — fails WCAG AA at 2.46:1
text-accent on cream measured 2.46:1 (need 4.5; fails even 3:1 large-text). Affects the "Explore the database." link (:108-113) and "Paid partnerships do not influence..." sentence (:151). Misuses accent role (accent is smear/underline/hover only, never body). Fix: use text-primary for links/emphasis; foreground-bold for the neutrality sentence. Command: /impeccable colorize or /impeccable polish.

### [P1] Banned side-stripe on accent callout
page.tsx:78 border-l-4 border-l-accent — forbidden by DESIGN.md ("never the side"). Fix: drop side border; use <Decor stripe> top-edge or full border-accent/30 + tint. Command: /impeccable polish.

### [P2] Rhythmically flat — uniform 64px gaps, no-op surfaces, no motion
Stack gap=16 between every section; bg-card/5 + border-border/20 render as ground (no surface-1 separation); no Reveal despite it being canonical. Fix: vary spacing, promote cards to real bg-card/border-border/60, wrap in Reveal. Command: /impeccable layout then /impeccable animate.

### [P2] Inconsistent header system + Section primitive bypass
Hand-rolled headers instead of Section eyebrow/title props. Four ways to announce a section coexist (overline, two differing text-micro eyebrows, hairline underline). Eyebrows on only some sections. Fix: route through Section, one kicker cadence, retire the hairline ticks. Command: /impeccable layout.

### [P3] No visual anchor / imagery beyond hero
"How Discovery Works" is pure prose where a product screenshot or data-attribute diagram would prove the claim. Command: /impeccable bolder.

## Persona Red Flags
- Sam (a11y): terracotta link/sentences invisible-grade at 2.46:1; primary CTA is least-readable text. Blocker.
- Jordan (first-timer): grand phrasing abstract before seeing a coffee; grounding CTA is the low-contrast link.
- Skeptical Buyer (project): copy serves them perfectly but decoration-by-reflex (identical grids, accent ticks, side-stripe) undercuts the "no marketing theatre" message.

## Minor Observations
- Lots of reading content is small (text-caption 14px) + muted.
- Two muted-italic pull-quotes read as filler; one would land harder.
- bg-card/5 / bg-muted/5 are visual no-ops — commit or drop.

## Questions to Consider
- Continue the Essence-card overlap energy with alternating warm/cream ground bands?
- Does a neutrality page earn more trust from confident restraint or one strong data proof-visual?
- Remove every h-px accent tick — does anything get lost, or does it look more designed?
