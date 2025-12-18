import 'server-only';

import { getCurrentUser } from './auth';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase-types';

type UserRole = Database['public']['Enums']['user_role_enum'];

/**
 * Get user roles for the current authenticated user
 * 
 * @returns Array of role strings, or empty array if not authenticated
 */
export async function getUserRoles(): Promise<UserRole[]> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }

  const supabase = await createClient();
  const { data: roles, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', currentUser.id);

  if (error || !roles) {
    return [];
  }

  return roles.map((r) => r.role);
}

/**
 * Check if current user has a specific role
 * 
 * @param role - The role to check for
 * @returns true if user has the role, false otherwise
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.includes(role);
}

/**
 * Check if current user has any of the specified roles
 * 
 * @param roles - Array of roles to check for
 * @returns true if user has any of the roles, false otherwise
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const userRoles = await getUserRoles();
  return roles.some((role) => userRoles.includes(role));
}

/**
 * Check if current user has all of the specified roles
 * 
 * @param roles - Array of roles to check for
 * @returns true if user has all of the roles, false otherwise
 */
export async function hasAllRoles(roles: UserRole[]): Promise<boolean> {
  const userRoles = await getUserRoles();
  return roles.every((role) => userRoles.includes(role));
}

/**
 * Check if current user is an admin or operator
 * 
 * @returns true if user is admin or operator, false otherwise
 */
export async function isAdminOrOperator(): Promise<boolean> {
  return hasAnyRole(['admin', 'operator']);
}

/**
 * Check if current user is an admin
 * 
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

