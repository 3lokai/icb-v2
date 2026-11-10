# 11 — Penpot Handoff for Codex (Phase 2 keyframes)

**Status:** Ready for owner release. Do not start until the owner releases this brief (see [10 §8](10-screenplays.md)).
**Date:** 2026-11-07 · **Branch:** `design/experience-redesign` · **Prepared by:** Claude Code
**Owner of this task:** Codex, via the Penpot MCP. One task owner; do not edit the screenplay docs in parallel.

This brief is self-contained. Everything needed to build the keyframes is here or in the linked screenplay. If anything conflicts, **[10-screenplays.md](10-screenplays.md) wins**, and the conflict should be reported, not resolved silently.

---

## 1. What you are making, and when to stop

**Goal.** Annotated Penpot keyframes for **two equally ambitious experience concepts**:
- **A, "The Annotated Guide":** evolves the current Coffee Field Guide identity. The host is the margin: notes, one drawn leader line, a page that recomposes around intent.
- **B, "Sightline":** a free identity. One continuous composition on a single depth axis; light and depth act as the host.

**Scope.**
- **Main sequence:** the mobile deep-link journey, **7 keyframes per concept** (§5).
- **Homepage sequence:** a short newcomer arrival, **2 keyframes per concept**.
- **Variants:** desktop and reduced-motion variants of selected keyframes (§5.3).

**Stop condition.** When §8 is satisfied, export, write the handoff note (§9) and **stop for design review**. Do not create a component library, a design system, full-site screens, or code.

**What "good" looks like.**
- Each sequence reads as **one experience that changes state**, not a set of pages.
- The visitor's direct search and filters are visible or one tap away in every frame.
- Every fact on screen is real (§6) and carries its provenance voice.

---

## 2. Read first (in order)

1. [10-screenplays.md](10-screenplays.md). **Mandatory.** It is the source of every beat, string and motion spec. Sections §2 (shared foundations), §3 (A) and §4 (B) are the design spec.
2. [07-decisions.md](../07-decisions.md): the owner decisions and guardrails.
3. [01-vision.md](01-vision.md) and [03-interaction-motion.md](03-interaction-motion.md): the emotional brief and the motion principles.
4. Root `DESIGN.md`. For **A only**, it is the identity you evolve. For B it is background; B may depart from it.
5. Optional evidence: [current-state-audit.md](../current-state-audit.md) §10.0 and §13a.

---

## 3. Non-negotiables (both concepts)

1. **No literal café, theatre, opera house, stage, curtain, barista, host avatar or decorative coffee beans.** Hospitality is behaviour.
2. **No field of coffee objects and no flavour-cluster or taste-map visualisation.** These are rejected because they resemble Taste Observatory. Do not reuse imagery or layouts from Contour Atlas, Taste Observatory or Coffee Correspondence.
3. **No stacked marketing sections, no card-grid homepages, no moodboard pages.**
4. **The ask is always present.** A persistent search-and-filters bar: bottom on mobile, top on desktop. It shows **filter chips (solid)** and **preference chips (outlined, prefixed "prefer")**. See 10 §2.2.
5. **Three provenance voices, always as visible text.** *Catalogue* · *ICB estimate* · *Editorial*. Colour, depth or light may reinforce a voice but never replace its label.
6. **Real data only** (§6). Never invent coffees, prices, notes, ratings, stock, altitudes or estate photos. A missing asset is a grey box labelled `PLACEHOLDER: <what>`.
7. **Mobile first** (390 × 844 is the primary canvas). Desktop is a variant.
8. **Every animated transition has a reduced-motion state** (§5.3).
9. **WCAG 2.1 AA:** text contrast ≥ 4.5:1 (large text 3:1), visible focus, 44 px minimum touch targets. **Both** light and dark for B (B's light theme is control mode).
10. Content must be expressible as **semantic HTML**: headings, lists, links, buttons. Nothing essential exists only as imagery or 3D.

---

## 4. Penpot setup

- **Inspect before editing.** List teams, projects and files. Do **not** modify any existing file.
- **Create one new file:** `ICB Experience Redesign — Phase 2 Keyframes`. Put it in an existing project named for the redesign if there is one; otherwise create a project **`ICB Experience Redesign`** and report the choice.
- **Pages, in this order:**
  1. `00 Read me`: purpose, link to this doc and 10, a legend of chip types and voices, a status box ("Phase 2 exploration, not approved").
  2. `A · Deep link (mobile)`: K1–K7.
  3. `A · Homepage (mobile)`: H1–H2.
  4. `A · Desktop + reduced motion`: the variants from §5.3.
  5. `B · Deep link (mobile)`: K1–K7.
  6. `B · Homepage (mobile)`: H1–H2.
  7. `B · Desktop + reduced motion + light theme`: variants.
  8. `Shared · Annotations legend and open questions`.
- **Frame names:** `A-K3 Coffee opens (mobile)`, `B-K5 Serendipity (mobile)`, `B-K7 Lights up (light theme)` and so on.
- **Sequence layout.** Lay frames left → right in sequence order. Draw **flow arrows** between consecutive frames, labelled with the trigger (e.g. "tap Brighter").
- **Annotations** sit beside each frame, never on it, using the template in §7.
- **Never** paste the Penpot MCP URL or token into the file, the repo or any doc.

---

## 5. Keyframes

### 5.1 Main sequence: mobile deep link from Google to `/coffees/v60` (both concepts, same beats)

Each keyframe = one frame at the **resting state after** the transition. Motion is described in annotations. Beat timings refer to 10 §3 (A1) and §4 (B1).

| ID | Moment | Must show | A emphasis | B emphasis |
|---|---|---|---|---|
| **K1** | **Arrival on the landing page** | Existing h1 and intro copy (§6.1), brew-parameter strip, ask bar with filter chip **Pour-over**, first rows of results starting below the fold edge | Plate layout; smear under "terroir"; note strip: *"646 coffees here brew well on a V60. Most have at least one fruity note."* | Warm-dark ground; key light on the intro; one empty plane faintly behind (depth promised) |
| **K2** | **Preference applied** ("Brighter") | Chips: **Pour-over** (solid), **Natural** (solid), *prefer* **Fruity** (outlined). 3–4 result rows, each with flavour signature + why-line (e.g. *"1 of 2 notes fruity"*). An **"Only fruity"** conversion affordance. | Layout recomposed from index to **spread**; note: *"Nothing's hidden, just re-ordered…"* | Key light resting on the top rows; the same suggestion stated in text |
| **K3** | **Coffee opens** (hero coffee) | Name, roaster, product image, price "from ₹600", weights, **Buy from Baarbara Coffee** above the fold, flavour signature `Mango · Fruity` `Dry Coconut · Nutty`, Natural · Light · SLN 795 · Baba Budangiri · Baarbara Estate | Specimen **plate** (unfolded); margin threads with verbs and voices: *Grown at* (Catalogue), *Variety* (Editorial), *From* (Catalogue) | **Step in:** coffee plane in front, results plane receding behind; **certainty depth** (Catalogue facts nearest); **trail** `V60 · prefer Fruity › Naturals` |
| **K4** | **Estate** | Baba Budangiri **region plate** (real art); estate facts quoted (§6.4); *"111 coffees from 23 roasters come from here."*; *"Same farm, other hands"*: BrewClan **Baarbara Naturals** with *"Bright: acidity 4/5 · ICB estimate"* | **Tipped-in leaf** over the plate's edge | Second **step in**; trail `… › Baarbara Estate`; the estimate recessed with a cool rim **and** the text label |
| **K5** | **Serendipity** | The aside sentence (§6.6) and the Ratnagiri Robusta specimen (name, roaster, Robusta, anaerobic, medium, notes, from ₹670); **"Not now"** dismiss | **"An aside"** margin note; **leader line** drawn from the word *Mango* on the plate to the tipped-in Robusta | **Spill light** at the right edge; the aside plane 12% into frame. Show a second frame **K5b** with the **bend** taken (line of sight turned ~15°, original path visible to the left, trail `… ⤷ Ratnagiri Robusta`) |
| **K6** | **Adjacent editorial** | Two real articles (§6.7) labelled *Editorial*, each with title and one-line reason | Variety thread opened as a leaf: SLN 795 → *Indian coffee varieties explained* | Deepest layer of the plane, lit amber: *Baba Budangiri* + *Varieties explained* |
| **K7** | **Visitor takes control** (expert path) | Search or filter panel open; filters **Pour-over · Natural · Light · Chikmagalur**; result count **14**; dense rows; Back affordance | Control mode: no notes, smear static, **index** layout | **Lights up:** everything flattened, bright, dense; light theme |

### 5.2 Homepage sequence: newcomer (both concepts)

| ID | Moment | Must show |
|---|---|---|
| **H1** | **Arrival** | One composed composition (not sections): one sentence (draft copy in 10 §3/§4), the ask bar, three invitations **Find me a coffee** · **I know what I'm after** · **Show me something interesting**. A: one real region plate. B: one lit sentence, with the first plane of the fortnight's real story faint behind it (*"One estate, twenty-three roasters: Baarbara."*). |
| **H2** | **First prompt** | *"How will you brew it?"* with options Pour-over · Espresso/moka · French press/AeroPress · Filter (South Indian) · With milk; *"Three questions at most; skip any."*; **Skip** visible; ask bar still present. |

### 5.3 Variants

| Variant | Frames | Notes |
|---|---|---|
| **Desktop 1440 × 900** | K1, K3, K5, K7, H1, per concept | A: margin column beside content. B: planes have room for lateral depth; the trail sits top-left. |
| **Reduced motion** | K3, K5, K7, per concept | Show the **resting state** plus an annotation of what replaces the motion (crossfade or instant). B: no camera, no scroll-linked light, aside as an inline labelled card, trail still present. |
| **B light theme** | K3, K7 | Light theme = control-mode palette; must meet AA. |
| **Focus states** | One frame per concept | Keyboard focus on the ask bar, a chip, a relation link and the aside's "Not now". |

That is 9 mobile keyframes + K5b for B, plus the variants. If time forces cuts, cut variants before main-sequence frames, and report what was cut.

---

## 6. Content: real data, use verbatim

Source: the live ICB database (read-only, 2026-11-07) and the repo. Prices and stock change, so the annotations must say *"Data as of 2026-11-07"*.

**6.1 Landing page.** URL `/coffees/v60`. Intro (existing copy): *"No brewer shows you an Indian coffee's terroir as plainly as the V60. Washed Chikmagalur lots and Araku light roasts taste their clearest here."* Use the live page's h1; do not invent a new one. 646 in-stock pour-over coffees. Top families: Fruity 504, Chocolatey/Cocoa 205, Sweet 186 (overlapping).

**6.2 Hero coffee.**
- **Naturals Roasted Coffee Beans** — Baarbara Coffee.
- Natural · Light · SLN 795 · Region: Baba Budangiri · Estate: Baarbara Estate.
- Notes: **Mango** (Fruity) · **Dry Coconut** (Nutty).
- From ₹600 · 250 g / 500 g / 1 kg / 5 kg.
- Brews: pour-over, AeroPress.
- Source: roaster (*Catalogue*).
- Live page: `https://www.indiancoffeebeans.com/roasters/baarbara-coffee/coffees/naturals`. Use its product image.

**6.3 Same-estate sibling.**
- **Baarbara Naturals** — BrewClan Coffee Roasters.
- Natural · Light-medium · SLN 795 · Berry (Fresh), Citrus · from ₹699.
- Acidity 4/5, sweetness 3/5, both **ICB estimate** (inferred, confidence medium).
- `…/roasters/brewclan-coffee-roasters/coffees/baarbara-naturals`

**6.4 Estate.**
- **Baarbara Estate** (Chikmagalur).
- From the record: cultivated for over 120 years; third generation of the Indavara family (MG Plantations); Selection 795 Arabica shade-grown on the high hills of the Western Ghats; UTZ and Rainforest Alliance; also produces black pepper.
- Signature profile: *"Moderately bright, balanced and complex — chocolate and caramel notes with mandarin and spicy undertones."*
- 111 in-stock coffees from 23 roasters.
- **No altitude** (don't show one). **No estate photo exists:** use the **Baba Budangiri region plate** from `https://www.indiancoffeebeans.com/regions`. It is a 4:5 framed illustration; never crop it or put text over it (DESIGN.md `RegionCard` rules apply in A).

**6.5 Expert result.** Pour-over + Natural + Light/Light-medium = 62; plus Chikmagalur = **14**. For K7 rows, use real coffees from `https://www.indiancoffeebeans.com/coffees?brewMethodIds=pour_over&processes=natural&roastLevels=light,light_medium&regions=chikmagalur` (copy names, roasters and prices from the live page; record the URL). If the count differs on the day, show the live count and note it.

**6.6 Serendipity.**
- Sentence: *"Also from the Baba Budangiri hills, also tasting of mango, and it's a Robusta."*
- **Ratnagiri Estate – Robusta Mosto Naturals** — Naivo Coffee.
- Robusta · Anaerobic · Medium · Baba Budangiri · Ratnagiri Estate.
- Notes: Cream, Dried Fruit, Jackfruit, Mango, Nutmeg · from ₹670.
- `…/roasters/naivo-coffee/coffees/ratnagiri-estate-robusta-mosto-naturals`
- Voice: *Catalogue*. Make no quality claim about Robusta.

**6.7 Articles (Editorial).**
- *Indian Coffee Varieties Explained: SLN-795, SLN-9, Chandragiri, and More* (`/learn/indian-coffee-varieties-explained`).
- `/learn/baba-budangiri-coffee` and `/learn/understanding-indian-coffee-estates`.
- Use the live titles and cover images.

**6.8 Identity inputs.**
- **A:** use DESIGN.md tokens: cream `oklch(0.982 0.009 79.92)`, ink `oklch(0.222 0.030 54.20)`, primary `oklch(0.52 0.120 60.55)`, terracotta accent `oklch(0.722 0.139 40.48)`; Fraunces (display) + DM Sans (body); radius 8/14 px. Brush-smear asset: `public/images/stain-smear.png` in the repo.
- **B:** free, within §3.9. Propose the display and data typefaces inside the keyframes (with a caption in `00 Read me` explaining the choice). Light temperature roles: warm key = current focus; cool rim = ICB estimate; amber = editorial.

---

## 7. Annotation template (beside every keyframe)

```
ID / Moment:        B-K5 Serendipity (mobile)
Arrives from:       B-K4 via "reads estate plane" (no tap; appears on dwell / scroll end)
Trigger:            —
Shows:              (list of key elements)
Interaction:        tap aside → B-K5b (bend) · tap "Not now" → aside dismissed, never returns this journey
Motion:             spill light 900 ms; plane slides 12% into frame; easing cubic-bezier(0.22,1,0.36,1)
Reduced motion:     inline labelled card under the estate facts; no light change
URL:                /estates/baarbara-estate (if shipped) else unchanged; on tap → Robusta detail URL
Data + voice:       §6.6 · Catalogue · as of 2026-11-07
Hard vs soft:       chips present: Pour-over (filter), Natural (filter), prefer Fruity (preference)
Requirements:       UX-011, PERS-007, A11Y-002, SEO-001
Open question:      (if any, also listed on the Shared page)
```

---

## 8. Acceptance checklist (self-check before stopping)

- [ ] A and B each have K1–K7 + H1–H2 at 390 × 844; B also has K5b.
- [ ] Variants from §5.3 exist (or the cuts are reported).
- [ ] The ask bar appears in every frame; filter and preference chips are visually distinct and match 10 §2.2.
- [ ] Every fact matches §6; the "as of 2026-11-07" note is present; missing assets are labelled placeholders.
- [ ] The three voices appear as text wherever a fact's source matters.
- [ ] The serendipity moment states both shared relations and the difference, and has a dismiss.
- [ ] No objects field, cluster visualisation, theatre or café imagery, stacked sections, or reused rejected-concept imagery.
- [ ] Contrast spot-checked (AA) on body text, chips and labels, in both B themes.
- [ ] Each sequence reads as one continuous experience when the frames are viewed left to right.
- [ ] Annotations are complete per §7.

---

## 9. Deliverables and handoff note

1. **Penpot file link** (share link with view access).
2. **PNG exports** of every frame at 2×, committed to `docs/experience-redesign/keyframes/{A,B}/<frame-id>.png` on `design/experience-redesign`.
3. A **handoff note** appended to the end of this file, under `## Phase 2 handoff (Codex, <date>)`. It covers:
   - files and pages created;
   - frames delivered and frames cut;
   - every place real data differed from §6 on the day;
   - design decisions taken (especially B typography and palette) and why;
   - risks noticed;
   - open questions for the owner;
   - the next step.
4. **Do not** edit `10-screenplays.md`, `07-decisions.md`, `PRODUCT.md`, `DESIGN.md`, app code or CSS. Report conflicts in the handoff note instead.

Then **stop for design review.**

---

## 10. Questions you must not resolve yourself (flag them)

- Push-history behaviour (N3), `/estates` timing (N4), the article-relation mechanism (N5), the preference param naming (N2).
- Any change to URLs, SEO structure or coffee data.
- Adopting B's identity beyond this exploration (that needs an ADR).

---

## Phase 2 handoff (Claude Code, 2026-11-07)

Built by Claude Code via the Penpot MCP, on the owner's instruction (instead of Codex). **Stopped for design review.**

### Files and pages
- **Penpot file:** "New File 1" (id `d3aee43a-8d21-8092-8008-e896e8d8af0c`) at design.penpot.app. **Rename it** to `ICB Experience Redesign — Phase 2 Keyframes`; the plugin API cannot rename files. Share link: to be created by the owner (the API has no sharing call).
- **Pages:**
  1. `00 Read me` — status, how to read, legend.
  2. `A · Deep link (mobile)`
  3. `A · Homepage (mobile)`
  4. `A · Desktop + reduced motion`
  5. `B · Deep link (mobile)`
  6. `B · Homepage (mobile)`
  7. `B · Desktop + reduced motion + light`
  8. `Shared · Legend + open questions`
- **PNG exports:** `keyframes/A/*.png` (10) and `keyframes/B/*.png` (12). They are **1×**, not the 2× the brief asked for; the MCP export has no scale option. Re-export from Penpot at 2× if needed.

### Frames delivered
| | A — The Annotated Guide | B — Sightline |
|---|---|---|
| Mobile deep link | K1–K7 | K1–K7 + K5b (bend) |
| Mobile homepage | H1, H2 | H1, H2 |
| Desktop 1440 | K3 | K3 |
| Reduced motion | none (identical at rest; temporal differences in each annotation) | K5 (inline aside, no planes or light) |
| Light theme | n/a | K7 (control mode = light palette) |
| Focus state | none | shown on K7 search field |

**Every frame has an annotation card** (§7 template) and flow labels between frames.

### Cut (per §5.3 priority: variants before main frames)
- Desktop K1, K5, K7 and H1 (both concepts).
- Reduced-motion K3 and K7 (B).
- B light-theme K3.
- Dedicated focus-state frames (both).
- A reduced-motion frames: skipped as visually identical at rest.

### Where real data differed from §6 or needed care
- **B-K6 deviation.** Uses *Understanding Indian Coffee Estates* instead of *Varieties explained*, because the live Sanity excerpt names both "Ratnagiri Estate" and "Baarbara Estate". That grounds the Robusta → story link better. A-K6 keeps the varieties article, which is the correct link from SLN 795.
- **K2 rows** are real pour-over naturals with fruity shares computed from canon families:

  | Coffee | Fruity notes | Price |
  |---|---|---|
  | Supernaturals | 3 of 4 | ₹899 |
  | Currant Affairs | 3 of 4 | ₹725 |
  | Micro Climate | 2 of 3 | ₹850 |
  | Odisha Naturals | 2 of 3 | ₹799 |

  The pour-over + natural count is **112**.
- **K1 rows** are the top-rated pour-over coffees (GB Roasters' Monsooned Malabar from ₹150; Blue Tokai's Raxidi Lobo Estate from ₹900). The ₹150 is the live min price, probably a small pack size.
- **K7 rows:**
  - 5 of the 14 real results, the first five by review count.
  - The "Kerehaklu Estate – Blossom Culture" name is truncated as the UI would truncate it.
  - "Bella Vita" (Crema) appears twice in the 14.
- Product names in the DB include HTML entities (`&#8211;`) and promo suffixes ("| Auto Discounted | No Codes"); frames avoid or clean them.
- Real images were used: ImageKit product images, Baba Budangiri and Chikmagalur region plates, and Sanity covers. No estate photo exists; estate frames use the region plate with a caption saying so.
- **Draft copy:** the homepage sentences ("Indian coffee, introduced properly." in A; "Indian coffee, by the people who grow and roast it." in B) and all host notes. No hard-coded catalogue counts appear in persistent copy.

### Design decisions taken
- **A** keeps the DESIGN.md tokens (hex-converted from OKLCH: cream `#FCF9F2`, ink `#26170D`, primary `#995503`, terracotta `#ED855E`), plus Fraunces and DM Sans. The smear is drawn as a terracotta stroke standing in for `stain-smear.png`.
- **B:**
  - Bodoni Moda (display) + Geist (data).
  - Ground `#15100C`, ink `#F3ECDF`, warm key `#F2B867`, cool rim `#9CC3E0` (ICB estimate), editorial amber `#E9A94B`.
  - Light theme (control mode) `#F5F1E9` / `#1B1611`.
  - Light is radial gradients. Planes are translucent rounded rectangles with deep shadows.
  - The trail is drawn on the receded planes.
- **Chips:** filters are solid; preferences are dashed outline with an italic "prefer". This is the same in both concepts, inverted for B's dark ground.

### Risks noticed
- **A:** the margin note strip and ask bar together take about 230 px of a 844 px viewport on mobile. Collapsing the note after the first interaction needs testing.
- **B:** dark-theme text on translucent planes depends on what is behind them. Contrast was spot-checked visually and needs real measurement. The certainty-depth recess is subtle at mobile size.
- **B-K5:** the aside is legible only because it peeks wide (about 135 px). The "12% into frame" in the spec is too little on mobile, so the spec should change to "enough to read one sentence".

### Open questions for the owner
- Push history (N3)
- `/estates` timing (N4)
- Coffee → article mechanism (N5)
- `prefer=` naming (N2)
- Whether to commission estate imagery (N8)
- B as a candidate identity (an ADR is needed before any adoption)

### Next step
Owner design review of both concepts in Penpot. Then the Phase 2 gate (08): approve the experience architecture and **one** prototype candidate (or a hybrid) for the Phase 3 browser prototype.
