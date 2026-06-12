# Sprint 7 — Out-of-Scope Backlog (site-wide sweep + blog consistency)

> **Status: 🟡 In progress** (updated 2026-06-12). Records tells on surfaces **no earlier sprint
> (0–6) scoped**. §7.A (site-wide `text-accent italic` sweep) is **done** and §7.B (blog heading
> consistency) is **done**; `blog/ArticleSidebar.tsx` in §7.C is **deleted**. Remaining: §7.C's 4
> homepage orphans (their accent tic is now converted, so deletion is optional cleanup, not a tell fix).

Sprints 0–6 deliberately scoped a fixed set of surfaces (homepage, marketing, learn hub + article,
directory, discovery, cards). While verifying those, two classes of debt surfaced **outside** that
scope. Capturing them here so they aren't lost, and so a future pass can be planned as one coherent
unit instead of ad-hoc.

---

## 7.A Site-wide accent-word tic sweep ✅ DONE (2026-06-12)

**Shipped:** every exact `<span className="text-accent italic">…</span>` across the app converted to
the locked `<Accent>` brush-smear — **73 spans / 48 files** in the final codemod pass (legal pages,
reviews, profile, dashboard, discovery, coffees, roasters, tools, curations, collections, communities,
contactus, partner, and the 4 homepage orphans), plus the **8 `faqs/`** headers converted earlier in
the FAQ pass. Modal emphasis (`QuickRating` / `ReviewCapture` "Brew?/Experience?") included per the
decision below. **Verified:** `grep '<span className="text-accent italic">' src` → 0 results;
`npm run type-check` + lint clean. Intentionally left untouched (a *different* pattern, not the
accent-word tic): whole-heading `font-serif italic text-accent` (`ProfilePage`, `ProfileTasteProfile`,
`ProfileAtAGlance`), the `text-micro text-accent italic` label, editorial pull-quotes
(`text-accent-foreground`), and hover-states (`group-hover:text-accent`).

**The finding (historical):** the italic-serif accent-word tic the redesign targets was written **two ways** in the
codebase, and the sprint greps only ever caught one of them:

- `text-accent italic font-serif` — the form the sprint docs name. Now fully converted on the scoped
  surfaces (and in `learn` + `learn/insights`), leaving only the intentional `blog/blocks/*` bylines.
- `text-accent italic` (**no** `font-serif`) — the *same visual tic*. Headings already render in
  Fraunces (a serif), so `italic` alone produces an italic-serif accent word. This variant was never
  greped for, so it survives untouched across the app.

**Scale (verified 2026-06-08, after the homepage conversion):** **82 instances across 56 files.**
Breakdown by area:

| Area | Files | Notes |
|------|-------|-------|
| `app/(main)/*` page files | 11 | legal (privacy/terms/data-deletion/roaster terms), communities, curations, roasters, coffees, tools, partner |
| `faqs/` | 8 | every FAQ block header |
| ~~`homepage/`~~ | ✅ done | The 2 live ones (`HomeCollectionGrid` + `HomeCollectionGridStatic`) were converted to `<Accent>` in Sprint 1 on 2026-06-08. The other 4 are **orphaned dead code** → §7.C, not an accent task. No homepage accent work remains. |
| `reviews/` | 4 | `ReviewStats`, `ReviewList`, `ReviewCapture`, `QuickRating` |
| `profile/` | 4 | dashboard-gated taste/gear/ratings/selections |
| `discovery/` | 4 | `DiscoverySectionIntro` (the shared source), `DiscoveryLandingLayout`, `RegionSnapshot`, `RelatedLinks` — **overlaps Sprint 5**; fixing 5.4 there covers most of these |
| `dashboard/` | 4 | preferences / privacy / notifications / my-reviews |
| `coffees/` | 4 | `CoffeeDetailPage`, `CoffeeSensoryProfile`, `SimilarCoffees`, `CoffeeDirectory` |
| `tools/`, `roasters/`, `curations/` | 3 each | |
| `contactus/`, `communities/`, `collections/` | 1–2 each | |

**Decision taken (2026-06-12):** convert **all** to the locked `<Accent>` brush-smear, modal emphasis
included. The "normalize-don't-convert" alternative was declined — `<Accent>` is now the single
title-emphasis device site-wide. Note: the `discovery/` accent work this section flagged as
overlapping Sprint 5 was completed here, so Sprint 5's 5.4 no longer needs to cover it.

---

## 7.B Blog components — heading consistency pass ✅ DONE (2026-06-08)

The `src/components/blog/*` components were already **clean of the major tells** (no
`text-accent italic`, no `blur-2xl/3xl`, no eyebrow saturation, no em-dashes in copy). The remaining
**heading-hierarchy/consistency drift** has now been resolved. Decisions taken and what shipped:

| # | Item | Decision | What shipped |
|---|------|----------|--------------|
| 1 | Card titles `<h3>` + `.text-title` (`SeriesCard`, featured `PostCard`, `DetailedAuthor`) | **Tiered** — standard grid cards use `.text-heading`; `.text-title` reserved for genuinely large blocks | `SeriesCard.tsx:19` → `.text-heading` (now matches PostCard grid). `PostCard` featured + `DetailedAuthor` keep `.text-title` (large blocks) — intentional. |
| 2 | `ArticleSidebar` label drift | **Moot — deleted** | `ArticleSidebar.tsx` was orphaned (zero importers); deleted entirely → §7.C. |
| 3 | `ArticleSidebar` `<h4>` level skips | **Moot — deleted** | as above. |
| 4 | `FieldGuidePillars` duplicate `<h3>` (flip front + back, same text) | **Make back-face a non-heading** | `FieldGuidePillars.tsx:127` `<h3>` → `<p>` (same visual; screen reader no longer announces each pillar twice; flip untouched). Front `<h3>` preserved. |
| 5 | `ArticleHeader.tsx:69` redundant `md:text-display` | **Fix** | removed; now `text-display … lg:text-hero`. |
| 6 | `ArticleSidebar` placeholder "Share Article" block | **Moot — deleted** | the live page uses the real `ShareArticle.tsx`; orphan deleted. |

**Adjacent fixes found while auditing (not in the original 7.B list, fixed same pass):**

| Location | Was | Now |
|----------|-----|-----|
| `learn/[slug]/page.tsx:198,228` | `<h4 className="text-title">` ("Frequently Asked Questions", "Enjoyed this article?") — level-skip under the article `<h1>` | `<h2>` (kept `.text-title`) — correct outline on the live reading page |
| `learn/{category,author,series}/[slug]/page.tsx` empty states | `<h3 className="text-title">` | `<h3 className="text-heading">` (matches the contract) |
| `ArticleContent.tsx` portable-text `h1` renderer | rendered a second `<h1>` (page already has the title h1) | demoted to `<h2>` (kept largest styling + anchor id). **Verified via Sanity: 0 published + 0 draft articles use a body `h1`,** so zero content impact. |
| `learn/author/[slug]/page.tsx:71` | dead `authorSlug` var (lint warning) | removed |

All changes: `npm run type-check` clean, `npm run lint` clean (zero warnings). **§7.B is closed.**

---

## 7.C Dead-code deletion (orphaned components)

Orphaned components (**zero importers** — not rendered anywhere) that still carry old tells. Deleting
beats converting.

**✅ Done (2026-06-08):**
- `blog/ArticleSidebar.tsx` — deleted. Orphaned; the live article page uses `TableOfContents` +
  `ShareArticle` + `DetailedAuthor` directly. Carried label drift, `<h4>` level-skips, and a dead
  placeholder share block (all §7.B items #2/#3/#6, now moot).

**⬜ Still recommended (homepage orphans, surfaced verifying Sprint 1's accent budget):** these four
`homepage/*` components have zero importers. Their `text-accent italic` tic was converted to `<Accent>`
in the 7.A pass (so they're no longer a tell), but they remain **dead code** (and one carries a
marquee), so deletion is still the right call. Confirm against git history before deleting in case any
are intentionally parked:

| Orphaned component | Carries |
|--------------------|---------|
| `homepage/NewsletterSection.tsx` | accent tic (the *rendered* newsletter is `contactus/NewsletterSection`, used by the contact page) |
| `homepage/HomeDiscoveryPillsSection.tsx` | accent tic |
| `homepage/FeaturesBentoGrid.tsx` | accent tic **+ a `<Marquee>`** |
| `homepage/FeaturedRoastersSection.tsx` | accent tic |

Deleting these removes 4 of the 56 accent-tic files outright (no conversion needed) and clears the
last stray homepage marquee.

> **Note:** `contactus/NewsletterSection.tsx` **is** live (contact page) and carries the `text-accent
> italic` tic — that's a real §7.A item on a Sprint-2 surface, not dead code.

---

## Suggested framing

**7.A and 7.B are done**, and `blog/ArticleSidebar.tsx` (7.C) is deleted. What remains:
- **7.C** — the 4 orphaned `homepage/*` components. Their accent tic was converted in the 7.A pass, so
  they no longer inflate any count, but they're still dead code (zero importers, one with a marquee) and
  worth deleting after a `git log` sanity check.
