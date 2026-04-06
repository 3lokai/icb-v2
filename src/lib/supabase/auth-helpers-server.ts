import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Server-only auth helpers (cookie session). Do not import from client components.
 */
export const serverAuth = {
  async getUser() {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },
};
