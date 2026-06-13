# Critique ignore list

Findings here are deliberate project decisions. Critique drops matching findings silently.

- **Multiple `<Accent>` brush-smears per page.** Per-section / per-title accents are a deliberate
  project override (decided during homepage work; see `frontend-update/sprint-5-discovery.md` §5.4).
  The smear is the brand signature and may repeat per titled section. Do NOT flag "two accent smears
  per page" or cite the "One Smear Rule" against directory/discovery pages.

- **Per-logo adaptive light/dark card background (RoasterCard).** The dynamic logo-color extraction
  that flips a roaster tile's background light or dark is functional, not decorative — it guarantees
  logo legibility for both white-on-transparent and dark logos. Do NOT flag this as a patchwork/
  inconsistency tell. (Softening the tonal swing is optional, not required.)
