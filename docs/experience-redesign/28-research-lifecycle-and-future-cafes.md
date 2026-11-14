# 28 — Product Research Integration: Discover → Save → Try → Review

**Status (2026-11-14): RESEARCH COMPLETE; UX/DATA CHANGES PROPOSED.** Added to the existing `design/experience-redesign` branch as a decision aid, not as authority to change production, routes, persistence, or approved design foundations. Cross-references: [07 decisions](07-decisions.md), [17 business north star](17-review-intelligence-and-monetization.md), [20 direction](20-direction.md), [24 IA](24-information-architecture.md), [25 hierarchy](25-page-hierarchy.md), [26 components](26-component-system.md).

## 1. Executive conclusion

Keep the approved **Find, Rate, Buy** experience, familiar directory filters, independent ratings, direct external roaster purchase, and the neutral/continuous homepage. Extend its interaction model with a *lightweight personal coffee lifecycle*:

**Discover → Want to Try (save) → Tried → Optional Rating / Review → Return / Rediscover.**

These are possible paths, **not a compulsory funnel**: an experienced visitor may search → rate immediately, and a shopper may search → buy without an account or wishlist. A saved coffee is intent, not a purchase; a click to a roaster is a referral, not a purchase; a rating reflects a self-reported experience, not a verified transaction.

Do not restart identity, IA, or component foundation work. Gambetta + Ranade, Deep Roast, shadcn-at-source, the approved coffee cards and mobile Rate/Buy bar stay. The new work is primarily the **meaning and placement of actions**, **profile/returning state**, and **instrumentation**.

## 2. Evidence from other products (patterns, not templates to copy)

| Reference | Observed pattern and source | Application | Not to copy |
|---|---|---|---|
| Letterboxd | Watchlist, watched and dated diary are different operations. Marking watched can be lighter than logging and reviewing. [Official watched vs diary help](https://support.letterboxd.com/hc/en-us/articles/15178778774543-What-s-the-difference-between-marking-a-film-watched-and-logging-it); [watchlist help](https://support.letterboxd.com/hc/en-us/articles/15179261056143-What-s-the-difference-between-my-lists-and-my-watchlist) (updated Sept 2026). | One-tap “Tried” independent of a rating, separate Want to Try and optional brew diary. | Its automatic removal from watchlist on watched: a coffee can be bought again, re-roasted or re-released. |
| Untappd | Drink check-ins, wishlist/lists, community and personalized discovery; broad redesign launched Oct 15, 2026. [Official redesign](https://untappd.com/blog/welcome-to-the-all-new-untappd/1967); [5.0 guide](https://help.untappd.com/hc/en-us/articles/54602318106516-Getting-Around-Untappd-5-0). | Separate repeated tasting/brew entries from the single displayed community coffee rating. | Badges/streaks, location-heavy mobile tab bar, app-only controls. |
| Artsy | Controlled vocabulary and “genes” link works and artists. [Art Genome overview](https://www.artsy.net/article/artsyed-the-art-genome-project); [published vocabulary](https://github.com/artsy/the-art-genome-project). | Every factual coffee attribute provides an understandable doorway to a precise landing or filtered directory. | Prominent literal node graph, unverifiable AI-generated links. |
| Google Arts & Culture | Multiple accessible exploration entry points and editorial context. [Explore](https://artsandculture.google.com/explore). | A living homepage with coherent transitions, real new coffees, reviews, origins and reading routes. | A visual museum with no clear Find/Rate/Buy jobs. |
| The Pudding | Visual/scroll explanations require mobile and responsive care. [Responsive scrollytelling notes](https://pudding.cool/process/responsive-scrollytelling/). | Motion explains connections and supports continuity. | Scroll hijacking, pinned galleries as mandatory navigation. |
| Linear | Reduction of hierarchy/noise in a dense interface. [Design refresh](https://linear.app/now/behind-the-latest-design-refresh). | Clear labels, shadcn primitives, compact product cards, credible data-density. | A wholesale aesthetic or component library switch. |
| Specialty Atlas | “Beans on bar”, cafe discovery, check-ins/events and business tools. [About](https://specialtyatlas.com/about/). | Potential future Coffee ↔ Roaster ↔ Café ↔ Currently served relationship, subject to freshness. | Generic café listings, menus, orders and reservations. |
| European Coffee Trip | Curated specialty cafés and roasters with premium commercial profiles. [Site](https://europeancoffeetrip.com/); [advertiser information](https://europeancoffeetrip.com/advertise/). | Validate specialized demand and pilot availability, without creating a generic café marketplace. | Paid prominence in ICB's neutral organic recommendations. |

Research examples illustrate useful product patterns; they do **not** establish commercial viability for ICB. Do not quote competitor counts or conversion claims as ICB benchmarks.

## 3. What ICB already has — avoid inventing a new feature

Branch inspection on Nov 14:

- `CoffeeCard.tsx` already composes `WishlistButton` and `CardRatingFooter`. The approved card spec in [25 §1](25-page-hierarchy.md) explicitly keeps both and **no Buy button on cards**.
- `WishlistButton.tsx`, `use-wishlist.ts`, `src/app/actions/wishlist.ts` and `wishlists` support signed-in wishlist saving. Current signed-out behavior is a sign-in toast; the server action requires authentication; `wishlist_added` and `wishlist_removed` are already captured server-side. **Do not claim anonymous wishlist persistence exists.**
- `supabase/migrations/20260211000000_create_user_coffees.sql` **already defines** `user_coffees` as a tried/tasted lifecycle table with one row per member+coffee and statuses `logged`, `brewing`, `finished`, `rated`. `src/types/profile-types.ts` includes `UserCoffee`, and the profile RPC/fetch code exposes `user_coffees`. This is a significant **reuse-first opportunity**; do not propose a duplicate Tried table. A usable current write action or visible entry control was **not established** in this code inspection (the historical `src/app/actions/user-coffees.ts` referenced in an old analytics report is absent on this branch). Verify the real path and whether/how rows are populated.
- Quick rating, anonymous three-distinct-entity allowance and member profile/rating history exist. The approved coffee detail has a sticky **Buy + Rate** bar on mobile, and the existing exit-intent rating popup is slated for removal.
- [24](24-information-architecture.md) and [25](25-page-hierarchy.md) already specify a neutral homepage, returning-user state, clickable attributes, profile-based private wishlist, no separate `/rate` or `/search` pages, and no extra global bottom tab bar.

**Actual gap:** a **Tried schema already exists**, but its live UX and write flow are not established here, and the saved → tried → rated journey is not an approved end-to-end interaction. Audit real usage and potentially reuse `user_coffees`; do not start by inventing a new status table.

### Privacy and reuse warning from repository audit (2026-11-14)

The checked-in migrations for **both** `user_coffees` (Feb 11) and `wishlists` (Jul 15) define SELECT policies that allow reads when the linked `user_profiles.is_public_profile` is true, **as well as** owner reads. This does **not** prove the deployed database has those exact policies now, but it means **“private by default” cannot be asserted from the current schema evidence**. The approved profile design expects owner-only Wishlist. Before building any personal lifecycle UI or exposing personal endpoints, verify the **effective deployed RLS**, RPC security and row visibility to other users (including public-profile users); tighten policies via separately reviewed migration if necessary. Never pass the existing profile-public setting through to personal wishlist/tried data by accident.

`user_coffees.status` historically tracks a **bag progression** (`logged/brewing/finished/rated`), not merely a boolean “ever tried” flag. Before reusing it, decide whether “logged” implies actually tasted, whether a second bag needs a separate log record (currently `UNIQUE(user_id, coffee_id)`), and how a review affects status. **Avoid mapping saved wishlist → logged → rated automatically.**

## 4. Proposed semantics — orthogonal signals, not one mutable status

| Concept | Created by | What it DOES mean | What it DOES NOT mean | Privacy |
|---|---|---|---|---|
| Viewed | page/event (consent-aware) | Looked at this item | Saved, bought or tasted | Browsing context, according to consent |
| Want to Try / Wishlist | explicit save | Interested, would like to remember | Purchased or tried; not guaranteed future sale | **Target: private; current migration needs RLS review** |
| Tried | explicit “I tried this”, or a self-submitted rating logically linked to tasting | User reports having tasted it | Purchase verified, review submitted, positive opinion | **Target: owner-only; existing RLS policy needs review** |
| Rating | user-entered score | Personal opinion of a tasted coffee | Multiple independent reviewers from repeated brews | Existing review publication/moderation rules |
| Review | user-authored notes on a rating | Additional independent context | Roaster marketing description | Existing publication/moderation rules |
| Brew/tasting log (later) | repeated explicit dated entries | One brewing session; multiple possible per coffee | An extra independent rating in the public average | Private by default |
| Buy/referral click | outbound link event | User left ICB towards merchant | Sale, delivery, payment or tasting | Consent-aware analytics |
| Confirmed purchase (partner pilot only) | verified merchant-side attribution | An attributable conversion by agreed method | A tasting or review | Avoid individual-level commercial disclosure |

These flags may overlap. In particular, **Tried does not require a rating**, and **Want to Try and Tried may coexist** (replenishment, another roast/harvest). First prototype: keep both explicit; **do not silently clear a wishlist save** after marking Tried. Study whether to offer an optional “Remove from Want to Try” nudge.

**Ratings and repeat logs:** preserve existing single-member rating semantics and anti-abuse restrictions; later brew diary entries must not multiply public coffee ratings. Editing or deleting a rating must not silently destroy an independently marked Tried state. Define migration precedence only after audit.

**Identity:** a displayed roaster product, release/harvest and shared estate/variety/process attributes are not necessarily the same underlying coffee. A discontinued listing must remain rateable and keep saved/tried history. Similar/replacement coffees are recommendations, not exact replacements.

## 5. Page-by-page UX changes for prototype (PROPOSED)

| Surface | Keep | Add/test |
|---|---|---|
| Coffee card (directory/landings/home) | Pack image first, quiet wishlist icon, compact rating footer, no Buy button, card variants | Tooltip/accessible label “Want to try” vs “Saved”; no new full-size Tried button. Optionally expose Tried via a secondary action menu **only if user testing supports it**. |
| Coffee detail | Filled Buy, outlined Rate, wishlist, clear data provenance, mobile sticky Buy/Rate | Small secondary “Mark as tried” / “Tried ✓” near personal actions, distinct from public rating; one short follow-up “Add a rating?” after marking, dismissible. |
| Rating flow | One-tap stars, existing three-anon-entity limit, optional notes, review editing | When rating succeeds, reflect Tried without double-counting; do not require a prior Tried click, and do not claim a finished review until persistence succeeds. |
| Profile (owner) | Profile distinct from Settings; Ratings, private Wishlist, Gear and shareable picks | “Want to try” and “Tried” views, with Ratings as the existing separate view; first design should avoid gratuitous extra tabs. Saved/tried may be private even if public ratings are displayed. |
| Returning homepage | Neutral for anonymous, personal for authenticated users; search remains stable | Resume saved items and *explicitly* tried but unrated items; avoid prompts on merely viewed or referred coffees. |
| Search and discovery | Approved grouped global search, familiar facets, same canonical URLs | Preserve wishlist state in search results; possibly provide personal collection filtering after UX validation. |
| Connected data | Estate/region/flavour/process/roaster doorway links | A short “Why related” reason from verified data (same estate, same process, etc.), not a mysterious algorithm. |
| Notifications (later) | Existing notification preferences | Optional opt-in for saved coffee back-in-stock, new releases and price signals, with source/freshness. |

**Anonymous save OPEN:** compare (A) existing sign-in toast, (B) session-local save with a clear “save permanently by signing in” affordance, and (C) anonymous ID sync as a separately secured implementation. No claim of cross-device persistence without an account. Keep 3-anonymous-rating rule separate from save limits.

**Avoid product clutter:** no global tab bar, no new public Wishlist directory, no “Try/Rate/Buy/Save” button row on every card, no compulsory questionnaire, no forced login before browsing or rating when existing anonymous rules allow it.

## 6. Journey prototypes / acceptance

Test **four** complete mobile-first flows in Penpot and, after component QA, a stateful Next.js review surface:

1. **New visitor:** homepage / external search → coffee directory or deep link → Want to Try → return → mark Tried → optional rating → profile (with anonymous/auth friction visible).
2. **Already tried:** direct deep link → Rate now (no save or Tried prerequisite) → optional notes → profile ratings.
3. **Shopper:** filter → coffee → Buy ↗ merchant → return without inferred purchase/tasting → optional “Have you tried it?” later; no auto-check-in.
4. **Returning member:** Profile/returning homepage → saved/tried/unrated items → related estate, flavour or process coffee → save another.

Show real versus illustrative data explicitly. Also test sold out, discontinued, no product URL, no rating, authenticated/anonymous, and light/dark/mobile/reduced-motion. All behaviour must remain usable without the optional motion layer.

## 7. Metrics and events — avoid misleading funnels

**Already present:** `wishlist_added`, `wishlist_removed`, `rating_started`, `rating_form_submitted` (validate semantics, duplication and privacy). Reuse existing event names instead of creating duplicates.

**PROPOSED new events** (final names after PostHog/event catalog audit): `coffee_marked_tried`, `coffee_unmarked_tried`, `tasting_logged` (later), `coffee_related_link_clicked`, `coffee_referral_clicked`. Record a **successful user action** separately from an attempted click; tag placement, coffee ID, session/identity with consent, listing availability, and source context where justified. Avoid sending raw review text, PII, an inferred taste profile or merchant order IDs to generic analytics.

Measure:
- Unique visitors saving one coffee; percentage returning and saving a second.
- Want-to-Try → explicit Tried (eligible cohort and time window, not all-time click division).
- Tried → independent rating, including after a delayed return.
- Unique valid published reviews, independent contributors, and breadth of reviewed coffees.
- Coffee detail → attributable outbound click; **confirmed merchant sales only with actual partner proof**.
- Mobile time-to-task, scroll reach, LCP, CLS, a11y and user-reported clarity.

Do not use wishlist clicks as proof of purchase, and do not infer an exact conversion from non-deduplicated event totals. For a low-data product, publish sample sizes and uncertainty.

## 8. Revenue — an experiment, not a new incentive for biased ranking

1. **Early pilot: attributable referrals to participating roasters.** Start with merchant-approved links/codes and transparent disclosure. Validate paid orders and attribution; set commissions per agreement. A generic outbound click is *not* commissionable revenue.
2. **Later: aggregated Roaster Intelligence.** Only with appropriate thresholds, meaningful independent coverage, consent/privacy safeguards and a demonstrated buyer need. Never sell individual wishlists, personally identifiable tasting history or access to private interests.
3. **Existing long-term paths:** methodology-led reports and licensed *permitted* normalized data/API access; separate ads/sponsorship explicitly from neutral results.
4. **Availability/alerts:** potential return driver and later merchant opportunity, but only when stock signals are fresh and opted into.

No paid positive ratings, no suppression of criticism, no hidden sponsored recommendation, and no commercial changes to organic ranking or factual relationships.

## 9. Cafés: related entity, NOT scope expansion now

**PROPOSED FUTURE MODEL:** `cafe` → `serves_roaster` (relatively stable) and `coffee_on_bar` (timestamped, high-churn) → existing coffee/release identity; optional brew method and verified visit/check-in. Surface as contextual “Try at a café” on coffee/roaster pages *only when evidence is fresh and reliable*.

**DEFER:** generic café directory, full food menus, delivery, payments, reservations, venue ratings, and a primary-nav Cafés item. A focused limited-city pilot is an idea to evaluate separately, not an approved rollout. Specialty Atlas and European Coffee Trip validate a category of experiences, not ICB's Indian unit economics.

## 10. Execution boundary while component agents work

- **Now:** docs/decisions, interaction state definitions, validation plan and references; no edits to `src/components/ui`, global tokens, playground, Penpot files or production routes.
- **Next (read-only audit):** inspect **deployed RLS first**, then existing `user_coffees` writes/status usage and `wishlists` reads, reviews, onboarding, anon-to-member merge, duplicate-policy, India privacy obligations, PostHog naming and referral events. Reuse existing tables where safe; any migration comes *after* evidence.
- **Prototype after the UI foundation review:** a branch-only stateful scenario using genuine domain components, with fake clearly labelled data and no writes to production.
- **Owner acceptance gate:** decide whether an explicit Tried state merits implementation; anonymous save policy; profile grouping; analytics taxonomy; partner attribution and any disclosure text.
- **No unapproved production change.**

**Success criterion:** people can find/buy or rate immediately **and** voluntarily create a meaningful personal coffee history that improves their next visit, without decreasing neutrality, SEO reach, accessibility or mobile speed.
