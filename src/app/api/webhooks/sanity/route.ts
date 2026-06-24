import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { submitToIndexNow } from "@/lib/seo/indexnow";
import {
  sanityWebhookPayloadSchema,
  type SanityWebhookPayload,
} from "@/lib/validations/sanity-webhook";

/**
 * POST /api/webhooks/sanity
 *
 * Fired by a Sanity webhook when learn content is published. It both
 * revalidates the affected path (closing the gap where Sanity edits previously
 * never triggered ISR revalidation) and pushes the URL to IndexNow.
 *
 * Configure in Sanity (Manage → API → Webhooks):
 *  - URL: <site>/api/webhooks/sanity
 *  - Trigger: on publish, filter `_type in ["article","category","series"]`
 *  - Projection: `{ _type, "slug": slug.current }`
 *  - Secret: SANITY_WEBHOOK_SECRET
 */

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
}

function slugOf(payload: SanityWebhookPayload): string | null {
  const { slug } = payload;
  if (!slug) return null;
  if (typeof slug === "string") return slug;
  return slug.current ?? null;
}

/** Map a Sanity document to its public learn path, or null if unhandled. */
function pathFor(payload: SanityWebhookPayload): string | null {
  const slug = slugOf(payload);
  if (!slug) return null;
  switch (payload._type) {
    case "article":
      return `/learn/${slug}`;
    case "category":
      return `/learn/category/${slug}`;
    case "series":
      return `/learn/series/${slug}`;
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "SANITY_WEBHOOK_SECRET not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.text();

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = sanityWebhookPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const payload = parsed.data;

  const path = pathFor(payload);
  if (!path) {
    return NextResponse.json({ ok: true, skipped: true, reason: "unhandled" });
  }

  // Revalidate the page itself; for articles also refresh the learn index.
  revalidatePath(path);
  if (payload._type === "article") {
    revalidatePath("/learn");
  }

  await submitToIndexNow([`${baseUrl().replace(/\/$/, "")}${path}`]);

  return NextResponse.json({ ok: true, revalidated: path });
}
