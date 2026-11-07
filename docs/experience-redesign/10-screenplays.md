# 10 — Phase 1 Experience Screenplays

**Status:** Phase 1 draft for owner review. Nothing here is approved. No frontend implementation.
**Date:** 2026-11-07 · **Branch:** `design/experience-redesign` · **Author:** Claude Code
**Inputs:** [01](01-vision.md)–[08](08-delivery-plan.md), [current-state-audit.md](current-state-audit.md), [requirements-traceability.md](requirements-traceability.md), and the owner decisions of 2026-11-07 ([07](07-decisions.md)).

## 0. Brief and constraints

**Brief (07, 2026-11-07).** Write two substantially different creative implementations of the hospitality philosophy.
- **Concept A, "The Annotated Guide":** evolves the Coffee Field Guide identity.
- **Concept B, "House Lights":** free to reconsider typography, colour, materials, spatial depth, interaction and motion. It is the one fully spatial screenplay.

**Focus order.** Mobile deep-link landing first, homepage second, then the expert and returning paths.

**What a screenplay is here.** A timed sequence of beats with decision points. It shows what the visitor sees, what they do, what responds and why, and the URL and data behind each beat. It is not a visual design and not a video script.

**Guardrails (07).**
- No production rebrand.
- No framework migration.
- No changes to public URLs, SEO structures or coffee data.
- Technical discovery and direct filter access are retained.
- Mobile and reduced-motion versions are mandatory.
- No stacked sections and no moodboards.
- Engineering limits are recorded as trade-offs (§6), not used to veto ideas.

**Evidence rule.** Every coffee, count and relationship below is real. Each is tagged:
- **L**: live database, 2026-11-07.
- **K**: read in code.
- **S**: analytics snapshot.

Where a beat needs something that does not exist yet, it is marked **NEEDS** and listed in §7.

---

## 1. The cast: real ICB data used in every scene

| Element | Fact | Source |
|---|---|---|
| Entry page | `/coffees/v60`, a brew-method landing page. Filter `brew_method_ids: ["pour_over"]`, sort `rating_desc`. Existing intro copy: *"No brewer shows you an Indian coffee's terroir as plainly as the V60…"* | **K** `src/lib/discovery/landing-pages/brew-method-pages.ts:131,191-194` |
| Entry traffic | 61 GSC clicks and 3,785 impressions in 91 days. Landing pages are the #1 organic template; 66% of clicks are mobile. | **S** |
| Pool | 646 in-stock coffees list pour-over. Their top flavour families: Fruity 504 · Chocolatey/Cocoa 205 · Sweet 186 · Nutty 145 · Floral 131 · Caramelized 108 | **L** |
| Expert combination | pour-over + natural + light/light-medium = **62** in stock; + a Chikmagalur region name = **14** (own-region match; a rolled-up count would include sub-regions) | **L** |
| Hero coffee | **"Naturals Roasted Coffee Beans"**, Baarbara Coffee. `/roasters/baarbara-coffee/coffees/naturals` | **L** |
| | Natural, light roast, SLN 795. Notes: Mango, Dry Coconut (families Fruity, Nutty). Region Baba Budangiri. Estate Baarbara Estate. From ₹600; 250 g / 500 g / 1 kg / 5 kg. Brew: pour-over, AeroPress. Sensory source: roaster, confidence high. | **L** |
| Same-estate sibling | **"Baarbara Naturals"**, BrewClan Coffee Roasters. Natural, light-medium, SLN 795, Berry (Fresh) and Citrus. From ₹699. Sensory: acidity 4/5 and sweetness 3/5, **source `icb_inferred`, confidence medium** | **L** |
| Estate | Baarbara Estate (Chikmagalur): **119** public coffees, the largest of the **15** estates passing the ADR-013 gate | **L** |
| Region page | `/coffees/baba-budangiri` exists (region config) | **K** `region-pages.ts:127` |
| Articles | `/learn/indian-coffee-varieties-explained` ("…SLN-795, SLN-9, Chandragiri, and More", #2 organic page, 282 clicks); `/learn/understanding-indian-coffee-estates`; `/learn/baba-budangiri-coffee` | **S** |
| Sensory coverage | 1,573 in-stock coffees. acidity 812 · body 822 · sweetness 846 · bitterness 466 · clarity 493 (scale 0–5). Source: roaster 965 / ICB-inferred 608. | **L** |
| Flavour taxonomy | 344 nodes in 15 families (Fruity, Floral, Chocolatey/Cocoa, Nutty, Caramelized/Brown Sugar, Sweet, Spice, Earthy/Savory, Fermented/Funky, Roasted/Smoky, Herbal/Vegetal, Dairy and others) | **L** |
| Returning signals | Hero segments, recently viewed (`coffee_views`), wishlist, ratings | **K** audit §12 |

---

## 2. The shared contract (both concepts honour it)

These are the parts of hospitality that must not depend on art direction. They are what make either concept safe to prototype.

| # | Contract | Traces to |
|---|---|---|
| SC-1 | **The DOM is the experience; motion and 3D are performance on top of it.** Every beat below exists as server-rendered, indexable HTML at its URL, with the same h1, copy, links and JSON-LD as today. | IA-001, SEO-001…006 |
| SC-2 | **The "ask" is always within one action.** A persistent search-and-filters control. On mobile it is a bottom-anchored bar in the thumb zone; on desktop, a top bar. It shows the active constraints as chips. It never disappears behind an expressive scene. | UX-004, UX-006 |
| SC-3 | **Every result state is a URL using existing params** (`brewMethodIds`, `processes`, `roastLevels`, `regions`, `flavors`, …). Guidance and exploration produce the same shareable URLs as expert filtering. | UX-005, SEO-008 |
| SC-4 | **Every fact carries its provenance in one of three voices.** **Catalogue** = roaster-stated or ICB data. **ICB estimate** = `icb_inferred` sensory and computed similarity. **Editorial** = an ICB writer's suggestion. The two concepts render the voices differently; neither omits them. | UX-009, PERS-*, 02 |
| SC-5 | **Explicit choices are hard constraints; guidance only ranks.** A prompt answer becomes a visible, removable chip. Sensory data (52–54% coverage) ranks results but never filters out coffees that lack it. | PERS-001 |
| SC-6 | **Reduced motion and no-JS are complete experiences.** Every transition has an instant or crossfade equivalent. Every spatial scene has a composed static equivalent containing the same choices. | A11Y-001…004 |
| SC-7 | **The host steps aside for experts.** Once the visitor uses direct filters or search, expressive motion quiets. Experts are never made to watch. | 01, UX-013 |

### The "Guide me" model (shared logic, different embodiment)

At most three prompts. Each is optional, plain-language and individually skippable. Each answer becomes a chip. **The prompts can be answered in any order, or ignored entirely.**

| Prompt (draft copy) | Maps to (existing data) | URL today | Notes |
|---|---|---|---|
| "How will you brew it?" — Pour-over · Espresso/moka · French press/AeroPress · Filter (South Indian) · With milk | `brewMethodIds`, `worksWithMilk` | ✅ existing params | Skipped automatically when the visitor arrives on a brew landing page; the brewer is already known |
| "Bright and fruity, or round and comforting?" | Flavour families: Fruity/Floral vs Chocolatey/Caramelized/Nutty | ◐ `flavors` takes descriptor slugs, not families | **NEEDS** a family-level param (additive) or descriptor bundles |
| "Gentle or bold?" | Roast level (hard), plus `sensory_params.body`/`acidity` (rank only) | ◐ roast ✅; sensory has no param | **NEEDS** a sensory ranking input (additive) |

The **output** is real results, each with up to three "why" lines. Each line is tagged with its voice. For the hero coffee:
- "Brews on pour-over · *Catalogue (roaster)*"
- "Fruity: mango, dry coconut · *Catalogue (roaster)*"
- "Light roast · *Catalogue*"

For the BrewClan sibling, the acidity line reads "Bright: acidity 4 of 5 · *ICB estimate*".

---

## 3. Concept A — "The Annotated Guide"

### Thesis
The host is the **margin**. ICB already looks like a printed field guide. In A it *behaves* like one that a knowledgeable person has annotated just for you. Hospitality takes the form of marginalia: short handwritten-register notes appear beside what you are looking at. They:
- notice what you seem to want ("These lean fruity.");
- make introductions ("Same farm, another roaster.");
- go quiet when you are working.

The guide does not change pages; it **unfolds plates**. Detail opens like a fold-out, and related objects arrive as tipped-in leaves.

### What evolves, what is kept, what is dropped
- **Kept.** Cream ground, roasted-bean ink, Fraunces/DM Sans, the commissioned region plates, the flat paper surface vocabulary.
- **Evolved.**
  - **The brush-smear becomes functional.** It stops being decoration rationed to one phrase per page. It becomes the host's *mark of attention*: one smear that moves to underline whatever the host is currently pointing at (the active chip, the recommended thread). There is still exactly one on screen.
  - **A margin column on desktop** (a "notes" rail) and a **note strip on mobile**, docked above the ask bar.
  - **Fraunces optical sizes pushed to extremes:** a very large opsz for plate titles, a small opsz for marginalia.
- **Dropped.**
  - Stacked homepage sections.
  - Generic card grids, replaced by specimen lists with plate thumbnails.
  - The eyebrow kicker.

### Motion grammar (A)
| Motion | Purpose | Timing / easing | Reduced-motion substitute |
|---|---|---|---|
| **Unfold** (card → detail, shared element: image + name) | Explains that the detail page *is* this card, opened | 420 ms, `ease-out-expo` (existing Reveal curve) | Instant swap with 120 ms opacity |
| **Margin note arrives** | The host speaks | Note fades in 240 ms; the smear draws under the referenced phrase over 360 ms | Note appears; smear static |
| **In-place reorder** when a chip changes | Shows results *responding*, not reloading | 280 ms FLIP layout | Instant reorder; result count announced via `aria-live` |
| **Tipped-in leaf** (related object slides over its edge) | Introduces an adjacent object without leaving | 360 ms translate from the trailing edge | Opens as a standard sheet |

There is no 3D, no camera and no scroll-linked animation. All of A fits the existing `motion` package.

### Scene A1 — Mobile deep link: `/coffees/v60` (≈ 90 s, lead scene)

| t | Visitor sees / does | Host response (motion) | URL / data | Voice |
|---|---|---|---|---|
| 0 s | Lands from Google on a phone. The page reads as an opened plate: the existing h1 and the existing V60 intro paragraph, set large, with the brew-parameters strip as a diagram. The ask bar is docked at the bottom with the chip **Pour-over ✓** already in it. | None, so text is the LCP. The smear draws once under "terroir" after paint. | `/coffees/v60`, unchanged SSR, FAQ JSON-LD intact | — |
| 6 s | Scrolls. The teaser list begins: specimen rows, each with name, roaster, two flavour words and "from ₹". | The note strip appears above the ask bar: *"646 coffees in the guide brew well on a V60. Most of them lean fruity."* | Counts **L** | Catalogue |
| 15 s | **Decision D1.** Read on, open the ask bar, or answer the note. The note offers two quiet choices: *Brighter* · *Rounder*. | — | — | — |
| 18 s | Taps **Brighter**. | Chip **Fruity** joins the bar; the smear slides under it. The list reorders in place (FLIP). The note reads *"Brighter, then. Natural process tends to push this further."*, an introduction to a facet, not a command. | → `/coffees?brewMethodIds=pour_over&flavors=…` (existing params; **NEEDS** family param for an exact "Fruity"). The address change is a real navigation with shared-element continuity. | Editorial (the note), Catalogue (results) |
| 30 s | Taps **Natural** in the note. | Chip added; count updates: 62 coffees with light/light-medium roast (if the visitor also takes the "Gentle" chip) | `&processes=natural` | Catalogue |
| 38 s | Opens **"Naturals Roasted Coffee Beans"**, Baarbara Coffee. | **Unfold:** the row's image and name expand into the specimen sheet. | `/roasters/baarbara-coffee/coffees/naturals` (canonical detail) | — |
| 45 s | Reads the specimen sheet: Mango, Dry Coconut · Natural · Light · SLN 795 · Baba Budangiri · Baarbara Estate · from ₹600. **Buy from Baarbara Coffee** is visible without scrolling. | The margin sets three **threads** beside the sheet. Each has a relation verb and a voice: **Grown at** Baarbara Estate (*119 coffees in the guide come from here*, Catalogue). **Variety** SLN 795 (*The varieties, explained*, Editorial). **From** Baba Budangiri (Catalogue). | Relations **L**; the article match is **NEEDS** (editorial mapping or reverse lookup, audit §11) | 3 voices |
| 55 s | **Decision D2.** Buy (outbound), follow a thread, or go back. | — | — | — |
| 58 s | Taps **Grown at Baarbara Estate**. | **Tipped-in leaf:** the estate leaf slides over the sheet's edge. It leads with *"Same farm, other hands"*: BrewClan's **Baarbara Naturals** (Berry, Citrus, light-medium, from ₹699), labelled **"Bright: acidity 4/5 · ICB estimate"**. This is the "overheard conversation": the same estate interpreted by a different roaster. | `/estates/baarbara-estate` if `/estates` ships (OPEN); otherwise an inline leaf with no new URL | Catalogue + ICB estimate |
| 75 s | Taps the variety thread. | Leaf: the opening of the SLN 795 section of the varieties article, plus *"Read the full field note"*. | `/learn/indian-coffee-varieties-explained` | Editorial |
| 85 s | Presses Back twice. | Returns to the specimen sheet, then to the results with **Pour-over · Fruity · Natural** intact and scroll restored. | Requires push-history behaviour (**OPEN**, audit §19.6) | — |

**What hospitality means in A1:** it notices (fruity pool), offers (brighter or rounder), introduces (natural, same farm), and never blocks (the ask bar and Buy are always one tap away).

### Scene A2 — Homepage, newcomer (≈ 75 s)

| t | Visitor sees / does | Host response | URL / data |
|---|---|---|---|
| 0 s | **Arrival** is a single composed spread, not a stack. On the left (desktop) or top (mobile): one sentence in large Fraunces, for example *"Indian coffee, introduced properly."* On the right or below: a region plate (real commissioned art), the ask bar, and three plain invitations: **Find me a coffee** · **I know what I'm after** · **Show me something interesting**. | The plate settles 8 px over 600 ms after paint. Nothing else moves. | `/` (h1 and SSR preserved) |
| 5 s | **D1.** The visitor taps **Find me a coffee**. | The spread *turns* (a horizontal shared-axis slide, 360 ms) to the first prompt, *"How will you brew it?"*. The margin note says *"Three questions at most, and you can skip any."* | Prompt state is client-only; no URL until results |
| 15 s | Picks **Pour-over**, then **Bright and fruity**, then skips the third. | Each answer drops a chip into the ask bar; the smear follows the newest chip. | — |
| 30 s | Results arrive: 6–8 specimens, each with its why-lines and voice tags. | Results unfold from the chip bar downward. | `/coffees?brewMethodIds=pour_over&flavors=…` |
| 45 s | Opens the hero coffee, as in A1 (38–75 s). | Same grammar, so the newcomer learns it once. | — |
| 70 s | **D2.** Saves to wishlist (prompts sign-in), buys, or wanders a thread. | — | Existing wishlist flow |

**Expert / explore invitations.** *"I know what I'm after"* focuses the ask bar with its filters open (SC-7). *"Show me something interesting"* opens an **editorial spread**: one thread a week, drawn from real relations. Example: *"One estate, five roasters: Baarbara."*

### Scene A3 — Expert, 20 seconds
`⌘K` or the ask bar → type "natural" → **Natural** suggested as a filter, not just as a coffee name (**NEEDS** search-to-facet suggestions). Add **Pour-over**, **Light**, **Chikmagalur** from the bar. Results update in place: **14 coffees** (**L**). Open two coffees in turn; Back keeps the four chips. **Margin notes stay silent** once filters are typed directly (SC-7).

### Scene A4 — Returning
The arrival spread swaps its invitation line for recognition:
- *"Welcome back. You were looking at Naturals from Baarbara Coffee."* (existing `coffee_views`).
- One new thread: *"New this fortnight: 3 pour-over naturals."* (MV `created_at`; **NEEDS** a "since last visit" marker).
- The last filter set is offered as a chip group to resume (**NEEDS** last-context storage; consent-scoped, PERS-008).

### Mobile and reduced motion (A)
- **Mobile is the primary layout.** The margin becomes a single-line note strip above the ask bar. Threads become a horizontal rail under the specimen sheet. Leaves open as bottom sheets.
- **Reduced motion.** Unfold becomes an instant swap; the smear is pre-drawn; reorder is instant with an `aria-live` count.
- **No-JS.** Every leaf is its own linked page (estate, region, article), so nothing is lost.

---

## 4. Concept B — "House Lights"

### Thesis
The host is **light**. In an opera house, care is lighting design:
- the house dims when the performance needs your attention;
- a follow-spot finds the soloist;
- the house lights come up when you need to find your seat.

B makes ICB a **dark, warm, dimensional space** in which coffees and their relationships are physically arranged, and in which **lighting is the interaction model**. The host never speaks in a voice. It *lights* what matters, and it brings the house lights up the moment you want to work.

This is a metaphor for behaviour; there is no auditorium, curtain or seat imagery.

### Identity freedoms taken (exploration only)
- **Ground.** Deep roasted-black with warm undertone (not pure black). Paper is gone.
- **Materials.** Light, glass-like translucent planes ("scrims") and a fine particulate atmosphere.
- **Typography.** A high-contrast display serif or didone with theatrical scale, paired with a precise grotesk for data. Fraunces and DM Sans are **not** assumed. Typeface selection is a Phase 2 task.
- **Colour.** Colour comes from light temperature: warm key light (amber), cool rim light for *ICB estimate*, and white for *Catalogue*. Provenance becomes a lighting language (SC-4).
- **Dropped.** Brush-smear, paper layering, tonal-surface depth.
- **Light theme.** Required for parity (PRODUCT.md). In "house lights up" mode the stage reads as a bright, quiet hall, so the light theme *is* the utility mode.

### The space
- **Scene structure.** One persistent WebGL stage behind the DOM. The 646 pour-over coffees (or any current result set) are small lit forms, **clustered by flavour family** (real `canon_flavor_families`), with cluster sizes true to the data (Fruity 504, Chocolatey 205, …).
- **Relations as sightlines.** Relationships are **sightlines**: thin beams from a coffee to its estate, region, variety and articles, each beam coloured by voice.
- **Depth means something.** Distance from the viewer encodes *how directly a thing answers your request*. Hard-filter matches sit on the stage plane; guided-rank suggestions sit slightly behind; editorial adjacencies sit in the wings. Depth is never decoration.
- **Rejected-concept risk.** Clustering coffees by taste in a spatial field could be read as a revival of the rejected "Taste Observatory". The difference must be behavioural (lighting as host, house-lights utility mode, sightline relations), and its imagery must not be reused. **Owner to confirm the distinction at the Phase 1 gate.**

### Motion grammar (B)
| Motion | Purpose | Timing / easing | Reduced motion / fallback |
|---|---|---|---|
| **Follow-spot** (light moves to a cluster or coffee) | The host noticing and pointing | 700 ms, `cubic-bezier(0.22, 1, 0.36, 1)`; camera dolly ≤ 15% of scene depth | Static lit state per selection; crossfade 200 ms |
| **Step forward** (coffee → detail: its form moves to the stage plane and the DOM detail rises in front) | Opening without a context reset | 600 ms camera + 300 ms DOM rise | Instant page; static portrait image of the lit coffee |
| **Sightline draw** | Explains a relationship | Beam draws 400 ms; target brightens | Beams pre-drawn in a static composition; relations always listed in DOM |
| **House lights up** (utility mode) | The host steps aside | 250 ms global brighten; scene freezes; render loop stops | Default state under reduced motion and Save-Data |

- **Scroll** is native and never hijacked. The scene responds to *state* (selection), not to scroll position, except for a gentle parallax ≤ 4% on the arrival only.
- **Render loop.** It runs only during transitions and stops at rest (TECH-003).

### Scene B1 — Mobile deep link: `/coffees/v60` (≈ 90 s, lead scene)

| t | Visitor sees / does | Host response (light) | URL / data | Voice |
|---|---|---|---|---|
| 0 s | Lands on a phone. **DOM first:** the h1 and V60 intro in large display type on the dark ground, lit by a warm key light. The ask bar is docked with **Pour-over ✓**. The canvas has not loaded, and the LCP is text. | — | `/coffees/v60`, SSR unchanged | — |
| 2 s | (After LCP and idle; capable device; no Save-Data) the stage fades in as a **top band about 45% of the viewport**: 646 small forms in loose family clusters, the Fruity cluster visibly largest. | Soft follow-spot sweeps once across the clusters and rests. A caption in DOM reads *"646 coffees for a V60. The light is brightest where most of them are."* | **L** | Catalogue |
| 10 s | Scrolls. The band stays as a sticky header and compresses to about 25%; the specimen list scrolls beneath it. | List rows and their forms are linked: touching a row brightens its form. | — | — |
| 15 s | **D1.** Tap a cluster in the band, use the ask bar, or keep reading. | — | — | — |
| 18 s | Taps the **Fruity** cluster. | The follow-spot settles on Fruity and the other clusters dim (not hide). Chip **Fruity** joins the ask bar. The list re-ranks. | Same URL transition as A1 (**NEEDS** family param) | Catalogue |
| 30 s | Adds **Natural** from the bar. | Natural coffees step to the stage plane; the rest recede (depth = directness of match). | `&processes=natural` | Catalogue |
| 38 s | Opens **"Naturals Roasted Coffee Beans"**. | **Step forward:** its form moves to the stage plane as the DOM specimen rises over the band. | `/roasters/baarbara-coffee/coffees/naturals` | — |
| 45 s | Reads the detail. Buy is visible. | Three **sightlines** draw from the coffee into the wings: a white beam to **Baarbara Estate**, a white beam to **Baba Budangiri**, an amber beam to the **SLN 795 field note**. The beam colour is the voice. | Relations **L**; article **NEEDS** | 3 voices |
| 58 s | Taps the estate beam (or its DOM link). | The camera pans along the beam. The estate's other coffees light up in the wings; BrewClan's **Baarbara Naturals** stands closest, its acidity line rim-lit cool: **"Bright: acidity 4/5 · ICB estimate."** | `/estates/baarbara-estate` (OPEN) or inline | Catalogue + ICB estimate |
| 75 s | Taps the ask bar. | **House lights up.** The scene freezes and brightens; the full filter panel is foreground. | — | — |
| 85 s | Back, Back. | Returns through detail to results; the spot restores to Fruity + Natural. | Push history (**OPEN**) | — |

**What hospitality means in B1:** the space shows the *shape* of the choice before any words. Attention is directed by light rather than by copy, and the host withdraws instantly when asked.

### Scene B2 — Homepage, newcomer (≈ 75 s)
| t | Visitor sees / does | Host response | URL |
|---|---|---|---|
| 0 s | The house is dim. One line of display type is lit, e.g. *"Indian coffee, by the people who grow and roast it. Let us light the way to yours."* Copy carries no hard-coded counts; any figure shown must be read live (1,573 in stock today, **L**). Below it, the ask bar and three invitations. | The DOM is painted first; the stage fades in behind after idle. All in-stock coffees sit as a faint field, unclustered. | `/` |
| 6 s | **Find me a coffee.** | The field **resolves**: forms drift into family clusters (the first meaningful use of motion), 900 ms. The prompt *"How will you brew it?"* is lit centre stage. | — |
| 15 s | Pour-over → Bright and fruity → skip. | Each answer is a lighting change: the spot narrows; non-matching forms dim; matches step forward. Chips appear in the ask bar. | — |
| 30 s | Results: 6–8 coffees on the stage plane, with DOM cards and why-lines beneath. | — | `/coffees?…` |
| 45 s | Opens the hero coffee → as B1. | — | — |

**Other invitations.** *I know what I'm after* = house lights up with filters open. *Show me something interesting* = the spot finds one real sightline story, e.g. one estate lit across five roasters.

### Scene B3 — Expert, 20 seconds
Pressing `⌘K` or touching the ask bar brings the **house lights up** instantly and the scene stops rendering. The expert flow is identical to A3: four chips, **14 results**, open two, Back preserves. The stage returns only if the visitor dims the lights again (a toggle that is remembered per device).

### Scene B4 — Returning
The house is half-lit. Last-viewed coffees glow faintly in their positions, with *"Welcome back"* and the last filter set as resumable chips (**NEEDS** as in A4). A single new form, *"New: 3 pour-over naturals this fortnight"*, is placed in the spot.

### Mobile, reduced motion and low power (B)
- **Mobile.** The stage is a **band, never the full screen**. All interaction is duplicated in the DOM list (tap a row or tap a form). One-handed: the ask bar is at the bottom; the band is touch-pannable horizontally only.
- **Reduced motion, Save-Data, low GPU or WebGL failure.** **House lights up by default.**
  - The band is replaced by a **pre-rendered still** of the current lit state (server-generated per landing page, so it is cacheable).
  - Sightlines become a typed relation list.
  - Nothing in B is reachable *only* through the canvas (SC-1).
- **No-JS.** Equivalent to today's pages, restyled.

---

## 5. Requirement coverage by moment

| Requirement | A moment | B moment | Notes |
|---|---|---|---|
| UX-001 hospitality as behaviour | Margin notes, threads | Lighting, house lights | Both |
| UX-002 one choreographed system | Unfold / leaf grammar | One persistent stage | B is stronger; A depends on discipline |
| UX-003 cross paths without losing state | Chips persist across prompt → filter → detail | Same | SC-2, SC-3 |
| UX-004 instant facets | A3 | B3 | Unchanged engine (TECH-002) |
| UX-005 Back restores filters | A1 85 s | B1 85 s | Both **depend on the push-history decision** |
| UX-006 search everywhere | Ask bar | Ask bar plus house lights | |
| UX-008 progressive Guide me | A2 | B2 | Needs family and sensory params |
| UX-009 why plus provenance | Voice tags | Light-colour voices plus DOM tags | B must still render text tags (colour alone fails WCAG 1.4.1) |
| UX-010 detail opens with continuity | Unfold | Step forward | |
| UX-011 grounded adjacency | Threads | Sightlines | Article relation **NEEDS** IA-007 |
| UX-012 fast welcome | Text LCP, no intro | Text LCP; stage after idle | B risk: perceived "loading" if the stage is late |
| SEO-001…008 | Unchanged URLs, SSR, JSON-LD | Same; the canvas carries no essential content | SC-1 |
| SEO-011 mobile deep link first | A1 | B1 | |
| A11Y-002/004 | §3 mobile and reduced motion | §4 mobile, reduced motion and low power | |
| BRAND-001 | Evolves | Departs (exploration) | Per 07 |
| TECH-003/004 | No 3D | Stage after LCP, idle-only loop | See §6 |

---

## 6. Trade-offs (documented, not used to veto)

| Dimension | A — Annotated Guide | B — House Lights |
|---|---|---|
| **Hospitality expressed through** | Words: the host *says* what it notices | Space and light: the host *shows* |
| **Distinctiveness** | Medium-high. Feels like ICB, elevated. | High. Unlike any coffee site; closer to the FluxTheory ambition (01). |
| **Risk of the rejected-concept echo** | Low | Medium (spatial taste field vs "Taste Observatory"); needs owner check |
| **Copy dependency** | High. Notes must be excellent, varied and true; generated notes risk repetition and need templates grounded in data. | Medium. Light carries more and words carry less. |
| **Data dependency** | Relations, counts, sensory voices | Same, plus a layout must be computed per result set (clustering by family is cheap; positions are deterministic) |
| **Performance, mobile** | Within today's budget: origin LCP 2.2s; no new heavy assets | **The stage must load after LCP.** A R3F/Three.js bundle (≈150–250 KB gz, order-of-magnitude estimate) plus GPU work on mid-range Android. Mobile lab LCP is already 5–8s, so the stage must never be the LCP element. The pre-rendered still covers weak devices. |
| **Accessibility** | Straightforward | Every canvas interaction must have a DOM twin; colour-coded voices need text; motion sickness risk from the camera (dolly ≤ 15% and pan limits) |
| **Brand change** | Evolution: smear repurposed, paper kept | Full departure; needs an ADR before any adoption |
| **SEO** | Neutral | Neutral if SC-1 holds; the risk is someone moving content into the canvas later |
| **Build cost (prototype)** | Low-medium: `motion` + layout work | High: R3F scene, clustering layout, still-image pipeline, device gating |
| **What it risks in requirements** | UX-002 (could slide back into "nice pages with notes") | UX-012/TECH-004 (late stage), A11Y-004 (mobile band cramped) |

### Recommendation (confidence: medium)
**Take both into Phase 2 keyframes, but prototype them asymmetrically.**
- **A as the baseline experience** to storyboard fully, A1 → A4. It answers the most requirements at the least risk.
- **B's three distinctive behaviours** as the experimental layer to test in the browser:
  1. **House lights up** for experts.
  2. **Step forward** as the detail transition.
  3. **Sightlines** as typed relations.
- The full-stage cluster field is the riskiest part of B and the one that most needs a real-device test before more design investment.

**Unknowns that could change this.**
- Whether real users read B's light as guidance or as decoration. This needs a prototype, not opinion.
- Whether A's margin voice can be written well at scale.
- Mid-range Android performance for B's stage.

---

## 7. NEEDS: what the screenplays assume that does not exist yet

None of these are requested for implementation now. Each is additive. **None changes an existing public URL.**

| # | Need | Used in | Type | Status |
|---|---|---|---|---|
| N1 | Flavour-**family** filter param (or descriptor bundles) | Guide me, A1/B1 18 s | Query param + filter logic | PROPOSED |
| N2 | Sensory **ranking** input (body, acidity), rank-only | Guide me "Gentle or bold" | Query param + sort logic | PROPOSED |
| N3 | Push-history on facet changes | Back beats (A1/B1 85 s) | Behaviour | OPEN (audit §19.6) |
| N4 | `/estates/<slug>` pages (15 qualify) | Estate thread / beam | Planned route (ADR-013) | OPEN (ship timing) |
| N5 | Coffee → article relation (reverse lookup of embeds, or curated mapping) | Variety thread, SLN 795 note | Data / GROQ | OPEN (IA-007) |
| N6 | Search suggesting facets ("natural" → Natural filter) | A3/B3 | Search behaviour | PROPOSED |
| N7 | Last-context storage and "since last visit" marker (consent-scoped) | A4/B4 | Client storage | OPEN (PERS-008) |
| N8 | Pre-rendered still per landing state (B fallback) | B mobile and reduced motion | Build asset | PROPOSED (B only) |
| N9 | Search, filter and prompt analytics events | Validating everything above | Instrumentation | PROPOSED (TECH-007) |

---

## 8. Phase 1 gate: what the owner decides

Per 08, the gate is **which behaviour is worth prototyping**, not which looks nicest.

1. **Concepts into Phase 2.** Both A and B as written; A as baseline plus B's three behaviours (the recommendation); or another split?
2. **The B distinction.** Is "House Lights" sufficiently distinct from the rejected Taste Observatory, or should the cluster field be replaced with another spatial organiser (e.g. origin geography, which risks Contour Atlas instead)?
3. **Guide me needs N1 and N2.** Are additive query params acceptable in a later implementation phase? Without them, guidance can only use brew method, roast and descriptor-level flavours.
4. **N3 push history.** It is now load-bearing in both screenplays' Back beats.
5. **Penpot access for Phase 2.** No Penpot MCP connector is available in this Claude Code session. Phase 2 (06) needs either a connected Penpot MCP here or Codex to own the Penpot work from this document.

Still open from Phase 0 and not blocking: `/estates` timing, editorial adjacency mechanism, variety as an object, `AGENTS.md` pointer, instrumentation (07).
