-- Migration: Fix get_user_role to handle multiple roles and set search_path
-- 1. Multiple rows: user_roles can have multiple rows per user; pick one by priority.
-- 2. SET search_path = public so SECURITY DEFINER resolves tables safely.
-- 3. Return NULL when user has no roles (caller can treat as non-admin).

CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS public.user_role_enum
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = COALESCE(user_uuid, auth.uid())
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'operator' THEN 2
    WHEN 'roaster' THEN 3
    WHEN 'contributor' THEN 4
    WHEN 'user' THEN 5
    WHEN 'viewer' THEN 6
    ELSE 7
  END
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_user_role(UUID) IS 'Returns the highest-priority role for a user (admin > operator > roaster > contributor > user > viewer). Returns NULL if user has no roles. Safe for use in RLS (SECURITY DEFINER, no recursion on user_roles).';
