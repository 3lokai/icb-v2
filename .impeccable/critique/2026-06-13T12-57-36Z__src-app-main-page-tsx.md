---
target: the home page and its components
total_score: 29
p0_count: 0
p1_count: 4
timestamp: 2026-06-13T12-57-36Z
slug: src-app-main-page-tsx
---
# Critique — ICB Homepage

**Target:** `src/app/(main)/page.tsx` + 13 rendered sections + hero subsystem + layout primitives, judged against the committed "Coffee Field Guide" brand system.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good skeletons/search state; hero personalization changes silently with no "why am I seeing this." |
| 2 | Match System / Real World | 4 | Copy is human and on-voice ("no poetic nonsense"); field-guide language lands. |
| 3 | User Control and Freedom | 3 | Search has Esc/clear; 13-section scroll has no skip-link or in-page nav. |
| 4 | Consistency and Standards | 2 | h2 styled as `.text-display` in some sections, `.text-title` in others; eyebrow lockup reinvented inline 5×; empty states recolor headings to primary. |
| 5 | Error Prevention | 3 | Graceful hero fallback + partial-load messaging. |
| 6 | Recognition Rather Than Recall | 3 | RecentlyViewed + hero panel help; ~8 near-duplicate "explore/browse" CTAs blur. |
| 7 | Flexibility and Efficiency | 3 | Hero search + segment-aware copy is a genuine strength. |
| 8 | Aesthetic and Minimalist Design | 2 | The weak axis: 13 sections, 7 eyebrows, decorative glows, nested cards, 320–400px ghost icons all competing. |
| 9 | Error Recovery | 3 | Friendly empty states; fine for marketing. |
| 10 | Help and Documentation | 3 | FAQ + HowItWorks cover it, arguably redundant. |
| **Total** | | **29/40** | **Good — solid bones dragged down by ornament discipline (H4, H8).** |

## Anti-Patterns Verdict

**Does this look AI-generated? Mixed — passes the smell test, fails the discipline test.**

**LLM assessment:** A discerning visitor would *not* immediately say "AI made this." The system underneath is real and above the SaaS baseline. But the page violates its own constitution in measurable ways — the strongest tell is the repeated thin-rule+overline eyebrow lockup recited section after section, and the `<Accent>` brush-smear (the one brand signature) demoted to a per-section title decoration.

**Deterministic scan:** `detect.mjs` over the homepage `.tsx` files returned `[]` — exit 0, CLEAN, zero anti-patterns. Verified live (a synthetic purple/cyan gradient snippet correctly flagged). The detector is narrowly tuned to AI-palette tells (purple/violet/cyan gradients, gradient text); the homepage has none. **The detector and the LLM review disagree, and the LLM review is right:** the project's own DESIGN.md bans (One-Smear Rule, ≤1 eyebrow per 3 sections, depth-via-surfaces-not-shadow) are stricter than the generic detector, and those are the rules being broken.

**Visual overlays:** Browser visualization skipped — no browser automation tool available. No user-visible overlay was produced. Findings are from source review + deterministic scan only.

### DON'T checklist (on rendered sections)
- **Eyebrow on every section — FAIL.** 7 eyebrow-led sections + 1 double-kicked (FAQ) against a ceiling of ~4. The `h-px w-8 bg-accent/60` + `text-overline` lockup is copy-pasted across HowItWorks, HomeCollectionGrid, CuratorSpotlight, CtaSection, FAQ.
- **One-Smear Rule — FAIL.** `<Accent>` smear in 10+ rendered sections (TopRated `:74`, RecentlyViewed `:104`, NewArrivals `:54`, HowItWorks `:105`, CollectionGrid `:113`, Roaster `:90`, Education `:112`, Curator `:59`, Testimonials `:200`, Cta `:33`, FAQ `:48`).
- **Resting shadows on cards — FAIL.** `CuratorSpotlight.tsx:28` shadow-xl, `UserProfileTeaser.tsx:115` shadow-2xl, `EducationContent.tsx:234,257`, `TestimonialsSection.tsx:119` — system says shadow on hover only.
- **Glassmorphism — FAIL.** `TestimonialsSection.tsx:119` self-labeled "Glassmorphism" `bg-card/40 backdrop-blur-sm`; UserProfileTeaser floating cards.
- **Nested cards — FAIL.** `CtaSection.tsx:95` panel containing three bordered `bg-card` stat tiles (`:109,:118,:128`).
- **Side-stripe border — NEAR-MISS.** `HowItWorksSection.tsx:126` `border-l-2 border-primary/30` (banned shape, hand-rolled outside `<Decor>`).
- Hero-metric template — PASS. Gradient text — PASS (zero). Second accent color — technically PASS (primary used decoratively alongside accent often enough to read as one).

## Overall Impression
Strong bones, over-decorated skin. The primitive layer (Decor bans side-stripes, Reveal honors reduced-motion, coffee-tinted shadow tokens, AA-tuned contrast) is genuinely excellent and the hero segment system is real product design. But the page spends its restraint everywhere: the one brand signature is on every title, the eyebrow is on every section, and the 13-section scroll runs two full marketing arcs. The single biggest opportunity: **subtract.** Fewer sections, one smear, quiet titles — let the system's discipline read as the premium quality it was built to be.

## What's Working
1. **Hero segment system** (`heroCopy.ts`, `HeroContextPanel.tsx`) — genuinely personalized, gracefully degrading, keyboard-accessible combobox (`role=listbox`, `aria-activedescendant` done right). Real product design.
2. **The primitive layer is disciplined and AA-credible** — `Decor` bans side-stripes with documented rationale, `Reveal` collapses under reduced-motion, shadow tokens are coffee-tinted, contrast deliberately tuned (primary→0.52, muted-fg→0.48 for AA).
3. **Copy voice** — consistently editorial and anti-cliché ("a personal record, not a leaderboard"; "no poetic nonsense"). The brand register is real in the words.

## Priority Issues

### [P1] One-Smear Rule broken — the signature is now wallpaper
- **Why it matters:** The brush-smear is the page's one brand asset. On every section title it stops signifying emphasis and becomes default decoration — the textbook "applied the design system everywhere" AI move. Terracotta becomes omnipresent, killing the restraint that reads as premium.
- **Fix:** Pick ONE phrase for the whole page to carry the smear (hero headline or the Cta "worth"). Everywhere else, plain Fraunces titles, no accent. 12 quiet titles make the 1 smear land.
- **Suggested command:** `/impeccable quieter`

### [P1] Eyebrow inflation — 7+ kickers, one section double-kicked
- **Why it matters:** Violates the ≤1-per-3 rule by ~75%; the repeated identical thin-rule+overline lockup is the strongest "templated by a machine" signal on the page.
- **Fix:** Drop eyebrows from ≥3 of {HowItWorks, CollectionGrid, Curator, Cta}. Remove the FAQ `badge` (a section can't have two kickers). Route the survivors through `<Section eyebrow>` so it's centrally controlled, not hand-copied.
- **Suggested command:** `/impeccable typeset`

### [P1] Section overload — two redundant marketing arcs
- **Why it matters:** 13 sections exceed working-memory; TopRated+RecentlyViewed+NewArrivals+CollectionGrid are 4 card sections in a row, and HowItWorks+UserProfileTeaser+FAQ re-explain the product three times. The page makes its full case by ~section 7, then runs a second arc to 13.
- **Fix:** Cut to ~8. Merge RecentlyViewed into the hero panel; collapse NewArrivals into TopRated as a toggle; choose HowItWorks OR UserProfileTeaser.
- **Suggested command:** `/impeccable distill`

### [P1] Resting shadows + glassmorphism contradict the depth system
- **Why it matters:** System says depth = tonal surface steps + hairlines, shadows on hover only. Static shadow-xl/2xl + frosted glass are the generic-SaaS look the brand explicitly rejects.
- **Fix:** Replace resting `shadow-xl/2xl` with `surface-1`/`surface-2` + `border-border/60`; move shadow to `hover:`. Drop `backdrop-blur` except on the over-video hero panel where it's earned.
- **Suggested command:** `/impeccable polish`

### [P2] Contradictory stats erode the closing note
- **Why it matters:** Hero live counts vs RoasterInfrastructure "150" (`:95`) vs CtaSection hardcoded "60+"/"2,000+" (`:111,:121`) — three different roaster/bean numbers on one page; hardcoded CTA numbers can directly contradict the live hero. Credibility hit at the close.
- **Fix:** Single source — pass live `totals` into Cta and RoasterInfrastructure; delete hardcoded figures.
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Jordan (first-timer):** `UserProfileTeaser` shows a fully-populated *fictional* profile (@arjun_brews, 42 ratings, taste bars at 85%/40%) with no "example" label (`:134-244`) — a newcomer may think it's their data or someone else's account, confusion at the exact sign-up ask. After the hero there's no single primary path: 4 equal "explore/browse" CTAs.

**Casey (mobile):** 13 sections = a very long mobile scroll with two marketing arcs. The 4-column parallax collection grid collapses to 1 column, so the cleverness is desktop-only weight. Hero packs eyebrow + headline + sub + panel (search + 7 chips) + 2 CTAs + stats into `min-h-[90dvh]` — heavy decision-making before any content on a phone.

**Riley (stress-tester):** All testimonials hardcoded 5-star with `ratingValue=5` schema (`:191`) — uniform praise reads as less credible and is schema-spammy. `min-h-[400px]` spinner boxes (7×) may not match settled section heights → CLS on slow loads.

## Minor Observations
- `TopRatedSection.tsx:53`, `NewArrivalsSection.tsx:33` empty states use `text-heading text-primary` for an h2 — breaks the h2=`.text-title` contract and recolors a heading off-system.
- `HowItWorksSection.tsx:235-248` injects `<style jsx global>` (`.shadow-glow`, `.dashed`) — bespoke CSS that belongs in `effects.css`.
- `TopRatedSection.tsx:67` (Star 400px), `RecentlyViewedSection.tsx:95` (Eye 320px) ghost icons are a decorative tic repeated across sections.
- `RoasterInfrastructure` "Are you a roaster?" B2B link dropped into a B2C discovery flow — context switch.
- Hero stats strip styles editorial claims ("Free to use") identically to live metrics — claims and numbers shouldn't share the dot-bullet treatment.

## Questions to Consider
1. If the brush-smear is the *one* brand signature, would the page feel more expensive if exactly one phrase wore it and the other 12 sections went quiet?
2. You have three coffee-card sections and three "explain the product" sections. Which one of each survives if you could ship only one — and what does keeping all six say about what the page is arguing?
3. Does showing a beautiful *fictional* profile to a logged-out stranger build trust or quietly spend it?
4. The page makes its case by section 7, then runs a second arc to 13. If you deleted everything after the first CTA-worthy moment, what's actually lost — user understanding, or scroll-depth metrics?
