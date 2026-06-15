---
target: /roasters/{slug} page
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-06-13T18-31-29Z
slug: src-components-roasters-roasterdetailpage-tsx
---
# Critique: /roasters/{slug} page

## Design Health Score: 29/40 (Good)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scrollspy + rating feedback solid |
| 2 | Match System / Real World | 3 | Coffee-domain language natural |
| 3 | User Control and Freedom | 3 | Jump-nav + dismissible exit-intent modal |
| 4 | Consistency and Standards | 2 | Two emphasis languages, inconsistent italic, off-palette amber, bypasses Section primitive |
| 5 | Error Prevention | 3 | Low-risk surface |
| 6 | Recognition Rather Than Recall | 4 | Everything visible and labeled |
| 7 | Flexibility and Efficiency | 3 | Scrollspy jump-nav accelerator |
| 8 | Aesthetic and Minimalist Design | 2 | Eyebrow every section, side-stripe ban, busy hero, resting shadow-xl |
| 9 | Error Recovery | 3 | Delegated to QuickRating |
| 10 | Help and Documentation | 3 | Claim-your-page + site-wide learn/glossary |

## Anti-Patterns Verdict
Partially AI-looking, avoidably. Distinctive brand bones (Fraunces, smear, warm palette) undermined by banned scaffolding. Detector: 1 warning — side-tab (border-l-4 border-l-accent/40) at line 479, an absolute ban. Browser overlay unavailable (no browser tool this session); source + CLI only.

## What's Working
1. Scrollspy tab bar — sticky, clear active state, real wayfinding.
2. Conversion architecture — hero CTA → FloatingRateCTA → reviews funnel; warm empty states.
3. Adaptive logo background via useImageColor.

## Priority Issues
- [P1] Eyebrow scaffolding on every section (Hero/About/Coffees/CTA). DESIGN.md caps at ≤1 per 3. Route through Section primitive. → /impeccable layout
- [P1] Side-stripe border on About card, line 479 (absolute ban + detector). Replace with Decor stripe / full border. → /impeccable polish
- [P1] Two emphasis languages (smear + raw text-accent) + off-palette amber rating chip/star (amber-500/600/300 not in tokens; borderline contrast). → /impeccable colorize
- [P2] Hero overloaded — 9 competing blocks before fold; resting shadow-xl on CTA. Demote stat chips, lighten shadow. → /impeccable distill
- [P2] About body is long-form italic at muted-foreground/80 (likely sub-AA, readability). Use upright text-body via Prose. → /impeccable typeset

## Persona Red Flags
- Sam: muted/80 italic contrast; icon-only socials (title only); amber-coded rating.
- Casey: hero stacks tall on mobile (FloatingRateCTA mitigates); exit-intent at 45s may interrupt.
- Riley: long roaster bios render as untruncated italic wall.

## Minor Observations
- Dead code: RoasterHero.tsx unused (page inlines hero); contains raw emoji.
- Inconsistent overline tracking (0.2em vs 0.15em).
- Inconsistent italic h2 (Coffees/Reviews italic; About not).
- Raw <section> + hand-rolled padding repeated 4x instead of Section.

## Questions
- Hero leading with one dominant idea + single CTA?
- Do all sections need a kicker?
- What does the amber-free, single-accent version look like?
