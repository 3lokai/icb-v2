---
target: the auth pages
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-06-13T19-18-20Z
slug: src-app-auth-auth-page-tsx
---
# Critique: Auth pages (sign-in/up, forgot-password, reset-password, onboarding shell)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading text present but no spinner/aria-busy; "Verifying reset link" is static |
| 2 | Match System / Real World | 3 | Plain, clear language — but generic SaaS voice, no brand tone |
| 3 | User Control and Freedom | 3 | "Back to login" everywhere, mode toggle; no explicit cancel (nav is the exit) |
| 4 | Consistency and Standards | 2 | Heading font flips between `font-bold` (DM Sans) and `font-serif` within the SAME component; hand-rolled error divs bypass the Field primitive; 32px dots vs system 22px |
| 5 | Error Prevention | 3 | 8-char min + regex + confirm-match; no show-password raises mistype risk |
| 6 | Recognition Rather Than Recall | 3 | Labels visible, OAuth + mode toggle visible |
| 7 | Flexibility and Efficiency | 3 | OAuth shortcuts; type=email autofill; no power features needed |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and uncluttered — but it's the wrong aesthetic for ICB (generic, not editorial) |
| 9 | Error Recovery | 3 | Plain-language errors, but not announced to SR and not field-adjacent |
| 10 | Help and Documentation | 3 | Terms/Privacy links, password helper text, forgot-password path |
| **Total** | | **29/40** | **Good — solid functional auth, weak brand expression + one consistency regression** |

## Anti-Patterns Verdict

**Would someone say "AI made this"?** On the deterministic CSS layer, no — the detector ran clean (0 findings across all 7 files). But on the *holistic* layer, yes for a different reason the scanner can't catch: **this is the shadcn `login-0x` block shipped near-verbatim** — two-column split, logo top-left, centered `max-w-xs` form, full-bleed image panel with `dark:brightness-[0.4] dark:grayscale`. It's a recognizable template, and ICB's entire identity (warm paper layering, the `<Accent>` brush-smear, Fraunces voice, editorial copy) is **absent on every auth screen**. The auth flow is the one place the brand vanishes into generic chrome.

**Deterministic scan:** `detect.mjs --json` over all 4 pages + 3 form components → `[]`, exit 0. No gradient text, no side-stripes, no eyebrow scaffolding, no banned patterns. Clean.

**Visual overlays:** Not available. No browser automation in this environment; the running dev server returns 404 for `/auth`, and script injection wasn't possible. Review is source-based + detector. No user-visible overlay was produced.

## Overall Impression

Functionally this is a competent, accessible-ish auth flow — it works, the copy is clear, OAuth + email + reset + onboarding are all wired. The problem is it doesn't feel like ICB at all. A magazine field guide with cream paper, terracotta smears, and Fraunces authority hands you a stock SaaS login. The single biggest opportunity: **make the auth pages the first taste of the brand**, not a detour out of it — and while doing so, fix the heading-font regression that has the same component rendering its title in DM Sans bold in one state and Fraunces in another.

## What's Working

1. **Clear, honest copy and flows.** "Forgot your password?", "Send reset link", "Invalid email or password" — plain language, no jargon, sensible mode-switching with `from` return-URL preservation. The reset flow correctly handles PKCE code exchange, expired links, and the recovery event with distinct states for each.
2. **Real guardrails.** Email regex, 8-char minimum, password-confirmation match on reset, "already registered → sign in instead" affordance, URL-error mapping (`callback_failed`, `oauth_failed`, etc.). Error prevention is thoughtful.
3. **Restraint is appropriate to the surface.** The layout is uncluttered and the image panel + form split is a sound, conventional auth pattern. The bones are fine; it's the brand skin that's missing.

## Priority Issues

- **[P1] Brand erasure — auth is a verbatim shadcn template.** None of ICB's committed identity appears: no `<Accent>` brush-smear on "Welcome back", no warm `surface-1/2` paper layering, no Fraunces character beyond a single heading, no editorial voice. For a brand whose register is "design IS part of the product," the highest-traffic gated surface reads as generic SaaS.
  - **Why it matters:** First-time visitors arriving to sign up form their trust impression here. A magazine brand that turns utilitarian at the threshold undercuts the "quiet authority" promise exactly when stakes are highest.
  - **Fix:** Inject the brand signature — the `<Accent>` smear on the welcome phrase, warm paper layering, a brand-voiced subhead — without breaking the proven two-column structure. Consider the image panel as an editorial moment (a real coffee photograph with a caption, not a dimmed backdrop).
  - **Suggested command:** `/impeccable bolder` (then `/impeccable clarify` for copy)

- **[P1] Heading font regression contradicts the design system AND itself.** `auth-forgot-password-form.tsx:101` and `auth-reset-password-form.tsx:220` render the primary heading as `text-title font-bold` — that's DM Sans bold, not Fraunces. The *same components'* other states (`isSuccess`, `isChecking`, `invalid-link`) correctly use `text-title font-serif tracking-tight`. So "Reset your password" is sans-bold while "Check your email" two states later is serif. This breaks both the **Hero-Is-Not-Bold Rule** and the serif-heading convention from DESIGN.md.
  - **Why it matters:** Visible, self-contradicting typography within one flow; reads as unfinished. Bold sans where the system mandates Fraunces 400/500 is the loudest off-brand note on the page.
  - **Fix:** Replace `font-bold` with `font-serif` (weight 500 via the title token) on both headings so every auth heading is consistent Fraunces.
  - **Suggested command:** `/impeccable typeset`

- **[P1] Auth errors aren't announced to assistive tech.** Every error is a hand-rolled `<div className="bg-destructive/10 ...">` with no `role="alert"` / `aria-live`. The project already has a `FieldError` primitive (`field.tsx:226`, `role="alert"`) that's bypassed everywhere. A screen-reader user who submits a wrong password gets visual-only feedback — silence.
  - **Why it matters:** WCAG 2.1 AA (the project's stated commitment) requires status messages be programmatically announced. This is a real failure for Sam.
  - **Fix:** Route error banners through `FieldError`, or add `role="alert" aria-live="polite"` to the error divs. Also fix the decorative panel alt text (`alt="Login screen"` describes nothing — either describe the photo in brand voice or mark it decorative).
  - **Suggested command:** `/impeccable harden`

- **[P2] Deprecated, duplicated noise texture instead of `<Decor>`.** All four pages inline an identical `radial-gradient` dot grid at **`32px`** — the exact drift DESIGN.md says was retired ("kills the old 24px-vs-32px drift"; the settled size is 22px via `<Decor dots>`). It's hand-rolled four times, and the entire right-panel markup (image + `bg-black/20` + noise) is copy-pasted verbatim across page.tsx, forgot-password, reset-password, and onboarding.
  - **Why it matters:** A regression to a retired value, multiplied by four, plus maintenance drift risk. The design system exists precisely to prevent this.
  - **Fix:** Extract a single `<AuthImagePanel image={...} alt={...} />` component using `<Decor dots>`; delete the inlined gradients.
  - **Suggested command:** `/impeccable extract` (then `/impeccable polish`)

- **[P2] No show/hide password toggle.** Both sign-in and reset use bare `type="password"` with an 8-char minimum and no reveal affordance.
  - **Why it matters:** Casey (one-handed mobile) and anyone typing a long password will mistype and hit a vague "Invalid email or password." A standard reveal toggle is the cheapest error-prevention win here.
  - **Fix:** Add an eye/eye-off toggle inside the password input (and on the confirm field).
  - **Suggested command:** `/impeccable harden`

## Persona Red Flags

**Jordan (First-Timer):** The flow is legible — clear labels, visible mode toggle, helper text. But the experience is emotionally flat: no warmth or reassurance at the moment they decide to commit to an account. The "By continuing, you agree to..." legal line and a vague "Invalid email or password" are the only feedback they get; nothing welcomes them into the field guide they came for.

**Sam (Accessibility):** Real gaps. Error banners are not announced (no `role="alert"`/`aria-live`) — a wrong-password submit is silent. Decorative image alt text is meaningless ("Login screen"). Loading buttons change text but have no `aria-busy`. Focus rings rely on the shadcn defaults (fine). Keyboard flow itself is okay since it's native form markup.

**Casey (Distracted Mobile):** Image panel correctly hidden on mobile. But no show-password toggle means blind typing of an 8-char password on a phone keyboard; the submit button sits mid-column rather than thumb-anchored; and a mistype lands on a non-specific error. Workable, not smooth.

## Minor Observations

- "Verifying reset link" state (`auth-reset-password-form.tsx:156`) is static text with no spinner — a brief async wait with no motion reads as "stuck."
- No password-strength indication on sign-up/reset despite the 8-char gate — a missed reassurance moment.
- Facebook login is a dated social-auth choice; worth confirming it's still wanted (product call, not design).
- Sign-in error is intentionally vague ("Invalid email or password") for security — acceptable, noted so it isn't "fixed" by mistake.
- Forgot-password success uses `bg-primary/10 text-primary` as a confirmation box — fine given no green in palette, reads as info not error.

## Questions to Consider

- What if the auth screen were a visitor's *first* editorial moment — the `<Accent>` smear under "Welcome back," a captioned coffee photograph, copy in the field-guide voice — instead of a gate they pass through?
- Should the image panel say something? Right now it's a dimmed backdrop. A magazine would caption it.
- If the brand promise is "you're in expert hands," what's the single sentence the sign-up screen should say to earn that — and does it say anything close right now?
