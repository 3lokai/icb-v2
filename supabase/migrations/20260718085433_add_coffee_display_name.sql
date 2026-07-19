-- Display-ready coffee names.
--
-- `coffees.name` stays the untouched scraped value — it is the source of truth
-- for matching, dedup and re-scraping, and must never be rewritten. This column
-- holds the cleaned, render-facing version (entities decoded, marketing/weight
-- suffixes stripped, title-cased).
--
-- Additive only: no data is mutated here. Population is done by the one-off
-- script `npm run backfill:coffee-display-names`, deliberately NOT by this
-- migration, so it never mutates rows on deploy.

alter table public.coffees
  add column if not exists display_name text;

comment on column public.coffees.display_name is
  'Cleaned, render-facing coffee name. Display only; `name` remains the raw scraped value used for matching/dedup. Populated by scripts/backfill-coffee-display-names.ts and by the ingestion path via cleanCoffeeName().';
