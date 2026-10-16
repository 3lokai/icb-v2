-- Keep gear_catalog.usage_count right when a user_gear row moves to another product
-- (scripts/seed-gear-catalog.ts folds duplicates by repointing gear_id). The insert and
-- delete triggers already cover the other cases; this replaces the script's
-- count-then-write recount, which raced with live inserts and deletes.

CREATE OR REPLACE FUNCTION public.move_gear_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.gear_catalog SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.gear_id;
  UPDATE public.gear_catalog SET usage_count = usage_count + 1 WHERE id = NEW.gear_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

CREATE TRIGGER trigger_move_gear_usage
  AFTER UPDATE OF gear_id ON public.user_gear
  FOR EACH ROW
  WHEN (OLD.gear_id IS DISTINCT FROM NEW.gear_id)
  EXECUTE FUNCTION public.move_gear_usage_count();
