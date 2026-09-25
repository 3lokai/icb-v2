# Image alt text + heading hierarchy — plan

**Date:** 2026-09-18 · **Status:** steps 1–4 shipped (PR #164); only step 5, the re-crawl, remains · **Source:** `icb-claude`
`seo/site-recommendations/backlog.md` items `[image-alt-shared]` (Medium) and
`[heading-hierarchy]` (Low), originally raised 2026-06-15, partially verified 2026-07-18,
re-crawled 2026-08-15.

Verified against this checkout on 2026-09-18 (`dev`, clean tree). Both items were written as
"not source-determinable — needs a rendered-page audit". They now largely **are**
source-determinable, and the picture is much smaller than the original findings. Most of what
remains is not what either item described.

---

## 1. Image alt text — the original finding is closed; what's left is alt *quality*

### What's actually true now

Every `<Image>` and `<img>` in `src/` carries an `alt` prop. **67 occurrences across 44 files,
zero without `alt`** (scanned 2026-09-18, brace-aware so multi-line JSX props are counted).

The original "9 of 22 homepage images missing alt" finding no longer reproduces at source level,
and there is a structural reason it can't regress silently: `eslint.config.mjs:2` extends
`eslint-config-next/core-web-vitals`, which already ships `jsx-a11y/alt-text`. **Do not add
`eslint-plugin-jsx-a11y`** — the rule is already enforced. If you want it to block rather than
warn, override it to `"error"` in the existing rules block (`eslint.config.mjs:18-38`); that is
the whole change.

### What's left

Presence is solved. Usefulness isn't. Three groups, all small:

**(a) Placeholder alt that shipped — fix these, they're bugs not judgment calls**

| Location | Current | Problem |
|---|---|---|
| `src/components/profile/ProfileGearStation.tsx:469` | `alt="Mock Station"` | literal placeholder text in production markup |
| `src/components/profile/ProfileGearStation.tsx:540` | `alt="Mock Station"` | same |

**(b) Decorative images described as if they were content — should be `alt=""`**

An empty alt is the *correct* value for a purely decorative image; a description makes a screen
reader announce furniture. Two images already do this right
(`HeroVideoBackground.tsx:60`, `BrewIconsRow.tsx:94`). These don't:

| Location | Current | Should be |
|---|---|---|
| `src/components/curations/CurationHeader.tsx:20` | `alt="Curated Selections Background"` | `alt=""` |
| `src/components/contactus/NewsletterSection.tsx:151` | `alt="Coffee community"` | `alt=""` |
| `src/app/(main)/coffees/page.tsx:334` | `backgroundImageAlt="Coffee beans background"` | `""` — and the same call on `roasters/page.tsx:269` and every other `PageHeader` hero background |

`PageHeader`'s `backgroundImageAlt` is the shared one worth deciding once: it is always a
decorative hero backdrop behind the H1. Defaulting the prop to `""` in
`src/components/layout/PageHeader.tsx:31` fixes every caller at once and is the smaller diff
than editing each page.

**(c) Generic alt on content images — worth a pass, low urgency**

These describe a category rather than the image, on templates that render across many pages:

- `src/components/discovery/RoastProfileTabbed.tsx:130,176,224,288` — `"Coffee beans visual characteristics"`, `"Coffee roasting process"`, `"Coffee in the cup tasting notes"`, `"Brewing instructions"`
- `src/components/discovery/BrewMethodProfileSection.tsx:148,184` — `"Brewer Mechanism"`, `"Indian Specialty Context"`
- `src/components/discovery/ProcessProfileSection.tsx:236` — `"Indian Specialty Context"`
- `src/components/cards/RoasterLogo.tsx:90` — `alt={name}`; a logo should read `${name} logo`, which the two fallback branches at `:58` and `:139` already get right

Not a bug, and not worth a sweep on its own — batch it with whatever next touches those files.

### Verify

`jsx-a11y/alt-text` at `"error"` + `npm run lint` covers presence permanently. Quality needs
eyes, not a crawl — the 2026-08-15 full-site crawl already reports zero missing-alt.

---

## 2. Heading hierarchy — one real defect, with a found root cause

### The homepage multiple-H1 is real, and it is not an authoring mistake

There is exactly **one** `<h1>` in the homepage component tree:
`src/components/homepage/hero/HeroPrimaryCopy.tsx:64`, inside `HeroPrimaryHeadline`.
`heroCopy.ts:5` even documents the intent — *"Single SSR h1"*.

But `HeroPrimaryHeadline` is rendered from **two** places:

- `src/components/homepage/hero/HeroControl.tsx:6` — the real, streamed hero
- `src/components/homepage/hero/HeroSuspenseFallback.tsx:24` — the Suspense fallback

and `src/app/(main)/page.tsx:108-110` wires them as
`<Suspense fallback={<HeroSuspenseFallback />}><HeroSection /></Suspense>`.

With streaming SSR, the fallback shell is flushed first and the real hero arrives in a later
chunk. **The raw HTML document therefore contains two `<h1>` elements.** React swaps them on
the client, so a browser and a JS-executing crawler see one — but a non-executing crawler
(including the one that produced the 2026-08-15 finding) sees both, on the site's
highest-value page. That's why the finding is new: the contentful fallback that causes it was
added for FCP, and the comment at `HeroSuspenseFallback.tsx:4-9` explains why it deliberately
renders real copy rather than a pulse placeholder.

### Fix

Keep the contentful fallback — it exists for a measured FCP reason. Just stop it from emitting
a second `h1`:

- Give `HeroPrimaryHeadline` an `as` prop defaulting to `"h1"`
  (`src/components/homepage/hero/HeroPrimaryCopy.tsx:58`), rendering the same classes either way.
- `HeroSuspenseFallback.tsx:24` passes `as="p"`. The fallback keeps identical visual weight and
  identical contentful text for FCP; only the tag changes.
- `HeroControl.tsx` is untouched and keeps the `h1`.

The alternative — dropping the headline from the fallback — would undo the FCP work, so don't.

### The `/coffees` and `/roasters` H1→H3 skips look already fixed

The 2026-08-15 crawl listed these two as the only remaining skips. In this checkout both now
have the missing H2 level, each with a comment saying so:

- `src/components/coffees/CoffeeDirectory.tsx:104-107` — *"Section heading — single anchor above the filter bar"*
- `src/components/roasters/RoasterDirectory.tsx:82-85` — *"Section heading — single anchor above the directory"*

Chain is `h1` (`PageHeader.tsx:58`) → `h2` (directory) → `h3` (`CoffeeCard.tsx:203`,
`RoasterCard.tsx:153`). The Suspense skeletons (`CoffeesPageContentSkeleton`) contain no
headings at all, so the streamed shell doesn't introduce a skip either. **Treat both as fixed
pending the next crawl** rather than re-working them.

### One page the source can't settle

`/roasters/partner` renders `PageHeader` (→ `h1`) at `PartnerPageClient.tsx:688`, but the file
also defines `h3`s at `:93`, `:277`, `:532` and `h2`s from `:583` onward. Whether any `h3`
lands before the first `h2` in the *rendered* order depends on the component composition, not
the file order, so this one genuinely needs the crawl. The other seven pages from the original
9-page list each resolve to a single `h1` via `PageHeader` with `h2`/`h3` below it.

### Verify

Re-run the crawl (`audit.py` in `icb-claude`, which produced the 2026-08-15 baseline) after the
hero change. Expect: `/` drops to one H1; `/coffees` and `/roasters` show no skip;
`/roasters/partner` is the only open question.

---

## 3. The `/coffees` short-meta-description flag also looks stale

The same 2026-08-15 run flagged `/coffees` for a too-short meta description. The indexable
(unfiltered) description is built at `src/app/(main)/coffees/page.tsx:74` and renders as
~117 characters — within range. The genuinely short variants (`:78-88`, e.g. *"Browse coffees
from selected roasters…"*, 80 chars) only fire on filtered views, and those are `noindex` by
the rule at `:106-112`. Nothing to fix; confirm on the next crawl and close the flag.

---

## Order of work

1. `HeroPrimaryHeadline` `as` prop — the only finding with a real, live, diagnosed defect.
2. Two `alt="Mock Station"` placeholders.
3. `PageHeader` `backgroundImageAlt` default to `""`, plus the two other decorative alts.
4. `jsx-a11y/alt-text` → `"error"` so (2) and (3) can't come back as *missing* alt.
5. Re-crawl; close `[heading-hierarchy]`, `[image-alt-shared]` and the `/coffees` meta flag on
   the evidence, or reopen `/roasters/partner` alone.

Steps 2–4 are a single small commit. Step 1 stands alone because it touches the hero's
streaming path.
