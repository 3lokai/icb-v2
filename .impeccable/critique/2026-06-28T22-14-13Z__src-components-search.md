---
target: the search components
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-06-28T22-14-13Z
slug: src-components-search
---
# Critique — Search components (`SearchCommand` + `HeroSearch`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Modal has loading/ready/empty states; hero has none (no loading, no "no results"). |
| 2 | Match System / Real World | 3 | Plain-language placeholder is good; emoji `⭐` rating reads off-brand for an editorial guide. |
| 3 | User Control and Freedom | 3 | Esc / clear / click-outside all work; hero Esc wipes the query, not just the dropdown. |
| 4 | Consistency and Standards | 2 | Same data rendered two different ways; modal is warm-paper, hero is dark glass. |
| 5 | Error Prevention | 3 | Low-stakes surface; little to prevent. n/a-ish. |
| 6 | Recognition Rather Than Recall | 2 | The ⌘K shortcut is invisible — no hint on any trigger. |
| 7 | Flexibility and Efficiency | 3 | ⌘K + arrow-key nav + enter-to-open. Solid. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, but the hero dropdown uses banned glassmorphism. |
| 9 | Error Recovery | 3 | Modal shows error + Close; hero shows nothing on index failure. |
| 10 | Help and Documentation | 2 | No affordance hints anywhere; low need but zero present. |
| **Total** | | **27/40** | **Acceptable — solid bones, brand-consistency + contrast gaps** |

## Anti-Patterns Verdict

**LLM assessment:** The modal (`SearchCommand`) is genuinely on-brand — warm paper popover, muted-ink captions, secondary/outline badges, restrained. It does not read as AI slop. The **hero dropdown is the problem**: `bg-black/45 backdrop-blur-md`, `bg-white/5`, `border-white/10`, `shadow-2xl` is textbook glassmorphism — explicitly banned by the parent skill ("Glassmorphism as default") and by DESIGN.md's "depth via surfaces, not blur" + "The Warm-Shadow Rule." The two surfaces look like they came from two different products.

**Deterministic scan:** `detect.mjs` returned `[]` (0 findings) on both files — exit 0. The detector keys off markup/class tells it can match statically; the glass + dark-on-dark issues here are semantic (token-on-wrong-surface), which is why the visual review catches what the scanner can't. No false positives to clear.

**Visual overlays:** Not run — component-level target, no live page injected.

## Overall Impression

Two competent search surfaces that don't agree with each other. The ⌘K command palette is the well-behaved one — it inherits the field-guide palette and states cleanly. The hero search is where craft and brand drift: it adopts a dark-glass aesthetic the design system bans, and — more seriously — it reuses light-surface text tokens (`text-muted-foreground`) on a dark glass panel, so descriptions and metadata render dark-on-dark. The single biggest opportunity: **make the hero dropdown a member of the same family as the modal**, and fix the contrast while you're there.

## What's Working

1. **The command palette's state machine.** Skeletons while loading, distinct empty states for "loading index", "no results for X", and "start typing", plus an error state with a recovery button. That's the full set, and it's wired to real `isLoading`/`isReady`/`error` flags.
2. **Hero combobox accessibility.** `role="combobox"`, `aria-activedescendant`, `aria-controls`, `aria-expanded`, `role="listbox"`/`option`, roving selection via arrow keys. This is correctly implemented ARIA, not decoration.
3. **Restraint in the modal result row.** Avatar + title + one-line description + a few quiet badges, with rating/coffee-count right-aligned. Reads like a directory entry, not a SaaS card.

## Priority Issues

- **[P1] Hero dropdown uses dark text tokens on a dark glass panel.** Inside `bg-black/45`, descriptions use `text-muted-foreground` (oklch(0.48 0.04 80) — a mid-dark brown) and the placeholder is `text-white/40`. Dark brown on near-black fails WCAG AA badly; `white/40` placeholder also misses the 4.5:1 floor the design rules call out explicitly. **Why it matters:** result descriptions and flavor metadata are effectively invisible in the hero — the discovery surface users hit first. **Fix:** on the dark panel, switch body to `text-white/90`, secondary to `text-white/65`+ (verify ≥4.5:1), placeholder to `text-white/70`. Don't reuse cream-surface tokens on a dark scrim. **Command:** `/impeccable adapt` (or `audit` for the full contrast sweep).

- **[P1] Glassmorphism violates the committed design system.** The hero dropdown's `backdrop-blur-md` + translucent white fills contradict "depth via surfaces, not blur," the Flat-Paper Rule, and the Warm-Shadow Rule (`shadow-2xl` is an untinted neutral). DESIGN.md sanctions a **dark scrim** for on-media UI (`bg-black/25`, the `onMedia`/`chip` button variants), not glass. **Why it matters:** it's the one surface that makes the site look templated, against an otherwise disciplined system. **Fix:** rebuild the panel on a solid/scrim surface — warm-paper popover that sits below the hero, or a dark `bg-black/70` scrim with coffee-tinted shadow — and drop the blur. **Command:** `/impeccable quieter`.

- **[P2] Two visual languages for one result row.** The modal row (`size-12` avatar, `gap-4`, `py-3`, `text-body`) and the hero row (`size-10`, `gap-3`, `py-2`, `text-caption`) are independently styled renders of the same `SearchableItem`. **Why it matters:** consistency is the lowest heuristic score; the same coffee looks like two different things depending on entry point. **Fix:** extract one `SearchResultRow` with a `density`/`onMedia` prop and use it in both. **Command:** `/impeccable distill`.

- **[P2] The ⌘K shortcut is invisible.** It's wired in `use-search.ts` but nothing on the page advertises it — no `⌘K` badge on a trigger, no hint in the hero. **Why it matters:** Recognition-not-recall; power users never discover the fastest path. **Fix:** add a small `⌘K` kbd hint to the hero input's right edge (or a header search trigger). **Command:** `/impeccable delight`.

- **[P2] Debug `console.log`s shipped in `use-search.ts`.** Lines 107–110 log `"[useSearch] open() called"` and state transitions on every open. They're stripped from prod bundles per CLAUDE.md, but they're noise in dev and shouldn't be in committed code. **Fix:** delete them. **Command:** `/impeccable polish`.

## Persona Red Flags

**Sam (Accessibility-dependent):** Hero result descriptions and flavor badges are dark-on-dark — a low-vision user gets no readable secondary text. Placeholder at `white/40` is below contrast minimum. The emoji `⭐` rating announces inconsistently across screen readers and conveys "rating" by glyph alone. Modal side is much better.

**Jordan (First-timer):** Types two characters in the hero, gets gibberish, and the dropdown silently doesn't appear (hero renders nothing when results are empty) — no "no results" feedback until they press Enter and the modal tells them. Ambiguous: did search break, or is there nothing? Also no visible hint that ⌘K or even the search button does anything different.

**Casey (Distracted mobile):** Hero input reserves `pr-32` for a text "Search" button + clear button; the long placeholder "Search by name, roast, region or flavor" risks clipping on narrow screens. Dropdown `max-h-[420px]` glass over a hero photo is heavy on a phone. Touch targets on the `h-8 w-8` clear button are at the 32px edge, under the 44pt guidance.

## Minor Observations

- `showLoadingState = !(error || isLoading || isReady)` labels the *not-yet-started* state "Loading search index…" — copy slightly misdescribes the state.
- Hero `Escape` clears the entire query and blurs; users often expect Esc to just dismiss the dropdown and keep their text.
- Emoji `⭐` rating vs an `Icon` star — the rest of the app uses the `Icon` system; the emoji is an outlier.
- `z-50` on the hero dropdown is an arbitrary value; the skill calls for a semantic z-index scale.
- Rating guard `item.metadata.coffee?.rating &&` hides a legitimate `0.0` rating (falsy) — edge case.

## Questions to Consider

- What if the hero dropdown *were* the command palette — one component, opened inline vs. as a modal?
- Does the hero search need its own dropdown at all, or should typing + Enter just open the (better) modal?
- What would a confident on-media treatment look like that reads as "field guide," not "glass dashboard"?
