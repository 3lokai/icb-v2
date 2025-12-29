# Adding Reviews to CoffeeDetailPage

## Quick Copy-Paste Integration

Add this to your existing `CoffeeDetailPage.tsx`:

### 1. Import the ReviewSection component

```tsx
// Add to existing imports at the top
import { ReviewSection } from "@/components/reviews";
```

### 2. Add the reviews section in the main grid

Insert this **after** your existing grid (after line 378 in your current file):

```tsx
{/* Reviews Section */}
<div className="mt-16 pt-16 border-t">
  <ReviewSection
    entityType="coffee"
    entityId={coffee.id}
  />
</div>
```

## Complete Integration Example

Here's where it fits in your component structure:

```tsx
export function CoffeeDetailPage({ coffee, className }: CoffeeDetailPageProps) {
  // ... existing code ...

  return (
    <div className={cn("w-full bg-background", className)}>
      <PageShell maxWidth="7xl">
        <div className="py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            {/* ... existing breadcrumbs ... */}
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-7">
            {/* Left Column: Image & Flavor Profile */}
            <div className="lg:col-span-3">
              {/* ... existing image carousel and sensory profile ... */}
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-4">
              {/* ... existing details stack ... */}
            </div>
          </div>

          {/* ✨ ADD REVIEWS HERE ✨ */}
          <div className="mt-16 pt-16 border-t">
            <ReviewSection
              entityType="coffee"
              entityId={coffee.id}
            />
          </div>
        </div>
      </PageShell>
    </div>
  );
}
```

## What You'll Get

### Header Section
```
Ratings & Reviews
⭐ 4.3 · 126 reviews · 82% recommend
```

### Capture UI (Always First)
```
Have you tried this coffee?
[ 👍 Recommend ]   [ 👎 Don't recommend ]

(After clicking, expands to show:)
⭐ ⭐ ⭐ ⭐ ⭐  Rating (optional)
Your experience (optional)
[Textarea for comments]

[+ Add more details]
```

### Review Display
```
Your review · Saved ✓
⭐ ⭐ ⭐ ⭐ ☆
"Bright and juicy, great for V60"
[ Edit ] [ Delete ]

────────────────────────────

What others are saying
Sort by: Latest ▾

⭐ ⭐ ⭐ ⭐ ☆   👍 Recommends
"Excellent daily driver. Works great with milk."
— Anonymous · 2 days ago

⭐ ⭐ ⭐ ⭐ ⭐   👍 Recommends
"Best Ethiopian I've had in months"
— Anonymous · 1 week ago

[ Show all 126 reviews ]
```

## Styling Integration

The review components automatically use your existing design system:
- **Layout**: Stack, Cluster primitives (already in your codebase)
- **Components**: Card, Button, Badge, Separator
- **Icons**: Your Icon component
- **Colors**: Follows your theme (primary, muted, accent, etc.)

It will match the look and feel of your existing coffee detail page perfectly!

## Testing

After integration, test:
1. **Anonymous review**: Just click recommend/don't recommend
2. **Edit review**: Change rating, add comment
3. **Delete review**: Remove your review
4. **View others**: See reviews from other users
5. **Empty state**: Delete all to see "No reviews yet"

## Performance

- Reviews query: Cached for 30 seconds
- Stats query: Cached for 30 seconds
- Debounced saves: 600ms delay prevents spam
- Optimistic UI: Shows "Saving…" / "Saved ✓"

## Next Steps

For roasters, do the same but use:
```tsx
<ReviewSection
  entityType="roaster"
  entityId={roaster.id}
/>
```

That's it! 🎉
