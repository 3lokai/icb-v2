-- Migration: Correct coffee-growing altitudes for three regions
-- Description: `altitude_min_m`/`altitude_max_m` on these rows recorded the elevation of
--   the hill range, not the band coffee actually grows in — the Palanis' 2,200m is the
--   massif above Kodaikanal, the Nilgiris' 2,500m is near Doddabetta, Wayanad's 2,100m is
--   Chembra Peak. Since the /coffees/<region> pages now render these figures straight from
--   canon_regions (they used to be hardcoded prose), the wrong number was on the page.
--
--   Corrected to the coffee-growing bands published by the Specialty Coffee Association of
--   India's region pages (sicc.coffee/regions/{pulneys,nilgiris,wayanad}, read 2026-09-11),
--   which agree with the Coffee Board's "lower and middle slopes" description for the
--   Pulneys. Rainfall left untouched: SICC publishes ranges, and a midpoint would invent
--   precision the source doesn't have.

UPDATE public.canon_regions
SET altitude_min_m = 800, altitude_max_m = 1500
WHERE slug = 'palani-hills' AND country = 'India';

UPDATE public.canon_regions
SET altitude_min_m = 900, altitude_max_m = 1800
WHERE slug = 'nilgiri-hills' AND country = 'India';

UPDATE public.canon_regions
SET altitude_min_m = 700, altitude_max_m = 1200
WHERE slug = 'wayanad' AND country = 'India';
