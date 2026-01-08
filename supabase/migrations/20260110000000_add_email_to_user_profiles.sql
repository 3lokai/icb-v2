-- Migration: Add email column to user_profiles table
-- Created: 2026-01-10
-- Description: Adds email column to user_profiles and migrates existing emails from auth.users

-- ============================================================================
-- ADD EMAIL COLUMN TO USER_PROFILES
-- ============================================================================

-- Add email column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.user_profiles
    ADD COLUMN email TEXT;
    
    -- Add index for email lookups
    CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
    
    -- Add comment
    COMMENT ON COLUMN public.user_profiles.email IS 'User email address synced from auth.users';
  END IF;
END $$;

-- ============================================================================
-- BACKFILL EXISTING EMAILS FROM AUTH.USERS
-- ============================================================================

-- Create a function to backfill emails (uses SECURITY DEFINER to access auth.users)
CREATE OR REPLACE FUNCTION public.backfill_user_profile_emails()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update existing user_profiles with emails from auth.users
  UPDATE public.user_profiles up
  SET email = au.email
  FROM auth.users au
  WHERE up.id = au.id
    AND up.email IS NULL
    AND au.email IS NOT NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the backfill
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT public.backfill_user_profile_emails() INTO updated_count;
  RAISE NOTICE 'Backfilled emails for % user profiles', updated_count;
END $$;

-- Clean up the temporary function (optional - you can keep it for future use)
-- DROP FUNCTION IF EXISTS public.backfill_user_profile_emails();

-- ============================================================================
-- UPDATE HANDLE_NEW_USER FUNCTION TO INCLUDE EMAIL
-- ============================================================================

-- Drop and recreate the function to include email
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

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
    email,
    email_verified
  )
  VALUES (
    NEW.id,
    user_full_name,
    user_avatar_url,
    NEW.email,
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
    -- Update email if it's NULL or different (sync from auth.users)
    email = COALESCE(
      user_profiles.email,
      NEW.email
    ),
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
-- RECREATE TRIGGER
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

COMMENT ON COLUMN public.user_profiles.email IS 'User email address synced from auth.users';
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates or updates user_profiles when a new user signs up via OAuth or email, extracting avatar_url, full_name, and email from auth.users. Includes error handling to prevent user creation failures.';

