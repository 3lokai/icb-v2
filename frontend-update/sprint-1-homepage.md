# Sprint 1 — Homepage Recomposition

**Goal:** Highest-visibility surface. Preserve all 14 sections' content/data; vary their *form* so
the page reads as art-directed, not templated.

**Risk:** Medium (most sections touched, but each is isolated).

**Depends on:** Sprint 0 (✅ shipped — see "Sprint 0 primitives now available" below).

## Sprint 0 primitives now available (use these — do NOT re-invent)

| Primitive | Import | API |
|-----------|--------|-----|
| `<Section>` | `@/components/primitives/section` | now takes `accentWord?`, `align?: "left" \| "center"`; eyebrow already styled (uppercase / accent / `tracking-[0.18em]`, off by default) |
| `<Accent>` | `@/components/primitives/accent` | coffee brush-smear emphasis. `<Accent>worth</Accent>`. Locked defaults (`--ints 0.6`, `--cov 0.6em`, dark 0.5); `intensity`/`coverage` props only for deliberate exceptions. Ration **≤1 per page** |
| `<Decor>` | `@/components/primitives/decor` | `texture="dots"` / `wash` / `stripe` props. Renders an `aria-hidden absolute inset-0` layer — parent must be `relative overflow-hidden`. (Named `Decor`, **not** `Surface` — `.surface-0/1/2` already owns depth.) |

Other facts from Sprint 0:
- **`.grid-cards`** (in `layout.css`) is the canonical 3-col card grid token — adopt it instead of
  hand-rolling `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.
- **`.container-default` was removed** — `<PageShell>` is the sole horizontal-padding owner.
- Heading contract: h2 → `.text-title`, h3 → `.text-heading` (now a clear step smaller).
- The mask asset lives at `public/images/stain-smear.png` (referenced by `.accent-smear` in `effects.css`).
- **Already migrated in Sprint 0 (done — do not redo):** `CtaSection` (consumes `<Decor stripe texture="dots" wash />` + `<Accent>`) and `Footer` (`<Decor texture="dots" wash />` + `<PageShell>`).

## Tasks

### 1.1 Reconverge sections onto the primitives (Layer 4 → Layer 2)
- Route every section header through the extended `Section` primitive; delete inline header markup.
  Drops home from **14 eyebrows to ~4**.
- Apply `<Accent>` on **every section title** — this is ICB's brand signature, NOT rationed to
  ≤1/page (decision locked; skill updated with the project override). The job is to **convert all
  ad-hoc `text-accent italic font-serif` accent words to the `<Accent>` brush-smear primitive** so
  the treatment is one consistent thing, not 8 hand-rolled variants. Convert (CtaSection already
  done): `NewArrivalsSection.tsx:61`, `TopRatedSection.tsx:80`, `EducationContent.tsx:139`,
  `HowItWorksSection.tsx:104`, `CuratorSpotlight.tsx:59`, `UserProfileTeaser.tsx:42`,
  `RoasterInfrastructureSection.tsx:82`, `TestimonialsSection.tsx:215`. Constraint: ≤1 accented
  phrase per title, and once the title routes through `Section`, use the `accentWord` prop.
- **Correction to the eyebrow framing:** `Section`'s `eyebrow`/`title`/`accentWord` header is
  currently *unused* on the homepage (`eyebrow=` passed 0×). Sections render their own inline header
  block — an `text-overline … tracking-[0.15em] uppercase` span + a bespoke `<h2>` — inside
  `Section`'s children. So 1.1 = **delete those inline header blocks, pass `title`/`accentWord`
  through `Section`, and drop the eyebrow span on all but ~5 sections.**
- Replace inline decoration with `<Decor>` (`texture`/`wash`/`stripe`). Inlined dot/wash/stripe still
  present in: `TestimonialsSection`, `UserProfileTeaser`, `RoasterInfrastructureSection`,
  `NewsletterSection`, `NewArrivalsSection`, `HowItWorksSection`, `FeaturesBentoGrid`,
  `EducationContent`, `CuratorSpotlight`.
- **Stray-radius cleanup (flagged in Sprint 0):** `rounded-[2.5rem]` / `rounded-[2rem]` and a
  hardcoded `#000` dot-grid appear in `CuratorSpotlight.tsx:27`, `NewArrivalsSection.tsx:73`,
  `UserProfileTeaser.tsx:126,172` — fold to the radius scale / `<Decor>` here.

### 1.2 Break layout-family repetition
- No layout family repeats >2× consecutively. Introduce 2-3 new families:
  - **Editorial feature row = `NewArrivalsSection` (decision locked).** It must still show **3-5
    arrivals** — so the form is *one large featured arrival + a row of 3-4 smaller cards beside/
    below it*, NOT a collapse to a single hero coffee. This breaks the card-grid/split run while
    keeping the multi-item content. `TopRatedSection` stays the sticky-rail shelf.
  - Reduce floating-card / glassmorphism density in `UserProfileTeaser.tsx` + `EducationContent.tsx`.

### 1.2b Marquee reduction (skill: max 1 marquee/page — decision locked)
- The page has 3 marquees today; **keep only `NewAdditionsStrip`** (the under-hero freshness strip).
  - `TestimonialsSection` dual-row marquee → **static grid / carousel** (no auto-scroll).
  - `RoasterInfrastructureSection` vertical `marquee-vertical` scroll → **static stat list.**

### 1.3 Differentiate the 3 CoffeeCard sections
- `RecentlyViewedSection`, `TopRatedSection`, `NewArrivalsSection` keep the same card but in
  distinct contexts (sticky-rail vs shelf vs marquee) so repetition reads as rhythm.

### 1.4 Motion rhythm
- Add scroll-reveal motion to the currently-static `TopRatedSection.tsx` and `CtaSection.tsx`.
- Enforce max useful marquees + reduced-motion fallbacks on all animated sections.

### 1.5 Hero polish
- Lighten the heavy dual gradient overlay (`HeroControl.tsx:24-25`) for image legibility.
- Confirm `min-h-[100dvh]`, ≤2-line headline, ≤20-word subtext, CTA visible without scroll.

## Files
- `src/app/(main)/page.tsx`
- `src/components/homepage/{HeroControl, TopRatedSection, CtaSection, UserProfileTeaser,
  EducationContent, NewArrivalsSection, RecentlyViewedSection, HowItWorksSection,
  RoasterInfrastructureSection, CuratorSpotlight}.tsx`

## Acceptance criteria
- Eyebrow count ≤ 5 (inline eyebrow spans deleted on the rest; survivors route through `Section`).
- Every accent word is the `<Accent>` brush-smear primitive (no ad-hoc `italic font-serif` spans);
  ≤1 accented phrase per title. (Per-section accent is intentional — see skill project override.)
- Exactly 1 marquee on the page (`NewAdditionsStrip`); Testimonials + RoasterInfra are static.
- No 3 consecutive sections share a layout family; `NewArrivals` is the editorial feature row.
- TopRated + CTA animate on scroll; all motion respects reduced-motion.
- Hero passes viewport/legibility pre-flight in both themes.

## Resolved decisions (locked 2026-06-06)
- **Marquees:** keep `NewAdditionsStrip` only; Testimonials → static grid/carousel, RoasterInfra →
  static stat list.
- **Editorial row:** `NewArrivals` (featured-arrival + 3-4 smaller; keeps 3-5 items visible).
- **Accent:** per-section-title accent is the ICB brand signature — convert all to `<Accent>`, do
  NOT delete to a single one. Skill updated with the documented project override.
