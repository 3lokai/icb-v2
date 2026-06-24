import { z } from "zod";

/**
 * Shape of the signature-verified Sanity publish webhook payload.
 *
 * The webhook is configured with projection `{ _type, "slug": slug.current }`,
 * so `slug` is normally a string — but we tolerate the raw `{ current }` object
 * and reject anything else. Unknown extra fields are allowed (passthrough) so a
 * broader projection doesn't break validation.
 */
export const sanityWebhookPayloadSchema = z
  .object({
    _type: z.string().min(1),
    slug: z
      .union([z.string(), z.object({ current: z.string() }).passthrough()])
      .nullish(),
  })
  .passthrough();

export type SanityWebhookPayload = z.infer<typeof sanityWebhookPayloadSchema>;
