# Refactor: auth/callback route

**Goal:** edit safety. **Type:** refactor, behavior-preserving. **Risk:** HIGH —
auth-critical. A wrong edit locks users out or mis-merges anonymous identities.
Do this one last and most carefully.

## READ FIRST

`docs/auth.md` — the single reference for auth + anonymous identity. Do not touch
this route until you've read it end to end. In particular the anonymous-identity
merge (`icb_anon_id` → account on sign-in via two service-role RPCs) is partly
driven from the callback path.

## Why

`src/app/(auth)/auth/callback/route.ts` — **341 LOC**, `GET` cognitive **112**.
One handler that branches across: OAuth providers, the PKCE/code exchange, error
params (`callback_failed`, `no_code`, `oauth_failed`,
`account_creation_failed` — the same set `auth-form.tsx` renders), new-user vs.
returning-user routing (`/auth/onboarding` vs. `returnTo`), and the anon-identity
merge. Every branch is a security/correctness path.

## Suggested extraction (behavior-preserving)

The `GET` is a sequence of guarded steps. Extract each into a named helper that
returns either a result or a redirect, so the top-level reads as a flow:

- `exchangeCodeForSession(code)` — the Supabase code exchange + its error mapping.
- `resolveRedirect(request, user, isNewUser)` — the returnTo / onboarding
  decision (mirror `auth-form.tsx`'s `returnTo` logic; keep them consistent).
- `mergeAnonymousIdentity(user, anonId)` — the anon→account merge (the RPCs from
  `auth.md`); it already exists somewhere — reuse, don't duplicate.
- `errorRedirect(code)` — centralize the `?error=<code>` redirects so the codes
  stay in sync with what `auth-form.tsx` decodes.

Keep the exact same redirect URLs, error codes, and cookie behavior. The whole
point is that the branch set is unchanged — just readable.

## Do not

- Change any redirect URL, error-param string, or cookie/session handling.
- Alter the order of session-exchange → identity-merge → redirect. Ordering is
  security-relevant (a session must exist before the merge runs).
- Introduce new dependencies or "clean up" the Supabase server-client usage —
  it uses a specific client variant on purpose (see CLAUDE.md client table).

## Verify — every path, manually

`type-check` + `lint` are necessary but nowhere near sufficient here. In
`npm run dev`, walk **all** of:

1. Google OAuth sign-in (new user → should land on `/auth/onboarding`).
2. Google OAuth sign-in (returning user → should land on `returnTo` / home).
3. A `from=` deep link → sign in → confirm you return to that path.
4. Anonymous user with existing ratings → sign in → confirm ratings merged
   (this is the highest-value regression to catch).
5. Each error path: force `no_code` / `oauth_failed` and confirm the right
   message renders on `/auth`.

If you cannot test OAuth locally, **do not ship this refactor** — the reward
(readability) does not justify shipping an untested auth change.
