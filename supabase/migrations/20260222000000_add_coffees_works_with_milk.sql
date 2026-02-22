-- Migration: Add works_with_milk to coffees table
-- Description: Boolean flag on coffee product: true = works well with milk, false = better black, null = unknown.
--              Aligns with reviews.works_with_milk semantics for product-level override or default.

ALTER TABLE public.coffees
  ADD COLUMN IF NOT EXISTS works_with_milk boolean DEFAULT NULL;

COMMENT ON COLUMN public.coffees.works_with_milk IS 'Product-level: true = works well with milk, false = better black, null = unknown.';
