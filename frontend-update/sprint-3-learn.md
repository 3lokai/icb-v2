# Sprint 3 — Learn Hub + Article Reading

> **Status: ✅ Shipped** (verified 2026-06-08). `ArticleContent.tsx` h2→`.text-title` /
> h3→`.text-heading` is done (3.1); the learn hub uses `<Accent>` (3.2); the `/learn` hero title
> "Field Guide" was converted from the legacy `text-accent italic font-serif` span to `<Accent>`
> (`learn/page.tsx:40`, fixed 2026-06-08).
> **Note (out of scope):** `learn/insights/page.tsx:111` still has a legacy accent-word span — it was
> never in this sprint's file list. The `blog/blocks/*` italic-serif paragraphs are intentional
> editorial byline/description styling (muted body text, not the `text-accent` heading tic) and are
> on-contract — no fix needed.

**Goal:** Fix reading-typography hierarchy and eyebrow saturation; preserve the premium pillar
flip and card hover language.

**Risk:** Low.

**Depends on:** Sprint 0 (✅ shipped). Available: `<Section>` (`accentWord`/`align`, styled eyebrow),
`<Accent>` (`@/components/primitives/accent`, ≤1/page), `<Decor>` (`@/components/primitives/decor`).
Heading contract: h2 → `.text-title`, h3 → `.text-heading` (already stepped). `<PageShell>` owns
horizontal padding. Note: `.glossary-term` (the `/learn` inline-term style) is the documented accent
cousin of `<Accent>` — keep them reading as one family, don't introduce a third emphasis style.

## Tasks

### 3.1 Article prose hierarchy
- Apply the Sprint-0 heading contract to `ArticleContent.tsx` (`h2` → `.text-title`, `h3` →
  `.text-heading`, which currently render identically, ~lines 63-137). The CSS step already exists;
  this is a markup fix.
- Keep the existing list/blockquote/image-block spacing — already good.

### 3.2 Learn hub eyebrow budget
- Route the 5 hub section headers (pillars, featured, feed, series) through the extended `Section`
  primitive (eyebrow already styled + off by default) → ~2 eyebrows. Apply `<Accent>`, ≤1 per page.

### 3.3 Preserve
- Keep `FieldGuidePillars` 3D flip (motivated, premium) and `PostCard` / `SeriesCard` hover
  elevation language.
- Keep the 3-column article layout with sticky TOC.

## Files
- `src/app/(main)/learn/page.tsx`
- `src/components/blog/ArticleContent.tsx`
- (reference) `src/components/blog/{FieldGuidePillars, PostCard, SeriesCard}.tsx`

## Acceptance criteria
- Article `h2` vs `h3` visibly distinct; prose readable in both themes.
- Learn hub eyebrow count ≤ ceil(sections/3).
- Flip + hover interactions unchanged and reduced-motion safe.

## Open questions for discussion
- Should the article reading column width be tuned (current 750px center col) for line length?
