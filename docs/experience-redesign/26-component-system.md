# 26 — Component System: Ownership and First Pass

**Status (2026-11-11): IMPLEMENTATION STARTED on `design/experience-redesign`; not merged into `main`, not verified in browser.** This is the Phase C working contract after [24](24-information-architecture.md) and [25](25-page-hierarchy.md). It does not supersede locked visual tokens in [22](22-visual-system.md) or authorize a production rollout.

## Core decision: evolve shadcn at its source

The existing shadcn New York components in `src/components/ui/` are the **single source** for reusable primitives. Do not build a parallel `ICBButton`, `ICBInput`, etc. merely to override their appearance through CSS. Retain existing exports, variants, Radix behavior, and `cn(className)` overrides where needed.

Use shared semantic colour, radius, typography and spacing tokens as we roll the locked Deep Roast system into the application. The reference values remain in `system/icb-system.css`; the global application token migration is a **separate, explicitly tested step** because `globals.css` and fonts still reflect the previous production theme.

## Component ownership

| Ownership | Examples | Rule |
|---|---|---|
| **Base shadcn** `src/components/ui/` | Button, Card, Input, Textarea, Select, Sheet, Dialog, DropdownMenu, Tabs, Badge | Update base implementations directly for globally consistent styles and accessibility; preserve API |
| **Generic composition** `src/components/layout/` / `src/components/search/` / `src/components/discovery/` | Header, mobile navigation, command search, filters, breadcrumb, landing-page sections | Compose existing primitives; no duplicate forks of base controls |
| **Domain components** `src/components/cards/`, `src/components/coffees/`, `src/components/roasters/` | CoffeeCard, CardRatingFooter, coffee detail, roaster summaries, rating flow | Remain distinct; their data/provenance/action contracts are not shadcn concerns |
| **Visual storytelling** homepage/feature-specific components | Scroll progression, editorial transitions, ambient surfaces | Kept out of base controls. Native scroll and reduced-motion fallback required |

**Iconography:** keep Phosphor. `components.json` already selects `phosphor`, and `common/Icon.tsx` enables tree-shaken direct imports. Icon weight is a context decision; do not globally force duotone for every icon or replace the library.

## Phase C order

1. **Base controls, narrow pass (started):** Button, Input, Textarea, Card. Existing variant names are retained; improve motion reduction, touch sizing and semantic surface use. This is not the locked brand-token migration.
2. **Base controls, audited pass:** Select, Dialog/Sheet, DropdownMenu, Tabs, Badge and popovers. Audit each in real contexts before altering radius, layout or content behavior. There are already ICB-specific overrides.
3. **Navigation/search contracts:** Separate nav configuration from rendering; top-level Coffees · Roasters · Origins · Learn · Tools · More; Profile submenu with children to be decided at component design; search groups and rating-intent mode. Do not add `/explore` or `/rate`.
4. **Coffee card contract:** Reuse existing `CoffeeCard` and `CardRatingFooter`; preserve in-place rating, one card detail link, wishlist, packing imagery, meaningful states and review provenance.
5. **Directory, coffee detail and homepage compositions:** Shared primitives, different information density. Homepage bands form a continuous, scroll-driven narrative rather than visually isolated boxes. Never animate packaging artwork itself.
6. **Rollout gate:** integrate locked light/dark tokens and typography with the root layout, test contrast, focus, mobile tap targets, visual parity, `prefers-reduced-motion`, LCP, CLS and SEO. Only then consider a production ADR/merge.

## First-pass file changes

- `ui/button.tsx`: preserved all button variants and sizes; adjusted default touch sizing, motion-reduction support and border/text tokens for outline.
- `ui/input.tsx`, `ui/textarea.tsx`: semantic background surface, reduced-motion-safe focus transitions, slightly larger default targets.
- `ui/card.tsx`: solid semantic border, no coffee-specific layout or image rules.

**Risk note:** These primitives are used throughout the current application, so changes on the design branch will affect existing screens when that branch runs. Review representative live pages in *both* themes before merging, and do not interpret these commits as visual QA. No changes were made to `globals.css`, layout fonts, existing `CoffeeCard`, header, routes, data, SEO or production.

## Acceptance checklist (not yet verified)

- [ ] Run type-check, lint and tests on branch checkout
- [ ] Render Button variants, disabled/loading and keyboard focus
- [ ] Verify Input and Textarea touch sizing, invalid states and form layouts
- [ ] Verify Card layouts do not regress in coffee, roaster, editorial and settings contexts
- [ ] Verify dark and light contrast, keyboard and reduced-motion behavior
- [ ] Confirm Deep Roast token bridge and Gambetta/Ranade integration in dedicated step
