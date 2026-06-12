# Sprint 6 — Cards: prioritize ratings submission

> **Status: ⬜ Not started** (verified 2026-06-08). No `CardRatingFooter.tsx`; `StarRating.tsx` has
> no `role="radio"`/`radiogroup` or keyboard handling (a11y blocker 6.1 still open); `RoasterCard.tsx`
> has no rating path.

**Goal:** Make **rating submission the primary, consistent, accessible action** across the card layer.
The opinion-first `CoffeeCard` footer is a genuine strength — this sprint propagates that strength to
the variants and card types that currently drop it, and fixes the one thing that undercuts it
everywhere: the interactive rating is **not keyboard-operable**.

**Design read:** redesign — *preserve* mode, specialty-coffee discovery audience, editorial language
on the existing Fraunces + DM Sans + OKLch system. Dials: `VARIANCE 7 / MOTION 6 / DENSITY 4` (match
the rest of the uplift). This is a behavior/affordance pass, not a restyle.

**Risk:** Medium. Touches the most-reused component on the site (`CoffeeCard` renders across home,
directory, similar, recently-viewed) plus the rating widget itself. Accessibility changes are
structural (div→button), so verify click-vs-navigate isolation survives.

**Depends on:** nothing new — Sprint 0 primitives already available. Independent of Sprints 4/5.

## Why this sprint exists

The rating-submission capability is **half-wired**: `QuickRating` already supports
`entityType: "coffee" | "roaster"` with the full modal flow (auth fallback, anon 3-review cap,
brew-method/milk fields), but the UI only ever exposes the **coffee** path, and only on two of four
`CoffeeCard` variants. The backend can take roaster ratings; nothing on screen asks for them.

## Audit findings (evidence)

**Rating affordance by card today:**

| Card / variant | Primary CTA | Rating shown | Rating submission |
|---|---|---|---|
| `CoffeeCard` hero / default | navigate to detail | ✅ `StarRating` in `RatingFooter` | ✅ interactive → `QuickRating` modal |
| `CoffeeCard` compact / similar | navigate to detail | ❌ footer dropped | ❌ none |
| `RoasterCard` (both variants) | navigate to detail | ❌ | ❌ — **but `QuickRating` supports `entityType:"roaster"`** |
| `RecipeCard` | `onSelect` | ❌ | ❌ (selection card) |
| `CollectionCard` / `RegionCard` / `CuratorCard` / `CommunityCard` | navigate | ❌ | ❌ (not rating surfaces — correct) |
| `ProfileSelectionCard` | navigate | edit/delete existing | manages existing rating, not new |

**The core gaps:**
1. **Roaster ratings are invisible.** `RoasterCard` has zero rating UI despite full backend +
   `QuickRating` support. The largest single missed submission path.
2. **Two `CoffeeCard` variants drop the footer** (`compact`, `similar`) — exactly the
   recently-viewed / recommendation contexts where a one-tap rating is most valuable.
   `CoffeeCardSkeleton` confirms this is intentional today (compact skeleton has no rating zone).
3. **The interactive rating is not keyboard-operable (a11y blocker).** In `CoffeeCard.tsx:157` the
   `RatingFooter` is a `<div onClick>` with no `role`/`tabindex`/`onKeyDown`; in
   `StarRating.tsx` each star is a `<div onClick>` with no per-star `aria-label` and no keyboard
   handler. You cannot submit a rating with a keyboard or reliably with a screen reader. `RecipeCard`
   already shows the correct in-repo pattern (`role="button"`, `tabindex={0}`, `onKeyDown`
   Enter/Space). **Per the taste skill's a11y pre-flight, this fails as shipped** — and "prioritize
   ratings" is meaningless if the affordance isn't reachable.

**What's already good (preserve):**
- The `stopPropagation` split between the navigate-zone (`Link`) and the rating-zone
  (`CoffeeCard.tsx:184-187`) is robust — replicate it anywhere a rating is added over a clickable card.
- Opinion-first hierarchy (rating footer pinned `mt-auto`, community avg + count on the left,
  interactive stars + microcopy on the right) is the right model. Don't redesign it; reuse it.
- The empty/loading states and CLS rating-zone reserve in the skeletons.

## Tasks

### 6.1 Make the rating affordance accessible (do this first — it gates everything)
- Convert `RatingFooter`'s clickable shell to a real `<button>` (or `role="button"` + `tabindex={0}` +
  `onKeyDown` Enter/Space), with an `aria-label` like `Rate {coffee.name}`.
- In `StarRating`, when `interactive`, render stars as `<button>`s in a `role="radiogroup"` (each star
  `role="radio"` / `aria-checked`, `aria-label="{n} stars"`), keyboard arrow + Enter operable. Keep the
  read-only display path unchanged. This widget is shared, so the fix lands everywhere at once.
- Preserve the `stopPropagation` isolation so keyboard/pointer rating never triggers card navigation.

### 6.2 Surface roaster ratings on `RoasterCard`
- Add a `RatingFooter`-equivalent to `RoasterCard` wired to
  `QuickRating entityType="roaster"`. Reuse the CoffeeCard footer pattern (extract a shared
  `CardRatingFooter` rather than copy-paste — see 6.4) so the two stay consistent.
- Mirror the change in `RoasterCardSkeleton` (add the rating-zone reserve) to keep CLS clean.

### 6.3 Decide the compact / similar variants
- These intentionally omit the footer. Recommendation: add a **minimal interactive rating row**
  (stars + short microcopy, no full number block) rather than the full footer, so list/recommendation
  contexts can still capture a rating without the density cost. See open question — confirm before building.

### 6.4 Extract a shared `CardRatingFooter`
- The footer logic (state A/B microcopy, community avg vs. user rating, `QuickRating` open) is currently
  private to `CoffeeCard`. Extract it so `CoffeeCard` and `RoasterCard` share one accessible, tested
  implementation parameterized by `entityType`. Net: less duplication, guaranteed consistency.

### 6.5 Preserve
- No route/slug/nav/analytics changes. Keep the navigate-vs-rate click isolation, opinion-first
  hierarchy, image-color/zoom treatment, skeleton shapes, and the anon 3-review cap behavior.

## Files
- `src/components/common/StarRating.tsx` (keyboard + ARIA — shared widget)
- `src/components/cards/CoffeeCard.tsx` (extract footer; variant decision)
- `src/components/cards/RoasterCard.tsx` + `RoasterCardSkeleton.tsx` (add rating path)
- `src/components/cards/CoffeeCardSkeleton.tsx` (match any variant change)
- `src/components/reviews/QuickRating.tsx` (no behavior change expected; confirm roaster path props)
- new: `src/components/cards/CardRatingFooter.tsx` (shared, accessible)

## Acceptance criteria
- A rating can be submitted **by keyboard alone** (Tab to the footer/stars, arrow/Enter to rate) and is
  announced by a screen reader, on every card that exposes rating.
- `RoasterCard` can submit a roaster rating via `QuickRating entityType="roaster"`.
- One shared `CardRatingFooter` powers both coffee and roaster; no duplicated microcopy logic.
- Card navigation never fires when rating, and rating never fires when navigating (pointer + keyboard).
- Skeletons reserve the rating zone wherever a footer renders (no CLS).
- `npm run type-check` + `npm run lint` clean; walked in light + dark; `prefers-reduced-motion` static.

## Open questions for discussion
- Compact/similar variants: add the minimal interactive rating row (6.3), or keep them display-only and
  rely on the detail page for submission? (Density vs. capture trade-off.)
- Roaster rating placement: full footer (parity with CoffeeCard) or a lighter inline stars row, given
  RoasterCard's logo-led layout?
- Should the interactive stars submit on click directly (1-tap optimistic) or always open the
  `QuickRating` modal first? Today it opens the modal pre-filled — keep that, or make a logged-in 1-tap
  fast path with the modal as the "add detail" follow-up?
