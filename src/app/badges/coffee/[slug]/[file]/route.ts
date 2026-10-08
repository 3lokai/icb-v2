import type { NextRequest } from "next/server";
import { serveBadgeSvg } from "@/lib/badges/serve";

// /badges/coffee/<roaster-slug>/<coffee-slug>.svg
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; file: string }> }
) {
  const { slug, file } = await params;
  return serveBadgeSvg(req, slug, file.replace(/\.svg$/, ""));
}
