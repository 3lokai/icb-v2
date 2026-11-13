# 26 — Component System: Ownership and First Pass

**Status (2026-11-12): SECOND SHADCN PASS COMMITTED FOR REVIEW on `design/experience-redesign`.** Button/Input/Textarea/Card were browser-reviewed previously; Select/Dialog/Sheet/Dropdown/Tabs/Badge and genuine CoffeeCard preview have now been committed, but **the newest changes have not yet undergone type-check or browser QA**. Not merged into `main`. This is the Phase C working contract after [24](24-information-architecture.md) and [25](25-page-hierarchy.md). It does not supersede locked visual tokens in [22](22-visual-system.md) or authorize a production rollout.

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

**Iconography (CONFIRMED 2026-11-12):** keep Phosphor. **Regular is the default functional weight**; fill marks an active state (wishlisted, rated stars); duotone only where a context calls for it. `components.json` already selects `phosphor`, and `common/Icon.tsx` enables tree-shaken direct imports. Direct imports already default to regular, but the `Icon` wrapper still defaults to `duotone` (461 call sites) — flipping that default is a broad visual change, held until the foundations are approved.

## Phase C order

1. **Base controls, narrow pass (started):** Button, Input, Textarea, Card. Existing variant names are retained; improve motion reduction, touch sizing and semantic surface use. This is not the locked brand-token migration.
2. **Base controls, audited pass (committed for QA):** Select, Dialog/Sheet, DropdownMenu, Tabs and Badge received focused updates for control heights, neutral focus surfaces, dialog geometry and reduced motion. No public component API was changed. Popovers and real-page context checks remain pending.
3. **Navigation/search contracts:** Separate nav configuration from rendering; top-level Coffees · Roasters · Origins · Learn · Tools · More; Profile submenu with children to be decided at component design; search groups and rating-intent mode. Do not add `/explore` or `/rate`.
4. **Coffee card contract (preview added):** The playground imports the genuine `CoffeeCard` and its `CardRatingFooter` with fictional sample values (rated, unrated, viewer-rated and similar). The sample uses `coffee_id: null` so rating/wishlist actions cannot persist data. Production CoffeeCard remains unchanged. The playground's illustrative detail link is **not** a real coffee page.
5. **Directory, coffee detail and homepage compositions:** Shared primitives, different information density. Homepage bands form a continuous, scroll-driven narrative rather than visually isolated boxes. Never animate packaging artwork itself.
6. **Rollout gate:** integrate locked light/dark tokens and typography with the root layout, test contrast, focus, mobile tap targets, visual parity, `prefers-reduced-motion`, LCP, CLS and SEO. Only then consider a production ADR/merge.

## First-pass file changes

- `ui/button.tsx`: all variants and sizes preserved. Sizes: `sm` 32px, `default` 40px, `lg` 48px (16px label); `icon-sm`/`icon`/`icon-lg` 32/40/48px. The 36/40/44px scale read as one size. Outline uses `border-input`. Transitions limited to colour/border/shadow/transform and disabled under `prefers-reduced-motion`.
- `ui/input.tsx`: 40px, solid `bg-background`, reduced-motion-safe focus transition.
- `ui/textarea.tsx`: min 96px, solid `bg-background`, reduced-motion-safe focus transition.
- `ui/card.tsx`: solid `border-border` (was `/60`); no coffee-specific layout or image rules.

### Regression review (2026-11-12) — fixed

- **Fixed-height overrides were lost.** The first pass used `min-h-*` on Button sizes and Input. `tailwind-merge` doesn't treat `min-h-*` and `h-*` as conflicting, so a caller's smaller `h-*` lost to the new minimum. 35 Button and 8 Input call sites pass `h-*`. Broken examples: the remove buttons on `tags-input` chips (`h-4`, `h-6` → 36px), the button inside `HeroSearch` (`h-8` → 40px), `BrewTimer` (`h-8`), and the sidebar input (`h-8`). **Fix:** back to fixed `h-*` like upstream shadcn, so overrides win again (verified: `h-8` → 32px, `h-6` → 24px, `h-14` → 56px).
- **Outline text colour.** The first pass added `text-foreground` to outline, which overrides inherited colour wherever outline buttons sit inside coloured containers. Removed, matching upstream.
- **Input padding.** `py-2` inside 40px left 22px for `file:h-7` (28px) and overflowed. Reverted to `py-1`.
- APIs unchanged: no variant, size, prop or export was added or removed.

## Spacing scale and layout primitives (CONFIRMED 2026-11-12)

**Scale:** power of 2 with half-steps, fixed across the site — **4, 8, 12, 16, 24, 32, 48, 64, 96px** (Tailwind `1, 2, 3, 4, 6, 8, 12, 16, 24`). Off the scale: 6, 10, 14, 20, 28, 40, 56, 80, 112px. Control heights (buttons, inputs) are sizes, not spacing, and are exempt; they follow what the new design needs.

**Layout primitives own spacing.** Pages and components compose these from `src/components/primitives/` instead of hand-writing section padding and gaps:

| Primitive | Role | Spacing |
|---|---|---|
| `Section` | Vertical rhythm between page sections, with optional eyebrow, title and description | tight 24/32/48, default 32/48/64, loose 48/64/96 at mobile/tablet/desktop; header to content 48 |
| `Stack` | Vertical gap between components | 4, 8, 12, 16, 24, 32, 48, 64 |
| `Cluster` | Horizontal wrapping gap | 4, 8, 12, 16, 24, 32 |
| `PageShell` | Max width and side padding | 16/24/32 |
| `Band` | Full-bleed band | 48/64 top and bottom |
| base `Card` (`ui/card.tsx`) | Card padding and internal gap | 24 |

Rules:

1. Use a primitive before writing a spacing class. New section wrappers are not created per page.
2. Hand-written spacing uses a value on the scale by default. An off-scale value is allowed as a **documented exception** — an optical correction or a dense control that needs it — with a one-line comment at the call site saying why.
4. The homepage and editorial compositions may break the section rhythm deliberately. `Section`'s warm ground, borders and decor are optional props, not the expected pattern.
3. Adjacent sections get their separation from `Section`, not from margins on their children.

**Applied on this branch (2026-11-12):**

- `Section` moved from 24/40/56, 40/56/80, 56/80/112 to the values above. The other primitives were already on the scale.
- The component playground uses `Section` and `Stack` instead of its own wrapper.
- Sweep of hand-written classes: 492 changes in 144 files, nearest step on the scale — 6→8, 10→12, 14→16, 20→24, 28→24, 40→32, 44→48, 56→48, 80→64px.
- Checked: type-check and lint pass; `/`, `/coffees`, `/roasters` and `/learn` render at 1280px and `/`, `/coffees` at 375px with no horizontal overflow. Only the top of `/` and `/coffees` was compared by eye; other pages were not reviewed visually.

**Visual regression check (2026-11-12):** the pre-sweep commit `9211287` and the swept branch were rendered side by side at 1280px and 375px for seven pages: `/coffees`, a coffee detail page, a roaster page, a Learn article, `/profile/anon`, `/tools/coffee-calculator` and `/coffees/v60`.

- No page gained horizontal overflow or an error overlay at either width.
- Page height moved by less than 1% on five of the seven at desktop. The two larger shifts were `/profile/anon` (−244px, about 6%) and `/coffees/v60` (−190px, about 2%), both from tighter section padding.
- By eye (desktop: coffee detail, directory, profile, calculator; mobile: coffee detail, directory): layouts, card grids, filters and chips are intact. Section gaps are slightly tighter; nothing collides or wraps differently.
- Not covered: signed-in dashboard pages, the open mobile filter sheet, auth screens, dark theme, and the lower part of long pages. The spacing migration stays **provisional** until those are looked at.
- Pre-existing, not caused by the sweep: on mobile the coffee detail "About …" heading runs past the right edge in both versions.

**Not swept:** `src/components/ui/` (shadcn internals; part of the Phase C step 2 audit), `src/app/api/` (OG images), and two one-off 144px and 176px values. Arbitrary values such as `lg:pb-[200px]` are untouched.

## Component playground (review surface)

`src/app/design/components/` → **`/design/components`** on a dev server or preview deployment. It returns 404 on the production deployment (`VERCEL_ENV === "production"`) and is `noindex` everywhere else. It is not in the sitemap or navigation.

- **Real source:** it imports `@/components/ui/*` directly, with no copies or forks.
- **Token bridge:** `deep-roast.css` maps the locked Deep Roast light/dark values onto the existing shadcn variables. It is scoped with `html:has([data-icb-playground])`, so it reaches Radix portals (Dialog, Select, Sheet, DropdownMenu) and disappears when you leave the page. `globals.css` is untouched.
- **Aligned with `system/index.html`:**
  - The locked paper grain sits on the page ground: 13% multiply in light, 22% soft-light in dark. It replaces the production noise overlay on this page only.
  - Headings use Gambetta 400 at −0.02em tracking and 1.1 line height. At this first review the repo still used weight 500; the design branch now uses weight 400 in `src/app/styles/typography.css`. The root-layout font migration remains a rollout-gate decision.
  - Still open, because neither is locked: the reference's 48px pill CTA versus the shadcn button sizes, and its uppercase 12px label style.
- **Fonts:** Gambetta and Ranade come from Fontshare for review only, using the same URL as `system/index.html`. Production will self-host via `next/font/local` at the rollout gate. **Trap:** adding more weights or italics to the combined Fontshare URL makes it silently serve Switzer or Kola instead of Ranade.
- **Sections:** type and tokens; Button (every variant × size, icons, icon sizes, disabled, loading, `aria-invalid`, `asChild`, static focus preview, caller overrides, mobile action bar); Input and Textarea (default, focus, invalid, disabled, file, inline search, newsletter); Card (roaster summary, editorial teaser, settings, full-width review form); Phosphor weights; and an unchanged step-2 preview (Badge, Tabs, Dialog, Sheet).

**Verified in a browser on 2026-11-12** (Chromium at 1280px and 375px, light and dark): sizes measure exactly as specified; nothing overflows horizontally at 375px; real Tab focus shows a solid accent border plus a 3px halo; Dialog renders on the bridged ground with a Gambetta title; `prefers-reduced-motion` drops transitions to `none`; all Gambetta and Ranade faces load.

### Alignment with the decision docs (2026-11-12)

The playground copy and compositions follow [07](07-decisions.md), [20](20-direction.md), [22](22-visual-system.md), [24](24-information-architecture.md) and [25](25-page-hierarchy.md). Wording is the docs' working copy, not final copy.

- **Rate/Buy roles** (07 PROPOSED, 20 §5, 25 B9): Buy is filled; Rate is an accent outline. Rate is a `className` composition on the existing `outline` variant; no new Button variant until the role is approved.
- **Arrows** (07/20/23 PROPOSED): ↗ (`ArrowUpRight`) only for leaving ICB; → (`ArrowRight`) for internal links.
- **Coffee page actions** (25 §5): "Buy from [roaster] ↗", "Rate", wishlist. States: "View at [roaster] ↗" (sold out), "Visit [roaster] ↗" (no product link), "Your rating: 4 · Edit".
- **Roaster page** (25): "Visit [roaster] ↗" filled, "Rate this roaster" outline.
- **Mobile sticky bar** (25 B7): Buy and Rate only; wishlist stays in the page actions.
- **Rating entry points** (24 §6): "Rate a coffee you've tried" alongside "Browse coffees". There's no Rate button in a header.
- **Rating copy** (25 §1, B1): "4.3 · 12 ratings" and "No ratings yet · Tried it? Rate it". Sample counts are realistic: only 16 coffees have 3+ ratings. Stars are `aria-hidden`; the number and count carry the evidence.
- **Rating context form** (24 §7.2, 25 §5, real `isValidComment`): optional brew method and notes, at most 1,000 characters, no minimum. Placeholders match `QuickRating` ("Any notes to share about this coffee?", "How did you brew this coffee?"). The anonymous three-rating limit is stated up front, and the limit dialog is "Sign in to keep rating" with the reason given.
- **Search** (24 §6, 25 §2): the header placeholder is "Search coffees, roasters, origins…" and the directory one is "Search coffees by name, roaster or note".
- **Filters** (25 §2): "Filters (3)" opens a sheet with "Show 86 coffees" and "Clear all".
- **Account menu** (24 §6, 25 B24): Profile, Settings, Sign out. Profile's children stay OPEN, and Wishlist, My ratings and Developer are not top-level items. The dashboard is labelled Settings.
- **Neutrality** (07, 17): the sample roaster is fictional, no real roaster is spotlighted, and nothing implies rank. The invented "follow roaster" control, the "ships pan-India" claim and the 20-character review minimum were removed.
- **Flat surfaces** (22 rule 2): cards and forms carry no gradient or motif; grain sits on the page ground only.

**New finding:** at 375px, "Buy from [roaster] ↗" in the sticky bar truncates once a roaster name is about 12 characters or longer. It needs a rule before CoffeeCard and coffee-detail work: for example, "Buy ↗" with the roaster named on the price line, or a two-line bar.

### Token bridge decisions (PROPOSED — need owner approval)

| shadcn var | Light | Dark | Note |
|---|---|---|---|
| `--background` / `--card` / `--popover` | ground / surface / surface | same roles | locked |
| `--primary` / `--primary-foreground` | `#3B2416` / `#FBF6EC` | `#EBDCC6` / `#1E1510` | locked; 13.4:1 |
| `--accent` | copper `#9C4526` | `#E28D66` | In this codebase `--accent` is the **brand accent** (420× `text-accent`), so it stays copper. As a result, ghost/outline hover and menu focus fill with copper. Separating a neutral hover wash is a step-2 decision. |
| `--border` | rule `#D6C9B6` | `#43342A` | dividers and card edges only (decorative, 1.4:1) |
| `--input` | rule+muted mix → `#8F8172` (3.3:1) | → `#756558` (3.2:1) | **New derived value.** The locked rule at 1.4:1 fails WCAG 1.4.11 for form-control edges. |
| `--ring` | accent | accent | **PROPOSED** (focus token is OPEN in 07): the focus border is solid accent (5.6:1 light, 7.0:1 dark) |
| `--rating` | star `#93701F` (4.0:1) | `#D9A84A` (8.3:1) | locked |

### Findings and second-pass work (2026-11-12)

- **Applied:** Default SelectTrigger height 36 → 40px and small 32 → 36px; same default vertical alignment as Input. TabsList height 36 → 40px. Dialog border radius 40px → shared `rounded-xl` and stronger semantic border. Dialog/Sheet overlays and content gain reduced-motion safeguards, and close buttons receive consistent keyboard focus styling.
- **Applied:** DropdownMenu/Select focused items use neutral `bg-muted` and normal foreground instead of filling every row with copper `--accent`. Badge transitions respect reduced-motion preferences. These are updates to shadcn primitives directly, not wrappers or duplicate CSS.
- **To verify:** Existing menus/Selects and sheets across both themes, keyboard operation, close controls, portal overlays, forms with explicit small heights and nested dialogs. Actual runtime tests were not run for this newest pass.

### Previously identified issues

- **Destructive** (an existing production token) is 3.48:1 white-on-red in light mode, below AA for 14px button text. It needs a deeper red or a dark-text treatment.
- **SelectTrigger** was 36px next to 40px Inputs; the default is now aligned to 40px, pending live form verification.
- **TabsList** was 36px; now 40px, pending navigation/tab regression checks.
- **Dialog** previously used a 40px radius; now uses the shared `rounded-xl`. Its centred mobile header remains; compare against the locked ~14px radius and real modal designs during visual QA.

## Acceptance checklist

- [x] Run type-check, lint (zero warnings) and tests (90/90) on the branch checkout — 2026-11-12
- [x] Render Button variants, disabled/loading and keyboard focus — playground
- [x] Verify Input and Textarea touch sizing, invalid states and form layouts — playground
- [ ] Verify Card layouts don't regress in **live** coffee, roaster, editorial and settings pages (the playground covers generic compositions only)
- [x] Verify dark and light contrast, keyboard and reduced-motion behaviour for the four primitives — playground; destructive contrast flagged
- [x] **Owner review** of the playground and the PROPOSED bridge values (`--input`, `--accent` hover) — approved 2026-11-13 with the Compact scale, pill buttons, rebuilt CoffeeCard and review-pass changes
- [x] Flip the `Icon` default to `regular` after approval — done 2026-11-13
- [ ] Deep Roast token and Gambetta/Ranade integration into `globals.css` and the root layout (rollout gate, step 6)

## Latest pass verification gate (2026-11-12)

- [x] Type-check, lint and tests **after** the second primitive edits and playground addition — pass, 2026-11-13 (90/90)
- [x] Render `/design/components` at 375px and 1280px, light and dark; open Select, Dialog, Sheet and Dropdown — rendered at both widths in light and at 1280px in dark; Dialog, Sheet and Dropdown opened; Select not opened
- [x] Confirm real CoffeeCard demo renders from a **null coffee ID** without remote mutations, and default/rated/unrated/similar states remain legible — renders; default, rated, your-rating, unrated, similar and compact legible
- [ ] Keyboard navigation through menu, select, dialog focus trap and rating footer; reduced-motion screenshots
- [ ] Regression review on live filter sheets, account dropdown, auth and review dialogs before rollout

**Boundary:** No global palette/font migration, navigation rebuild, production routes, dataset or actual rating submissions were modified by this pass.

## CoffeeCard rebuilt to the approved look (2026-11-13, in review)

Owner instruction: rebuild the production `CoffeeCard` to the card approved in the HTML playground. API unchanged: same props and the four variants.

| | Before | Now |
|---|---|---|
| Packaging | Image cropped to fill, dark gradient over its lower half, zoom on hover | Fixed paper tile (`#F6EFE3`) with the pressed frame and soft shadow; image `cover` with an 8px inset, multiplied into the paper; no gradient, no zoom (sanctioned exception in [22](22-visual-system.md) rule 1) |
| Name and roaster | White text on the gradient | Below the tile; name in the heading face, underline on hover |
| Flavour notes | Chips | One italic line |
| Roast and process | Bean scale and labelled block | One muted line, e.g. "Light roast · Washed" |
| Rating evidence | Footer count | "★ 4.5 · 6 ratings" with price on the same line |
| Rating action | Footer: stars over "Tried this? Rate it." | In-place row: interactive stars and "Rate it" / "Your rating: 4" |
| Container | Bordered card around everything | None; only the packaging tile is framed |

Decisions taken as defaults (owner has not ruled on them): the wishlist heart stays at the top right of the tile; rating stays in place on the card; roast and process stay, as one line.

`CardRatingFooter`: new `flush` prop for cards without an outer container; the rated prompt is shortened to "Rate it" for every caller (including `RoasterCard`) because the longer text wrapped beside the count in Ranade; the count no longer wraps.

Checked: type-check, lint and 90 tests pass; playground at 1280px in light and dark; `/coffees?sort=rating_desc` at 1280px and 375px with no overflow or console errors. Not checked: homepage rails, roaster page grid, blog coffee blocks and the curator card by eye; `CoffeeCardSkeleton` still mirrors the old layout.

**Update 2026-11-13 (owner feedback):** card text hierarchy strengthened — notes at body size in the display italic, roast and process as a small label, price figure in ink. Focus ring on Input, Textarea and Select softened from 3px at 50% to 2px at 25%; buttons keep the stronger ring.

## Controls, type and colour pass (2026-11-13)

Owner go-ahead to close the gaps between the React components and the approved HTML playground.

| Area | Before | Now |
|---|---|---|
| Button shape | 8px corners | Pill |
| Button sizes (sm / default / lg) | 36 / 40 / 44px, 14px text | 36 / 44 / 48px; 15px text at default, 16px at lg (first tried 40 / 48 / 52, judged too big by the owner) |
| Icon buttons | 36 / 40 / 44px | 36 / 44 / 48px |
| Input, Select | 40px, 8px corners | 44px, 10px corners; search fields are pills by `className` |
| Textarea | 8px corners | 10px corners |
| `text-title` | 24 / 30px, weight 500 | Intermediate: 24 / 30 / 36px, weight 400; **superseded by approved 24 / 30 / 32px** |
| `text-heading` | weight 500 | weight 400 |
| Eyebrow | none | `text-eyebrow`: 12px uppercase, 0.14em tracking; `Section`'s eyebrow uses it |
| Light ground / surface | `#F6EFE3` / `#FBF6EC` | `#FBF6EC` / `#F6EFE3` |

- The playground gained a **Surfaces & motif** section that loads `system/icb-system.css` unchanged: Light + Contour and the three feature surfaces.
- Callers that pass their own `h-*` still override button, input and select heights.
- Checked: type-check, lint (where configured) and 90 tests pass. Seven real pages at 1280px and 375px have no horizontal overflow or error overlay; pages grew by 16–262px from taller controls and larger section titles. By eye: coffee detail and directory at desktop only.
- Not checked: dense UIs that use default-size buttons (dashboard, tools, filters sheet, auth), dark theme on real pages, and mobile by eye. The colour flip is in the design tokens and playground only; production `globals.css` is unchanged.
- Still not brought across from the HTML playground: alternating tinted sections, filter chips, and the homepage mosaic and hero compositions.

## Component scale comparison — CURRENT / COMPACT (2026-11-13)

**Completed historical experiment (before Compact was approved).** The `/design/components` playground temporarily had a Current / Compact toggle in its header. It uses the genuine shadcn Button/Input/Select and CoffeeCard components under the existing Deep Roast token bridge; `deep-roast.css` applies the compact changes **only when** `[data-icb-playground][data-ui-scale="compact"]` is present. Current mode leaves their committed classes unchanged. Dialog/Sheet buttons rendered through Radix portals are also scoped. No shared shadcn, production route, global token or typography source changes were made for this comparison.

| Element | Existing `main` source | Current redesign | Compact preview |
|---|---:|---:|---:|
| Button sm / default / lg | 32 / 36 / 40px | 36 / 44 / 48px | 36 / 40 / 44px |
| Button default and large text | 14 / 14px | 15 / 16px | 14 / 14px |
| Icon button default / large | 36 / 40px | 44 / 48px | 40 / 44px |
| Input / Select default | 36px | 44px | 40px |
| Section H2 desktop | 30px | 36px | 32px |
| CoffeeCard italic notes | earlier metadata treatment | 16px | 14px |

**Unchanged in compact preview:** body prose, editorial display/hero typography, colours, grain/motifs, section spacing, fonts, small button and field text on mobile (16px prevents iOS input zoom), component APIs, variant behaviours and caller-defined height overrides. Test real interactive controls at 375px and 1280px in light/dark; compare the live site in a separate tab at the same viewport and 100% zoom. A 36–40px visible control is not by itself a 44px mobile touch target; verify actual hit areas before rollout.

**Preview safety correction:** `REAL_COFFEES` retains actual coffee names/images and representative price/rating values, but all `coffee_id` values have been set to `null` in the playground. Consequently neither the wishlist action nor the rating submission can target a real coffee from this isolated page. The wishlist control is absent when there is no ID; final fidelity must be validated on a separate sandbox or with non-mutating previews. The previously committed text implying that this route can write live ratings is no longer true.

**Review gate completed:** Owner chose Compact on 2026-11-13; the selected dimensions have been migrated into the shadcn source and the toggle removed.

## Compact scale adopted (2026-11-13)

Owner chose Compact after the Current / Compact comparison, with two exceptions. It now lives in the shared source; the playground toggle and its scoped CSS are removed.

| Element | Adopted |
|---|---|
| Button sm / default / lg | 32 / 40 / 48px, pill; 14px labels, 16px on lg |
| Icon button sm / default / lg | 32 / 40 / 48px |
| Input, Select | 40px, 10px corners |
| `text-title` desktop | 32px, weight 400 |
| CoffeeCard flavour notes | **16px italic kept** (exception: 14px Gambetta italic was too thin and flattened the card hierarchy) |

**Rule: primary actions on mobile use `size="lg"` (48px)** — Buy, Rate, form submit. Default (40px) is for secondary and desktop actions. Small (32px) is for compact inline actions.

Fixed in the same pass: the CoffeeCard rating-and-price line now wraps instead of overflowing into the next card in two-column mobile grids.

## Review pass (2026-11-13, owner-approved items 1–6)

- **CoffeeCard rating row merged.** One row instead of two: interactive stars with "4.5 (6)" beside them, and the prompt ("Rate it" / "Yours: 4") at the right. Price moved up beside roast and process. `CardRatingFooter` gained an `inline` variant for this; `full` (RoasterCard) and `minimal` (similar cards) are unchanged.
- **Touch target.** The rating row and its prompt are 44px tall. Individual stars are still narrow; the prompt is the reliable target on mobile.
- **Eyebrows rationed.** `text-eyebrow` is for feature moments only, not every section (PRODUCT.md anti-reference). Playground row labels went back to plain captions.
- **Destructive colour (PROPOSED, token bridge only):** brick `#A32B2B` in light, `#D2584F` in dark, replacing the coral.
- **Packaging tile in dark:** stays paper, one step dimmer (`#E2D4BE`). A dark tile was rejected because white pack backgrounds are multiplied into the tile, so a dark tile would turn every pack muddy.
- **`CoffeeCardSkeleton`** now mirrors the rebuilt card.
- Checked: type-check, lint, 90 tests; playground cards at 1280px in light and dark; live directory (top-rated) at 1280px. In two-column mobile grids the rating row wraps to two lines (measured, not viewed).
- Deferred by the owner: updating `PRODUCT.md` / `DESIGN.md` until everything is final.

## Gate status (2026-11-13)

**Phase C steps 1, 2 and 4 are closed** on the design branch: base controls, the audited second pass, and the CoffeeCard contract. Owner approved moving on.

Still open before any rollout, carried forward rather than blocking the next step:

- Card layouts on live coffee, roaster, editorial and settings pages viewed in full (only the directory and coffee detail tops were viewed).
- Keyboard pass through menu, select, dialog focus trap and the rating row; reduced-motion screenshots.
- Regression review of live filter sheets, account dropdown, auth and review dialogs.
- `RoasterCard` still has the old bordered card and the `full` rating footer; it has not been rebuilt to match CoffeeCard.
- Deep Roast tokens and Gambetta/Ranade into `globals.css` and the root layout (step 6).

**Next: Phase C step 3 — navigation and search contracts.** Needs one owner decision first: which destinations sit under the member **Profile ▸** submenu ([24](24-information-architecture.md)).

## Geist typography reference — chosen 2026-11-14

**CONFIRMED reference, PROPOSED application.** The owner selected [Vercel Geist Typography](https://vercel.com/geist/typography) as a **sample of information hierarchy, control density and typesetting discipline**, not a font or colour replacement. Keep Gambetta for editorial headings and coffee names, Ranade for UI and reading, and Deep Roast. Do not import Geist fonts, switch to Vercel's palette, or copy the layout wholesale.

**Evidence from the reference:** Geist bundles **font-size, line-height, letter-spacing and weight** into role-based text styles. Headings introduce a section; **Button 14** is the default and Button 16 the largest, **Label 14** is frequently used in menus and Label 13 for secondary/tabular data, while Label 12 is tertiary/caps; **Copy 14** is used most commonly, Copy 16 in less dense views and Copy 13 where space is constrained. These are the reference site's own use cases, not binding ICB tokens.

### Proposed ICB role map (not yet approved for production)

| ICB role | Proposed desktop size | Face / notes |
|---|---:|---|
| Feature / editorial hero | 48–64px | Gambetta 400; only narrative arrival/feature moments |
| Main page heading | 36–40px | Gambetta 400; responsive smaller on mobile |
| Standard section heading | 28–32px | Gambetta 400; not 36px on every section |
| CoffeeCard name | 18–20px | Gambetta 400; maintain two-line truncation rule |
| Long-form/article prose | 16px | Ranade 400; generous multiline line height; preserve readability |
| Standard functional UI / helper copy | 14px | Ranade; compact but legible |
| Button, filter, tabs, menus | 14px | Ranade 500; distinguish size of control from size of text |
| Ratings, prices, secondary metadata | 13–14px | Ranade; tabular numerals for price/count comparison |
| Tertiary / eyebrow | 12px | Ranade uppercase with restrained tracking; not for paragraphs |

**Keep the confirmed spacing scale** (4/8/12/16/24/32/48/64/96px). The supplied Geist typography page does not specify a universal spacing scale; do not attribute one to it. Review line-height/letter-spacing alongside size, and **avoid scaling every text role proportionally**. Preserve visible small controls versus adequate mobile touch targets; don't assume that a 36px-high button automatically provides a 44px hit target.

### Review protocol

1. Control sizes are already Compact in the shared source (section above); the Current / Compact toggle is gone. Compare type roles at the same viewport and 100% zoom, keeping button shapes and colours constant.
2. Add a typography **role specimen** for actual ICB surfaces: page title, section header, coffee name, body/article prose, buttons, UI label, rating and prices; specify responsive sizes, line-height, tracking, weights and tabular-number treatment.
3. Compare on a real directory and coffee detail page at 375px / 1280px, both themes, with long names and price/rating evidence. Do not let serif editorial headlines dictate button or form-label sizes.
4. Choose roles and sizes by owner review; only then change `src/app/styles/typography.css` and shadcn source for those roles. No global type-scale migration is authorized by this note.

### Geist type roles: targeted reconciliation (2026-11-14)

Read against [Geist Typography](https://vercel.com/geist/typography), specifically its division between **one-line Label**, **multiline Copy**, **Button** and **Heading** roles. This is a reference for disciplined combinations of size, line height, weight and letter spacing, not a mandate to import Geist fonts or spacing.

**Changes made on the redesign branch:**

- `src/app/styles/typography.css` now defines `text-ui-label` (**14px/20px**, Ranade 500, one line), `text-copy-compact` (**14px/22px**, Ranade 400, multiline) and `text-ui-meta` (**13px/18px**, Ranade 400 with tabular numerals for secondary figures).
- The actual React playground's **Type & tokens** section shows specimens of those three roles. Its stale descriptions of 44px directory search controls and 44px Input/Select were corrected to **40px**. Former H2/H4 naming in the typography specimen was made consistent with the approved type roles.
- Numeric evidence in `CoffeeCard` prices and `CardRatingFooter` rating/count lines uses tabular numerals, **without changing the approved font sizes, action targets, field heights, or the 16px Gambetta italic flavour notes**.
- [07-decisions.md](07-decisions.md) now matches the approved **32px desktop section heading**, not the superseded 36px intermediate pass, and specifies that uppercase eyebrows belong to selective feature moments.

**Intentionally unchanged:** the global `text-caption`, `text-label`, `text-overline`, body-copy and page-heading utilities. Changing those globally would touch existing information-heavy pages before full visual QA. The approved Compact controls are still **36/40/44px**, main mobile actions 44px. Geist's Copy 14 being its most common style does **not** mean ICB article paragraphs or editorial introductions must all become 14px; longer reading passages remain 16px unless individually tested.

**QA gate:** Render the type-role specimen at 375px and 1280px, light/dark. Verify button-label baseline, caption readability and rating/price alignment in two-column CoffeeCard grids. This was a code/documentation reconciliation, not an independently completed visual/browser pass.

## Shadcn baseline restored & card type roles — 2026-11-14

**Newest owner decision supersedes Compact.** Do not use earlier tables in this document as the current size contract. Verified against the existing `main` branch's shadcn source before updating:

| Primitive | Current approved baseline | What remains from Deep Roast |
|---|---|---|
| Button sm / default / lg | **32 / 36 / 40px**, 14px labels | Pill corners, colour, focus and reduced-motion behavior |
| Icon button sm / default / lg | **32 / 36 / 40px** | Same visual treatment |
| Input | **36px** | Solid background, field border/focus, 16px text on mobile |
| SelectTrigger default / sm | **36 / 32px** | Modest radius, neutral row focus and softer focus ring |
| TabsList | **36px** | Accessibility and reduced-motion treatment |
| Textarea minimum | **64px** | The field remains resizable and can be made larger per composition |

`src/components/ui/card.tsx` already retains the main shadcn structure and padding (`gap-6`, `py-6`, `px-6`); it was **not resized**. More prominent or tap-friendly CTAs should be configured where needed (e.g. `min-h-11` for Buy/Rate in the mobile sticky bar preview), not by inflating every Button globally. Audit actual mobile CTA hit areas before rollout.

**Domain card hierarchy now follows the Geist-inspired roles** rather than scaling everything up:

- **CoffeeCard:** Gambetta entity name remains 18–20px; the 16px italic flavour note is an approved intentional distinction; roaster byline is 13px secondary metadata; specs remain compact; prices retain their approved visible size and tabular figures; ratings preserve their interactive contract.
- **RoasterCard:** entity heading stays 18–20px; location and coffee counts are demoted from 16px paragraph copy to 13px secondary metadata. Roaster Card is still structurally an older bordered component, so a full visual treatment remains a separate owner-review item.
- **RegionCard:** heading unchanged; elevations use tabular 13px metadata; short profile descriptions use 14px/22px multi-line supporting copy.
- **CollectionCard:** headline and image treatment unchanged; tagline uses 14px/22px supporting copy; Explore is a 14px UI label, and coffee counts use tabular 13px metadata.
- **Playground:** restores baseline size labels, fixed 36px field/tab descriptions and a 64px textarea minimum; its generic card examples now use explicit title / secondary copy / numerical evidence roles rather than assigning large editorial headings to forms.

**Grid contract remains fixed as a design-system decision, not a fixed number of columns.** `PageShell` owns 16px mobile / 24px tablet / 32px desktop horizontal gutters and defaults to 1280px maximum width. `Section`, `Band`, `Stack` and `Cluster` still govern layout rhythm and full-bleed composition; individual responsive grids retain their page-specific column rules (coffee directory is two columns on mobile). The component scale changes above do not alter responsive grid definitions or the approved 4/8/12/16/24/32/48/64/96px spacing scale.

**QA pending:** independent build/browser verification at 375px and 1280px in both themes, full card text wraps/overflow, selected/disabled/focus states, and explicit 44px mobile primary hit areas. These are code updates, not a claim that all visual QA is complete.


## Current vs Minimal CoffeeCard experiment (2026-11-14)

The Next.js playground at `/design/components#coffee-cards` now displays two full grids backed by the **same four real coffees** already present in its `REAL_COFFEES` fixtures. The coffee names, ImageKit packaging paths, real destination slugs, and representative price/rating values are unchanged from the existing playground.

- **Current:** imports `src/components/cards/CoffeeCard.tsx`, unchanged.
- **Minimal (proposal):** uses `src/app/design/components/minimal-coffee-card.tsx` and the same `CoffeeSummary` type/formatters; square `object-contain` packaging frame, no roast/process row, one-line flavour notes without a `+N` indicator, price plus community rating on a single wrapping row, quiet Rate label.
- **Safety:** All fixture `coffee_id` values remain null; no rating or wishlist writes are possible. The Minimal Rate label is a *visual placeholder*, not a working control. Coffee title/image links still point to real product pages and will navigate if clicked.
- **Scope:** a review-only alternative, not a second production card implementation. No global tokens, production CoffeeCard, CardRatingFooter, grid rules or existing route were changed.
- **QA pending:** browser compare at 375px and 1280px in light/dark, assess real product packshots with `object-contain`, visual height and two-line title cases. No build or browser test was executed in this commit.

## RoasterCard rebuilt (2026-11-14)

`RoasterCard` default and similar variants now follow CoffeeCard: `<article>` with no outer card, framed tile, name, one `text-ui-meta` line, `CardRatingFooter variant="inline"`. The frame classes are shared in `src/components/cards/tile.ts` (`TILE_FRAME`); CoffeeCard adds the paper background, `RoasterLogo` adds the contrast plate. Logos are `object-contain` at 60% × 50% of the tile, with no blend. `RoasterCardSkeleton` mirrors it. Compact row unchanged. This supersedes the "RoasterCard still has the old bordered card" notes above.

Checked: type-check passes; `/roasters` viewed at 1280px and 375px in light theme, no overflow. Not checked: dark theme, the similar variant on a roaster page, keyboard. Known: on dark plates the frame's cream inner highlight reads as a grey rim.

The component review calls for scale, overlays, card variants, states, remaining primitives, colour and icons are in [07](07-decisions.md) as one PROPOSED row.

## CoffeeCard made smaller (2026-11-14)

Applied to the production `CoffeeCard` (hero, default, similar) and its skeleton: square tile, `object-contain mix-blend-multiply`; name `line-clamp-1` with `title`; `formatFlavorLabels(keys, 2)` plus "+N", one line; `RoastBeans` (1–5 Phosphor beans, filled vs 30% outline, `role="img"` with "Roast: …" label) replaces the roast word in the specs line, process text beside it. The compact thumbnail keeps `cover`.

Checked: type-check and lint pass; playground at 1280px light and live `/coffees?sort=rating_desc` at 375px viewed, no overflow. Card height in the playground row dropped from about 540px to about 430px. Not checked: dark theme, hero and similar variants, keyboard. Known: Blue Tokai style shots with coloured backdrops show as a rectangle inside the tile; long names lose their distinguishing suffix ("Kerehaklu Estate - Blossom…").

## Minimal experiment closed (2026-11-14)

Owner chose the smaller production card above. The Minimal preview (`minimal-coffee-card.tsx`) and the Current vs Minimal comparison were removed from the playground; the "Current vs Minimal CoffeeCard experiment" section above is history. Name stays one line so cards in a row keep equal height.

## Backlog (not blocking the next step)

- **CoffeeCard image load failure.** `coffeeImagePresets` already falls back to `/images/placeholder-coffee.avif` when a coffee has no image path. A path that exists but fails to load (deleted or broken ImageKit file) still shows an empty tile, because the card is server-rendered with no `onError`. Fix: a small client image wrapper like `RoasterLogo`. Frequency in the catalogue not measured. Added 2026-11-14.
