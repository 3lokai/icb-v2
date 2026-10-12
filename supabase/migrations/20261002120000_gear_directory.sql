-- Migration: Gear directory (cross-store equipment + price comparison)
-- Created: 2026-10-02
-- Description: gear_catalog becomes the canonical product table for /gear; gear_merchants
-- (who sells) and gear_offers (product x merchant: price, stock, link) are new.
-- raw_products.gear_id is a matching cache only; gear_offers is the authoritative link.
-- See docs/gear-directory-plan.md.

-- ============================================================================
-- FIX: any signed-in user could INSERT into gear_catalog directly, including
-- is_verified = true, which is the /gear publish gate. The app only creates gear via
-- the create_gear_item RPC (SECURITY DEFINER), so the direct policy is unnecessary.
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert gear" ON public.gear_catalog;

-- ============================================================================
-- GEAR_CATALOG: directory columns
-- ============================================================================

ALTER TABLE public.gear_catalog
  ADD COLUMN slug              TEXT,
  ADD COLUMN aliases           TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN model_number      TEXT,
  ADD COLUMN gtin              TEXT,
  ADD COLUMN manufacturer_url  TEXT,
  ADD COLUMN description       TEXT,
  ADD COLUMN subcategory       TEXT,
  ADD COLUMN brew_methods      TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN experience_levels TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.gear_catalog
  ADD CONSTRAINT gear_catalog_slug_key UNIQUE (slug),
  ADD CONSTRAINT gear_catalog_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  ADD CONSTRAINT gear_catalog_experience_levels_check
    CHECK (experience_levels <@ ARRAY['beginner', 'enthusiast', 'expert']::TEXT[]);

CREATE UNIQUE INDEX gear_catalog_gtin_key ON public.gear_catalog (gtin) WHERE gtin IS NOT NULL;

-- Drop the old 3-value category check whatever its generated name is.
DO $$
DECLARE c TEXT;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.gear_catalog'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%category%'
  LOOP
    EXECUTE format('ALTER TABLE public.gear_catalog DROP CONSTRAINT %I', c);
  END LOOP;
END $$;

ALTER TABLE public.gear_catalog ADD CONSTRAINT gear_catalog_category_check
  CHECK (category IN ('grinder', 'brewer', 'espresso_machine', 'kettle', 'scale', 'filter', 'accessory'));

COMMENT ON COLUMN public.gear_catalog.image_url IS 'Primary image. Gallery table later.';
COMMENT ON COLUMN public.gear_catalog.is_verified IS 'Curated row; the /gear publish gate.';
COMMENT ON COLUMN public.gear_catalog.aliases IS 'Lowercase name variants used by the raw_products matcher.';
COMMENT ON COLUMN public.gear_catalog.brew_methods IS 'Brew landing-page slugs (src/lib/discovery/landing-pages/brew-method-pages.ts).';
COMMENT ON COLUMN public.gear_catalog.experience_levels IS 'Editorial: who we would point this at. Multi-level by default.';

-- Widen the category check in the profile "add new gear" RPC to match.
-- CREATE OR REPLACE drops SET clauses, so search_path is restated; grants are preserved.
CREATE OR REPLACE FUNCTION public.create_gear_item(
  p_name TEXT,
  p_category TEXT,
  p_brand TEXT DEFAULT NULL,
  p_model TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_gear_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_created_by, auth.uid());

  IF p_category NOT IN ('grinder', 'brewer', 'espresso_machine', 'kettle', 'scale', 'filter', 'accessory') THEN
    RAISE EXCEPTION 'Invalid category. Must be one of: grinder, brewer, espresso_machine, kettle, scale, filter, accessory';
  END IF;

  IF p_name IS NULL OR TRIM(p_name) = '' THEN
    RAISE EXCEPTION 'Gear name cannot be empty';
  END IF;

  BEGIN
    INSERT INTO public.gear_catalog (name, category, brand, model, created_by)
    VALUES (TRIM(p_name), p_category, NULLIF(TRIM(p_brand), ''), NULLIF(TRIM(p_model), ''), v_user_id)
    RETURNING id INTO v_gear_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'A gear item with this name already exists';
  END;

  RETURN v_gear_id;
END;
$$;

-- ============================================================================
-- GEAR_MERCHANTS: who sells. Roasters today; retailers and marketplaces are rows, not schema.
-- ============================================================================

CREATE TABLE public.gear_merchants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('roaster', 'retailer', 'marketplace')),
  roaster_id   UUID UNIQUE REFERENCES public.roasters(id) ON DELETE CASCADE,
  domain       TEXT,
  logo_url     TEXT,
  is_affiliate BOOLEAN NOT NULL DEFAULT false,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT gear_merchants_roaster_kind CHECK ((kind = 'roaster') = (roaster_id IS NOT NULL))
);

COMMENT ON COLUMN public.gear_merchants.is_affiliate IS 'Drives rel="sponsored" + disclosure. Never affects sort order.';

-- ============================================================================
-- GEAR_OFFERS: product x merchant. Mirrors variants (denormalized current price).
-- Identity is the merchant's own product id (+ variant when one listing splits across
-- catalog products, e.g. V60 01/02 as size variants). url is mutable.
-- ============================================================================

CREATE TABLE public.gear_offers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gear_id               UUID NOT NULL REFERENCES public.gear_catalog(id) ON DELETE CASCADE,
  merchant_id           UUID NOT NULL REFERENCES public.gear_merchants(id) ON DELETE CASCADE,
  source_product_id     TEXT NOT NULL,          -- platform_product_id / ASIN / URL when the store has no id
  source_variant_id     TEXT NOT NULL DEFAULT '', -- '' = whole listing
  url                   TEXT NOT NULL,
  affiliate_url         TEXT,
  image_url             TEXT,
  price_current         NUMERIC CHECK (price_current >= 0),
  compare_at_price      NUMERIC CHECK (compare_at_price >= 0),
  currency              CHAR(3) NOT NULL DEFAULT 'INR',
  price_last_checked_at TIMESTAMPTZ,
  in_stock              BOOLEAN,
  stock_last_checked_at TIMESTAMPTZ,
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'missing', 'discontinued')),
  last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_raw            JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT gear_offers_source_key UNIQUE (merchant_id, source_product_id, source_variant_id)
);

CREATE INDEX idx_gear_offers_gear_id ON public.gear_offers (gear_id);

-- ============================================================================
-- RAW_PRODUCTS: matching cache ("we identified this source record as X")
-- ============================================================================

ALTER TABLE public.raw_products
  ADD COLUMN gear_id UUID REFERENCES public.gear_catalog(id) ON DELETE SET NULL;

CREATE INDEX idx_raw_products_gear_id ON public.raw_products (gear_id) WHERE gear_id IS NOT NULL;

-- ============================================================================
-- RLS: public read; writes are service-role only (no write policies).
-- ============================================================================

ALTER TABLE public.gear_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gear_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read gear merchants" ON public.gear_merchants
  FOR SELECT USING (true);

CREATE POLICY "Public can read gear offers" ON public.gear_offers
  FOR SELECT USING (true);
