import { z } from "zod";

export const toggleWishlistSchema = z.object({
  coffeeId: z.string().uuid("Invalid coffee ID"),
});

export type ToggleWishlistFormData = z.infer<typeof toggleWishlistSchema>;
