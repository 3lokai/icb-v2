-- Migration: Add gear management RPC functions
-- Created: 2026-01-29
-- Description: Creates RPC functions for searching gear catalog, adding gear to user collection,
-- creating new gear items, and removing user gear.

-- ============================================================================
-- FUNCTION 1: Search Gear Catalog
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_gear_catalog(
  p_search_query TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  brand TEXT,
  model TEXT,
  usage_count INT,
  is_verified BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gc.id,
    gc.name::TEXT,
    gc.category::TEXT,
    gc.brand,
    gc.model,
    gc.usage_count,
    gc.is_verified
  FROM public.gear_catalog gc
  WHERE 
    (p_search_query IS NULL OR p_search_query = '' OR gc.name ILIKE '%' || p_search_query || '%')
    AND (p_category IS NULL OR gc.category = p_category)
  ORDER BY 
    gc.is_verified DESC,
    gc.usage_count DESC,
    gc.name ASC
  LIMIT p_limit;
END;
$$;

-- ============================================================================
-- FUNCTION 2: Add Gear to User Collection
-- ============================================================================

CREATE OR REPLACE FUNCTION public.add_user_gear(
  p_user_id UUID,
  p_gear_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_gear_id UUID;
  v_max_sort_order INT;
BEGIN
  -- Verify user is authenticated
  IF p_user_id IS NULL OR p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: User ID does not match authenticated user';
  END IF;

  -- Check if gear exists
  IF NOT EXISTS (SELECT 1 FROM public.gear_catalog WHERE id = p_gear_id) THEN
    RAISE EXCEPTION 'Gear item not found';
  END IF;

  -- Check if user already has this gear (handle gracefully)
  IF EXISTS (SELECT 1 FROM public.user_gear WHERE user_id = p_user_id AND gear_id = p_gear_id) THEN
    RAISE EXCEPTION 'You already have this item in your collection';
  END IF;

  -- Get max sort_order for this user
  SELECT COALESCE(MAX(sort_order), -1) INTO v_max_sort_order
  FROM public.user_gear
  WHERE user_id = p_user_id;

  -- Insert new user gear
  INSERT INTO public.user_gear (user_id, gear_id, notes, sort_order)
  VALUES (p_user_id, p_gear_id, p_notes, v_max_sort_order + 1)
  RETURNING id INTO v_user_gear_id;

  RETURN v_user_gear_id;
END;
$$;

-- ============================================================================
-- FUNCTION 3: Create New Gear Item
-- ============================================================================

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
AS $$
DECLARE
  v_gear_id UUID;
  v_user_id UUID;
BEGIN
  -- Get authenticated user if not provided
  v_user_id := COALESCE(p_created_by, auth.uid());

  -- Validate category
  IF p_category NOT IN ('grinder', 'brewer', 'accessory') THEN
    RAISE EXCEPTION 'Invalid category. Must be one of: grinder, brewer, accessory';
  END IF;

  -- Validate name is not empty
  IF p_name IS NULL OR TRIM(p_name) = '' THEN
    RAISE EXCEPTION 'Gear name cannot be empty';
  END IF;

  -- Insert new gear item
  -- Handle duplicate name violations gracefully (CITEXT unique constraint)
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
-- FUNCTION 4: Remove User Gear
-- ============================================================================

CREATE OR REPLACE FUNCTION public.remove_user_gear(
  p_user_gear_id UUID,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify user is authenticated and matches
  IF p_user_id IS NULL OR p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: User ID does not match authenticated user';
  END IF;

  -- Delete user gear (security check built-in via WHERE clause)
  DELETE FROM public.user_gear
  WHERE id = p_user_gear_id AND user_id = p_user_id;

  -- Check if any row was deleted
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gear item not found or you do not have permission to remove it';
  END IF;
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.search_gear_catalog IS 'Search gear catalog with optional category filter. Returns gear items ordered by verified status, usage count, and name.';
COMMENT ON FUNCTION public.add_user_gear IS 'Add a gear item from catalog to user collection. Handles duplicate prevention and auto-calculates sort_order.';
COMMENT ON FUNCTION public.create_gear_item IS 'Create a new gear item in the catalog. Handles duplicate name violations and validates category.';
COMMENT ON FUNCTION public.remove_user_gear IS 'Remove a gear item from user collection. Verifies ownership before deletion.';
