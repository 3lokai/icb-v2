"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type Announcement = {
  id: string;
  message: string;
  link: string | null;
  is_active: boolean;
  created_at: string;
};

/**
 * Fetch the most recent active announcement from the database
 * Returns null if no active announcement exists
 */
export async function fetchActiveAnnouncement(): Promise<Announcement | null> {
  // Try to use service role client if available (bypasses RLS for server-side queries)
  // Fallback to regular client if service role key is not set
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("id, message, link, is_active, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no rows found, that's okay - just return null
    if (error.code === "PGRST116") {
      return null;
    }
    // For other errors, log but don't throw (banner is non-critical)
    console.error("Failed to fetch announcement:", error.message);
    return null;
  }

  return data;
}

