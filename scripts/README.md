# Supabase Type Generation Scripts

## Generating Types

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
