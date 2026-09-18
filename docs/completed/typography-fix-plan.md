# Typography Fix Plan

## Overview
This document outlines the systematic plan to fix typography errors by replacing direct Tailwind text size classes with typography classes from `src/app/styles/typography.css`.

**Important**: Files in `src/components/ui/` are **EXCLUDED** from this fix plan as they are shadcn/ui imports and should not be modified. The ESLint rule will still flag these, but they should be ignored or the rule should be configured to exclude that directory.

## Replacement Mapping

### Direct Class → Typography Class

| Direct Class | Typography Class | Context |
|-------------|----------------|---------|
| `text-xs` | `text-overline` | Badges, tags, labels, metadata |
| `text-xs` | `text-caption` | Small descriptive text, footnotes |
| `text-sm` | `text-caption` | Small text, metadata, descriptions |
| `text-sm` | `text-body` | Body text that's intentionally small |
| `text-base` | `text-body` | Standard body text |
| `text-lg` | `text-body-large` | Larger body text |
| `text-lg` | `text-subheading` | Small headers, subsection titles |
| `text-xl` | `text-heading` | Card headers, subsections |
| `text-2xl` | `text-title` | Section headers |
| `text-3xl` | `text-title` | Section headers (responsive) |
| `text-4xl+` | `text-display` or `text-hero` | Page headers |

## Decision Guidelines

### When to use `text-overline` vs `text-caption`:
- **`text-overline`**: Badges, tags, labels, uppercase text, metadata that needs emphasis
- **`text-caption`**: Small descriptive text, footnotes, muted information

### When to use `text-body-large` vs `text-subheading`:
- **`text-body-large`**: Body text that needs to be larger (paragraphs, descriptions)
- **`text-subheading`**: Small headers, subsection titles (use when it's a heading)

## Files to Fix (Organized by Priority)

### Phase 1: Common Components (8 files, ~50 errors)

1. **src/components/common/CookieNotice.tsx** (8 errors)
   - Line 44: `text-xs` → `text-overline` (badge)
   - Line 78: `text-lg` → `text-subheading` (header)
   - Lines 103, 112, 129, 136, 158, 171, 178: `text-sm` → `text-caption` (descriptions)

2. **src/components/common/CookieSettings.tsx** (6 errors)
   - Line 48: `text-lg` → `text-subheading` (header)
   - Lines 75, 85, 103, 110: `text-sm` → `text-caption` (descriptions)
   - Line 129: `text-xs` → `text-overline` (link)

3. **src/components/common/Footer.tsx** (6 errors)
   - Line 33: `text-xs` → `text-caption` (italic tagline)
   - Lines 37, 43, 47, 146: `text-sm` → `text-body` (body text)
   - Line 157: `text-xs` → `text-caption` (copyright)

4. **src/components/common/Tag.tsx** (1 error)
   - Line 22: `text-xs` → `text-overline` (tag component)

5. **src/components/common/PageHeader.tsx** (1 error)
   - Line 44: `text-sm` → `text-caption` (badge text)

6. **src/components/common/LoadingSpinner.tsx** (1 error)
   - Line 53: `text-sm` → `text-caption` (loading text)

### Phase 2: Tools Components (15 files, ~150 errors)

**Note**: All files in `src/components/ui/` are **EXCLUDED** as they are shadcn/ui imports and should not be modified. These errors should be ignored or the ESLint rule should be configured to exclude that directory.

7. **src/components/tools/RecipeMainPanel.tsx** (27 errors)
    - Multiple `text-xs` → `text-overline` (badges, labels)
    - Multiple `text-sm` → `text-caption` (descriptions)
    - Multiple `text-lg` → `text-body-large` or `text-subheading` (headers/body)
    - Multiple `text-base` → `text-body` (body text)

8. **src/components/tools/MethodGuide.tsx** (24 errors)
    - Multiple `text-xs` → `text-overline` (badges, labels)
    - Multiple `text-sm` → `text-caption` (descriptions)
    - `text-lg` → `text-subheading` (headers)

9. **src/components/tools/RecipeDisplay.tsx** (14 errors)
    - `text-lg` → `text-body-large` or `text-subheading`
    - `text-sm` → `text-caption`
    - `text-xs` → `text-overline`

10. **src/components/tools/DrinkSizeInput.tsx** (8 errors)
    - `text-xs` → `text-overline` (labels)
    - `text-sm` → `text-caption` (descriptions)
    - `text-lg` → `text-subheading` (header)

11. **src/components/tools/BrewTimer.tsx** (10 errors)
    - Check file for patterns

12. **src/components/tools/RecipeSidebar.tsx** (3 errors)
    - Lines 120, 135: `text-sm` → `text-caption`
    - Line 152: `text-lg` → `text-subheading`

13. **src/components/tools/FilterSection.tsx** (3 errors)
    - Line 55: `text-base` → `text-body`
    - Line 87: `text-sm` → `text-caption`
    - Line 91: `text-xs` → `text-overline`

14. **src/components/tools/SelectorBase.tsx** (2 errors)
    - Line 30: `text-sm` → `text-caption`
    - Line 34: `text-xs` → `text-overline`

15. **src/components/tools/MethodSelector.tsx** (1 error)
    - Line 90: `text-xs` → `text-overline`

16. **src/components/tools/RoastLevelSelector.tsx** (3 errors)
    - Lines 90, 130, 134: `text-xs` → `text-overline`

17. **src/components/tools/StrengthSelector.tsx** (2 errors)
    - Line 97: `text-sm` → `text-caption`
    - Line 103: `text-xs` → `text-overline`

18. **src/components/tools/CopyLink.tsx** (1 error)
    - Line 49: `text-xs` → `text-overline`

19. **src/components/tools/CoffeeCalculator.tsx** (4 errors)
    - Check file for patterns

### Phase 3: Form & Contact Components (5 files, ~50 errors)

20. **src/components/components/FormModal.tsx** (17 errors)
    - Multiple `text-sm` → `text-caption` (labels, descriptions)
    - Line 414: `text-xl` → `text-heading` (header)

21. **src/components/contactus/FormModal.tsx** (16 errors)
    - Multiple `text-sm` → `text-caption` (labels, descriptions)
    - Line 411: `text-xl` → `text-heading` (header)

22. **src/components/contactus/NewsletterSection.tsx** (3 errors)
    - Line 25: `text-xl` → `text-heading` (header)
    - Lines 62, 85: `text-sm` → `text-caption` (descriptions)

23. **src/components/contactus/SocialMediaSection.tsx** (1 error)
    - Line 54: `text-sm` → `text-caption`

24. **src/components/auth-form.tsx** (4 errors)
    - Check file for patterns

### Phase 4: Homepage & Cards (6 files, ~30 errors)

25. **src/components/homepage/FeaturesBentoGrid.tsx** (12 errors)
    - Check file for patterns

26. **src/components/homepage/HeroSection.tsx** (9 errors)
    - Check file for patterns

27. **src/components/homepage/TestimonialsSection.tsx** (6 errors)
    - Check file for patterns

28. **src/components/homepage/EducationContent.tsx** (3 errors)
    - Check file for patterns

29. **src/components/cards/CoffeeCard.tsx** (3 errors)
    - Check file for patterns

30. **src/components/cards/RoasterCard.tsx** (check)
    - Check file for patterns

### Phase 5: Filter & Navigation (5 files, ~30 errors)

31. **src/components/coffees/CoffeeFilterBar.tsx** (12 errors)
    - Check file for patterns

32. **src/components/coffees/CoffeeFilterSidebar.tsx** (15 errors)
    - Check file for patterns

33. **src/components/roasters/RoasterFilterBar.tsx** (9 errors)
    - Check file for patterns

34. **src/components/header.tsx** (10 errors)
    - Lines 143, 152: Check patterns
    - Multiple `text-xs`, `text-sm` instances

35. **src/components/search/SearchCommand.tsx** (check)
    - Check file for patterns

### Phase 6: Remaining Components (5 files, ~20 errors)

36. **src/components/onboarding/onboarding-wizard.tsx** (6 errors)
    - Check file for patterns

37. **src/components/coffees/CoffeePagination.tsx** (check)
    - Check file for patterns

38. **src/components/roasters/RoasterFilterSidebar.tsx** (check)
    - Check file for patterns

39. **src/components/common/CoffeeFact.tsx** (check)
    - Check file for patterns

40. **src/components/cards/RegionCard.tsx** (check)
    - Check file for patterns

## Execution Strategy

### Step 1: Batch Process Common Patterns
1. Replace all `text-xs` in badge/tag contexts with `text-overline`
2. Replace all `text-xs` in metadata contexts with `text-caption`
3. Replace all `text-sm` in label/description contexts with `text-caption`
4. Replace all `text-sm` in body text contexts with `text-body`
5. Replace all `text-base` with `text-body`
6. Replace all `text-lg` in header contexts with `text-subheading`
7. Replace all `text-lg` in body contexts with `text-body-large`
8. Replace all `text-xl` with `text-heading`
9. Replace all `text-2xl`/`text-3xl` with `text-title`

### Step 2: Context-Specific Fixes
- Review each file for context-specific decisions
- Ensure semantic correctness (headers vs body text)
- Maintain visual hierarchy

### Step 3: Verification
- Run `npm run lint` to verify all errors are fixed
- Check for any remaining direct text size classes
- Ensure typography classes are properly imported/available

## Notes

- **DO NOT modify files in `src/components/ui/`** - these are shadcn/ui imports
- Some files may have multiple instances of the same class - fix all instances
- Pay attention to responsive variants (e.g., `md:text-lg`) - these should use typography classes that already handle responsiveness
- When in doubt, prefer `text-caption` over `text-overline` for descriptive text
- Headers should use `text-subheading`, `text-heading`, or `text-title` based on hierarchy
- Body text should use `text-body` or `text-body-large`

## ESLint Configuration

To exclude `src/components/ui/` from the typography linting rule, update `eslint.config.mjs`:

```javascript
{
  rules: {
    "custom/no-direct-text-size-classes": ["error", {
      ignorePatterns: ["**/components/ui/**"]
    }]
  },
  ignores: ["**/components/ui/**"]
}
```

Alternatively, modify the ESLint rule to automatically ignore files in the `components/ui` directory.

## Testing Checklist

After fixes:
- [ ] Run `npm run lint` - should show 0 typography errors
- [ ] Visual check of all pages to ensure typography looks correct
- [ ] Check responsive behavior on mobile/tablet/desktop
- [ ] Verify badge/tag components use `text-overline`
- [ ] Verify form labels use `text-caption`
- [ ] Verify headers use appropriate heading classes
- [ ] Verify body text uses `text-body` or `text-body-large`

