"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { CommunityPlatformSchema } from "@/types/community-types";
import { z } from "zod";

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
    return { error: validated.error.issues[0]?.message ?? "Invalid input." };
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

  // RLS on communities is admin/operator-only for INSERT, so a regular
  // user's client always fails. Auth + validation happen above; the row is
  // forced inactive, so the service role is safe here.
  const admin = await createServiceRoleClient();
  const { error } = await admin.from("communities").insert({
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

  // Submissions are inactive until reviewed, so there's nothing to revalidate.
  return { success: true };
}
