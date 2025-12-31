-- Migration: Fix handle_new_user trigger to handle edge cases
-- Created: 2026-01-01
-- Description: Improves the handle_new_user trigger to better handle OAuth signups
--              and ensure it works even when email or metadata is missing

-- ============================================================================
-- FUNCTION: Create profile from auth user with OAuth data (IMPROVED)
-- ============================================================================

-- Drop existing function if it exists (with CASCADE to drop dependent triggers)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create the improved function with better error handling
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_avatar_url TEXT;
BEGIN
  -- Extract full_name with multiple fallbacks
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    CASE 
      WHEN NEW.email IS NOT NULL THEN split_part(NEW.email, '@', 1)
      ELSE 'User'
    END
  );

  -- Extract avatar_url
  user_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NEW.raw_user_meta_data->>'photo_url'
  );

  -- Create user profile with OAuth data extracted from raw_user_meta_data
  -- Use SECURITY DEFINER to bypass RLS policies
  INSERT INTO public.user_profiles (
    id,
    full_name,
    avatar_url,
    email_verified
  )
  VALUES (
    NEW.id,
    user_full_name,
    user_avatar_url,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    -- Only update avatar_url if it's currently NULL (don't overwrite custom avatars)
    avatar_url = COALESCE(
      user_profiles.avatar_url,
      user_avatar_url
    ),
    -- Update full_name if it's missing or just the email username
    full_name = CASE
      WHEN user_profiles.full_name IS NULL 
        OR user_profiles.full_name = split_part(COALESCE(NEW.email, ''), '@', 1)
        OR user_profiles.full_name = 'User'
      THEN COALESCE(
        user_full_name,
        user_profiles.full_name,
        'User'
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    -- The profile can be created later via onboarding
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
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

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates or updates user_profiles when a new user signs up via OAuth or email, extracting avatar_url and full_name from raw_user_meta_data. Includes error handling to prevent user creation failures.';

