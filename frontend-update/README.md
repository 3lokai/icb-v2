# Frontend Update — Preserve & Elevate

A site-wide design uplift for ICB v2 that **keeps the brand and IA intact** while lifting the
pages from "competent but templated" to "intentional and editorial."

This is **not** a rebrand. Fraunces + DM Sans, the OKLch warm palette, coffee-tinted shadows, the
magazine aesthetic, all routes/slugs/nav/form fields/analytics events — all preserved.

## Design Read

Redesign — *preserve* mode, specialty-coffee discovery audience, editorial/magazine language on
the existing Fraunces + DM Sans + OKLch system. Dials: `VARIANCE 7 / MOTION 6 / DENSITY 4`
(rhythm overhaul, brand preserved).

## Approach: bottom-up through the existing component layers

The codebase already has a clean layering, and the redesign runs **bottom-up through it** rather
than editing pages directly:

| Layer | Folder | Role |
|-------|--------|------|
| 1. shadcn/ui | `ui/` | Owned base components |
| 2. **Primitives** | `primitives/` | Layout + rhythm: `PageShell`, `Section`, `Stack`, `Cluster`, `Rule`, `Prose` |
| 3. Cards | `cards/` | Domain display units (`CoffeeCard`, `RoasterCard`, …) |
| 4. Section composables | `homepage/`, `roasters/`, `blog/`, … | Page sections |
| 5. Pages | `app/` | Compose sections |

**Key insight:** the layout system mostly *already exists* — `Section` already has `eyebrow` +
`title` + a spacing scale, and `PageShell` owns the only padding scale. The tells appear because
section components **escape** these primitives and inline bespoke headers/decoration. So the work
is **re-convergence onto the primitive layer** (Sprint 0), after which sections mostly *delete*
code. Discipline becomes *structural*, not a written rule.

## The systemic problems (found on every surface)

| # | Issue | Evidence |
|---|-------|----------|
| 1 | **Eyebrow saturation** | ~115 `uppercase tracking` eyebrows; 14/14 home, 6/6 marketing, 5/5 learn sections |
| 2 | **Italic-serif accent-word tic** | `<span class="text-accent italic font-serif">Word</span>` on 12+ headings — **replaced** by the locked coffee brush-smear `<Accent>` (`stain-smear.png`), rationed ≤1/page (see Sprint 0) |
| 3 | **Layout-family repetition** | "eyebrow + title + desc + grid" on ~9/14 home sections; 3-equal-card grid 7+ times |
| 4 | **Heading hierarchy bugs** | article `h2`==`h3`; marketing pages mix heading classes for the same level |
| 5 | **Decorative-tell clutter** | blur washes, dot textures (24px vs 32px), color stripes, glass cards, 2 SVG line motifs |
| 6 | **Motion inconsistency** | TopRated/CTA/FAQ static while neighbors over-animate |
| 7 | **Card-reuse fatigue** | `CoffeeCard` across 3 home sections, no differentiation |
| 8 | **Ad-hoc spacing** | `gap-6/8/12` per-section, no scale discipline |

## Sprints

Each sprint is independently shippable. Execute in order — Sprint 0 unlocks the rest.

| Sprint | Focus | Risk | File |
|--------|-------|------|------|
| 0 | Design-system primitives (the leverage point) | Med | [sprint-0-design-system.md](./sprint-0-design-system.md) |
| 1 | Homepage recomposition | Med | [sprint-1-homepage.md](./sprint-1-homepage.md) |
| 2 | Marketing / public pages | Low | [sprint-2-marketing-pages.md](./sprint-2-marketing-pages.md) |
| 3 | Learn hub + article reading | Low | [sprint-3-learn.md](./sprint-3-learn.md) |
| 4 | Directory pages (coffees / roasters) | Low | [sprint-4-directory.md](./sprint-4-directory.md) |

## Preservation guardrails (apply to every sprint)

- No changes to routes/slugs, nav labels, form field names/order, analytics events, brand logo.
- Keep Fraunces + DM Sans, OKLch palette, coffee-tinted shadows, magazine feel.
- **Fraunces exception:** the taste skill flags Fraunces as a banned default serif. We keep it —
  it is the established brand face and we are in preserve mode.

## Definition of done (every sprint)

1. `npm run type-check` clean; `npm run lint` clean (zero-warning policy).
2. Walked in **both light and dark** mode.
3. Taste-skill pre-flight: eyebrow count ≤ ceil(sections/3) per page; ≤1 italic-serif accent
   word per page; **zero em-dashes** in visible copy; one accent / one radius / one theme per page.
4. `prefers-reduced-motion` collapses all motion to static.
5. Responsive collapse verified at `<768px`.
