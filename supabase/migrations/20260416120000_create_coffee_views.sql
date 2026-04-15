-- Per-identity coffee page view aggregates (logged-in: user_id; anonymous: anon_id).
-- Writes go through the application server (service role); RLS enabled with no broad policies.

CREATE TABLE IF NOT EXISTS public.coffee_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  anon_id UUID,
  coffee_id UUID NOT NULL REFERENCES public.coffees (id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  first_viewed_at TIMESTAMPTZ NOT NULL,
  last_viewed_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT coffee_views_exactly_one_identity CHECK (
    (user_id IS NOT NULL)::int + (anon_id IS NOT NULL)::int = 1
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS coffee_views_user_coffee_unique
  ON public.coffee_views (user_id, coffee_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS coffee_views_anon_coffee_unique
  ON public.coffee_views (anon_id, coffee_id)
  WHERE anon_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_coffee_views_coffee_id ON public.coffee_views (coffee_id);
CREATE INDEX IF NOT EXISTS idx_coffee_views_user_id ON public.coffee_views (user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_coffee_views_anon_id ON public.coffee_views (anon_id)
  WHERE anon_id IS NOT NULL;

ALTER TABLE public.coffee_views ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.coffee_views IS
  'Aggregated coffee detail page views per user or anonymous id; merged on login via merge_coffee_views_for_anon.';

-- Merge anonymous rows into a user: relink or aggregate when a user row already exists.
CREATE OR REPLACE FUNCTION public.merge_coffee_views_for_anon(
  p_user_id uuid,
  p_anon_id uuid
)
RETURNS TABLE (
  rows_relinked integer,
  rows_merged integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.coffee_views%ROWTYPE;
  v_user public.coffee_views%ROWTYPE;
  v_relinked integer := 0;
  v_merged integer := 0;
BEGIN
  IF p_user_id IS NULL OR p_anon_id IS NULL THEN
    RAISE EXCEPTION 'merge_coffee_views_for_anon: p_user_id and p_anon_id are required';
  END IF;

  FOR r IN
    SELECT * FROM public.coffee_views WHERE anon_id = p_anon_id
  LOOP
    SELECT * INTO v_user
    FROM public.coffee_views
    WHERE user_id = p_user_id AND coffee_id = r.coffee_id;

    IF NOT FOUND THEN
      UPDATE public.coffee_views
      SET user_id = p_user_id, anon_id = NULL
      WHERE id = r.id;
      v_relinked := v_relinked + 1;
    ELSE
      UPDATE public.coffee_views
      SET
        view_count = v_user.view_count + r.view_count,
        first_viewed_at = LEAST(v_user.first_viewed_at, r.first_viewed_at),
        last_viewed_at = GREATEST(v_user.last_viewed_at, r.last_viewed_at)
      WHERE id = v_user.id;

      DELETE FROM public.coffee_views WHERE id = r.id;
      v_merged := v_merged + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_relinked, v_merged;
END;
$$;

COMMENT ON FUNCTION public.merge_coffee_views_for_anon(uuid, uuid) IS
  'Moves coffee_views from p_anon_id to p_user_id, aggregating into existing user rows per coffee_id.';

REVOKE ALL ON FUNCTION public.merge_coffee_views_for_anon(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_coffee_views_for_anon(uuid, uuid) TO service_role;
