-- RPC for the homepage's "prices last updated" footnote.
-- scrape_runs is an internal ops table (RLS: authenticated/admin only, holds log_file paths and
-- exit codes) — rather than widen its RLS/grants for anon, expose only the one timestamp the
-- public site needs via a narrow SECURITY DEFINER function, same pattern as
-- get_single_origin_vs_blend (20260612173147_single_origin_chart_rpcs.sql).

CREATE OR REPLACE FUNCTION public.get_last_scrape_completed_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- run_status_enum is ok/partial/fail; the workflows app treats anything but
  -- fail as a completed run (workflows/src/lib/data/scraper.ts: dbRowToScraperRun).
  SELECT MAX(finished_at)
  FROM scrape_runs
  WHERE status IN ('ok', 'partial');
$$;

GRANT EXECUTE ON FUNCTION public.get_last_scrape_completed_at() TO anon, authenticated, service_role;
