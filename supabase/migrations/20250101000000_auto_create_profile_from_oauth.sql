-- Migration: Auto-create user profiles from OAuth data
-- Created: 2025-01-01
-- Description: Creates a trigger on auth.users to automatically create user_profiles
--              with avatar_url and full_name extracted from OAuth raw_user_meta_data

-- ============================================================================
-- FUNCTION: Create profile from auth user with OAuth data
-- ============================================================================

-- Drop existing function if it exists (with CASCADE to drop dependent triggers)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create the function from scratch
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile with OAuth data extracted from raw_user_meta_data
  INSERT INTO public.user_profiles (
    id,
    full_name,
    avatar_url,
    email_verified
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1) -- Fallback to email username
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    -- Only update avatar_url if it's currently NULL (don't overwrite custom avatars)
    avatar_url = COALESCE(
      user_profiles.avatar_url,
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      )
    ),
    -- Update full_name if it's missing or just the email username
    full_name = CASE
      WHEN user_profiles.full_name IS NULL 
        OR user_profiles.full_name = split_part(NEW.email, '@', 1)
      THEN COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        user_profiles.full_name,
        split_part(NEW.email, '@', 1)
      )
      ELSE user_profiles.full_name
    END,
    -- Update email_verified status
    email_verified = CASE 
      WHEN NEW.email_confirmed_at IS NOT NULL THEN true 
      ELSE user_profiles.email_verified 
    END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Auto-create profile on new auth user
-- ============================================================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to run after user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates or updates user_profiles when a new user signs up via OAuth or email, extracting avatar_url and full_name from raw_user_meta_data. Only backfills avatar_url if it is NULL to avoid overwriting custom avatars.';

