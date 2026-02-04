/**
 * Data Access Layer
 *
 * This module provides a centralized data access layer following Next.js 16
 * and Supabase best practices. All database queries and data transformations
 * should go through this layer to ensure:
 *
 * 1. Security: Access control is enforced before data is returned
 * 2. Consistency: Same data access patterns across the application
 * 3. Type Safety: DTOs ensure only safe data is passed to Client Components
 * 4. Performance: React cache() ensures efficient data fetching
 *
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

// Auth utilities
export { getCurrentUser, isAuthenticated } from "./auth";

// User profile DTOs and functions
export {
  getProfileDTO,
  getMyProfileDTO,
  profileExists,
  type PublicProfileDTO,
  type PrivateProfileDTO,
} from "./user-dto";

// User roles and permissions
export {
  getUserRoles,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  isAdminOrOperator,
  isAdmin,
} from "./user-roles";

// Curations (curators and curation lists)
export {
  getCuratorBySlug,
  getAllCurators,
  type CuratorDTO,
  type CuratorPageDTO,
  type CuratorLinkDTO,
  type CurationListDTO,
  type CurationSelectionDTO,
} from "./curations";
