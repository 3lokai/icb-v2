---
target: the auth pages
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-06-13T19-38-34Z
slug: src-app-auth-auth-page-tsx
---
# Critique (re-run): Auth pages

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Spinner on verifying state, `aria-busy` on submits, clear loading text + success confirmations |
| 2 | Match System / Real World | 3 | Plain, now brand-voiced — still no jargon; clear either way |
| 3 | User Control and Freedom | 3 | Back links + mode toggle; no explicit cancel/undo (nav is the exit) |
| 4 | Consistency and Standards | 4 | Heading regression fixed (all Fraunces); one shared shell; grain used per system. Minor: error banners are hand-rolled divs, not the `FieldError` primitive |
| 5 | Error Prevention | 3 | 8-char min + regex + confirm-match + show/hide password; validation still submit-only, no inline/strength cue |
| 6 | Recognition Rather Than Recall | 3 | Labels, OAuth, mode toggle all visible |
| 7 | Flexibility and Efficiency | 3 | OAuth shortcuts, autofill, password reveal |
| 8 | Aesthetic and Minimalist Design | 4 | Now distinctively ICB — film grain, Accent smear, editorial caption; focused, on-brand |
| 9 | Error Recovery | 4 | Errors announced (`role=alert`), plain language, input preserved, "Sign in instead" recovery link |
| 10 | Help and Documentation | 3 | Terms/Privacy, password helper text, forgot path |
| **Total** | | **34/40** | **Good (top of band) — brand expression landed, regression fixed; refinements remain** |

## Anti-Patterns Verdict

**Would someone say "AI made this"?** No longer. The previous run's headline finding — a verbatim shadcn `login-0x` block with the brand erased — is resolved. The auth flow now carries ICB's committed identity: the `<Accent>` brush-smear on one phrase per screen, the brand's native film grain across two scale-differentiated bands, an editorial photo plate with a captioned magazine line, and a quiet field-guide footer. It reads as a designed spread, not a template.

**Deterministic scan:** `detect.mjs --json` over all 10 files → `[]`, exit 0. Clean (also clean before; the original tells were structural/identity-level, which the CSS scanner doesn't catch — those are what the re-skin fixed).

**Visual overlays:** Not available — no browser automation in this environment. Review is source + detector. The one item that genuinely needs a browser is the caption label contrast (see P3 below).

## Overall Impression

Substantial jump from the 29 baseline. The brand now shows up at the threshold instead of vanishing into chrome, and the self-contradicting `font-bold` heading is gone. What's left is refinement, not repair — and one honest caveat: you asked to *rethink the layout*, and what shipped is a strong editorial **re-skin within the proven two-pane structure**, not a structural reinvention. If you wanted the composition itself reimagined (a single-canvas layout, asymmetric split, image-led full-bleed with inset form), that's still on the table as a follow-up.

## What's Working

1. **Brand signature, rationed correctly.** One `<Accent>` smear per screen on the meaningful word (Welcome **back**, Create your **account**, Check your **email**). It's the single emphasis language, exactly as the system intends.
2. **The texture is now system-honest.** Fine `grain` on the warm-paper form column, coarse `grain-coarse` over the photo — two bands a scale apart, via `<Decor>`, replacing four copies of a retired hand-rolled 32px dot grid.
3. **Accessibility moved forward.** Errors announce via `role="alert"`/`aria-live`; the password reveal is keyboard-reachable with `aria-pressed`; the verifying state has a spinner; alt text honestly describes each photograph in brand voice.

## Priority Issues

- **[P2] Validation is still submit-only and lives in a top banner.** Errors now *announce*, but they're hand-rolled `bg-destructive/10` divs rather than the project's `FieldError` primitive, and they sit above the form rather than beside the offending field. There's no inline/as-you-type feedback.
  - **Fix:** route field-specific errors (invalid email, short password, mismatch) through `FieldError` adjacent to the field; keep the banner only for form-level/auth errors.
  - **Suggested command:** `/impeccable harden`

- **[P2] The "rethink layout" ask is only partially met.** Structurally this is still the conventional form-left / image-right split — well-branded, but not reimagined. If a structural rethink is wanted, it needs its own shaping pass.
  - **Fix:** explore 2-3 compositions (image-led full-bleed with an inset paper card; asymmetric 60/40; single-canvas centered with the smear as hero) before committing.
  - **Suggested command:** `/impeccable shape`

## Persona Red Flags

**Jordan (First-Timer):** Now welcomed — brand-voiced subcopy, clear single action, visible mode toggle, a reassuring caption on the plate. No notable red flags remain.

**Sam (Accessibility):** Errors announced; reveal toggle keyboard-reachable; meaningful alt text. Remaining: the caption label uses `text-white/70` over the photo scrim — likely AA for a small label but unverified without a browser; and the verifying spinner uses `animate-spin` with no `prefers-reduced-motion` alternative (low-risk for a status indicator, but the project's stance is strict).

**Casey (Mobile):** Password reveal helps one-handed typing; image panel correctly hidden below `lg`. Submit button still sits mid-column rather than thumb-anchored — minor for a short form.

## Minor Observations

- No password-strength cue despite the 8-char gate — a missed reassurance moment on sign-up/reset.
- Sign-in error stays deliberately vague ("Invalid email or password") for security — correct, noted so it isn't "fixed."
- Facebook login is a dated social-auth choice (product call).
- OnboardingWizard internals weren't reviewed — only its shell changed.

## Questions to Consider

- Is the conventional two-pane the final composition, or do you want a genuine structural rethink (image-led, asymmetric, single-canvas)?
- Should field-level errors move beside their fields, or is the announced top banner enough for an auth form this short?
- Worth a quick browser pass in both themes to confirm the caption label contrast and the grain-over-dark-photo read?
