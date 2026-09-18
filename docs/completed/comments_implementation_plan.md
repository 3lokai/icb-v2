# ICB Comments & Interactions Implementation Plan

**Goal:** Add likes, bookmarks, views, and intelligent comments system to the /learn section

**Timeline:** 2-3 days implementation + testing  
**Approach:** Server actions + optimistic updates + smart @mentions

---

## Updated File Structure Map

Based on your existing architecture, here's exactly where each file goes:

```
/src/app/actions/
├── article-interactions.ts     # NEW: likes, bookmarks, views
├── comment-actions.ts          # NEW: comments CRUD + moderation
└── (existing files...)

/src/components/learn/
├── post/
│   ├── UserInteractions.tsx    # ENHANCE: existing file
│   ├── Comments.tsx            # NEW: full comment system
│   ├── CommentForm.tsx         # NEW: with mention support
│   └── MentionTextarea.tsx     # NEW: smart @mention dropdown
├── mdx/
│   ├── MentionRenderer.tsx     # NEW: render rich @mentions
│   └── (existing MDX components...)
├── ArticleCard.tsx             # ENHANCE: existing file
└── (existing files...)

/src/hooks/
├── useMentionSearch.ts         # NEW: search coffee/roasters
├── useCommentQueries.ts        # NEW: comment data fetching
├── useCommentInteractions.ts   # NEW: like/flag comments
└── (existing hooks...)

/src/types/
├── learn.ts                    # ENHANCE: add comment interfaces
└── (existing types...)

/src/store/zustand/
├── comment-store.ts            # NEW: comment state management
└── (existing stores...)

/src/app/api/search/
└── mentions/
    └── route.ts                # NEW: mention autocomplete API

/src/app/learn/[slug]/
└── page.tsx                    # ENHANCE: existing file

Dependencies to add:
├── bad-words                   # Profanity filtering
├── emoji-picker-react          # Optional: rich emoji support
└── fuse.js                     # Optional: fuzzy search
```

---

## Phase 1: Database Schema (30 minutes)

### Single Interactions Table
```sql
-- Single table for all article interactions
CREATE TABLE article_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  interaction_type text NOT NULL, -- 'like', 'bookmark', 'view'
  created_at timestamp with time zone DEFAULT now(),
  -- For views: store anonymous data
  ip_address inet,
  user_agent text,
  UNIQUE(user_id, article_slug, interaction_type) -- Prevent duplicate likes/bookmarks
);

-- Comments with structured mentions
CREATE TABLE article_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES article_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  -- Structured mentions data
  mentions jsonb DEFAULT '[]'::jsonb, -- [{"type": "user", "id": "uuid", "display": "John Doe"}]
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  flag_reason text
);

-- Comment likes (separate for simplicity)
CREATE TABLE comment_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid REFERENCES article_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(comment_id, user_id)
);
```

### Indexes & Policies
```sql
-- Performance indexes
CREATE INDEX idx_interactions_user_type ON article_interactions(user_id, interaction_type);
CREATE INDEX idx_interactions_slug_type ON article_interactions(article_slug, interaction_type);
CREATE INDEX idx_comments_article_slug ON article_comments(article_slug);
CREATE INDEX idx_comments_parent_id ON article_comments(parent_id);
CREATE INDEX idx_comments_mentions_gin ON article_comments USING GIN (mentions);

-- RLS policies
ALTER TABLE article_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Users manage their own interactions
CREATE POLICY "Users can manage their interactions" ON article_interactions
  FOR ALL USING (auth.uid() = user_id OR interaction_type = 'view');

-- Comments: read public, write own
CREATE POLICY "Anyone can read comments" ON article_comments
  FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Users can create comments" ON article_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON article_comments
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## Phase 2: Server Actions (1 hour)

### File: `/src/app/actions/article-interactions.ts` (NEW)
**Key Functions:**
- `toggleInteraction(slug, type)` - unified like/bookmark/view
- `getArticleStats(slug)` - get counts for display
- `getUserInteractions(slugs)` - batch check user's interactions
- `trackView(slug, metadata)` - anonymous view tracking

### File: `/src/app/actions/comment-actions.ts` (NEW)
**Key Functions:**
- `createComment(slug, content, mentions, parentId?)` - with profanity filter
- `getCommentsForArticle(slug)` - threaded structure
- `toggleCommentLike(commentId)`
- `flagComment(commentId, reason)`

### Profanity Filter Integration (BLOCK Approach)
```bash
npm install bad-words
```

```typescript
import Filter from 'bad-words'
const filter = new Filter()

// In comment creation - BLOCK profanity entirely
if (filter.isProfane(content)) {
  return { 
    success: false, 
    error: "Please keep comments respectful and family-friendly" 
  }
  // Comment is rejected, user must rephrase
}
```

---

## Phase 3: Mention System Components (3-4 hours)

### File: `/src/components/learn/post/MentionTextarea.tsx` (NEW)
**Features:**
- Contextual @mention dropdown
- Real-time search for coffee/roaster names
- Progressive disclosure (OP → @coffee → @roaster)
- Keyboard navigation (up/down/enter/escape)
- Mobile-friendly touch interactions

**Flow:**
1. User types `@` → show context menu
2. If replying: show OP as first option
3. Show `@coffee` and `@roaster` options
4. User selects `@coffee` → show search dropdown
5. As they type: fetch matching coffees from your database
6. Selection inserts structured mention: `@coffee:blue-bottle-espresso`

### File: `/src/components/learn/mdx/MentionRenderer.tsx` (NEW)
**Features:**
- Parse mentions from comment content
- Render rich previews for @coffee and @roaster mentions
- Link to actual product/roaster pages
- Handle broken references gracefully

### File: `/src/hooks/useMentionSearch.ts` (NEW)
**Features:**
- Debounced search for coffee/roaster names
- Cache frequently searched items
- Fuzzy matching for typos
- Return structured data for dropdown

### File: `/src/hooks/useCommentQueries.ts` (NEW)
**Features:**
- TanStack Query integration for comments
- Optimistic updates for comment creation
- Real-time comment subscriptions (optional)
- Error handling and retry logic

### File: `/src/hooks/useCommentInteractions.ts` (NEW)
**Features:**
- Comment liking with optimistic updates
- Comment flagging functionality
- Reply state management
- Draft comment persistence

---

## Phase 4: Updated Components (2 hours)

### File: `/src/components/learn/post/UserInteractions.tsx` (ENHANCE EXISTING)
**Changes:**
- Use single interactions table
- Optimistic updates with useOptimistic
- Better loading states and animations
- Track views automatically on mount

### File: `/src/components/learn/post/Comments.tsx` (NEW)
**Features:**
- Threaded comments (max 2 levels)
- Rich mention rendering
- Reply context (show who you're replying to)
- Comment liking
- Flag/report functionality
- Emoji support (native Unicode)

### File: `/src/components/learn/post/CommentForm.tsx` (NEW)
**Features:**
- MentionTextarea integration
- Character limit with visual feedback
- Draft auto-save to localStorage
- Submit on Ctrl+Enter
- Preview mode toggle
- Profanity filter feedback

### File: `/src/store/zustand/comment-store.ts` (NEW)
**Features:**
- Comment state management
- Draft persistence across sessions
- Reply state tracking
- Optimistic comment updates
- Integration with existing store patterns

---

## Phase 5: Search & Autocomplete APIs (1 hour)

### File: `/src/app/api/search/mentions/route.ts`
**Endpoints:**
- `GET /api/search/mentions?type=coffee&q=ethiopian` → coffee search
- `GET /api/search/mentions?type=roaster&q=blue` → roaster search
- `GET /api/search/mentions?type=user&q=john` → user search (future)

**Features:**
- Fuzzy search with fuse.js
- Limit results to 8-10 items
- Include essential data (id, name, image_url, rating)
- Cache responses for 5 minutes

### Database Queries:
```sql
-- Coffee search
SELECT id, name, slug, image_url, avg_rating, roaster_name 
FROM coffees 
JOIN roasters ON coffees.roaster_id = roasters.id
WHERE coffees.name ILIKE '%search%' 
  AND coffees.is_available = true
ORDER BY avg_rating DESC NULLS LAST
LIMIT 10;

-- Roaster search  
SELECT id, name, slug, logo_url, avg_rating, city, state
FROM roasters 
WHERE name ILIKE '%search%' 
  AND is_active = true
ORDER BY is_verified DESC, avg_rating DESC NULLS LAST
LIMIT 10;
```

---

## Phase 6: Integration Points (1 hour)

### Update Article Cards
**File:** `/src/components/learn/ArticleCard.tsx` (ENHANCE EXISTING)
```typescript
// Show engagement metrics on cards
<div className="flex items-center gap-4 text-sm text-muted-foreground">
  <span>{stats.likes} likes</span>
  <span>{stats.comments} comments</span>
  <span>{stats.views} views</span>
</div>
```

### Update Article Page
**File:** `/src/app/learn/[slug]/page.tsx` (ENHANCE EXISTING)
```typescript
// Fetch article stats and user interactions
const [articleStats, userInteractions, comments] = await Promise.all([
  getArticleStats(slug),
  getUserInteractions([slug]),
  getCommentsForArticle(slug)
])

// Track view (server-side)
await trackView(slug, headers())

// Pass to components
<UserInteractions 
  articleSlug={slug}
  initialStats={articleStats}
  initialInteractions={userInteractions}
/>
<Comments 
  articleSlug={slug}
  initialComments={comments}
  currentUser={user}
/>
```

### Update Learn Types
**File:** `/src/types/learn.ts` (ENHANCE EXISTING)
Add comment interfaces to existing article types:
```typescript
export interface Comment {
  id: string
  content: string
  mentions: Mention[]
  created_at: string
  user_profile: UserProfile
  replies?: Comment[]
}

export interface Mention {
  type: 'user' | 'coffee' | 'roaster'
  id: string
  display: string
  slug?: string
}
```

---

## Phase 7: Advanced Features (Optional, 2-3 hours)

### Emoji Picker Integration
```bash
npm install emoji-picker-react
```

**Implementation:**
- Lazy load emoji picker component
- Insert emojis at cursor position
- Recent emojis persistence
- Coffee-themed custom emoji set

### Notification System
**File:** `/src/app/actions/notification-actions.ts`
- Notify users when mentioned in comments
- Email notifications for comment replies
- In-app notification center (future)

### Analytics Integration
**File:** `/src/lib/analytics/comment-events.ts`
- Track mention usage patterns
- Most mentioned coffees/roasters
- Comment engagement rates
- A/B test comment features

---

## Phase 8: Testing & Polish (1 day)

### Unit Tests
- Mention parsing logic
- Comment threading
- Profanity filter edge cases
- Search result ranking

### Integration Tests
- Full comment flow with mentions
- Like/bookmark optimistic updates
- Error handling and fallbacks
- Mobile responsiveness

### Performance Testing
- Comment loading with large threads
- Mention search responsiveness
- Bundle size impact of emoji picker
- Database query optimization

---

## Technical Considerations

### Bundle Size Management
- Lazy load MentionTextarea (only when user focuses comment box)
- Code split emoji picker
- Optimize mention search queries
- Use React.memo for comment components

### Mobile Experience
- Touch-friendly mention dropdown
- Native emoji keyboard fallback
- Swipe gestures for comment actions
- Responsive threading indentation

### Accessibility
- Keyboard navigation for mentions
- Screen reader support for rich mentions
- Focus management in dropdowns
- Color contrast for comment states

### SEO & Performance
- Comments don't block initial page load
- Mention links are crawlable
- Structured data for comment engagement
- Proper cache headers for mention search

---

## Success Metrics

### Engagement Metrics
- Comment-to-article ratio
- Mention usage frequency
- Like/bookmark conversion rates
- User retention after commenting

### Product Discovery
- Coffee/roaster mentions → click-through rates
- Cross-selling via comment mentions
- Search queries generated from mentions
- New user acquisitions via shared comments

### Quality Metrics
- Flagged comment percentage (target: <2%)
- Average comment length (target: >50 chars)
- Threading engagement (replies per comment)
- Mention accuracy (valid vs broken references)

---

## Launch Checklist

### Pre-Launch
- [ ] Database migrations tested on staging
- [ ] Profanity filter calibrated for coffee community
- [ ] Mention search returns relevant results
- [ ] Comment threading works on mobile
- [ ] Error boundaries handle edge cases

### Launch Day
- [ ] Monitor comment creation rates
- [ ] Watch for spam/abuse patterns
- [ ] Track mention search performance
- [ ] Verify notification delivery
- [ ] Check mobile comment experience

### Post-Launch (Week 1)
- [ ] Gather user feedback on mention UX
- [ ] Optimize slow mention searches
- [ ] Fine-tune profanity filter
- [ ] Plan community moderation guidelines
- [ ] Analyze most mentioned products

---

## Future Enhancements (Post-Launch)

### Community Features
- User reputation system
- Community moderator roles
- Comment badges (Expert, Regular, etc.)
- Best comment highlighting

### Rich Content
- Recipe sharing format in comments
- Image uploads in comments
- Coffee tasting note templates
- Brewing method recommendations

### Advanced Mentions
- `@equipment:v60`, `@recipe:james-hoffmann-v60`
- Auto-suggest based on article content
- Trending mention topics
- Mention analytics dashboard

---

**Ready to ship a comments system that turns casual readers into engaged coffee community members!** ☕️