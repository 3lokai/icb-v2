# 21 — Phase 1C: A continuous Living Coffee Atlas (no homepage sections)

**Date:** 2026-11-09  
**Status:** Design iteration in response to owner feedback: “still feels section after section.” Experience prototype only; no live site, schema, auth, route or production code change.

**Preview:** [experience-v3-continuous.html](../../prototype/atlas-phase1/experience-v3-continuous.html)  
**Earlier comparison:** [Phase 1B site experience](../../prototype/atlas-phase1/experience-v2.html)  
**Penpot:** `D · Phase 1C — One continuous Atlas`, desktop and mobile design boards.

## 1. What wasn't working

Phase 1B changed the colours, navigation and section names but preserved the fundamental habit: a header hero, a choose-a-lens section, a community feed section, recent additions and Learn & Tools below it. That is precisely the conventional stacking approach the owner rejected.

Do **not** interpret “preserve the current homepage functions” as “preserve the current homepage sections.” The original capabilities (directories, search, independent reviews, new catalogue products, editorial, tools, profile and provenance) must survive, but their visual composition should be fluid.

## 2. The new interaction model

**One scene, one focal subject, contextual evidence, all routes accessible.**

- **Stable world:** The same viewport and visual field remains; no user-visible horizontal bands of separate marketing sections. A centre object and its nearby connected subjects provide orientation.
- **Lens selection:** Brew / Flavour / Process / Origin / Roasters / Reviews / Learn / Tools change the **focus and corresponding evidence plate**, not the URL route or a stack of content. Content stays source-specific and relevant. The initial state is neutral (no featured branded coffee).
- **Focal objects:** A lens (e.g. Origin) can intentionally lead to a real coffee focus with independent review count, actual roaster and an optional next factual connection. Only explicit clicks change focus, with browser history and query-string shareability in HTTP previews.
- **Evidence plate:** A compact marginal note, not a giant content card: factual catalogue relations, roaster-supplied notes and community scores are distinguished. Where ratings are sparse, label that reality.
- **Site index overlay:** Explore, Learn, Tools and My Coffee open a clean navigational drawer linking to real published pages. This is navigation, not a second homepage. No invented /explore or public estate route.
- **Search and rating overlays:** Focused tools, not separate scrolling homepage sections. Demo rating does **not** submit.
- **Scrolling:** The wheel adjusts the vantage (subtle orbit/depth change) only. It does not auto-select a branded coffee or drive history. Reduced-motion users get the full content without animation.
- **Mobile:** Same central world, with floating navigable focus objects, slim horizontal lens dock, and a compact evidence plate. Full detail is expanded in an accessible drawer, not another page of cards. There is no mobile carousel of arbitrary featured brands.

## 3. Preserve the existing ICB website breadth

The Atlas is the **front door and connection system**, not the only way to navigate ICB.

| Existing public surface | How to enter from the new world |
|---|---|
| Coffee directory, /coffees | Search action, Brew/Process lenses and Explore index |
| 42 SEO landing routes, /coffees/[slug] | Direct canonical link from lens / filter (e.g. /coffees/v60 and /coffees/natural) |
| Canonical coffee detail | Verified coffee focus → direct published detail URL |
| Roaster profiles | Roasters lens / Explore drawer |
| /regions and existing region landing routes | Origin lens / Explore drawer |
| /curations and /communities | Explore drawer; both existing |
| Learn articles, series, glossary, insights | Learn lens / Learn drawer |
| Four practical brewing tools | Tools lens / Tools drawer |
| My reviews, wishlist, preferences, privacy | My Coffee drawer; actual login/privacy semantics not simulated |
| Company, partner, developer, trust/legal routes | Retain as secondary navigation and structured footer in production |

**No published estate/variety/flavour hub invented.** The three Baarbara sample coffee edges were separately verified in `coffee_estates → estates → canon_estates`.

## 4. Product and interaction tests performed

- Browser and Node script parse, tested in headless Chromium via `set_content` at desktop **1440×900**, mobile **390×844** and small mobile **320×740**.
- Confirmed neutral initial state, visible selection of the Origin focus, coffee focus, small/empty review states, expandable context, review form preview, accessible menu/search actions and search results.
- No horizontal viewport overflow at tested sizes; no uncaught browser errors in tested flows.
- Browser Back/Forward implemented for focus via `?focus=...`; direct links and sample data are truthful but static.
- `noindex,nofollow`, no API keys, no Supabase reads/writes, no cookies or account identity.

**Limitations:** no live backend, no actual user account/history, no performance lab benchmark of the Next.js application, no production SSR or SEO test; modal keyboard focus trap and screen-reader interaction need proper production validation. Styling and motion are an exploratory composition, not final brand approval or a production component specification.

## 5. Distinguish UX visual concept from technical architecture

**Do not implement this by replacing SSR content with one client-only visual canvas.** The final site must retain the existing indexable HTML pages, URLs, schema and meaningful static links. In Next.js, use a progressive *scene layer* over real semantic content. Only render/animate the focus relations, index/drawers and necessary transition choreography. Lazy-load any heavier visual feature after proof of mobile performance. No new 3D dependency just to imitate the orbit.

The result should eventually work with **deep links first** (coffee pages, /coffees/v60, roaster pages, Learn articles), not require an initial visit to /.

## 6. Design decisions still awaiting GT feedback

- Is this **one continuous environment** closer to the target than Phase 1B?
- Should content be more immersive/spatial, or does the content density now feel right?
- Is the right evidence plate useful enough at a glance on mobile, or should it expand by default after selecting a real coffee?
- Does the centre display the focused coffee’s actual visual identity (real bag, estate scene) in the finished application, rather than this neutral abstract placeholder?
- How much animation feels graceful rather than gimmicky?

**Next gate after critique:** mobile coffee detail and /coffees/v60 deep-link templates in the same scene language. Only afterward derive context-specific coffee cards, review evidence, connected-object, search, and navigation components. No need to rebuild the 14-section old homepage.
