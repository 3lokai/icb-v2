# Scripts

## Supabase Type Generation

Generate TypeScript types from your Supabase schema:

```bash
npm run supabase:types
```

This will generate types directly from your linked Supabase project and write them to `src/types/supabase-types.ts`.

## Other Supabase Commands

- `npm run supabase:migration:new` - Create a new migration
- `npm run supabase:migration:list` - List all migrations
- `npm run supabase:migration:up` - Apply migrations
- `npm run supabase:migration:down` - Rollback migrations
- `npm run supabase:db:pull` - Pull database schema
- `npm run supabase:db:push` - Push database schema

## ConvertKit Migration

Migrate existing subscribers from Supabase to ConvertKit/Kit:

### Prerequisites

1. Run the database migration to add `convertkit_subscriber_id` column:
   ```bash
   npm run supabase:migration:up
   ```

2. Set your ConvertKit API key in `.env.local`:
   ```env
   KIT_API_KEY=your_api_key_here
   ```

### Running the Migration

You can run the migration using either:

```bash
npm run migrate:convertkit
```

or directly:

```bash
npx tsx scripts/migrate-to-convertkit.ts
```

### What It Does

1. **Fetches all newsletter subscribers** from:
   - `form_submissions` table (newsletter form submissions)
   - `user_profiles` table (users with `newsletter_subscribed = true`)

2. **Deduplicates by email** (form submissions take precedence for name)

3. **Enriches data** with:
   - User roles (from `user_roles` table)
   - Experience level, location (city, state, country)
   - Signup source (newsletter-signup vs user-registration)

4. **Subscribes to ConvertKit** in batches of 10 (to respect rate limits)

5. **Stores subscriber IDs** back to `user_profiles.convertkit_subscriber_id` for future unsubscribe operations

### Output

The script will show:
- Number of newsletter form submissions found
- Number of subscribed users found
- Total unique emails to migrate
- Progress for each batch
- Success/error counts
- Subscriber ID update status

### Notes

- The script uses upsert behavior, so running it multiple times is safe
- Rate limiting: 1 second delay between batches
- Errors are logged but don't stop the migration
- Subscriber IDs are only stored for users with profiles (not anonymous form submissions)
