import type { NextRequest } from "next/server";
import { serveBadgeRedirect } from "@/lib/badges/serve";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return serveBadgeRedirect(req, slug);
}
