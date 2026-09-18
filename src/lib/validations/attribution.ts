import { z } from "zod";

/**
 * Shape of the `icb_attribution` cookie. The cookie is client-writable, and its
 * contents are stored verbatim in `user_profiles.attribution`, so this is a
 * trust boundary: parse it, never cast it.
 *
 * Strings are length-capped so a hand-edited cookie cannot push arbitrary bulk
 * into the column, and unknown keys are stripped rather than persisted.
 */
const utmValue = z.string().trim().min(1).max(256);

export const attributionSchema = z
  .object({
    original_source: utmValue,
    original_campaign: utmValue.optional(),
    original_content: utmValue.optional(),
    touchpoints: z.number().int().nonnegative().max(10_000),
    first_visit_time: z.number().int().nonnegative(),
    last_visit_time: z.number().int().nonnegative(),
    session_quality_score: z.number().min(0).max(5),
  })
  .strip();

export type Attribution = z.infer<typeof attributionSchema>;
