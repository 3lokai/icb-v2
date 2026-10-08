import type { NextRequest } from "next/server";
import { serveBadgeSvg } from "@/lib/badges/serve";

// /badges/roaster/<slug>.svg
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  return serveBadgeSvg(req, file.replace(/\.svg$/, ""));
}
