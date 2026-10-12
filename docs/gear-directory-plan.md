# /gear — cross-store equipment directory + price comparison

## Goal

One page per product, every place to buy it, cheapest first. Gear is **not** modelled like coffee
(roaster → product). A product exists once; roasters are just one kind of seller next to equipment
shops and marketplaces (Amazon, Flipkart). The user lands from search, compares prices, clicks out to
buy. Programmatic collection pages (by equipment type, brew method, experience level) catalog the
products and carry the SEO.

**Comparison is the launch feature, not a later phase.** `/gear` does not ship as a link directory;
each brew-method wave ships with prices from day one (scraper reuse, Phase 1C).

## Facts that shape the plan

1. **`raw_products` has 2,988 active non-coffee rows across 98 roaster stores** (checked
   2026-10-02), name + URL + `platform` + `platform_product_id`, **no price, no image**
   (`source_raw` null). **Exact-model overlap across roasters is narrow:** after matching, AeroPress
   Original is at 14 stores, AeroPress Go 12, AeroPress papers 10, Hario V60 papers 9, AeroPress Clear
   and V60 plastic 5, Timemore C2 and Hario Buono 4. Most other branded gear is at 1–3 stores.
   (The earlier "AeroPress at 24" was a brand-keyword count.) Roaster-only comparison carries the
   top ~10 products. Past that, Amazon and retailers (Phase 3) are what make it a comparison.
2. **`is_coffee = false` ≠ equipment** — green beans, chocolate, gift cards, workshops are in there
   too. A curated catalog is the filter; nothing auto-publishes.
3. **`gear_catalog` already exists** (`brand / model / category / image_url / is_verified /
   usage_count`) and backs `user_gear`, the profile gear picker and `search_gear_catalog`
   (`src/app/actions/gear.ts`). It becomes the canonical product table, so "N ICB members own this"
   comes free. 10 dirty user-entered rows today.
4. **Vocabularies to reuse, not invent:**
   - Experience level: `beginner | enthusiast | expert` — already the `user_profiles.experience_level`
     check constraint and onboarding enum (`src/lib/validations/onboarding.ts`). Same values → later
     we can default `/gear` to the signed-in user's level for free.
   - Brew method: the 9 brew landing-page slugs in
     `src/lib/discovery/landing-pages/brew-method-pages.ts` (`aeropress, v60, chemex, kalita,
     french-press, espresso, cold-brew, moka-pot, filter-coffee`). Not `grind_enum` — it lacks
     v60/chemex/kalita. Same slugs → `/gear/brew/v60` ↔ `/coffees/v60` cross-link 1:1.

**Shape:**

```
gear_catalog (product) ← gear_offers (sold here, at this price) → gear_merchants → roasters (optional)
raw_products.gear_id   = matching cache: "we identified this source record as X"
```

`gear_offers` is the **authoritative** relationship. `raw_products.gear_id` only remembers a match so
re-runs are idempotent. Nothing under `/gear` reads `raw_products` — if that table is rebuilt,
truncated, or retailers arrive through a different pipeline, `/gear` doesn't notice.

## Phase 1A — Schema (one migration)

`npm run supabase:migration:new gear_directory`, apply, `npm run supabase:types`.

**`gear_catalog` — add:**

- `slug text unique` — `/gear/[slug]`. Brand-model form (`timemore-chestnut-c3`), never a bare method
  name.
- `aliases text[] default '{}'` — matching for today's dirty roaster names, hand-fixed.
- Identifiers, all nullable, **not used for matching yet** — they exist so retailers/marketplaces
  don't force a migration of the canonical model later:
  - `model_number text` (manufacturer SKU / MPN)
  - `gtin text` (EAN/UPC; unique where not null)
  - `manufacturer_url text`
- `description text`, `subcategory text` (`hand-grinder`, `electric-grinder`, `gooseneck-kettle`…).
- `brew_methods text[] default '{}'` — brew landing slugs (a grinder lists several; a Chemex lists one).
- `experience_levels text[] default '{}'` — `beginner|enthusiast|expert`. This is an **editorial
  recommendation** ("who we'd point this at"), not an intrinsic property. Default to multi-level
  assignment: a Timemore C3 is `{beginner,enthusiast}`; a V60 is all three. Single-level only when
  it's genuinely true (a flat-burr espresso grinder is `{expert}`).
- Widen `category` to `grinder | brewer | espresso_machine | kettle | scale | filter | accessory` (filters are their own category: a repeat purchase people search for on its own), and update
  the matching check in the `add_gear` RPC
  (`supabase/migrations/20260129152907_add_gear_management_rpcs.sql` validates only 3 today) plus
  the picker's category list in the same change.
- `image_url` stays as-is, with `comment on column … is 'primary image; gallery table later'`.
  Renaming it to `primary_image_url` means recreating `get_user_profile_full` (rewritten ~8 times
  across migrations) and `search_gear_catalog` for a name change; do it when the gallery table
  actually lands.
- `is_verified` stays the publish gate. No second `is_published` flag.

**`gear_merchants` — new.** Makes "roasters today, retailers and marketplaces tomorrow" a data change.

```
id uuid pk
slug text unique not null           -- 'amazon-in', 'blue-tokai', 'coffee-gear-india'
name text not null
kind text not null check (kind in ('roaster','retailer','marketplace'))
roaster_id uuid unique references roasters(id)   -- set only when kind = 'roaster'
domain text
logo_url text
is_affiliate boolean default false  -- drives rel="sponsored" + disclosure; never sort order
is_active boolean default true
```

Roaster merchants are created by the matcher on first offer (one row per roaster that sells gear).
No priority/quality column — see "Ranking rule".

**`gear_offers` — new**, mirroring `variants` so the scraper contract is the one already in use:

```
id uuid pk
gear_id uuid not null references gear_catalog(id) on delete cascade
merchant_id uuid not null references gear_merchants(id)
source_product_id text not null     -- raw_products.platform_product_id / ASIN / URL when the store has none
source_variant_id text not null default ''  -- '' = whole listing; set only when one store product splits across catalog products
                                    -- (a "Hario V60" listing with 01/02 size variants = two gear rows)
url text not null                   -- mutable: slugs change, redirects happen
affiliate_url text                  -- full pre-tagged URL when one exists
image_url text                      -- merchant's image; seeds gear_catalog.image_url when empty
price_current numeric
compare_at_price numeric            -- MRP / strike-through
currency char(3) default 'INR'
price_last_checked_at timestamptz
in_stock boolean
stock_last_checked_at timestamptz   -- separate: stock goes stale faster than price
status text check (status in ('active','missing','discontinued')) default 'active'
last_seen_at timestamptz default now()
source_raw jsonb

unique (merchant_id, source_product_id, source_variant_id)   -- plain constraint: ON CONFLICT works from TS and Python
index (gear_id)
```

Identity is the merchant's own product ID; URL is just the current address. Hand-entered offers
without an ID use the URL as `source_product_id`.

**`raw_products` — add `gear_id uuid references gear_catalog(id)`**, nullable. Matching cache only.

**RLS:** public `select` on the three gear tables (mirror coffees/roasters); writes service-role only.

## Scope — brew method by brew method, priced for home brewers

**Rollout is one brew method at a time**, not the whole catalog at once. Each wave seeds the
brewer(s) for that method plus the grinders, kettles, scales and filters that go with it. Each wave
goes live when its `brew/<method>` page passes the ≥ 6-product gate and its products have prices.
`type/*` and `level/*` pages fill in as waves land (same gate).

Order (most cross-store overlap first). **Wave 1 is AeroPress + pour-over together**: AeroPress has
by far the most overlap, and the two share grinders, kettles and scales. Seeded in
`scripts/gear-catalog.data.ts`.

1. `aeropress` + `v60` / `kalita` / `chemex`: AeroPress range and filters, V60/Kalita/Chemex/Origami
   drippers and filters, gooseneck kettles, scales, hand grinders
2. (folded into 1)
3. `french-press`
4. `moka-pot`: Bialetti range, matching grinder setting
5. `filter-coffee`: South Indian filters (steel/brass dabara sets), a wave where local makers matter
6. `cold-brew`
7. `chemex`, `kalita` (fold into pour-over if they don't pass the 6-product gate alone)
8. `espresso`: manual/lever (Flair, Picopresso-class) and home machines under the ceiling, plus
   grinders that can actually grind for them. Last, because it's the most expensive wave.

**Price rule: home-brewing kit, not aspiration.** The catalog is curated, so this rule is enforced at
seed time. The matcher can only match seeded products, so anything we don't seed never shows up,
even if a roaster stocks it.

- Hard ceiling per item **₹1,00,000** (1 lakh). Nothing above it is seeded, however many roasters
  stock it. That covers home espresso machines and espresso grinders, not prosumer/café gear.
- Below the ceiling, a product still needs a reason to be in the catalog; "a roaster stocks it"
  isn't one.
- Bias each wave toward the price points people actually buy at: for every premium pick, include
  a sub-₹2,000 option where one exists.

## Phase 1B — Seed + match (scripts, re-runnable)

`scripts/seed-gear-catalog.ts` — ~150–250 curated products with brand, model, category,
subcategory, slug, aliases, `brew_methods`, `experience_levels`, `is_verified = true`; identifiers
filled where they're on the box/manufacturer site, blank otherwise. Fold the 10 dirty rows into
canonical rows (repoint `user_gear`, then delete) so profiles survive.

Seed one brew wave at a time (see Scope). Within a wave, products stocked by the most stores first,
since that's where comparison is strongest. Apply the price rule at seed time.

`scripts/match-raw-products-to-gear.ts`:

1. Normalize `raw_products.name` (lowercase, strip punctuation/emoji/`[pre-order]`/pack sizes).
2. Match aliases: every alias word must appear in the listing, most words wins, ties are
   ambiguous. Listings with bundle/merch/third-party/clone words (`set`, `kit`, `for`, `tee`,
   `bincoo`…) are skipped. A hand-set `raw_products.gear_id` wins over matching.
3. Hit → set `raw_products.gear_id`; create the roaster's `gear_merchants` row; insert
   `gear_offers` on `(merchant_id, source_product_id = platform_product_id)`. Insert-only:
   existing offers are left alone (url/status/price refreshes are the scraper's job).
4. Misses → CSV of top names by frequency. The CSV is the review queue — no queue table.

`// ponytail: substring/alias matching; trigram or embeddings only if the unmatched CSV stays large
after two alias rounds. GTIN matching once retailers supply barcodes.`

Non-roaster offers (Amazon, retailers) are hand-entered from a short JSON/CSV the seed script reads.
No admin UI.

## Phase 1C — Prices before launch (`/data/Projects/ICB/icb_scraper`)

Launch gate, **per brew wave**: every product on the wave's `brew/<method>` page has at least one
fresh price, and at least half have ≥ 2 priced offers.

**The coffee scraper already fetches equipment prices and throws them away.** `run_all.py` pulls
the full product feed per roaster (prices, MRP, stock, images, every variant). Non-coffee products
route to the `nothing` action in `router.py`, which only bumps `last_seen_at` and drops the rest.
So gear pricing for roaster stores is a new branch in the existing pipeline: **no new scraper, no
extra HTTP requests, no LLM calls.**

Changes in `icb_scraper` (separate repo, own PR):

1. **`router.py`:** `compute_actions` takes a set of this roaster's `platform_product_id`s that have
   an offer in `gear_offers` (via the roaster's `gear_merchants` row). A non-coffee product in that
   set routes to a new `update_gear_offer` action instead of `nothing`. The set is read from
   `gear_offers`, not `raw_products.gear_id`, so offers stay the authoritative link.
2. **`pipeline.py`:** handle `update_gear_offer` next to `update_variants`, reusing the same calls:
   `fetcher.split_product` → (`resolve_variations` for Woo) → `fetcher.prep_variants`. Those already
   return a cleaned `price_current`, `compare_at_price` (dropped when ≤ price), `currency` and
   `in_stock`. Price written to the offer:
   - offer has `source_variant_id` → that variant's price/stock;
   - otherwise → cheapest in-stock variant (fall back to cheapest overall, `in_stock = false`).

   Set `price_last_checked_at` / `stock_last_checked_at = now()`. Refresh `url` from the product URL
   the pipeline already builds (`_build_product_url`). Fill `image_url` from `split["images"][0]`
   when empty (ImageKit upload is a later nicety; the store URL is fine for V1).
3. **Status propagation:** the existing `mark_missing` / `deactivate_product` / `reactivate_raw`
   branches also update `gear_offers.status` for matching `source_product_id`s, all inside the
   same per-roaster transaction.
4. **`db.py`:** one `upsert_gear_offer_prices(conn, rows, commit=False)` batch writer, like
   `insert_prices_batch`. Add a `gear_offers_updated` counter to `RoasterStats` and to the
   `has_any_changes` gate and Slack summary.
5. Refresh the scraper's `supabase-types.ts` copy after the migration.

Coverage limits:

- Native-platform roasters (Shopify, WooCommerce, Wix, GoDaddy/OLS, ZohoCommerce) are covered for
  free. **`web`-platform (Firecrawl) roasters aren't**: `llm_links.py` explicitly rejects
  equipment URLs at discovery, so their gear never reaches `raw_products`. Leave them out; widening
  that filter costs Firecrawl + LLM spend for little gain.
- Prices are as fresh as the coffee run cadence. No separate schedule needed.
- Non-roaster merchants (Amazon, retailers) are *not* this pipeline. They have no `roasters` row
  and no platform feed. Hand-entered until Phase 3, then a small separate job that reads
  `gear_offers where merchant.kind <> 'roaster'`.

Amazon: Associates not signed up; PA-API needs 3 qualifying sales in 180 days → hand-entered URL,
ASIN as `source_product_id`, hand-entered price until then.

No `gear_prices` history table until a chart or drop alert is actually wanted.

## Phase 2 — Routes and data

Three route files, all Server Components, following the coffees pattern.

| Route | What |
|---|---|
| `/gear` | Hub: category tabs (`?category=`), featured collections, "best value" strip |
| `/gear/[slug]` | Product: image, specs/description, **price comparison table**, members-own-this |
| `/gear/[group]/[value]` | Programmatic collections: `type/grinders`, `brew/v60`, `level/beginner` |

Two segments for collections means no slug collision with products and one route file serves all
three families.

**Data:**

- `src/lib/data/fetch-gear.ts` — verified products + `offer_count` + `min_price`, filterable by
  category / brew method / level. `unstable_cache` + `createAnonServerClient()`. One function feeds
  the hub and every collection page.
- `src/lib/data/fetch-gear-by-slug.ts` — product + offers joined to merchants.

**Ranking rule (V1, fixed):** in-stock first → price ascending → unpriced last. Affiliate status,
merchant kind and commission never affect order. A merchant priority/quality signal gets added only
when a concrete problem (e.g. a store that never ships) forces it, and it's visible to the user when
it does.

**Comparison table** on `/gear/[slug]`: merchant (logo + kind badge), price (strike-through MRP),
stock, freshness, Buy button. Header: "From ₹X at N stores".

**Freshness (stored price is always kept, never hidden):**

| Price age | Renders |
|---|---|
| ≤ 30 days | `₹3,490 · checked 4 days ago` |
| > 30 days | `₹3,490 · checked 37 days ago` + "Check current price" link; excluded from "From ₹X", sorted after fresh prices |

Stock follows its own `stock_last_checked_at`: stale stock renders as "availability unknown", not
in/out.

**Collection configs:** `src/lib/discovery/gear-pages.ts` — one typed array
`{ group, value, h1, entityLabel, intro, faqs, related, filter }`, same idea as
`LandingPageConfig` but its own type (its filter is gear, not `CoffeeFilters`). Initial set:

- `type/*` — 7 categories.
- `brew/*` — 9, reusing brew slugs; each links to its `/coffees/<method>` page and back
  (add a "Gear for this method" block on the coffee brew landing pages).
- `level/*` — 3. Copy frames them as "where we'd start" rather than a grading: beginner = forgiving
  brewers and starter kits, enthusiast = the upgrade path (grinder, scale, gooseneck), expert =
  espresso/flat-burr/precision. Products appear on every level they're tagged with.

**Thin-page gate:** a collection is only generated, indexed and put in the sitemap when it has
≥ 6 verified products. Below that it 404s.

Reuse card/grid primitives from `src/components/cards` and `src/components/discovery`.

## Phase 2 — SEO, affiliate hygiene, analytics

- Metadata via `src/lib/seo/metadata.ts`.
- `gearProductSchema` in `src/lib/seo/schema.ts`: `Product` + `AggregateOffer`
  (`lowPrice`/`highPrice`/`offerCount`, fresh prices only) — `AggregateOffer` is the type intended
  for one product sold by multiple merchants, which is exactly this. Google needs one of `offers`,
  `review` or `aggregateRating` on a `Product`; we have no reviews, so in practice: emit the
  price markup only when ≥ 1 fresh price exists, otherwise no `Product` block.
- **Never merchant-listing markup** (`Offer` with ICB as `seller`, shipping/return details). ICB
  doesn't sell anything; that treatment is for the site that does.
- Collections get `ItemList` + `FAQPage`; breadcrumbs `Gear › Brew › V60`.
- `generateStaticParams` over verified slugs and gated collections.
- Outbound links: plain `<a>` straight to merchant (`affiliate_url ?? url`), `target="_blank"`,
  `rel="sponsored nofollow noopener"` when `merchant.is_affiliate`, else `nofollow noopener`.
  Visible disclosure on any page with an affiliate link.
- Sitemap: `/gear`, products, gated collections (extend `src/app/sitemap.ts`).

**`gear_buy_click`** via `src/lib/analytics/`:
`gear_slug, category, merchant_slug, merchant_kind, price, lowest_price, rank_in_table,
offer_count, price_age_days, page_type`. Plus a `gear_view` on product pages so interest vs.
click-out is measurable. This is the research dataset: cheapest vs. known store, demand for gear
with poor Indian availability, price sensitivity by category, where a local product has room.

## Phase 3 — More sellers (data, not schema)

New retailer or marketplace = insert a `gear_merchants` row + its offers (with `source_product_id`,
and GTIN onto the catalog when the retailer exposes it) + a scraper adapter for its domain.
Affiliate networks with tag injection (Cuelinks, Flipkart) get a helper only when the second network
lands; until then `affiliate_url` holds the full tagged URL.

## Verification

1. Migration up, types regenerated: `gear_merchants`, `gear_offers`, new `gear_catalog` columns
   present in `src/types/supabase-types.ts`.
2. Seed: `select count(*) from gear_catalog where is_verified` ≈ seed size; old `user_gear` rows
   still resolve; profile picker adds gear with a new category.
3. Matcher: match rate from `raw_products where gear_id is not null`; re-run creates no duplicate
   offers; eyeball top 50 of the CSV.
4. Scraper: `python run_all.py --roaster-id <a roaster selling V60s> --dry-run` routes those
   products to `update_gear_offer`; a real run fills `price_current` / `price_last_checked_at` on
   their offers; re-run writes no new rows; a product removed from the store flips its offer to
   `missing`. Existing tests still pass (`python -m unittest discover -s tests`), plus one router
   test for the new branch.
5. Wave gate met for `brew/v60` (see Phase 1C). `/gear/<a V60 product>` shows a multi-merchant table in the ranking-rule order;
   a backdated offer renders the stale treatment and drops out of "From ₹X".
6. `/gear/brew/v60` renders; `/gear/brew/espresso` (not yet seeded) 404s.
7. View source: JSON-LD present only on freshly priced products, no ICB `seller`; affiliate anchors
   carry `sponsored`.
8. `npm run type-check` and `npm run lint` clean.

## Deliberately skipped (and the trigger to add)

- Auto-clustering all 2,813 rows — curated seed only.
- Anything over ₹1 lakh: not planned.
- Gear from `web`-platform roasters — when a big seller is only reachable that way.
- ImageKit copies of gear images — when store-hosted images break or get slow.
- GTIN/MPN-based matching — when retailers supply identifiers.
- Image gallery table + `primary_image_url` rename + own CDN copies — when a product page needs
  more than one image.
- Merchant priority/quality signal — when a specific merchant problem forces it.
- Price history / drop alerts — when someone asks for a chart or alert.
- `/go/[offer]` redirect for server-side click logging — when ad-blockers make the PostHog numbers
  untrustworthy.
- Gear filter-URL module (`src/lib/filters/gear-url.ts`) — when the hub needs more than one or two
  params.
- Brew × level combo pages (27) — when single collection pages show traffic.
- Personalised default level from `user_profiles.experience_level` — cheap follow-up after Phase 2.
- Admin UI, embeddings, review-queue table, affiliate tag helper, gear-specific card components.
