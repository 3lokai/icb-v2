# Posts Table & Auto-Sync Implementation Guide

**Goal:** Create a minimal posts table that auto-syncs with Velite articles and maintains data integrity for comments and interactions.

**Timeline:** 1-2 hours implementation  
**Approach:** Minimal schema + build-time sync + Supabase functions for automation

---

## Phase 1: Database Schema (30 minutes)

### Minimal Posts Table
```sql
-- Core posts table - only essentials for comments & analytics
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  published_at timestamp with time zone NOT NULL,
  
  -- Auto-updated engagement stats
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  bookmark_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Essential indexes only
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published_at);

-- Auto-update timestamp
CREATE TRIGGER posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE FUNCTION updated_at_trigger();
```

### Updated Interactions Table
```sql
-- Single interactions table (likes, bookmarks, views)
CREATE TABLE article_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'bookmark', 'view')),
  
  -- For anonymous views
  ip_address inet,
  user_agent text,
  
  created_at timestamp with time zone DEFAULT now(),
  
  -- Prevent duplicate likes/bookmarks per user
  UNIQUE(post_id, user_id, interaction_type)
);

-- Performance indexes
CREATE INDEX idx_interactions_post_type ON article_interactions(post_id, interaction_type);
CREATE INDEX idx_interactions_user_type ON article_interactions(user_id, interaction_type);

-- RLS Policy
ALTER TABLE article_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their interactions" ON article_interactions
  FOR ALL USING (
    auth.uid() = user_id OR interaction_type = 'view'
  );

CREATE POLICY "Anyone can create views" ON article_interactions
  FOR INSERT WITH CHECK (interaction_type = 'view');
```

### Updated Comments Table
```sql
-- Comments table referencing posts
CREATE TABLE article_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES article_comments(id) ON DELETE CASCADE,
  
  content text NOT NULL,
  mentions jsonb DEFAULT '[]'::jsonb, -- [{"type": "user", "id": "uuid", "display": "John"}]
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Moderation fields
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  flag_reason text
);

-- Indexes
CREATE INDEX idx_comments_post_id ON article_comments(post_id);
CREATE INDEX idx_comments_parent_id ON article_comments(parent_id);
CREATE INDEX idx_comments_user_id ON article_comments(user_id);
CREATE INDEX idx_comments_mentions_gin ON article_comments USING GIN (mentions);

-- RLS Policies
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON article_comments
  FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Users can create comments" ON article_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON article_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER comments_updated_at 
  BEFORE UPDATE ON article_comments 
  FOR EACH ROW EXECUTE FUNCTION updated_at_trigger();
```

### Comment Likes Table
```sql
-- Simple comment likes
CREATE TABLE comment_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid REFERENCES article_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment_user ON comment_likes(comment_id, user_id);

-- RLS Policy
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their comment likes" ON comment_likes
  FOR ALL USING (auth.uid() = user_id);
```

---

## Phase 2: Supabase Automation Functions (45 minutes)

### Auto-Update Post Stats Function
```sql
-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_post_id uuid;
BEGIN
  -- Handle interactions table changes
  IF TG_TABLE_NAME = 'article_interactions' THEN
    target_post_id := COALESCE(NEW.post_id, OLD.post_id);
    
    UPDATE posts 
    SET 
      view_count = (
        SELECT COUNT(*) 
        FROM article_interactions 
        WHERE post_id = target_post_id AND interaction_type = 'view'
      ),
      like_count = (
        SELECT COUNT(*) 
        FROM article_interactions 
        WHERE post_id = target_post_id AND interaction_type = 'like'
      ),
      bookmark_count = (
        SELECT COUNT(*) 
        FROM article_interactions 
        WHERE post_id = target_post_id AND interaction_type = 'bookmark'
      ),
      updated_at = now()
    WHERE id = target_post_id;
    
  -- Handle comments table changes
  ELSIF TG_TABLE_NAME = 'article_comments' THEN
    target_post_id := COALESCE(NEW.post_id, OLD.post_id);
    
    UPDATE posts 
    SET 
      comment_count = (
        SELECT COUNT(*) 
        FROM article_comments 
        WHERE post_id = target_post_id AND NOT is_deleted
      ),
      updated_at = now()
    WHERE id = target_post_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update stats
CREATE TRIGGER update_post_stats_interactions 
  AFTER INSERT OR DELETE OR UPDATE ON article_interactions 
  FOR EACH ROW EXECUTE FUNCTION update_post_stats();

CREATE TRIGGER update_post_stats_comments 
  AFTER INSERT OR DELETE OR UPDATE ON article_comments 
  FOR EACH ROW EXECUTE FUNCTION update_post_stats();
```

### Post Sync Upsert Function
```sql
-- Function to sync posts from Velite (called during build)
CREATE OR REPLACE FUNCTION upsert_post(
  p_slug text,
  p_title text,
  p_category text,
  p_published_at timestamptz
)
RETURNS uuid AS $$
DECLARE
  post_id uuid;
BEGIN
  INSERT INTO posts (slug, title, category, published_at)
  VALUES (p_slug, p_title, p_category, p_published_at)
  ON CONFLICT (slug) 
  DO UPDATE SET 
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    published_at = EXCLUDED.published_at,
    updated_at = now()
  RETURNING id INTO post_id;
  
  RETURN post_id;
END;
$$ LANGUAGE plpgsql;
```

### Helper Functions for Server Actions
```sql
-- Get post by slug (for server actions)
CREATE OR REPLACE FUNCTION get_post_by_slug(p_slug text)
RETURNS TABLE(
  id uuid,
  slug text,
  title text,
  category text,
  view_count integer,
  like_count integer,
  comment_count integer,
  bookmark_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.slug, p.title, p.category, p.view_count, p.like_count, p.comment_count, p.bookmark_count
  FROM posts p
  WHERE p.slug = p_slug;
END;
$$ LANGUAGE plpgsql;

-- Bulk get posts (for article cards)
CREATE OR REPLACE FUNCTION get_posts_by_slugs(p_slugs text[])
RETURNS TABLE(
  id uuid,
  slug text,
  title text,
  category text,
  view_count integer,
  like_count integer,
  comment_count integer,
  bookmark_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.slug, p.title, p.category, p.view_count, p.like_count, p.comment_count, p.bookmark_count
  FROM posts p
  WHERE p.slug = ANY(p_slugs);
END;
$$ LANGUAGE plpgsql;
```

---

## Phase 3: Velite Integration (30 minutes)

### Update Velite Config
**File:** `/velite.config.ts` (ENHANCE EXISTING)

Add sync functionality to your existing config:

```typescript
import { createClient } from '@supabase/supabase-js'

// Supabase client for build-time sync
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for write access
)

// Sync function
async function syncPostToSupabase(article: any) {
  try {
    const { data, error } = await supabase.rpc('upsert_post', {
      p_slug: article.slug,
      p_title: article.title,
      p_category: article.category,
      p_published_at: article.date
    })
    
    if (error) {
      console.error(`Failed to sync post ${article.slug}:`, error)
    } else {
      console.log(`✅ Synced post: ${article.slug}`)
    }
  } catch (err) {
    console.error(`Error syncing post ${article.slug}:`, err)
  }
}

// Add to your existing velite config
export default defineConfig({
  // ... your existing config ...
  
  collections: {
    articles: {
      // ... your existing schema ...
      schema: s
        .object({
          // ... your existing fields ...
        })
        .transform(async (data) => {
          // Sync to Supabase during production builds
          if (process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            await syncPostToSupabase(data)
          }
          
          return {
            ...data,
            url: `/learn/${data.slug}`,
            readingTime: Math.round((data.metadata.wordCount / 265) * 2) / 2
          }
        })
    }
  },
  
  // Sync all articles after processing
  prepare: async ({ articles }) => {
    const now = new Date()
    
    // Filter articles (existing logic)
    if (process.env.NODE_ENV === 'production') {
      articles.splice(0, articles.length, ...articles.filter(article => 
        !article.draft && new Date(article.date) <= now
      ))
    }
    
    // Bulk sync to Supabase
    if (process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log(`🔄 Syncing ${articles.length} articles to Supabase...`)
      await Promise.all(articles.map(syncPostToSupabase))
      console.log('✅ All articles synced to Supabase')
    }
  }
})
```

### Environment Variables
**File:** `.env.local` (ADD TO EXISTING)

```bash
# Add these to your existing .env.local
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**File:** `.env.example` (UPDATE EXISTING)

```bash
# Add to existing .env.example
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Deployment Environment Variables

**Vercel/Netlify Dashboard:**
- Add `SUPABASE_SERVICE_ROLE_KEY` to your deployment environment variables
- This enables build-time sync in production

---

## Phase 4: Server Actions Integration (30 minutes)

### Update Article Interactions
**File:** `/src/app/actions/article-interactions.ts` (NEW)

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get post by slug (with caching)
async function getPostBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_post_by_slug', {
    p_slug: slug
  })
  
  if (error || !data?.[0]) {
    throw new Error(`Post not found: ${slug}`)
  }
  
  return data[0]
}

export async function toggleInteraction(slug: string, type: 'like' | 'bookmark') {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect(`/auth/signin?redirect=/learn/${slug}`)
  }

  // Get post ID
  const post = await getPostBySlug(slug)
  
  // Check if interaction exists
  const { data: existing } = await supabase
    .from('article_interactions')
    .select('id')
    .eq('post_id', post.id)
    .eq('user_id', user.id)
    .eq('interaction_type', type)
    .single()

  if (existing) {
    // Remove interaction
    await supabase
      .from('article_interactions')
      .delete()
      .eq('id', existing.id)
  } else {
    // Add interaction
    await supabase
      .from('article_interactions')
      .insert({
        post_id: post.id,
        user_id: user.id,
        interaction_type: type
      })
  }

  revalidatePath(`/learn/${slug}`)
  return { success: true, action: existing ? 'removed' : 'added' }
}

export async function trackView(slug: string, ipAddress?: string, userAgent?: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const post = await getPostBySlug(slug)

  // Track view (anonymous allowed)
  await supabase
    .from('article_interactions')
    .insert({
      post_id: post.id,
      user_id: user?.id || null,
      interaction_type: 'view',
      ip_address: ipAddress || null,
      user_agent: userAgent || null
    })

  return { success: true }
}

export async function getArticleStats(slug: string) {
  const post = await getPostBySlug(slug)
  
  return {
    views: post.view_count,
    likes: post.like_count,
    comments: post.comment_count,
    bookmarks: post.bookmark_count
  }
}

export async function getUserInteractions(slugs: string[]) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { likes: [], bookmarks: [] }

  // Get post IDs for slugs
  const { data: posts } = await supabase.rpc('get_posts_by_slugs', {
    p_slugs: slugs
  })
  
  if (!posts?.length) return { likes: [], bookmarks: [] }

  const postIds = posts.map(p => p.id)

  const { data: interactions } = await supabase
    .from('article_interactions')
    .select('post_id, interaction_type')
    .eq('user_id', user.id)
    .in('post_id', postIds)
    .in('interaction_type', ['like', 'bookmark'])

  // Map back to slugs
  const postIdToSlug = new Map(posts.map(p => [p.id, p.slug]))
  
  const likes = interactions
    ?.filter(i => i.interaction_type === 'like')
    .map(i => postIdToSlug.get(i.post_id))
    .filter(Boolean) || []
    
  const bookmarks = interactions
    ?.filter(i => i.interaction_type === 'bookmark')
    .map(i => postIdToSlug.get(i.post_id))
    .filter(Boolean) || []

  return { likes, bookmarks }
}
```

---

## Phase 5: Testing & Validation (15 minutes)

### Manual Testing Checklist

1. **Build-time Sync Test:**
   ```bash
   npm run build
   # Check Supabase dashboard - posts table should be populated
   ```

2. **Add New Article Test:**
   ```bash
   # Add new MDX file
   # Run build
   # Verify new post appears in Supabase
   ```

3. **Interaction Test:**
   ```bash
   # Like/bookmark an article
   # Check posts table - counts should update automatically
   ```

4. **Comment Test:**
   ```bash
   # Add comment to article
   # Check posts table - comment_count should increment
   ```

### Database Validation Queries

```sql
-- Check if posts are syncing
SELECT slug, title, view_count, like_count, comment_count 
FROM posts 
ORDER BY created_at DESC;

-- Check interaction counts match
SELECT 
  p.slug,
  p.like_count as stored_likes,
  COUNT(CASE WHEN ai.interaction_type = 'like' THEN 1 END) as actual_likes
FROM posts p
LEFT JOIN article_interactions ai ON p.id = ai.post_id
GROUP BY p.id, p.slug, p.like_count;

-- Check comment counts match
SELECT 
  p.slug,
  p.comment_count as stored_comments,
  COUNT(ac.id) as actual_comments
FROM posts p
LEFT JOIN article_comments ac ON p.id = ac.post_id AND NOT ac.is_deleted
GROUP BY p.id, p.slug, p.comment_count;
```

---

## Phase 6: Error Handling & Monitoring

### Error Handling in Velite Sync
```typescript
// Enhanced sync function with retry logic
async function syncPostToSupabase(article: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.rpc('upsert_post', {
        p_slug: article.slug,
        p_title: article.title,
        p_category: article.category,
        p_published_at: article.date
      })
      
      if (error) throw error
      
      console.log(`✅ Synced post: ${article.slug}`)
      return
    } catch (err) {
      console.error(`Attempt ${i + 1} failed for ${article.slug}:`, err)
      if (i === retries - 1) {
        console.error(`❌ Failed to sync ${article.slug} after ${retries} attempts`)
        // Don't throw - continue with other articles
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
      }
    }
  }
}
```

### Monitoring & Alerts
```sql
-- Create view for sync monitoring
CREATE VIEW posts_sync_status AS
SELECT 
  COUNT(*) as total_posts,
  COUNT(CASE WHEN created_at > now() - interval '1 day' THEN 1 END) as posts_last_24h,
  MAX(updated_at) as last_update
FROM posts;

-- Function to check for missing posts (run periodically)
CREATE OR REPLACE FUNCTION check_posts_health()
RETURNS TABLE(
  issue_type text,
  count bigint,
  details text
) AS $$
BEGIN
  -- Check for posts with zero engagement that should have some
  RETURN QUERY
  SELECT 
    'posts_with_no_engagement'::text,
    COUNT(*),
    'Posts older than 7 days with zero views'::text
  FROM posts 
  WHERE created_at < now() - interval '7 days' 
    AND view_count = 0;
    
  -- Add more health checks as needed
END;
$$ LANGUAGE plpgsql;
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Service role key added to deployment environment
- [ ] Database functions deployed to production
- [ ] Test build completes without errors
- [ ] Verify posts table is empty (ready for first sync)

### First Deployment
- [ ] Monitor build logs for sync success messages
- [ ] Check Supabase dashboard - posts table populated
- [ ] Test article interactions on live site
- [ ] Verify engagement counts update correctly

### Post-Deployment Monitoring
- [ ] Set up alerts for sync failures
- [ ] Monitor posts table growth
- [ ] Check for orphaned interactions (posts without matching articles)
- [ ] Verify comment functionality works end-to-end

---

## Success Metrics

### Technical Metrics
- **Build-time sync success rate:** >99%
- **Post-interaction data consistency:** 100%
- **Average sync time per post:** <100ms
- **Database query performance:** <50ms for article stats

### Business Metrics
- **Article engagement tracking:** All interactions captured
- **Comment system reliability:** Zero data loss
- **Content-to-database sync:** Real-time accuracy
- **User experience:** No broken references or missing data

---

**Result: A bulletproof foundation for comments and interactions that automatically stays in sync with your content! 🚀**