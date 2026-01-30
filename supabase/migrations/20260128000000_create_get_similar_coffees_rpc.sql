-- Migration: Create get_similar_coffees RPC function
-- Created: 2026-01-28
-- Description: RPC function to find similar coffees based on flavor overlap, roast level, process, and origin.
--              Uses intelligent matching algorithm to select diverse, relevant coffees.

-- ============================================================================
-- FUNCTION: get_similar_coffees
-- ============================================================================

-- Drop existing function (exact signature) for clean re-runs
DROP FUNCTION IF EXISTS public.get_similar_coffees(
  uuid,
  uuid[],
  roast_level_enum,
  process_enum,
  uuid[],
  uuid[],
  uuid,
  int,
  text
);

CREATE OR REPLACE FUNCTION get_similar_coffees(
  p_coffee_id uuid,
  p_canon_flavor_node_ids uuid[] default null,
  p_roast_level roast_level_enum default null,
  p_process process_enum default null,
  p_region_ids uuid[] default null,
  p_estate_ids uuid[] default null,
  p_roaster_id uuid default null,
  p_limit int default 4,
  p_seed text default null  -- For stable randomness
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb := '[]'::jsonb;
  v_candidates jsonb;
  v_selected jsonb := '[]'::jsonb;
  v_flavor_picks jsonb := '[]'::jsonb;
  v_style_picks jsonb := '[]'::jsonb;
  v_origin_picks jsonb := '[]'::jsonb;
  v_selected_ids uuid[] := '{}';
  v_candidate jsonb;
  v_flavor_overlap_count int;
  v_overlap_flavor_ids uuid[];
  v_roast_match boolean;
  v_process_match boolean;
  v_origin_match boolean;
  v_same_roaster boolean;
  v_composite_score numeric;
begin
  -- Build candidate pool from coffee_directory_mv
  -- Exclude current coffee, non-live status, prefer coffees with images
  select jsonb_agg(
    jsonb_build_object(
      'coffee_id', coffee_id,
      'slug', slug,
      'name', name,
      'roaster_id', roaster_id,
      'roaster_name', roaster_name,
      'roast_level', roast_level,
      'process', process,
      'region_ids', region_ids,
      'estate_ids', estate_ids,
      'image_url', image_url,
      'rating_avg', rating_avg,
      'rating_count', rating_count,
      'canon_flavor_node_ids', canon_flavor_node_ids
    )
    order by 
      case when image_url is not null then 0 else 1 end,
      rating_count desc nulls last,
      rating_avg desc nulls last
  )
  into v_candidates
  from coffee_directory_mv
  where coffee_id != p_coffee_id
    and status IN ('active', 'seasonal')
    and (
      -- Must have at least one matching criterion
      (p_canon_flavor_node_ids is not null and canon_flavor_node_ids && p_canon_flavor_node_ids)
      or (p_roast_level is not null and roast_level = p_roast_level)
      or (p_process is not null and process = p_process)
      or (p_region_ids is not null and region_ids && p_region_ids)
      or (p_estate_ids is not null and estate_ids && p_estate_ids)
    );

  if v_candidates is null then
    return v_result;
  end if;

  -- Process each candidate to compute match scores
  for v_candidate in select value from jsonb_array_elements(v_candidates)
  loop
    -- Compute flavor overlap
    if p_canon_flavor_node_ids is not null 
       and (v_candidate->>'canon_flavor_node_ids') is not null then
      select 
        array_length(
          array(
            select unnest(p_canon_flavor_node_ids)
            intersect
            select unnest((v_candidate->'canon_flavor_node_ids')::uuid[])
          ),
          1
        ),
        array(
          select unnest(p_canon_flavor_node_ids)
          intersect
          select unnest((v_candidate->'canon_flavor_node_ids')::uuid[])
        )
      into v_flavor_overlap_count, v_overlap_flavor_ids;
    else
      v_flavor_overlap_count := 0;
      v_overlap_flavor_ids := '{}';
    end if;

    -- Compute boolean matches
    v_roast_match := (p_roast_level is null) 
                     or (v_candidate->>'roast_level' = p_roast_level::text);
    v_process_match := (p_process is null) 
                       or (v_candidate->>'process' = p_process::text);
    v_origin_match := (p_region_ids is null and p_estate_ids is null)
                      or (
                        (p_region_ids is not null 
                         and (v_candidate->'region_ids')::uuid[] && p_region_ids)
                        or
                        (p_estate_ids is not null 
                         and (v_candidate->'estate_ids')::uuid[] && p_estate_ids)
                      );
    v_same_roaster := (p_roaster_id is not null) 
                      and ((v_candidate->>'roaster_id')::uuid = p_roaster_id);

    -- Compute composite score for fallback selection
    v_composite_score := 
      (coalesce(v_flavor_overlap_count, 0) * 10.0) +
      (case when v_roast_match then 5.0 else 0.0 end) +
      (case when v_process_match then 5.0 else 0.0 end) +
      (case when v_origin_match then 3.0 else 0.0 end) -
      (case when v_same_roaster then 2.0 else 0.0 end);  -- Diversity penalty

    -- Add computed fields to candidate
    v_candidate := v_candidate || jsonb_build_object(
      'flavor_overlap_count', v_flavor_overlap_count,
      'overlap_flavor_ids', to_jsonb(v_overlap_flavor_ids),
      'roast_match', v_roast_match,
      'process_match', v_process_match,
      'origin_match', v_origin_match,
      'same_roaster', v_same_roaster,
      'composite_score', v_composite_score
    );

    -- Categorize candidates
    if v_flavor_overlap_count > 0 then
      v_flavor_picks := v_flavor_picks || v_candidate;
    elsif v_roast_match and v_process_match then
      v_style_picks := v_style_picks || v_candidate;
    elsif v_origin_match then
      v_origin_picks := v_origin_picks || v_candidate;
    end if;
  end loop;

  -- Selection algorithm

  -- 1. Flavor picks (2): Sort by flavor_overlap_count DESC, process_match DESC, roast_match DESC
  --    Apply roaster diversity (prefer different roasters)
  for v_candidate in 
    select * from jsonb_array_elements(v_flavor_picks)
    order by 
      (value->>'flavor_overlap_count')::int desc,
      (value->>'process_match')::boolean desc,
      (value->>'roast_match')::boolean desc,
      (value->>'same_roaster')::boolean asc  -- Prefer different roasters
    limit 2
  loop
    if array_length(v_selected_ids, 1) < p_limit 
       and not ((v_candidate->>'coffee_id')::uuid = any(v_selected_ids)) then
      v_selected := v_selected || jsonb_build_object(
        'coffee_id', v_candidate->>'coffee_id',
        'match_type', 'flavor',
        'overlap_flavor_ids', v_candidate->'overlap_flavor_ids',
        'roast_match', (v_candidate->>'roast_match')::boolean,
        'process_match', (v_candidate->>'process_match')::boolean,
        'origin_match', (v_candidate->>'origin_match')::boolean
      );
      v_selected_ids := v_selected_ids || (v_candidate->>'coffee_id')::uuid;
    end if;
  end loop;

  -- 2. Roast+Process pick (1): roast_match AND process_match, then fallback to OR
  if array_length(v_selected_ids, 1) < p_limit then
    for v_candidate in 
      select * from jsonb_array_elements(v_style_picks)
      where (value->>'roast_match')::boolean = true
        and (value->>'process_match')::boolean = true
        and not ((value->>'coffee_id')::uuid = any(v_selected_ids))
      order by (value->>'composite_score')::numeric desc
      limit 1
    loop
      v_selected := v_selected || jsonb_build_object(
        'coffee_id', v_candidate->>'coffee_id',
        'match_type', 'style',
        'overlap_flavor_ids', v_candidate->'overlap_flavor_ids',
        'roast_match', (v_candidate->>'roast_match')::boolean,
        'process_match', (v_candidate->>'process_match')::boolean,
        'origin_match', (v_candidate->>'origin_match')::boolean
      );
      v_selected_ids := v_selected_ids || (v_candidate->>'coffee_id')::uuid;
    end loop;

    -- Fallback: roast_match OR process_match
    if array_length(v_selected_ids, 1) < p_limit then
      for v_candidate in 
        select * from jsonb_array_elements(v_candidates)
        where (
          (value->>'roast_match')::boolean = true
          or (value->>'process_match')::boolean = true
        )
        and not ((value->>'coffee_id')::uuid = any(v_selected_ids))
        order by (value->>'composite_score')::numeric desc
        limit 1
      loop
        v_selected := v_selected || jsonb_build_object(
          'coffee_id', v_candidate->>'coffee_id',
          'match_type', 'style',
          'overlap_flavor_ids', v_candidate->'overlap_flavor_ids',
          'roast_match', (v_candidate->>'roast_match')::boolean,
          'process_match', (v_candidate->>'process_match')::boolean,
          'origin_match', (v_candidate->>'origin_match')::boolean
        );
        v_selected_ids := v_selected_ids || (v_candidate->>'coffee_id')::uuid;
      end loop;
    end if;
  end if;

  -- 3. Origin pick (1): origin_match = true, fallback to best composite score
  if array_length(v_selected_ids, 1) < p_limit then
    for v_candidate in 
      select * from jsonb_array_elements(v_origin_picks)
      where (value->>'origin_match')::boolean = true
        and not ((value->>'coffee_id')::uuid = any(v_selected_ids))
      order by (value->>'composite_score')::numeric desc
      limit 1
    loop
      v_selected := v_selected || jsonb_build_object(
        'coffee_id', v_candidate->>'coffee_id',
        'match_type', 'origin',
        'overlap_flavor_ids', v_candidate->'overlap_flavor_ids',
        'roast_match', (v_candidate->>'roast_match')::boolean,
        'process_match', (v_candidate->>'process_match')::boolean,
        'origin_match', (v_candidate->>'origin_match')::boolean
      );
      v_selected_ids := v_selected_ids || (v_candidate->>'coffee_id')::uuid;
    end loop;
  end if;

  -- 4. Fill remaining slots using composite score
  if array_length(v_selected_ids, 1) < p_limit then
    for v_candidate in 
      select * from jsonb_array_elements(v_candidates)
      where not ((value->>'coffee_id')::uuid = any(v_selected_ids))
      order by (value->>'composite_score')::numeric desc
      limit (p_limit - array_length(v_selected_ids, 1))
    loop
      v_selected := v_selected || jsonb_build_object(
        'coffee_id', v_candidate->>'coffee_id',
        'match_type', 'fallback',
        'overlap_flavor_ids', v_candidate->'overlap_flavor_ids',
        'roast_match', (v_candidate->>'roast_match')::boolean,
        'process_match', (v_candidate->>'process_match')::boolean,
        'origin_match', (v_candidate->>'origin_match')::boolean
      );
      v_selected_ids := v_selected_ids || (v_candidate->>'coffee_id')::uuid;
    end loop;
  end if;

  return v_selected;
end;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on function get_similar_coffees is 
  'Finds similar coffees based on flavor overlap, roast level, process, and origin.
   Returns JSONB array with coffee_id, match_type, overlap_flavor_ids, and match flags.
   Algorithm prioritizes flavor overlap, then roast+process matches, then origin matches.';
