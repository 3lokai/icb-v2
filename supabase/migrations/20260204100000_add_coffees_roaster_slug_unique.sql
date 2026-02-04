-- Enforce uniqueness of coffee slug per roaster for nested URLs: /roasters/{roasterSlug}/coffees/{coffeeSlug}
-- Does not change existing slug values.

-- Add unique constraint on (roaster_id, slug) for coffees.
-- Skip if constraint already exists (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'coffees_roaster_id_slug_key'
  ) THEN
    ALTER TABLE public.coffees
      ADD CONSTRAINT coffees_roaster_id_slug_key UNIQUE (roaster_id, slug);
  END IF;
END $$;
