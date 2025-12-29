# Review System Implementation Plan

## Overview
Implement a comprehensive review system for both coffees and roasters using a polymorphic entity design pattern. The system supports both authenticated users and anonymous users (via cookie + localStorage) without requiring login.

## Key Decisions (Final)

### ✅ Identity Strategy (anon_id)
- **Use normal cookie + localStorage mirror (NOT httpOnly)**
- **Why not httpOnly?** Client needs to send anon_id to server actions. httpOnly blocks JS access. (Note: We use server actions for writes, not direct RLS, but client still needs to read anon_id to send to server)
- **Strategy:**
  - On first interaction: generate UUID in client
  - Store in localStorage AND set cookie (1 year expiry)
  - Always read from localStorage first; fallback to cookie
- **Key:** Stable identity across refreshes + usable in Supabase client

### ✅ Multiple Reviews Allowed
- No uniqueness constraint per entity+identity
- "Latest review wins" for public display (via view)
- Users can submit multiple reviews over time

### ✅ Stats Strategy (Don't Over-Optimize)
- Start with: regular views + indexes
- Build: `latest_reviews_per_identity` (view) + `entity_review_stats` (view)
- Add indexes on: `(entity_type, entity_id, created_at DESC)`, `(user_id, created_at DESC)`, `(anon_id, created_at DESC)`
- **When/if you hit pain:** Promote stats into cache table via trigger OR materialized view
- **Don't pre-cry about 10k rows. 10k is nothing.**

## Database Schema Design

### 1. Reviews Table (`reviews`)

**Core Fields:**
- `id` (UUID, PRIMARY KEY) - Unique review identifier
- `entity_type` (ENUM, NOT NULL) - Either 'coffee' or 'roaster'
- `entity_id` (UUID, NOT NULL) - Foreign key to coffees.id or roasters.id
- `user_id` (UUID, NULLABLE) - References auth.users(id) ON DELETE SET NULL (for authenticated users)
- `anon_id` (UUID, NULLABLE) - Anonymous user identifier (from cookie/localStorage)
- `recommend` (BOOLEAN, NULLABLE) - Whether user recommends the entity
- `rating` (SMALLINT, NULLABLE) - Rating value (1-5 scale)
  - CHECK constraint: `rating >= 1 AND rating <= 5`
- `value_for_money` (BOOLEAN, NULLABLE) - Value for money rating
- `works_with_milk` (BOOLEAN, NULLABLE) - Coffee-only field
  - `null` = unknown
  - `true` = works with milk
  - `false` = better black
- `brew_method` (ENUM, NULLABLE) - Uses existing `grind_enum` from database
- `comment` (TEXT, NULLABLE) - Review text content
  - Optional constraint: max length (enforced in UI, optional in DB)
- `status` (ENUM, NOT NULL, DEFAULT 'active') - Review status: 'active', 'deleted', 'flagged'
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Constraints:**
- CHECK constraint: `entity_type IN ('coffee', 'roaster')`
- CHECK constraint: `rating IS NULL OR (rating >= 1 AND rating <= 5)`
- CHECK constraint: `status IN ('active', 'deleted', 'flagged')`
- CHECK constraint: `(user_id IS NOT NULL OR anon_id IS NOT NULL)` - At least one identity required
- **NO UNIQUE constraint** - Multiple reviews allowed per entity+identity

**Foreign Keys:**
- No direct foreign keys to coffees/roasters (polymorphic design)
- `user_id` → `auth.users(id)` ON DELETE SET NULL (optional, for authenticated users)

### 2. Latest Reviews Per Identity View (`latest_reviews_per_identity`)

**Purpose:** "Latest review wins" - This is the public truth. Deduplicate reviews to show only the latest active review per (entity_type, entity_id, identity) combination.

**Identity Key Logic:**
- Logged-in identity: `user:<user_id>`
- Anonymous identity: `anon:<anon_id>`
- Computed in view as: `COALESCE('user:' || user_id::text, 'anon:' || anon_id::text) AS identity_key`

**View Logic:**
- Filter reviews where `status = 'active'`
- Group by `(entity_type, entity_id, identity_key)`
- Select the review with the latest `created_at` for each group
- Include all review fields for the selected review

**SQL Structure:**
```sql
CREATE VIEW latest_reviews_per_identity AS
SELECT DISTINCT ON (entity_type, entity_id, COALESCE('user:' || user_id::text, 'anon:' || anon_id::text))
  *,
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text) AS identity_key
FROM reviews
WHERE status = 'active'
ORDER BY 
  entity_type, 
  entity_id, 
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text),
  created_at DESC;
```

### 3. Entity Review Stats View (`entity_review_stats`)

**Purpose:** Aggregate statistics computed from latest active reviews per entity.

**Fields:**
- `entity_type` (TEXT) - 'coffee' or 'roaster'
- `entity_id` (UUID) - The coffee or roaster ID
- `review_count` (INTEGER) - Total count of latest active reviews (includes all reviews, even without ratings)
- `rating_count` (INTEGER) - Count of reviews with non-NULL ratings (explicit count for avg_rating calculation)
- `avg_rating` (NUMERIC) - Average rating (rounded to 2 decimals, ignores NULLs)
- `recommend_pct` (NUMERIC) - Percentage of reviews that recommend (0-100, rounded to 2 decimals)
- `last_review_at` (TIMESTAMPTZ) - Most recent review timestamp
- `updated_at` (TIMESTAMPTZ) - When stats were last computed

**Note:** `review_count` = total latest reviews, `rating_count` = reviews with ratings. This makes it explicit that `avg_rating` is based on fewer rows than total reviews.

**SQL Structure:**
```sql
CREATE VIEW entity_review_stats AS
SELECT 
  entity_type,
  entity_id,
  COUNT(*) as review_count,  -- Total latest reviews (includes reviews without ratings)
  COUNT(rating) as rating_count,  -- Count of reviews with non-NULL ratings
  ROUND(AVG(rating)::numeric, 2) as avg_rating,  -- Ignores NULLs automatically
  ROUND(
    (COUNT(*) FILTER (WHERE recommend = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 
    2
  ) as recommend_pct,
  MAX(created_at) as last_review_at,
  NOW() as updated_at
FROM latest_reviews_per_identity
GROUP BY entity_type, entity_id;
```

### 4. Indexes for Performance

**Primary Indexes:**
1. `idx_reviews_entity_lookup` - `(entity_type, entity_id, created_at DESC)` WHERE `status = 'active'`
   - Partial index for active reviews only (most queries only care about active)
   - For fetching reviews for a specific entity
2. `idx_reviews_user_id` - `(user_id, created_at DESC)` WHERE `user_id IS NOT NULL`
   - Partial index for authenticated user lookups
3. `idx_reviews_anon_id` - `(anon_id, created_at DESC)` WHERE `anon_id IS NOT NULL`
   - Partial index for anonymous user lookups
4. `idx_reviews_status_created` - `(status, created_at DESC)`
   - For admin queries filtering by status

**Additional Indexes:**
5. `idx_reviews_rating` - `(rating)` WHERE `rating IS NOT NULL` - For rating-based queries
6. `idx_reviews_created_at` - `(created_at DESC)` - For chronological queries

## Implementation Steps

### Step 1: Create Migration File
- Create new migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_reviews_system.sql`
- Include all table, view, and index definitions
- Include enum type for review_status if needed (or use TEXT with CHECK)

### Step 2: Review Table Creation
- Create `reviews` table with all fields and constraints
- Add triggers for `updated_at` timestamp
- Add RLS policies (if needed for security)

### Step 3: Views Creation
- Create `latest_reviews_per_identity` view
- Create `entity_review_stats` view
- Test view performance with EXPLAIN ANALYZE

### Step 4: Trigger Functions for Rating Updates
- Create function `update_coffee_ratings()` - Updates coffees.rating_avg and coffees.rating_count
- Create function `update_roaster_ratings()` - Updates roasters.avg_rating, total_ratings_count, recommend_percentage, ratings_updated_at
- Create unified function `update_entity_ratings()` that routes to appropriate function based on entity_type
- Add triggers: AFTER INSERT, AFTER UPDATE (on status/rating/recommend), potentially AFTER DELETE

### Step 5: Indexes Creation
- Create all performance indexes
- Verify index usage with query plans
- Ensure indexes support trigger function queries

### Step 6: Helper Functions (Optional)
- Function to validate entity_type/entity_id combination
- Function to compute stats incrementally (if needed for performance)
- **Note:** identity_key is computed in views, no helper function needed

### Step 7: RLS Policies (Read-Only)
- **Read policies:** Public can read active reviews
- **Write policies:** NONE - All writes go through server actions using service role (bypasses RLS)
- **Why?** Supabase clients don't reliably set custom session variables from browser
- **Server-side enforcement:** Server actions validate identity before writes

### Step 8: Client-Side Identity Management
- Create `src/lib/reviews/anon-id.ts` helper:
  - Generate UUID on first interaction using `crypto.randomUUID()` or `uuid` library
  - Store in localStorage with key `icb_anon_id`
  - Set cookie `icb_anon_id` with 1 year expiry (same value)
  - Read from localStorage first; fallback to cookie if localStorage unavailable
  - Expose `getAnonId()` function that returns UUID string
  - Expose `ensureAnonId()` function that generates if missing
  - Handle SSR: return null on server, generate on client

### Step 9: TypeScript Types
- Update `src/types/supabase-types.ts` with new table/view types (after migration)
- Create review-specific types in `src/types/review-types.ts`
- Add review enums to `src/types/db-enums.ts`:
  - `ReviewEntityTypeEnum` = 'coffee' | 'roaster'
  - `ReviewStatusEnum` = 'active' | 'deleted' | 'flagged'

## Overlaps with Existing Tables

### Existing Rating Fields

The review system needs to automatically update existing rating fields in the `coffees` and `roasters` tables:

#### Coffees Table Fields (to be updated):
- `rating_avg` (number | null) - Average rating from reviews
- `rating_count` (number) - Total count of active reviews (NOT nullable, defaults to 0)

#### Roasters Table Fields (to be updated):
- `avg_rating` (number | null) - Average overall rating from reviews
- `total_ratings_count` (number | null) - Total count of active reviews
- `recommend_percentage` (number | null) - Percentage of reviews that recommend (0-100)
- `ratings_updated_at` (string | null) - Timestamp when ratings were last updated

**Note:** The roasters table also has additional rating fields that are NOT part of the basic review system:
- `avg_customer_support` (number | null)
- `avg_delivery_experience` (number | null)
- `avg_packaging` (number | null)
- `avg_value_for_money` (number | null)

These additional fields may require a more complex review structure in the future (e.g., multi-dimensional ratings), but are **NOT** part of the initial implementation.

### Trigger Functions Required

We need database triggers that automatically update the coffees and roasters tables whenever reviews are inserted, updated, or deleted (soft delete via status change).

#### Trigger Strategy:
1. **After INSERT on reviews** - Recalculate stats for the affected entity
   - All reviews (new and edits) are INSERTs, so this handles everything
2. **After UPDATE on reviews** - Recalculate stats if status changed (soft delete)
   - Only needed for soft deletes (status = 'deleted')
   - Rating/recommend changes don't happen via UPDATE (edits are new INSERTs)
3. **After DELETE on reviews** - Recalculate stats (though we use soft delete, so this may not be needed)

#### Trigger Function Logic:
- Query `latest_reviews_per_identity` view filtered by entity_type and entity_id
- Calculate: `review_count`, `avg_rating`, `recommend_pct`
- Update the appropriate table (coffees or roasters) with calculated values
- Set `ratings_updated_at` to NOW() for roasters

#### Performance Considerations:
- Triggers run synchronously, so they must be fast
- Use the `latest_reviews_per_identity` view for efficient aggregation
- Consider batching updates if multiple reviews are inserted at once
- Add indexes to support the trigger queries

## Design Decisions

### Identity Key Format (View-Only, Not Stored)
- **Format:** `user:<uuid>` or `anon:<anon_id>`
- **Computed in view:** `COALESCE('user:' || user_id::text, 'anon:' || anon_id::text)`
- **NOT stored in table:** identity_key is a derived column in views only
- **Rationale:** 
  - Prevents mismatches between user_id/anon_id and identity_key
  - Single computed value for both user types simplifies queries
  - Easy to parse and filter by user type

### Anonymous ID Generation
- **Method:** Generate UUID in client on first interaction (NOT IP-based)
- **Storage:** Store in localStorage AND cookie (1 year expiry, NOT httpOnly)
- **Read Strategy:** Always read from localStorage first; fallback to cookie
- **Why not httpOnly cookie?** Client needs to read anon_id to send to server actions. httpOnly blocks JS access.
- **Why not IP-based?** 
  - GDPR/DPDP: hashed IP is still personal data
  - Mobile networks rotate IPs → duplicate identities
  - VPNs/CGNAT → multiple users collapse into one
  - SSR + proxies → wrong IP unless carefully handled
  - Impossible to "edit your own review" reliably
- **Use IP only for rate limiting, never identity**

### Soft Delete Strategy
- **Status field:** Primary mechanism (`status = 'deleted'`)
- **No deleted_at field:** Use `updated_at` for audit trail (simpler)
- **Views:** Filter out deleted reviews automatically (`WHERE status = 'active'`)
- **Rationale:** Allows recovery and audit trail while hiding from public views

### Multiple Reviews Per Identity (Immutable History)
- **Allowed:** Yes, users can submit multiple reviews over time
- **Display:** Only latest active review per entity is shown in stats (via `latest_reviews_per_identity` view)
- **Edit Behavior:** Editing a review creates a NEW review row (immutable history)
  - Each edit is a new INSERT with new `created_at` timestamp
  - View automatically picks latest by `created_at DESC`
  - Previous reviews remain in database for audit/history
- **Use Case:** Users can update their review by submitting a new one; history is preserved

### Polymorphic Entity Design
- **No Foreign Keys:** Entity references are validated at application level
- **Rationale:** 
  - Simpler schema (no complex FK constraints)
  - More flexible for future entity types
  - Application-level validation is acceptable

### Edit/Delete Behavior (Immutable History)
- **Editing Rule (MUST FOLLOW):**
  > **Editing a review creates a NEW review row (immutable history).**
  
  - All edits are INSERT operations (never UPDATE existing reviews)
  - New review gets new `id`, new `created_at` timestamp
  - `latest_reviews_per_identity` view automatically picks latest by `created_at DESC`
  - Previous reviews remain in database (preserves history)
  - Identity validation: `user_id` must match `auth.uid()` OR `anon_id` must match client value
  
- **Delete:**
  - Soft delete: set `status = 'deleted'` on latest active review
  - Stats & views exclude deleted reviews
  - No hard deletes for users (admin only if needed)
  
- **Why immutable history:**
  - True "multiple reviews allowed" - each edit is a new review
  - Preserves audit trail of how reviews changed over time
  - Simpler logic: no need to find and update existing rows
  - View handles "latest wins" automatically

### Anti-Spam Strategy
- **Don't use:** Unique index per hour (blocks legitimate edits, creates weird collisions)
- **Client-side:**
  - Disable buttons after click
  - Debounce saves (500-800ms)
- **Server-side:**
  - RLS policies enforce identity matching
  - Simple rate limit function (optional)
  - Validation: reject comments with links / too short / too long
  - Optional: Allow only 1 comment per entity per identity per day (but let recommend/rating update)
- **DB-only minimal guard (optional):**
  - Allow multiple reviews
  - Prevent comment spam by checking `created_at` window in insert trigger (only for comment length > 0)

### UI Capture Strategy (Progressive Disclosure)
**Stage 1 (always visible):**
- 👍 / 👎 recommend (instant save)

**Stage 2 (auto-expand after click):**
- ⭐ rating (optional)
- comment (optional, collapsed)

**Stage 3 (explicit "Add more details"):**
- value_for_money 👍/👎
- coffee-only:
  - works_with_milk (3-state via radio: unknown / milk ok / better black)
  - brew_method dropdown

**Post-submit micro question (optional, v2):**
- first / occasional / repeat
- Store in `usage_frequency` nullable enum OR separate `review_meta` table later
- **Skip in v1**

### API Behavior
- **Architecture:** All writes go through Next.js server actions (NOT direct Supabase client)
- **Server Actions:**
  - Use service role client (bypasses RLS)
  - Validate identity server-side:
    - For anon: `anon_id` must match value sent from client (cookie/localStorage)
    - For logged-in: `user_id` must match `auth.uid()`
  - **All writes are INSERTs:** Both new reviews and edits create new review rows
- **Client-side:**
  - Send `anon_id` from localStorage/cookie to server action
  - Debounce: 500-800ms debounce on writes
  - Optimistic UI: Update local state immediately, show "Saving…" then "Saved"
  - UI treats "edit" as "create new review" - no distinction needed
- **Why server actions?** 
  - Supabase clients can't reliably set session variables for RLS
  - Server-side validation is more secure and reliable
  - Prevents "Why can't I edit my review?" issues
- **Why immutable history (INSERT-only)?**
  - Simpler API: one operation (`createReview`) handles both new and edited reviews
  - No need to find existing review to update
  - View automatically shows latest

## Performance Considerations

### View Materialization
- **Initial:** Use regular views (computed on query)
- **Future:** Consider materialized views if performance degrades
- **Refresh Strategy:** If materialized, refresh on review insert/update

### Index Strategy
- **Composite Indexes:** Optimize for common query patterns
- **Partial Indexes:** Use WHERE clauses for filtered indexes (e.g., active reviews only)
- **Covering Indexes:** Include frequently selected columns in indexes

### Query Patterns to Optimize
1. Get all reviews for a coffee/roaster (entity_type, entity_id)
2. Get latest review per identity for an entity
3. Get review stats for an entity
4. Get all reviews by a user (identity_key)
5. Admin queries filtering by status

## Security Considerations

### RLS Policies (Read-Only)
- **Public Read:** Allow reading active reviews only
- **Writes:** NO RLS policies for INSERT/UPDATE - All writes go through server actions
- **Why?** Supabase clients don't reliably set custom session variables (`current_setting('app.anon_id')`) from browser
  - Attempting to use `current_setting('app.anon_id')` in RLS will fail when users try to edit reviews
  - Browser clients cannot reliably set session variables that RLS can read
  - This causes "Why can't I edit my anon review?" issues at 1am

### Server-Side Enforcement (Recommended Approach)
- **Server actions use service role client** (bypasses RLS)
- **Server validates identity before writes:**
  - For anonymous: `anon_id` must match value sent from client (cookie/localStorage)
  - For logged-in: `user_id` must match `auth.uid()` from session
- **Benefits:**
  - More reliable than RLS with session variables
  - Server-side validation is more secure (can't be bypassed by client)
  - Prevents identity matching failures
  - Clean separation: RLS for reads, server actions for writes

### Data Privacy
- **No IP Storage:** Never derive identity from IP addresses
- **Anon ID:** UUID generated client-side, stored in localStorage + cookie
- **IP Usage:** Use IP only for rate limiting, never for identity
- **User Data:** Respect user privacy settings if implemented

## Testing Checklist

- [ ] Create review as authenticated user
- [ ] Create review as anonymous user
- [ ] Create multiple reviews for same entity (same identity)
- [ ] Verify latest_reviews_per_identity shows only latest
- [ ] Verify entity_review_stats calculates correctly
- [ ] Test soft delete (status update)
- [ ] Test index performance with EXPLAIN ANALYZE
- [ ] Test view performance with large datasets
- [ ] Verify RLS policies work correctly
- [ ] Test edge cases (no reviews, single review, all same rating)
- [ ] Verify triggers update coffees.rating_avg and coffees.rating_count correctly
- [ ] Verify triggers update roasters.avg_rating, total_ratings_count, recommend_percentage correctly
- [ ] Test trigger performance with bulk inserts
- [ ] Verify ratings_updated_at is set correctly on roasters

## Migration File Structure

```sql
-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE review_entity_type AS ENUM ('coffee', 'roaster');
CREATE TYPE review_status AS ENUM ('active', 'deleted', 'flagged');

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================

CREATE TABLE public.reviews (
  -- Core fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type review_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  
  -- User references (at least one must be NOT NULL - enforced by CHECK constraint)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id UUID,
  CONSTRAINT reviews_identity_required CHECK (user_id IS NOT NULL OR anon_id IS NOT NULL),
  
  -- Review content
  recommend BOOLEAN,
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  value_for_money BOOLEAN,
  works_with_milk BOOLEAN, -- null = unknown, true = works with milk, false = better black
  brew_method grind_enum, -- Uses existing grind_enum
  comment TEXT,
  
  -- Status and timestamps
  status review_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Partial index for active reviews (most queries only care about active)
CREATE INDEX idx_reviews_entity_lookup_active ON public.reviews(entity_type, entity_id, created_at DESC) 
  WHERE status = 'active';
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_reviews_anon_id ON public.reviews(anon_id, created_at DESC) WHERE anon_id IS NOT NULL;
CREATE INDEX idx_reviews_status_created ON public.reviews(status, created_at DESC);
CREATE INDEX idx_reviews_rating ON public.reviews(rating) WHERE rating IS NOT NULL;
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Latest review per identity (this is the public truth)
CREATE VIEW latest_reviews_per_identity AS
SELECT DISTINCT ON (
  entity_type, 
  entity_id, 
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text)
)
  *,
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text) AS identity_key
FROM public.reviews
WHERE status = 'active'
ORDER BY 
  entity_type, 
  entity_id, 
  COALESCE('user:' || user_id::text, 'anon:' || anon_id::text),
  created_at DESC;

-- Entity review stats (aggregated from latest reviews)
CREATE VIEW entity_review_stats AS
SELECT 
  entity_type,
  entity_id,
  COUNT(*) as review_count,  -- Total latest reviews (includes reviews without ratings)
  COUNT(rating) as rating_count,  -- Count of reviews with non-NULL ratings
  ROUND(AVG(rating)::numeric, 2) as avg_rating,  -- Ignores NULLs automatically
  ROUND(
    (COUNT(*) FILTER (WHERE recommend = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 
    2
  ) as recommend_pct,
  MAX(created_at) as last_review_at,
  NOW() as updated_at
FROM latest_reviews_per_identity
GROUP BY entity_type, entity_id;

-- ============================================================================
-- TRIGGER FUNCTIONS FOR RATING UPDATES
-- ============================================================================

-- Helper functions for entity-specific updates (used by main trigger)
CREATE OR REPLACE FUNCTION update_coffee_ratings_for_entity(p_entity_id UUID)
RETURNS VOID AS $$
DECLARE
  v_review_count INTEGER;
  v_avg_rating NUMERIC;
BEGIN
  SELECT 
    COUNT(*)::INTEGER,
    ROUND(AVG(rating)::numeric, 2)
  INTO v_review_count, v_avg_rating
  FROM latest_reviews_per_identity
  WHERE entity_type = 'coffee' AND entity_id = p_entity_id;
  
  UPDATE coffees
  SET 
    rating_avg = v_avg_rating,
    rating_count = COALESCE(v_review_count, 0)
  WHERE id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_roaster_ratings_for_entity(p_entity_id UUID)
RETURNS VOID AS $$
DECLARE
  v_review_count INTEGER;
  v_avg_rating NUMERIC;
  v_recommend_pct NUMERIC;
BEGIN
  SELECT 
    COUNT(*)::INTEGER,
    ROUND(AVG(rating)::numeric, 2),
    ROUND(
      (COUNT(*) FILTER (WHERE recommend = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 
      2
    )
  INTO v_review_count, v_avg_rating, v_recommend_pct
  FROM latest_reviews_per_identity
  WHERE entity_type = 'roaster' AND entity_id = p_entity_id;
  
  UPDATE roasters
  SET 
    avg_rating = v_avg_rating,
    total_ratings_count = v_review_count,
    recommend_percentage = v_recommend_pct,
    ratings_updated_at = NOW()
  WHERE id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update coffee ratings (wrapper for trigger)
CREATE OR REPLACE FUNCTION update_coffee_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_entity_id UUID;
BEGIN
  -- Get entity_id from NEW or OLD
  v_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  
  -- Only process if entity_type is 'coffee'
  IF COALESCE(NEW.entity_type, OLD.entity_type) = 'coffee' THEN
    PERFORM update_coffee_ratings_for_entity(v_entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update roaster ratings (wrapper for trigger)
CREATE OR REPLACE FUNCTION update_roaster_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_entity_id UUID;
BEGIN
  -- Get entity_id from NEW or OLD
  v_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  
  -- Only process if entity_type is 'roaster'
  IF COALESCE(NEW.entity_type, OLD.entity_type) = 'roaster' THEN
    PERFORM update_roaster_ratings_for_entity(v_entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Unified function that routes to appropriate handler
-- Handles INSERT (new reviews and edits) and UPDATE (soft delete only)
-- Note: Edits create new INSERTs, so UPDATE only fires for status changes (soft delete)
CREATE OR REPLACE FUNCTION update_entity_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_old_entity_id UUID;
  v_new_entity_id UUID;
  v_entity_type TEXT;
BEGIN
  -- Get entity IDs
  v_old_entity_id := OLD.entity_id;
  v_new_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);
  v_entity_type := COALESCE(NEW.entity_type, OLD.entity_type);
  
  -- For UPDATE: only recalc if status changed (soft delete)
  -- Rating/recommend changes don't happen via UPDATE (edits are new INSERTs)
  IF TG_OP = 'UPDATE' THEN
    -- Early exit: if status didn't change, skip (trigger WHEN clause should prevent this, but be safe)
    IF OLD.status = NEW.status THEN
      RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- If status changed but review was not active before and still not active, skip
    IF OLD.status != 'active' AND NEW.status != 'active' THEN
      RETURN COALESCE(NEW, OLD);
    END IF;
  END IF;
  
  -- Handle entity_id changes: recalc both OLD and NEW entity
  IF TG_OP = 'UPDATE' AND OLD.entity_id IS DISTINCT FROM NEW.entity_id THEN
    -- Recalc OLD entity (review was removed from it)
    IF v_entity_type = 'coffee' THEN
      PERFORM update_coffee_ratings_for_entity(v_old_entity_id);
    ELSIF v_entity_type = 'roaster' THEN
      PERFORM update_roaster_ratings_for_entity(v_old_entity_id);
    END IF;
    
    -- Recalc NEW entity (review was added to it)
    IF v_entity_type = 'coffee' THEN
      PERFORM update_coffee_ratings_for_entity(v_new_entity_id);
    ELSIF v_entity_type = 'roaster' THEN
      PERFORM update_roaster_ratings_for_entity(v_new_entity_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Normal case: recalc single entity
  IF v_entity_type = 'coffee' THEN
    PERFORM update_coffee_ratings();
  ELSIF v_entity_type = 'roaster' THEN
    PERFORM update_roaster_ratings();
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES (READ-ONLY)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read: Anyone can read active reviews
CREATE POLICY "Public can read active reviews"
  ON public.reviews FOR SELECT
  USING (status = 'active');

-- NOTE: NO INSERT/UPDATE RLS POLICIES
-- All writes go through server actions using service role client (bypasses RLS)
-- 
-- Why? Supabase clients don't reliably set custom session variables from browser.
-- Attempting to use current_setting('app.anon_id') in RLS will fail at 1am when
-- users try to edit their reviews.
--
-- Server-side enforcement (in Next.js server actions):
-- 1. Server receives anon_id from cookie/localStorage (sent by client)
-- 2. Server uses service role client (bypasses RLS)
-- 3. Server validates: anon_id matches value sent from client
-- 4. Server validates: user_id matches auth.uid() if logged in
-- 5. Server performs INSERT/UPDATE only if identity matches
--
-- This is clean, realistic, and prevents identity matching failures.

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for updated_at timestamp
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Triggers to update entity ratings
CREATE TRIGGER trigger_update_ratings_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_entity_ratings();

CREATE TRIGGER trigger_update_ratings_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_entity_ratings();
  -- Note: Only fires on status changes (soft delete)
  -- Rating/recommend changes don't happen via UPDATE (edits are new INSERTs)

-- Note: Soft delete handled by status change, so DELETE trigger not needed
-- If hard deletes are ever needed, add:
-- CREATE TRIGGER trigger_update_ratings_on_delete
--   AFTER DELETE ON public.reviews
--   FOR EACH ROW
--   EXECUTE FUNCTION update_entity_ratings();

-- ============================================================================
-- RLS POLICIES (READ-ONLY)
-- ============================================================================
-- See RLS section above - only SELECT policy, no INSERT/UPDATE policies
-- All writes go through server actions using service role client
```

## Next Steps After Implementation

1. **TypeScript Integration**
   - Generate types from Supabase
   - Create review hooks (useReviews, useReviewStats)
   - Create review components

2. **API Integration (Server Actions Only)**
   - Create server actions in `src/app/actions/reviews.ts`:
     - `createReview()` - INSERT new review (handles both new reviews and edits)
       - Uses service role client (bypasses RLS)
       - Validates: anon_id matches value sent from client OR user_id matches auth.uid()
       - Sets user_id/anon_id based on authentication state
       - Always creates new row (immutable history)
       - View automatically picks latest by `created_at DESC`
     - `deleteReview()` - Soft delete latest active review (status = 'deleted')
       - Uses service role client (bypasses RLS)
       - Finds latest active review for identity+entity
       - Validates identity before soft delete
       - Sets `status = 'deleted'` on the review
   - Client-side: Implement debouncing (500-800ms) in hooks
   - Client-side: Send anon_id from localStorage/cookie to server actions
   - **NO direct Supabase client writes from browser**
   - **NO updateReview() function needed** - edits are just new `createReview()` calls

3. **UI Components**
   - Progressive disclosure review form:
     - Stage 1: Recommend 👍/👎 (always visible, instant save)
     - Stage 2: Rating ⭐ + comment (auto-expand after recommend)
     - Stage 3: value_for_money, works_with_milk, brew_method (explicit expand)
   - Review list component (show latest reviews)
   - Review stats display component (use entity_review_stats view)
   - Optimistic UI with "Saving…" / "Saved" indicators

4. **Analytics**
   - Track review submissions
   - Monitor review quality
   - Analyze rating distributions

