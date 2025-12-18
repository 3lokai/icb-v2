"use server";

import 'server-only';

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Create a Supabase client with user session (respects RLS)
 * Use this for queries that need to respect Row Level Security policies
 * Uses the publishable (anon) key and handles cookies for SSR
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with service role (bypasses RLS)
 * Use this ONLY for server-side queries that need full access
 * Uses the secret (service role) key - bypasses all RLS policies
 * WARNING: Never expose the service role key to the client
 */
export async function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. Service role client cannot be created."
    );
  }

  // Use @supabase/supabase-js directly for service role (not @supabase/ssr)
  // Service role doesn't need cookie handling
  // Await to satisfy Next.js 16 async requirement for server actions
  return await Promise.resolve(
    createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  );
}
