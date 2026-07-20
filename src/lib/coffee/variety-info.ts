// Curated one-liner descriptions for the coffee varieties that actually appear
// in the catalogue (there is no canon variety table — `coffees.varieties` is a
// plain string[]). Long-tail varieties without an entry stay plain text.

/** Descriptions keyed by a normalized variety name (see `normalizeVariety`). */
const VARIETY_INFO: Record<string, string> = {
  S795: "S795 — India’s most-planted Arabica (S.288 × Kent); balanced medium body with mild acidity, chocolate and nutty sweetness.",
  SLN9: "SLN 9 — Indian Arabica (Tafarikela × Hybrido de Timor); brighter acidity with floral, citrus-like sweetness and bold beans.",
  SLN5B:
    "SLN 5B — Indian Arabica (Devamachy × S.333) with Robusta/Liberica ancestry; sturdy, mild and body-forward.",
  SLN6: "SLN 6 — Indian Arabica (Kent × S.274, backcrossed to Kent); balanced, medium-bodied and approachable.",
  SLN13:
    "SLN 13 (Chandragiri) — Indian Sarchimor-type (Villa Sarchi × Hybrido de Timor); clean and structured with gentle acidity and nutty sweetness.",
  SLN274:
    "S.274 — India’s first improved Robusta; heavy-bodied and intense with strong bitterness, low acidity and abundant crema.",
  CHANDRAGIRI:
    "Chandragiri (SLN 13) — Indian Sarchimor-type (Villa Sarchi × Hybrido de Timor); clean, structured cup with gentle acidity and nutty sweetness.",
  CAUVERY:
    "Cauvery — Indian Catimor (Caturra × Hybrido de Timor); rust-resistant, rounded and heavier-bodied with mild-to-moderate acidity.",
  CATUAI:
    "Catuaí — compact hybrid (Mundo Novo × Caturra); sweet and balanced with medium body and clean, gentle acidity.",
  CATIMOR:
    "Catimor — Caturra × Hybrido de Timor hybrids bred for yield and rust resistance; often fuller-bodied with milder acidity.",
  CATURRA:
    "Caturra — compact Bourbon mutation; bright acidity, clean sweetness and a light, lively body at altitude.",
  GEISHA:
    "Geisha (Gesha) — Ethiopian-origin Arabica; intense jasmine and citrus aromatics with delicate sweetness and a tea-like body.",
  KENT: "Kent — one of India’s earliest Arabicas (1920s); mild, clean and well-rounded with gentle acidity.",
  HEMAVATHI:
    "Hemavathi — newer Indian semi-dwarf Arabica; clean and sweet with soft florals and balanced body.",
  BOURBON:
    "Bourbon — foundational Arabica; pronounced sweetness, complex acidity and a smooth, syrupy body (low yields).",
  SARCHIMOR:
    "Sarchimor — Villa Sarchi × Hybrido de Timor hybrids; rust-resistant, structured and sweet with moderate acidity and good body.",
  TYPICA:
    "Typica — one of the oldest Arabicas; clean sweetness, elegance and refined acidity (low-yielding).",
  SL28: "SL 28 — Kenyan Bourbon-related selection; juicy acidity, blackcurrant fruit and intense sweetness with a structured body.",
  SL34: "SL 34 — Kenyan Typica-related selection; full-bodied with rich sweetness, ripe fruit and juicy acidity.",
  CXR: "C × R — Indian Robusta hybrid (Coffea congensis × Robusta); smoother and cleaner than typical Robusta with strong body and crema.",
  ARABICA:
    "Arabica — the specialty-coffee species; sweeter and more aromatic with brighter acidity, less bitterness and lower caffeine than Robusta.",
  ROBUSTA:
    "Robusta — hardy, high-caffeine species; heavier-bodied and more bitter, prized for strength, texture and espresso crema.",
};

/** Spelling variants folded onto a canonical key. */
const ALIASES: Record<string, string> = {
  SLN795: "S795",
  SL795: "S795",
  SELECTION274: "SLN274",
  REDCATUAI: "CATUAI",
  REDBOURBON: "BOURBON",
  HAWAIIANREDCATURRA: "CATURRA",
  CR: "CXR", // "C × R" normalizes to "CR"
  CANEPHORA: "ROBUSTA",
};

/** Uppercase and strip all non-alphanumerics, e.g. "SLN 795" -> "SLN795". */
export function normalizeVariety(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function getVarietyDescription(name: string): string | undefined {
  const norm = normalizeVariety(name);
  return VARIETY_INFO[ALIASES[norm] ?? norm];
}
