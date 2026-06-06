# Sprint 0 — Design-System Primitives (Reconverge on the Layers)

**Goal:** The system you need mostly **already exists** — the problem is that section components
**escape** it. This sprint hardens the primitive layer and makes every section route through it
again. Fixing the system here means later sprints mostly *delete* code, not add it.

**Risk:** Medium (touches shared primitives used everywhere — needs careful regression check).

## The layering (what we're working with)

| Layer | Folder | Role |
|-------|--------|------|
| 1. shadcn/ui | `ui/` | Owned base components |
| 2. **Primitives** | `primitives/` | Layout + rhythm: `PageShell`, `Section`, `Stack`, `Cluster`, `Rule`, `Prose` |
| 3. Cards | `cards/` | Domain display units (`CoffeeCard`, `RoasterCard`, …) |
| 4. Section composables | `homepage/`, `roasters/`, `blog/`, … | Page sections |
| 5. Pages | `app/` | Compose sections |

**The redesign runs bottom-up: Layer 2 → 3 → 4 → 5.** Discipline is enforced *structurally* —
if a section can only get its header/spacing/texture from a primitive, the AI-tells can't reappear.

### The core finding

- `Section` (`primitives/section.tsx:50-55`) **already has** `eyebrow` + `title` + a spacing scale
  (`tight`/`default`/`loose`). Most `homepage/` sections **bypass it** and inline bespoke headers.
- `PageShell` comment literally says *"the ONLY horizontal padding scale for the entire site — DO
  NOT create custom padding elsewhere"* — and sections do anyway.
- So eyebrow saturation, the accent-word tic, and ad-hoc spacing are sections **escaping** the
  system, not a missing system. The job is **re-convergence**, not invention.

### CSS file inventory (`src/app/styles/`) — what already exists, so we extend not duplicate

| File | Already defines | Implication for this sprint |
|------|-----------------|-----------------------------|
| `typography.css` | `.text-hero/display/title/heading/...`, `.text-overline/label` | Fix h2/h3 step here (0.3) |
| `layout.css` | `.container-default` (**duplicates `PageShell`**), `.grid-cards` (3-col gap-8), `.card-padding`, `.image-hover-zoom` | Dedupe `.container-default` → `PageShell`; reuse `.grid-cards` as the grid token (0.4) |
| `components.css` | **`.surface-0/1/2`** depth system ("depth via surfaces, not blur"), `.card-base`, `.card-hover`, `.badge`, **`.glossary-term`** (dotted-accent underline — a stain precedent) | **Naming collision** — decoration helper must NOT be called `Surface` (0.5); align `<Accent>` with `.glossary-term` (0.2) |
| `effects.css` | animation utilities + keyframes (`marquee`, `float`, `fade-in-scale`) | New decoration utilities live here, beside these (0.5) |

## Tasks

### 0.1 Extend `Section` (do NOT create a competing `SectionHeader`)
- Enhance the existing `primitives/section.tsx` header block:
  - `eyebrow` stays optional and used **sparingly** (budget below), not on every section.
  - Add `accentWord` + `align` so the header is fully expressible through the primitive.
  - Replace the bare `text-label` eyebrow with the agreed treatment (see 0.2).
- **Eyebrow budget: max 1 per 3 sections** (hero counts as 1). Enforced by routing all headers
  through `Section` and only passing `eyebrow` where it earns its place.

### 0.2 Accent / emphasis treatment (open to redesign — coffee-themed OK)
- Today emphasis = `<span className="text-accent italic font-serif">Word</span>`, repeated 12+×.
  **Decision made:** a **coffee brush-smear accent** — a real brush stroke (cut from the supplied
  sampler `3387172_58098.svg`) sitting **low as an underline that covers the bottom ~third of the
  text**. Chosen over a ring because accents often span 2-3 words; the smear stretches, a ring can't.
  Live in `mockup-homepage.html` (lab shows subtle / default / bold + multi-word).
- **Asset & technique:** the stroke is a transparent **alpha-mask PNG** (`stain-smear.png`), applied
  via CSS `mask-image` with `background: var(--accent)` so it recolours per theme. Stretches
  edge-to-edge (`mask-size: 100% 100%`) to fit any phrase. Tunables: `--ints` (opacity, default .6),
  `--cov` (height, default .6em). Dark mode drops opacity to ~.5.
  - *Production note:* keep as a small optimised PNG mask, or trace the single stroke to an inline
    SVG path with `fill: currentColor`. Do **not** ship the 3.8MB source SVG.
- Owned as a single `<Accent>` primitive (Layer 2), rationed to **≤1 per page**.
- **Align with the existing `.glossary-term`** treatment in `components.css` (dotted-accent
  underline) so the two accent languages read as one family, not two competing systems.

### 0.3 Typography hierarchy fix (Layer 2 CSS)
- `src/app/styles/typography.css`: make `.text-heading` (h3) ~10-15% smaller than `.text-title`
  (h2). Document which class maps to which heading level — the contract Sprints 2-4 apply.

### 0.4 Spacing & grid scale — make the primitives the only source
- The scale already lives in `Section` (`py` tight/default/loose), `Stack` (`gap`), and
  `layout.css` (`.grid-cards`, `.card-padding`). This task is enforcement + a small dedupe:
  - **Remove `.container-default`, migrate to `PageShell`** — same padding scale, and `PageShell`
    is already canonical (133 uses / 33 files). Only **3 call sites** to migrate (see blast radius).
  - **Promote `.grid-cards`** as the canonical 3-col grid token (currently only 2 consumers) and
    adopt it where sections hand-roll 3-col grids. No removal.
  - Replace ad-hoc `gap-6/8/12` and custom `py-*` in sections with `Section`/`Stack`/`.grid-cards`.
- **Do NOT touch `.card-padding`** — load-bearing across 26 files; it's a real token, not a dupe.
- No new tokens unless a gap is genuinely missing from the existing scale.

#### Blast radius (traced)
| Class | Action | Call sites | Risk |
|-------|--------|-----------|------|
| `.container-default` | **remove** → `PageShell` | `Footer.tsx:39`; `CookieNotice.tsx:97,171` (keep its `px-6` via `<PageShell className="px-6">`) | Low |
| `.grid-cards` | **promote + adopt wider** | `FeaturedRoastersSection.tsx:80`; `glossary/page.tsx:76` | Low |
| `.card-padding` | **leave as-is** | 26 files (cards, tools, discovery) | — |
| `.image-hover-zoom`, `.flex-center` | leave (optional fold later) | 1 / 2 files | — |
| `max-w-7xl mx-auto px-4` raw dupes | none found outside `layout.css` | 0 | — |

### 0.5 New decoration primitive (Layer 2) — consolidate texture/wash/stripe
- **NOT named `Surface`** — `.surface-0/1/2` already exists in `components.css` as the semantic
  depth system. Use a distinct name (e.g. `<Decor>` / `Texture`, utilities in `effects.css`).
- One primitive owns the decorative language currently inlined across ~12 files:
  - **dot texture** — one size + one opacity (kills the 24px-vs-32px drift)
  - **color stripe** — one gradient-stripe variant
  - **blur wash** — one soft-wash variant
- Sections pass a prop (`texture="dots"`, `wash`, `stripe`) instead of hand-rolling CSS.
- Retire the duplicate SVG connecting-line motif (keep one).

### 0.6 Shape & accent locks
- Confirm single radius scale (already `0.625rem` — verify) and single accent. Grep for stray
  hardcoded colors/radii; note for cleanup.

## Files
- `src/components/primitives/section.tsx` (extend header + accent)
- `src/components/primitives/accent.tsx` (new — coffee-stain emphasis)
- `src/components/primitives/decor.tsx` (new — texture/wash/stripe; **not** `surface`)
- `src/app/styles/typography.css` (h2/h3 step), `layout.css` (dedupe `.container-default`),
  `effects.css` (decoration utilities), `components.css` (align `.glossary-term`)
- reuse/document: `primitives/{page-shell, stack, cluster, rule, prose}.tsx`

## Acceptance criteria
- `Section` is the single source for section headers; eyebrow off by default.
- One `<Accent>` (coffee-stain) primitive; one decoration primitive; dot/stripe/wash each have one
  implementation. No new name collides with existing `.surface-0/1/2`.
- `.container-default` removed (or aliased) — `PageShell` is the sole padding owner.
- `.text-heading` vs `.text-title` visibly distinct.
- No visual regression on a spot-check of home + one marketing page; type-check + lint clean.

## Resolved decisions
- **Accent = brush-smear, LOCKED.** Default treatment is final: `--ints: 0.6`, `--cov: 0.6em`
  (covers lower third), dark-mode opacity `0.5`. This is the `<Accent>` default; per-use override of
  `--ints`/`--cov` allowed only for a deliberate exception, not as a new default.

## Open questions for discussion
- **Asset form:** optimised PNG mask vs traced inline SVG path for the smear (implementation detail).
- **Decoration primitive:** wrapper component, or a set of `effects.css` utility classes via `cn()`?
- Spacing: any real gaps in the existing `Section`/`Stack`/`.grid-cards` scale, or is it complete?
