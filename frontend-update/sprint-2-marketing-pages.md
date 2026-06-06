# Sprint 2 — Marketing / Public Pages

**Goal:** Unify the heading system and decoration across about / contact / how-icb-works / tools
hubs; cut eyebrow saturation.

**Risk:** Low (mostly applying Sprint-0 rules; content-light pages).

**Depends on:** Sprints 0 + 1 (✅ shipped). Available: `<Section>` (`accentWord`/`align`, styled
eyebrow), `<Accent>` (`@/components/primitives/accent`), `<Decor>` (`@/components/primitives/decor` —
`texture="dots"`/`wash`/`stripe`; **not** `Surface`), and **`<Reveal>`** (`@/components/primitives/reveal`
— scroll-reveal client leaf, reduced-motion safe; use for any scroll motion). `.container-default`
removed → use `<PageShell>`. `.grid-cards` is the canonical 3-col token. Heading contract:
h2→`.text-title`, h3→`.text-heading`. Oversized panels standardize on `rounded-3xl`.

## Updates carried over from Sprint 1 (read first)

- **Accent is NOT rationed to ≤1/page.** Per-section-title `<Accent>` (the coffee brush-smear) is
  ICB's documented brand signature — the skill was updated with this project override. The Sprint-2
  job is to **convert every ad-hoc `text-accent italic font-serif` accent word to the `<Accent>`
  primitive** (one consistent treatment), NOT to delete accents down to one. Constraint: ≤1 accented
  phrase per individual title, always the primitive, never hand-rolled spans.
- **Eyebrow reality:** `Section`'s `eyebrow` prop was dead code on the homepage — sections hand-roll
  their own inline `text-overline … tracking-[0.15em] uppercase` span (often with a decorative
  `h-px w-8 bg-accent` rule) inside `Section`'s children. Expect the same on marketing pages. The
  task is to **delete those inline eyebrow spans** down to budget, routing surviving titles through
  `Section`'s `title`/`accentWord`/`eyebrow` props.
- **Reduced motion:** any `whileInView`/infinite-loop motion must be reduced-motion safe — use
  `<Reveal>`, or wrap a motion subtree in `<MotionConfig reducedMotion="user">` (the Sprint-1 pattern).

## Tasks

### 2.1 Heading unification
- Apply the Sprint-0 heading contract (h2 → `.text-title`, h3 → `.text-heading`). Fixes the
  `text-title` / `text-primary italic` / `text-heading` mix used for the same level on
  `about/page.tsx` and `how-icb-works/page.tsx`.

### 2.2 Eyebrow budget + accent conversion
- Each page from 5-6 eyebrows to ~2 (≤ ceil(sections/3)) by **deleting the inline eyebrow spans**;
  route any survivors through `Section`'s `eyebrow` prop (already styled + off by default).
- Convert every `text-accent italic font-serif` accent word to `<Accent>` (per-section-title is the
  brand signature — do NOT cut to one; ≤1 accented phrase per title).

### 2.3 Card standardization
- Resolve card-style drift on `tools/page.tsx` (serif vs non-serif titles, mixed icon colors,
  center vs left alignment) → one card pattern.
- Standardize the 3-equal-card grids to shared card + gap tokens.

### 2.4 Decoration consolidation
- Replace inline dot-texture/color-stripe on `contact/page.tsx` + `tools/page.tsx` with the
  decoration primitive (`<Decor>`) (fixes 24px-vs-32px inconsistency).

### 2.5 Copy
- Remove the em-dash in the tools copy ("sour, bitter, watery — ...").

### 2.6 Preserve
- Keep the magazine overlap-card hero (`about` `-mt-20`) — brand strength.
- Keep `PageHeader` hero pattern (excellent consistency across pages).

## Files
- `src/app/(main)/(public)/{about, contact, how-icb-works}/page.tsx`
- `src/app/(main)/tools/page.tsx`
- `src/components/layout/PageHeader.tsx`

## Acceptance criteria
- One heading-class-per-level rule applied; h2/h3 visibly distinct.
- Eyebrow count ≤ ceil(sections/3) per page; every accent is the `<Accent>` primitive (≤1 phrase
  per title; per-section accent is intentional); zero em-dashes.
- Tools cards share one pattern; decoration via shared helpers only.

## Open questions for discussion
- Tools hub: keep 3 separate card sections (Featured / Coming Soon / Why) or merge?
- Is the contact-page bento "Action Cards" treatment worth keeping as a signature, or normalize it?
