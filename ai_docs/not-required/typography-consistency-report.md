# Typography Consistency Report

## Current Status

**Issue**: 73 files are using direct Tailwind text size classes (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`) instead of the typography classes defined in `src/app/styles/typography.css`.

**Total Instances**: 308+ direct text size class usages found across components.

## Typography Class Mapping

### Available Typography Classes

| Typography Class | Tailwind Equivalent | Use Case |
|-----------------|---------------------|----------|
| `.text-hero` | `text-5xl md:text-6xl lg:text-7xl` | Landing page heroes |
| `.text-display` | `text-4xl md:text-5xl lg:text-6xl` | Page headers |
| `.text-title` | `text-2xl md:text-3xl` | Section headers |
| `.text-heading` | `text-xl md:text-2xl` | Card headers, subsections |
| `.text-subheading` | `text-lg md:text-xl` | Smaller headers |
| `.text-body` | `text-base` | Paragraphs, descriptions |
| `.text-body-large` | `text-lg` | Larger body text |
| `.text-body-muted` | `text-base` + muted color | Muted paragraphs |
| `.text-caption` | `text-sm` (14px) | Metadata, small text |
| `.text-overline` | `text-sm` (14px) + uppercase | Tags, badges, labels |

### Replacement Guide

#### Direct Tailwind → Typography Class

| Current Usage | Should Be | Notes |
|--------------|-----------|-------|
| `text-xs` | `.text-caption` or `.text-overline` | Use `text-overline` for badges/tags, `text-caption` for metadata |
| `text-sm` | `.text-caption` or `.text-body` | Use `text-caption` for small text, `text-body` if it's body text |
| `text-base` | `.text-body` | Standard body text |
| `text-lg` | `.text-body-large` or `.text-subheading` | Use `text-body-large` for body, `text-subheading` for headers |
| `text-xl` | `.text-heading` | Subsection headers |
| `text-2xl` | `.text-title` | Section headers |
| `text-3xl` | `.text-title` | Section headers (responsive) |
| `text-4xl+` | `.text-display` or `.text-hero` | Page headers |

## Files Requiring Updates

### High Priority (Components with 10+ instances)

1. **src/components/tools/RecipeMainPanel.tsx** - 27 instances
2. **src/components/tools/MethodGuide.tsx** - 24 instances
3. **src/components/tools/RecipeDisplay.tsx** - 14 instances
4. **src/components/homepage/FeaturesBentoGrid.tsx** - 12 instances
5. **src/components/coffees/CoffeeFilterBar.tsx** - 12 instances
6. **src/components/homepage/HeroSection.tsx** - 9 instances
7. **src/components/roasters/RoasterFilterBar.tsx** - 9 instances
8. **src/components/common/CookieNotice.tsx** - 8 instances
9. **src/components/tools/DrinkSizeInput.tsx** - 8 instances
10. **src/components/tools/BrewTimer.tsx** - 10 instances

### Medium Priority (Components with 3-9 instances)

- src/components/homepage/TestimonialsSection.tsx (6)
- src/components/homepage/EducationContent.tsx (3)
- src/components/cards/CoffeeCard.tsx (3)
- src/components/onboarding/onboarding-wizard.tsx (6)
- src/components/header.tsx (10)
- src/components/coffees/CoffeeFilterSidebar.tsx (15)
- src/components/contactus/FormModal.tsx (16)
- src/components/components/FormModal.tsx (17)
- src/components/common/CookieSettings.tsx (6)
- src/components/common/Footer.tsx (6)
- src/components/ui/field.tsx (6)
- src/components/ui/dropdown-menu.tsx (6)
- src/components/auth-form.tsx (4)
- src/components/tools/CoffeeCalculator.tsx (4)

### Low Priority (Components with 1-2 instances)

- Various UI components (badge, button, card, label, etc.)
- Single-use components

## Common Patterns to Replace

### Pattern 1: Small Labels/Metadata
```tsx
// ❌ Before
<span className="text-xs text-muted-foreground">Label</span>

// ✅ After
<span className="text-caption">Label</span>
```

### Pattern 2: Badges/Tags
```tsx
// ❌ Before
<Badge className="text-xs uppercase">Tag</Badge>

// ✅ After
<Badge className="text-overline">Tag</Badge>
```

### Pattern 3: Body Text
```tsx
// ❌ Before
<p className="text-sm leading-relaxed">Description</p>

// ✅ After
<p className="text-body">Description</p>
```

### Pattern 4: Small Headers
```tsx
// ❌ Before
<h3 className="font-semibold text-lg">Subsection</h3>

// ✅ After
<h3 className="text-subheading">Subsection</h3>
```

### Pattern 5: Section Headers
```tsx
// ❌ Before
<h2 className="font-bold text-2xl">Section Title</h2>

// ✅ After
<h2 className="text-title">Section Title</h2>
```

## Additional Typography Classes Needed?

Based on usage patterns, we might need:

1. **`.text-label`** - For form labels (currently using `text-sm`)
2. **`.text-small`** - For very small text (if we need something smaller than 14px, but user wants 14px minimum)

However, the current typography classes should cover most use cases.

## Next Steps

1. ✅ Fixed `.text-overline` to use `text-sm` (14px) instead of `text-xs` (12px)
2. ⏳ Update all components to use typography classes
3. ⏳ Add linting rule to prevent direct text size classes
4. ⏳ Update documentation

## Notes

- The smallest font size is now consistently 14px (`text-sm`) across all typography classes
- `.text-caption` and `.text-overline` both use 14px, but `.text-overline` adds uppercase styling
- All typography classes include proper line-height and spacing
- Typography classes use the serif font (Playfair Display) for headings and sans-serif for body text

