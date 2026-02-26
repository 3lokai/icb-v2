"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";

const API_KEY_PREFIX = "icb_live_";
const KEY_PREFIX_DISPLAY_LENGTH = 16;

type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type ApiKeyListItem = {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  rate_limit_rpm: number;
  created_at: string;
  last_used_at: string | null;
};

/**
 * Create a new API key. The raw key is returned only once and must be copied by the user.
 */
export async function createApiKey(
  name: string
): Promise<ActionResult<{ rawKey: string; keyId: string }>> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "You must be signed in to create an API key.",
    };
  }

  const trimmedName = name?.trim();
  if (!trimmedName || trimmedName.length < 1) {
    return { success: false, error: "Please enter a name for the key." };
  }

  const rawKey = `${API_KEY_PREFIX}${randomBytes(32).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey, "utf8").digest("hex");
  const keyPrefix = rawKey.slice(0, KEY_PREFIX_DISPLAY_LENGTH);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name: trimmedName,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      is_active: true,
      rate_limit_rpm: 60,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createApiKey] insert error:", error);
    return {
      success: false,
      error: error.message || "Failed to create API key.",
    };
  }

  revalidatePath("/dashboard/developer");
  return {
    success: true,
    data: { rawKey, keyId: data.id },
  };
}

/**
 * Revoke an API key (sets is_active = false). Only the owner can revoke.
 */
export async function revokeApiKey(keyId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "You must be signed in to revoke an API key.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[revokeApiKey] update error:", error);
    return {
      success: false,
      error: error.message || "Failed to revoke API key.",
    };
  }

  revalidatePath("/dashboard/developer");
  return { success: true };
}

/**
 * List API keys for the current user (no raw key or hash returned).
 */
export async function listApiKeys(): Promise<ActionResult<ApiKeyListItem[]>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be signed in to list API keys." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("api_keys")
    .select(
      "id, name, key_prefix, is_active, rate_limit_rpm, created_at, last_used_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listApiKeys] select error:", error);
    return {
      success: false,
      error: error.message || "Failed to list API keys.",
    };
  }

  const items: ApiKeyListItem[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    key_prefix: row.key_prefix,
    is_active: row.is_active ?? true,
    rate_limit_rpm: row.rate_limit_rpm ?? 60,
    created_at: row.created_at,
    last_used_at: row.last_used_at ?? null,
  }));

  return { success: true, data: items };
}

export type KeyUsage = {
  todayTotal: number;
  hourlyToday: { hour: string; count: number }[];
  dailyTotals: { date: string; count: number }[];
};

/**
 * Get usage stats for all of the current user's API keys.
 * Used by the developer portal charts.
 */
export async function getUsageForMyKeys(): Promise<
  ActionResult<Record<string, KeyUsage>>
> {
  const keysResult = await listApiKeys();
  if (!keysResult.success || !keysResult.data) {
    return { success: false, error: keysResult.error ?? "Failed to list keys" };
  }

  const { getUsageForKey } = await import("@/lib/api/usage");
  const out: Record<string, KeyUsage> = {};

  for (const key of keysResult.data) {
    const usage = await getUsageForKey(key.id);
    out[key.id] = usage;
  }

  return { success: true, data: out };
}
