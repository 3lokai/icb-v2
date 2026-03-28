-- Supplemental index for cleanup_duplicate_prices() window queries (variant_id, scraped_at, id).
--
-- Do NOT use CREATE INDEX CONCURRENTLY here or in the SQL Editor when the session runs
-- inside a transaction: Postgres forbids CONCURRENTLY inside a transaction block (25001).
-- Supabase migrations and the default SQL Editor "Run" often wrap statements in a transaction.
-- Use plain CREATE INDEX below, or in the Dashboard run a single statement with transaction disabled if you must use CONCURRENTLY.
--
-- If you already created this index manually, this migration is a no-op.

SET statement_timeout = 0;

DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'idx_prices_variant_id_scraped_at'
  ) THEN
    EXECUTE $sql$
      CREATE INDEX idx_prices_variant_id_scraped_at
        ON public.prices (variant_id, scraped_at ASC, id ASC)
    $sql$;
  END IF;
END
$body$;
