"use server";

import { mergeCoffeeViewsFromAnon } from "@/app/actions/coffee-views";
import { mergeReviewsFromAnon } from "@/app/actions/reviews";

/**
 * Run anonymous identity merges after sign-in (coffee_views then reviews).
 * Safe to call when `anonId` is missing (no-op); each merge is idempotent.
 */
export async function runPostLoginAnonMerges(
  anonId: string | null | undefined
): Promise<void> {
  if (!anonId || typeof anonId !== "string") {
    return;
  }
  await mergeCoffeeViewsFromAnon(anonId);
  await mergeReviewsFromAnon(anonId);
}
