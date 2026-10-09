-- Data fix: canon_regions altitudes -> Coffee Board published region specs.
-- The enriched values came from an unsourced reference table in icb-claude's enrich-canon skill (now corrected).
-- Source: indiacoffee.org "Coffee Regions of India", archived 2017-03-01
--   https://web.archive.org/web/20170301203808/http://www.indiacoffee.org/coffee-regions-india.html?page=CoffeeRegionsIndia
-- chikmagalur is the district row (includes baba-budangiri) -> union of CB Chikmagalur 700-1200 + Bababudangiris 1000-1500.
-- Untouched on purpose: northeast-india and its children (CB's 800-1200 is the Brahmaputra tract, not a
-- Meghalaya/Nagaland band), araku-valley (already matches), pandaravalli-village-mallenahalli (locality figure).

update canon_regions as c
set altitude_min_m = v.lo, altitude_max_m = v.hi, updated_at = now()
from (values
  ('chikmagalur',          700, 1500),
  ('baba-budangiri',      1000, 1500),
  ('kodagu-coorg',         750, 1100),
  ('hassan',               900, 1100),
  ('sakleshpur',           900, 1100),
  ('manjarabad',           900, 1100),
  ('biligiriranga-hills', 1500, 2000),
  ('wayanad',              600,  900),
  ('idukki',               400, 1600),
  ('nilgiri-hills',        900, 1400),
  ('palani-hills',         600, 2000),
  ('shevaroy-hills',       900, 1500),
  ('valparai',            1000, 1400),
  -- children that copied the old 900-1800 Chikmagalur band; clipped to the corrected district band
  ('mudigere',             900, 1500),
  ('aldur-kerehaklu',      900, 1500)
) as v(slug, lo, hi)
where c.slug = v.slug;

-- Description prose that quoted the old ranges (replace() is a no-op once applied).
update canon_regions set description = replace(description, 'from about 900 to 1,800 metres', 'from about 700 to 1,500 metres') where slug = 'chikmagalur';
update canon_regions set description = replace(description, 'about 1,500 to 1,800 metres', 'about 1,000 to 1,500 metres') where slug = 'baba-budangiri';
update canon_regions set description = replace(description, 'roughly 900–1,800m', 'roughly 700–1,500m') where slug = 'aldur-kerehaklu';
update canon_regions set description = replace(description, 'roughly 900 to 1,500 metres', 'roughly 1,500 to 2,000 metres') where slug = 'biligiriranga-hills';
