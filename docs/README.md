# Docs

One folder, after `ai_docs/` was folded in here (2026-09-18). Live docs sit at the top level;
anything shipped, abandoned, or superseded moves to [`completed/`](completed/) rather than
being deleted.

## Live

| Doc | What it is |
| --- | --- |
| [`auth.md`](auth.md) | Auth and anonymous identity. Read before touching auth. |
| [`regions-estates-handover.md`](regions-estates-handover.md) | Regions/estates data model, what is built, and the traps. Only 4f remains. |
| [`ponytail-audit-handover.md`](ponytail-audit-handover.md) | The `ponytail:` comment audit, the PostgREST 1000-row cap, and the consent wiring. All steps applied. |
| [`posthog-implementation.md`](posthog-implementation.md) | How PostHog is wired and what each event means. |
| [`posthog-source-maps-setup.md`](posthog-source-maps-setup.md) | Source-map upload in the production build. |
| [`notifuse-lifecycle-sync.md`](notifuse-lifecycle-sync.md) | User-lifecycle sync to the self-hosted Notifuse instance. |
| [`cwv-lcp-unused-js-plan.md`](cwv-lcp-unused-js-plan.md) | Core Web Vitals: remaining TBT / unused-JS levers. |
| [`gear-directory-plan.md`](gear-directory-plan.md) | Plan for `/gear` from `raw_products`. Not built. |

## Folders

- [`cleanup/`](cleanup/) — the pre-launch cleanup effort. Its README tracks what's done; five
  refactor docs are still pending.
- [`decisions/`](decisions/) — numbered ADRs, kept as a permanent record even where the
  decision has since been revisited (001 and 008 both predate the move to Sanity).
- [`completed/`](completed/) — the archive. Shipped plans, finished migrations, one-off triage
  and audit reports, and stale snapshots. Nothing here describes current behaviour; treat every
  file as a record of its date, not a reference.
