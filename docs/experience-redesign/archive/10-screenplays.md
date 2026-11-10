# 10 — Phase 1 Experience Screenplays (revision 2)

**Status:** Phase 1, revision 2, for design review. Nothing here is approved. No production implementation.
**Date:** 2026-11-07 · **Branch:** `design/experience-redesign` · **Author:** Claude Code
**Inputs:** [01](01-vision.md)–[08](08-delivery-plan.md), [current-state-audit.md](../current-state-audit.md), [requirements-traceability.md](../requirements-traceability.md), and the owner decisions in [07](../07-decisions.md).
**Next:** [11-penpot-handoff.md](11-penpot-handoff.md), the self-contained brief for Codex.

### Revision 2 changes (owner review, 2026-11-07)

**Concept A** is accepted for Penpot exploration. It is not yet the winning direction.

**Concept B** is revised and renamed from "House Lights" to **"Sightline"**:
- The 646 floating coffee objects and the flavour-cluster field are **removed**; they resembled the rejected Taste Observatory.
- B is now **one continuous spatial composition along a single depth axis**. It evolves from selection → coffee → characteristics → estate → stories.
- There is no theatre or opera-house environment. Hospitality stays behavioural, expressed through light and depth.

**Both concepts now include:**
- A **serendipity moment** grounded in real catalogue relations (§2.3).
- Resolved **filter vs preference semantics**, including coffees with **multiple flavour families** (§2.2).

**Ambition.** A gains layout recomposition and a drawn annotation line, so both concepts carry equal ambition. The recommendation no longer weighs implementation ease (§6).

## 0. Brief and constraints

Two creative implementations of the hospitality philosophy (07): **A, "The Annotated Guide"** evolves the Coffee Field Guide; **B, "Sightline"** is free to reconsider typography, colour, materials, spatial depth, interaction and motion.

**Focus order.** Mobile deep-link landing first, homepage second, then the expert and returning paths.

**Guardrails.**
- No production rebrand.
- No framework migration.
- No changes to public URLs, SEO structures or coffee data.
- Direct expert controls retained.
- Real data only.
- Accessible HTML.
- Mobile and reduced-motion versions are mandatory.
- No stacked sections or moodboards.
- Engineering limits are recorded as trade-offs, never as vetoes.

**Evidence tags.**
- **L**: live database, read-only, 2026-11-07.
- **K**: read in code.
- **S**: analytics snapshot from `../icb-claude`.

Assumptions that need something not yet built are marked **NEEDS** (§7).

---

## 1. The cast: real ICB data

| Element | Fact | Source |
|---|---|---|
| Entry page | `/coffees/v60`, a brew-method landing page. Filter `brew_method_ids: ["pour_over"]`, sort `rating_desc`. Existing intro copy: *"No brewer shows you an Indian coffee's terroir as plainly as the V60…"* | **K** `src/lib/discovery/landing-pages/brew-method-pages.ts:131,191-194` |
| Entry traffic | 61 GSC clicks and 3,785 impressions in 91 days. Landing pages are the #1 organic template; 66% of clicks are mobile. | **S** |
| Pool | 646 in-stock coffees list pour-over. Of those, Fruity 504 · Chocolatey/Cocoa 205 · Sweet 186 · Nutty 145 · Floral 131 · Caramelized 108 (a coffee can count in several) | **L** |
| Expert combination | pour-over + natural + light/light-medium = **62**; + Chikmagalur region name = **14** (own-region match) | **L** |
| **Hero coffee** | **"Naturals Roasted Coffee Beans"**, Baarbara Coffee. `/roasters/baarbara-coffee/coffees/naturals` | **L** |
| | Natural · light · SLN 795. Notes: **Mango** (family Fruity › Tropical) and **Dry Coconut** (Nutty › Indian), i.e. **two families**. Region Baba Budangiri. Estate Baarbara Estate. From ₹600; 250 g / 500 g / 1 kg / 5 kg. Brews: pour-over, AeroPress. Sensory source: roaster, confidence high. Has image. | **L** |
| **Estate** | **Baarbara Estate**, Chikmagalur. *"cultivated for over 120 years … now run by the third generation of the Indavara family, owners of MG Plantations. Selection 795 Arabica is shade-grown on the high hills of the Western Ghats … UTZ and Rainforest Alliance … also produces black pepper."* Signature profile: *"Moderately bright, balanced and complex — chocolate and caramel notes with mandarin and spicy undertones."* No altitude recorded. **No estate photography exists (0 of 186 estates).** | **L** `canon_estates` |
| Estate in the catalogue | **111** in-stock coffees from **23 roasters**. Processes: washed 18 · natural 7 · honey 5 · experimental 34 · other 34 · monsooned 2 · double-fermented 2 · washed-natural 5 · pulped-natural 1. Species: arabica 82 · blends 12 · robusta 2 · arabica–robusta blends 10 · chicory 4. | **L** |
| Same-estate sibling | **"Baarbara Naturals"**, BrewClan Coffee Roasters. Natural · light-medium · SLN 795 · Berry (Fresh), Citrus · from ₹699. Acidity 4/5 and sweetness 3/5, **source `icb_inferred`, confidence medium**. Has image. | **L** |
| **Serendipity coffee** | **"Ratnagiri Estate – Robusta Mosto Naturals"**, Naivo Coffee. `/roasters/naivo-coffee/coffees/ratnagiri-estate-robusta-mosto-naturals`. **Robusta** · anaerobic · medium · Baba Budangiri · Ratnagiri Estate. Notes: Cream, Dried Fruit, Jackfruit, **Mango**, Nutmeg. From ₹670. Has image. | **L** |
| Region art | Commissioned region plates exist for Baba Budangiri, Chikmagalur, Sakleshpur (12 India regions in total). No terroir photos. | **L** `canon_regions.logo_url` |
| Region page | `/coffees/baba-budangiri` | **K** `region-pages.ts:127` |
| Articles | `/learn/indian-coffee-varieties-explained` (SLN-795, #2 organic page); `/learn/understanding-indian-coffee-estates`; `/learn/baba-budangiri-coffee` | **S** |
| Flavour taxonomy | 344 nodes in 15 families | **L** |
| Family multiplicity | Of 1,573 in-stock coffees: no notes 204 (13%) · 1 family 229 · 2 families 454 · 3 families 428 · 4+ families 258. **85% of coffees with notes span 2 or more families.** Fruity-any 980 · Fruity-only 145 · Fruity and Chocolatey 341. | **L** |
| Sensory coverage | acidity 812 · body 822 · sweetness 846 · bitterness 466 · clarity 493 of 1,573 (scale 0–5). Source: roaster 965 / ICB-inferred 608. | **L** |

---

## 2. Shared foundations (both concepts)

### 2.1 Contract
| # | Contract | Traces to |
|---|---|---|
| SC-1 | **The DOM is the experience.** Every beat exists as server-rendered, indexable HTML at its URL with today's h1, copy, links and JSON-LD. Motion, depth and light are layered on top. | IA-001, SEO-001…006 |
| SC-2 | **The ask is always one action away.** A persistent search-and-filters control: bottom-anchored on mobile, top on desktop. It shows **filter** and **preference** chips (§2.2). | UX-004, UX-006 |
| SC-3 | **Every result state is a URL.** Filters use existing params. Preferences need one additive param (N2). | UX-005, SEO-008 |
| SC-4 | **Three provenance voices, always as text.** *Catalogue* (roaster-stated or ICB data), *ICB estimate* (`icb_inferred` sensory, computed similarity), *Editorial* (an ICB writer's suggestion). Colour or depth may reinforce a voice but never replaces its text label (WCAG 1.4.1). | UX-009, 02, 04 |
| SC-5 | **The host steps aside.** Typing in search or touching a filter puts the experience in **control mode**: expressive motion stops and the layout becomes direct and dense. | 01, UX-013 |
| SC-6 | **Reduced motion and no-JS are complete experiences.** The same choices and relations, with no camera, no scroll-linked effects and crossfades at most. | A11Y-001…004 |

### 2.2 Filters, preferences and multiple flavour families (resolved)

**Two kinds of constraint, visibly different.**

| | **Filter** (hard) | **Preference** (soft) |
|---|---|---|
| Meaning | "Only show me coffees that…" | "Show me first the coffees that…" |
| Effect | **Excludes** non-matching coffees | **Re-orders**; never excludes |
| Chip | Solid, e.g. **Pour-over** | Outlined, prefixed, e.g. *prefer* **Fruity** |
| Combination | AND across facets, OR within a facet (today's engine) | Additive score; ties fall back to the chosen sort |
| Created by | Expert controls; landing-page pre-filter; Guide answers that are **factual compatibility** (brew method, milk, decaf, price) | Guide answers about **taste** (flavour direction, gentle/bold) |
| Conversion | — | One tap, "Only fruity", turns a preference into a filter |

**Why taste is a preference by default.**
- 85% of coffees with notes span two or more families, so "Fruity" as a hard filter would keep 980 coffees, 341 of them also chocolatey. A newcomer who said "fruity" would not recognise that set.
- 13% of coffees have no notes, and sensory data covers only about 52%. A hard taste filter would silently drop coffees for missing data rather than for taste, which breaks PERS-001's spirit.

**Family membership (for filters).** A coffee *has* a family if **any** of its descriptors belongs to it. The hero coffee is in Fruity *and* Nutty. An expert "Fruity" filter keeps it.

**Preference score (explainable, deterministic, no ML).**

```
taste_share   = (# of the coffee's descriptors in preferred families) / (# of its descriptors)
                → hero: Mango is Fruity, Dry Coconut is not → 1/2 = 0.5
sensory_fit   = closeness of acidity/body to the preference (only if the value exists)
                → ICB-inferred values count, but their why-line says "ICB estimate"
roast_fit     = 1 if the roast is in the preferred band, else 0
score         = 0.6·taste_share + 0.25·sensory_fit + 0.15·roast_fit
                (missing parts are left out and the weights re-normalised; no penalty for missing data)
```

The weights are placeholders for the prototype; tune them with users.

**Coffees with no notes** stay in the results. They rank on whatever they have and carry the line *"No tasting notes listed by the roaster."*

**Displaying multiple families.** Every result shows its **flavour signature**: each note with its family, e.g. `Mango · Fruity` `Dry Coconut · Nutty`. The why-line states the share honestly: *"1 of 2 notes fruity."* Neither concept ever paints a coffee as belonging to one family.

**Guide prompts (at most three, any order, each skippable).**

| Prompt (draft copy) | Creates | Maps to | URL |
|---|---|---|---|
| "How will you brew it?" | **Filter** | `brewMethodIds`, `worksWithMilk` | ✅ existing |
| "Bright and fruity, or round and comforting?" | **Preference** (*prefer* Fruity+Floral, or Chocolatey+Caramelized+Nutty) | Families via `canon_flavor_families` | **NEEDS** N2 |
| "Gentle or bold?" | **Preference** (roast band plus body/acidity) | `roast_level`, `sensory_params` | **NEEDS** N2 |

On a brew landing page the first prompt is already answered by the page's filter.

### 2.3 Serendipity (shared rule, different staging)

**Rule.** At most **one** serendipitous introduction per journey. It is a coffee that:
1. **shares at least two catalogue relations with what the visitor is engaging with right now.** The relations are chosen from: a flavour descriptor they have dwelt on or preferred, the region, the variety, the estate;
2. **and differs on one attribute the visitor probably assumes is fixed**: species, process, roast band or price tier.

It is labelled *Catalogue*, states both reasons and the difference in one sentence, is dismissible, and never appears in a carousel. If nothing qualifies, nothing is shown. Silence is better than filler. **Computable today** from the MV with a read-only query (N10).

**The scripted instance (L).** From the hero coffee:
- **Shares** the descriptor **Mango** and the region **Baba Budangiri**.
- **Differs** in species: **Robusta** (and process, anaerobic). That is a genuine surprise for anyone who assumes Robusta cannot taste of fruit.

> *"Also from the Baba Budangiri hills, also tasting of mango, and it's a Robusta."*
> → **Ratnagiri Estate – Robusta Mosto Naturals**, Naivo Coffee · anaerobic · medium · Cream, Dried Fruit, Jackfruit, Mango, Nutmeg · from ₹670

The copy makes no quality claim about Robusta; it states only facts.

---

## 3. Concept A — "The Annotated Guide"

### Thesis
The host is **the margin and the hand that composes the page**. In A the field guide *behaves* like one annotated for you:
- notes in the margin notice and introduce;
- a single drawn line connects things the host wants you to see together;
- **the page recomposes itself around your intent**, the way a good editor re-lays a spread when the story changes.

Detail pages *unfold* as plates; related objects are *tipped-in leaves*.

### Identity
- **Kept.** Cream ground, roasted-bean ink, Fraunces/DM Sans, the commissioned region plates, the flat paper vocabulary.
- **Evolved.**
  - **The brush-smear becomes the host's single mark of attention.** One smear moves to whatever the host is pointing at: the active chip, the recommended thread.
  - **A drawn annotation line.** A fine ink leader line connects two things across the layout, e.g. a note to a coffee, or a coffee to its serendipitous counterpart.
  - **Fraunces optical sizes pushed to extremes** (plate titles vs marginalia).
  - **Layout families chosen by state**, never a fixed grid:
    - **Index** (many results): dense specimen list.
    - **Spread** (5–15): editorial two-column with one featured plate.
    - **Plate** (1 match, or a detail page): full-bleed specimen.
- **Dropped.** Stacked sections, generic card grids, the eyebrow kicker.

### Motion grammar (A)
| Motion | Purpose | Timing / easing | Reduced motion |
|---|---|---|---|
| **Recompose** (layout family changes as the result count or intent changes; shared elements keep identity) | The guide re-lays itself for you | 480 ms FLIP, `cubic-bezier(0.16,1,0.3,1)` | Instant layout; `aria-live` announces the count |
| **Unfold** (row → plate) | The detail *is* this item, opened | 420 ms, same curve | Instant swap, 120 ms opacity |
| **Margin note** + **smear draw** | The host speaks and points | 240 ms fade; smear 360 ms | Note appears; smear pre-drawn |
| **Leader line draw** | The host connects two things | 500 ms stroke draw from note to target | Line pre-drawn |
| **Tipped-in leaf** | Introduces an adjacent object | 360 ms from the trailing edge | Standard sheet / page |

### Scene A1 — Mobile deep link `/coffees/v60` (≈ 100 s, lead)

| t | Visitor | Host response | URL / data | Voice |
|---|---|---|---|---|
| 0 s | Lands from Google on a phone. **Plate** layout: the existing h1 and V60 intro set large, with the brew-parameter strip as a diagram. The ask bar is docked with the filter chip **Pour-over**. | None until after paint, so text is the LCP. Then the smear draws under "terroir". | `/coffees/v60` SSR unchanged | — |
| 6 s | Scrolls into the specimen **index**: each row shows name, roaster, flavour signature and "from ₹". | The note strip appears: *"646 coffees here brew well on a V60. Most have at least one fruity note."* | **L** | Catalogue |
| 15 s | **D1.** Read on, open the ask bar, or answer the note: *Brighter* · *Rounder*. | — | — | — |
| 18 s | Taps **Brighter**. | *prefer* **Fruity** (outlined) joins the bar and the smear slides under it. Nothing disappears: the list **re-orders**, and each row gains a why-line (*"2 of 3 notes fruity"*). The note reads: *"Nothing's hidden, just re-ordered. Tap 'Only fruity' to narrow."* | → `/coffees?brewMethodIds=pour_over&prefer=fruity` (**NEEDS** N2) | Catalogue |
| 28 s | Taps **Natural** in the note. | Filter chip **Natural** (solid). The count falls (the 62 figure applies once a light/light-medium filter is added). The layout **recomposes** from index to **spread**. | `&processes=natural` | Catalogue |
| 38 s | Opens the hero coffee. | **Unfold** into the specimen **plate**. | `/roasters/baarbara-coffee/coffees/naturals` | — |
| 45 s | Reads the plate: `Mango · Fruity`, `Dry Coconut · Nutty` · Natural · Light · SLN 795 · Baba Budangiri · Baarbara Estate · from ₹600. **Buy from Baarbara Coffee** is visible without scrolling. | Margin threads, each with a relation verb and voice: **Grown at** Baarbara Estate (Catalogue) · **Variety** SLN 795 (*the varieties, explained*, Editorial) · **From** Baba Budangiri (Catalogue). | Relations **L**; article match **NEEDS** N5 | 3 voices |
| 58 s | Taps **Grown at Baarbara Estate**. | **Tipped-in leaf.** The Baba Budangiri **region plate** (real art; no estate photo exists) sits beside the estate's facts, quoted from the record: 120 years, third-generation Indavara family, S795 shade-grown, pepper, UTZ and Rainforest Alliance. *"111 coffees from 23 roasters come from here."* Under *"Same farm, other hands"*: BrewClan's **Baarbara Naturals**, with acidity 4/5 labelled **ICB estimate**. | `/estates/baarbara-estate` if shipped (OPEN), else inline leaf | Catalogue + ICB estimate |
| 72 s | **Serendipity.** | A margin note marked **"An aside"** appears. A **leader line draws** from the word *Mango* on the plate, across the margin, to a small tipped-in specimen: *"Also from the Baba Budangiri hills, also tasting of mango, and it's a Robusta."* **Ratnagiri Estate – Robusta Mosto Naturals**, Naivo · anaerobic · from ₹670. A small *"Not now"* dismisses it. | Rule §2.3; N10 | Catalogue |
| 80 s | **D2.** Opens the Robusta, follows the variety thread, buys, or goes back. | Opening the Robusta unfolds it as a plate; the leader line stays anchored to its *Mango* note. | Robusta detail URL | — |
| 95 s | Back, Back, Back. | The plates fold back; the results return with **Pour-over · Natural** and *prefer* **Fruity** intact, scroll restored. | **NEEDS** N3 (push history) | — |

### Scene A2 — Homepage, newcomer (≈ 80 s)
| t | Visitor | Host response | URL |
|---|---|---|---|
| 0 s | **Arrival is one composed plate**, not a stack: one sentence in large Fraunces, a real region plate, the ask bar, and three invitations: **Find me a coffee** · **I know what I'm after** · **Show me something interesting**. | The plate settles 8 px over 600 ms. | `/` |
| 5 s | **Find me a coffee.** | **Recompose:** the plate gives way to the first prompt. Margin: *"Three questions at most; skip any."* | — |
| 15 s | Pour-over (filter) → Bright and fruity (preference) → skip. | Each answer drops a chip: solid for filters, outlined for preferences. | — |
| 30 s | Results as a **spread**, each with flavour signature and why-lines. | Recompose from prompt to spread. | `/coffees?brewMethodIds=pour_over&prefer=fruity` |
| 45 s | Opens the hero coffee → A1 from 38 s, including the serendipity aside. | — | — |

***Show me something interesting*** opens a single editorial spread built from real relations. Example: *"One estate, twenty-three roasters: Baarbara."* It lists the 111 coffees grouped by process (washed 18 … monsooned 2), with the leader line connecting two coffees from the estate that differ in process. The pair is chosen by query at design time; not verified here.

### Scene A3 — Expert, 20 s
`⌘K` or the ask bar → type "natural" → **Natural** offered as a filter (N6). Add **Pour-over**, **Light**, **Chikmagalur** → **14** results, **index** layout. Open two; Back keeps the chips. **Control mode:** no notes, no smear motion, no serendipity.

### Scene A4 — Returning
The arrival plate offers recognition:
- *"Welcome back. You were reading Naturals from Baarbara Coffee."* (`coffee_views`).
- Last chips, resumable (N7).
- One new thread: *"New this fortnight: pour-over naturals."* (MV `created_at` + N7).

### Mobile and reduced motion (A)
- **Mobile first.** The margin is a one-line note strip above the ask bar. The leader line runs vertically from the note strip to the target. Leaves are bottom sheets.
- **Reduced motion.** Recompose, unfold and line draws become instant, with `aria-live` counts.
- **No-JS.** Every leaf is a linked page.

---

## 4. Concept B — "Sightline"

### Thesis
The host is **light and depth along one line of sight**.
- The whole journey is **a single continuous composition on one depth axis**. Each meaningful step (a coffee, its character, its estate, its stories) arrives as a translucent plane in front, while the previous planes recede behind it. **They stay visible and softly lit: the space itself remembers where you have been.**
- **Light is the attentive host.** It pools on what matters now, drifts with your reading, finds an aside at the edge of view, and **comes up flat and bright the moment you take control.**
- **Depth carries meaning, never decoration:**
  - **Journey depth:** further back means earlier in your path.
  - **Certainty depth:** within a plane, *Catalogue* facts sit nearest, and *ICB estimates* sit slightly recessed with a cool rim light.

There is no room, stage, curtain, café or architecture: only planes, light and type.

### Identity freedoms (exploration)
- **Ground.** A deep, warm, near-black atmosphere (dark) and a quiet, luminous bone white (light theme = control mode). Paper is gone.
- **Materials.** Translucent planes with soft edges and a fine atmospheric haze. Light has temperature: warm key on the current focus, cool rim on estimates, amber on editorial.
- **Typography.** A high-contrast display face at large scale, paired with a precise grotesk for data. Faces are chosen in Penpot; Fraunces and DM Sans are not assumed.
- **Dropped.** Brush-smear, paper layering, tonal-surface depth.
- **Removed (rev 2).** No field of coffee objects and no flavour-cluster visualisation. Coffees appear only as their **real product image** on their own plane, or as **DOM rows**.

### Motion grammar (B)
| Motion | Purpose | Timing / easing | Reduced motion |
|---|---|---|---|
| **Step in** (the new plane arrives in front; the previous one recedes by one depth unit and dims to about 35%) | Moving deeper into one thing without a context reset | 650 ms, `cubic-bezier(0.22,1,0.36,1)`; camera travel ≤ 1 depth unit | Crossfade 200 ms; the trail updates as text |
| **Step back** (Back) | History is depth, so Back literally retreats | 500 ms reverse | Crossfade |
| **Reading light** (the key light follows the reading position within a plane) | The host attends to what you are reading | Scroll-linked light only; **the camera never scroll-hijacks** | Static light on the plane's primary fact |
| **Spill light** (an off-axis glow reveals an aside at the edge of view) | Serendipity: something across the room catches your eye | Light rises over 900 ms; the aside plane slides 12% into view | Aside appears as a labelled inline card |
| **Bend** (taking the aside turns the line of sight about 15°; the original path stays visible to the side) | A branch, not a reset | 700 ms | Crossfade; the trail shows the branch |
| **Lights up** (control mode: all planes flatten into one bright, dense 2D layout; the render loop stops) | The host steps aside | 250 ms | Default state under reduced motion and Save-Data |

### The trail
A thin **spatial breadcrumb** of the receding planes, e.g. `V60 · prefer Fruity › Naturals › Baarbara Estate`. On mobile it sits as a compact band at the top. **It is real, focusable HTML** and doubles as the visible breadcrumb that coffee and estate pages lack today (IA-009). Tapping any segment steps back to it.

### Scene B1 — Mobile deep link `/coffees/v60` (≈ 100 s, lead)

| t | Visitor | Host response (light and depth) | URL / data | Voice |
|---|---|---|---|---|
| 0 s | Lands on a phone. **DOM first:** the h1 and V60 intro in large display type on the warm-dark ground, the brew-parameter strip, and the ask bar with filter **Pour-over**. | Text is the LCP. After paint a warm key light pools on the intro's first line. Behind the page plane, one empty plane is faintly visible: depth is promised but not yet used. | `/coffees/v60` SSR unchanged | — |
| 6 s | Scrolls into results: **DOM rows** with product image, name, roaster, flavour signature, "from ₹". | **Reading light** drifts down with the scroll position. | **L** | Catalogue |
| 15 s | **D1.** A lit line between rows asks *Brighter or rounder?*; or the visitor uses the ask bar or keeps reading. | — | — | — |
| 18 s | **Brighter.** | *prefer* **Fruity** (outlined) joins the bar. Rows re-order (nothing disappears) with why-lines ("1 of 2 notes fruity"). The key light settles on the top three rows: the host's suggestion, also stated in text. | `…&prefer=fruity` (N2) | Catalogue |
| 28 s | Adds filter **Natural** from the bar. | Momentary **lights up** while the ask bar is open, then the light returns to the results. | `&processes=natural` | Catalogue |
| 38 s | Opens the hero coffee. | **Step in.** The coffee plane arrives in front: product image, name, roaster, price, **Buy** (nearest layer). The results plane recedes behind it, dim but visible. Trail: `V60 · prefer Fruity › Naturals`. | `/roasters/baarbara-coffee/coffees/naturals` | — |
| 46 s | Scrolls through the **characteristics**. | Within the plane, **certainty depth**: `Mango · Fruity` and `Dry Coconut · Nutty`, Natural, Light, SLN 795 sit on the near layer. Any ICB estimate would sit recessed with a cool rim and its text label. **Reading light** follows each fact as it is read. | **L** | Catalogue |
| 58 s | Taps **Grown at Baarbara Estate** (a lit relation, also a DOM link). | **Step in** along the same axis. The estate plane leads with the **Baba Budangiri region plate**, lit across its surface (real art; no estate photo exists). The estate record's facts follow as type: 120 years · third-generation Indavara family · S795 shade-grown · pepper · UTZ and Rainforest Alliance · *"111 coffees from 23 roasters."* Under *"Same farm, other hands"*: BrewClan's **Baarbara Naturals**, its acidity 4/5 recessed with a cool rim, labelled **ICB estimate**. Trail grows: `… › Baarbara Estate`. | `/estates/baarbara-estate` (OPEN) or inline | Catalogue + ICB estimate |
| 72 s | **Serendipity.** | **Spill light** rises at the right edge of view. A narrow plane slides 12% into frame, lit warm from the side: *"Also from the Baba Budangiri hills, also tasting of mango, and it's a Robusta."* | Rule §2.3; N10 | Catalogue |
| 78 s | Taps the aside. | **Bend:** the line of sight turns about 15° and **Ratnagiri Estate – Robusta Mosto Naturals** (Naivo · anaerobic · medium · Cream, Dried Fruit, Jackfruit, **Mango**, Nutmeg · from ₹670) steps in. The original path stays visible to the left. Trail: `… › Baarbara Estate ⤷ Ratnagiri Robusta`. | Robusta detail URL | Catalogue |
| 88 s | Scrolls to the end of the plane: **stories.** | The deepest layer of the current plane carries **Editorial** stories, lit amber: *Baba Budangiri* (`/learn/baba-budangiri-coffee`) and *Indian coffee varieties explained*. | **NEEDS** N5 | Editorial |
| 95 s | Touches the ask bar. | **Lights up:** the planes flatten into one bright list-and-filter layout. All chips are intact. | — | — |
| 100 s | Back, Back. | **Step back** twice along the bent path, with the light following. | N3 | — |

### Scene B2 — Homepage, newcomer (≈ 80 s)
| t | Visitor | Host response | URL |
|---|---|---|---|
| 0 s | One plane: a single lit sentence, the ask bar, three invitations. Far behind, faintly lit, the first plane of this fortnight's real story (e.g. Baarbara: *one estate, twenty-three roasters*). | Text LCP; the light rises after paint. | `/` |
| 6 s | **Find me a coffee.** | Step in to the first prompt plane. Each prompt is one shallow plane; answers become chips. | — |
| 30 s | Results plane: DOM rows with why-lines. | The key light rests on the top suggestions. | `/coffees?…` |
| 40 s | Opens the hero coffee → B1 from 38 s, including the spill-light aside. | — | — |

***Show me something interesting*** steps straight into the faint story plane that was visible from arrival. The space has been hinting at it all along.

### Scene B3 — Expert, 20 s
`⌘K` or the ask bar → **lights up** instantly; the render loop stops. Same flow as A3: four filter chips, **14** results, open two, Back keeps them. Opening a coffee from control mode shows its plane **flat** (no step-in) until the visitor leaves control mode. A remembered per-device toggle keeps control mode permanently.

### Scene B4 — Returning
The arrival plane shows the **previous trail**, faintly lit behind it, e.g. `V60 · prefer Fruity › Naturals › Baarbara Estate`. *"Pick up where you left off"* steps back into the last plane (N7).

### How B is built (hypothesis, for Phase 3; recorded so Penpot designs stay feasible)
- **Tier 1, every device.** Planes are **real DOM layers** using CSS 3D transforms (`perspective`, `translateZ`), opacity and blur; light is CSS gradients and masks. Fully accessible, indexable and keyboard-navigable. It may be enough on its own.
- **Tier 2, capable devices, after LCP and idle.** A WebGL layer (R3F or plain three.js) adds volumetric light, haze and soft shadows **behind** the DOM planes. Never content.
- **Gating.** `prefers-reduced-motion`, Save-Data, `deviceMemory`, and a frame-time probe all fall back to Tier 1 or to control mode.

### Mobile, reduced motion and low power (B)
- **Mobile.**
  - One plane fills the viewport; the receding planes show as a stacked edge at the top, behind the trail.
  - Asides slide in from the right edge.
  - The ask bar sits at the bottom.
  - No horizontal camera pans beyond the 15° bend.
- **Reduced motion.** No camera or scroll-linked light. Planes crossfade, the trail updates, and asides are inline labelled cards.
- **No-JS.** Pages as today, with the trail rendered server-side from the referrer path or omitted.

---

## 5. Requirement coverage by moment

| Requirement | A | B |
|---|---|---|
| UX-001 hospitality as behaviour | Margin voice, drawn line, recomposition | Light that attends, depth that remembers, lights-up |
| UX-002 one choreographed system | Recompose/unfold grammar across all layouts | One continuous axis for the whole journey |
| UX-003 cross paths, keep state | Chips persist across prompt → filter → plate | Same, plus the trail |
| UX-004 instant facets | A3 | B3 |
| UX-005 Back restores | Plates fold back | Step back along the axis (both need N3) |
| UX-008 progressive Guide me | A2, §2.2 | B2, §2.2 |
| UX-009 why and provenance | Voice tags, flavour signature | Certainty depth, rim light **and** text tags |
| UX-010 detail continuity | Unfold | Step in |
| UX-011 grounded adjacency | Threads, leaves | Lit relations, deeper planes |
| **Serendipity (01, 02, 04 PERS-007)** | "An aside" + leader line (A1 72 s) | Spill light + bend (B1 72 s) |
| IA-009 visible breadcrumbs | Plate header path | **Trail** |
| PERS-001 filters are hard | Solid vs outlined chips, §2.2 | Same |
| SEO-001…011 | SSR unchanged | SSR unchanged; nothing essential in WebGL |
| A11Y-002/004 | §3 mobile and reduced motion | §4 mobile, reduced motion and tiers |

---

## 6. Trade-offs (recorded, not used to choose)

| Dimension | A — Annotated Guide | B — Sightline |
|---|---|---|
| **How the host shows care** | It *speaks*: notes, a drawn connection, a page re-laid for you | It *attends*: light that follows your reading, depth that remembers your path |
| **Continuity (UX-002)** | Continuity of grammar: every layout change is a recomposition of the same elements | Continuity of space: one axis, nothing ever resets |
| **Serendipity staging** | Intimate: a quiet aside in the margin, connected by ink | Peripheral: something lit at the edge of vision; taking it visibly branches the path |
| **Provenance legibility** | Strong and textual | Strong *and* felt (certainty depth). Must keep text labels. |
| **Expert respect** | Notes go silent in control mode | Lights up flattens everything; arguably the clearest "host steps aside" |
| **Main experiential risk** | The voice: notes must be excellent, true and not repetitive at 1,573 coffees, or they become chatter | Legibility of depth on small screens, and whether light reads as guidance or as mood |
| **Brand** | Evolution | Departure; needs an ADR before adoption |
| **Performance (recorded)** | Within today's budget (origin LCP 2.2s) | Tier 1 (DOM/CSS 3D) is likely within budget; Tier 2 WebGL must load after LCP. Mobile lab LCP is already 5–8s. |
| **Accessibility (recorded)** | Straightforward | Depth must not be the only carrier of meaning; vestibular safety (≤ 1 depth unit per step, 15° bend cap) |
| **Data dependency** | N1–N7, N10 | Same |

**Position (not an ease-based recommendation).** Both are viable and equally ambitious; they test different hypotheses about what hospitality *feels* like on ICB:
- **A:** hospitality is **voice and composition**, the sense of a knowledgeable person beside you.
- **B:** hospitality is **attention and memory in space**, the sense of being looked after without being spoken to.

The decision should come from browser prototypes tested with newcomers and experts (08). Take **both** into Penpot at equal depth (6 keyframes each, same scenes, same data).

**My current read** is that B has the higher ceiling on "one continuous experience" and on serendipity, and A has the higher ceiling on intimacy and trust. Confidence is low until the moments are seen in motion.

---

## 7. NEEDS: assumptions that do not exist yet

All are additive. **None changes an existing public URL or coffee data.** None is requested for implementation now.

| # | Need | Used in | Status |
|---|---|---|---|
| N1 | Flavour-**family** filter (membership = any descriptor in family) | "Only fruity" conversion; expert family facet | PROPOSED |
| N2 | **Preference** param (e.g. `prefer=fruity`, `prefer=gentle`) + deterministic preference score (§2.2) | Guide me, A1/B1 18 s | PROPOSED |
| N3 | Push history on filter and preference changes | Back beats | OPEN (audit §19.6) |
| N4 | `/estates/<slug>` (15 qualify under ADR-013) | Estate leaf / plane | OPEN (timing) |
| N5 | Coffee → article relation (reverse lookup of Sanity embeds, or curated mapping) | Variety thread; stories plane | OPEN (IA-007) |
| N6 | Search offers facets ("natural" → Natural filter) | A3/B3 | PROPOSED |
| N7 | Consent-scoped last-context storage + "since last visit" marker | A4/B4 | OPEN (PERS-008) |
| N8 | Estate imagery (0 of 186 estates have any). Until it exists, estate scenes use **region plates and type only**. | Estate leaf / plane | Content gap |
| N9 | Search, filter, prompt and serendipity analytics events | Validation | PROPOSED (TECH-007) |
| N10 | Serendipity query (rule §2.3; read-only over `coffee_directory_mv`) | A1/B1 72 s | PROPOSED |

---

## 8. Design review: what the owner decides

1. **Is B (Sightline) now distinct enough from Taste Observatory**, and is it behavioural rather than a theatre?
2. **Approve the filter/preference model (§2.2)**, including preference as the default for taste and "1 of 2 notes" honesty for multi-family coffees.
3. **Approve the serendipity rule (§2.3)**: two shared relations plus one surprising difference, at most once per journey, silent if nothing qualifies.
4. **Release [11-penpot-handoff.md](11-penpot-handoff.md) to Codex** for keyframes of both concepts.

Still open and not blocking Penpot: N3 push history, N4 `/estates` timing, N5 editorial mechanism, variety as an object, `AGENTS.md` pointer, instrumentation.
