-- Atomic get-or-create for external_user_identities (API v1).
-- Avoids race: concurrent inserts use ON CONFLICT DO NOTHING, then SELECT returns canonical anon_id.

CREATE OR REPLACE FUNCTION public.ensure_external_identity(
  p_key_id uuid,
  p_external_user_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_anon_id uuid;
BEGIN
  INSERT INTO public.external_user_identities (key_id, external_user_id, anon_id)
  VALUES (p_key_id, p_external_user_id, gen_random_uuid())
  ON CONFLICT (key_id, external_user_id) DO NOTHING;

  SELECT e.anon_id INTO v_anon_id
  FROM public.external_user_identities e
  WHERE e.key_id = p_key_id AND e.external_user_id = p_external_user_id;

  IF v_anon_id IS NULL THEN
    RAISE EXCEPTION 'ensure_external_identity: expected row not found';
  END IF;

  RETURN v_anon_id;
END;
$$;

COMMENT ON FUNCTION public.ensure_external_identity(uuid, text) IS
  'Returns stable anon_id for (key_id, external_user_id); inserts on first call.';

REVOKE ALL ON FUNCTION public.ensure_external_identity(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_external_identity(uuid, text) TO service_role;
