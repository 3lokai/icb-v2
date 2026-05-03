---

## Page header

**Title:** "The State of Indian Specialty Coffee — by the Numbers"
**Subtitle:** "Live data from 85+ active roasters and 1,100+ specialty SKUs indexed on IndianCoffeeBeans.com. Updated monthly."
**Methodology line (small, footer):** "Catalog reflects active SKUs from Indian specialty roasters. Region/process/variety attribution sourced from roaster product pages and normalized."

---

## Chart 1 — Process Breakdown (lead chart)

**Title:** "How India Processes Its Specialty Coffee"
**Subtitle:** "Share of active SKUs by processing method"
**Visual:** Horizontal bar chart, sorted descending. (You already have this — same style as the asset you shared.)
**Data:**

| Process | SKUs | % |
|---|---|---|
| Washed | 238 | 34.0% |
| Natural | 134 | 19.1% |
| Anaerobic | 76 | 10.8% |
| Honey | 66 | 9.4% |
| Experimental | 60 | 8.6% |
| Washed Natural | 38 | 5.4% |
| Monsooned | 30 | 4.3% |
| Carbonic Maceration | 25 | 3.6% |
| Double Fermented | 24 | 3.4% |
| Pulped Natural | 7 | 1.0% |
| Wet Hulled | 3 | 0.4% |

**Callout below chart:** "Fermentation-forward methods (anaerobic + carbonic + double-fermented + experimental) now make up 26.4% of active SKUs — bigger than natural alone."

---

## Chart 2 — State Concentration

**Title:** "Where India's Specialty Coffee Comes From"
**Subtitle:** "Active SKUs by Indian state of origin (region-tagged coffees only)"
**Visual:** Horizontal bar chart, descending. Karnataka in a stronger color (e.g. deep terracotta) to show the concentration; rest in muted neutral. Skip pie/donut — bars communicate the disparity better.
**Data:**

| State | SKUs | % of region-tagged |
|---|---|---|
| Karnataka | 462 | 76.3% |
| Tamil Nadu | 59 | 9.8% |
| Odisha | 27 | 4.5% |
| Andhra Pradesh | 17 | 2.8% |
| Kerala | 12 | 2.0% |
| Meghalaya | 6 | 1.0% |
| Tripura | 2 | 0.3% |
| Nagaland | 1 | 0.2% |

*(Percentages here are share of region-tagged SKUs — 605 total — not all 1,108. State that clearly in a footnote.)*

**Callout:** "Karnataka accounts for over three-quarters of region-identified Indian specialty SKUs. The Northeast — Meghalaya, Tripura, Nagaland — is small but newly present."

---

## Chart 3 — Top Growing Regions

**Title:** "India's Specialty Coffee Map"
**Subtitle:** "Top 10 origin regions by active SKU count"
**Visual:** Horizontal bar chart, descending. Group bars visually by state (e.g. all Karnataka regions in one color family — varying shades; Tamil Nadu in another, etc.). This makes the Karnataka clustering visually obvious.
**Data:**

| Region | State | SKUs |
|---|---|---|
| Chikmagalur | Karnataka | 256 |
| Baba Budangiri | Karnataka | 76 |
| Kodagu (Coorg) | Karnataka | 56 |
| Shevaroy Hills | Tamil Nadu | 39 |
| Sakleshpur | Karnataka | 37 |
| Koraput | Odisha | 27 |
| Biligiriranga Hills | Karnataka | 22 |
| Araku Valley | Andhra Pradesh | 16 |
| Palani Hills | Tamil Nadu | 15 |
| Wayanad | Kerala | 10 |

**Callout:** "Chikmagalur alone accounts for 23% of all active Indian specialty SKUs."

---

## Chart 4 — Price by Process

**Title:** "What You Pay for Process"
**Subtitle:** "Median price per 250g by processing method (₹, normalized across all variants)"
**Visual:** Horizontal bar chart, descending by median price. Add a faint reference line at the washed price (₹660) — makes the premium for fermented processes pop visually.
**Data:**

| Process | Median ₹/250g | vs Washed |
|---|---|---|
| Wet Hulled | ₹1,200 | +82% |
| Carbonic Maceration | ₹986 | +49% |
| Anaerobic | ₹875 | +33% |
| Experimental | ₹855 | +30% |
| Honey | ₹800 | +21% |
| Natural | ₹793 | +20% |
| Double Fermented | ₹700 | +6% |
| Pulped Natural | ₹700 | +6% |
| Washed | ₹660 | baseline |
| Monsooned | ₹650 | -2% |
| Washed Natural | ₹606 | -8% |

**Callout:** "Carbonic maceration commands a ~50% premium over washed-process coffees. Fermentation isn't just experimental — it's monetized."

*(Wet hulled's small sample size — 3 SKUs — should be noted in a footnote so it doesn't get cited as a market trend.)*

---

## Chart 5 — Variety Distribution

**Title:** "What's Actually Growing on Indian Estates"
**Subtitle:** "Top coffee varieties by active SKU count"
**Visual:** Horizontal bar chart, descending. Highlight the Indian-bred varieties (SLN 795, SLN 9, Chandragiri, Cauvery, SLN 5B, Hemavathi, SLN 6, Selection 795, SLN 274) in one color, imported/global varieties in a different muted color. The visual divide tells the story.
**Data:**

| Variety | SKUs | Origin |
|---|---|---|
| SLN 795 | 111 | India (CCRI selection) |
| SLN 9 | 81 | India (CCRI selection) |
| Chandragiri | 62 | India (CCRI release) |
| Catuai | 27 | Brazil |
| Cauvery | 13 | India (Catimor selection) |
| Catimor | 13 | Hybrid |
| SLN 5B | 12 | India |
| Kent | 10 | India (legacy) |
| Caturra | 10 | Brazil |
| Bourbon | 6 | Global heirloom |
| Geisha | 6 | Ethiopia/Panama |
| Hemavathi | 6 | India |

**Callout:** "Indian-bred varieties — SLN 795, SLN 9, Chandragiri — dominate. SLN 795 alone appears in 111 SKUs. Imports like Geisha and Bourbon remain rare in Indian production."

*(Note for code: dedupe "Selection 795" into "SLN 795" — they're the same variety with inconsistent labels.)*

---

## Chart 6 — Roaster City Map

**Title:** "Where India Roasts"
**Subtitle:** "Active specialty roasters by city of operation"
**Visual:** Either (a) horizontal bar chart top 10 cities, or (b) actual India map with city dots sized by roaster count. If your Cursor agent can pull off the map cleanly with `react-simple-maps` or similar, do the map — it's far more shareable. If not, bars are fine.
**Data:**

| City | State | Active Roasters |
|---|---|---|
| Bangalore | Karnataka | 18 |
| New Delhi | Delhi | 10 |
| Mumbai | Maharashtra | 9 |
| Hyderabad | Telangana | 4 |
| Pune | Maharashtra | 4 |
| Chennai | Tamil Nadu | 3 |
| Coorg | Karnataka | 3 |
| Gurugram | Haryana | 2 |
| Jaipur | Rajasthan | 2 |
| Chikmagalur | Karnataka | 2 |
| Kohima | Nagaland | 1 |

**Callout:** "Bangalore, Delhi and Mumbai host nearly half of India's active specialty roasters — but Kohima's emergence signals something quietly bigger."

---

## Page footer (important for citations)

**Section:** "Use this data"
- Methodology paragraph (3-4 sentences on how SKUs are indexed, how regions/processes are normalized, update cadence)
- "All data on this page is free to use with attribution to IndianCoffeeBeans.com. For the underlying spreadsheet or custom queries, contact [your email]."
- Last updated date (auto-render from latest data pull)

This citation footer is what makes the page LLM-friendly and journalist-friendly. Don't skip it.

---

## Two design notes for your Cursor agent

1. **Every chart needs a clean download/share button** (PNG export) — `html-to-image` library handles this in 5 lines. This is what gets the chart into Reddit/Instagram/Twitter without a screenshot crop.
2. **Each chart should have a stable URL anchor** (`#process`, `#regions`, etc.) so emails can deep-link.
