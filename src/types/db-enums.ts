import type { Database } from "./supabase-types";

// ============================================================================
// DATABASE ENUM ALIASES
// Centralized enum type aliases from Database schema
// ============================================================================

export type CoffeeStatusEnum =
  Database["public"]["Enums"]["coffee_status_enum"];
export type RoastLevelEnum = Database["public"]["Enums"]["roast_level_enum"];
export type ProcessEnum = Database["public"]["Enums"]["process_enum"];
export type SpeciesEnum = Database["public"]["Enums"]["species_enum"];
export type PlatformEnum = Database["public"]["Enums"]["platform_enum"];
export type GrindEnum = Database["public"]["Enums"]["grind_enum"];
export type SensoryConfidenceEnum =
  Database["public"]["Enums"]["sensory_confidence_enum"];
export type SensorySourceEnum =
  Database["public"]["Enums"]["sensory_source_enum"];
export type UserRoleEnum = Database["public"]["Enums"]["user_role_enum"];
export type MemberRoleEnum = Database["public"]["Enums"]["member_role_enum"];
export type RunStatusEnum = Database["public"]["Enums"]["run_status_enum"];
export type RunTypeEnum = Database["public"]["Enums"]["run_type_enum"];
export type ReviewEntityTypeEnum =
  Database["public"]["Enums"]["review_entity_type"];
export type ReviewStatusEnum = Database["public"]["Enums"]["review_status"];
export type CuratorTypeEnum = Database["public"]["Enums"]["curator_type_enum"];
export type LinkPlatformEnum =
  Database["public"]["Enums"]["link_platform_enum"];

// ============================================================================
// JSON TYPE
// ============================================================================

export type Json = Database["public"]["Tables"]["coffees"]["Row"]["source_raw"];
