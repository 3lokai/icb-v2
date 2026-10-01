# Docs

One folder, after `ai_docs/` was folded in here (2026-09-18). Live docs sit at the top level;
anything shipped, abandoned, or superseded moves to [`completed/`](completed/) rather than
being deleted.

## Live

| Doc | What it is |
| --- | --- |
| [`auth.md`](auth.md) | Auth and anonymous identity. Read before touching auth. |
| [`regions-estates-handover.md`](regions-estates-handover.md) | Regions/estates data model, what is built, and the traps. Only 4f remains. |
| [`regions-hub-audit.md`](regions-hub-audit.md) | Regions hub audit, triaged: 10 fixed, 3 rejected with evidence, 3 open (map geometry polish and provenance). |
| [`api-plans-ops.md`](api-plans-ops.md) | Ops guide for paid API plans: turning a deal into access, renewals, cut-off, what goes wrong, SQL. |
| [`gear-directory-plan.md`](gear-directory-plan.md) | Plan for `/gear` from `raw_products`. Not built. |

## Decisions worth knowing before you start

Short versions; the ADRs have the reasoning.

- **Sanity** backs `/learn` — ADRs 001/004/008/009 (MDX, Velite, ImageKit) are superseded. ([010](decisions/010-sanity-cms-for-learn.md))
- **PostgREST silently caps selects at 1000 rows** — page through `fetchAllRows`. ([011](decisions/011-page-unbounded-selects.md))
- **Consent:** analytics opt-out, marketing opt-in, `src/lib/consent.ts` is the source of truth; attribution is first-touch and consent-gated. ([012](decisions/012-consent-and-attribution.md))
- **Regions hub only; estate pages query-gated**, never all 187. ([013](decisions/013-regions-and-estates-surfaces.md))
- **Lifecycle email funnel lives in Notifuse**, not the DB. ([014](decisions/014-notifuse-lifecycle.md))

## Folders

- [`decisions/`](decisions/) — numbered ADRs, kept as a permanent record even where the
  decision has since been revisited. Superseded ones say so in their Status line.
- [`completed/`](completed/) — the archive. Shipped plans, finished setups (PostHog, Notifuse,
  the pre-launch `cleanup/` effort), one-off triage and audit reports, and stale snapshots.
  Treat every file as a record of its date — verify against the code before relying on it.
