# Auth & Anonymous Identity

The single reference for how authentication and the anonymous rating/claim flow
work in ICB v2. If you touch auth, read this first.

## TL;DR

- **One live client auth system:** the React Context `AuthProvider`. Consume it
  with `useAuth()` from `@/components/providers/auth-provider`.
- Server code never uses that context — it resolves the user from cookies via
  `getCurrentUser()` (`@/data/auth`) or `serverAuth` (`auth-helpers-server.ts`).
- Profile data crossing to the client goes through DTOs in
  `src/data/user-dto.ts` (`PublicProfileDTO` / `PrivateProfileDTO`) — the authz
  boundary that keeps sensitive fields server-side.
- Anonymous visitors get an `icb_anon_id` (localStorage + cookie). Their reviews
  and coffee-views are stored against that id and **merged into their account on
  sign-in** via two service-role RPCs.

There used to be a second, Zustand-based auth system (`auth-store.ts`,
`auth-initializer.tsx`, `hooks/use-auth.ts`). It was an abandoned migration —
never mounted, never initialized — and has been **deleted**. Don't reintroduce a
parallel store; extend the context provider.

---

## Client auth — `AuthProvider`

`src/components/providers/auth-provider.tsx` — `"use client"` React Context.
Mounted **once** in the root layout (`src/app/layout.tsx`, inside
`QueryProvider`, wrapping `SearchProvider`/`ModalProvider`). It is not
re-mounted per route group, so the single instance covers `(auth)`, `(main)`,
everything.

State: `{ user: User | null, isLoading: boolean }`. Exposes `signIn`, `signUp`,
`signInWithOAuth`, `signOut`, `refreshUser`. `useAuth()` throws if used outside
the provider.

**Mount effect — the anon fast-path (perf-critical):**

```ts
// getSession() reads the local store (no network). Only validate via
// getUser() when a session actually exists, so anonymous visitors don't pay
// a /auth/v1/user round-trip on every page load.
auth.getSession().then(({ session }) => {
  if (session) refreshUser();   // -> auth.getUser() (network validation)
  else setIsLoading(false);
});
```

Do **not** replace this with an unconditional `getUser()` — that regresses the
first-paint round-trip for every anonymous visitor. Also do not sniff
`document.cookie` for the session; `getSession()` reads whatever storage
`@supabase/ssr` uses, so it survives storage-config changes.

An `onAuthStateChange` subscription keeps `user` in sync and, on `SIGNED_IN`,
fires the anon merge (see below) plus `posthog.identify`. `signOut` calls
`posthog.reset()`.

**Consumers** (`useAuth` from `@/components/providers/auth-provider`):
`header.tsx`, `auth-form.tsx`, `CommunitySubmissionModal.tsx`, and the hooks
`use-user.ts`, `use-user-profile.ts`, `use-wishlist.ts`.

### The `auth` wrapper

`src/lib/supabase/auth-helpers.ts` is the thin browser-side surface the provider
delegates to (`getUser`, `getSession`, `onAuthStateChange`, `signIn`, `signUp`,
`signOut`, `signInWithOAuth`, `resetPasswordForEmail`, `updateUser`). Each method
creates a fresh browser client (`createClient` from `@/lib/supabase/client`,
which wraps `createBrowserClient` from `@supabase/ssr` with the publishable key).

---

## Server auth

Server components and server actions never read the client context. They use:

- **`getCurrentUser()`** — `@/data/auth`. React-`cache()`d per request,
  `server-only`, calls `supabase.auth.getUser()` and returns a **minimal**
  `{ id, email }` (no tokens/metadata). This is the standard gate:
  `const user = await getCurrentUser(); if (!user) redirect("/auth");`
- **`serverAuth`** — `src/lib/supabase/auth-helpers-server.ts`
  (`getUser`/`getSession`, `server-only`).
- **Supabase client variants** — `src/lib/supabase/server.ts`:

  | Function | Use |
  |---|---|
  | `createClient()` | Server components / actions (respects RLS + cookies) |
  | `createAnonServerClient()` | `unstable_cache` contexts (no `cookies()`) |
  | `createServiceRoleClient()` | Privileged, bypasses RLS — server-only |

There is **no `middleware.ts`** in this repo — no session-refresh middleware.
Auth is resolved on demand per request.

---

## Profile DTOs & authorization — `src/data/user-dto.ts`

`server-only` module that shapes `user_profiles` into **safe DTOs** and enforces
access control at the application layer (defense in depth on top of RLS). This
is the boundary that decides what leaves the server for a Client Component.

- **`PublicProfileDTO`** — `id`, `username`, `full_name`, `avatar_url`, `bio`,
  `experience_level`. The only shape that may be sent when viewing **someone
  else's** profile. No email, no location, no preferences.
- **`PrivateProfileDTO`** = `PublicProfileDTO` + owner-only fields (`email`,
  `city`/`state`/`country`, `gender`, `preferred_brewing_methods`, privacy
  toggles, `email_verified`, `onboarding_completed`, `newsletter_subscribed`).

Functions (all gated by `getCurrentUser()`):

- **`getProfileDTO(userId)`** — returns `PublicProfileDTO` if the profile is
  public **or** the viewer is the owner; otherwise `null`. Validates input,
  defaults `is_public_profile` to public. Use for other users' profile pages.
- **`getMyProfileDTO()`** — returns the owner's full `PrivateProfileDTO` (or
  `null` if no profile yet → send to onboarding).
- **`profileExists(userId)`**, **`getCoffeePreferences()`**,
  **`getNotificationPreferences()`**, **`getMyReviews()`** (enriches
  `latest_reviews_per_identity` with coffee/roaster entity details),
  **`getMyReviewStats()`**.

**Rule:** never pass a raw `user_profiles` row to a client component — route it
through a DTO here so sensitive fields can't leak. Server-side authz lives here
and in the `SECURITY DEFINER` RPCs (`upsert_user_profile` /
`get_user_profile_full` derive the caller from `auth.uid()` — see the lockdown
migration below), *in addition to* RLS.

---

## Anonymous identity — `icb_anon_id`

`src/lib/reviews/anon-id.ts`. A stable per-browser UUID so anonymous visitors can
rate coffees before signing up.

- **Dual store:** localStorage `icb_anon_id` is the **source of truth**; a
  cookie `icb_anon_id` mirrors it (1-year `max-age`, `path=/`, `SameSite=Lax`,
  `Secure` on HTTPS). The cookie is **deliberately not httpOnly** — it's written
  from JS *and* read server-side in server actions (`cookieStore.get(
  "icb_anon_id")`). `getAnonId()` self-heals mismatches (localStorage wins);
  either store alone works (private-browsing tolerant, wrapped in try/catch).
- **`ensureAnonId()`** creates the id if missing (only creation path);
  **`getAnonId()`** reads without creating. Callers: `ensureAnonId()` in review
  submission (`use-reviews.ts`, `QuickRating`, `ReviewCapture`,
  `CoffeeDetailPage`, profile components); `getAnonId()` read-only in
  `use-exit-intent-rating.ts` and in `AuthProvider` (captured at login for the
  merge).
- A parallel `icb_review_count` counter (same dual-store pattern) tracks the
  anonymous review count for the 3-review cap.

Server readers of the cookie: `reviews.ts`, `coffee-views.ts`,
`fetch-hero-segment.ts`, `fetch-recently-viewed-coffees.ts`, the anon profile
pages, and `auth/callback/route.ts`.

---

## Anonymous rating → claim/merge flow

### Write (anonymous)

1. Client calls `ensureAnonId()`, submits via `createReview(input, anonId)`
   (`src/app/actions/reviews.ts`).
2. `resolveIdentity()` picks identity: logged-in → `user_id`; else the
   **cookie** `icb_anon_id` is source of truth, falling back to the client-passed
   `anonId`. It validates UUID format and **fails hard** if cookie and client
   value mismatch (anti-spoofing).
3. Row inserted with `anon_id` set, `user_id: null`, `status: 'active'`, via the
   **service-role** client (writes bypass RLS — the `reviews`/`coffee_views`
   tables have RLS enabled with only public `SELECT` policies, no INSERT/UPDATE).
4. Anonymous users are capped at **3 distinct entities**
   (`checkAnonymousReviewLimit`, counted by distinct `(entity_type, entity_id)`).
   Note: the cap **fails open** (returns 0) on a query error.

### Claim (on sign-in)

Merge runs from **two independent, idempotent paths**:

- **Client path** — `AuthProvider` `onAuthStateChange` `SIGNED_IN` reads
  `getAnonId()` and fires `runPostLoginAnonMerges(anonId)`
  (`src/app/actions/post-login-anon-merges.ts`), fire-and-forget.
- **Server OAuth path** — `src/app/(auth)/auth/callback/route.ts` after code
  exchange reads the cookie and calls the two RPCs directly.

Both run `merge_coffee_views_for_anon` then `merge_reviews_for_anon` through
`createServiceRoleClient()`, and both are gated by the server-verified user id
(`getCurrentUser()` / the freshly-exchanged session), so a client **cannot merge
into another account**.

### The RPCs (Postgres, `SECURITY DEFINER`)

- **`merge_reviews_for_anon(p_user_id, p_anon_id)`**
  (`supabase/migrations/20260417120000_merge_reviews_for_anon.sql`) — reassigns
  `UPDATE reviews SET user_id=p_user_id, anon_id=NULL WHERE anon_id=p_anon_id
  AND user_id IS NULL`, then recomputes coffee/roaster rating aggregates
  explicitly (the aggregate triggers only fire on status change). **No dedup** —
  reviews are append-only; the `latest_reviews_per_identity` view collapses to
  the latest per `identity_key` at read time.
- **`merge_coffee_views_for_anon(p_user_id, p_anon_id)`**
  (`supabase/migrations/20260416120000_create_coffee_views.sql`) — `coffee_views`
  has a unique `(user_id, coffee_id)` index, so it loops (`FOR UPDATE`): if the
  user already has a row for that coffee it **aggregates** (`view_count` summed,
  `LEAST`/`GREATEST` on timestamps) and deletes the anon row; otherwise it
  **relinks**.

### Security posture

Both RPCs: `SECURITY DEFINER`, `SET search_path = public`, `REVOKE ALL FROM
PUBLIC` + `GRANT EXECUTE TO service_role` only. Privileges across all RPCs were
audited/locked in
`supabase/migrations/20260709120300_lockdown_rpc_privileges_and_fix_idor.sql`
(which also fixed two IDOR bugs in `upsert_user_profile` /
`get_user_profile_full` by deriving the caller from `auth.uid()`).

**Gotcha:** `REVOKE EXECUTE ... FROM anon, authenticated` is often a **no-op** —
default execute is granted to `PUBLIC`. Revoke `FROM PUBLIC` and verify with
`has_function_privilege`.

---

## Known quirks (documented, not bugs to fix blindly)

- **Callback route duplicates the merge logic** instead of reusing
  `runPostLoginAnonMerges`.
- **Client-path merge race:** on email/password sign-in the *only* merge trigger
  is the client `SIGNED_IN` handler → server action → re-checks
  `getCurrentUser()`. If the auth cookie hasn't propagated to that request yet,
  the merge silently no-ops (error only logged) and is retried only on a future
  `SIGNED_IN`. OAuth avoids this via the server-side exchanged session.
- **Merge errors are fire-and-forget** — logged, never surfaced or retried.
- **Reviews merge leaves duplicates:** if a user reviewed a coffee both
  signed-in and anonymously, after merge both rows exist as `user:<id>`. Display
  is correct via `latest_reviews_per_identity`, but the raw table has dupes
  (unlike `coffee_views`, which aggregates).
- **`resetReviewCount()`** exists and is documented "useful when user logs in",
  but no merge path calls it — the `icb_review_count` counter isn't cleared on
  sign-in.
