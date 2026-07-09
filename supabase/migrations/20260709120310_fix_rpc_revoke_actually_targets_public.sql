-- Follow-up to 20260709120300: that migration's `REVOKE EXECUTE ... FROM anon,
-- authenticated` was a no-op for most functions. Verified via pg_proc.proacl:
-- Postgres grants EXECUTE to PUBLIC by default on CREATE FUNCTION, and anon /
-- authenticated inherit it through PUBLIC membership rather than holding an
-- individual grant — revoking from the named roles only strips an *explicit*
-- grant, which most of these functions never had. `has_function_privilege`
-- confirmed anon/authenticated could still execute e.g. assign_user_role,
-- has_permission, handle_new_user after the previous migration.
--
-- The fix is to revoke from PUBLIC directly. Checked first that none of these
-- functions are referenced inside any RLS policy USING/WITH CHECK clause (which
-- would need anon/authenticated to keep EXECUTE to evaluate policies - unlike
-- is_roaster_owner, which genuinely is called from policies on roasters/
-- roaster_members and correctly keeps its PUBLIC grant, untouched here).
--
-- For the 5 functions that should stay authenticated-only (add_user_gear,
-- create_gear_item, remove_user_gear, upsert_coffee_preferences,
-- upsert_notification_preferences): each already holds a separate EXPLICIT
-- `authenticated=X` grant from prior migrations, distinct from the PUBLIC
-- grant - revoking FROM PUBLIC removes anon's inherited access while leaving
-- that explicit authenticated grant untouched.

REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_reviews_insert() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_user_gear() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_user_profiles() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.lifecycle_sync_after_user_station_photos() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.assign_user_role(target_user_id uuid, new_role user_role_enum, assigned_by uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.backfill_user_profile_emails() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_edit_roaster(p_roaster_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_epic_c_parameters(p_coffee_id text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_roaster_member_role(p_roaster_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_role(user_uuid uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_permission(required_role user_role_enum) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.map_roast_legacy(raw text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.refresh_coffee_directory_mv() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.refresh_user_taste_profile_cache(p_user_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rpc_upsert_coffee_flavor_note(p_coffee_id uuid, p_flavor_note_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rpc_upsert_flavor_note(p_key text, p_label text, p_group_key text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.add_user_gear(p_user_id uuid, p_gear_id uuid, p_notes text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_gear_item(p_name text, p_category text, p_brand text, p_model text, p_created_by uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.remove_user_gear(p_user_gear_id uuid, p_user_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.upsert_coffee_preferences(p_user_id uuid, p_roast_levels text[], p_flavor_profiles text[], p_processing_methods text[], p_regions text[], p_with_milk_preference boolean, p_decaf_only boolean, p_organic_only boolean) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.upsert_notification_preferences(p_user_id uuid, p_new_roasters boolean, p_coffee_updates boolean, p_newsletter boolean, p_platform_updates boolean, p_email_frequency text) FROM PUBLIC;
