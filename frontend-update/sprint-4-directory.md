# Sprint 4 — Directory Pages (Coffees / Roasters)

**Goal:** Lightest-touch polish on the most functional surfaces. They are already strong (good
skeletons, CLS reserves, responsive 1/2/4 and 1/2/3 grids, opinion-first cards) — don't break them.

**Risk:** Low. Can land last.

**Depends on:** Sprint 0 (✅ shipped). Available: `<Decor>` (`@/components/primitives/decor` —
`texture="dots"`/`wash`/`stripe`; renders an `aria-hidden absolute inset-0` layer, so the parent
must be `relative overflow-hidden`). `.grid-cards` is the canonical 3-col token; `.container-default`
removed → `<PageShell>`. Heading contract: h2→`.text-title`, h3→`.text-heading`.

## Tasks

### 4.1 Filter decoration cleanup
- Refine/remove the decorative blur circles in `FilterSection.tsx` via `<Decor wash />`.

### 4.2 Card texture
- Replace `RoasterCard.tsx` plate-texture with `<Decor texture="dots" />`.
- Keep `CoffeeCard` opinion-first hierarchy + interactive rating footer (genuine strength).

### 4.3 Detail-page separation
- On `RoasterDetailPage.tsx`, strengthen section separation with negative space over hairline
  `border-t`. Keep the scrollspy + sticky tab bar (real UX strength).

### 4.4 Coffee `[slug]` disambiguation page
- It is currently bare. Add related/discovery content using existing grid components.

### 4.5 Preserve
- Responsive grid logic, skeleton/empty states, CLS reserves, image-color extraction — keep all.

## Files
- `src/components/tools/FilterSection.tsx`
- `src/components/cards/{CoffeeCard, RoasterCard}.tsx`
- `src/components/roasters/RoasterDetailPage.tsx`
- `src/app/(main)/coffees/[slug]/page.tsx`

## Acceptance criteria
- Filter/card decoration uses shared helpers only.
- Roaster detail sections read clearly separated; scrollspy intact.
- Disambiguation page no longer bare.
- No regression to loading/empty/skeleton states.

## Open questions for discussion
- Filter blur circles: refine to a subtle single wash, or remove decoration entirely?
- Disambiguation page: how much discovery content is appropriate vs keeping it a fast redirect?
