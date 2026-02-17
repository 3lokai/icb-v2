-- Enforce uniqueness of coffee slug per roaster for nested URLs: /roasters/{roasterSlug}/coffees/{coffeeSlug}
-- Deduplicates (roaster_id, slug) by appending a short id suffix to duplicates, then adds the constraint.

-- Step 1: Make duplicate (roaster_id, slug) rows unique by appending first 8 chars of id to slug.
-- Keep one row per (roaster_id, slug) unchanged (min id); update the rest.
UPDATE public.coffees c
SET slug = c.slug || '-' || substring(c.id::text from 1 for 8)
FROM (
  SELECT id,
    row_number() OVER (PARTITION BY roaster_id, slug ORDER BY created_at, id) AS rn
  FROM public.coffees
) sub
WHERE c.id = sub.id AND sub.rn > 1;

-- Step 2: Add unique constraint. Skip if constraint already exists (idempotent).
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
