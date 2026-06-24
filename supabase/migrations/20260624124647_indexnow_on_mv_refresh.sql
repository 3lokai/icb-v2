-- IndexNow on directory refresh
--
-- After the scraper refreshes coffee_directory_mv, asynchronously ping our
-- IndexNow endpoint so changed coffee/roaster URLs are submitted to search
-- engines. REFRESH MATERIALIZED VIEW does not fire database webhooks/triggers,
-- so we hook the refresh function itself.
--
-- net.http_post (pg_net) queues the request and returns immediately, so the
-- refresh — and the scraper that calls it — is never blocked or slowed.
--
-- The endpoint URL and bearer secret are read from Supabase Vault (so no secret
-- is committed to git). If either is absent the notification is skipped and the
-- refresh behaves exactly as before.
--
-- One-time setup (run in the SQL editor, NOT committed — replace placeholders):
--   select vault.create_secret(
--     'https://www.indiancoffeebeans.com/api/webhooks/indexnow', 'indexnow_endpoint');
--   select vault.create_secret('<INDEXNOW_WEBHOOK_SECRET>', 'indexnow_secret');

CREATE EXTENSION IF NOT EXISTS pg_net;

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
