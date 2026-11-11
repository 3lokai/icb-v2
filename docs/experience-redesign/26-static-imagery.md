# 26 — Static Imagery Inventory and Selective Replacement

**Status (2026-11-11): reviewed assets and a staged replacement candidate; `src/` and production image files are UNCHANGED by this document.** Keep the existing image system where it works. This is the asset-selection handoff for Phase C, not a new visual identity exploration.

## Scope and source

Inspected the assets under `public/images`, `public/videos`, `public/icb-world`, `public/animations`, `public/curations`, and the active mappings in `src/lib/collections/coffee-collections.ts`, as well as `CollectionCard.tsx`, `PageHeader.tsx` and `AuthImagePanel.tsx`.

**Exclude:** scraped coffee bag photos and roaster logos on ImageKit. Preserve their colour, framing integrity and source provenance. User-contributed or evidence photos must also not be given editorial washes.

## Keep / Reframe / Replace decisions

| Area / file | Current role | Decision | Why / next check |
|---|---|---|---|
| `public/images/collections/beginner-friendly.webp` | Starter collection | KEEP | Relevant coffee lifestyle photo; adjust crop/scrim if text overlap. |
| `public/images/collections/milk-friendly.webp` | Milk-friendly collection | KEEP | Clear milk-in-coffee visual. |
| `public/images/collections/fruity-filter.webp` | Fruity filter collection | **REPLACE CANDIDATE READY** | Current Chemex pour-over conveys a brew method more than juicy/fruity tasting character. A new standalone, card-cropped editorial image has been staged outside the repo for visual review. |
| `public/images/collections/south-indian-filter.webp` | South Indian filter collection | KEEP | Distinctive, relevant brass tumblers. |
| `public/images/collections/balanced-medium.webp` | Balanced medium | KEEP | Bean-in-bag visual works. |
| `public/images/collections/light-bright.webp` | Light and bright | KEEP / REFRAME | Coffee-on-white image has light tonality; no need for another generic AI photo. |
| `public/images/collections/low-acidity.webp` | Low-acidity collection | KEEP / REFRAME | Generic bean macro but not misleading; a photograph cannot prove chemical acidity. |
| `public/images/collections/bold-dark.webp` | Bold/dark collection | KEEP | Strong, coffee-appropriate image. |
| `public/images/collections/default-filter.webp` | Shared by FIVE secondary/value categories | REASSIGN selectively | It is a generic stock bean spill; avoid five visually identical cards in the same collection view. |
| Experimental Processes | Currently uses `default-filter.webp` | EXISTING ASSET CANDIDATE: `/images/discovery/process-anaerobic-context.avif` | Verify crop and actual subject before mapping to this collection. No estate-specific claim. |
| Single-Estate | Currently uses `default-filter.webp` | EXISTING ASSET CANDIDATE: `/images/learn/pillars/origins-and-estates.webp` | Generic editorial cherries only: never present it as a specific estate photo. |
| Espresso-Focused Blends | Currently uses `default-filter.webp` | EXISTING ASSET CANDIDATE: `/images/discovery/espresso-hero.avif` | Better semantic fit; inspect image and focal point in card crop. |
| Great Value Picks | Currently uses `default-filter.webp` | EXISTING ASSET CANDIDATE: `/images/discovery/budget.avif` | Better category relevance; crop and overlay QA required. |
| Premium & Microlots | Currently uses `default-filter.webp` | RETAIN TEMPORARILY | Better to preserve a neutral image than depict an invented premium product. Seek credible generic contextual photo later. |
| `public/images/discovery/` | Brew/roast/process/region landing images | KEEP | Broad existing coverage, including topic-specific `*-context.avif` and brew-method assets. Check each assigned template visually before making replacements. |
| `public/images/learn/pillars/` | Five Learn category images | KEEP / OPTIMIZE | Relevant imagery already exists, but several WebP files exceed 1 MB. Produce responsive versions and verify attribution. |
| `public/images/about/`, `contact/`, login/onboarding screens | Editorial/supporting photography | KEEP / REFRAME | Test brand wash/scrim against actual photo and light/dark context; do not blanket tint documentary images. |
| `public/videos/hero-video.*`, `hero-poster.webp` | Current animated home hero | DEFER / RETIRE FROM NEW HERO | Approved homepage composition replaces the video with a neutral, dynamic coffee catalogue composition. Preserve as historical asset. |
| `public/icb-world/`, `public/images/testing/` | Previous concept/test imagery | ARCHIVE / DO NOT ASSUME ACTIVE | Large, often duplicated exploratory outputs; not evidence of estate origins. |
| `public/images/interstitials/*.png` | Intended editorial dividers | VERIFY / EXCLUDE | 12 listed PNG placeholders have zero-byte sizes in the GitHub inventory; treat them as unusable until verified. |
| `public/press/` logo/wordmarks/screenshots | External press kit | KEEP FOR NOW | Do not silently change externally shared brand assets until production identity ADR/rollout. |

## New candidate: Fruity Filter Bangers

A standalone portrait illustration/photo-style editorial still-life shows a clear amber pour-over and fresh fruits used as a **visual tasting-note metaphor**, not ingredients. It was generated and exported to a **720 × 1280 WebP (78 KB)**, with the original 1024 × 1536 composition retained as an optional crop source. It can be installed as `public/images/collections/fruity-filter.webp` **after** approval and a real text/scrim test.

**Important:** the candidate is AI-generated, not a documented real roaster, estate, brewing event or evidence photograph. Don't cite it as an actual image of a named farm or product.

The candidate binary is delivered separately as a conversation asset pack; it has **not** been written to the repository. The prior original image remains in the branch.

## Applying the locked visual system

1. Product pack images and roaster logos: never editorial wash, scrim, tint or texture.
2. Editorial photographs: espresso wash when it genuinely harmonizes; bottom scrim only for overlaid text, side scrim only if text sits beside the subject. Evaluate actual contrast and mobile crop.
3. Terrain motifs and Light + Contour: prefer standalone decorative surfaces and genuine no-photo fallbacks, **not** generic estate-looking substitute photography.
4. Collections: standardized crop, focal position, legible bottom region, descriptive alt and performance sizes. Do not bake typography or gradients into raster files; compose them in shared components.
5. Optimize oversized source assets rather than replace sound photography just to chase a particular colour.
6. Check usage, licensing/attribution, subject accuracy and light/dark before integration; keep original versions for rollback.

## Implementation boundary

No production image files, image URLs, CSS or component source files were modified in this pass. **Do not automatically rewrite all collection mappings**; crop and authenticity validation is required. Once a candidate is visually accepted, integrate in the redesign branch, run responsive/SEO/performance checks and obtain an ADR before deploying any production redesign.

Next stage remains the shadcn/Phosphor component lab, with this document as the imagery input. See [22](22-visual-system.md), [24](24-information-architecture.md) and [25](25-page-hierarchy.md).
