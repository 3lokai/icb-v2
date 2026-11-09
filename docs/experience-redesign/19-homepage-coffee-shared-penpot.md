# 19 — Homepage F · Coffee, Shared (Penpot)

**Status:** Exploratory visual/UX design, **not** live implementation or production approval. **Date:** 2026-11-09.

**Penpot file ID:** `d3aee43a-8d21-8092-8008-e896e8d8af0c` (file currently titled `New File 1`).
**Penpot page:** `F · Coffee, Shared — editorial homepage` (ID `c461c933-f942-8017-8008-eb994260db94`).
**Saved version:** `F · Coffee, Shared — warmer editorial long-scroll homepage · 09 Nov 2026` (rev 122). Validation **0 errors**, text overflow **0**.

Two full-height independently composed artboards:
- **Desktop:** `F / DESKTOP · One homepage · 1440 × 8150` (`c461c933-f942-8017-8008-eb9942e43f82`)
- **Mobile:** `F / MOBILE · One homepage · 390 × 9250` (`c461c933-f942-8017-8008-eb9942eb5b2d`)
- Penpot flows: `F / Desktop · editorial single-scroll`, `F / Mobile · editorial single-scroll`.

## Why F exists

Owner supplied a find.coffee screenshot as inspiration. Lessons: warm editorial palette, human/sensory photography, richer activity previews, varied light/dark moments, visible community participation, and conventional sections that feel like one *narrative*. Avoid cloning the site's layout, copy or functionality.

The previous homepage E delivered a long story, but was dark, visually abstract, heavily typographic and insufficiently photographic. F tests whether ICB can be warmer and more approachable **without losing its own positioning** as an independent review/intelligence authority.

**Premise:** Sections are allowed; **disconnected sections are not**.

## F's single-scroll narrative

1. **Welcome / act:** immediately show `Find a coffee` and `Rate one I've tried`; distinctive unbranded editorial brewing photograph; documented catalogue breadth, independent trust message and one recent-rating evidence teaser. No promoted coffee/roaster.
2. **It's alive:** a chronological news/editorial timeline rather than a generic marketplace carousel: new coffee, new roaster, recent community rating and latest Field Guide article. Consistent date/sorting rules; sample data only. Include a warm textured photo and clear source context.
3. **Discover your way:** direct method, flavour, origin, process, variety and exact filter doors. Photography supports the content without pretending to depict actual catalogued coffees.
4. **Atlas threshold:** a deliberate dark immersive interval that shows one **typed focus** (`Natural process`) and limited related directions (coffees, origins, flavours, varieties). Always show Back, breadcrumbs, precise filters and an optional contextual `Ask ICB` affordance. Don't infer relationships or treat AI as a canonical source.
5. **Trust independent evidence:** visual demonstration of `5.0 from 1`, `4.5 from 2` and zero ratings; distinguish what roasters claim, what ICB infers and what real people experienced. Use true review counts and transparent community-favourites rules in production.
6. **Contribute:** genuine coffee search → quick 1–5 score → optional tasting method and notes. Use the EXISTING auth/review write path, anonymous three-entity cap, moderation, anti-abuse and consent in implementation. The Penpot form is *illustrative and inert*.
7. **Return:** signed-in users see their own saved, actually tried and opt-in profile/gear context; anonymous visitors see a complete neutral experience. Treat these as **alternative user states of the home**, not a claim that everybody sees a personalized module.
8. **Go deeper / close:** Field Guide, tools, independent roaster directory, final invitation to find/rate. No paid influence on organic ranking or independent reviews.

## Design & photography

- Proposed visual exploration only: warm oat/off-white foundations, editorial DM Serif Display + DM Sans, restrained terracotta and deep forest. Dark Atlas as a signature chapter, **not** the site's universal surface.
- Layout deliberately mixes a big photographic invitation, editorial timeline, considered filter list, spatial graph, comparative evidence, tasting form and a light personal journal. Mobile receives its own layout/story pacing, not a shrink-to-fit desktop crop.
- Photographs are **unbranded editorial mood/usage images**, sourced during prototyping from Unsplash image URLs (coffee ritual, pour-over, cup detail, beans, warm café). They **do not depict any given catalogue coffee or an Indian estate**. Review provenance/license and choose ICB-owned or commissioned imagery before production.
- The catalogue figures `1,688 coffees`, `122 active roasters` and sample activity (Jalebi, Ko Ho Coffee Co., Madhumala, The Coffee Bloom) come from dated **07/09 Nov 2026 prototype/audit snapshots**, not live validated numbers. The evidence cards illustrate sample sizes rather than current product rankings. Replace with actual queries before any launch.
- Design mockup is static Penpot composition; no working scroll choreography, live APIs or review submission. Named Penpot flows open each long artboard; motion is an implementation hypothesis.

## Open next review

- Is the warm/light photographic rhythm enough of a *refresh* without feeling like a generic coffee magazine?
- Does the first mobile viewport deliver a clear find/rate job and a genuine sense of catalogue scale/activity?
- Is the Atlas chapter immersive enough and contextually linked to surrounding content?
- Are community evidence, trust, rate action and return-to-contribute first-class, not buried?
- Which transitions deserve motion/3D vs simple shared-element or typography movement, and can these be implemented without SEO/performance cost?
- Do not replace production `DESIGN.md`, theme support, URLs, data schemas, review auth or personalization until an approved ADR and implementation plan.

**Next gate:** owner reviews F against E/Phase 1D in Penpot, then chooses whether to refine and prototype the corresponding browser experience.
