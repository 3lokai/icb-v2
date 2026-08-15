-- Roaster similarity — "roasters that roast like this one".
--
-- Roaster profiles are orphaned in the link graph: as of 2026-08-15, 19 of 93
-- profiles are still not indexed, and 12 of those were crawled and declined.
-- The /roasters hub link alone did not fix it (it moved at most 3 profiles in
-- 20 days). Profiles need to link to each other.
--
-- Geographic bucketing ("more roasters from Karnataka") was considered and
-- rejected: it is obvious to the reader, useless to anyone who actually cares
-- about coffee, and it would have produced a worse link graph — Bangalore has 19
-- roasters and the rest is a long tail of 1s that would link to nobody.
--
-- Instead each roaster becomes a bag of tags from two sources:
--   1. declared  — specialty_focus, sourcing_model, certifications on `roasters`
--   2. catalogue — process / roast_level / bean_species / varieties, derived from
--                  their active coffees, kept only when the facet covers >= 20%
--                  of the catalogue, so one stray anaerobic lot out of 40 does
--                  not brand a roaster "experimental".
--
-- Tags are IDF-weighted: w = ln(N / df). This is the whole trick. `single-origin`
-- sits on 83 of 96 roasters and scores ~0.15; `liberica` sits on 5 and scores
-- ~2.96. Sharing a rare trait counts, sharing a universal one barely does — no
-- hand-maintained stopword list, and the weights rebalance as the catalogue grows.
--
-- Score is cosine similarity over those weighted vectors, so a 300-SKU roaster
-- and a 12-SKU roaster are comparable.
--
-- ponytail: materialized view refreshed alongside coffee_directory_mv. 96 roasters
-- x ~1250 coffees builds in well under a second. Revisit only past ~5000 roasters.

-- ── 1. The view ───────────────────────────────────────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS public.roaster_similar AS
WITH active AS (
  SELECT id, slug, name FROM roasters WHERE is_active
),
n AS (SELECT count(*)::numeric AS total FROM active),

coffee_facets AS (
  SELECT roaster_id, 'process:' || process::text AS tag FROM coffees
    WHERE is_coffee AND status = 'active' AND process IS NOT NULL
  UNION ALL
  SELECT roaster_id, 'roast:' || roast_level::text FROM coffees
    WHERE is_coffee AND status = 'active' AND roast_level IS NOT NULL
  UNION ALL
  SELECT roaster_id, 'species:' || bean_species::text FROM coffees
    WHERE is_coffee AND status = 'active' AND bean_species IS NOT NULL
  UNION ALL
  SELECT c.roaster_id, 'variety:' || v FROM coffees c, unnest(c.varieties) v
    WHERE c.is_coffee AND c.status = 'active'
),
catalogue_size AS (
  SELECT roaster_id, count(*)::numeric AS sku_count FROM coffees
  WHERE is_coffee AND status = 'active' GROUP BY roaster_id
),
catalogue_tags AS (
  SELECT cf.roaster_id AS id, cf.tag
  FROM coffee_facets cf
  JOIN catalogue_size cs ON cs.roaster_id = cf.roaster_id
  GROUP BY cf.roaster_id, cf.tag, cs.sku_count
  HAVING count(*) / cs.sku_count >= 0.20
),

tags AS (
  SELECT a.id, 'focus:' || f    AS tag FROM active a JOIN roasters r ON r.id = a.id, unnest(r.specialty_focus) f
  UNION ALL
  SELECT a.id, 'sourcing:' || s AS tag FROM active a JOIN roasters r ON r.id = a.id, unnest(r.sourcing_model) s
  UNION ALL
  SELECT a.id, 'cert:' || c     AS tag FROM active a JOIN roasters r ON r.id = a.id, unnest(r.certifications) c
  UNION ALL
  SELECT ct.id, ct.tag FROM catalogue_tags ct JOIN active a ON a.id = ct.id
),

-- w = 0 means every roaster carries the tag; it can never discriminate, so drop it.
idf AS (
  SELECT t.tag, ln((SELECT total FROM n) / count(DISTINCT t.id)) AS w
  FROM tags t GROUP BY t.tag
),
vec AS (
  SELECT t.id, t.tag, i.w FROM tags t JOIN idf i ON i.tag = t.tag WHERE i.w > 0
),
norm AS (
  SELECT id, sqrt(sum(w * w)) AS len FROM vec GROUP BY id
),

pairs AS (
  SELECT va.id AS roaster_id,
         vb.id AS similar_roaster_id,
         sum(va.w * vb.w) / (na.len * nb.len) AS score,
         -- w >= 0.7 == held by fewer than half the roasters. Commodity traits
         -- ("single-origin", "arabica") still count toward the score but are never
         -- offered as the reason; shared_tags is null when nothing rare is shared.
         (array_agg(va.tag ORDER BY va.w DESC) FILTER (WHERE va.w >= 0.7))[1:4] AS shared_tags
  FROM vec va
  JOIN vec vb ON vb.tag = va.tag AND vb.id <> va.id
  JOIN norm na ON na.id = va.id
  JOIN norm nb ON nb.id = vb.id
  GROUP BY va.id, vb.id, na.len, nb.len
),
ranked AS (
  SELECT p.*, row_number() OVER (PARTITION BY p.roaster_id ORDER BY p.score DESC, p.similar_roaster_id) AS rank
  FROM pairs p
  WHERE p.score >= 0.15   -- below this the pair shares only commodity traits
)
SELECT r.roaster_id,
       r.similar_roaster_id,
       a.slug AS similar_slug,
       a.name AS similar_name,
       round(r.score::numeric, 4) AS score,
       r.shared_tags,
       r.rank
FROM ranked r
JOIN active a ON a.id = r.similar_roaster_id
WHERE r.rank <= 8;

-- unique index is required for REFRESH ... CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS roaster_similar_pk
  ON public.roaster_similar (roaster_id, similar_roaster_id);
CREATE INDEX IF NOT EXISTS roaster_similar_lookup
  ON public.roaster_similar (roaster_id, rank);

COMMENT ON MATERIALIZED VIEW public.roaster_similar IS
  'IDF-weighted cosine similarity between roasters over declared tags + catalogue facets. Deliberately non-geographic. Read via get_roaster_detail; refreshed by refresh_coffee_directory_mv().';

-- No grants to anon/authenticated: reads go through get_roaster_detail, which is
-- SECURITY DEFINER. Keeps this consistent with the RPC lockdown migrations.

