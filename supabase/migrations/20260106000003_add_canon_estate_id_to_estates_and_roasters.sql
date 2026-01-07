-- Migration: Add canon_estate_id to estates and roasters tables
-- Created: 2026-01-06
-- Description: Adds nullable foreign key column canon_estate_id to both estates and roasters tables
-- to link them to the canonical estates table for standardized estate data.

-- =========================================
-- Add canon_estate_id to estates table
-- =========================================

ALTER TABLE public.estates
ADD COLUMN IF NOT EXISTS canon_estate_id UUID REFERENCES public.canon_estates(id) ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_estates_canon_estate_id 
ON public.estates(canon_estate_id);

-- =========================================
-- Add canon_estate_id to roasters table
-- =========================================

ALTER TABLE public.regions
ADD COLUMN IF NOT EXISTS canon_region_id UUID REFERENCES public.canon_regions(id) ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_regions_canon_region_id 
ON public.regions(canon_region_id);


