# Supabase advisor fixes — 2026-07-09

Fixes for the Supabase performance and security advisor findings on **ICB-v3**
(`fnpsnzqedznsgzxjsowe`), a live production project. Applying one migration at a
time via `npx supabase db push --linked`, reviewing the diff and advisor output
after each before moving to the next.

Baseline advisor counts (pulled live before any changes):

| Finding | Level | Count |
|---|---|---|
| `multiple_permissive_policies` | WARN | 640 |
| `auth_rls_initplan` | WARN | 123 |
| `unused_index` | INFO | 91 |
| `anon_security_definer_function_executable` | WARN | 43 |
| `authenticated_security_definer_function_executable` | WARN | 43 |
| `function_search_path_mutable` | WARN | 41 |
| `security_definer_view` | WARN | 12 |
| `duplicate_index` | WARN | 11 |
| `rls_enabled_no_policy` | INFO | 4 |
| `unindexed_foreign_keys` | INFO | 2 |
| `extension_in_public` | WARN | 2 |
| `rls_policy_always_true` | WARN | 1 |
| `auth_leaked_password_protection` | WARN | 1 |
| `auth_db_connections_absolute` | WARN | 1 |

Full audit trail and rationale for every change: `/home/gt/.claude/plans/can-you-refresh-the-noble-eich.md`.

---

## Migration 1 — `20260709120000_fix_rls_initplan_and_consolidate_policies.sql`

**What it does:** Drops ~20 dead `"Service role can manage X"` policies (no-ops,
since `service_role` has `rolbypassrls = true` in this project — confirmed via
`pg_roles`). Wraps every `auth.uid()` / `auth.role()` / `current_setting()` call
inside RLS policy expressions in a `(select ...)` subselect so Postgres evaluates
it once per query via InitPlan instead of once per row. Consolidates the repeated
per-table SELECT policies (public / authenticated / admin) into one policy per
table. Touches 43 of 47 tables that have RLS policies.

**Risk:** Medium blast radius (touches RLS on most of the schema) but each
individual change is a mechanical rewrite of an existing, tested condition —
no new logic, so behavior should be identical for every role. The main risk is
a transcription slip in one of the ~150 policy rewrites.

**Status:** ✅ Applied (2026-07-09), plus 2 follow-up fixes

**Review checklist after push:**
- [x] `npx supabase migration list` shows `20260709120000` as applied
- [x] Advisor: `multiple_permissive_policies` and `auth_rls_initplan` counts drop to ~0
- [x] Manual smoke test: `/coffees` directory loads, `/roasters` directory loads (both anon) — real data confirmed (Caarabi Coffee, Seven Beans Coffee Company, etc.)
- [x] Manual smoke test: roaster detail page and coffee detail page render with real data, no errors
- [ ] Manual smoke test: sign in, view own profile, view another user's public profile (needs a real session — deferred to browser testing)
- [ ] Manual smoke test: admin-only action still blocked for non-admin
- [ ] No new errors in Supabase logs / PostHog in the 15 min after push

**Outcome notes:** Applied cleanly. Advisor re-check afterward turned up a gap the
migration itself introduced: 4 tables with two `ALL` policies each (admin +
curator-owner) got split into insert/update/delete but the splits weren't merged
with each other, and `roasters` had 3 split-`ALL` pieces that duplicated
already-existing policies. Two tiny follow-up migrations fixed both:
- `20260709120050_merge_split_all_policies_on_curator_tables.sql` — merges the
  split insert/update/delete policies on `curation_lists`, `curation_selections`,
  `curator_gallery_images`, `curator_links`.
- `20260709120060_drop_redundant_split_roasters_policies.sql` — drops the 3
  redundant split pieces on `roasters` (equivalent/subset of policies that
  already existed).

After both follow-ups: `multiple_permissive_policies` 640→0, `auth_rls_initplan`
123→0, confirmed via `npx supabase db advisors --linked --type performance`.
Manual smoke tests still outstanding.

---

## Migration 2 — `20260709120100_fix_duplicate_and_missing_indexes.sql`

**What it does:** Drops 8 duplicate plain indexes and 4 duplicate/redundant
unique constraints (verified via `pg_constraint` that none of the dropped
constraints are referenced by a foreign key — the FK dependents are
`coffee_flavor_notes_flavor_note_id_fkey` and `flavor_note_to_canon_flavor_note_id_fkey`,
both pointing at `flavor_notes.id`, which is not one of the dropped constraints).
Adds 2 missing FK-covering indexes (`gear_catalog.created_by`, `roaster_members.invited_by`).

**Risk:** Low. Index/constraint drops only remove redundant structures that
duplicate a remaining index/constraint on the exact same columns — no query
should depend on the specific *name* being dropped (checked: no
`ON CONFLICT ON CONSTRAINT <name>` or raw index-name references anywhere in `src/`).

**Status:** ✅ Applied (2026-07-09)

**Review checklist after push:**
- [x] `npx supabase migration list` shows `20260709120100` as applied
- [x] Advisor: `duplicate_index` and `unindexed_foreign_keys` counts drop to 0
- [x] Manual smoke test: coffee detail page (reads `coffee_flavor_notes`, `coffee_regions`, `coffee_brew_methods`, `variants`, `prices`) renders cleanly, no errors
- [x] Manual smoke test: `/coffees` directory (filter facets) and roaster detail page (`roasters_slug_key`, `roaster_members`) both 200 with no errors
- [ ] Scraper/enrichment upsert paths (`raw_products`, etc.) — not exercised live, but no app code references the dropped constraint names by name (checked in planning phase)

**Outcome notes:** Applied cleanly, no follow-up needed this time. Full performance
advisor re-check afterward came back **"No issues found"** — `duplicate_index`,
`unindexed_foreign_keys`, `multiple_permissive_policies`, and `auth_rls_initplan`
are all now at 0.

---

## Migration 3 — `20260709120200_harden_function_search_path.sql`

**What it does:** Pins `search_path = public, pg_temp` on 41 functions that
previously had a mutable search_path (mirrors the pattern already used on
`is_roaster_owner` / `upsert_user_profile`). Also revokes `anon`/`authenticated`
grants on 6 internal platform/ops analytics views (`platform_distribution`,
`platform_usage_stats`, `firecrawl_usage_tracking`, `platform_performance_metrics`,
`recent_platform_activity`, `platform_health_dashboard`) that had full default
PostgREST grants and zero references in `src/` — anon currently has
unauthenticated read access to internal Firecrawl budget data via
`GET /rest/v1/platform_usage_stats` etc.

**Risk:** Low for the `search_path` pins (no behavior change, just pins name
resolution). Low-medium for the view lockdown — double-checked no app code
queries these 6 views before including them; if something outside `src/`
(a dashboard, a script) depends on anon/authenticated access to them, it would
break. The other 6 views in the schema (`coffee_summary`, `entity_review_stats`,
`latest_reviews_per_identity`, `user_recommended_coffees`, `variant_computed`,
`variant_latest_price`) are confirmed used by app code and are intentionally
left untouched.

**Status:** ✅ Applied (2026-07-09)

**Review checklist after push:**
- [x] `npx supabase migration list` shows `20260709120200` as applied
- [x] Advisor: `function_search_path_mutable` drops to 0
- [x] Advisor: `security_definer_view` drops from 12 → 6, and the 6 remaining are exactly the intentionally-public views (`coffee_summary`, `variant_computed`, `variant_latest_price`, `entity_review_stats`, `latest_reviews_per_identity`, `user_recommended_coffees`) — confirms the 6 internal ones were locked down correctly and the linter no longer flags them
- [x] Manual smoke test: homepage, `/coffees`, `/roasters`, coffee detail page — all 200, no errors
- [ ] Confirm nothing outside this repo (dashboards/scripts) depends on anon/authenticated access to the 6 locked-down views — no such surface found in this repo; flagging in case something external exists

**Outcome notes:** Applied cleanly, no follow-up needed. The remaining
`security_definer_view` findings on the 6 public-facing views are expected and
fine — the linter flags any externally-readable SECURITY DEFINER view
regardless of intent; these 6 are meant to be broadly readable and their
underlying queries were already reviewed as safe.

---

## Migration 4 — `20260709120300_lockdown_rpc_privileges_and_fix_idor.sql`

**What it does:** Revokes `anon`/`authenticated` EXECUTE on ~26 SECURITY DEFINER
functions that are either trigger-only, have zero callers anywhere in `src/`, or
are only ever invoked via `createServiceRoleClient()` (so the grant is a no-op
for the app either way). Revokes `anon` EXECUTE (keeps `authenticated`) on 5
functions that are gated behind `getCurrentUser()` in `src/app/actions/{gear,profile}.ts`.

Also fixes two real authorization bugs found while reading the function bodies:

1. **`upsert_user_profile`** had no check that `p_user_id` matched the caller's
   session — any authenticated user could overwrite *any other user's* profile
   via a direct `POST /rest/v1/rpc/upsert_user_profile` with someone else's UUID.
   Now raises an exception if `p_user_id != auth.uid()`.
2. **`get_user_profile_full`** trusted a caller-supplied `p_viewer_id` parameter
   for the private-profile visibility check instead of the real session — anyone
   who knew a private-profile user's UUID could read that profile by passing it
   as `p_viewer_id`. Now derives the viewer from `auth.uid()` internally.

**Risk:** Medium — this is the migration with actual security impact, not just
lint cleanup. The `REVOKE EXECUTE` statements are low risk (verified via
`.rpc(` grep across `src/` + which Supabase client each call site uses). The two
`CREATE OR REPLACE FUNCTION` bodies are copied verbatim from the current
definitions with only the auth check added/changed — no other logic touched.

**Status:** ✅ Applied (2026-07-09), plus 1 critical follow-up fix

**Review checklist after push:**
- [x] `npx supabase migration list` shows `20260709120300` as applied
- [x] Advisor + `has_function_privilege` ground truth confirm the revokes took effect (see follow-up below)
- [x] Manual smoke test: view a public user profile while logged out — confirmed via raw PostgREST call, full profile data returned correctly
- [x] Manual smoke test: attempt to view a *private* profile's data by passing its UUID as `p_viewer_id` while unauthenticated — confirmed now returns `null` (previously would have leaked the full profile)
- [x] Manual smoke test: attempt `upsert_user_profile` as anon with an arbitrary `p_user_id` — confirmed now fails with `"not authorized to modify this profile"`
- [x] Manual smoke test: legitimately-public RPC (`get_coffee_filter_meta`) still callable by anon via raw PostgREST — confirmed 200
- [x] Manual smoke test: locked-down RPC (`assign_user_role`) now rejected for anon at the Postgres privilege layer — confirmed `42501 permission denied`
- [x] Manual smoke test: `/coffees`, `/roasters`, coffee detail, roaster detail, homepage, and a real public profile page (`/profile/1isto2brew`) all still 200 with real data
- [ ] `npm run type-check` — not yet run, signatures unchanged so expected to be unaffected

**Outcome notes:** Applied, but the advisor re-check afterward still showed 37 of
the original 43 anon/authenticated-executable findings. Root cause (confirmed via
`pg_proc.proacl` and `has_function_privilege`): Postgres grants `EXECUTE` to
`PUBLIC` by default on `CREATE FUNCTION`, and `anon`/`authenticated` inherit it
through PUBLIC membership rather than holding an individual grant. The
migration's `REVOKE EXECUTE ... FROM anon, authenticated` only strips an
*explicit* grant — which most of these functions never had, so it silently
no-opped for ~24 of the ~30 targeted functions. It only worked for a handful
that happened to have explicit (non-PUBLIC) grants from earlier migrations.

Follow-up `20260709120310_fix_rpc_revoke_actually_targets_public.sql` revokes
`FROM PUBLIC` instead. Verified first that none of the affected functions are
referenced inside any RLS policy `USING`/`WITH CHECK` clause (which would need
anon/authenticated to keep EXECUTE to evaluate policies — `is_roaster_owner` is
the one function genuinely in that position, and correctly keeps its grant,
confirmed still `anon_exec=true, auth_exec=true`). After the follow-up,
ground-truth `has_function_privilege` checks on all ~22 affected functions
confirm: no-caller/trigger-only functions are now `false/false`, the 5
authenticated-only functions are `false/true` (anon blocked, authenticated's
separate explicit grant untouched), and the intentionally-public RPCs are
unaffected.

---

## Wrap-up

A third instance of the same PUBLIC-grant bug turned up on final re-check:
`anonymize_user_reviews` (only called via service-role client) was missed in
the `20260709120310` follow-up and stayed anon-executable. Fixed in
`20260709120320_revoke_anonymize_user_reviews_public.sql` — one-line
`REVOKE ... FROM PUBLIC`, confirmed via `has_function_privilege` afterward.

**Final state, confirmed via ground truth (not just the advisor):**
- Performance advisor: **no issues found**.
- Security advisor's remaining `anon_security_definer_function_executable` /
  `authenticated_security_definer_function_executable` findings are now only
  the intentionally-public/intentionally-authenticated set: 9 public read-only
  RPCs, `is_roaster_owner` (genuinely needed by RLS policies), `upsert_user_profile`
  and `get_user_profile_full` (kept accessible but now internally enforce
  `auth.uid()`), and the 5 authenticated-only actions.
- Full end-to-end smoke test (homepage, `/coffees`, `/roasters`, coffee detail,
  roaster detail, a real public user profile) all 200 with real data, zero
  errors, both before and after every migration.
- `npm run type-check` passes clean.
- Both IDOR fixes verified live via raw PostgREST calls against production:
  spoofing `p_viewer_id` to read a private profile now returns `null`
  (previously would have leaked full profile data); calling `upsert_user_profile`
  with a mismatched `p_user_id` now raises `"not authorized to modify this profile"`.

**Lesson for future privilege-lockdown migrations:** `REVOKE EXECUTE ... FROM
<role>` only removes an *explicit* grant to that role — it does nothing if the
role's access comes from the default `PUBLIC` grant Postgres creates
automatically on `CREATE FUNCTION`. Always verify with `has_function_privilege()`
or check `pg_proc.proacl` for a bare `=X/<owner>` entry, not just the advisor
output, which can lag or mask this.

## Deferred (not part of this pass)

- **91 unused indexes** — revisit after a longer `pg_stat_user_indexes.idx_scan` monitoring window.
- **`extension_in_public` (pg_trgm, citext)** — moving would break unqualified `%`/`similarity()` calls in `search_directory` (added in `20260629120000_add_postgres_search.sql`). Not worth the risk for an INFO-level finding.
- **`auth_leaked_password_protection`** — Supabase Auth dashboard toggle, not a migration. Flip manually in Auth settings.
- **`rls_enabled_no_policy`** on `coffee_views`, `ig_carousel_posts`, `ig_carousel_snapshots`, `raw_products` — RLS-on-no-policy currently denies all non-service-role access, which is the safe default. Left alone pending confirmation these tables need broader access.
