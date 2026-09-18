-- First-touch acquisition attribution captured from the `icb_attribution` cookie
-- at signup. Single jsonb column: original_source / original_campaign /
-- original_content / touchpoints / first_visit_time / last_visit_time /
-- session_quality_score. Written once (guarded on `attribution is null`) so the
-- first touch is never overwritten by a later one.
alter table user_profiles add column if not exists attribution jsonb;

comment on column user_profiles.attribution is
  'First-touch UTM attribution captured at signup. Write-once; see src/lib/analytics/persist-attribution.ts';
