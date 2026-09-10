-- Roaster similarity: refresh hook. See 20260815181330_roaster_similarity.sql.
-- ── 2. Refresh alongside the catalogue it is derived from ─────────────────────
-- The scraper already calls refresh_coffee_directory_mv() after each run; the
-- similarity depends on the same coffee rows, so it refreshes in the same place
-- rather than gaining its own cron.

CREATE OR REPLACE FUNCTION public.refresh_coffee_directory_mv()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_endpoint text;
  v_secret   text;
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY coffee_directory_mv;

  -- Roaster similarity is derived from the same coffee rows. Wrapped so a failure
  -- here can never break the directory refresh the whole site depends on.
  BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY roaster_similar;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'roaster_similar refresh skipped: %', SQLERRM;
  END;

  -- Notify IndexNow of changed URLs. Wrapped so a missing Vault secret or a
  -- pg_net hiccup can never break the refresh.
  BEGIN
    SELECT decrypted_secret INTO v_endpoint
      FROM vault.decrypted_secrets WHERE name = 'indexnow_endpoint';
    SELECT decrypted_secret INTO v_secret
      FROM vault.decrypted_secrets WHERE name = 'indexnow_secret';

    IF v_endpoint IS NOT NULL AND v_secret IS NOT NULL THEN
      PERFORM net.http_post(
        url     := v_endpoint,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_secret
        ),
        body    := '{}'::jsonb
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'IndexNow notification skipped: %', SQLERRM;
  END;
END;
$function$;

