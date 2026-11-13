# 22 — Visual System: Texture, Motif and Gradients

**Status (2026-11-11):** Motifs and gradients phase **closed**. Part 1 is **CONFIRMED** by the owner and is not reopened without a new decision in [07](07-decisions.md). Part 2 is implementation detail and can be tuned without a decision, as long as Part 1 and the checks in Part 3 still hold.

This is a design reference. Production `DESIGN.md` and production code are unchanged until an ADR in `docs/decisions/`.

**Brand character (CONFIRMED):** "Quiet authority in the typography and information design; warmth in the colour and voice; curiosity and liveliness in the imagery, interactions and graphic details."

**This phase is closed.** The next activity is not another visual treatment: review current and proposed navigation, sitemap/SEO and template coverage using [23 — Next Design Phase](23-next-design-phase.md), then design components and finish copy/QA.

## Assets

| File | What it is |
|---|---|
| [system/icb-system.css](system/icb-system.css) | Tokens for light and dark, plus one class per treatment. Self-contained. |
| [system/icb-terrain.svg](system/icb-terrain.svg) | Terrain contour motif. Black strokes, meant to be used as a CSS mask so it takes a token colour. |
| [system/icb-grain.svg](system/icb-grain.svg) | Paper grain tile, 220 px. |
| [system/index.html](system/index.html) | The four applications below, with a self-check that runs on load. Open in a browser; add `#dark` for the dark theme. |
| [samples/](samples/) | `system-applications-{light,dark,mobile}.jpg` — captures of that page. `icb-motif-terrain.svg` is the owner's original motif drawing. |

## Part 1 — Locked decisions

| Area | Decision |
|---|---|
| Typography | Gambetta for headings, coffee names and editorial titles; Gambetta Italic for selective emphasis; Ranade for body and UI. |
| Colour | Deep Roast, light and dark. Light: page `#FBF6EC` is the lightest tone, surfaces `#F6EFE3` the darker (swapped 2026-11-13). Values in [20-direction.md](20-direction.md). No further palette work. |
| Texture | Subtle paper grain. Restrained image framing. |
| Signature motif | Organic terrain contours, used sparingly. |
| Editorial wash | Espresso wash, on editorial photography only. |
| Legibility | Bottom scrim by default. Side scrim when the composition requires it. |
| Ambient surfaces | "Light + Contour" for selected editorial and feature moments. Flat surfaces everywhere else. |
| Feature surfaces | Three textures are kept: Roasted Weave, Estate Contour and Laid Paper. They break monotony across pages and are chosen by the intent of the section. Each is used on its own, in different places. |

### Rules that follow from them

1. **Packaging is never altered.** No wash, scrim, blend, filter, grain or motif on coffee packaging, roaster logos or evidence photos. Packaging sits on the paper tile in both themes.
   - **Sanctioned exception (owner, 2026-11-13): the coffee card tile.** On `CoffeeCard` the pack image fills the tile (`cover`, 8px inset) and is multiplied into the paper so white pack-shot backgrounds disappear, with the pressed-frame shadow from the playground. This crops some packs and tints white areas cream. It applies to card tiles only; the coffee detail hero and evidence photos keep the rule.
2. **Directory, coffee pages, filters, forms and review cards are flat.** No gradient and no motif.
3. **One terrain motif per view or composition.** It is decoration and carries no information.
4. **Never motif on a photograph, never motif behind packaging.**
5. **Grain goes on the page ground and feature surfaces**, not over packaging.
6. **Text on a photograph always has a scrim**, and stays inside the solid part of it: the lower half for the bottom scrim, the left 55% for the side scrim.
7. **Light and dark are separate treatments**, not a mirrored gradient: wheat light on paper, copper-brown light on espresso.
8. **Not in the system:** copper and warm-paper washes, full tonal overlay, directional ambient gradient, soft circles, dot grid, gradient section stripes, brush smear.
9. **Feature surfaces are never stacked or nested**, and never sit behind the directory, packaging or forms. One per section.

### Where each treatment goes

| Place | Treatment |
|---|---|
| Coffee and roaster directory, coffee detail, filters, forms, review cards | Flat. Framed packaging only. |
| Page ground | Paper grain. |
| Homepage or section feature moment | Light + Contour, or one of the three feature surfaces, chosen by the section's intent. |
| Estate, region and article photographs | Espresso wash. Scrim only if text sits on the image. |
| Instagram posts, report covers, visiting card front | Light + Contour, or washed photograph with scrim. |

## Part 2 — Implementation (tunable)

All values live in `system/icb-system.css`. Colour tokens are the locked Deep Roast values; everything else here is a starting value.

| Treatment | Class | Current implementation |
|---|---|---|
| Paper grain | `.icb-grain` | `icb-grain.svg` tiled behind content. Light: multiply at 13%. Dark: soft-light at 22%. |
| Image frame | `.icb-frame` | Paper tile `#F6EFE3`, 1 px hairline, 7% inset, soft shadow, image `object-fit: contain`. |
| Terrain motif | `.icb-terrain`, `.icb-terrain--left` | `icb-terrain.svg` as a mask over `--icb-contour` (ochre at about 50%). Right edge by default, up to 62% wide; 46% wide and fainter under 600 px. |
| Ambient surface | `.icb-ambient` (+ `.icb-terrain`) | Radial light from the top left using `--icb-glow`: `#EAD9B4` in light, `#4A3020` in dark. `.icb-flat` is the plain surface. |
| Feature surfaces | `.icb-surface` + `--weave`, `--contour`, `--paper` | Weave and Contour are espresso in both themes; Paper follows the theme. Starting assignment, not locked: Weave for community and rating, Contour for regions and estates, Paper for field guide and editorial. |
| Editorial wash | `.icb-photo.icb-wash` | Espresso `#2E1D15` gradient from the lower left, multiply, 45%. |
| Bottom scrim | `.icb-scrim-bottom` | `rgb(23,16,12)` at 85% → 80% at half height → 0 at 90%. |
| Side scrim | `.icb-scrim-side` | Same colour, 85% → 78% at 55% width → 0 at 95%. |

Implementation notes:

- The stylesheet carries inline copies of both SVGs so it works when opened from disk. In production, reference the SVG files by URL instead.
- `icb-terrain.svg` is a smoothed copy of the owner's drawing (corners averaged out, redrawn as continuous curves). There is one shape; mirror or crop it for variety.
- Class names use an `icb-` prefix to stay clear of Tailwind and shadcn. How these map to Tailwind tokens is a production decision for the ADR.

## Part 3 — Verification (2026-11-11)

Run by opening `system/index.html`; the page title reads PASS or FAIL and the list at the bottom shows each check. Results below are from headless Chrome at 1200 px in both themes and 390 px in light.

| Check | Result |
|---|---|
| Text contrast, light | Ink 15.9 on ground, 13.0 on ambient light. Muted 6.7 on ground, 5.5 on ambient light. Accent 5.6. Button text 13.4. Star 4.0 (graphic, needs 3). |
| Text contrast, dark | Ink 15.7 on ground, 10.6 on ambient light. Muted 8.4 on ground, 5.7 on ambient light. Accent 7.0. Button text 13.3. Star 8.2. |
| Scrim contrast | Worst case, text over a pure white photograph at the weakest allowed point: bottom 9.0, side 8.3. Needs 4.5. |
| Text stays inside the scrim | Bottom: 21–38% of height (limit 50%). Side: 38% at desktop, 50% at 390 px (limit 55%). |
| Packaging colour fidelity | 4 of 4 packaging images have no blend, filter, opacity, wash or motif on them or any ancestor, and sit on the paper tile. |
| Feature surfaces | Never stacked, never behind packaging. Text on the lightest tone: Weave 14.1, Contour 10.8. Laid Paper uses the theme ink on surface. |
| Motif restraint | At most one terrain motif per composition; none on photographs or behind packaging. |
| Mobile, 390 px | Sections stack to one column, packaging to two. Captured in `samples/system-applications-mobile.jpg`. |

Limits of these checks:

- Scrim contrast is a worst case against white, not a measurement of each photograph. It is the safe bound.
- Packaging fidelity is checked by rule (nothing is applied), not by comparing pixels.
- Mobile was checked in the light theme only, in headless Chrome, not on a device.
- The demo uses two photographs and four packs. It shows the rules; it is not a test of every image.

## Open

- Which feature surface goes with which section intent. The assignment in Part 2 is a starting point.
- Dark-theme treatment of white pack shots (they sit on the paper tile and read bright).
- Image framing detail, iconography and components come next.
