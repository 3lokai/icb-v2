import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Get current authenticated user (cached per request)
 *
 * Uses React cache() to ensure the same user is returned across multiple calls
 * in the same request without re-fetching. This follows Next.js 16 best practices
 * for data fetching in Server Components.
 *
 * @returns User object with minimal safe fields, or null if not authenticated
 *
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * if (!user) redirect('/auth');
 * ```
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Return minimal user object - only safe, public fields
  // Don't expose tokens, secrets, or sensitive metadata
  return {
    id: user.id,
    email: user.email ?? null,
    // Only include fields that are safe to use in Server Components
    // The full user object from Supabase Auth is not serialized to client
  };
});

/**
 * Check if user is authenticated
 *
 * @returns true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
