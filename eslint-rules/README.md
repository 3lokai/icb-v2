# Custom ESLint Rules

This directory contains custom ESLint rules for enforcing project-specific coding standards.

## Rules

### `no-direct-text-size-classes`

**Purpose:** Prevents direct Tailwind text size classes (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.) in favor of typography classes from `src/app/styles/typography.css`.

**Status:** ✅ **Active and working**

**Enforcement:** This rule is enabled as an error in `eslint.config.mjs`.

## Typography Class Mapping

| Direct Tailwind Class | Typography Class | Use Case |
|----------------------|-----------------|----------|
| `text-xs` | `.text-caption` or `.text-overline` | Small text, metadata, badges |
| `text-sm` | `.text-caption` or `.text-body` | Small body text, descriptions |
| `text-base` | `.text-body` | Standard body text |
| `text-lg` | `.text-body-large` or `.text-subheading` | Larger body text or small headers |
| `text-xl` | `.text-heading` | Subsection headers |
| `text-2xl`, `text-3xl` | `.text-title` | Section headers |
| `text-4xl+` | `.text-display` or `.text-hero` | Page headers |

## Examples

**❌ Invalid:**
```tsx
<span className="text-sm text-muted-foreground">Label</span>
<h2 className="text-2xl font-bold">Section Title</h2>
<p className="text-base leading-relaxed">Description</p>
<div className="sm:text-sm md:text-base">Responsive text</div>
```

**✅ Valid:**
```tsx
<span className="text-caption">Label</span>
<h2 className="text-title">Section Title</h2>
<p className="text-body">Description</p>
```

## What the Rule Detects

- Direct text size classes: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` through `text-9xl`
- Responsive variants: `sm:text-sm`, `md:text-base`, `lg:text-xl`, etc.
- Arbitrary values: `text-[14px]`, `text-[1rem]`, etc.

## Running the Linter

```bash
# Check for violations
npm run lint

# Auto-fix (where possible)
npm run lint:fix
```

## Related Files

- Typography definitions: `src/app/styles/typography.css`
- Consistency report: `ai_docs/typography-consistency-report.md`
- ESLint configuration: `eslint.config.mjs`

