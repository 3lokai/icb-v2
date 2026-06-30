# Notifuse Lifecycle Sync

How ICB syncs user-lifecycle data to the self-hosted **Notifuse** instance at
`https://notifuse.indiancoffeebeans.com`, so Notifuse can drive marketing /
lifecycle emails. Supabase is the source of truth; Notifuse is a downstream
consumer.

> History: this pipeline was previously wired to Loops, then Sequenzy. Both
> computed a "funnel phase" in the edge function and stored it in `user_profiles`.
> That phase machine is **gone** — Notifuse can filter automations directly on
> contact custom fields (Loops/Sequenzy couldn't), so the funnel now lives in the
> Notifuse UI as segments + automations.

## Data flow

```
User action (signup / rating / gear / station photo / profile edit)
  └─> Postgres AFTER trigger (lifecycle_sync_*)
        └─> notify_lifecycle_sync(user_id, event_name)   [SECURITY DEFINER]
              └─> pg_net.http_post  (URL + secret from Vault)
                    └─> Edge Function: sync-to-lifecycle
                          ├─> get_user_lifecycle_state(user_id)  → facts
                          ├─> POST /api/contacts.upsert          → contact attributes
                          └─> POST /api/customEvents.import      → event (drives automations)
```

Plus one client-driven path:

```
Authenticated /dashboard load
  └─> <LifecycleSessionTracker> (server component)
        └─> trackSessionStartedIfNeeded()  [throttle: max 1/UTC-day]
              └─> invoke sync-to-lifecycle  → session_started
```

Everything is **fire-and-forget**: pg_net is async, and the app paths use
`void`/`.catch()`. A Notifuse outage never blocks a user action.

## Events

| event_name           | Fires when                                                        | Trigger source |
|----------------------|-------------------------------------------------------------------|----------------|
| `signed_up`          | A `user_profiles` row is INSERTed                                  | DB trigger `lifecycle_sync_user_profiles` |
| `profile_updated`    | A tracked `user_profiles` column changes (bio, username, avatar, full_name, city, state, country, gender, experience_level, preferred_brewing_methods, onboarding_completed, is_public_profile, show_location) | DB trigger `lifecycle_sync_user_profiles` |
| `rated_coffee`       | A `reviews` row is INSERTed with `user_id NOT NULL`, `entity_type='coffee'`, `rating NOT NULL`, `status='active'` | DB trigger `lifecycle_sync_reviews_insert` |
| `gear_added`         | A `user_gear` row is INSERTed                                      | DB trigger `lifecycle_sync_user_gear` |
| `station_photo_added`| A `user_station_photos` row is INSERTed                            | DB trigger `lifecycle_sync_user_station_photos` |
| `session_started`    | Authenticated user loads `/dashboard` (throttled to 1/UTC-day)    | App: `LifecycleSessionTracker` → `trackSessionStartedIfNeeded` |

There is also a one-off post-login emit: `auth/callback/route.ts` calls
`trackLifecycleEvent(user.id, "rated_coffee")` after merging an anonymous user's
reviews into their new account.

> `user_activated` is **not** emitted anymore. Rebuild it as a Notifuse automation:
> trigger on `rated_coffee` where `Ratings Count >= 3`.

Every event carries the same facts in its `properties` (for the timeline), but
**automations must filter on the contact custom fields below** — raw event
properties are not documented as filterable in Notifuse.

## Notifuse contact mapping

`contacts.upsert` writes these on every sync. Label the slots in
**Notifuse → Workspace settings → Custom fields** exactly as below:

| Notifuse field    | Label             | Value                        |
|-------------------|-------------------|------------------------------|
| `email`           | —                 | user email (lowercased)      |
| `external_id`     | —                 | Supabase `user_profiles.id`  |
| `full_name`       | —                 | profile full name            |
| `custom_number_1` | Ratings Count     | active coffee ratings (int)  |
| `custom_number_2` | Has Gear          | 0 or 1                       |
| `custom_number_3` | Has Station Photo | 0 or 1                       |
| `custom_number_4` | Has Bio           | 0 or 1                       |
| `custom_number_5` | Has Avatar        | 0 or 1                       |

Booleans are stored as `0`/`1` **numbers** (not strings) so segment conditions are
numeric, e.g. the "active" segment:
`Ratings Count >= 3 AND Has Bio = 1 AND (Has Gear = 1 OR Has Station Photo = 1)`.

## Secrets / config

**App (`.env.local` + Vercel):**
- `INTERNAL_LIFECYCLE_SYNC_SECRET` — shared secret; sent as `x-icb-lifecycle-sync`
  header when the app invokes the edge function.

**Edge Function (`supabase secrets set`):**
- `NOTIFUSE_API_URL` = `https://notifuse.indiancoffeebeans.com`
- `NOTIFUSE_API_KEY` — Notifuse API key (Bearer)
- `NOTIFUSE_WORKSPACE_ID` = `indiancoffeebeans`
- `INTERNAL_LIFECYCLE_SYNC_SECRET` — must equal the app value
- (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` are injected automatically)

**Supabase Vault** (read by `notify_lifecycle_sync` via `vault.decrypted_secrets`):
- `lifecycle_edge_function_url` = `https://<project-ref>.supabase.co/functions/v1/sync-to-lifecycle`
- `lifecycle_internal_sync_secret` — must equal `INTERNAL_LIFECYCLE_SYNC_SECRET`

> ⚠️ Vault values must have **no leading/trailing whitespace** — pg_net rejects a
> URL with a stray space ("bad/illegal format or missing URL"). The function now
> `btrim`s them defensively, but store them clean. To set/fix:
> ```sql
> select vault.update_secret(
>   (select id from vault.secrets where name = 'lifecycle_edge_function_url'),
>   btrim('https://<project-ref>.supabase.co/functions/v1/sync-to-lifecycle')
> );
> ```

## Source files

| Path | Role |
|------|------|
| `supabase/migrations/20260701130000_lifecycle_notifuse.sql` | Columns, `get_user_lifecycle_state`, `notify_lifecycle_sync`, triggers |
| `supabase/functions/sync-to-lifecycle/index.ts` | Loads facts, upserts contact + imports event to Notifuse |
| `src/lib/lifecycle.ts` | `trackLifecycleEvent`, `trackSessionStartedIfNeeded` (server-only) |
| `src/components/lifecycle/LifecycleSessionTracker.tsx` | Renders in dashboard layout to emit `session_started` |
| `src/app/(auth)/auth/callback/route.ts` | Post-login `rated_coffee` after anon-review merge |

`get_user_lifecycle_state(uuid)` returns: `user_id, ratings_count, has_gear,
has_station_photo, has_bio, has_avatar, full_name, email`. `ratings_count` =
active coffee reviews with a non-null rating.

> Cleanup TODO: a stale `supabase/functions/sync-to-loops/` dir still exists from
> the pre-Sequenzy era — safe to delete.

## Notifuse API reference (used here)

Base `https://notifuse.indiancoffeebeans.com`, auth `Authorization: Bearer <key>`,
all bodies include `workspace_id`.

- `POST /api/contacts.upsert` — `{ workspace_id, contact: { email, external_id, full_name, custom_number_1..5 } }`
- `POST /api/customEvents.import` — `{ workspace_id, events: [ { event_name, external_id, email, occurred_at, source, properties } ] }` (event_name pattern `^[a-z0-9_./-]+$`, max 50/req, auto-creates contacts)
- `POST /api/contacts.import` — bulk upsert, `{ workspace_id, contacts: [...] }` (no events fired — used by the backfill below)

## Backfill (one-time)

To seed existing users as contacts **without** firing events (so nobody re-enters
welcome automations), use bulk `contacts.import` driven by `get_user_lifecycle_state`.
A reusable script lives in the session scratchpad (`backfill-notifuse.mjs`); it must
run from the repo root so it can resolve `@supabase/supabase-js`:

```bash
NOTIFUSE_WORKSPACE_ID=indiancoffeebeans node --env-file=.env.local ./backfill-notifuse.mjs --dry-run
NOTIFUSE_WORKSPACE_ID=indiancoffeebeans node --env-file=.env.local ./backfill-notifuse.mjs
```

It reads `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `NOTIFUSE_API_KEY` from
`.env.local`; `contacts.import` upserts, so it is idempotent.

## Verifying end-to-end

Fire an event manually through the whole chain (use `session_started` — it is
benign and shouldn't trigger automations):

```sql
select public.notify_lifecycle_sync(
  (select id from public.user_profiles where email = '<email>'),
  'session_started', 'test'
);
```

Then check the response pg_net got back (Supabase SQL Editor):

```sql
select id, status_code, left(content, 250) as body, error_msg, created
from net._http_response
order by created desc limit 8;
```

- `200` + `{"success":true}` → full chain OK.
- `502` + `detail` → reached the edge function; Notifuse rejected the upsert/import.
- `401` → `x-icb-lifecycle-sync` ≠ edge `INTERNAL_LIFECYCLE_SYNC_SECRET`.
- `error_msg` set / `status_code` null → request never completed (bad URL/timeout;
  check the Vault URL for whitespace).

Or confirm on the Notifuse side: Contacts → the user → timeline should list the
event(s).
