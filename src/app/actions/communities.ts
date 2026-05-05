"use server";

import { createClient } from "@/lib/supabase/server";
import { CommunityPlatformSchema } from "@/types/community-types";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const submissionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  platform: CommunityPlatformSchema,
  invite_url: z.string().url("Invalid URL").min(1, "Invite URL is required"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  moderators: z.string().optional().or(z.literal("")),
});

export async function submitCommunityAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to submit a community." };
  }

  const rawData = {
    name: formData.get("name"),
    platform: formData.get("platform"),
    invite_url: formData.get("invite_url"),
    description: formData.get("description"),
    tags: formData.get("tags"),
    moderators: formData.get("moderators"),
  };

  const validated = submissionSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { name, platform, invite_url, description, tags, moderators } =
    validated.data;

  // Simple slug generation
  const slugBase = name
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const slug = `${slugBase}-${randomSuffix}`;

  const { error } = await supabase.from("communities").insert({
    name,
    slug,
    platform,
    invite_url,
    description: description || "",
    tags: tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    moderators: moderators
      ? moderators
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean)
      : [],
    is_active: false, // Default to inactive for review
  });

  if (error) {
    console.error("Error inserting community", {
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return { error: "Failed to submit community. Please try again." };
  }

  revalidateTag("communities");
  return { success: true };
}
