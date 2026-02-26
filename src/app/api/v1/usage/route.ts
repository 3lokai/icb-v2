import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { getUsageForKey } from "@/lib/api/usage";

/**
 * GET /api/v1/usage
 * Returns usage stats for the authenticated API key (the key used in the request).
 * Requires API key.
 */
export async function GET(request: Request) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  try {
    const usage = await getUsageForKey(auth.keyId);
    return NextResponse.json(usage);
  } catch (error) {
    console.error("[API v1 /usage] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch usage",
      },
      { status: 500 }
    );
  }
}
