# Client JS: Phosphor Icons

**Goal:** reduce the client JS shipped for icons. **Status:** investigation —
read the "Reality check" before assuming a win exists.

## The number that started this

`npm run analyze` reported `@phosphor-icons/react` at **~711 KB** of client JS
whole-app. That is a **sum across all routes** (per-route-split), not a
single-page cost. No individual page ships 711 KB of icons.

## Reality check — current state is already good

The codebase already does the right thing:

- **145** import sites use `@phosphor-icons/react/dist/ssr` — the per-icon,
  tree-shakeable entry. Each icon is its own module; a page's chunk carries only
  the icons it renders.
- A thin wrapper `src/components/common/Icon.tsx` takes the imported icon
  **component** (`<Icon icon={FireIcon} />`), not a name string. Its header
  comment explicitly forbids reintroducing a name→component registry, because a
  dynamic-key lookup defeats tree-shaking (an old 150-icon map used to ship on
  every page — already removed).
- Only **3** files import the runtime barrel `@phosphor-icons/react`
  (`password-input.tsx`, `auth-reset-password-form.tsx`,
  `ChartDownloadButton.tsx`) with **named** imports (`{ Eye, EyeSlash }`,
  `{ CircleNotch }`, `{ DownloadSimple, CircleNotch }`). Named imports also
  tree-shake — these are fine.
- ~27 other `@phosphor-icons/react` imports are `import type { IconProps }` /
  `Icon` — type-only, ship zero JS.

So the low-hanging fruit (icon registry) is already gone.

## The only remaining lever — and why it's hard

Each Phosphor icon **component** bundles the SVG paths for **all 6 weights**
(thin / light / regular / bold / fill / duotone) because weight is a runtime
prop (`<Icon weight="duotone" />`, the project default). Even a page that only
ever renders `duotone` ships the other 5 weights' path data per icon.

There is **no first-party single-weight import path** in `@phosphor-icons/react`
— you cannot `import` just the duotone variant. Options, roughly in order of
effort vs. payoff:

1. **Do nothing (recommended default).** Icons are already tree-shaken per-icon;
   the per-route cost is modest. Confirm the actual per-route icon KB before
   investing — measure `/`, `/coffees`, `/roasters/[slug]` (see README method).
   If it's <30 KB/route, close this out.
2. **Inline the handful of high-frequency icons as local SVG components.** For
   the 5–10 icons that appear on nearly every page (nav, card chrome), hand-roll
   single-path `<svg>` components. Removes their multi-weight cost from the
   shared bundle. Small, boring, safe — but only worth it for genuinely
   ubiquitous icons.
3. **Swap the icon library** for one that ships single-weight modules (e.g.
   `lucide-react`). Large, invasive, changes the visual language (duotone is a
   deliberate brand choice). Almost certainly not worth it pre-launch.

## Recommendation

Measure per-route icon KB first (option 1). Most likely outcome: **this is not a
real win** and should be closed. If one route is icon-heavy, apply option 2 to
just that route's ubiquitous icons. Do **not** reach for option 3.

## Do not

- Reintroduce a name-string icon registry / dynamic `icons[name]` lookup — it
  re-breaks tree-shaking (see `Icon.tsx` header).
- Switch `/dist/ssr` imports back to the barrel.

## Verify

`npm run type-check && npm run lint && npm run build`, then the per-route
serve-and-sum measurement (README). Compare against a clean worktree.
