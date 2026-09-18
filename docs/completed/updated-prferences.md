You are a senior Postgres + Supabase data engineer helping evolve an existing user taste-profile cache into a behavior-derived scoring system for a coffee discovery platform called IndianCoffeeBeans (ICB).

Your job is to write a **production-ready SQL migration** that upgrades the current taste profile cache from simple top-tag aggregation into a **weighted, normalized, stable preference model** that can later power interpretable user identity buckets.

Do not invent a brand-new architecture unless necessary. Prefer to **extend the current schema and refresh function cleanly**.

## Context

ICB is a coffee discovery + taste identity platform. Users rate coffees, can optionally recommend them, and have public profiles.

Current relevant pieces already exist:

* `public.latest_reviews_per_identity`
* `public.coffee_directory_mv`
* `public.coffees`
* `public.roasters`
* `public.canon_sensory_nodes`
* `public.user_taste_profile_cache`
* `public.get_user_profile_full(p_username, p_viewer_id)`
* `public.refresh_user_taste_profile_cache(p_user_id)`

Current cache already stores some simple aggregates such as:

* `top_roast_levels`
* `top_brew_methods`
* `top_flavor_note_ids`
* `top_roaster_ids`
* `top_region_names`
* `top_processes`
* `top_species`
* `avg_rating`
* `recommend_rate`
* `single_origin_pct`
* `distinct_roaster_count`
* `rating_distribution`
* `total_reviews`
* timestamps and review count at compute

Current logic mostly counts frequency of touched coffees. That is no longer enough.

## Goal

Upgrade the cache so it models:

1. **Preference**, not just exposure
2. **Stable normalized distributions**, not just top arrays
3. **Interpretable derived dimensions**
4. A clean base for later bucket assignment

Do this entirely in **Postgres / SQL / PLpgSQL**, with no ML infra.

## Important modeling rules

### A. Preference must be weighted

Every reviewed coffee should contribute a positive preference weight based on rating and recommendation.

Use this exact base formula unless there is a strong implementation reason to wrap it in helper expressions:

```sql
GREATEST(0, r.rating - 3.5) + CASE WHEN r.recommend = true THEN 0.75 ELSE 0 END
```

Call this the **positive preference weight**.

Notes:

* coffees rated poorly or neutrally should not contribute much or anything to positive preference
* recommended coffees should count more
* do not use plain COUNT(*) for preference distributions

### B. Use `coffee_directory_mv` as the primary metadata source

Prefer `coffee_directory_mv` for:

* roast level
* process
* bean species
* roaster_id
* canon_region_names
* canon_flavor_node_ids
* canon_flavor_families
* canon_flavor_subcategories
* brew_method_canonical_keys if available

Avoid unnecessary traversal of old junction tables if the MV already exposes what we need.

### C. Flavor modeling must be rolled up

Do **not** make raw flavor leaf nodes the primary taste model.

Use this hierarchy:

* **primary scoring level:** flavor families
* **secondary scoring level:** flavor subcategories
* **leaf flavor descriptors / node ids:** evidence only, not the primary core model

If the MV already contains arrays like `canon_flavor_families` and `canon_flavor_subcategories`, use them directly.
Only keep `top_flavor_note_ids` if needed for backward compatibility or evidence display.

### D. Low-data stability matters

The system must work for users with low-to-mid data.

Design with:

* minimum review thresholds
* smoothing / fallback behavior
* no fake certainty

Do not overcomplicate Bayesian math if it will make SQL ugly and brittle. Prefer practical smoothing that is implementable.

## Deliverable

Write a SQL migration that does all of the following.

---

# Part 1 — Schema changes

Extend `public.user_taste_profile_cache` with new columns needed for v1 scoring.

Add at least:

### Weighted normalized preference distributions

* `roast_pref_json JSONB`
* `process_pref_json JSONB`
* `species_pref_json JSONB`
* `flavor_family_pref_json JSONB`
* `flavor_subcategory_pref_json JSONB`
* `brew_pref_json JSONB`

These should store normalized weighted distributions, e.g.

```json
{"light": 0.42, "medium_light": 0.31, "medium": 0.18}
```

### Extra distinct counts for breadth

* `distinct_region_count INT`
* `distinct_process_count INT`
* `distinct_roast_count INT`
* `distinct_brew_method_count INT`

### Derived dimension scores

* `breadth_score NUMERIC(5,4)`
* `selectivity_score NUMERIC(5,4)`
* `orientation_score NUMERIC(5,4)`
* `confidence_score NUMERIC(5,4)`

### Optional helper columns if useful

You may also add:

* `concentration_score NUMERIC(5,4)`
* `bucket_key TEXT`
* `bucket_confidence NUMERIC(5,4)`
* `bucket_evidence JSONB`

But these bucket columns are optional for this migration. If you think bucketing should be deferred, say so in comments and omit them.

Add helpful comments on all new columns.

---

# Part 2 — Refresh function rewrite

Rewrite `public.refresh_user_taste_profile_cache(p_user_id UUID)` so it computes the new preference model.

Keep the existing security pattern:

* user can refresh only their own cache
* service role/system execution remains allowed

Maintain current cache-upsert behavior.

## Required computation steps inside the function

### Step 1: Build a base review dataset

Use `latest_reviews_per_identity` joined to `coffee_directory_mv` and `coffees`.

Filter:

* `entity_type = 'coffee'`
* current user only
* ratings not null where appropriate

For each review row compute:

* `positive_weight = GREATEST(0, rating - 3.5) + CASE WHEN recommend = true THEN 0.75 ELSE 0 END`

### Step 2: Compute weighted preference distributions

For each of these attribute groups, compute weighted scores using `SUM(positive_weight)` and then normalize so values sum to 1 within that group:

* roast level
* process
* bean species
* brew method used in review
* flavor families
* flavor subcategories

Important:

* if positive weight total is zero, return empty JSON or a safe fallback rather than divide by zero
* use stable ordering in JSON construction if practical

### Step 3: Preserve top arrays for backward compatibility

Continue computing existing arrays where still useful:

* `top_roast_levels`
* `top_brew_methods`
* `top_flavor_note_ids`
* `top_roaster_ids`
* `top_region_names`
* `top_processes`
* `top_species`

But these should now preferably be ranked by **weighted score**, not plain frequency, wherever that makes sense.

### Step 4: Compute scalar stats

Keep or compute:

* `avg_rating`
* `recommend_rate`
* `single_origin_pct`
* `distinct_roaster_count`
* `rating_distribution`
* `total_reviews`

Also compute:

* `distinct_region_count`
* `distinct_process_count`
* `distinct_roast_count`
* `distinct_brew_method_count`

### Step 5: Compute derived dimension scores

#### Breadth score

Implement a practical v1 breadth score using diversity across:

* roasters
* regions
* processes
* roast levels
* brew methods

Use normalized Shannon entropy if you can do it cleanly in SQL.
If that becomes too messy, use a simpler normalized diversity approach, but prefer entropy.

Target idea:

* compute normalized entropy per axis from user distribution on that axis
* combine with weights:

  * roaster: 0.30
  * region: 0.20
  * process: 0.20
  * roast: 0.15
  * brew: 0.15

Then scale down breadth for tiny review counts so users with 3 reviews do not look maximally exploratory.

A reasonable reliability multiplier is acceptable.

#### Selectivity score

Compute a bounded 0–1 score using:

* recommendation rate
* rating variance or rating spread
* low-rating share
* gap between avg recommended rating and avg rating if easy to compute

Practical guidance:

* higher selectivity = harder to impress
* lower recommendation rate should generally increase selectivity
* more rating spread should generally increase selectivity

Do not overengineer. Stable and explainable beats mathematically ornate.

#### Orientation score

Compute a bounded score, ideally from -1 to +1 or transformed to 0–1 if you prefer, that represents:

* comfort/classic leaning vs
* bright/expressive/experimental leaning

Base this on weighted positive preference distributions.

Treat these as example signals:

**Comfort / classic side**

* darker or medium roasts
* chocolate / nutty / caramel / spice families/subcategories
* more comfort-forward styles

**Bright / expressive side**

* lighter roasts
* citrus / floral / berry / stone fruit / tea-like families/subcategories
* more expressive or experimental process styles

You must implement this with a clear, explicit mapping in SQL comments. Hardcode a first-pass mapping if needed.

Do not let orientation depend on a single field only. Use at least roast + flavor family/subcategory, and optionally process.

#### Confidence score

Compute a practical confidence score based on:

* number of reviews
* amount of positive preference evidence
* consistency / concentration of profile if possible

This does not need to be perfect. It should mainly prevent overconfident interpretation for sparse users.

---

# Part 3 — get_user_profile_full update

Update `public.get_user_profile_full(...)` so the returned `taste_profile` includes the new columns.

Return at least:

* new normalized JSON preference objects
* breadth_score
* selectivity_score
* orientation_score
* confidence_score
* distinct counts added above

Keep current resolved outputs:

* `top_flavor_labels`
* `top_roasters`

Preserve existing function behavior:

* username/UUID lookup
* privacy checks
* cache refresh gating

Do not break current consumers if avoidable.

---

# Part 4 — Coding constraints

## General

* Produce a **single coherent migration file**
* Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
* Use `CREATE OR REPLACE FUNCTION`
* Use `COALESCE` defensively
* Avoid breaking existing cache reads
* Keep comments clear and useful

## SQL quality

* Make the SQL readable
* Prefer CTEs for complex calculations
* Avoid duplicated logic if helper subqueries can make it clearer
* Do not write pseudocode; write executable SQL / PLpgSQL

## Safety / correctness

* Avoid divide-by-zero
* Handle NULL arrays cleanly
* Handle users with fewer than 3 reviews gracefully
* Keep refresh function secure

---

# Part 5 — Implementation preference

I want a **practical v1**, not a PhD thesis.

That means:

### Yes:

* weighted preference scoring
* normalized JSON distributions
* interpretable dimension scores
* simple explicit mappings
* backward-compatible arrays

### No:

* ML
* embeddings
* collaborative filtering
* graph algorithms
* elaborate Bayesian modeling that is hard to maintain
* overfitting to raw leaf flavor nodes

If a choice arises, choose the simpler, more defensible implementation.

---

# Part 6 — Output format

Return:

1. the full SQL migration
2. a short explanation section after the SQL describing:

   * what changed
   * any assumptions
   * any parts that may need tuning later

Do not be vague. Be concrete.

If you think one part should be deferred, state that clearly in comments and explanation.

Important: write the migration in a way that I can paste it into my Supabase migrations folder and review it directly.
