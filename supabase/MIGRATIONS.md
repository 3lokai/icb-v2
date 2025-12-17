# Supabase Migrations Guide

This directory contains database migrations for the Indian Coffee Beans project. Migrations are version-controlled SQL files that modify your database schema.

## Quick Start

### Create a New Migration

```bash
npm run supabase:migration:new <migration_name>
```

Example:
```bash
npm run supabase:migration:new add_user_preferences
```

This creates a new migration file in `supabase/migrations/` with a timestamp prefix.

### List Migrations

```bash
npm run supabase:migration:list
```

Shows all migrations and their status (local vs remote).

### Apply Migrations

```bash
# Apply all pending migrations
npm run supabase:migration:up

# Apply a specific migration (use migration version number)
supabase migration up <version>
```

### Rollback Migrations

```bash
# Rollback the last migration
npm run supabase:migration:down

# Rollback to a specific version
supabase migration down <version>
```

## Migration Workflow

### 1. Create a Migration

```bash
npm run supabase:migration:new add_user_management_tables
```

### 2. Edit the Migration File

Edit the generated SQL file in `supabase/migrations/`:

```sql
-- Migration: Add User Management Tables
-- Description: Creates tables for user preferences and settings

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Test Locally (Optional)

If you have a local Supabase instance:
```bash
supabase start
supabase migration up
```

### 4. Apply to Remote Database

```bash
npm run supabase:migration:up
```

This applies migrations to your linked Supabase project.

### 5. Update TypeScript Types

After applying migrations, regenerate types:

```bash
npm run supabase:types
```

## Best Practices

### 1. Always Use IF NOT EXISTS / IF EXISTS

Prevent errors if objects already exist:

```sql
CREATE TABLE IF NOT EXISTS ...
DROP TABLE IF EXISTS ...
```

### 2. Include Rollback Logic

For complex migrations, consider adding comments for rollback:

```sql
-- Rollback:
-- DROP TABLE IF EXISTS public.user_preferences;
```

### 3. Use Transactions

Supabase migrations run in transactions automatically, but be explicit for clarity:

```sql
BEGIN;

-- Your migration SQL here

COMMIT;
```

### 4. Enable RLS

Always enable Row Level Security on new tables:

```sql
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
```

### 5. Create Policies

Define RLS policies immediately after creating tables:

```sql
CREATE POLICY "policy_name"
  ON public.table_name FOR SELECT
  USING (auth.uid() = user_id);
```

### 6. Add Indexes

Create indexes for frequently queried columns:

```sql
CREATE INDEX IF NOT EXISTS idx_table_column 
ON public.table_name(column_name);
```

### 7. Use Descriptive Names

Migration file names should be descriptive:
- ✅ `20251209135434_add_user_preferences.sql`
- ❌ `20251209135434_migration.sql`

## Common Migration Patterns

### Creating Tables

```sql
CREATE TABLE IF NOT EXISTS public.example_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.example_table ENABLE ROW LEVEL SECURITY;
```

### Creating Views

```sql
CREATE OR REPLACE VIEW public.example_view AS
SELECT 
  t.id,
  t.name,
  u.email
FROM public.example_table t
JOIN auth.users u ON t.user_id = u.id;
```

### Creating RPC Functions

```sql
CREATE OR REPLACE FUNCTION public.get_user_data(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    u.email
  FROM public.example_table t
  JOIN auth.users u ON t.user_id = u.id
  WHERE t.user_id = p_user_id;
END;
$$;
```

### Adding Columns

```sql
ALTER TABLE public.example_table
ADD COLUMN IF NOT EXISTS new_column TEXT;
```

### Modifying Columns

```sql
ALTER TABLE public.example_table
ALTER COLUMN existing_column TYPE TEXT;
```

### Creating Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_example_user_id 
ON public.example_table(user_id);
```

## Troubleshooting

### Migration Fails

1. Check the error message in the Supabase dashboard
2. Verify SQL syntax
3. Ensure dependencies exist (tables, functions, etc.)
4. Check for conflicts with existing schema

### Types Not Updating

After applying migrations, always regenerate types:

```bash
npm run supabase:types
```

### Migration Already Applied

If a migration shows as already applied but you need to modify it:
1. Create a new migration with the fix
2. Or rollback and recreate (be careful with production data)

## Related Commands

- `npm run supabase:types` - Generate TypeScript types from schema
- `npm run supabase:db:pull` - Pull remote schema to local
- `npm run supabase:db:push` - Push local migrations to remote

## Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

