import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for Route Handlers (/api/*) using the service role key.
 * Uses @supabase/supabase-js only (no SSR/cookies) so Authorization is not
 * overridden by a user session — RLS is bypassed as intended.
 */
export function createApiRouteClient() {
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is required for API routes (service role)."
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
