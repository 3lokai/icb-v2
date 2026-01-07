-- Migration: Seed canonical regions from CSV data
-- Created: 2026-01-06
-- Description: Populates the canon_regions table with initial data from canon_regions.csv
-- Handles encoding issues, generates slugs, and fixes data inconsistencies

-- =========================================
-- Insert Canonical Regions
-- =========================================

-- Helper function to generate slug from display name
-- This is a simple version - in production you might want a more robust slug function
-- For now, we'll generate slugs manually in the INSERT statements

INSERT INTO canon_regions (slug, display_name, country, state, subregion) VALUES
  -- Indian regions
  ('aldur-kerehaklu', 'Aldur-Kerehaklu', 'India', 'Karnataka', NULL),
  ('araku-valley', 'Araku Valley', 'India', 'Andhra Pradesh', NULL),
  ('baba-budangiri', 'Baba Budangiri', 'India', 'Karnataka', NULL),
  ('chikmagalur', 'Chikmagalur', 'India', 'Karnataka', NULL),
  ('biligiriranga-hills', 'Biligiriranga Hills', 'India', 'Karnataka', NULL),
  ('kodagu-coorg', 'Kodagu (Coorg)', 'India', 'Karnataka', NULL),
  ('garo-hills', 'Garo Hills', 'India', 'Meghalaya', NULL),
  ('koraput', 'Koraput', 'India', 'Odisha', NULL),
  ('hassan', 'Hassan', 'India', 'Karnataka', NULL),
  ('khasi-hills', 'Khasi Hills', 'India', 'Meghalaya', NULL),
  ('magundi-chikmagalur', 'Magundi, Chikmagalur', 'India', 'Karnataka', NULL),
  ('malnad', 'Malnad', 'India', 'Karnataka', NULL),
  ('manjarabad', 'Manjarabad', 'India', 'Karnataka', NULL),
  ('mudigere', 'Mudigere', 'India', 'Karnataka', NULL),
  ('nelliyampathy', 'Nelliyampathy', 'India', 'Kerala', NULL),
  ('nilgiri-hills', 'Nilgiri Hills', 'India', 'Tamil Nadu', NULL),
  ('palani-hills', 'Palani Hills', 'India', 'Tamil Nadu', NULL),
  ('paderu-valley', 'Paderu Valley', 'India', 'Andhra Pradesh', NULL),
  ('sakleshpur', 'Sakleshpur', 'India', 'Karnataka', NULL),
  ('shevaroy-hills', 'Shevaroy Hills', 'India', 'Tamil Nadu', NULL),
  ('valparai', 'Valparai', 'India', 'Tamil Nadu', NULL),
  ('wayanad', 'Wayanad', 'India', 'Kerala', NULL),
  ('west-khasi-hills', 'West Khasi Hills', 'India', 'Meghalaya', NULL),
  ('coonor', 'Coonor', 'India', 'Tamil Nadu', NULL),

  -- Ethiopian regions
  ('guji', 'Guji', 'Ethiopia', 'Oromia', NULL),
  ('kaffa', 'Kaffa', 'Ethiopia', 'Oromia', NULL),
  ('sidamo', 'Sidamo', 'Ethiopia', 'Sidama', NULL),
  ('yirgacheffe', 'Yirgacheffe', 'Ethiopia', 'Gedeo', NULL),

  -- Colombian regions
  ('huila', 'Huila', 'Colombia', 'Huila', NULL),
  ('san-agustin', 'San Agustín', 'Colombia', 'Huila', NULL),
  ('tolima', 'Tolima', 'Colombia', 'Tolima', NULL),
  ('santander', 'Santander', 'Colombia', NULL, NULL),

  -- Other regions
  ('arusha', 'Arusha', 'Tanzania', NULL, NULL),
  ('central-america', 'Central America', 'Central America', NULL, NULL),
  ('central-highlands', 'Central Highlands', 'Vietnam', 'Central Highlands', NULL),
  ('mandheling', 'Mandheling', 'Indonesia', 'Sumatra', NULL),
  ('marcala', 'Marcala', 'Honduras', 'La Paz', NULL),
  ('nyabihu', 'Nyabihu', 'Rwanda', 'Western Province', NULL),
  ('nyeri', 'Nyeri', 'Kenya', 'Central', NULL),
  ('santa-ana', 'Santa Ana', 'El Salvador', NULL, NULL),
  ('sul-de-minas', 'Sul de Minas', 'Brazil', 'Minas Gerais', NULL),
  ('tarrazu', 'Tarrazú', 'Costa Rica', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Note: The following entries from CSV were handled:
-- - "Sakleshpur" -> "Sakleshpur" (encoding issue fixed)
-- - "San Agust" -> "San Agustín" (encoding issue fixed)
-- - "Tarraz" -> "Tarrazú" (encoding issue fixed)
-- - "Clombia" -> "Colombia" (typo fixed for Santander)
-- - Empty country for "Coonor" -> Set to "India" based on state "Tamil Nadu"
-- - Empty state/country entries were handled appropriately


