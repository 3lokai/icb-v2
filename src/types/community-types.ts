import { z } from "zod";

export const CommunityPlatformSchema = z.enum([
  "whatsapp",
  "discord",
  "telegram",
  "facebook_group",
  "reddit",
  "other",
]);

export type CommunityPlatform = z.infer<typeof CommunityPlatformSchema>;

export type CommunityDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  platform: CommunityPlatform;
  invite_url: string;
  icon_url?: string;
  member_count?: string;
  moderators: string[];
  language: string;
  tags: string[];
};
