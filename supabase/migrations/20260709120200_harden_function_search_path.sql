-- Pin search_path on every public-schema function that doesn't already have one set.
-- Prevents search_path hijacking of unqualified references inside SECURITY DEFINER bodies
-- (and is good hygiene for SECURITY INVOKER functions too). List sourced live from
-- pg_proc (proconfig IS NULL, excluding pg_trgm/citext extension-owned functions).

ALTER FUNCTION public.add_user_gear(p_user_id uuid, p_gear_id uuid, p_notes text) SET search_path = public, pg_temp;
ALTER FUNCTION public.assign_user_role(target_user_id uuid, new_role user_role_enum, assigned_by uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.backfill_user_profile_emails() SET search_path = public, pg_temp;
ALTER FUNCTION public.cleanup_expired_llm_cache() SET search_path = public, pg_temp;
ALTER FUNCTION public.coffee_editor_save(p_coffee_id uuid, p_coffee jsonb, p_sensory jsonb, p_estate_ids uuid[], p_region_ids uuid[], p_flavor_note_ids uuid[], p_brew_method_ids uuid[]) SET search_path = public, pg_temp;
ALTER FUNCTION public.create_gear_item(p_name text, p_category text, p_brand text, p_model text, p_created_by uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.decrement_gear_usage_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.format_brew_method_label(grind_key text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_epic_c_parameters(p_coffee_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_or_create_estate(p_name text, p_region_id uuid, p_altitude_min_m integer, p_altitude_max_m integer, p_notes text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_or_create_region(p_country text, p_state text, p_subregion text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_price_trend_4w() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_roaster_performance_30d() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_run_statistics_30d() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_user_profile_full(p_username text, p_viewer_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_users_with_roles() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_form_submissions_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user_profile() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.has_permission(required_role user_role_enum) SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_gear_usage_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.log_role_change() SET search_path = public, pg_temp;
ALTER FUNCTION public.refresh_user_taste_profile_cache(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.remove_user_gear(p_user_gear_id uuid, p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_check_content_hash(p_content_hash character varying) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_check_duplicate_image_hash(p_content_hash character varying) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_record_artifact(p_body_len integer, p_http_status integer, p_run_id uuid, p_url text, p_saved_html_path text, p_saved_json jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_upsert_coffee(p_roaster_id text, p_platform_product_id text, p_name text, p_slug text, p_description_md text, p_direct_buy_url text, p_bean_species species_enum, p_process process_enum, p_roast_level roast_level_enum, p_process_raw text, p_roast_level_raw text, p_roast_style_raw text, p_status coffee_status_enum, p_is_limited boolean, p_decaf boolean, p_vendor_sku text, p_tags text[], p_varieties text[], p_region text, p_country text, p_altitude integer, p_acidity numeric, p_body numeric, p_flavors text[], p_default_grind grind_enum, p_description_cleaned text, p_title_cleaned text, p_content_hash text, p_raw_hash text, p_source_raw jsonb, p_notes_raw jsonb, p_is_coffee boolean, p_sweetness numeric, p_bitterness numeric, p_aftertaste numeric, p_clarity numeric) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_upsert_coffee_image(p_coffee_id text, p_url text, p_alt text, p_width integer, p_height integer, p_sort_order integer, p_source_raw jsonb, p_content_hash character varying, p_imagekit_url character varying) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_upsert_variant(p_coffee_id text, p_sku text, p_weight_g integer, p_grind grind_enum, p_platform_variant_id text, p_compare_at_price numeric, p_currency text, p_in_stock boolean, p_pack_count integer, p_stock_qty integer, p_subscription_available boolean, p_source_raw jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.search_gear_catalog(p_search_query text, p_category text, p_limit integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_coffee_ratings() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_coffee_ratings_for_entity(p_entity_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.update_entity_ratings() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_entity_ratings_on_delete() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_last_seen_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_llm_cache_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_roaster_ratings() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_roaster_ratings_for_entity(p_entity_id uuid) SET search_path = public, pg_temp;

-- ===== Lock down internal ops/analytics views =====
-- All 12 views in public schema currently have full default PostgREST-facing grants
-- (SELECT/INSERT/UPDATE/DELETE/...) to both anon and authenticated, because Postgres
-- grants those to PUBLIC by default on CREATE VIEW and nothing ever revoked them.
-- Most are legitimately public (e.g. latest_reviews_per_identity and
-- entity_review_stats back the public review list widget - confirmed via
-- src/hooks/use-reviews.ts querying them directly with the anon browser client).
-- These 6, however, are pure internal scraping/platform ops aggregates with zero
-- references anywhere in src/ outside the generated Database types - anon currently
-- has unauthenticated read access to internal Firecrawl budget/usage data via
-- GET /rest/v1/platform_usage_stats etc. Lock them to service_role only.
REVOKE ALL ON public.platform_distribution FROM anon, authenticated;
REVOKE ALL ON public.platform_usage_stats FROM anon, authenticated;
REVOKE ALL ON public.firecrawl_usage_tracking FROM anon, authenticated;
REVOKE ALL ON public.platform_performance_metrics FROM anon, authenticated;
REVOKE ALL ON public.recent_platform_activity FROM anon, authenticated;
REVOKE ALL ON public.platform_health_dashboard FROM anon, authenticated;
