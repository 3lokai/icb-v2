# Sprint 5 — Discovery Landing Pages (programmatic `/coffees/[slug]`)

> **Status: ⬜ Not started** (verified 2026-06-08). 10 `src/components/discovery/*` components still
> carry inline `blur-2xl`/`blur-3xl` washes (BrewParamsStrip, RegionSnapshot, RoastProfileTabbed,
> UtilityCard, PriceBucketProfileSection, RoastScale, ProcessExplainer, ProcessProfileSection,
> BrewMethodProfileSection, RegionDetailSection); no `<Decor>` re-convergence yet.

**Goal:** Bring the programmatic SEO landing pages onto the Sprint 0 primitives. These pages
(`brew-method`, `roast-level`, `process`, `price-bucket`, `region`) render through
`DiscoveryLandingLayout` and ~22 `src/components/discovery/*` components — none touched by Sprint 4,
yet collectively the **heaviest offenders** for the systemic tells (blur-wash clutter and
Section-escaping inline headers).

**Risk:** Medium. High surface area (~4,000 lines, 22 components) and these pages are SEO-load-bearing
(`generateStaticParams` over every landing slug), so verify structured data + headings survive.

**Depends on:** Sprint 0 (✅ shipped). Available: `<Decor>` (`@/components/primitives/decor` —
`texture="dots"`/`wash`/`stripe`; renders an `aria-hidden absolute inset-0` layer, so the parent must
be `relative overflow-hidden`). `Section` owns eyebrow + title + spacing scale; `PageShell` owns the
only padding scale; `<Accent>` brush-smear rationed ≤1/page. Heading contract: h2→`.text-title`,
h3→`.text-heading`. `.grid-cards` is the canonical 3-col token.

## Why this sprint exists

The `/coffees/[slug]` route is dual-purpose: known discovery slugs → `DiscoveryLandingLayout`;
otherwise legacy coffee slug → redirect/disambiguate (the disambiguation half is Sprint 4.4). Sprint 4
only named the disambiguation page and the directory listing — it never covered the discovery layout or
its section components. This sprint closes that gap.

## Audit findings (evidence)

| Tell | Offenders | Count |
|---|---|---|
| **Blur-wash clutter** (`blur-2xl`/`blur-3xl`, 2 per card) | BrewParamsStrip, BrewMethodProfileSection, ProcessProfileSection, PriceBucketProfileSection, ProcessExplainer, RoastProfileTabbed, RoastScale, UtilityCard | 8/22 |
| **Inline `h3` headers escaping Section** (subsections inlined, no eyebrow/title rhythm) | BrewMethodProfileSection, ProcessProfileSection, PriceBucketProfileSection, RegionDetailSection, RegionOverviewSection, RoastProfileTabbed | 6/22 |
| **Italic-serif accent-word tic** (via `splitEmphasisPair` / `<span class="text-accent italic">`) | most titled components (driven by `DiscoverySectionIntro`) | ~15/22 |
| **Ad-hoc gap/spacing** (`gap-6`+`gap-8` mixed, `space-y-12`) | BrewParamsStrip, ProcessProfileSection, others | 5+ |
| **Ad-hoc colored decoration** (amber context boxes, type-based color stripes) | BrewMethodProfileSection (amber), ProcessProfileSection (amber), RegionDetailSection (accent), RelatedLinks (per-type stripe) | 4+ |
| **Motion inconsistency** (over-animated vs. static siblings) | DiscoveryAccordionGrid, DiscoveryPillGrid, RoastProfileTabbed, RoastScale | 4/22 |

**Already clean (preserve, do not touch):** CoffeeGridTeaser, DiscoveryRecipeSection, FlavourImpact,
ValueTips, RoastersSourcing, RoastProfileSection (thin wrapper), DiscoverySectionIntro (the shared
intro primitive — fix the accent-word tic here once, not per-component).

**Worst offenders (refactor priority):** RoastProfileTabbed → ProcessProfileSection →
BrewMethodProfileSection → PriceBucketProfileSection → RegionDetailSection.

## Tasks

### 5.1 Decoration cleanup — kill the blur washes
- Remove the paired `blur-2xl`/`blur-3xl` circle washes across the 8 components above. Where a card
  genuinely wants texture, replace with `<Decor texture="dots" />` or `<Decor wash />` on a
  `relative overflow-hidden` parent — shared helper only, no inline blur circles.
- Drop the per-type color stripe logic in `RelatedLinks.tsx` and the amber context boxes in
  `BrewMethodProfileSection`/`ProcessProfileSection`; converge on one accent.

### 5.2 Re-converge profile sections onto `Section`
- The five profile sections inline 4–6 subsections as bare `<div><h3 class="text-heading">…</h3></div>`
  inside a `space-y-12`. Wrap each subsection in `<Section>` + `DiscoverySectionIntro` so spacing and
  heading rhythm come from the primitive. Net: deletes inline header/spacing code per section.
- Apply to: BrewMethodProfileSection (6), ProcessProfileSection (6), PriceBucketProfileSection (4),
  RegionDetailSection (4), RegionOverviewSection (2).

### 5.3 RoastProfileTabbed
- Worst structural offender: 4 tabs × bespoke grid/image-overlay/eyebrow each, plus blur washes.
  Decide (see open questions): keep the tabbed interaction but route each tab's body through a single
  shared layout + `Section` rhythm, or flatten to stacked Sections. Either way remove the blur washes
  and the per-tab bespoke eyebrow placement.

### 5.4 Accent-word tic
- Fix once in `DiscoverySectionIntro` (the shared source of the `<span class="text-accent italic">`
  pattern): keep the inline emphasis as a normal accent, and let pages opt into the locked `<Accent>`
  brush-smear ≤1/page (likely the hero/PageHeader only).

### 5.5 Motion alignment
- Bring DiscoveryAccordionGrid, DiscoveryPillGrid, RoastScale to the same motion level as their static
  siblings (CoffeeGridTeaser, ValueTips). Confirm `prefers-reduced-motion` collapses all to static
  (DiscoveryPillGrid already honors `useReducedMotion`; verify the others do too).

### 5.6 Spacing scale
- Replace ad-hoc `gap-6`+`gap-8` mixes and stray `space-y-12` with Section's spacing scale /
  `.grid-cards`. Unify the 3-col vs 2-col grid inconsistency in PriceBucketProfileSection.

### 5.7 Preserve
- `generateStaticParams` slug set, all landing-page configs, structured data, breadcrumb/PageHeader
  hero, scroll/snap behavior that is genuine UX. No route/slug changes.

## Files
- `src/app/(main)/coffees/[slug]/page.tsx` (layout dispatch only — no behavior change)
- `src/components/discovery/DiscoveryLandingLayout.tsx`
- `src/components/discovery/DiscoverySectionIntro.tsx` (accent-word fix lands here)
- Profile sections: `{BrewMethod,Process,PriceBucket,Roast}ProfileSection.tsx`,
  `RoastProfileTabbed.tsx`, `RegionDetailSection.tsx`, `RegionOverviewSection.tsx`
- Decoration offenders: `BrewParamsStrip.tsx`, `ProcessExplainer.tsx`, `RoastScale.tsx`,
  `UtilityCard.tsx`, `RelatedLinks.tsx`
- Motion: `DiscoveryAccordionGrid.tsx`, `DiscoveryPillGrid.tsx`

## Acceptance criteria
- Zero inline `blur-2xl`/`blur-3xl` circles in `src/components/discovery/`; decoration via `<Decor>` only.
- All profile subsections render through `Section` + `DiscoverySectionIntro`; no bare inline `h3` headers.
- Eyebrow count ≤ ceil(sections/3) per rendered landing page; ≤1 italic-serif accent word per page.
- One accent / one radius / one theme per page; no per-type color stripes or amber context boxes.
- `prefers-reduced-motion` collapses all discovery motion to static.
- No regression to `generateStaticParams`, structured data, or the PageHeader hero. Walked in light + dark.

## Open questions for discussion
- RoastProfileTabbed: keep tabs (refactor bodies onto one shared `Section` layout) or flatten to
  stacked Sections? Tabs are interactive but the 4 bespoke layouts are the core of the structural debt.
- Blur washes: eliminate entirely, or keep one strategic `<Decor wash />` per page reserved for the hero?
- DiscoveryLandingLayout has 11+ `if (config.type === …)` branches — in scope to refactor to
  per-type composition this sprint, or leave as-is since it's logic not visual tell?
