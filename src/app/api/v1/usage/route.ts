import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { getUsageForKey } from "@/lib/api/usage";

/**
 * GET /api/v1/usage
 * Returns usage stats for the authenticated API key (the key used in the request).
 * Requires API key.
 */
export async function GET(request: Request) {
  try {
    const auth = await validateApiKey(request);
    if ("error" in auth) return auth.error;

    const usage = await getUsageForKey(auth.keyId);
    return NextResponse.json(usage);
  } catch (error) {
    console.error("[API v1 /usage] Unhandled error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
