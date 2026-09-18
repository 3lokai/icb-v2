# 🔐 **AUTHENTICATION SYSTEM PRD**
## IndianCoffeeBeans.com - Phase 1 Implementation (Updated)

**Version:** 2.1  
**Timeline:** 10 days  
**Status:** In Progress (Onboarding Complete)  
**Owner:** CTO + Senior Developer  
**Last Updated:** 2025-12-12

---

## 📊 **EXECUTIVE SUMMARY**

Transform IndianCoffeeBeans from a browsable directory into a personalized coffee discovery platform with full user authentication, profile management, and foundation for future rating attribution.

**Key Outcomes:**
- 🎯 Increase user engagement by 200% through personalization
- ☕ Foundation for authenticated rating system (ratings tables to be added later)
- 📈 Enable future monetization through user-based features
- 🚀 Foundation for community features and premium services

---

## 🎯 **PHASE 1A OBJECTIVES** (Week 1)

### **Core Auth Infrastructure**
- ✅ Supabase Auth setup (Google + Email/Password)
- ⏳ Facebook auth configuration (app review in parallel)
- ✅ Unified auth page with mode switching (`/auth?mode=login|signup`)
- ✅ Next.js 16 proxy.ts for route protection
- ✅ User profile system with preferences
- ✅ Onboarding flow integration (4-step wizard with Zod validation)

### **Database Extensions**
- ✅ Create `user_profiles` table with rich profile data
- ✅ Update `user_role_enum` to include `contributor` and `roaster`
- ✅ User preferences and coffee journey tracking
- ✅ Role-based access control (Admin/Operator/User/Viewer/Contributor/Roaster)
- ✅ Notification preferences setup

---

## 🎯 **PHASE 1B OBJECTIVES** (Week 2)

### **Profile & Preferences**
- ⏳ Profile dashboard with user stats
- ⏳ Coffee preferences management UI (data structure ready)
- ⏳ Notification preferences UI (data structure ready)
- ⏳ Account settings and privacy controls

---

## 🗄️ **DATABASE SCHEMA CHANGES**

### **Migration 1: Update User Role Enum**

```sql
-- Migration: Update user_role_enum to include contributor and roaster
-- File: supabase/migrations/YYYYMMDDHHMMSS_update_user_role_enum.sql

-- Add new roles to existing enum
ALTER TYPE public.user_role_enum ADD VALUE IF NOT EXISTS 'contributor';
ALTER TYPE public.user_role_enum ADD VALUE IF NOT EXISTS 'roaster';

-- Verify enum values: admin, operator, user, viewer, contributor, roaster
```

### **Migration 2: Create User Profiles Table**

```sql
-- Migration: Create user_profiles table and related tables
-- File: supabase/migrations/YYYYMMDDHHMMSS_create_user_profiles.sql

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'enthusiast', 'expert')),
  preferred_brewing_methods TEXT[], -- ['pour-over', 'espresso', 'filter']
  bio TEXT,
  avatar_url TEXT,
  is_public_profile BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  newsletter_subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER ROLES TABLE (Update existing structure)
-- ============================================================================

-- Note: user_roles table already exists, but we need to ensure it references user_profiles
-- If the table doesn't exist yet, create it:
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role_enum NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  new_roasters BOOLEAN DEFAULT true,
  coffee_updates BOOLEAN DEFAULT true,
  newsletter BOOLEAN DEFAULT true,
  platform_updates BOOLEAN DEFAULT true,
  email_frequency TEXT CHECK (email_frequency IN ('immediately', 'daily', 'weekly', 'monthly')) DEFAULT 'weekly',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER COFFEE PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_coffee_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  roast_levels TEXT[], -- ['light', 'medium', 'dark']
  flavor_profiles TEXT[], -- ['fruity', 'nutty', 'chocolatey']
  processing_methods TEXT[], -- ['washed', 'natural', 'honey']
  regions TEXT[], -- ['coorg', 'chikmagalur', 'wayanad']
  with_milk_preference BOOLEAN,
  decaf_only BOOLEAN DEFAULT false,
  organic_only BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RATING MIGRATION TRACKING TABLE
-- ============================================================================

-- This table will be used when rating tables are created later
CREATE TABLE IF NOT EXISTS public.rating_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  coffee_ratings_migrated INTEGER DEFAULT 0,
  roaster_ratings_migrated INTEGER DEFAULT 0,
  migration_date TIMESTAMPTZ DEFAULT NOW(),
  migration_type TEXT CHECK (migration_type IN ('automatic', 'manual_claim')) DEFAULT 'automatic'
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON public.user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coffee_preferences_user_id ON public.user_coffee_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_rating_migrations_user_id ON public.rating_migrations(user_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_notification_preferences_updated_at
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_coffee_preferences_updated_at
  BEFORE UPDATE ON public.user_coffee_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### **Migration 3: Row Level Security (RLS) Policies**

```sql
-- Migration: Add RLS policies for user management tables
-- File: supabase/migrations/YYYYMMDDHHMMSS_add_user_rls_policies.sql

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coffee_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_migrations ENABLE ROW LEVEL SECURITY;

-- Note: user_roles RLS should already be configured, but verify

-- ============================================================================
-- USER_PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view public profiles (if is_public_profile = true)
CREATE POLICY "Users can view public profiles"
  ON public.user_profiles FOR SELECT
  USING (is_public_profile = true);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );

-- ============================================================================
-- USER_NOTIFICATION_PREFERENCES POLICIES
-- ============================================================================

-- Users can view their own notification preferences
CREATE POLICY "Users can view own notification preferences"
  ON public.user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own notification preferences
CREATE POLICY "Users can insert own notification preferences"
  ON public.user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notification preferences
CREATE POLICY "Users can update own notification preferences"
  ON public.user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER_COFFEE_PREFERENCES POLICIES
-- ============================================================================

-- Users can view their own coffee preferences
CREATE POLICY "Users can view own coffee preferences"
  ON public.user_coffee_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own coffee preferences
CREATE POLICY "Users can insert own coffee preferences"
  ON public.user_coffee_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own coffee preferences
CREATE POLICY "Users can update own coffee preferences"
  ON public.user_coffee_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RATING_MIGRATIONS POLICIES
-- ============================================================================

-- Users can view their own rating migrations
CREATE POLICY "Users can view own rating migrations"
  ON public.rating_migrations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rating migrations
CREATE POLICY "Users can insert own rating migrations"
  ON public.rating_migrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all rating migrations
CREATE POLICY "Admins can view all rating migrations"
  ON public.rating_migrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'operator')
    )
  );
```

---

## 🔐 **AUTHENTICATION FLOW**

### **Provider Setup**
```typescript
// Supabase Auth Configuration (already implemented)
// Uses existing AuthProvider and AuthForm components
```

### **Auth Pages Structure**
```
/auth/
└── page.tsx          # ✅ Unified auth page with mode switching
    ?mode=login       # Login mode
    ?mode=signup      # Signup mode

/auth/callback/
└── route.ts          # ✅ OAuth callback handler (COMPLETED)
```

### **Onboarding Flow**
```typescript
// ✅ 4-Step Onboarding Wizard (COMPLETED)
Step 1: Basic Info (Name, City, State, Country, Gender)
  - Full name (required, max 100 chars, Zod validated)
  - City, State, Country (optional)
  - Gender (optional: male, female, non-binary, prefer-not-to-say)
  
Step 2: Coffee Experience (Level + Brewing Methods)
  - Experience level (required: beginner, enthusiast, expert)
  - Preferred brewing methods (optional, multi-select, max 20)
  
Step 3: Coffee Preferences (Optional - Can Skip)
  - Roast levels (max 10), flavor profiles (max 20)
  - Processing methods (max 15), regions (max 20)
  - With milk preference, decaf only, organic only
  
Step 4: Notification Preferences (Optional - Can Skip)
  - Newsletter, new roasters, coffee updates, platform updates
  - Email frequency (immediately, daily, weekly, monthly, never)

Features:
- ✅ Zod validation (client + server-side)
- ✅ Field-level error messages
- ✅ Progress indicator
- ✅ Step-by-step validation
- ✅ Automatic redirect after OAuth signup
- ✅ Success toast notification
- ✅ Route protection
```

---

## 🛡️ **ROUTE PROTECTION (Next.js 16)**

### **Proxy.ts Configuration**

The existing `src/proxy.ts` handles route protection. **Needs update** to include profile routes:

```typescript
// src/proxy.ts (update existing)

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect old auth routes to unified auth page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/auth?mode=login", request.url));
  }
  if (request.nextUrl.pathname === "/signup") {
    return NextResponse.redirect(new URL("/auth?mode=signup", request.url));
  }

  // Protect routes that require authentication
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/auth?mode=login", request.url));
  }

  // Protect profile routes (TO BE ADDED)
  if (request.nextUrl.pathname.startsWith("/profile") && !user) {
    return NextResponse.redirect(
      new URL("/auth?mode=login&from=" + encodeURIComponent(request.nextUrl.pathname), request.url)
    );
  }

  // Redirect authenticated users away from auth pages (but allow callback)
  if (
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      (request.nextUrl.pathname.startsWith("/auth") &&
        !request.nextUrl.pathname.startsWith("/auth/callback"))) &&
    user
  ) {
    // Redirect to original destination or dashboard
    const from = request.nextUrl.searchParams.get("from");
    const redirectTo = from ? decodeURIComponent(from) : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}
```

### **Route Categories**
```typescript
// Route protection handled in proxy.ts
public: [
  '/', '/coffees', '/roasters', '/regions', '/learn',
  '/privacy', '/terms', '/about', '/contact', '/tools'
],

authRequired: [
  '/profile',         // User dashboard
  '/dashboard',       // Main dashboard
  '/settings'         // Account management
],

authOptional: [
  '/api/ratings',     // Allow both authenticated & anonymous (when implemented)
  '/api/reviews'      // Same as above (when implemented)
]
```

---

## 👤 **USER PROFILE SYSTEM**

### **Profile Sidebar Structure**
```typescript
interface ProfileSidebarItems {
  "Your Profile": {
    route: "/profile",
    sections: ["Basic Info", "Coffee Preferences", "Account Settings"]
  },
  "Coffee Preferences": {
    route: "/profile/preferences", 
    sections: ["Roast Preferences", "Flavor Profiles", "Brewing Methods"]
  },
  "Notifications": {
    route: "/profile/notifications",
    sections: ["Email Preferences", "Notification Settings"]
  },
  "Privacy & Data": {
    route: "/profile/privacy",
    sections: ["Privacy Settings", "Data Export", "Delete Account"]
  }
}
```

### **Profile Data Structure**
```typescript
interface UserProfile {
  // Basic Info
  id: string;
  username: string | null;
  fullName: string;
  city?: string;
  state?: string;
  country: string;
  experienceLevel?: 'beginner' | 'enthusiast' | 'expert';
  
  // Coffee Preferences  
  preferredBrewingMethods: string[];
  roastPreferences: string[];
  flavorPreferences: string[];
  
  // Calculated Fields
  joinedDate: Date;
  
  // Privacy Settings
  isPublicProfile: boolean;
  showLocation: boolean;
  
  // Status
  emailVerified: boolean;
  onboardingCompleted: boolean;
}
```

---

## 🔄 **RATING MIGRATION STRATEGY (Future)**

### **Note: Rating tables will be created in a future migration**

When `coffee_ratings` and `roaster_ratings` tables are created, they will include:
- `user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL`
- `is_anonymous BOOLEAN DEFAULT false`
- `display_name TEXT`

The `rating_migrations` table is ready to track migration when ratings are implemented.

---

## 🎨 **UI/UX COMPONENTS TO BUILD**

### **Auth Pages**
- ✅ `AuthForm` - Email + social providers (already exists)
- ✅ `AuthCallback` - OAuth callback handler (COMPLETED)
- ✅ `OnboardingWizard` - 4-step flow with Zod validation (COMPLETED)
- ⏳ `EmailVerificationBanner` - Persistent reminder

### **Profile Components**  
- ⏳ `ProfileSidebar` - Navigation
- ⏳ `ProfileHeader` - User info + stats
- ⏳ `CoffeePreferencesForm` - Preference management
- ⏳ `NotificationSettings` - Preference toggles
- ⏳ `AccountDeletion` - Confirmation flow

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Data Access Layer (DTO Pattern)**

Following Next.js 16 and Supabase best practices, we've implemented a centralized Data Access Layer that ensures:

1. **Security**: Access control is enforced before data is returned
2. **Type Safety**: DTOs ensure only safe data reaches Client Components
3. **Performance**: React `cache()` ensures efficient per-request data fetching
4. **Consistency**: Same data access patterns across the application

**Key Files:**
- `src/data/auth.ts` - `getCurrentUser()` with React `cache()` for request-level memoization
- `src/data/user-dto.ts` - `PublicProfileDTO` and `PrivateProfileDTO` types with access control
- `src/data/user-roles.ts` - Role checking utilities (`hasRole()`, `isAdmin()`, etc.)

**Usage Example:**
```typescript
// Server Component
import { getProfileDTO } from '@/data';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const profile = await getProfileDTO(id);
  
  if (!profile) {
    notFound();
  }
  
  // Safe to pass to Client Component - only public fields
  return <ProfileClient profile={profile} />;
}
```

**Security Features:**
- All files marked with `'server-only'` to prevent client-side execution
- Input validation on all functions
- Access control checks before returning data
- DTOs prevent accidental exposure of sensitive fields

See `src/data/README.md` for complete documentation.

### **Validation & Security**

The onboarding system includes comprehensive validation:

**Zod Validation Schema** (`src/lib/validations/onboarding.ts`):
- Main schema with all onboarding fields
- Step-specific schemas for progressive validation
- Field-level validation rules (length limits, enum values, array limits)
- Type-safe validation with shared types between client and server

**Client-Side Validation**:
- Step-by-step validation before proceeding
- Field-level error messages using `FieldError` component
- Real-time error clearing when users fix issues
- Validates all steps before final submission

**Server-Side Validation**:
- Validates all input with Zod before processing
- Returns field-level errors for better UX
- Prevents invalid data from reaching the database
- Security: Never trusts client input

### **File Structure Changes**
```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx              # ✅ Already exists (unified auth)
│   │   ├── callback/
│   │   │   └── route.ts          # ✅ COMPLETED - OAuth callback handler
│   │   └── onboarding/
│   │       └── page.tsx          # ✅ COMPLETED - Onboarding page
│   ├── profile/
│   │   ├── page.tsx              # ⏳ Main profile page
│   │   ├── preferences/page.tsx  # ⏳ Coffee preferences
│   │   ├── notifications/page.tsx # ⏳ Notification settings
│   │   ├── privacy/page.tsx      # ⏳ Privacy settings
│   │   └── layout.tsx            # ⏳ Profile layout with sidebar
│   └── proxy.ts                   # ✅ COMPLETED - Updated with profile protection
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx          # ✅ Already exists
│   │   └── AuthGuard.tsx         # ⏳ Optional guard component
│   ├── onboarding/
│   │   └── onboarding-wizard.tsx # ✅ COMPLETED - 4-step wizard with validation
│   ├── profile/
│   │   ├── ProfileSidebar.tsx    # ⏳ New component
│   │   ├── ProfileHeader.tsx      # ⏳ New component
│   │   ├── CoffeePreferencesForm.tsx # ⏳ New component
│   │   └── NotificationSettings.tsx # ⏳ New component
│   └── providers/
│       └── AuthProvider.tsx      # ✅ Already exists
├── data/                          # ✅ COMPLETED - Data Access Layer (DTOs)
│   ├── auth.ts                   # ✅ getCurrentUser() with React cache()
│   ├── user-dto.ts               # ✅ Public/Private profile DTOs
│   ├── user-roles.ts             # ✅ Role checking utilities
│   ├── index.ts                  # ✅ Centralized exports
│   └── README.md                 # ✅ Documentation
├── app/
│   └── actions/
│       └── profile.ts            # ✅ COMPLETED - Onboarding data save with Zod validation
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # ✅ Updated with 'server-only' marker
│   │   └── client.ts             # ✅ Already exists
│   ├── validations/
│   │   └── onboarding.ts        # ✅ COMPLETED - Zod validation schemas
│   ├── profile/
│   │   ├── profile-queries.ts    # ⏳ TanStack Query hooks
│   │   └── profile-mutations.ts  # ⏳ Mutation helpers
│   └── auth/
│       └── session-helpers.ts    # ⏳ Session utilities
├── types/
│   ├── auth.ts                   # ⏳ Auth-related types
│   ├── profile.ts                # ⏳ Profile types
│   └── supabase-types.ts         # ✅ Regenerated after migration
└── store/
    └── profile-store.ts          # ⏳ Optional Zustand store
```

### **TypeScript Type Regeneration**

After completing migrations:
```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase-types.ts
```

---

## 📱 **USER EXPERIENCE FLOWS**

### **New User Journey**
```
1. User lands on homepage (public)
2. Browses coffees, likes what they see
3. Clicks "Sign Up" → Redirected to /auth?mode=signup
4. Signs up with Google → /auth/callback ✅
5. Redirected to /auth/onboarding
   - Step 1: Name, city, state
   - Step 2: Experience + brewing methods
   - Step 3: Coffee preferences (skippable)
   - Step 4: Notification preferences (skippable)
6. Completion → Redirected to /profile with success toast
```

### **Returning User Journey**
```
1. User visits site → Auto-logged in (30-day session)
2. Sees personalized content and "Welcome back, [Name]"
3. Can access /profile to manage preferences
4. Future: Rating submissions will include user attribution
```

---

## 🎯 **SUCCESS METRICS**

### **Phase 1A KPIs**
- ✅ Auth system functional (100% uptime)
- ✅ Onboarding system implemented (ready for tracking)
- ⏳ Onboarding completion rate > 80% (to be measured)
- ⏳ Email verification rate > 60%
- ⏳ Profile creation rate > 90% (users who complete profile)

### **Phase 1B KPIs**  
- ⏳ Profile engagement rate > 40% (users who visit profile weekly)
- ⏳ Notification opt-in rate > 70%
- ⏳ Coffee preferences completion rate > 60%

---

## 🚨 **RISK MITIGATION**

### **Technical Risks**
| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase auth downtime | High | Graceful degradation, local session backup |
| Facebook app review delay | Medium | Launch with Google + Email, add Facebook later |
| Migration conflicts | Medium | Use `IF NOT EXISTS` and test in staging first |
| Type generation issues | Low | Manual type updates as fallback |

### **UX Risks**
| Risk | Impact | Mitigation |
|------|--------|------------|
| Onboarding abandonment | Medium | Progressive disclosure + skip options |
| Privacy concerns | Low | Transparent privacy settings + GDPR compliance |

---

## 🚀 **IMPLEMENTATION TIMELINE**

### **Week 1 (Phase 1A)**
```
Day 1-2: Database migrations (enum update + user_profiles)
Day 3-4: RLS policies + testing
Day 5-6: Profile system + onboarding flow  
Day 7: Integration testing + type regeneration
```

### **Week 2 (Phase 1B)**
```
Day 1-2: Profile dashboard + preference management
Day 3-4: Notification settings + privacy controls
Day 5-6: Polish + testing
Day 7: Launch prep + documentation
```

---

## 📝 **RATE LIMITING CONSIDERATION**

**Question:** Do we need rate limiting at a user level?

**Recommendation:** Not required for Phase 1. Consider adding when:
- Rating system is implemented
- User-generated content features are added
- API endpoints are exposed

If needed later, create `user_rate_limits` table similar to the original PRD design.

---

## ✅ **READY FOR IMPLEMENTATION**

**Database schema**: ⏳ Ready (with migrations)  
**Auth providers**: ✅ Ready (Google done, Facebook in progress)  
**UI components**: ✅ Partially ready (AuthForm exists, Callback completed)  
**Technical approach**: ✅ Validated  
**Risk assessment**: ✅ Complete  
**Next.js 16 compatibility**: ✅ Updated for proxy.ts

**Approval needed**: YES 🎯  
**Estimated effort**: 80 hours (2 developers x 5 days each)  
**Confidence level**: 95%

---

## 📋 **MIGRATION CHECKLIST**

### **Database & Infrastructure**
- [x] Create migration: Update `user_role_enum` (add contributor, roaster) ✅ **COMPLETED**
- [x] Create migration: Create `user_profiles` table ✅ **COMPLETED**
- [x] Create migration: Create related tables (notification_prefs, coffee_prefs, rating_migrations) ✅ **COMPLETED**
- [x] Create migration: Add RLS policies for all tables ✅ **COMPLETED**
- [x] Test migrations in staging environment ✅ **COMPLETED**
- [x] Regenerate TypeScript types (`supabase-types.ts`) ✅ **COMPLETED**
- [x] Verify foreign key relationships ✅ **COMPLETED & VERIFIED**

### **Security & Data Access**
- [x] Create Data Access Layer (`src/data/`) ✅ **COMPLETED**
- [x] Implement `getCurrentUser()` with React `cache()` ✅ **COMPLETED**
- [x] Create User Profile DTOs (Public and Private) ✅ **COMPLETED**
- [x] Implement `getProfileDTO()` with access control ✅ **COMPLETED**
- [x] Add `'server-only'` markers to server files ✅ **COMPLETED**
- [x] Create role checking utilities ✅ **COMPLETED**

### **Route Protection & Auth**
- [x] Update `proxy.ts` with profile route protection ✅ **COMPLETED**
- [x] Create OAuth callback handler (`/auth/callback/route.ts`) ✅ **COMPLETED**
- [x] Update header component with avatar dropdown ✅ **COMPLETED**

### **UI Components**
- [x] Build onboarding wizard component ✅ **COMPLETED**
  - 4-step wizard with progress indicator
  - Step 1: Basic Info (name, city, state, country, gender)
  - Step 2: Coffee Experience (level + brewing methods)
  - Step 3: Coffee Preferences (optional - can skip)
  - Step 4: Notification Preferences (optional - can skip)
  - Zod validation with field-level error messages
  - Server-side validation in profile action
- [ ] Build profile dashboard components
- [ ] Build profile sidebar navigation
- [ ] Build coffee preferences form
- [ ] Build notification settings component

### **Testing & Deployment**
- [ ] Integration testing
- [ ] Security audit of Data Access Layer
- [ ] Performance testing
- [ ] Deploy to production

---

## 📝 **COMPLETION STATUS**

### ✅ **Completed Items**

#### **Authentication & Routing**
- ✅ Unified auth page (`/auth` with mode switching)
- ✅ OAuth callback handler (`/auth/callback/route.ts`)
- ✅ AuthProvider and AuthForm components
- ✅ Route protection in `proxy.ts` (dashboard + profile routes)
- ✅ Header component with avatar dropdown (shows login button or user avatar)

#### **Database & Schema**
- ✅ `user_role_enum` updated (contributor, roaster added)
- ✅ `user_profiles` table created
- ✅ `user_notification_preferences` table created
- ✅ `user_coffee_preferences` table created
- ✅ `rating_migrations` table created
- ✅ `user_roles` foreign key updated to reference `user_profiles` (verified)
- ✅ Auto-assign 'user' role trigger implemented
- ✅ RLS policies for all tables
- ✅ TypeScript types regenerated
- ✅ Database schema verified and confirmed correct

#### **Data Access Layer (Security)**
- ✅ Data Access Layer created (`src/data/`)
- ✅ `getCurrentUser()` with React `cache()` for request-level memoization
- ✅ `PublicProfileDTO` and `PrivateProfileDTO` types
- ✅ `getProfileDTO()` with access control (public/private profile logic)
- ✅ `getMyProfileDTO()` for current user's full profile
- ✅ Role checking utilities (`hasRole()`, `isAdmin()`, `isAdminOrOperator()`, etc.)
- ✅ All server files marked with `'server-only'`
- ✅ Input validation on all data access functions
- ✅ Comprehensive documentation (`src/data/README.md`)

#### **Onboarding System**
- ✅ Onboarding wizard component (`src/components/onboarding/onboarding-wizard.tsx`)
  - 4-step wizard with progress indicator
  - Step-by-step Zod validation
  - Field-level error messages using `FieldError` component
  - Skip functionality for optional steps (Steps 3 & 4)
  - Matches auth page design system
- ✅ Onboarding page (`src/app/auth/onboarding/page.tsx`)
  - Split-screen layout matching auth page
  - Automatic redirect if already completed
  - Authentication check and redirect
- ✅ Server action for saving onboarding data (`src/app/actions/profile.ts`)
  - Server-side Zod validation
  - Field-level error handling
  - Saves profile, coffee preferences, and notification preferences
  - Revalidates profile pages after save
- ✅ Zod validation schema (`src/lib/validations/onboarding.ts`)
  - Main schema with all onboarding fields
  - Step-specific schemas (step1Schema, step2Schema, step3Schema, step4Schema)
  - Type-safe validation with shared types between client and server
  - Validation rules: length limits, enum values, array limits
- ✅ Client-side step-by-step validation
- ✅ Server-side validation with field-level errors
- ✅ Automatic redirect from OAuth callback to onboarding
- ✅ Route protection for onboarding page (updated `proxy.ts`)
- ✅ Success toast notification on completion

### ⏳ **In Progress / Pending**
- Profile dashboard and components
- Profile sidebar navigation
- Coffee preferences management UI
- Notification settings UI
- Email verification banner
- Integration testing
- Security audit

---

**End of PRD**
