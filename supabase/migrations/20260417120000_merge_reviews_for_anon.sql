-- Reassign anonymous reviews to an authenticated user after login/signup.
-- Recalculates coffee/roaster aggregates explicitly: UPDATE triggers only run on status change.

CREATE OR REPLACE FUNCTION public.merge_reviews_for_anon(
  p_user_id uuid,
  p_anon_id uuid
)
RETURNS TABLE (
  rows_updated integer,
  entities_recached integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows integer := 0;
  v_recached integer := 0;
  r record;
BEGIN
  IF p_user_id IS NULL OR p_anon_id IS NULL THEN
    RAISE EXCEPTION 'merge_reviews_for_anon: p_user_id and p_anon_id are required';
  END IF;

  DROP TABLE IF EXISTS _merge_reviews_for_anon_touch;
  CREATE TEMP TABLE _merge_reviews_for_anon_touch (
    entity_type review_entity_type NOT NULL,
    entity_id uuid NOT NULL
  ) ON COMMIT DROP;

  WITH updated AS (
    UPDATE public.reviews
    SET user_id = p_user_id, anon_id = NULL
    WHERE anon_id = p_anon_id AND user_id IS NULL
    RETURNING entity_type, entity_id
  )
  INSERT INTO _merge_reviews_for_anon_touch (entity_type, entity_id)
  SELECT entity_type, entity_id
  FROM updated;

  SELECT COUNT(*)::integer INTO v_rows FROM _merge_reviews_for_anon_touch;

  FOR r IN
    SELECT DISTINCT entity_type, entity_id
    FROM _merge_reviews_for_anon_touch
  LOOP
    IF r.entity_type = 'coffee'::review_entity_type THEN
      PERFORM public.update_coffee_ratings_for_entity(r.entity_id);
    ELSIF r.entity_type = 'roaster'::review_entity_type THEN
      PERFORM public.update_roaster_ratings_for_entity(r.entity_id);
    END IF;
    v_recached := v_recached + 1;
  END LOOP;

  RETURN QUERY SELECT v_rows, v_recached;
END;
$$;

COMMENT ON FUNCTION public.merge_reviews_for_anon(uuid, uuid) IS
  'Sets user_id on all reviews for p_anon_id and recomputes entity rating aggregates.';

REVOKE ALL ON FUNCTION public.merge_reviews_for_anon(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_reviews_for_anon(uuid, uuid) TO service_role;
