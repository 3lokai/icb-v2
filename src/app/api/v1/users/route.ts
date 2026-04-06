import { NextResponse } from "next/server";
import { z } from "zod";
import { rpcEnsureExternalIdentity } from "@/lib/api/ensure-external-identity";
import { getExternalUserIdHash } from "@/lib/api/external-user-id-hash";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { createApiRouteClient } from "@/lib/supabase/api-route";

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
  try {
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

    const hashed = getExternalUserIdHash(auth.keyId, body.external_user_id);
    if (!hashed.ok) return hashed.response;

    const supabase = createApiRouteClient();
    const ensured = await rpcEnsureExternalIdentity(
      supabase,
      auth.keyId,
      hashed.hash
    );

    if (!ensured.ok) {
      console.error("[API v1 /users] ensure_external_identity error:", ensured);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ anon_id: ensured.anonId });
  } catch (error) {
    console.error("[API v1 /users] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
