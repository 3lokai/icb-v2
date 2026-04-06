import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase-types";

/**
 * Returns stable anon_id for the hashed external id (see getExternalUserIdHash).
 */
export async function rpcEnsureExternalIdentity(
  supabase: SupabaseClient<Database>,
  keyId: string,
  externalUserIdHash: string
): Promise<
  | { ok: true; anonId: string }
  | { ok: false; message: string; details?: string }
> {
  const { data, error } = await supabase.rpc("ensure_external_identity", {
    p_key_id: keyId,
    p_external_user_id: externalUserIdHash,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
      details: error.details ?? undefined,
    };
  }

  if (data == null || typeof data !== "string") {
    return {
      ok: false,
      message: "ensure_external_identity returned no anon_id",
    };
  }

  return { ok: true, anonId: data };
}
