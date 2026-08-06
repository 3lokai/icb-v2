-- Canon hardening:
--   1. updated_at triggers for canon_media / canon_estate_trade (columns existed, nothing maintained them)
--   2. at most one hero image per entity
--   3. cap p_limit on the anon-callable detail RPCs (was unbounded)

create trigger canon_media_updated_at
  before update on canon_media
  for each row execute function public.handle_updated_at();

create trigger canon_estate_trade_updated_at
  before update on canon_estate_trade
  for each row execute function public.handle_updated_at();

create unique index canon_media_hero_uidx
  on canon_media (entity_type, entity_id)
  where is_hero;

-- ============================================================================
-- Re-create both detail RPCs with a hard upper bound on p_limit.
-- Bodies are otherwise identical to 20260730120000; Postgres has no partial replace.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_region_detail(
  p_slug  text,
  p_limit int default 24
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT to_jsonb(cr) || jsonb_build_object(
      'media', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', cm.id, 'image_url', cm.image_url, 'caption', cm.caption,
            'sort_order', cm.sort_order, 'is_hero', cm.is_hero
          ) ORDER BY cm.sort_order ASC
        )
        FROM canon_media cm
        WHERE cm.entity_type = 'region' AND cm.entity_id = cr.id
      ), '[]'::jsonb),

      'estates', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', ce.id, 'slug', ce.slug, 'name', ce.name,
            'hero_image_url', ce.hero_image_url,
            'altitude_min_m', ce.altitude_min_m, 'altitude_max_m', ce.altitude_max_m
          ) ORDER BY ce.name ASC
        )
        FROM canon_estates ce
        WHERE ce.canon_region_id = cr.id
      ), '[]'::jsonb),

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
              'roaster_slug', mv.roaster_slug, 'roaster_name', mv.roaster_name,
              'hq_city', mv.hq_city, 'hq_state', mv.hq_state, 'hq_country', mv.hq_country,
              'website', mv.website, 'image_url', mv.image_url,
              'flavor_keys', mv.flavor_keys,
              'brew_method_canonical_keys', mv.brew_method_canonical_keys
            ) AS co_obj
          FROM coffee_directory_mv mv
          WHERE mv.status IN ('active', 'seasonal')
            AND mv.region_ids && (
              SELECT COALESCE(array_agg(rg.id), ARRAY[]::uuid[])
              FROM regions rg WHERE rg.canon_region_id = cr.id
            )
          ORDER BY mv.name ASC
          LIMIT LEAST(GREATEST(COALESCE(p_limit, 24), 0), 100)
        ) sub
      ), '[]'::jsonb),

      'coffee_count', (
        SELECT count(*)::int
        FROM coffee_directory_mv mv
        WHERE mv.status IN ('active', 'seasonal')
          AND mv.region_ids && (
            SELECT COALESCE(array_agg(rg.id), ARRAY[]::uuid[])
            FROM regions rg WHERE rg.canon_region_id = cr.id
          )
      )
    )
    FROM canon_regions cr
    WHERE cr.slug = p_slug
    LIMIT 1
  );
$$;
CREATE OR REPLACE FUNCTION public.get_estate_detail(
  p_slug  text,
  p_limit int default 24
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT to_jsonb(ce) || jsonb_build_object(
      'region', (
        SELECT jsonb_build_object(
          'id', cr.id, 'slug', cr.slug, 'display_name', cr.display_name,
          'country', cr.country, 'state', cr.state
        )
        FROM canon_regions cr WHERE cr.id = ce.canon_region_id
      ),

      'media', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', cm.id, 'image_url', cm.image_url, 'caption', cm.caption,
            'sort_order', cm.sort_order, 'is_hero', cm.is_hero
          ) ORDER BY cm.sort_order ASC
        )
        FROM canon_media cm
        WHERE cm.entity_type = 'estate' AND cm.entity_id = ce.id
      ), '[]'::jsonb),

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
              'roaster_slug', mv.roaster_slug, 'roaster_name', mv.roaster_name,
              'hq_city', mv.hq_city, 'hq_state', mv.hq_state, 'hq_country', mv.hq_country,
              'website', mv.website, 'image_url', mv.image_url,
              'flavor_keys', mv.flavor_keys,
              'brew_method_canonical_keys', mv.brew_method_canonical_keys
            ) AS co_obj
          FROM coffee_directory_mv mv
          WHERE mv.status IN ('active', 'seasonal')
            AND mv.estate_ids && (
              SELECT COALESCE(array_agg(es.id), ARRAY[]::uuid[])
              FROM estates es WHERE es.canon_estate_id = ce.id
            )
          ORDER BY mv.name ASC
          LIMIT LEAST(GREATEST(COALESCE(p_limit, 24), 0), 100)
        ) sub
      ), '[]'::jsonb),

      'coffee_count', (
        SELECT count(*)::int
        FROM coffee_directory_mv mv
        WHERE mv.status IN ('active', 'seasonal')
          AND mv.estate_ids && (
            SELECT COALESCE(array_agg(es.id), ARRAY[]::uuid[])
            FROM estates es WHERE es.canon_estate_id = ce.id
          )
      )
    )
    FROM canon_estates ce
    WHERE ce.slug = p_slug
    LIMIT 1
  );
$$;
