# SEO Backlog Triage

Source: `icb-claude/seo/site-recommendations/backlog.md` — the 19 Pending items as of 2026-09-26.
Spot-checked against icb-v2 `144bcf8` (`dev`). Each item keeps its backlog `[id]` so it can be
matched back.

## a. Ignore / not needed (6)

- **[csp-nonce]**: in Next.js, a nonce CSP makes every page render dynamically, which gives up
  static/ISR caching on a mostly-static directory. There is no user-generated HTML to protect, and the
  other four security headers are already live. The `ponytail:` marker at `next.config.ts:187` stays.
- **[canon-origin-scope-indicator]**: mostly settled by the India-only scope for regions and estates.
  What remains is a foreign-origin badge on coffee cards, which is cosmetic and needs the
  `sumatra`/`central-america` `country` data fix first.
- **[roaster-community-rating-campaign]**: ops/outreach work (target 0-rating, high-impression roasters),
  not code.
- **[canon-estate-altitude]**: a data backfill via `/enrich-canon`. The site side
  (`formatAltitudeLabel`) already shipped.
- **[posthog-notfounderror-filter]**: deliberate hold. Re-decide on or after 2026-10-25 against a
  30-day PostHog pull; the outcome is either close the item or make a one-line `NOISE` addition.
- **[estates-hub-page]**: the backlog itself says ~20 detail pages don't need an index. Fold it into
  [estate-detail-pages] if that ships.

## b. Quick wins (5)

- **[discovery-editorial-intro-species-region]**: **mostly already shipped.** `intro` renders above
  the grid (`DiscoveryLandingLayout.tsx:209`, grid at `:315`), and the FAQ section plus FAQPage schema
  render too (`:161`, `:410`). Remaining work: add an optional `definition?: { heading; body }` to
  `LandingPageConfig` (`src/lib/discovery/landing-pages/types.ts`), render it between the intro and the
  grid, and write 45–60 word copy for liberica / excelsa / coorg / chikmagalur using the briefs.
- **[roaster-about-fields]**: the data is already in Supabase (`founders` 82/117,
  `notable_achievements` 70/117). Select the fields in the roaster fetch and render them in
  `RoasterDetailPage.tsx`'s about / "At a glance" block, hiding each one when it is null.
- **[author-byline-pages]** (part 3): add the new author fields (`linkedin`, `github`, `website`,
  `jobTitle`) to the author GROQ query in `src/lib/sanity/queries.ts`, then emit `Person` +
  `ProfilePage` JSON-LD on `learn/author/[slug]/page.tsx`, using `founderPersonSchema` in
  `src/lib/seo/schema.ts` as the model. Instagram stores a handle, so it needs composing into a URL.
  Filling in the values in Studio is a separate content task.
- **[sku-estate-cross-lots]**: the backend exists. `fetchEstateBySlug`
  (`src/lib/data/fetch-estate-by-slug.ts`, `get_estate_detail` RPC) returns the estate's full coffee
  list and is currently used only by `api/estates/[slug]`. Call it on the SKU page, drop the current
  coffee, and render a compact card row when 2 or more lots remain.
- **[roaster-contextual-links]**: a static map from `specialty_focus` / sourcing region to `/learn`
  slug, rendering 1–2 "Read more" links under the roaster about text.

## c. Needs deeper code edits (5)

- **[discovery-sort-feedback]**: `rating_desc` sorts on raw `rating_avg` (`fetch-coffees.ts:281-285`),
  so single-vote 5.0s lead the list. Needs a confidence-weighted (Bayesian) rating column in
  `coffee_directory_mv` (migration + `supabase:types`), `rating_desc` switched to order on it, and an
  "unrated from here" marker in the grid.
- **[discovery-comparison-table]**: an SSR "Top 5 Rated" table in `DiscoveryLandingLayout`. It is
  blocked on the sort fix above, because only 12 coffees have 3 or more ratings.
- **[sku-comparative-data]**: needs region / roast-level sensory averages (RPC or MV) plus an overlay
  on the `CoffeeSensoryProfile` radar.
- **[rating-start-rate]**: only 1.6% of views on rateable pages start a rating. Rework the entry point
  across `CoffeeHero`, `RoasterHero`, `QuickRating` and `CardRatingFooter` (prominence, above-fold
  placement, the sign-in expectation). Pair it with Clarity recordings.
- **[home-abovefold-engagement]**: rework the hero proposition in `src/app/(main)/page.tsx`. First
  confirm in recordings that the quickbacks aren't navigational (coffee → back).

## d. New feature / full dev run (3)

- **[estate-detail-pages]**: a new `/estates/[slug]` route generated from a query
  (`country = 'India' and description is not null and coffee_count >= 3`). The RPC and fetch already
  exist. Blocked on `canon_estates` enrichment (179/187 estates have no description).
- **[article-conversion-module]**: cross-repo work. It needs a Sanity block type, the outliner/writer
  skills emitting a marker block, and a 3-slot site component (rating prompt, directory-filter CTA,
  partner block).
- **[sku-brew-recipe-params]**: new data ingestion for roaster brew recipes, a new column + migration,
  and a per-method recipe UI.
