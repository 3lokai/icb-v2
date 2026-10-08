import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { getUsageForKey } from "@/lib/api/usage";
import { safeErrorMessage } from "@/lib/api/error-response";

/**
 * GET /api/v1/usage
 * Returns usage stats for the authenticated API key (the key used in the request).
 * Requires API key.
 */
export async function GET(request: Request) {
  // Hoisted so every response after the key is accepted, errors included,
  // carries the rate-limit and quota headers.
  let headers: Record<string, string> | undefined;
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;
    headers = auth.headers;

    const usage = await getUsageForKey(auth.keyId);
    return NextResponse.json(usage, { headers });
  } catch (error) {
    console.error("[API v1 /usage] Unhandled error:", error);
    return NextResponse.json(
      { error: safeErrorMessage(error, "Internal server error") },
      { status: 500, headers }
    );
  }
}
