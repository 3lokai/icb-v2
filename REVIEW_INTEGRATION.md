# Review System Integration Guide

## Quick Integration

### 1. Add ReviewSection to Coffee Detail Page

```tsx
// In src/components/coffees/CoffeeDetailPage.tsx

import { ReviewSection } from "@/components/reviews";

export function CoffeeDetailPage({ coffee }: CoffeeDetailPageProps) {
  return (
    <div className={cn("w-full bg-background", className)}>
      <PageShell maxWidth="7xl">
        {/* ... existing content ... */}

        {/* Add reviews section at the end */}
        <div className="py-16">
          <ReviewSection
            entityType="coffee"
            entityId={coffee.id}
          />
        </div>
      </PageShell>
    </div>
  );
}
```

### 2. Add ReviewSection to Roaster Detail Page

```tsx
// In src/components/roasters/RoasterDetailPage.tsx (or wherever you have it)

import { ReviewSection } from "@/components/reviews";

export function RoasterDetailPage({ roaster }: RoasterDetailPageProps) {
  return (
    <div className="w-full">
      {/* ... existing content ... */}

      <div className="py-16">
        <ReviewSection
          entityType="roaster"
          entityId={roaster.id}
        />
      </div>
    </div>
  );
}
```

## Component Structure

The review system is split into reusable components:

### ReviewSection (Main Container)
- Orchestrates all review functionality
- Shows stats, capture UI, and reviews list
- Use this for full integration

### ReviewStats
- Displays: ⭐ 4.3 · 126 reviews · 82% recommend
- Can be used standalone in cards/listings
- Props: `stats` (from `useReviewStats` hook)

### ReviewCapture
- Progressive disclosure UI for capturing reviews
- Stage 1: 👍/👎 recommend (always visible)
- Stage 2: ⭐ rating + comment (auto-expands)
- Stage 3: Additional details (explicit expand)
- Handles both new reviews and edits

### ReviewList
- Displays reviews from others
- Shows max 3 initially, then "Show all X reviews"
- Handles empty state

## Hooks Available

### useReviews(entityType, entityId)
Fetch all latest reviews for an entity.

```tsx
const { data: reviews, isLoading } = useReviews("coffee", coffeeId);
```

### useReviewStats(entityType, entityId)
Fetch aggregated stats for an entity.

```tsx
const { data: stats } = useReviewStats("coffee", coffeeId);
// stats.review_count, stats.avg_rating, stats.recommend_pct
```

### useCreateReview()
Create or edit a review (with 600ms debounce).

```tsx
const { createReview, isLoading, isSuccess } = useCreateReview();

createReview({
  entity_type: "coffee",
  entity_id: coffeeId,
  recommend: true,
  rating: 4,
  comment: "Great coffee!"
});
```

### useDeleteReview()
Soft delete a review.

```tsx
const { mutate: deleteReview } = useDeleteReview();

deleteReview({
  input: { entity_type: "coffee", entity_id: coffeeId },
  anonId: getAnonId()
});
```

## Features

✅ **Anonymous + Authenticated Users**: Works for both without login
✅ **Immutable History**: Edits create new reviews, view shows latest
✅ **Debounced Saves**: 600ms debounce prevents spam
✅ **Optimistic UI**: Shows "Saving…" / "Saved ✓" states
✅ **Progressive Disclosure**: Simple → detailed in stages
✅ **Server Actions**: All writes validated server-side
✅ **RLS**: Read-only policies for public access
✅ **Auto Stats**: Triggers update coffees/roasters rating fields

## Styling

All components use your existing design system:
- Primitives: Stack, Cluster
- UI: Card, Button, Badge, Textarea
- Icons: Icon component
- Utils: cn, formatPrice

Colors follow your theme (primary, muted, accent, etc.)

## Data Flow

1. **User interacts** → ReviewCapture detects identity (user_id or anon_id)
2. **Form updates** → Debounced createReview call (600ms)
3. **Server action** → Validates identity, inserts new row
4. **Database trigger** → Updates coffees.rating_avg / roasters.avg_rating
5. **Query invalidation** → React Query refetches reviews/stats
6. **UI updates** → Shows latest state

## Empty States

- **No reviews yet**: Shows prompt "Be the first to share..."
- **1-2 reviews**: Shows all, no pagination
- **3+ reviews**: Shows first 3, "Show all X reviews" button

## Identity Resolution

- **Logged in**: Uses `user_id` from Supabase Auth
- **Anonymous**: Uses `anon_id` from localStorage + cookie
- **Auto-healing**: localStorage is source of truth, syncs to cookie
- **Server validation**: Cookie takes precedence, prevents spoofing

## Migration

Already applied via:
```
supabase/migrations/20251230000429_create_reviews_system.sql
```

Includes:
- ✅ reviews table with polymorphic entity design
- ✅ latest_reviews_per_identity view
- ✅ entity_review_stats view
- ✅ Indexes for performance
- ✅ Triggers to update rating fields
- ✅ RLS policies (read-only)

## Next Steps

1. Integrate `ReviewSection` into detail pages
2. Test both coffee and roaster reviews
3. Optionally: Add `ReviewStats` to listing cards
4. Monitor performance with indexes

## Troubleshooting

**Reviews not showing?**
- Check RLS policies are enabled
- Verify entity_id matches coffee/roaster id
- Check browser console for errors

**Can't edit review?**
- Check anon_id cookie exists
- Verify identity_key matches
- Check server action logs

**Stats not updating?**
- Verify triggers are firing
- Check migration applied
- Ensure status = 'active'
