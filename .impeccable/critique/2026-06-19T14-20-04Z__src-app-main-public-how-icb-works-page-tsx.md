---
target: how icb works page (re-run)
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-19T14-20-04Z
slug: src-app-main-public-how-icb-works-page-tsx
---
# Critique (re-run): How ICB Works page

Target: src/app/(main)/(public)/how-icb-works/page.tsx — after fixes (accent re-role, side-stripe removal, Band rhythm, surface depth, header consolidation, Reveal motion, spec proof-visual, /developers link).

## Design Health Score: 30/40 — Good (up from 28)

| # | Heuristic | Score | Note |
|---|-----------|-------|------|
| 1 | Visibility of System Status | 3 | Static page |
| 2 | Match System / Real World | 3 | Clear language |
| 3 | User Control and Freedom | 3 | Nav + links |
| 4 | Consistency and Standards | 3 | Was 2 — headers unified, surfaces consistent, routed through Band/Stack/Decor/Reveal |
| 5 | Error Prevention | 3 | n/a |
| 6 | Recognition Rather Than Recall | 3 | Labels clear |
| 7 | Flexibility and Efficiency | 3 | Fine for page type |
| 8 | Aesthetic and Minimalist Design | 3 | Was 2 — rhythm + surface depth + proof visual; no longer flat |
| 9 | Error Recovery | 3 | n/a |
| 10 | Help and Documentation | 3 | The page is documentation |

Note: the single most important real-world fix (terracotta body text 2.46:1 -> primary 16.4:1, AA pass) is not captured by Nielsen's heuristics, which have no a11y axis.

## Resolved since last run
- [P1] Accent-as-body-text a11y failure — fixed (text-primary / text-foreground).
- [P1] Banned side-stripe at line 78 — removed; rebuilt with <Decor stripe> top edge.
- [P2] Rhythmic flatness — alternating cream/warm Band grounds + grain texture; real surface-1 cards; Reveal stagger.
- [P2] Inconsistent header system — hairline ticks + competing eyebrows removed; single page kicker.
- [P3] No proof visual — added "Sample record" spec card in Discovery.
- Detector: 1 finding -> 0.

## Remaining minor
- Two muted-italic lines ("Trust is a feature…" + closing note) still co-exist; one could go.
- For Whom (4-up) and Trust (3-up) remain card grids — now on real surfaces and distinct, acceptable.
- Imagery is still type/diagram only; a real product screenshot would push it further if desired.
