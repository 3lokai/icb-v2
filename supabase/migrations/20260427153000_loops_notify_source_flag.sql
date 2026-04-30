-- Add source tagging support for Loops sync events.
-- Allows event payloads to include source=trigger|live|backfill.

DROP FUNCTION IF EXISTS public.notify_loops_sync(uuid, text);

CREATE OR REPLACE FUNCTION public.notify_loops_sync(
  p_user_id uuid,
  p_event_name text,
  p_source text DEFAULT 'trigger'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_url text;
  v_secret text;
  v_body jsonb;
  v_headers jsonb;
BEGIN
  IF p_user_id IS NULL OR p_event_name IS NULL OR btrim(p_event_name) = '' THEN
    RETURN;
  END IF;

  BEGIN
    SELECT ds.decrypted_secret::text INTO v_url
    FROM vault.decrypted_secrets ds
    WHERE ds.name = 'loops_edge_function_url'
    LIMIT 1;
  EXCEPTION
    WHEN undefined_table THEN
      v_url := NULL;
    WHEN undefined_column THEN
      v_url := NULL;
  END;

  BEGIN
    SELECT ds.decrypted_secret::text INTO v_secret
    FROM vault.decrypted_secrets ds
    WHERE ds.name = 'loops_internal_sync_secret'
    LIMIT 1;
  EXCEPTION
    WHEN undefined_table THEN
      v_secret := NULL;
    WHEN undefined_column THEN
      v_secret := NULL;
  END;

  IF v_url IS NULL OR v_secret IS NULL THEN
    RAISE LOG 'notify_loops_sync: skipped (configure vault secrets loops_edge_function_url and loops_internal_sync_secret)';
    RETURN;
  END IF;

  v_body := jsonb_build_object(
    'user_id', p_user_id::text,
    'event_name', p_event_name,
    'source', COALESCE(NULLIF(btrim(p_source), ''), 'trigger')
  );

  v_headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-icb-loops-sync', v_secret
  );

  PERFORM net.http_post(
    url := v_url,
    body := v_body,
    headers := v_headers,
    timeout_milliseconds := 8000
  );
END;
$$;

REVOKE ALL ON FUNCTION public.notify_loops_sync(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.notify_loops_sync(uuid, text, text) TO postgres;
GRANT EXECUTE ON FUNCTION public.notify_loops_sync(uuid, text, text) TO service_role;

COMMENT ON FUNCTION public.notify_loops_sync(uuid, text, text) IS
  'Async POST to sync-to-loops Edge Function via pg_net; includes source tag and requires Vault secrets.';
