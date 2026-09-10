# /gear — cross-store equipment directory

## Context

`raw_products` holds 2,813 active non-coffee rows across 91 roaster stores, discovered by the
ingest pipeline but never surfaced. The same equipment repeats across stores — Aeropress at 24
roasters, Hario at 18, Timemore at 11 — so the natural page is *one page per product, many buy
links*, tagged by equipment type. That page is also the first honest place to put Amazon affiliate
links.

Two facts from the data shape the plan:

1. **`raw_products` has no price and no image** (`source_raw` is null on every row) — only name +
   URL. Prices come later from a separate scraper, mirroring how `variants.price_current` works for
   coffee. The schema here just has to be ready to receive them.
2. **`is_coffee = false` is not "equipment."** It also contains green beans, chocolate, gift cards,
   and baking workshops. A curated catalog is the filter; auto-clustering the whole set would
   publish junk.

And one fact from the codebase: **`gear_catalog` already exists** — `brand / model /
category (grinder|brewer|accessory) / image_url / is_verified / usage_count` — wired to `user_gear`,
the profile gear picker, and the `search_gear_catalog` RPC (`src/app/actions/gear.ts`). It is
already the canonical-product table. It holds 10 dirty user-entered rows today. Building the
directory on it rather than beside it means the public page and "3 ICB members own this" come from
the same row, for free.

**Shape:** `gear_catalog` = canonical product · `gear_offers` = the many buy links ·
`raw_products.gear_id` = the durable match between them.

## 1. Schema (one migration)

`npm run supabase:migration:new gear_directory`, then `npm run supabase:types`.

**`gear_catalog` — add columns:**

- `slug text unique` — URL identity for `/gear/[slug]`.
- `aliases text[] default '{}'` — the dedup mechanism. `{"timemore chestnut c2","c2 manual grinder"}`
  is far cheaper than a fuzzy-match service and stays correct once fixed by hand.
- `description text`, `subcategory text` (e.g. `pour-over`, `hand-grinder`) for detail-page body and
  finer tags.

Reuse the existing **`is_verified`** as the publish gate — a curated row is verified, a user-typed
row is not, and only verified rows appear on `/gear`. Do not add a second `is_published` flag.

**`gear_offers` — new table**, deliberately mirroring `variants` so the scraper contract is the
one already in use:

```
id uuid pk
gear_id uuid not null references gear_catalog(id) on delete cascade
roaster_id uuid references roasters(id)   -- null => external merchant (Amazon)
merchant text not null                    -- display name; 'amazon' for external
url text not null
affiliate_url text                        -- full pre-tagged URL, when one exists
price_current numeric
currency char(3) default 'INR'
price_last_checked_at timestamptz
in_stock boolean
status text check (status in ('active','missing','discontinued'))
last_seen_at timestamptz default now()
source_raw jsonb
unique (gear_id, merchant, url)
index on (gear_id), index on (roaster_id)
```

**`raw_products` — add `gear_id uuid references gear_catalog(id)`**, nullable. This makes matching
idempotent and preserves hand-corrected matches across re-runs.

**RLS:** public `select` on `gear_catalog` and `gear_offers` (mirror the coffees/roasters policies);
writes stay service-role. Store the Amazon tag inside `affiliate_url` — no tag-injection helper
until a second affiliate network exists.

## 2. Seed + match (scripts, run once, re-runnable)

`scripts/seed-gear-catalog.ts` — insert ~150–250 curated products (Aeropress, V60 02, Timemore C3,
Fellow Stagg, 1Zpresso, Bialetti Moka…) with brand, model, category, slug, aliases, `is_verified =
true`. Also fold the 10 existing dirty rows into the right canonical row (`Hario v60` is currently a
*brand*) so `user_gear` links survive.

`scripts/match-raw-products-to-gear.ts` —

1. Normalize `raw_products.name`: lowercase, strip punctuation/emoji/`[pre-order]` prefixes and pack
   sizes.
2. Match against `gear_catalog` brand+model+aliases.
3. Confident hit → set `raw_products.gear_id`; upsert a `gear_offers` row
   (`roaster_id`, `merchant` = roaster name, `url` = `product_url`, `status`/`last_seen_at` copied).
4. Everything unmatched → write a CSV of the top names by frequency. That CSV is the input to the
   next round of aliases. **No review-queue table** — the CSV is the queue.

Leave a `ponytail:` comment naming the ceiling: substring/alias matching, upgrade to trigram or
embeddings only if the unmatched CSV stays large after two alias rounds.

## 3. Routes and data

Follow the coffees pattern exactly (`src/app/(main)/coffees/`, `src/lib/data/fetch-coffees.ts`,
`fetch-coffee-by-slug.ts`).

- `src/lib/data/fetch-gear.ts` — verified rows + offer count + min price, `unstable_cache`,
  `createAnonServerClient()` (cache context forbids `cookies()`).
- `src/lib/data/fetch-gear-by-slug.ts` — one row plus its offers, ordered price-ascending, in-stock
  first.
- `src/app/(main)/gear/page.tsx` — Server Component grid, category tabs from a single
  `?category=` searchParam. **Skip a `src/lib/filters/gear-url.ts` module** — one param does not need
  the serializer machinery; add it when gear gets real facets.
- `src/app/(main)/gear/[slug]/page.tsx` — image, brand/model, description, **"Where to buy"** offer
  list (merchant, price when known, in-stock, "last checked" date), Amazon row pinned, and
  `usage_count` as "N ICB members own this" linking to the existing gear feature.
- Reuse card/grid primitives from `src/components/cards` and `src/components/discovery` rather than
  new gear-specific layout components.

## 4. SEO, affiliate hygiene, analytics

- Metadata via `src/lib/seo/metadata.ts`; add a `gearProductSchema` to `src/lib/seo/schema.ts`
  emitting `Product` + `AggregateOffer` (`lowPrice`/`highPrice`/`offerCount`). This is what makes
  "buy timemore c2 india" reachable, and it is why price matters later.
- `generateStaticParams` over verified slugs.
- Affiliate links: `rel="sponsored nofollow"`, `target="_blank"`, plus a visible disclosure line on
  the detail page. Non-negotiable for Associates compliance.
- Outbound-click event through `src/lib/analytics/` so the commission side is measurable from day
  one.
- Add `/gear` to the sitemap alongside coffees/roasters.

## 5. Price scraper — contract only (lives in `~/Projects/ICB/icb_scraper`, not this repo)

Reads `gear_offers where roaster_id is not null and status = 'active'`, fetches each `url`, writes
`price_current`, `in_stock`, `price_last_checked_at`. Same denormalized-current-price shape as
`variants`. **No `gear_prices` history table now** — add one only when a price chart is actually
wanted. Until prices land, the UI shows merchant + link and no price, which is the correct
degradation.

Amazon: Associates is not signed up yet, and PA-API needs 3 qualifying sales in 180 days, so Amazon
offers are hand-entered URLs with hand-entered prices for now. `affiliate_url` and `price_current`
already hold both.

## Verification

1. `npm run supabase:migration:up` then `npm run supabase:types` — confirm `gear_offers` and
   `gear_catalog.slug` appear in `src/types/supabase-types.ts`.
2. Run the seed script; `select count(*) from gear_catalog where is_verified` ≈ seed size.
3. Run the matcher; check match rate (`select count(*) from raw_products where gear_id is not null`)
   and eyeball the unmatched CSV's top 50 for anything obviously missed.
4. `npm run dev` → `/gear` renders grid, category tabs filter, a detail page shows multiple
   merchants for a known-overlapping product (Aeropress is the best test — 24 stores).
5. Confirm the profile gear picker still works and `user_gear` rows still resolve after the
   catalog cleanup.
6. View source on a detail page: `Product` + `AggregateOffer` JSON-LD present; affiliate anchors
   carry `rel="sponsored nofollow"`.
7. `npm run type-check` and `npm run lint` clean.

## Deliberately skipped

- Auto-clustering all 2,813 rows — curated seed, tail junk never enters.
- `gear_prices` history table, gear filter-URL module, review-queue table, affiliate-tag injection
  helper, gear-specific card components. Each has a named trigger above for when to add it.
