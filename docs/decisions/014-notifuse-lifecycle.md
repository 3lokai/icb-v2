# ADR-014: Notifuse for Lifecycle Email; Funnel Logic Lives in Notifuse

**Date:** 2026-09-07  
**Status:** Accepted  
**Participants:** Project Lead

## Context
Lifecycle email ran on Loops, then Sequenzy. Neither could filter automations on contact
fields, so the edge function computed a "funnel phase" and stored it in `user_profiles`.
Details: [`notifuse-lifecycle-sync.md`](../completed/notifuse-lifecycle-sync.md).

## Decision
- Lifecycle email runs on the self-hosted **Notifuse** at `notifuse.indiancoffeebeans.com`.
- **Supabase is the source of truth.** DB triggers → `pg_net` → edge function
  `sync-to-lifecycle` upsert contact facts and send events.
- **No funnel phase in the app or DB.** Segments and automations are built in the Notifuse UI,
  filtered on **contact custom fields**, not raw event properties (not documented as
  filterable).
- Every sync is fire-and-forget. A Notifuse outage must never block a user action.

## Consequences
- New lifecycle stages (e.g. `user_activated` = `rated_coffee` with `Ratings Count >= 3`) are
  Notifuse config, not code.
