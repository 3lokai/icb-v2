# Migration Guide: Supabase JWT Key Update

This guide helps you migrate from Supabase's legacy `anon` key to the new `publishable` key system.

## What Changed?

Supabase has updated their JWT setup from the legacy `anon` key to a new `publishable` key system. This change provides:

- Enhanced security
- Better key management
- Improved key rotation capabilities
- Simplified authentication flow

## Migration Steps

### 1. Update Environment Variables

**Before (Legacy):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**After (Current):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

### 2. Get Your New Publishable Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the new **Publishable** key (starts with `sb_publishable_...`)

### 3. Update Your Deployment

Update your deployment platform (Vercel, Netlify, etc.) with the new environment variable:

- **Vercel**: Update in Project Settings → Environment Variables
- **Netlify**: Update in Site Settings → Environment Variables
- **Railway**: Update in Variables tab

### 4. Code Changes (Already Applied)

The following files have been updated in this starter:

- `env.ts` - Environment variable validation
- `src/lib/supabase/client.ts` - Browser client configuration
- `src/lib/supabase/server.ts` - Server client configuration  
- `src/middleware.ts` - Middleware authentication
- `README.md` - Documentation updates

## Key Differences

| Aspect | Legacy Anon Key | New Publishable Key |
|--------|----------------|-------------------|
| Format | JWT token | Non-JWT key |
| Header Usage | `Authorization: Bearer ...` | `apikey: ...` |
| Security | Standard JWT | Enhanced security |
| Key Rotation | Manual | Automatic |

## Timeline

- **October 1, 2025**: Automatic migration for existing projects
- **November 1, 2025**: Migration reminders begin
- **Late 2026**: Legacy keys deprecated

## Need Help?

- [Supabase Documentation](https://supabase.com/docs/guides/api/api-keys)
- [Migration Guide](https://supabase.com/docs/guides/api/api-keys#migrating-from-legacy-keys)
- [Community Support](https://github.com/supabase/supabase/discussions)

## Verification

After migration, verify your setup:

1. Check that your app loads without authentication errors
2. Test user login/logout functionality
3. Verify database queries work correctly
4. Check that protected routes redirect properly

Your Supabase integration should work exactly the same as before, just with the new key system!
