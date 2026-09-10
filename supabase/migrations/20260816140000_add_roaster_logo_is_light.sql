-- Precompute the roaster logo's luminance instead of rasterising it in the browser.
--
-- useImageColor draws each roaster logo onto a 64x64 canvas on every mount and
-- averages Rec.601 luminance to decide which plate the logo sits on. The result
-- is deterministic per logo and never changes, yet nothing cached it: /roasters
-- re-downloaded and re-rasterised 96 logos on every visit, after hydration.
--
-- Stored here instead, so the plate is chosen server-side and the canvas goes away.
--
-- NAMING: the hook calls this `isDark`, but its own code computes
--   isDark: avgLuminance > LUMINANCE_THRESHOLD   (useImageColor.ts:89,96)
-- which is true when the logo is LIGHT and therefore needs a DARK plate. The
-- name is inverted at the source and the hook's doc comment has to talk readers
-- out of it twice. The column is named for what is actually measured.

ALTER TABLE public.roasters
  ADD COLUMN IF NOT EXISTS logo_is_light boolean;

COMMENT ON COLUMN public.roasters.logo_is_light IS
  'True when the logo''s mean Rec.601 luminance over non-transparent pixels exceeds 150, i.e. the logo is light and needs a dark plate behind it. NULL = not yet sampled; the UI falls back to the neutral plate. Backfilled by scripts/backfill-roaster-logo-luminance.ts.';

-- Republish get_roaster_detail carrying logo_is_light, for the roaster itself and
-- for each similar roaster. Everything else is byte-identical to
-- 20260815181842_add_similar_roasters_to_roaster_detail_rpc.sql.

CREATE OR REPLACE FUNCTION public.get_roaster_detail(p_slug text, p_limit integer DEFAULT 15)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (
    SELECT jsonb_build_object(
      'id', r.id, 'slug', r.slug, 'name', r.name,
      'description', r.description, 'logo_url', r.logo_url, 'website', r.website,
      'logo_is_light', r.logo_is_light,
      'is_active', r.is_active,
      'hq_city', r.hq_city, 'hq_state', r.hq_state, 'hq_country', r.hq_country,
      'lat', r.lat, 'lon', r.lon, 'phone', r.phone,
      'support_email', r.support_email, 'instagram_handle', r.instagram_handle,
      'social_json', COALESCE(r.social_json, '{}'::jsonb),
      'certifications', r.certifications, 'specialty_focus', r.specialty_focus,
      'sourcing_model', r.sourcing_model,
      'created_at', r.created_at, 'updated_at', r.updated_at,
      'default_concurrency', r.default_concurrency,

      'founded_year', r.founded_year,
      'has_subscription', r.has_subscription,
      'has_physical_store', r.has_physical_store,
      'sourcing_approach', r.sourcing_approach,
      'regions_sourced', r.regions_sourced,
      'regions_tags', r.regions_tags,
      'physical_locations', r.physical_locations,

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
      ),

      'roast_distribution', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('value', d.roast_level, 'count', d.cnt)
                         ORDER BY d.cnt DESC, d.roast_level)
        FROM (
          SELECT mv.roast_level, count(*)::int AS cnt
          FROM coffee_directory_mv mv
          WHERE mv.roaster_id = r.id
            AND mv.status IN ('active','seasonal')
            AND mv.roast_level IS NOT NULL
          GROUP BY mv.roast_level
        ) d
      ), '[]'::jsonb),

      'process_distribution', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('value', d.process, 'count', d.cnt)
                         ORDER BY d.cnt DESC, d.process)
        FROM (
          SELECT mv.process, count(*)::int AS cnt
          FROM coffee_directory_mv mv
          WHERE mv.roaster_id = r.id
            AND mv.status IN ('active','seasonal')
            AND mv.process IS NOT NULL
          GROUP BY mv.process
        ) d
      ), '[]'::jsonb),

      'similar', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'slug', s.similar_slug,
                 'name', s.similar_name,
                 'logo_is_light', sr.logo_is_light,
                 'shared_tags', COALESCE(to_jsonb(s.shared_tags), '[]'::jsonb)
               ) ORDER BY s.rank)
        FROM (
          SELECT * FROM roaster_similar rs
          WHERE rs.roaster_id = r.id
          ORDER BY rs.rank
          LIMIT 4
        ) s
        JOIN roasters sr ON sr.id = s.similar_roaster_id
      ), '[]'::jsonb)
    )
    FROM roasters r
    WHERE r.slug = p_slug
    LIMIT 1
  );
$function$;

GRANT EXECUTE ON FUNCTION public.get_roaster_detail(text, int)
  TO anon, authenticated, service_role;
