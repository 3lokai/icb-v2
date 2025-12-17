# 🎛️ **SUPABASE DASHBOARD CONFIGURATION PRD**
## IndianCoffeeBeans.com - Auth & Database Setup

**Version:** 1.0  
**Timeline:** 1-2 hours  
**Status:** Ready for Implementation  
**Prerequisites:** Existing Supabase project with coffee directory data

---

## 📊 **EXECUTIVE SUMMARY**

Configure Supabase dashboard settings to support full authentication system, including auth providers, security policies, database schema updates, and production-ready configurations.

**Key Outcomes:**
- 🔐 Auth providers properly configured
- 🛡️ RLS policies securing user data
- 📧 Email templates customized
- 🔗 Redirect URLs configured for all environments
- ⚙️ Database functions and triggers in place

---

## 🎯 **CONFIGURATION OBJECTIVES**

### **Authentication Setup**
- ✅ Google OAuth provider configuration
- ✅ Facebook OAuth provider configuration  
- ✅ Email authentication settings
- ✅ Custom redirect URLs for all environments
- ✅ Rate limiting and security policies
- ✅ Custom email templates

### **Database Schema**
- ✅ Create new auth-related tables
- ✅ Update existing tables for user attribution
- ✅ Set up RLS policies
- ✅ Create database functions
- ✅ Set up triggers for auto-updates

---

## 🔐 **AUTHENTICATION CONFIGURATION**

### **1. Auth Settings (Authentication > Settings)**

#### **General Settings**
```
Site URL: https://indiancoffeebeans.com
Additional Redirect URLs:
- http://localhost:3000/auth/callback (Development)
- https://indiancoffeebeans.com/auth/callback (Production)
- https://www.indiancoffeebeans.com/auth/callback (Production www)
- https://staging.indiancoffeebeans.com/auth/callback (Staging)

JWT Expiry: 3600 seconds (1 hour)
Refresh Token Rotation: Enabled
Reuse Interval: 10 seconds
Session Timeout: 2592000 seconds (30 days)
```

#### **Email Rate Limits**
```
Password Recovery: 30 per hour
Email Change: 30 per hour  
Signup: 30 per hour
Email OTP: 60 per hour
SMS OTP: 60 per hour
```

#### **Security Settings**
```
Enable captcha: Yes (for production)
Captcha threshold: 5
Password minimum length: 8
```

### **2. Auth Providers (Authentication > Providers)**

#### **Google OAuth Setup**
1. **Navigate to**: Authentication > Providers > Google
2. **Enable Google provider**: Toggle ON
3. **Configuration**:
   ```
   Client ID: [Get from Google Cloud Console]
   Client Secret: [Get from Google Cloud Console]
   
   Authorized redirect URI (add to Google Console):
   https://[project-ref].supabase.co/auth/v1/callback
   ```
4. **Scopes**: `email profile`
5. **Additional Settings**:
   ```
   Skip nonce check: false
   Request refresh token: true
   ```

#### **Facebook OAuth Setup**
1. **Navigate to**: Authentication > Providers > Facebook
2. **Enable Facebook provider**: Toggle ON
3. **Configuration**:
   ```
   App ID: [Get from Facebook Developers]
   App Secret: [Get from Facebook Developers]
   
   Valid OAuth Redirect URIs (add to Facebook App):
   https://[project-ref].supabase.co/auth/v1/callback
   ```
4. **Scopes**: `email public_profile`

#### **Email Provider Settings**
1. **Navigate to**: Authentication > Providers > Email
2. **Enable email provider**: Toggle ON
3. **Configuration**:
   ```
   Enable email confirmations: true
   Enable email change confirmations: true
   Secure password change: true
   ```

### **3. Email Templates (Authentication > Email Templates)**

#### **Confirm Signup Template**
```html
Subject: Welcome to Indian Coffee Beans - Confirm Your Email

<h2>Welcome to Indian Coffee Beans! ☕</h2>

<p>Hi there!</p>

<p>Thanks for joining India's premier coffee discovery platform. You're just one click away from exploring amazing Indian coffee roasters and building your personal coffee journey.</p>

<p>Click the link below to confirm your email address:</p>

<p><a href="{{ .ConfirmationURL }}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Confirm Your Email</a></p>

<p>Or copy and paste this URL into your browser:<br>
{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>Once confirmed, you'll be able to:</p>
<ul>
  <li>Rate and review coffee products</li>
  <li>Save your favorite roasters</li>
  <li>Use our coffee brewing tools</li>
  <li>Get personalized recommendations</li>
</ul>

<p>Happy coffee discovering!</p>

<p>The Indian Coffee Beans Team</p>

<hr>
<p style="font-size: 12px; color: #666;">
If you didn't create an account with us, you can safely ignore this email.
</p>
```

#### **Reset Password Template**
```html
Subject: Reset Your Indian Coffee Beans Password

<h2>Reset Your Password ☕</h2>

<p>Hi there!</p>

<p>We received a request to reset your password for your Indian Coffee Beans account.</p>

<p>Click the link below to create a new password:</p>

<p><a href="{{ .ConfirmationURL }}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>

<p>Or copy and paste this URL into your browser:<br>
{{ .ConfirmationURL }}</p>

<p>This link will expire in 1 hour.</p>

<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

<p>Best regards,<br>
The Indian Coffee Beans Team</p>
```

#### **Magic Link Template**
```html
Subject: Your Indian Coffee Beans Sign-in Link

<h2>Sign in to Indian Coffee Beans ☕</h2>

<p>Hi there!</p>

<p>Click the link below to sign in to your account:</p>

<p><a href="{{ .ConfirmationURL }}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Sign In</a></p>

<p>Or copy and paste this URL into your browser:<br>
{{ .ConfirmationURL }}</p>

<p>This link will expire in 1 hour.</p>

<p>If you didn't request this sign-in link, you can safely ignore this email.</p>

<p>Best regards,<br>
The Indian Coffee Beans Team</p>
```

#### **Email Change Confirmation**
```html
Subject: Confirm Your New Email Address

<h2>Confirm Your Email Change ☕</h2>

<p>Hi there!</p>

<p>We received a request to change your email address for your Indian Coffee Beans account.</p>

<p>Click the link below to confirm your new email address:</p>

<p><a href="{{ .ConfirmationURL }}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Confirm New Email</a></p>

<p>Or copy and paste this URL into your browser:<br>
{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't request this email change, please contact us immediately.</p>

<p>Best regards,<br>
The Indian Coffee Beans Team</p>
```

---

## 🗄️ **DATABASE SCHEMA SETUP**

### **1. Create New Tables (Database > SQL Editor)**

Run the following SQL to create auth-related tables:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'enthusiast', 'expert')),
  preferred_brewing_methods TEXT[],
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

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'user', 'contributor')) DEFAULT 'user',
  granted_by UUID REFERENCES public.user_profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create notification preferences table
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

-- Create user coffee preferences table
CREATE TABLE IF NOT EXISTS public.user_coffee_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  roast_levels TEXT[],
  flavor_profiles TEXT[],
  processing_methods TEXT[],
  regions TEXT[],
  with_milk_preference BOOLEAN,
  decaf_only BOOLEAN DEFAULT false,
  organic_only BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rating migration tracking table
CREATE TABLE IF NOT EXISTS public.rating_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  coffee_ratings_migrated INTEGER DEFAULT 0,
  roaster_ratings_migrated INTEGER DEFAULT 0,
  migration_date TIMESTAMPTZ DEFAULT NOW(),
  migration_type TEXT CHECK (migration_type IN ('automatic', 'manual_claim')) DEFAULT 'automatic'
);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.user_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  coffee_ratings_today INTEGER DEFAULT 0,
  roaster_ratings_today INTEGER DEFAULT 0,
  last_rating_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, last_rating_date)
);

-- Add user attribution to existing ratings tables
ALTER TABLE public.coffee_ratings 
ADD COLUMN IF NOT EXISTS user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE public.roaster_ratings 
ADD COLUMN IF NOT EXISTS user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_verified ON public.user_profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_ratings_user_profile_id ON public.coffee_ratings(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_roaster_ratings_user_profile_id ON public.roaster_ratings(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_date ON public.user_rate_limits(user_id, last_rating_date);
```

### **2. Create Database Functions**

```sql
-- Function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END
  );
  
  -- Create default notification preferences
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id);
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_coffee_ratings', COALESCE(coffee_count, 0),
    'total_roaster_ratings', COALESCE(roaster_count, 0),
    'average_coffee_rating', COALESCE(avg_coffee_rating, 0),
    'average_roaster_rating', COALESCE(avg_roaster_rating, 0),
    'member_since', profile.created_at
  ) INTO result
  FROM public.user_profiles profile
  LEFT JOIN (
    SELECT 
      user_profile_id,
      COUNT(*) as coffee_count,
      AVG(overall_rating) as avg_coffee_rating
    FROM public.coffee_ratings 
    WHERE user_profile_id = p_user_id
    GROUP BY user_profile_id
  ) coffee_stats ON coffee_stats.user_profile_id = profile.id
  LEFT JOIN (
    SELECT 
      user_profile_id,
      COUNT(*) as roaster_count,
      AVG(overall_rating) as avg_roaster_rating
    FROM public.roaster_ratings 
    WHERE user_profile_id = p_user_id
    GROUP BY user_profile_id
  ) roaster_stats ON roaster_stats.user_profile_id = profile.id
  WHERE profile.id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim anonymous ratings
CREATE OR REPLACE FUNCTION public.claim_anonymous_ratings(
  p_user_id UUID,
  p_rating_ids UUID[]
)
RETURNS JSON AS $$
DECLARE
  coffee_count INTEGER := 0;
  roaster_count INTEGER := 0;
  profile_name TEXT;
BEGIN
  -- Get user's display name
  SELECT full_name INTO profile_name 
  FROM public.user_profiles 
  WHERE id = p_user_id;
  
  -- Claim coffee ratings
  UPDATE public.coffee_ratings 
  SET 
    user_profile_id = p_user_id,
    display_name = profile_name,
    is_anonymous = false
  WHERE id = ANY(p_rating_ids) 
    AND user_profile_id IS NULL;
  
  GET DIAGNOSTICS coffee_count = ROW_COUNT;
  
  -- Claim roaster ratings
  UPDATE public.roaster_ratings 
  SET 
    user_profile_id = p_user_id,
    display_name = profile_name,
    is_anonymous = false
  WHERE id = ANY(p_rating_ids) 
    AND user_profile_id IS NULL;
  
  GET DIAGNOSTICS roaster_count = ROW_COUNT;
  
  -- Log the migration
  INSERT INTO public.rating_migrations (
    user_id, 
    coffee_ratings_migrated, 
    roaster_ratings_migrated,
    migration_type
  ) VALUES (
    p_user_id, 
    coffee_count, 
    roaster_count,
    'manual_claim'
  );
  
  RETURN json_build_object(
    'success', true,
    'coffee_ratings_claimed', coffee_count,
    'roaster_ratings_claimed', roaster_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **3. Create Triggers**

```sql
-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at timestamps
CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_notification_prefs
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_coffee_prefs
  BEFORE UPDATE ON public.user_coffee_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 🛡️ **ROW LEVEL SECURITY (RLS) POLICIES**

### **Setup RLS (Database > SQL Editor)**

```sql
-- Enable RLS on all user tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coffee_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
  FOR SELECT USING (is_public_profile = true);

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Notification Preferences Policies
CREATE POLICY "Users can manage their own notification preferences" ON public.user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Coffee Preferences Policies
CREATE POLICY "Users can manage their own coffee preferences" ON public.user_coffee_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Rating Migrations Policies
CREATE POLICY "Users can view their own migration history" ON public.rating_migrations
  FOR SELECT USING (auth.uid() = user_id);

-- Rate Limits Policies
CREATE POLICY "Users can view their own rate limits" ON public.user_rate_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits" ON public.user_rate_limits
  FOR ALL USING (true); -- This allows the rate limiting system to work

-- Enhanced Coffee Ratings Policies (update existing)
DROP POLICY IF EXISTS "Anyone can view coffee ratings" ON public.coffee_ratings;
CREATE POLICY "Anyone can view coffee ratings" ON public.coffee_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own coffee ratings" ON public.coffee_ratings
  FOR ALL USING (
    auth.uid() = user_profile_id OR 
    (user_profile_id IS NULL AND auth.uid() IS NOT NULL)
  );

-- Enhanced Roaster Ratings Policies (update existing)
DROP POLICY IF EXISTS "Anyone can view roaster ratings" ON public.roaster_ratings;
CREATE POLICY "Anyone can view roaster ratings" ON public.roaster_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own roaster ratings" ON public.roaster_ratings
  FOR ALL USING (
    auth.uid() = user_profile_id OR 
    (user_profile_id IS NULL AND auth.uid() IS NOT NULL)
  );
```

---

## 🔧 **GOOGLE OAUTH SETUP GUIDE**

### **Google Cloud Console Configuration**

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**: IndianCoffeeBeans
3. **Enable APIs**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Search for "Google Identity and Access Management (IAM) API" and enable it

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "IndianCoffeeBeans Auth"
   
5. **Configure Authorized URLs**:
   ```
   Authorized JavaScript origins:
   - http://localhost:3000 (Development)
   - https://indiancoffeebeans.com (Production)
   - https://www.indiancoffeebeans.com (Production)
   
   Authorized redirect URIs:
   - https://[your-project-ref].supabase.co/auth/v1/callback
   ```

6. **Copy Credentials**: Client ID and Client Secret for Supabase

### **OAuth Consent Screen**
```
Application name: Indian Coffee Beans
User support email: gt.abhiseh@gmail.com
Application logo: [Upload your coffee logo]
Authorized domains: indiancoffeebeans.com
Developer contact email: gt.abhishek@gmail.com

Scopes to request:
- email
- profile
- openid
```

---

## 🔧 **FACEBOOK OAUTH SETUP GUIDE**

### **Facebook Developers Console**

1. **Go to Facebook Developers**: https://developers.facebook.com
2. **Create App**: 
   - App Type: "Consumer"
   - App Name: "Indian Coffee Beans"
   - App Contact Email: gt.abhiseh@gmail.com

3. **Add Facebook Login Product**:
   - Go to "Products" > "Facebook Login" > "Set up"
   - Choose "Web" platform

4. **Configure OAuth Settings**:
   ```
   Valid OAuth Redirect URIs:
   - https://[your-project-ref].supabase.co/auth/v1/callback
   
   Valid Origins:
   - https://indiancoffeebeans.com
   - https://www.indiancoffeebeans.com
   ```

5. **App Review** (Required for production):
   - Submit app for review with "email" and "public_profile" permissions
   - Provide privacy policy URL: https://indiancoffeebeans.com/privacy
   - Provide terms of service URL: https://indiancoffeebeans.com/terms

6. **Copy Credentials**: App ID and App Secret for Supabase

---

## ⚙️ **WEBHOOK CONFIGURATION**

### **Database Webhooks (Database > Webhooks)**

#### **User Profile Updates Webhook**
```
Table: user_profiles
Events: INSERT, UPDATE
HTTP Method: POST
URL: https://indiancoffeebeans.com/api/webhooks/user-profile
Headers:
  Authorization: Bearer [your-webhook-secret]
  Content-Type: application/json
```

#### **Rating Submissions Webhook**
```
Table: coffee_ratings, roaster_ratings  
Events: INSERT, UPDATE
HTTP Method: POST
URL: https://indiancoffeebeans.com/api/webhooks/ratings
Headers:
  Authorization: Bearer [your-webhook-secret]
  Content-Type: application/json
```

---

## 🔍 **TESTING & VALIDATION**

### **Auth Flow Testing Checklist**
- [ ] Google OAuth sign-in works
- [ ] Facebook OAuth sign-in works (when approved)
- [ ] Email signup with confirmation works
- [ ] Password reset works
- [ ] Email templates render correctly
- [ ] Redirect URLs work for all environments
- [ ] RLS policies prevent unauthorized access
- [ ] Database functions execute without errors
- [ ] Triggers fire correctly on user creation

### **Security Testing**
- [ ] Cannot access other users' data
- [ ] Rate limiting prevents abuse
- [ ] Email confirmations are required
- [ ] Sessions expire correctly
- [ ] OAuth state parameter validation works

---

## 📊 **MONITORING & ALERTS**

### **Database Monitoring (Dashboard > Monitoring)**

#### **Key Metrics to Watch**
- Authentication success/failure rates
- User registration rates
- Email confirmation rates
- Database query performance
- RLS policy execution time

#### **Alerts to Set Up**
- Failed authentication attempts > 100/hour
- New user registrations spike > 50/hour
- Database query response time > 2 seconds
- Email delivery failures > 10%

---

## 🚀 **DEPLOYMENT CHECKLIST**

### **Pre-Production**
- [ ] All database migrations applied
- [ ] RLS policies tested thoroughly
- [ ] Email templates customized and tested
- [ ] OAuth providers configured and tested
- [ ] Rate limiting tested
- [ ] Webhook endpoints secured

### **Production Launch**
- [ ] Switch to production OAuth credentials
- [ ] Enable captcha for signup
- [ ] Set up monitoring and alerts
- [ ] Test all flows end-to-end
- [ ] Document rollback procedures

---

## 🔄 **POST-SETUP VALIDATION**

### **Quick Test Script**
```sql
-- Test user profile creation
SELECT * FROM auth.users LIMIT 1;
SELECT * FROM public.user_profiles LIMIT 1;

-- Test RLS policies
SET ROLE authenticated;
SELECT * FROM public.user_profiles WHERE id = 'test-user-id';

-- Test functions
SELECT public.get_user_stats('test-user-id');

-- Test triggers
INSERT INTO auth.users (id, email) VALUES (gen_random_uuid(), 'test@example.com');
```

---

**Ready to configure your Supabase dashboard?** 🚀

**Estimated time**: 1-2 hours for complete setup
**Complexity**: Medium (requires attention to detail)
**Risk**: Low (can be tested thoroughly before production)

**Next steps after completion**:
1. ✅ Test all auth flows
2. ✅ Implement Phase 0 infrastructure code
3. ✅ Build auth pages and components

Let me know when you're ready to tackle this setup! ⚙️