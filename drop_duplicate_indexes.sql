-- SQL script to drop duplicate indexes
-- Generated from indexes.md analysis
-- 
-- Duplicate indexes identified:
-- 1. Exact duplicates (same table, same columns, same type)
-- 2. Functional duplicates (same purpose, different names)

-- ============================================
-- EXACT DUPLICATES
-- ============================================

-- coffee_brew_methods: coffee_brew_method_unique_pair duplicates coffee_brew_methods_pkey
-- Both are UNIQUE on (coffee_id, brew_method_id)
DROP INDEX IF EXISTS coffee_brew_method_unique_pair;

-- coffee_flavor_notes: coffee_flavor_notes_unique_pair duplicates coffee_flavor_notes_pkey
-- Both are UNIQUE on (coffee_id, flavor_note_id)
DROP INDEX IF EXISTS coffee_flavor_notes_unique_pair;

-- coffee_regions: coffee_region_unique_pair duplicates coffee_regions_pkey
-- Both are UNIQUE on (coffee_id, region_id)
DROP INDEX IF EXISTS coffee_region_unique_pair;

-- flavor_notes: flavor_notes_key_uid duplicates flavor_notes_key_key
-- Both are UNIQUE on (key)
DROP INDEX IF EXISTS flavor_notes_key_uid;

-- prices: idx_prices_variant_time duplicates idx_prices_variant_scraped_at
-- Both are on (variant_id, scraped_at DESC)
DROP INDEX IF EXISTS idx_prices_variant_time;

-- raw_products: raw_products_unique duplicates idx_raw_products_unique_platform_product
-- Both are UNIQUE on (roaster_id, platform, platform_product_id)
DROP INDEX IF EXISTS raw_products_unique;

-- ============================================
-- FUNCTIONAL DUPLICATES
-- ============================================

-- prices: ux_prices_variant_time duplicates prices_variant_id_scraped_at_key
-- Both are UNIQUE on (variant_id, scraped_at) - order doesn't matter for unique constraint
DROP INDEX IF EXISTS ux_prices_variant_time;

-- variants: coffee_id_platform_variant_id_unique_pair duplicates ux_variants_coffee_platform
-- Both are UNIQUE on (coffee_id, platform_variant_id)
DROP INDEX IF EXISTS coffee_id_platform_variant_id_unique_pair;

-- roasters: roasters_slug_key duplicates ux_roasters_slug
-- Both are UNIQUE on (slug)
DROP INDEX IF EXISTS roasters_slug_key;

-- coffees: coffees_roaster_platform_uid duplicates ux_coffees_roaster_platform
-- ux_coffees_roaster_platform has WHERE clause, but coffees_roaster_platform_uid is more general
-- Keeping ux_coffees_roaster_platform (more specific), dropping coffees_roaster_platform_uid
DROP INDEX IF EXISTS coffees_roaster_platform_uid;

-- coffee_flavor_notes: ux_coffee_flavor_notes_pair duplicates coffee_flavor_notes_pkey
-- Both are UNIQUE on (coffee_id, flavor_note_id)
DROP INDEX IF EXISTS ux_coffee_flavor_notes_pair;

-- llm_cache: llm_cache_key_key duplicates idx_llm_cache_key
-- Both are on (key), but llm_cache_key_key is UNIQUE
-- Keeping llm_cache_key_key (enforces uniqueness), dropping idx_llm_cache_key
DROP INDEX IF EXISTS idx_llm_cache_key;

-- ============================================
-- SUMMARY
-- ============================================
-- Total indexes to drop: 12
-- 
-- Exact duplicates: 6
-- Functional duplicates: 6


