-- Fix 11 duplicate-index findings and 2 missing-FK-index findings from the performance advisor.
-- Verified via pg_constraint that none of the dropped unique constraints are referenced by any FK.

-- Plain duplicate indexes: drop the redundant one, keep the other.
DROP INDEX IF EXISTS public.idx_coffees_roaster; -- duplicate of idx_coffee_summary_roaster
DROP INDEX IF EXISTS public.idx_prices_variant_time; -- duplicate of idx_prices_variant_scraped_at
DROP INDEX IF EXISTS public.idx_api_keys_key_hash; -- duplicate of unique constraint api_keys_key_hash_key
DROP INDEX IF EXISTS public.ux_roasters_slug; -- duplicate of unique constraint roasters_slug_key
DROP INDEX IF EXISTS public.ux_prices_variant_time; -- duplicate of unique constraint prices_variant_id_scraped_at_key
DROP INDEX IF EXISTS public.idx_raw_products_unique_platform_product; -- duplicate of unique constraint raw_products_unique
DROP INDEX IF EXISTS public.ux_variants_coffee_platform; -- duplicate of unique constraint coffee_id_platform_variant_id_unique_pair
DROP INDEX IF EXISTS public.ux_coffee_flavor_notes_pair; -- duplicate of coffee_flavor_notes_pkey

-- Constraint-vs-constraint duplicates: drop the redundant unique constraint, keep the primary key.
ALTER TABLE public.coffee_brew_methods DROP CONSTRAINT IF EXISTS coffee_brew_method_unique_pair;
ALTER TABLE public.coffee_regions DROP CONSTRAINT IF EXISTS coffee_region_unique_pair;
ALTER TABLE public.coffee_flavor_notes DROP CONSTRAINT IF EXISTS coffee_flavor_notes_unique_pair;
ALTER TABLE public.flavor_notes DROP CONSTRAINT IF EXISTS flavor_notes_key_uid; -- keep flavor_notes_key_key

-- Missing FK-covering indexes.
CREATE INDEX IF NOT EXISTS idx_gear_catalog_created_by ON public.gear_catalog (created_by);
CREATE INDEX IF NOT EXISTS idx_roaster_members_invited_by ON public.roaster_members (invited_by);
