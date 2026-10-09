import type { NextRequest } from "next/server";
import { serveBadgeRedirect } from "@/lib/badges/serve";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; coffeeSlug: string }> }
) {
  const { slug, coffeeSlug } = await params;
  return serveBadgeRedirect(req, slug, coffeeSlug);
}
