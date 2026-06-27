---
name: Indian Coffee Beans (ICB)
description: An editorial field guide to Indian specialty coffee — warm, confident, magazine-grade.
colors:
  primary: "oklch(0.52 0.120 60.55)"
  primary-foreground: "oklch(0.965 0.012 65.81)"
  accent: "oklch(0.722 0.139 40.48)"
  accent-foreground: "oklch(0.214 0.007 41.10)"
  background: "oklch(0.982 0.009 79.92)"
  foreground: "oklch(0.222 0.030 54.20)"
  card: "oklch(0.965 0.015 79.92)"
  popover: "oklch(0.990 0.005 79.92)"
  secondary: "oklch(0.901 0.050 84.54)"
  muted: "oklch(0.901 0.050 84.54)"
  muted-foreground: "oklch(0.480 0.040 80.00)"
  border: "oklch(0.870 0.020 80.00)"
  ring: "oklch(0.628 0.080 60.55)"
  destructive: "oklch(0.653 0.177 28.10)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: Indian Coffee Beans (ICB)

## 1. Overview

**Creative North Star: "The Coffee Field Guide"**

ICB looks and reads like a printed specialist's field guide to Indian specialty coffee: warm paper
under the words, expert annotations in the margins, knowledge made beautiful and browsable. The
ground is cream, the ink is dark roasted-bean brown, and the one moment of color is a terracotta
brush-smear — a real brush stroke, the hand of the maker — that underlines a single phrase per
spread. Fraunces (a soft, opsz-aware serif) carries every heading; DM Sans does the calm, legible
reading work. Depth comes from tonal paper layers, not from glass or drop shadows. The result is
quiet authority: the page never shouts, because a good guide doesn't need to.

The personality is **refined, confident, and editorial**, with a **tactile, warm** hand — the
texture of paper and the wet edge of a brush, not the gloss of a SaaS dashboard. It serves the
newcomer and the enthusiast in the same surface: the directory stays welcoming while the learn
layer and glossary carry the depth. Discovery and education are co-equal here; both are designed to
the same magazine standard.

This system **explicitly rejects**: generic SaaS/startup marketing (hero-metric blocks, identical
icon-heading-text card grids, gradient accents, an eyebrow above every section); the
hipster/third-wave coffee cliché (kraft paper, chalkboard, faux-rustic stamps, gatekeeping "coffee
snob" tone); the cold marketplace/Amazon feel (dense price-first product grids with no point of
view); and corporate/sterile enterprise UI (flat gray, soulless, warmth-free).

**Key Characteristics:**

- Cream paper ground, roasted-bean ink, a single terracotta accent.
- Fraunces serif headings + DM Sans body — contrast pairing, never two similar sans.
- Depth via tonal surfaces (`surface-0/1/2`), not blur or heavy shadow.
- One signature: the `<Accent>` coffee brush-smear, rationed to one phrase per page.
- Coffee-tinted shadows, fine film-grain texture, full light/dark parity.
- Editorial rhythm enforced structurally through layout primitives, not by reflex.

## 2. Colors

A warm, single-accent palette: cream and wheat neutrals, a roasted-coffee primary, and a terracotta
accent used sparingly. All tokens are authored in OKLCH (the project's canonical color format) and
are contrast-tuned for WCAG AA in both themes.

### Primary

- **Roasted Bean** (`oklch(0.52 0.120 60.55)`): The core coffee brown. Primary buttons, active
  states, links, and the brand's structural voice. Darkened from its original lightness specifically
  to clear AA contrast against its cream foreground. Its calmer, lower-chroma sibling
  (`ring` `oklch(0.628 0.08 60.55)`) carries focus rings so focus reads as a relative of primary,
  not a louder competitor.

### Secondary

- **Pale Wheat** (`oklch(0.901 0.05 84.54)`): Doubles as `secondary` and `muted`. Quiet fills,
  secondary buttons, badge backgrounds, and resting chips. Never carries body text on its own.

### Tertiary

- **Terracotta** (`oklch(0.722 0.139 40.48)`, accent): The single warm spark. Reserved for the
  `<Accent>` brush-smear, the glossary-term underline, hover affordances, and scrollbar-hover. This
  is the rarest color on the page and that rarity is the point.

### Neutral

- **Cream Paper** (`oklch(0.982 0.009 79.92)`, background): The body ground. The whole system sits
  on this warm near-white. (Dark: `oklch(0.195 0.01 59.58)`, a deep warm brown-black.)
- **Warm Paper** (`oklch(0.965 0.015 79.92)`, card): Slightly darker and warmer than the ground for
  "magazine" surface separation — `surface-1`.
- **Lifted Paper** (`oklch(0.99 0.005 79.92)`, popover): Lighter than card, the most-elevated tonal
  step — `surface-2`.
- **Espresso Ink** (`oklch(0.222 0.03 54.20)`, foreground): Primary text. Dark roasted brown, not
  pure black.
- **Muted Ink** (`oklch(0.48 0.04 80)`, muted-foreground): Secondary text and captions. Deliberately
  darkened from a lighter draft to hold AA against cream and card — do not lighten it back.
- **Paper Edge** (`oklch(0.87 0.02 80)`, border/input): Neutral hairline dividers and field strokes.
- **Alert Red** (`oklch(0.653 0.177 28.10)`, destructive): Errors and destructive actions only.

### Named Rules

**The One Smear Rule.** Terracotta is the only accent and it appears on roughly one phrase per page —
through the `<Accent>` brush-smear or a glossary underline. If a second thing on the screen is
fighting for the accent, one of them is wrong.

**The Ink-Never-Black Rule.** Text is roasted-brown ink (`foreground`), never `#000`. The warmth of
the paper system breaks the moment a pure-black glyph lands on it.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** A deliberate contrast pairing — Fraunces is a warm, high-contrast optical serif with
editorial softness; DM Sans is a clean, geometric-humanist workhorse that disappears into reading.
Serif display + sans body, never two similar families. (Note: the taste reflex flags Fraunces as a
banned default serif; we keep it deliberately as the established brand face — this is preserve mode.)

### Hierarchy

- **Display / Hero** (Fraunces, 400, `clamp(2.25rem → 3.75rem)`, line-height 1.1, tracking -0.02em):
  Page heroes and top-level page headers (`.text-hero`, `.text-display`). Quiet authority — editorial
  size at _normal_ weight, not bold.
- **Title** (Fraunces, 500, `1.5rem → 1.875rem`, tracking -0.02em): Section headers, h2
  (`.text-title`).
- **Heading** (Fraunces, 500, `1.125rem → 1.25rem`): Card headers and subsections, h3
  (`.text-heading`). Held one clear step below Title — never use both for the same level.
- **Body** (DM Sans, 400, `1rem`, line-height 1.625): All reading text (`.text-body`). Cap measure at
  65–75ch in prose. Muted body keeps normal weight to avoid the unreadable light-gray-thin trifecta.
- **Label** (DM Sans, 500, `0.75rem`, tracking 0.02em, **capitalize**): Metadata and tags
  (`.text-label`, `.text-overline`). Capitalized print-UI feel by default.
- **Eyebrow** (DM Sans, 600, `uppercase`, tracking 0.18em, `text-accent`): The section kicker, owned
  by the `Section` primitive header. The style is permitted; what's controlled is **frequency** —
  rationed to ≤1 per 3 sections by routing all headers through `Section`, not an eyebrow on every
  section.

### Named Rules

**The Hero-Is-Not-Bold Rule.** The largest type on the page is Fraunces at weight 400. Size and the
serif carry the authority; bold display weight reads as shouting and is forbidden on heroes.

**The h2 ≠ h3 Rule.** `.text-title` and `.text-heading` must never style the same heading level. The
visible step between them is the document's spine; collapsing it breaks the hierarchy.

## 4. Elevation

Depth is conveyed through **tonal paper layering, not shadow** — "depth via surfaces, not blur." The
system has three semantic surface steps (`surface-0/1/2`): the cream ground, the warm-paper card,
and the lifted-paper popover/modal, each a step warmer/lighter than the last, separated by a
`border/60` hairline. Surfaces are flat at rest. The coffee-tinted shadow ramp exists and is real,
but its job is **response to state** (hover lift, focus, the elevated toast/modal), not ambient
decoration on every card.

### Shadow Vocabulary

Shadows are tinted by `color-mix` toward the accent/foreground so they read as warm coffee shadow,
never neutral gray. Use the lightest step that reads.

- **`--shadow-sm`** (`0 1px 3px` tinted, ~8% alpha): subtle resting lift on a few key surfaces.
- **`--shadow-md` / `--shadow-lg`** (`0 4px 6px` / `0 10px 15px` tinted, ~10%): hover and elevation.
- **`--shadow-xl` / `--shadow-2xl`** (tinted, deeper): modals, toasts, popovers (`surface-2`).
- **`--shadow-focus-visible`** (`0 0 0 3px` of darker tint): the focus ring treatment.

### Named Rules

**The Flat-Paper Rule.** Cards are flat at rest, separated by tonal surface steps and a hairline
border. A resting drop shadow on a card is a regression toward app-chrome — reach for `surface-1`
first, and let shadow appear only on hover/elevation.

**The Warm-Shadow Rule.** Shadows are coffee-tinted via `color-mix` toward accent/foreground. A
neutral-gray shadow on this cream system looks like 2014 and is prohibited.

## 5. Components

**The primitive layer.** Layout and rhythm are owned by a set of Layer-2 primitives; sections compose
them rather than inlining spacing or headers. This is the structural discipline that keeps the AI
tells out:

- **`PageShell`** — the _only_ horizontal padding scale (`px-4 md:px-6 lg:px-8`), max-width `7xl` by
  default. One per page. Never hand-roll a container.
- **`Section`** — vertical rhythm + optional header (`eyebrow` / `title` / `accentWord` / `align`).
  Spacing scale: `tight` (`py-6/10/14`), `default` (`py-10/14/20`), `loose` (`py-14/20/28`).
- **`Stack`** (vertical) and **`Cluster`** (horizontal, wrapping — for tags/chips/buttons) carry a
  shared gap scale (`gap-1`…`gap-16`, i.e. 4px→64px).
- **`Rule`** — hairline `border-border/60` divider with `tight/default/loose` margins.
- **`Prose`** — long-form measure at `max-w-2xl` (~672px, within the 65–75ch target); blockquotes use
  a 2px left border + italic.
- **`Reveal`** — the canonical scroll-in motion: opacity + 24px rise, `ease-out-expo`
  `cubic-bezier(0.16, 1, 0.3, 1)`, 0.6s, fires once. Collapses to static instantly under
  `prefers-reduced-motion`. Animates only transform/opacity, never layout.

**Grid & images.** The canonical card grid is `.grid-cards` (`grid-cols-1 md:grid-cols-2
lg:grid-cols-3 gap-8`); adopt it instead of re-typing a three-column grid. Image reveals use
`.image-hover-zoom` (a subtle `scale-105` over 700ms ease-out), never a harder zoom.

### Buttons

- **Shape:** Gently curved (`rounded-md`, 8px). Default height 36px (`h-9`), padding `8px 16px`.
- **Primary:** Roasted-bean fill (`bg-primary`) with cream text (`primary-foreground`); hover dims to
  `primary/90`. The confident default.
- **Hover / Focus:** `transition-all`; focus shows a 3px tinted ring (`ring/50`) — never a bare
  outline. Keyboard focus is always visible.
- **Outline / Secondary / Ghost:** Outline is a bordered cream button that fills with `accent` on
  hover; secondary is pale-wheat; ghost is text-only that picks up an `accent` wash on hover.
- **On-media variants:** `onMedia` and `chip` use a dark scrim (`bg-black/25`, white text) for legible
  buttons over hero imagery and video — a scrim, not a blur.

### Chips / Badges

- **Style:** Fully rounded (`rounded-full`), `bg-muted` pale-wheat fill, `foreground` text, `0.75rem`
  medium (`.badge`). Quiet by default.
- **Outline variant:** `.badge-outline` — transparent with a single `accent` border, for emphasis
  without a fill.
- **State:** Filter chips over media use the dark-scrim `chip` button variant; selected/active states
  lean on `accent` rather than a new color.

### Cards / Containers

- **Corner Style:** `rounded-xl` (14px) for cards; `rounded-lg` (10px) for `.card-base`.
- **Background:** `bg-card` (warm paper, `surface-1`).
- **Shadow Strategy:** Flat at rest (see Elevation). `.card-hover` shifts the border tone on hover
  (`border/60 → border`) rather than dropping a shadow.
- **Border:** `border-border/60` hairline — the "paper edge."
- **Internal Padding:** The shadcn `Card` uses 24px (`py-6` / `px-6`). The shared `.card-padding`
  token is responsive **16px → 24px** (`p-4 md:p-6`) and is load-bearing across 26+ files — do not
  fork it; `.card-padding-compact` (12px → 16px) covers dense cases.
- **Depth steps:** Surfaces follow `surface-0` (ground) → `surface-1` (`.card-base`, the card) →
  `surface-2` (popover/modal). Use these for layering, not shadow.
- **Nesting:** Nested cards are forbidden. Use `surface` steps for inner depth.

### Region / Origin Cards

- **Style:** `.region-card` — a portrait image tile (`aspect-[5/6]`, `rounded-sm`, hairline border)
  with a _softened_ top gradient overlay (`.region-overlay`, `from-black/60`, deliberately "less
  Netflix poster") and white text bottom-left (`.region-content`). Used for origin/region landing
  entry points.

### Decoration — the `<Decor>` primitive (`texture` / `wash` / `stripe`)

The single owner of decorative texture, consolidating what used to be inlined across ~12 files. One
implementation each, passed as a prop — sections never hand-roll these:

- **`dots`** (`.decor-dots`): a 22px radial dot grid at 0.18 opacity (the settled size; kills the old
  24px-vs-32px drift).
- **`wash`** (`.decor-wash`): a single soft blurred bloom (`blur(80px)`) in accent or primary at
  ~80% transparency — the one sanctioned blur, as a background bloom only.
- **`stripe`** (`.decor-stripe`): the "magazine accent" — a full-width 6px gradient **rule along the
  top edge** (primary → accent → primary, 0.6 opacity). Reworked from a former left side-stripe; a
  colored side-border >1px is banned (see Don'ts). This is now the single canonical top-rule
  implementation; per-card category-coded variants (e.g. RelatedLinks) follow the same top placement.

### Inputs / Fields

- **Style:** `bg-background` with a `border` / `input` hairline stroke, `rounded-md` (8px),
  `8px 12px` padding.
- **Focus:** 3px tinted ring (the `--shadow-focus-visible` treatment) — a calm warm glow, not a hard
  blue browser outline. Placeholder text must hold ≥4.5:1, not the default light gray.
- **Error / Disabled:** `aria-invalid` shifts border and ring to `destructive`; disabled drops to 50%
  opacity with no pointer events.

### Navigation

- **Style:** DM Sans, `foreground` ink on cream; active uses `primary`, hover uses an `accent` wash.
  Resizable navbar primitive; sidebar uses its own neutral `sidebar-*` token family. Mobile collapses
  to a sheet. Focus states are always keyboard-visible.

### Signature Component — `<Accent>` (the coffee brush-smear)

The brand's one decorative signature. A real brush stroke (`/images/stain-smear.png`) used as a CSS
`mask-image` over `background: var(--accent)`, so it recolors per theme and stretches edge-to-edge to
fit any 1–3 word phrase. It sits low, underlining the bottom ~third of the glyphs. **LOCKED defaults:**
`--ints: 0.6` (opacity), `--cov: 0.6em` (height); dark mode drops opacity to `0.5`. Rationed to one
accented phrase per page (project override of the usual ≤1 eyebrow budget — the smear _is_ the brand
signature). It reads as one family with the `.glossary-term` dotted-accent underline; do not introduce
a third emphasis language.

## 6. Do's and Don'ts

### Do:

- **Do** keep cream paper as the ground, roasted-bean ink as the text, and terracotta as the only
  accent (`oklch(0.722 0.139 40.48)`).
- **Do** route every section header, padding, and decoration through the layout primitives (`Section`,
  `PageShell`, `Stack`, `Cluster`, `Rule`, `Prose`, `Decor`) — discipline is structural, not a written
  reminder.
- **Do** convey depth with tonal surface steps (`surface-0/1/2`) and hairline borders; let coffee-
  tinted shadows appear only on hover/elevation.
- **Do** use Fraunces at weight 400 for heroes — size and serif carry authority, not bold weight.
- **Do** hold the visible step between `.text-title` (h2) and `.text-heading` (h3); never skip heading
  levels.
- **Do** keep body text at AA contrast (≥4.5:1) on both cream and card, in light and dark, including
  placeholders. Walk every change in both themes.
- **Do** give every animation a `prefers-reduced-motion: reduce` fallback (the film grain and theme-
  toggle view transition already do).
- **Do** ration the `<Accent>` brush-smear to one phrase per page; keep it in family with
  `.glossary-term`.

### Don't:

- **Don't** ship generic SaaS/startup marketing patterns: no hero-metric template (big number + label
  - gradient), no endlessly repeated identical icon-heading-text card grids, no eyebrow above every
    section, no gradient accents.
- **Don't** drift toward the hipster/third-wave coffee cliché: no kraft-paper, chalkboard, or faux-
  rustic stamp aesthetic, and no gatekeeping "coffee snob" tone.
- **Don't** make it feel like a cold marketplace/Amazon: no dense, price-first product grids without an
  editorial point of view.
- **Don't** go corporate/sterile: no flat gray, soulless, warmth-free enterprise UI — warmth is
  non-negotiable, including on product surfaces.
- **Don't** put a resting drop shadow on a card; reach for `surface-1` and a border first.
- **Don't** use a neutral-gray shadow — shadows are coffee-tinted toward accent/foreground.
- **Don't** use pure black for text or `#fff` outside the on-media scrim variants.
- **Don't** introduce a second accent color, a second radius scale, or a second emphasis language
  beside the brush-smear and glossary underline. One accent, one radius, one theme per page.
- **Don't** use a colored left/right border >1px as a card, list-item, callout, or alert accent.
  Magazine accents live on the **top edge** (`<Decor stripe>` / `.decor-stripe`), never the side.
- **Don't** put an eyebrow on every section. The uppercase-tracked accent kicker is fine sparingly;
  scaffolding it onto every section (≤1 per 3 sections is the ceiling) is the AI tell. Pass `eyebrow`
  through `Section` only where it earns its place.
- **Don't** nest cards. Ever.
