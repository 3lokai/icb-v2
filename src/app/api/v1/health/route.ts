import { NextResponse } from "next/server";

/**
 * GET /api/v1/health
 * Public health check — no API key required
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV,
  });
}
