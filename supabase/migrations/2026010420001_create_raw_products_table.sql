-- Migration: create_raw_products_table
-- Purpose  : Lightweight product discovery/index table (Shopify/Woo/etc)
-- Notes    : - first_seen_at is default with NOW
--           : - last_seen_at should be updated by ingest/upsert workflows
--           : - RLS enabled; no public policies by default (service/db roles still work)

-- ============================================================================
-- TABLE: raw_products
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.raw_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to roasters table
  roaster_id UUID NOT NULL REFERENCES public.roasters(id) ON DELETE RESTRICT,
  
  -- Platform identifier (uses existing platform_enum)
  platform platform_enum NOT NULL,
  
  -- Platform-specific product identifier
  platform_product_id TEXT NOT NULL,
  
  -- Basic product information
  name TEXT NOT NULL,
  slug TEXT,
  product_url TEXT,
  
  -- Classification (unknown until explicitly marked)
  is_coffee BOOLEAN,
  
  -- Discovery timestamps
  first_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Status tracking (optional but handy)
  status TEXT CHECK (status IN ('active', 'missing', 'discontinued', 'unknown')),
  
  -- Optional minimal list payload storage
  source_raw JSONB,
  
  -- Unique constraint: one record per product per platform per roaster
  CONSTRAINT raw_products_roaster_platform_product_unique 
    UNIQUE (roaster_id, platform, platform_product_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for discovery queries by roaster and recency
CREATE INDEX IF NOT EXISTS idx_raw_products_roaster_last_seen
  ON public.raw_products(roaster_id, last_seen_at DESC);

-- Index for filtering coffee vs non-coffee products
CREATE INDEX IF NOT EXISTS idx_raw_products_is_coffee
  ON public.raw_products(is_coffee)
  WHERE is_coffee IS NOT NULL;

-- GIN index for JSONB queries on source_raw (if needed)
CREATE INDEX IF NOT EXISTS idx_raw_products_source_raw_gin
  ON public.raw_products USING GIN (source_raw)
  WHERE source_raw IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS (no public policies - service/db roles still work)
ALTER TABLE public.raw_products ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.raw_products IS 
  'Lightweight product discovery/index table for tracking products from different platforms (Shopify, WooCommerce, etc.) without storing full payloads. Enables efficient discovery of new products, tracking of existing ones, and identification of disappeared products.';

COMMENT ON COLUMN public.raw_products.id IS 
  'Primary key UUID';

COMMENT ON COLUMN public.raw_products.roaster_id IS 
  'Foreign key to roasters table';

COMMENT ON COLUMN public.raw_products.platform IS 
  'Platform type: shopify, woocommerce, custom, or other';

COMMENT ON COLUMN public.raw_products.platform_product_id IS 
  'Platform-specific product identifier (unique with roaster_id and platform)';

COMMENT ON COLUMN public.raw_products.name IS 
  'Product name from platform';

COMMENT ON COLUMN public.raw_products.slug IS 
  'Product slug/URL slug from platform';

COMMENT ON COLUMN public.raw_products.product_url IS 
  'Full URL to the product page';

COMMENT ON COLUMN public.raw_products.is_coffee IS 
  'Whether this product is coffee (nullable - unknown until explicitly marked)';

COMMENT ON COLUMN public.raw_products.first_seen_at IS 
  'Timestamp when product was first discovered (set on INSERT, never updated)';

COMMENT ON COLUMN public.raw_products.last_seen_at IS 
  'Timestamp when product was last seen in discovery run (updated by ingest/upsert workflows)';

COMMENT ON COLUMN public.raw_products.status IS 
  'Product status: active (currently exists), missing (not found in latest run), discontinued (explicitly marked), or unknown (default)';

COMMENT ON COLUMN public.raw_products.source_raw IS 
  'Optional minimal list payload storage (JSONB)';

-- ============================================================================
-- ROLLBACK (for reference)
-- ============================================================================
-- To rollback this migration:
-- DROP TABLE IF EXISTS public.raw_products CASCADE;
