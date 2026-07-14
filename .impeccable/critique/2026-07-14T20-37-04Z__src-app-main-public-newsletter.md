---
target: src/app/(main)/(public)/newsletter
total_score: 30
p0_count: 0
p1_count: 3
timestamp: 2026-07-14T20-37-04Z
slug: src-app-main-public-newsletter
---
# Critique — /newsletter and its components

Target: src/app/(main)/(public)/newsletter/{page,[id]/page}.tsx + src/components/newsletter/* (NewsletterSection, BroadcastCard, BroadcastContent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form has loading + success/error toasts. |
| 2 | Match System / Real World | 4 | Plain, warm, on-voice copy. |
| 3 | User Control & Freedom | 3 | Back link on detail; low-stakes form. |
| 4 | Consistency & Standards | 2 | Accent-rule date motif hand-rolled 3 ways; eyebrow bypasses Section primitive; Accent smear runs twice on one page. |
| 5 | Error Prevention | 3 | type=email + required + honeypot. |
| 6 | Recognition vs Recall | 4 | Everything visible. |
| 7 | Flexibility & Efficiency | 3 | No archive search/filter, fine for small archive. |
| 8 | Aesthetic & Minimalist | 2 | Triple eyebrow + double smear + three redundant decoration layers = noise. |
| 9 | Error Recovery | 3 | Toasts carry result.error. |
| 10 | Help & Documentation | 3 | Reassurance microcopy clear. |
| Total | | 30/40 | Good — fails on brand craft, not usability. |

## Anti-Patterns Verdict

detect.mjs clean ([]). No generic slop. Problems are project-specific DESIGN.md rule violations the generic detector can't see.

## Priority Issues

[P1] Three eyebrows stacked down the archive page: PageHeader overline "From Our Inbox to Yours" -> NewsletterSection hand-rolled "Stay Informed" -> Section eyebrow "The Archive". DESIGN.md caps at <=1 kicker per 3 sections. Fix: keep PageHeader overline, drop NewsletterSection eyebrow, "Past issues" as plain Section title.

[P1] Two brush-smears on one page: header "The <Accent>Newsletter</Accent> Archive" + "The Weekly <Accent>Grind.</Accent>". One Smear Rule = <=1 per page. Fix: header keeps smear, subscribe heading goes plain.

[P1] NewsletterSection hand-rolls decoration the system owns: inline linear-gradient paper grid at rgba(0,0,0,0.03) (neutral-black on warm cream), blur-2xl wash duplicating .decor-wash, resting shadow-sm on card (against Flat-Paper Rule). Fix: one <Decor texture="dots" wash />, drop resting shadow, surface-1 + border for separation.

[P2] BroadcastCard hover uses -translate-y-1 + shadow-lg. DESIGN.md: .card-hover shifts border tone, not shadow. Fix: card-hover + keep title->primary, drop shadow lift.

[P3] Stale path comment NewsletterSection.tsx:2 says // src/components/home/NewsletterSection.tsx — wrong dir. Delete.

## User's stated future direction
- Subscribe block: strip the bordered card, inline it as centered heading + form band (lighter weight). Header keeps the page's single smear.

## Persona Red Flags
- Jordan (First-Timer): three kicker->heading units before the first real issue reads as three separate pitches; dilutes the subscribe CTA.
- Sam (A11y): BroadcastContent injects Kit's light-bg inline-styled email HTML with no dark-mode reconciliation — likely a bright rectangle in dark theme. Follow-up.
- Casey (Mobile): fine.

## What's Working
- Copy voice ("inbox stays civilized", "shamelessly good deal").
- BroadcastCard correctly text-first (date anchor, line-clamp, no fake image area).
- Empty state names why it's empty and points back to subscribe.
