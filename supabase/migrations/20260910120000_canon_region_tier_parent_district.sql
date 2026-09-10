-- Migration: canon_regions precision tier + self-referential hierarchy + sourced area figures
-- Description: canon_regions is a flat list of 85 rows, so a district and a village inside it are
--   siblings and coffee counts do not roll up (chikmagalur shows 457 and omits its 183 Baba
--   Budangiri lots; hassan shows 8 while sakleshpur, a taluk OF Hassan, shows 76). Adds a precision
--   tier, a parent edge, the NRSC district, and provenance for area figures. No new table.
--
--   `tier` is PRECISION, not page-worthiness: baba-budangiri is a 'locality' with 183 coffees and its
--   own page; virajpet will be a 'taluk' with India's largest coffee area and no page. Page decisions
--   live in src/lib/discovery/landing-pages/region-pages.ts, not in this column.
--
--   Plan: icb-claude/docs/canon-regions-nrsc-alignment.md (data)
--         icb-claude/docs/canon-regions-frontend-plan.md (frontend)
--   Source for the figures this enables: Coffee Board x ISRO Coffee Plantation Atlas of India,
--   September 2024 (taluk-level satellite inventory).
--
-- Compatibility: purely additive. All columns nullable, no defaults, no column drops or retypes.
--   - get_region_detail / get_estate_detail use to_jsonb(cr), so their payloads gain 5 keys.
--     Additive only, and no Zod schema in src/ uses .strict(), so parsing is unaffected. Both RPCs
--     are currently called by no app code.
--   - coffee_directory_mv and the search/facet functions only LEFT JOIN canon_regions and select
--     named columns (creg.display_name etc.), so no view or MV needs rebuilding or refreshing.
--   - Regenerate types after applying: npm run supabase:types
--
-- Rollback:
--   alter table public.canon_regions
--     drop constraint if exists canon_regions_area_needs_source,
--     drop constraint if exists canon_regions_no_self_parent,
--     drop constraint if exists canon_regions_tier_check;
--   drop index if exists public.canon_regions_tier_country_idx;
--   drop index if exists public.canon_regions_parent_id_idx;
--   alter table public.canon_regions
--     drop column if exists area_as_of,
--     drop column if exists area_source,
--     drop column if exists district,
--     drop column if exists parent_id,
--     drop column if exists tier;

BEGIN;

-- ── 1. Structural columns ─────────────────────────────────────────────────────
ALTER TABLE public.canon_regions
  ADD COLUMN IF NOT EXISTS tier        text,
  ADD COLUMN IF NOT EXISTS parent_id   uuid REFERENCES public.canon_regions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS district    text,
  ADD COLUMN IF NOT EXISTS area_source text,
  ADD COLUMN IF NOT EXISTS area_as_of  date;

COMMENT ON COLUMN public.canon_regions.tier IS
  'Precision level, not page-worthiness: region | district | taluk | locality | aggregate | non-terroir';
COMMENT ON COLUMN public.canon_regions.parent_id IS
  'Containing canon region. Null at top. Coffee counts roll UP this edge.';
COMMENT ON COLUMN public.canon_regions.district IS
  'NRSC/administrative district (Kodagu, Hassan, Alluri Sitharama Raju...). Null for non-India rows.';
COMMENT ON COLUMN public.canon_regions.area_source IS
  'Provenance of area_hectares, e.g. "NRSC 2024". No figure without a source.';
COMMENT ON COLUMN public.canon_regions.area_as_of IS
  'As-of date for area_hectares. The NRSC atlas is 2024-09; Coffee Board web figures are 2014.';

-- Reuses the existing area_hectares column (20260729191151) rather than adding an NRSC-specific one.

-- ── 2. Constraints ────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canon_regions_tier_check') THEN
    ALTER TABLE public.canon_regions
      ADD CONSTRAINT canon_regions_tier_check CHECK (
        tier IS NULL OR tier IN
          ('region', 'district', 'taluk', 'locality', 'aggregate', 'non-terroir')
      );
  END IF;

  -- A row cannot be its own parent. Deeper cycles are checked in
  -- icb-claude/canon/region_structure.py --check; Postgres cannot express that in CHECK.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canon_regions_no_self_parent') THEN
    ALTER TABLE public.canon_regions
      ADD CONSTRAINT canon_regions_no_self_parent CHECK (parent_id IS NULL OR parent_id <> id);
  END IF;

  -- An area figure must be attributable and dated -- this is what made the existing
  -- area_hectares values unusable: nobody knows where they came from.
  --
  -- NOT VALID is deliberate. Four rows already carry an unsourced area_hectares
  -- (araku-valley 5000, chachapoyas-amazonas-peru 53258, eastern-himalayan-region-of-kalimpong 142,
  -- jampui-hills 600) and a validated constraint would abort this migration. NOT VALID enforces the
  -- rule on every INSERT/UPDATE from now on while grandfathering those four. The NRSC backfill
  -- (plan Phase 2) replaces the Indian ones with sourced figures; run
  --   ALTER TABLE public.canon_regions VALIDATE CONSTRAINT canon_regions_area_needs_source;
  -- in a follow-up migration once the remaining unsourced rows are resolved.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canon_regions_area_needs_source') THEN
    ALTER TABLE public.canon_regions
      ADD CONSTRAINT canon_regions_area_needs_source CHECK (
        area_hectares IS NULL OR (area_source IS NOT NULL AND area_as_of IS NOT NULL)
      ) NOT VALID;
  END IF;
END $$;

-- ── 3. Indexes ────────────────────────────────────────────────────────────────
-- parent_id: every rollup query walks this edge.
-- (tier, country): the /regions hub and every generateStaticParams filter on
-- (tier = 'region' AND country = 'India').
CREATE INDEX IF NOT EXISTS canon_regions_parent_id_idx
  ON public.canon_regions (parent_id);
CREATE INDEX IF NOT EXISTS canon_regions_tier_country_idx
  ON public.canon_regions (tier, country);

COMMIT;

-- ── Note on `subregion` ───────────────────────────────────────────────────────
-- canon_regions.subregion (35/85 filled, inconsistent -- often a snake_case echo of the slug) is
-- superseded by tier + parent_id. NOT dropped here: drop it in a follow-up migration once the
-- structural backfill has landed and nothing reads it, so this migration stays reversible.
