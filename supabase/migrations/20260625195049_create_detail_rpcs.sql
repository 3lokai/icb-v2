-- Migration: Create get_coffee_detail and get_roaster_detail RPCs
-- Description: Single-call jsonb assembly for coffee and roaster detail pages.
--   Replaces ~10-12 PostgREST round-trips per page with one RPC each, to cut
--   Supabase disk I/O. SECURITY DEFINER is REQUIRED: anon/authenticated have no
--   SELECT grant on variants, sensory_params, the junction tables, flavor_notes,
--   brew_methods, regions, estates. The function owner (postgres) can read them.

-- ============================================================================
-- FUNCTION: get_coffee_detail(p_roaster_slug, p_coffee_slug)
-- ============================================================================
DROP FUNCTION IF EXISTS public.get_coffee_detail(text, text) CASCADE;

CREATE OR REPLACE FUNCTION public.get_coffee_detail(
  p_roaster_slug text,
  p_coffee_slug  text
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT jsonb_build_object(
      'id',              c.id,
      'slug',            c.slug,
      'name',            c.name,
      'roaster_id',      c.roaster_id,
      'description_md',  c.description_md,
      'direct_buy_url',  c.direct_buy_url,
      'status',          c.status,
      'is_coffee',       c.is_coffee,
      'is_limited',      COALESCE(c.is_limited, false),
      'decaf',           COALESCE(c.decaf, false),
      'crop_year',       c.crop_year,
      'harvest_window',  c.harvest_window,
      'roast_level',     c.roast_level,
      'roast_level_raw', c.roast_level_raw,
      'roast_style_raw', c.roast_style_raw,
      'process',         c.process,
      'process_raw',     c.process_raw,
      'bean_species',    c.bean_species,
      'default_grind',   c.default_grind,
      'varieties',       c.varieties,
      'tags',            c.tags,
      'rating_avg',      c.rating_avg,
      'rating_count',    COALESCE(c.rating_count, 0),

      'roaster', (
        SELECT jsonb_build_object(
          'id', r.id, 'slug', r.slug, 'name', r.name, 'website', r.website,
          'hq_city', r.hq_city, 'hq_state', r.hq_state, 'hq_country', r.hq_country,
          'lat', r.lat, 'lon', r.lon, 'phone', r.phone,
          'support_email', r.support_email, 'instagram_handle', r.instagram_handle,
          'social_json', r.social_json, 'created_at', r.created_at,
          'updated_at', r.updated_at, 'default_concurrency', r.default_concurrency
        )
        FROM roasters r WHERE r.id = c.roaster_id
      ),

      'variants', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', v.id, 'coffee_id', v.coffee_id,
            'platform_variant_id', v.platform_variant_id, 'sku', v.sku,
            'barcode', v.barcode, 'weight_g', v.weight_g, 'grind', v.grind,
            'pack_count', v.pack_count, 'currency', v.currency,
            'price_current', v.price_current, 'compare_at_price', v.compare_at_price,
            'in_stock', v.in_stock, 'stock_qty', v.stock_qty,
            'subscription_available', v.subscription_available, 'status', v.status,
            'created_at', v.created_at, 'updated_at', v.updated_at,
            'last_seen_at', v.last_seen_at,
            'price_last_checked_at', v.price_last_checked_at
          ) ORDER BY v.weight_g ASC
        )
        FROM variants v WHERE v.coffee_id = c.id
      ), '[]'::jsonb),

      'images', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', ci.id, 'coffee_id', ci.coffee_id,
            'imagekit_url', ci.imagekit_url, 'alt', ci.alt,
            'width', ci.width, 'height', ci.height, 'sort_order', ci.sort_order
          ) ORDER BY ci.sort_order ASC
        )
        FROM coffee_images ci WHERE ci.coffee_id = c.id
      ), '[]'::jsonb),

      'sensory', (
        SELECT jsonb_build_object(
          'acidity', s.acidity, 'sweetness', s.sweetness,
          'bitterness', s.bitterness, 'body', s.body,
          'aftertaste', s.aftertaste, 'clarity', s.clarity,
          'confidence', s.confidence, 'source', s.source, 'notes', s.notes,
          'created_at', s.created_at, 'updated_at', s.updated_at
        )
        FROM sensory_params s WHERE s.coffee_id = c.id
      ),

      'flavor_notes', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object('id', fn.id, 'key', fn.key, 'label', fn.label, 'group_key', fn.group_key)
          ORDER BY fn.label
        )
        FROM coffee_flavor_notes cfn
        JOIN flavor_notes fn ON fn.id = cfn.flavor_note_id
        WHERE cfn.coffee_id = c.id
      ), '[]'::jsonb),

      'brew_methods', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object('id', bm.id, 'key', bm.key, 'label', bm.label)
          ORDER BY bm.label
        )
        FROM coffee_brew_methods cbm
        JOIN brew_methods bm ON bm.id = cbm.brew_method_id
        WHERE cbm.coffee_id = c.id
      ), '[]'::jsonb),

      'regions', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', rg.id, 'display_name', rg.display_name, 'country', rg.country,
            'state', rg.state, 'subregion', rg.subregion, 'pct', cr.pct
          ) ORDER BY rg.display_name NULLS LAST
        )
        FROM coffee_regions cr
        JOIN regions rg ON rg.id = cr.region_id
        WHERE cr.coffee_id = c.id
      ), '[]'::jsonb),

      'estates', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', es.id, 'name', es.name, 'region_id', es.region_id,
            'altitude_min_m', es.altitude_min_m, 'altitude_max_m', es.altitude_max_m,
            'notes', es.notes, 'pct', ce.pct
          ) ORDER BY es.name
        )
        FROM coffee_estates ce
        JOIN estates es ON es.id = ce.estate_id
        WHERE ce.coffee_id = c.id
      ), '[]'::jsonb),

      'summary', (
        SELECT jsonb_build_object(
          'coffee_id',            COALESCE(cs.coffee_id, c.id),
          'status',               COALESCE(cs.status, c.status),
          'process',              COALESCE(cs.process, c.process),
          'process_raw',          COALESCE(cs.process_raw, c.process_raw),
          'roast_level',          COALESCE(cs.roast_level, c.roast_level),
          'roast_level_raw',      COALESCE(cs.roast_level_raw, c.roast_level_raw),
          'roast_style_raw',      COALESCE(cs.roast_style_raw, c.roast_style_raw),
          'direct_buy_url',       COALESCE(cs.direct_buy_url, c.direct_buy_url),
          'has_250g_bool',        cs.has_250g_bool,
          'has_sensory',          cs.has_sensory,
          'in_stock_count',       cs.in_stock_count,
          'min_price_in_stock',   cs.min_price_in_stock,
          'best_variant_id',      cs.best_variant_id,
          'best_normalized_250g', cs.best_normalized_250g,
          'weights_available',    cs.weights_available,
          'sensory_public',       cs.sensory_public,
          'sensory_updated_at',   cs.sensory_updated_at,
          'seo_desc',             c.seo_desc
        )
        FROM (SELECT 1) one
        LEFT JOIN coffee_summary cs ON cs.coffee_id = c.id
      ),

      'canon_flavor_node_ids', (
        SELECT mv.canon_flavor_node_ids FROM coffee_directory_mv mv WHERE mv.coffee_id = c.id
      ),
      'canon_flavor_slugs', (
        SELECT mv.canon_flavor_slugs FROM coffee_directory_mv mv WHERE mv.coffee_id = c.id
      )
    )
    FROM coffees c
    JOIN roasters r0 ON r0.id = c.roaster_id
    WHERE r0.slug = p_roaster_slug AND c.slug = p_coffee_slug
    LIMIT 1
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_coffee_detail(text, text)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_coffee_detail(text, text) IS
  'Single-call jsonb assembly of CoffeeDetail. Returns NULL when not found. SECURITY DEFINER so anon can read tables it has no direct grant on.';

-- ============================================================================
-- FUNCTION: get_roaster_detail(p_slug, p_limit)
-- ============================================================================
DROP FUNCTION IF EXISTS public.get_roaster_detail(text, int) CASCADE;

CREATE OR REPLACE FUNCTION public.get_roaster_detail(
  p_slug  text,
  p_limit int default 15
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT jsonb_build_object(
      'id', r.id, 'slug', r.slug, 'name', r.name,
      'description', r.description, 'logo_url', r.logo_url, 'website', r.website,
      'is_active', r.is_active,
      'hq_city', r.hq_city, 'hq_state', r.hq_state, 'hq_country', r.hq_country,
      'lat', r.lat, 'lon', r.lon, 'phone', r.phone,
      'support_email', r.support_email, 'instagram_handle', r.instagram_handle,
      'social_json', COALESCE(r.social_json, '{}'::jsonb),
      'certifications', r.certifications, 'specialty_focus', r.specialty_focus,
      'sourcing_model', r.sourcing_model,
      'created_at', r.created_at, 'updated_at', r.updated_at,
      'default_concurrency', r.default_concurrency,
      'avg_rating', r.avg_rating,
      'avg_customer_support', r.avg_customer_support,
      'avg_delivery_experience', r.avg_delivery_experience,
      'avg_packaging', r.avg_packaging,
      'avg_value_for_money', r.avg_value_for_money,
      'total_ratings_count', r.total_ratings_count,
      'recommend_percentage', r.recommend_percentage,
      'ratings_updated_at', r.ratings_updated_at,

      'coffees', COALESCE((
        SELECT jsonb_agg(co_obj ORDER BY co_name ASC)
        FROM (
          SELECT
            mv.name AS co_name,
            jsonb_build_object(
              'coffee_id', mv.coffee_id, 'slug', mv.slug, 'name', mv.name,
              'roaster_id', mv.roaster_id, 'status', mv.status,
              'process', mv.process, 'process_raw', mv.process_raw,
              'roast_level', mv.roast_level, 'roast_level_raw', mv.roast_level_raw,
              'roast_style_raw', mv.roast_style_raw, 'direct_buy_url', mv.direct_buy_url,
              'has_250g_bool', mv.has_250g_bool, 'has_sensory', mv.has_sensory,
              'in_stock_count', mv.in_stock_count, 'min_price_in_stock', mv.min_price_in_stock,
              'best_variant_id', mv.best_variant_id, 'best_normalized_250g', mv.best_normalized_250g,
              'weights_available', mv.weights_available,
              'sensory_public', mv.sensory_public, 'sensory_updated_at', mv.sensory_updated_at,
              'decaf', COALESCE(mv.decaf, false),
              'is_limited', COALESCE(mv.is_limited, false),
              'bean_species', mv.bean_species,
              'rating_avg', mv.rating_avg,
              'rating_count', COALESCE(mv.rating_count, 0),
              'tags', mv.tags,
              'works_with_milk', mv.works_with_milk,
              'roaster_slug', mv.roaster_slug, 'roaster_name', mv.roaster_name,
              'hq_city', mv.hq_city, 'hq_state', mv.hq_state, 'hq_country', mv.hq_country,
              'website', mv.website, 'image_url', mv.image_url,
              'flavor_keys', mv.flavor_keys,
              'brew_method_canonical_keys', mv.brew_method_canonical_keys
            ) AS co_obj
          FROM coffee_directory_mv mv
          WHERE mv.roaster_id = r.id
            AND mv.status IN ('active','seasonal')
          ORDER BY mv.name ASC
          LIMIT GREATEST(COALESCE(p_limit, 15), 0)
        ) sub
      ), '[]'::jsonb),

      'coffee_count', (
        SELECT count(*)::int FROM coffees co WHERE co.roaster_id = r.id
      ),
      'active_coffee_count', (
        SELECT count(*)::int FROM coffees co
        WHERE co.roaster_id = r.id AND co.status = 'active'
      ),
      'avg_coffee_rating', (
        SELECT CASE WHEN sum(co.rating_count) > 0
          THEN sum(co.rating_avg * co.rating_count) / sum(co.rating_count)
          ELSE NULL END
        FROM coffees co
        WHERE co.roaster_id = r.id AND co.rating_count > 0 AND co.rating_avg IS NOT NULL
      )
    )
    FROM roasters r
    WHERE r.slug = p_slug
    LIMIT 1
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_roaster_detail(text, int)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.get_roaster_detail(text, int) IS
  'Single-call jsonb assembly of RoasterDetail. coffees[] from coffee_directory_mv (limited, public statuses, name asc). coffee_count/active_coffee_count/avg_coffee_rating computed live over ALL coffees from the coffees table. Returns NULL when not found.';
