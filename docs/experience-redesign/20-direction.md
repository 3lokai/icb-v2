# 20 — The fixed direction: Find, rate, buy

**Status:** Design direction **CONFIRMED** by the owner on 2026-11-10. The exact visual system, components and motion are **not** final; they are the next three phases below. No production code or database change is approved.

**Penpot:** file `New File 2` (`d2ec9836-375a-810a-8008-ebd27eb28057`).

| Page | Boards |
|---|---|
| `G · The Line …` | The I journey: mobile `I-1`…`I-11`, desktop `I-D1`…`I-D4`. G and H rows above them are history. |
| `I · Homepage v2 — continuous editorial scroll` | `I-V2 D1`–`D3`, `M1`–`M4`, motion grammar. This is the homepage going forward. |

## The direction

> A confident, distinctive evolution of ICB that preserves familiar browsing conventions while fundamentally improving visual storytelling, discovery continuity, review contribution and purchase journeys.

Familiar functionality, delivered through an exceptional experience.

1. **Two actions.** A visitor rates a coffee, or finds one and buys it from the roaster. The coffee page supports both; directory cards carry neither button.
2. **Conventional filters, packaging at the centre.** Roast, process, brew method and flavour work as people expect. Coffee imagery is the largest thing on screen.
3. **Every attribute is a doorway.** Estate, roaster, region, process and flavour each open the coffees that share them, in the same directory. No visible graph.
4. **A homepage that is alive and neutral.** One continuous editorial scroll: actions first, then new coffees, recent ratings, new roasters, field guide. No paid positions. Top Rated lives in the directory as a sort, with sample sizes.
5. **Ask, never assume.** A Buy click does not prove a purchase. Returning visitors are asked "Have you tried it?".
6. **Two funnels, measured separately.** Review: coffee view → rating initiated → submitted → repeat contributor. Purchase intent: coffee view → Buy click → roaster site.

The reasons and dates for each are in [07-decisions.md](07-decisions.md).

## Samples

These are exports of the Penpot boards, kept here as the reference for the next phases. Coffees, counts, prices, ratings and review text are live data from 10 Nov 2026. The four-star rating in the rating screens and the returning-visitor history are illustrative.

### Homepage (v2)

| Desktop | |
|---|---|
| ![Arrival](samples/home-v2-desktop-1-arrival.png) | **Arrival.** Search, Browse and Rate beside real packaging. |
| ![New coffees](samples/home-v2-desktop-2-new-coffees.png) | **New coffees.** A sideways gallery of recent additions. |
| ![Community](samples/home-v2-desktop-3-community.png) | **Community.** Recent ratings, new roasters, field guide, Rate. |

| Mobile 1 | Mobile 2 | Mobile 3 | Mobile 4 |
|---|---|---|---|
| ![](samples/home-v2-mobile-1-arrival.png) | ![](samples/home-v2-mobile-2-new-coffees.png) | ![](samples/home-v2-mobile-3-community.png) | ![](samples/home-v2-mobile-4-field-guide.png) |

![Motion grammar](samples/home-v2-motion-grammar.png)

### Directory, coffee page, rating

| Mobile directory | Mobile coffee page | Mobile rating sheet |
|---|---|---|
| ![](samples/directory-mobile.png) | ![](samples/coffee-mobile.png) | ![](samples/rate-sheet-mobile.png) |

![Directory, desktop](samples/directory-desktop.png)
![Coffee page, desktop](samples/coffee-desktop.png)
![Reviews and rating in place, desktop](samples/reviews-rate-desktop.png)

The earlier one-screen desktop homepage is kept for comparison: [samples/home-v1-desktop.png](samples/home-v1-desktop.png).

## Next steps, in order

### 1. Typography, colour, iconography, motifs

Starting point, as drawn:

| | I boards | Homepage v2 |
|---|---|---|
| Type | Fraunces, DM Sans, DM Mono | same |
| Ink | `#1E1713` | `#271B16` |
| Muted text | `#6B5E53` | `#78695D`, labels `#978575` |
| Terracotta | `#B14E28` | `#AD5433` |
| Star gold | `#B07A1E` | `#AD7C33` |
| Brown (primary) | `#4A2E1F` | `#4A2E1F` |
| Ground | `#F4EDE1`, card `#FBF7F0` | `#F4EDE2` → `#F0E6D8` → `#EDE1D1` by stage |

To settle here:
- One palette. The two sets above have drifted apart.
- Small-text contrast. Labels in `#978575` are about 3:1 and small terracotta text about 4–4.4:1 on these grounds; the minimum is 4.5:1.
- Whether the ground changes per scroll stage.
- Icon rules, including what `↗` means. It marks leaving for the roaster's site in the I boards and is used on internal links in v2.
- Star rendering, including a half star (4.5 currently shows five full stars).
- Motifs: the large soft circles, the mono eyebrow labels and the staggered packaging cards in v2 are the candidates.
- One image frame for mixed source imagery (pack shots, lifestyle photos, info cards).

### 2. Components

Buttons, cards, chips, filters, search, rating stars and sheet, review item, doorway strips, navigation. To settle here:
- One wording each for the Rate action, the search placeholder and the ratings link.
- One name for the collection (record, catalogue, directory and collection are all in use).
- Desktop and mobile versions of the same component carrying the same information (ways in, recently rated).
- Tap-target sizes on mobile.
- Remove annotation text from designs ("Scroll stage 01", "Packaging / roasters own their design").

### 3. Motion

Starts from the motion grammar board: static at first paint, one sideways gallery, native scroll, reduced motion as an immediate state change, all content in the DOM, no WebGL on initial mobile load by default.

## Open rules to decide before they are built

These are behaviour and content rules, not styling, so the phases above will not settle them on their own.

1. **Gallery behaviour.** The motion board asks for a pinned horizontal gallery and also promises no scroll lock. Pick one. A plain sideways-scrolling row keeps the promise.
2. **What "Just added" may show.** Today's six newest coffees are one roaster's batch, and the desktop gallery pads them with three coffees that are not new. Decide whether to limit to one coffee per roaster and whether padding is allowed.
3. **Copy accuracy.** Counts labelled "illustrative" are real; "first rating without sign-in" should match the actual limit of three; "joining the record" implies roasters opt in.

## Not drawn yet

- Desktop: directory reached through a doorway, returning-visitor homepage.
- Homepage v2 for a returning visitor.
- Roaster, region and estate pages, search results, account.
