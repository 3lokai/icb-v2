-- Expose editorial / sourcing columns on the roaster detail RPC so the profile
-- page (types + FAQ) can use regions_sourced, physical_locations, subscription
-- and where-to-buy signals. Pure passthrough additions to the top-level object.
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
      'is_active', r.is_active,
      'hq_city', r.hq_city, 'hq_state', r.hq_state, 'hq_country', r.hq_country,
      'lat', r.lat, 'lon', r.lon, 'phone', r.phone,
      'support_email', r.support_email, 'instagram_handle', r.instagram_handle,
      'social_json', COALESCE(r.social_json, '{}'::jsonb),
      'certifications', r.certifications, 'specialty_focus', r.specialty_focus,
      'sourcing_model', r.sourcing_model,
      'created_at', r.created_at, 'updated_at', r.updated_at,
      'default_concurrency', r.default_concurrency,

      -- Editorial / sourcing detail (ADDED)
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

      -- Breakdown of ALL public coffees (active + seasonal) by roast level.
      -- value = enum text, count = number; labels are mapped client-side.
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

      -- Breakdown of ALL public coffees (active + seasonal) by process.
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
      ), '[]'::jsonb)
    )
    FROM roasters r
    WHERE r.slug = p_slug
    LIMIT 1
  );
$function$;
