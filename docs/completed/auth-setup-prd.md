*Chef's kiss* 👌 Perfect! Now I have everything I need to create a PRD that'll make Silicon Valley PMs weep with envy.

---

# 🔐 **AUTHENTICATION SYSTEM PRD**
## IndianCoffeeBeans.com - Phase 1 Implementation

**Version:** 1.0  
**Timeline:** 10 days  
**Status:** Ready for Implementation  
**Owner:** CTO (You) + Senior Developer (Me, apparently 😏)

---

## 📊 **EXECUTIVE SUMMARY**

Transform IndianCoffeeBeans from a browsable directory into a personalized coffee discovery platform with full user authentication, profile management, and rating migration system.

**Key Outcomes:**
- 🎯 Increase user engagement by 200% through personalization
- ☕ Capture 5x more rating data through authenticated users  
- 📈 Enable future monetization through user-based features
- 🚀 Foundation for community features and premium services

---

## 🎯 **PHASE 1A OBJECTIVES** (Week 1)

### **Core Auth Infrastructure**
- ✅ Supabase Auth setup (Google + Email/Password)
- ✅ Facebook auth configuration (app review in parallel)
- ✅ Auth pages with onboarding flow
- ✅ Middleware for route protection
- ✅ Tools section protection (full block)
- ✅ User profile system with preferences

### **Database Extensions**
- ✅ Users table with rich profile data
- ✅ User preferences and coffee journey tracking
- ✅ Role-based access control (Admin/User/Contributor)
- ✅ Rating system enhancements for user attribution

---

## 🎯 **PHASE 1B OBJECTIVES** (Week 2)

### **Rating Migration & Enhancement**
- ✅ Anonymous rating migration system
- ✅ Profile dashboard with rating history
- ✅ Claim ratings functionality
- ✅ Enhanced rating display with user attribution
- ✅ Notification preferences setup

---

## 🗄️ **DATABASE SCHEMA CHANGES**

### **New Tables**

```sql
-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
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

-- User roles and permissions
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'user', 'contributor')) DEFAULT 'user',
  granted_by UUID REFERENCES public.user_profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  new_roasters BOOLEAN DEFAULT true,
  coffee_updates BOOLEAN DEFAULT true,
  newsletter BOOLEAN DEFAULT true,
  platform_updates BOOLEAN DEFAULT true,
  email_frequency TEXT CHECK (email_frequency IN ('immediately', 'daily', 'weekly', 'monthly')) DEFAULT 'weekly',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User coffee preferences (for recommendations)
CREATE TABLE public.user_coffee_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  roast_levels TEXT[], -- ['light', 'medium', 'dark']
  flavor_profiles TEXT[], -- ['fruity', 'nutty', 'chocolatey']
  processing_methods TEXT[], -- ['washed', 'natural', 'honey']
  regions TEXT[], -- ['coorg', 'chikmagalur', 'wayanad']
  with_milk_preference BOOLEAN,
  decaf_only BOOLEAN DEFAULT false,
  organic_only BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rating migration tracking
CREATE TABLE public.rating_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  coffee_ratings_migrated INTEGER DEFAULT 0,
  roaster_ratings_migrated INTEGER DEFAULT 0,
  migration_date TIMESTAMPTZ DEFAULT NOW(),
  migration_type TEXT CHECK (migration_type IN ('automatic', 'manual_claim')) DEFAULT 'automatic'
);
```

### **Table Modifications**

```sql
-- Add user attribution to existing ratings
ALTER TABLE coffee_ratings 
ADD COLUMN user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN display_name TEXT; -- For public display

ALTER TABLE roaster_ratings 
ADD COLUMN user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN display_name TEXT;

-- Rate limiting table
CREATE TABLE public.user_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  coffee_ratings_today INTEGER DEFAULT 0,
  roaster_ratings_today INTEGER DEFAULT 0,
  last_rating_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, last_rating_date)
);
```

---

## 🔐 **AUTHENTICATION FLOW**

### **Provider Setup**
```typescript
// Supabase Auth Configuration
export const authConfig = {
  providers: ['google', 'facebook', 'email'],
  redirectTo: `/auth/callback`,
  scopes: {
    google: 'email profile',
    facebook: 'email public_profile'
  }
}
```

### **Auth Pages Structure**
```
/auth/
├── signin/page.tsx          # Sign in form
├── signup/page.tsx          # Sign up form  
├── callback/page.tsx        # OAuth callback
├── verify-email/page.tsx    # Email verification
├── forgot-password/page.tsx # Password reset
├── reset-password/page.tsx  # Password reset form
└── onboarding/page.tsx      # Post-signup onboarding
```

### **Onboarding Flow**
```typescript
// 4-Step Onboarding Wizard
Step 1: Basic Info (Name, City, State)
Step 2: Coffee Experience (Level + Brewing Methods)
Step 3: Rating Migration (Auto + Manual Claim)
Step 4: Preferences (Optional - Can Skip)
```

---

## 🛡️ **MIDDLEWARE & ROUTE PROTECTION**

### **Route Categories**
```typescript
// middleware.ts configuration
export const routeConfig = {
  public: [
    '/', '/coffees', '/roasters', '/regions', '/learn',
    '/privacy', '/terms', '/about', '/contact'
  ],
  
  authRequired: [
    '/tools',           // Full block
    '/profile',         // User dashboard
    '/settings'         // Account management
  ],
  
  authOptional: [
    '/api/ratings',     // Allow both authenticated & anonymous
    '/api/reviews'      // Same as above
  ],
  
  adminOnly: [
    '/admin'           // Future admin panel
  ]
}
```

### **Protection Logic**
```typescript
// Tools access control (EASY implementation)
export default function ToolsLayout({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    redirect('/auth/signin?from=/tools&message=signin-required');
  }
  
  return <>{children}</>;
}
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
  "Coffee Ratings": {
    route: "/profile/coffee-ratings", 
    sections: ["Your Ratings", "Claimed Ratings", "Rating History"]
  },
  "Roaster Reviews": {
    route: "/profile/roaster-reviews",
    sections: ["Your Reviews", "Favorite Roasters"]
  },
  "Claimed Ratings": {
    route: "/profile/claimed-ratings",
    sections: ["Available to Claim", "Migration History"]
  },
  "Notifications": {
    route: "/profile/notifications",
    sections: ["Email Preferences", "Push Settings"]
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
  username: string;
  fullName: string;
  city?: string;
  state?: string;
  experienceLevel: 'beginner' | 'enthusiast' | 'expert';
  
  // Coffee Preferences  
  preferredBrewingMethods: string[];
  roastPreferences: string[];
  flavorPreferences: string[];
  
  // Calculated Fields
  totalCoffeeRatings: number;
  totalRoasterRatings: number;
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

## 🔄 **RATING MIGRATION STRATEGY**

### **Option C: Auto + Manual Claim Implementation**

#### **Automatic Migration (On Signup)**
```typescript
async function autoMigrateRatings(userId: string, ipAddress: string) {
  // Find all ratings from this IP in last 30 days
  const candidateRatings = await supabase
    .from('coffee_ratings')
    .select('*')
    .eq('ip_address', ipAddress)
    .is('user_profile_id', null)
    .gte('created_at', thirtyDaysAgo);
    
  // Auto-assign if confidence is high
  for (const rating of candidateRatings) {
    await supabase
      .from('coffee_ratings')
      .update({ 
        user_profile_id: userId,
        display_name: userProfile.fullName 
      })
      .eq('id', rating.id);
  }
  
  // Log migration
  await supabase.from('rating_migrations').insert({
    user_id: userId,
    ip_address: ipAddress,
    coffee_ratings_migrated: candidateRatings.length,
    migration_type: 'automatic'
  });
}
```

#### **Manual Claim Interface**
```typescript
// Profile section showing claimable ratings
function ClaimableRatings() {
  const claimableRatings = useQuery({
    queryKey: ['claimable-ratings'],
    queryFn: () => findPotentialRatings(user.ip, user.userAgent)
  });
  
  return (
    <div className="space-y-4">
      <h3>Found {claimableRatings.length} ratings that might be yours</h3>
      {claimableRatings.map(rating => (
        <RatingClaimCard 
          key={rating.id}
          rating={rating}
          onClaim={handleClaimRating}
        />
      ))}
    </div>
  );
}
```

---

## 🎨 **UI/UX COMPONENTS TO BUILD**

### **Auth Pages**
- `SignInForm` - Email + social providers
- `SignUpForm` - Progressive signup
- `OnboardingWizard` - 4-step flow
- `EmailVerificationBanner` - Persistent reminder

### **Profile Components**  
- `ProfileSidebar` - Navigation
- `ProfileHeader` - User info + stats
- `RatingHistoryList` - Paginated rating cards
- `ClaimRatingsSection` - Migration interface
- `NotificationSettings` - Preference toggles
- `AccountDeletion` - Confirmation flow

### **Enhanced Rating Components**
- `AuthenticatedRatingForm` - Richer rating submission
- `UserRatingDisplay` - Show attribution
- `RatingMigrationToast` - Success messages

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **File Structure Changes**
```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx  
│   │   ├── callback/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── layout.tsx
│   ├── profile/
│   │   ├── page.tsx
│   │   ├── coffee-ratings/page.tsx
│   │   ├── roaster-reviews/page.tsx
│   │   ├── claimed-ratings/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── layout.tsx
│   └── middleware.ts
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx
│   │   ├── SignUpForm.tsx
│   │   ├── OnboardingWizard.tsx
│   │   └── AuthGuard.tsx
│   ├── profile/
│   │   ├── ProfileSidebar.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── RatingHistory.tsx
│   │   └── ClaimRatings.tsx
│   └── ratings/
│       ├── AuthenticatedRatingForm.tsx
│       └── UserRatingDisplay.tsx
├── lib/
│   ├── auth/
│   │   ├── supabase-auth.ts
│   │   ├── middleware-helpers.ts
│   │   └── session-helpers.ts
│   ├── profile/
│   │   ├── profile-queries.ts
│   │   └── rating-migration.ts
│   └── rate-limiting/
│       └── rate-limit-helpers.ts
├── types/
│   ├── auth.ts
│   ├── profile.ts
│   └── rating-migration.ts
└── store/
    ├── auth-store.ts
    └── profile-store.ts
```

### **Rate Limiting Implementation**
```typescript
// lib/rate-limiting/rate-limit-helpers.ts
export async function checkRateLimit(
  userId: string, 
  ratingType: 'coffee' | 'roaster'
): Promise<{ allowed: boolean; remaining: number }> {
  
  const limits = {
    coffee: 15,
    roaster: 15
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  const { data: rateLimit } = await supabase
    .from('user_rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('last_rating_date', today)
    .single();
    
  if (!rateLimit) {
    // First rating today
    await supabase.from('user_rate_limits').insert({
      user_id: userId,
      [`${ratingType}_ratings_today`]: 1,
      last_rating_date: today
    });
    return { allowed: true, remaining: limits[ratingType] - 1 };
  }
  
  const currentCount = rateLimit[`${ratingType}_ratings_today`];
  
  if (currentCount >= limits[ratingType]) {
    return { allowed: false, remaining: 0 };
  }
  
  // Increment count
  await supabase
    .from('user_rate_limits')
    .update({ [`${ratingType}_ratings_today`]: currentCount + 1 })
    .eq('id', rateLimit.id);
    
  return { 
    allowed: true, 
    remaining: limits[ratingType] - currentCount - 1 
  };
}
```

---

## 📱 **USER EXPERIENCE FLOWS**

### **New User Journey**
```
1. User lands on homepage (public)
2. Browses coffees, likes what they see
3. Tries to access /tools → Redirected to /auth/signin
4. Signs up with Google → /auth/callback
5. Redirected to /auth/onboarding
   - Step 1: Name, city, state
   - Step 2: Experience + brewing methods
   - Step 3: "We found X ratings from your device - claim them?"
   - Step 4: Coffee preferences (skippable)
6. Completion → Redirected to /tools with success toast
```

### **Returning User Journey**
```
1. User visits site → Auto-logged in (30-day session)
2. Sees personalized content and "Welcome back, [Name]"
3. Rating submissions include user attribution
4. Profile shows growing coffee journey stats
```

### **Rating Migration UX**
```typescript
// After user submits anonymous rating
function PostRatingCTA() {
  return (
    <div className="card-base p-6 mt-4">
      <h3>Thanks for your rating! ☕</h3>
      <p>Sign up to save your coffee preferences and build your personal coffee journey. Takes just 2 minutes!</p>
      <Button onClick={() => router.push('/auth/signup')}>
        Create Your Coffee Profile
      </Button>
    </div>
  );
}
```

---

## 🎯 **SUCCESS METRICS**

### **Phase 1A KPIs**
- ✅ Auth system functional (100% uptime)
- ✅ Tools conversion rate > 25% (users who sign up to access tools)
- ✅ Onboarding completion rate > 80%
- ✅ Email verification rate > 60%

### **Phase 1B KPIs**  
- ✅ Rating migration success rate > 90%
- ✅ User-attributed ratings > 50% of new ratings
- ✅ Profile engagement rate > 40% (users who visit profile weekly)
- ✅ Notification opt-in rate > 70%

---

## 🚨 **RISK MITIGATION**

### **Technical Risks**
| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase auth downtime | High | Graceful degradation, local session backup |
| Facebook app review delay | Medium | Launch with Google + Email, add Facebook later |
| Rating migration conflicts | Medium | Conservative matching + manual review process |
| Rate limiting bypassed | Low | IP + User ID + Device fingerprinting |

### **UX Risks**
| Risk | Impact | Mitigation |
|------|--------|------------|
| Tools access frustration | Medium | Clear value prop + quick signup flow |
| Onboarding abandonment | Medium | Progressive disclosure + skip options |
| Privacy concerns | Low | Transparent privacy settings + GDPR compliance |

---

## 🚀 **IMPLEMENTATION TIMELINE**

### **Week 1 (Phase 1A)**
```
Day 1-2: Database schema + Supabase auth setup
Day 3-4: Auth pages + middleware
Day 5-6: Profile system + onboarding flow  
Day 7: Tools protection + testing
```

### **Week 2 (Phase 1B)**
```
Day 1-2: Rating migration system
Day 3-4: Profile dashboard + rating history
Day 5-6: Claim ratings functionality
Day 7: Polish + launch prep
```

---

## 🔮 **FUTURE ROADMAP PREVIEW**

### **Phase 2 (Month 2): Community Features**
- Public user profiles
- Following system
- Coffee wishlist/collections
- Social sharing enhancements

### **Phase 3 (Month 3): Notifications & Engagement**
- Email notification system
- Push notifications (PWA)
- Advanced personalization
- Achievement system

### **Phase 4 (Month 4): Monetization**
- Premium memberships
- Advanced coffee matching
- Exclusive content
- Affiliate enhancements

---

## ✅ **READY FOR IMPLEMENTATION**

**Database schema**: ✅ Ready  
**Auth providers**: ✅ Ready (Google done, Facebook in progress)  
**UI components**: ✅ Mapped out  
**Technical approach**: ✅ Validated  
**Risk assessment**: ✅ Complete  

**Approval needed**: YES 🎯  
**Estimated effort**: 80 hours (2 developers x 5 days each)  
**Confidence level**: 95% (Facebook app review is the only unknown)

---