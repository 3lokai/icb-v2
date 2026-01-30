# ICB UI System Guide (Primitives + CSS)

**Goal**: Calm, serious, high-contrast, opinion-first. No SaaS-landing-page theatre.

Use this as the contract for AI agents and developers working on the ICB codebase.

---

## 0) Non-negotiables

1. **Coffee is the hero**. Everything routes back to coffee.
2. **No "featured / best / trending" vibes** in layout or styling.
3. **Opinion-first UI**: Stars + "Add your take" wins over metadata and navigation.

---

## 1) Tokens & Surfaces

**Source**: [globals.css](file:///d:/icb-v2/src/app/globals.css)

### Use tokens. Don't freestyle colors.

The design system uses CSS custom properties defined in `globals.css`. These tokens adapt to Light and Dark themes automatically.

#### Surface Hierarchy

Background / Card / Popover must remain **differentiated** (layering, magazine feel):

- **`--background`**: Base page background
- **`--card`**: Slightly darker/warmer (Light) or lighter (Dark) than background
- **`--popover`**: Most elevated surface, for dropdowns/modals

**Light Theme**:
```css
--background: oklch(0.982 0.009 79.9);
--card: oklch(0.965 0.015 79.9);       /* Darker/warmer */
--popover: oklch(0.99 0.005 79.9);     /* Lighter/elevated */
```

**Dark Theme**:
```css
--background: oklch(0.195 0.01 59.6);
--card: oklch(0.24 0.014 59.5);        /* Lighter (Surface 1) */
--popover: oklch(0.28 0.014 59.5);     /* Even lighter (Surface 2) */
```

#### Text Contrast

**Muted text must stay readable**. No "aesthetic grey" that looks cool but reads like dust.

```css
/* Light: Darker & less saturated for readability */
--muted-foreground: oklch(0.55 0.04 80);

/* Dark: Adequate contrast */
--muted-foreground: oklch(0.724 0.024 50.2);
```

#### Action Colors

**Primary color = action only** (Rate / Add / Claim profile). Not decoration.

```css
--primary: oklch(0.628 0.12 60.5);     /* Light */
--primary: oklch(0.579 0.099 49.9);    /* Dark */
```

**Never use `border-primary` to imply recommendation or importance.**

#### Focus States

**Focus ring = calm**. Ring shouldn't look like a CTA.

```css
/* Reduced chroma for restraint */
--ring: oklch(0.628 0.08 60.5);        /* Light: Calmer than primary */
--ring: oklch(0.579 0.08 49.9);        /* Dark: Calmer than primary */
```

#### Borders

Consistent "paper edge" borders:

```css
--border: oklch(0.87 0.02 80);         /* Light */
--border: oklch(0.306 0.025 59.1);     /* Dark */
```

### Don't

- ❌ Invent new grays in components
- ❌ Use "primary border" to imply recommendation
- ❌ Use chart colors (`--chart-1/2/3`) for UI elements (ratings, badges, etc.)

---

## 2) Spacing & Rhythm

**Source**: [layout.css](file:///d:/icb-v2/src/app/styles/layout.css)

### Default product rhythm should be tighter than editorial.

#### Section Spacing

```css
/* Editorial (Spacious) */
.section-spacing {
  @apply py-16 md:py-24 lg:py-32;
}

/* DEFAULT for product pages */
.section-spacing-tight {
  @apply py-8 md:py-12 lg:py-16;
}

/* Rare, long-form only */
.section-spacing-loose {
  @apply py-24 md:py-32 lg:py-48;
}
```

**Use `.section-spacing-tight` for product pages by default.**

#### Card Padding

```css
/* Editorial/Default */
.card-padding {
  @apply p-4 md:p-6;
}

/* Dense lists/streams */
.card-padding-compact {
  @apply p-3 md:p-4;
}
```

**Use `.card-padding-compact` for stream/feed cards.**

#### Grid Layouts

```css
/* Editorial (Spacious) */
.grid-cards {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

/* Product (Dense) */
.grid-cards-dense {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6;
}
```

**Use `.grid-cards-dense` for directory grids when density matters.**

#### Vertical Stacks

```css
.stack-xs { @apply flex flex-col gap-2; }   /* 8px */
.stack-sm { @apply flex flex-col gap-3; }   /* 12px */
.stack-md { @apply flex flex-col gap-6; }   /* 24px */
.stack-lg { @apply flex flex-col gap-10; }  /* 40px */
```

### Editorial-only

Loose spacing and big breaks are for **long-form content**, not coffee feeds.

---

## 3) Typography Rules

**Source**: [typography.css](file:///d:/icb-v2/src/app/styles/typography.css)

### Keep it editorial, not marketing.

#### Hero / Display

**Hero prompts are questions, not slogans.**

```css
/* Quiet authority: Editorial size, normal weight */
.text-hero {
  @apply font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight;
}

.text-display {
  @apply font-serif text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight;
}
```

#### Headings

```css
.text-title {
  @apply font-serif text-2xl md:text-3xl font-medium leading-tight tracking-tight;
}

.text-heading {
  @apply font-serif text-xl md:text-2xl font-medium leading-snug tracking-tight;
}

/* Stricter rules: Medium only, no semibold */
.text-subheading {
  @apply font-sans text-lg md:text-xl font-medium leading-snug;
}
```

**Use medium weights. `font-semibold` is banned unless it's a button.**

#### Body Text

```css
/* Normal weight enforced */
.text-body {
  @apply text-base font-normal leading-relaxed;
}

/* Prevent "unreadable trifecta" */
.text-body-muted {
  @apply text-base font-normal leading-relaxed text-muted-foreground;
}
```

#### Labels / Overlines

```css
/* Refined tracking: Print UI feel, not SaaS dashboard */
.text-overline {
  @apply text-xs capitalize font-medium tracking-wide;
}

.text-label {
  @apply text-xs capitalize font-medium tracking-wide text-muted-foreground;
}
```

**Labels/overlines: `tracking-wide`, not `tracking-widest`.**

### Don't

- ❌ Stack multiple "muted + small + light" together (unreadable trifecta)
- ❌ Use `font-semibold` outside of buttons
- ❌ Use Hero type for "Welcome to ICB" marketing copy

---

## 4) Primitive Components

### PageShell (`page-shell.tsx`)

**Use once per page** to set horizontal padding + max width.

```tsx
<PageShell maxWidth="normal"> {/* default */}
  {/* page content */}
</PageShell>
```

- **Default `maxWidth="normal"`**: Standard content width
- **`maxWidth="full"`**: Rare (hero visual sections only)

#### Don't

- ❌ Add custom horizontal padding elsewhere (you'll create layout drift)

---

### Section (`section.tsx`)

**Use for major page sections only.**

```tsx
<Section spacing="tight"> {/* Product default */}
  {/* section content */}
</Section>
```

- **Product pages**: `spacing="tight"` by default
- **Eyebrow + title header**: Editorial-only, not for every block

#### Don't

- ❌ Wrap every list/card group in Section with title (that's a brochure)

---

### Stack (`stack.tsx`)

**Default vertical layout primitive. Use everywhere.**

```tsx
<Stack gap="md">
  {/* vertically stacked items */}
</Stack>
```

- Default gap stays sensible
- Large gaps (`12`/`16`) only for hero breaks, not inside cards

#### Do

- ✅ Use Stack in cards, detail pages, and forms

---

### Cluster (`cluster.tsx`)

**Use for tags/chips/inline metadata only.**

```tsx
<Cluster gap="sm">
  <Tag>Light Roast</Tag>
  <Tag>Ethiopia</Tag>
</Cluster>
```

#### Don't

- ❌ Build navigation bars or primary action rows with Cluster (button soup)

---

### Rule (`rule.tsx`)

**Divider between sections.**

```tsx
<Rule spacing="tight" /> {/* Product default */}
```

- Product pages: `spacing="tight"`
- Default/loose: Editorial only

#### Don't

- ❌ Sprinkle dividers everywhere—use spacing first, Rule second

---

### Prose (`prose.tsx`)

**Long-form text container only.**

```tsx
<Prose>
  {/* Markdown / rich text content */}
</Prose>
```

#### Use for:

- ✅ Methodology
- ✅ About pages
- ✅ Long descriptions

#### Never use Prose for:

- ❌ Rating flow
- ❌ Coffee cards
- ❌ Reviews list UI

(That turns your product into a blog.)

---

## 5) Component Styling Rules

**Source**: [components.css](file:///d:/icb-v2/src/app/styles/components.css)

### Surfaces

```css
.surface-0 { @apply bg-background; }
.surface-1 { @apply bg-card text-card-foreground border border-border/60; }
.surface-2 { @apply bg-popover text-popover-foreground border border-border/70; }
```

**Deprecated**: `.card-shell`, `.modal-shell`, `.nav-shell` (use `.surface-*` + rounding utilities)

### Ratings / Stars

**Must use action tokens** (primary/accent), not "chart colors."

```css
.rating-stars {
  @apply flex text-accent;
}
```

### Featured / Emphasis

**No "featured" card styles**. No primary borders to signal importance.

```css
/* Neutral emphasis only */
.card-featured {
  @apply border-2 border-border bg-muted/40;
}
```

### Buttons

```css
/* Calm hover state: No spread of accent color on tools */
.btn-icon {
  @apply ... hover:bg-muted hover:text-foreground ...;
}
```

### Effects

**Effects (noise/marquee/float) must be rare and never reduce readability.**

- Noise overlay: `opacity: 0.05` (Light), `0.04` (Dark)
- Region overlays: Softened gradient (`from-black/60`)

---

## 6) Default Behavior Hierarchy

**Applies everywhere:**

1. **Rate / Add your take** (primary)
2. **See details** (tertiary link)
3. **Metadata** (quiet context)

**If a component makes "See details" feel primary, it's doing the wrong job.**

---

## Agent Instruction Footer

When working on ICB UI changes:

### Don't

- ❌ Change page layouts yet (Step 1 = primitives only)
- ❌ Introduce new spacing scales
- ❌ Introduce new colors (use existing tokens)
- ❌ Introduce "featured"/ranking visual language
- ❌ Use `font-semibold` outside buttons
- ❌ Make tertiary actions look primary

### Do

- ✅ Use existing tokens/utilities from CSS files
- ✅ Default to `.section-spacing-tight` for product pages
- ✅ Use `.surface-1` + rounding for cards
- ✅ Keep ratings/stars using `text-accent`
- ✅ Optimize for rating-first interaction, not aesthetics

---

## Reference Files

- [globals.css](file:///d:/icb-v2/src/app/globals.css) — Tokens (colors, shadows, radii)
- [typography.css](file:///d:/icb-v2/src/app/styles/typography.css) — Type scale & weights
- [layout.css](file:///d:/icb-v2/src/app/styles/layout.css) — Spacing & grid utilities
- [components.css](file:///d:/icb-v2/src/app/styles/components.css) — Component primitives
- [effects.css](file:///d:/icb-v2/src/app/styles/effects.css) — Visual effects

---

**Last Updated**: 2026-01-15  
**Status**: Active — Primitives audited and refined
