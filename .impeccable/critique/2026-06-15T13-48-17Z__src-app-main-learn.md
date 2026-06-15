---
target: learn pages + article pages
total_score: 28
p0_count: 0
p1_count: 3
timestamp: 2026-06-15T13-48-17Z
slug: src-app-main-learn
---
# Critique — Learn "Field Guide" landing + Article pages

Targets: src/app/(main)/learn/page.tsx and src/app/(main)/learn/[slug]/page.tsx plus component trees.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good TOC active-state; no scroll progress, no zero/empty states |
| 2 | Match System / Real World | 4 | "Field Guide / soil to your cup" metaphor coherent and on-brand |
| 3 | User Control & Freedom | 3 | Pillar flip-cards hover-only; no back-to-top on long reads |
| 4 | Consistency & Standards | 1 | Four sections, three hand-rolled header dialects; Section primitive props ignored; radii off-scale |
| 5 | Error Prevention | 3 | notFound() handled; format(new Date(date)) unguarded |
| 6 | Recognition Rather Than Recall | 4 | TOC, breadcrumbs, category chips aid recognition |
| 7 | Flexibility & Efficiency | 3 | Sticky TOC strong; Editor's Picks + feed are competing treatments |
| 8 | Aesthetic & Minimalist | 2 | Resting shadows + tonal panel + off-scale radii add depth noise |
| 9 | Error Recovery | 2 | No empty states; zero articles -> blank grid |
| 10 | Help & Documentation | 3 | FAQ accordion + DetailedAuthor cover the article well |
| Total | | 28/40 | Good — system-adherence problem, not a taste one |

## Anti-Patterns Verdict
Partially AI-looking; the tell is structural. Loudest signal: article grid xl:grid-cols-[250px_750px_1fr] (learn/[slug]/page.tsx:182) reserves a 1fr track that renders nothing -> content drifts left on >=1280px. Second: prose-slate (ArticleContent.tsx:142) injects a cool gray ramp into warm-paper body.

Deterministic scan (detect.mjs) — 2 side-tab findings:
- ArticleContent.tsx:110 border-l-4 border-accent on a blockquote. Real but mild: legitimate typography, but DESIGN.md spec says 2px; this is 4px. (P3)
- TableOfContents.tsx:137 border-l-2. FALSE POSITIVE — TOC active-position rail, the legitimate exception. Leave it.

Browser overlay: unavailable (port 3000 answered but /learn 404'd). Source + scan only.

## What's Working
1. TableOfContents — IntersectionObserver + scroll fallback, aria-label, active rail, return null when empty.
2. Token-level discipline — coffee-tinted color-mix shadows, --primary 0.52 and --muted-foreground 0.48 darkened for AA with comments.
3. Hero moments — <Accent>Field Guide</Accent> over image; article cover -> DetailedAuthor peak-end bookend.

## Priority Issues
[P1] Empty third column de-centers wide-screen articles. learn/[slug]/page.tsx:182. Fix: collapse to [250px_minmax(0,750px)] centered, or fill rail with vertical ShareArticle + related. -> adapt/layout
[P1] Section headers bypass Section primitive — three header dialects. learn/page.tsx:53-134. Section exposes eyebrow/title/accentWord. Route all four through it. -> layout
[P1] prose-slate cool gray ramp in warm body. ArticleContent.tsx:142. Drop it; define prose-coffee mapping --tw-prose-* to tokens. -> colorize/typeset
[P2] Resting drop shadows (Flat-Paper violation). FAQ learn/[slug]:210, DetailedAuthor:18, ShareArticle:59,69, pillar back-face shadow-xl. Remove resting shadow; keep hover. -> polish
[P2] Off-scale radii. rounded-2xl/3xl vs token cap ~14px; PostCard rounded-xl disagrees. Standardize rounded-lg/xl. -> polish
[P2] Hero/article metadata fails AA. ArticleHeader white/50 labels, PageHeader white/70 overline over translucent gradient. Raise to >=white/75, strengthen mid-stop or add scrim. -> audit
[P2] Editor's Picks + feed are one idea in two shapes. learn/page.tsx:73-116. Entries pill counts all but grid excludes featured. Distinguish or merge. -> distill

## Persona Red Flags
Jordan: no "start here"; pillars hide description behind hover-flip.
Sam: white/50 + white/70 fail AA; pillar flip is onMouseEnter only (no keyboard/focus); ShareArticle copy button icon-only no aria-label.
Casey: hover-driven flip-cards dead on touch; metadata row wraps ragged on phone; orphaned 5th pillar in 2-col grid.

## Minor Observations
- Eyebrow rule color differs (bg-accent/60 vs bg-primary/70).
- ArticleContent body-h1 maps to text-hero, larger than real h2 section headers.
- format(new Date(date)) unguarded (ArticleHeader:119, PostCard:92).
- SeriesCard/PostCard no empty-state guards.
- ArticleContent rebuilds components object every render.

## Questions to Consider
- Why does the flagship Learn page use none of Section's header props?
- What does the hover-flip pillar card buy when it's invisible to touch and keyboard?
- Empty third column: recenter or fill with sticky share + related?
