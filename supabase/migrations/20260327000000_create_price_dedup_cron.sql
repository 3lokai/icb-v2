-- Price history deduplication: remove consecutive duplicate rows per variant
-- (same price, currency, is_sale) so only real changes remain for price-change maps.
-- Scheduled weekly via pg_cron. Does not modify variants.last_seen_at or price_last_checked_at.

-- pg_cron is available on Supabase hosted; enable in project settings if not already.
-- Disable statement timeout for extension DDL, function body, cron schedule, and one-time cleanup
-- (large prices tables can exceed the default ~2–8 min cap).
SET statement_timeout = 0;

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.cleanup_duplicate_prices()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ranked AS (
    SELECT
      id,
      price,
      currency,
      is_sale,
      LAG(id) OVER (
        PARTITION BY variant_id
        ORDER BY scraped_at ASC, id ASC
      ) AS prev_id,
      LAG(price) OVER (
        PARTITION BY variant_id
        ORDER BY scraped_at ASC, id ASC
      ) AS prev_price,
      LAG(currency) OVER (
        PARTITION BY variant_id
        ORDER BY scraped_at ASC, id ASC
      ) AS prev_currency,
      LAG(is_sale) OVER (
        PARTITION BY variant_id
        ORDER BY scraped_at ASC, id ASC
      ) AS prev_is_sale
    FROM public.prices
  ),
  -- prev_id (not prev_price) guards "has a previous row" so consecutive NULL prices dedupe correctly
  duplicates AS (
    SELECT id
    FROM ranked
    WHERE prev_id IS NOT NULL
      AND price IS NOT DISTINCT FROM prev_price
      AND currency IS NOT DISTINCT FROM prev_currency
      AND is_sale IS NOT DISTINCT FROM prev_is_sale
  ),
  deleted AS (
    DELETE FROM public.prices
    WHERE id IN (SELECT id FROM duplicates)
    RETURNING id
  )
  SELECT COUNT(*)::bigint FROM deleted;
$$;

COMMENT ON FUNCTION public.cleanup_duplicate_prices() IS
  'Deletes consecutive duplicate price rows per variant (same price, currency, is_sale). '
  'Preserves first row of each run and variant first row. Returns number of rows deleted.';

REVOKE ALL ON FUNCTION public.cleanup_duplicate_prices() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_duplicate_prices() TO service_role;

-- Idempotent: remove existing job with same name before scheduling
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'cleanup-duplicate-prices';

-- Weekly: Sunday 03:00 UTC (adjust in cron.job if needed)
SELECT cron.schedule(
  'cleanup-duplicate-prices',
  '0 3 * * 0',
  $$SELECT public.cleanup_duplicate_prices()$$
);

-- One-time cleanup of historical duplicates when this migration first applies
SELECT public.cleanup_duplicate_prices();
