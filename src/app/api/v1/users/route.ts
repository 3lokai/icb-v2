import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { createServiceRoleClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  external_user_id: z.string().min(1, "external_user_id is required"),
  display_name: z.string().optional(),
});

/**
 * POST /api/v1/users
 * Register an external user and get a stable anon_id for use in reviews.
 * Requires API key.
 */
export async function POST(request: Request) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await request.json();
    body = bodySchema.parse(raw);
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues.map((e: { message: string }) => e.message).join("; ")
        : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const externalIdHash = createHash("sha256")
    .update(body.external_user_id, "utf8")
    .digest("hex");

  const supabase = await createServiceRoleClient();

  const { data: existing } = await supabase
    .from("external_user_identities")
    .select("anon_id")
    .eq("key_id", auth.keyId)
    .eq("external_user_id", externalIdHash)
    .single();

  if (existing) {
    return NextResponse.json({ anon_id: existing.anon_id });
  }

  const anonId = randomUUID();
  const { error } = await supabase.from("external_user_identities").insert({
    key_id: auth.keyId,
    external_user_id: externalIdHash,
    anon_id: anonId,
  });

  if (error) {
    console.error("[API v1 /users] insert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ anon_id: anonId });
}
