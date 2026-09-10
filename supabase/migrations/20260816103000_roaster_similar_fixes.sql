-- Two fixes to roaster_similar (see 20260815181330_roaster_similarity.sql).
--
-- 1. shared_tags could offer two values of the same facet as the reason for a
--    match. /roasters/6-degrees-coffee shipped a card reading "Dark roast" AND
--    "Medium Dark roast" — the 20% catalogue threshold admits several values per
--    facet, and the flat top-4 slice never deduped by prefix. Now at most one tag
--    per prefix survives (the highest-IDF one), so four chips mean four different
--    kinds of trait. Scoring is untouched: this only changes which tags are shown
--    as the reason, never which roasters match or in what order.
--
-- 2. The original migration's closing comment claimed "No grants to anon/
--    authenticated". It was wrong. Supabase's ALTER DEFAULT PRIVILEGES granted
--    both roles the full ACL on creation:
--      relacl -> {postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,
--                 authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}
--    so the view — similarity scores included — was readable straight off
--    PostgREST, bypassing the SECURITY DEFINER get_roaster_detail it is supposed
--    to be read through. Same class of bug as 20260709120310. Revoked below,
--    FROM PUBLIC as well as the named roles, and re-verified with
--    has_table_privilege rather than assumed.
--
-- A matview cannot be CREATE OR REPLACE'd, so this drops and rebuilds. The body
-- is the original definition with the shared_tags change only.

DROP MATERIALIZED VIEW IF EXISTS public.roaster_similar;

CREATE MATERIALIZED VIEW public.roaster_similar AS
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
         -- Kept unsliced here — the per-prefix dedupe below needs the full ranked
         -- list, or dropping a duplicate roast level would just shorten the row
         -- instead of promoting the next distinct trait into its place.
         array_agg(va.tag ORDER BY va.w DESC, va.tag) FILTER (WHERE va.w >= 0.7) AS candidate_tags
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
       -- One tag per prefix, highest-IDF wins, original IDF order preserved, top 4.
       -- unnest of a NULL candidate_tags yields no rows, so shared_tags stays NULL
       -- for pairs that share nothing rare — the RPC coalesces that to [].
       (SELECT (array_agg(s.tag ORDER BY s.ord))[1:4]
        FROM (
          SELECT DISTINCT ON (split_part(t.tag, ':', 1)) t.tag, t.ord
          FROM unnest(r.candidate_tags) WITH ORDINALITY AS t(tag, ord)
          ORDER BY split_part(t.tag, ':', 1), t.ord
        ) s) AS shared_tags,
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
  'IDF-weighted cosine similarity between roasters over declared tags + catalogue facets. Deliberately non-geographic. shared_tags holds at most one tag per facet prefix. Read via get_roaster_detail; refreshed by refresh_coffee_directory_mv().';

-- Reads go through get_roaster_detail (SECURITY DEFINER), so no role needs a
-- direct grant. Revoking FROM PUBLIC too — see the header note.
REVOKE ALL ON public.roaster_similar FROM PUBLIC;
REVOKE ALL ON public.roaster_similar FROM anon, authenticated;
