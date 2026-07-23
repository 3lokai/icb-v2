# Refactor: QuickRating

**Goal:** edit safety. **Type:** refactor, behavior-preserving. **Risk:**
medium-high — this is the primary review-capture UI, wired to many surfaces.

## Why

`src/components/reviews/QuickRating.tsx` — **762 LOC**, cognitive complexity
**108** (the highest in the codebase). It holds **8+ `useState`** and **6+
`useEffect`** in one component: rating, comment, works-with-milk, brew method,
hover state, started flag, delete-confirm, limit-reached, identity key, plus
effects syncing them. Any edit here risks a subtle state/effect interaction bug.

## How reviews flow (context)

QuickRating is the interactive rating widget. Add/read path (verified working):

```
QuickRating / RatingPanel
  → useCreateReview (TanStack Query mutation)
  → createReview server action (src/app/actions/…)
```

Anonymous users rate against an `icb_anon_id` that merges into their account on
sign-in — see `docs/auth.md` (the identity-merge RPCs). The `identityKey` state
+ its effect in QuickRating tie into that. **Read `auth.md` before touching the
identity/effect logic.**

## Consumers (wide fan-out — don't break any)

- `src/components/reviews/RatingPanel.tsx`
- `src/components/reviews/ExitIntentRatingModal.tsx`
- `src/components/profile/ProfileSelections.tsx`, `AddSelection.tsx`
- `src/components/cards/RoasterCard.tsx`, `CardRatingFooter.tsx`
- `src/app/(main)/roasters/[slug]/page.tsx`
- `src/app/(main)/roasters/[slug]/coffees/[coffeeSlug]/page.tsx`

Re-exported via `src/components/reviews/index.ts`.

## Suggested extraction (only where seams are real)

The complexity is state management, not markup. Pull the state out first:

1. **`useQuickRating` hook** — owns all the `useState` + `useEffect`s and returns
   `{ rating, comment, worksWithMilk, brewMethod, hasStarted, isLimitReached,
   handleRatingClick, handleSubmit, handleDelete, … }`. This is the real win:
   the component becomes render-only, the state becomes testable/greppable in one
   place.
2. Then, if still large, split presentation into `StarRow`, `ReviewDetailsForm`
   (milk/brew method/comment), and `DeleteConfirm` — dumb components taking the
   hook's values as props.

Watch the effects that sync `initialRating` / identity — those encode ordering
assumptions (limit check before submit, identity resolved before create).
Preserve effect ordering; don't collapse two effects into one unless you're sure
they're independent.

## Client-JS angle

Minimal — this must be client. Refactor is purely for edit safety. (It does load
on card footers across listing pages, so if the hook extraction lets the heavy
detail form become a lazy/on-`hasStarted` island, that's a bonus JS win — but
don't force it.)

## Verify

- `npm run type-check && npm run lint`
- Manual smoke in `npm run dev`: rate a coffee (signed out → sign in → confirm
  the rating merged), edit a rating, delete a rating, hit the rating limit, the
  exit-intent modal, and a card-footer rating. All paths route through this
  component.
