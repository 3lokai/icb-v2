/**
 * Centralized query keys for TanStack Query
 *
 * This file helps prevent cache key chaos by providing a single source of truth
 * for all query keys used throughout the application.
 *
 * Usage:
 * import { queryKeys } from "@/lib/query-keys";
 *
 * // In your query
 * queryKey: queryKeys.user.all
 *
 * // In your mutation invalidation
 * invalidateQueries: [queryKeys.user.all]
 */

export const queryKeys = {
  // User-related queries
  user: {
    all: ["user"] as const,
    profile: (id: string) => ["user", "profile", id] as const,
    settings: (id: string) => ["user", "settings", id] as const,
  },

  // Profile-related queries
  profile: {
    all: ["profile"] as const,
    current: ["profile", "current"] as const,
    coffeePreferences: ["profile", "coffee-preferences"] as const,
    notifications: ["profile", "notifications"] as const,
    privacy: ["profile", "privacy"] as const,
  },

  // Posts (example)
  posts: {
    all: ["posts"] as const,
    list: (filters?: Record<string, any>) =>
      ["posts", "list", filters] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
    byUser: (userId: string) => ["posts", "byUser", userId] as const,
  },

  // Comments (example)
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) => ["comments", "byPost", postId] as const,
  },

  // Auth-related queries
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },

  // Coffee-related queries
  coffees: {
    all: ["coffees"] as const,
    list: (
      filters: Record<string, any> | undefined,
      page: number,
      limit: number,
      sort: string
    ) => ["coffees", "list", { filters, page, limit, sort }] as const,
    filterMeta: (filters: Record<string, any> | undefined) =>
      ["coffees", "filter-meta", filters] as const,
  },

  // Roaster-related queries
  roasters: {
    all: ["roasters"] as const,
    list: (
      filters: Record<string, any> | undefined,
      page: number,
      limit: number,
      sort: string
    ) => ["roasters", "list", { filters, page, limit, sort }] as const,
    filterMeta: (filters: Record<string, any> | undefined) =>
      ["roasters", "filter-meta", filters] as const,
  },

  // Review-related queries
  reviews: {
    all: ["reviews"] as const,
    byEntity: (entityType: string, entityId: string) =>
      ["reviews", "byEntity", entityType, entityId] as const,
    stats: (entityType: string, entityId: string) =>
      ["reviews", "stats", entityType, entityId] as const,
    latest: (entityType: string, entityId: string) =>
      ["reviews", "latest", entityType, entityId] as const,
    myReviews: ["reviews", "my"] as const,
  },

  // Curations (curators and curation lists)
  curations: {
    all: ["curations"] as const,
    list: () => ["curations", "list"] as const,
    detail: (slug: string) => ["curations", "detail", slug] as const,
  },
} as const;

// Type helper for query keys
export type QueryKeys = typeof queryKeys;
