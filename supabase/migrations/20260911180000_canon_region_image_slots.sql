-- Migration: Fixed image slots on canon_regions
-- Description: Region pages carry four named images, one per role: a card badge (Coffee
--   Board logo style), a horizontal hero, one for the terroir/growing-conditions block, and
--   one for the Indian-specialty-context block. `logo_url` and `hero_image_url` already
--   exist (20260106000000 / 20260729191151); this adds the other two.
--
--   Columns, not canon_media rows. canon_media is a GALLERY — `sort_order`, `is_hero`, N
--   rows per entity, no role column — so addressing a specific slot through it would mean
--   either a new role vocabulary or string-parsing the ImageKit path. Four fixed slots are
--   four columns: no join, no null-row handling, and `get_region_detail` returns them for
--   free because it does `to_jsonb(cr)`. canon_media stays for genuine variable-length
--   photo sets, which is what estates will want (owner, processing, panoramic).
--
--   Images are hosted on ImageKit, uploaded by icb-claude/canon/upload_media.py from
--   canon/media/regions/<slug>/{card,hero,terroir,context}.{png,jpg,webp}. The uploader
--   writes the resulting CDN URL into the matching column here. `useUniqueFileName=false`
--   means re-running after a recut overwrites the same CDN path, so the stored URL is stable.
--
-- Compatibility: purely additive, both nullable, no defaults. get_region_detail's jsonb
--   gains two keys (additive; no Zod schema in src/ uses .strict()). No view or MV reads
--   canon_regions image columns. Regenerate types after applying:
--     npm run supabase:types && npx prettier --write src/types/supabase-types.ts
--
-- Rollback:
--   alter table public.canon_regions
--     drop column if exists context_image_url,
--     drop column if exists terroir_image_url;

BEGIN;

ALTER TABLE public.canon_regions
  ADD COLUMN IF NOT EXISTS terroir_image_url text,
  ADD COLUMN IF NOT EXISTS context_image_url text;

COMMENT ON COLUMN public.canon_regions.logo_url IS
  'Card badge image (Coffee Board logo style), ImageKit. Slot: card.';
COMMENT ON COLUMN public.canon_regions.hero_image_url IS
  'Horizontal hero image, ImageKit. Slot: hero.';
COMMENT ON COLUMN public.canon_regions.terroir_image_url IS
  'Image for the terroir / growing-conditions block, ImageKit. Slot: terroir.';
COMMENT ON COLUMN public.canon_regions.context_image_url IS
  'Image for the Indian specialty context block, ImageKit. Slot: context.';

COMMIT;
