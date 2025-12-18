# Data Access Layer

This directory contains the Data Access Layer for the application, following Next.js 16 and Supabase best practices for secure, type-safe data fetching.

## Architecture

The Data Access Layer provides:

1. **Centralized Data Access**: All database queries go through this layer
2. **Access Control**: Authorization checks before data is returned
3. **Type Safety**: DTOs (Data Transfer Objects) ensure only safe data reaches Client Components
4. **Performance**: React `cache()` ensures efficient data fetching per request
5. **Security**: `'server-only'` markers prevent accidental client-side execution

## Files

### `auth.ts`
- `getCurrentUser()` - Get current authenticated user (cached per request)
- `isAuthenticated()` - Check if user is authenticated

### `user-dto.ts`
- `getProfileDTO(userId)` - Get public profile with access control
- `getMyProfileDTO()` - Get current user's full profile (private fields)
- `profileExists(userId)` - Check if profile exists
- `PublicProfileDTO` - Type for public profile data (safe for client)
- `PrivateProfileDTO` - Type for private profile data (owner only)

### `user-roles.ts`
- `getUserRoles()` - Get all roles for current user
- `hasRole(role)` - Check if user has specific role
- `hasAnyRole(roles)` - Check if user has any of the roles
- `hasAllRoles(roles)` - Check if user has all of the roles
- `isAdminOrOperator()` - Check if user is admin or operator
- `isAdmin()` - Check if user is admin

## Usage Examples

### Server Component - Get Current User

```typescript
import { getCurrentUser } from '@/data';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth');
  }
  
  return <div>Hello, {user.email}!</div>;
}
```

### Server Component - Get User Profile

```typescript
import { getProfileDTO } from '@/data';
import { notFound } from 'next/navigation';
import ProfileClient from './profile-client';

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const profile = await getProfileDTO(id);
  
  if (!profile) {
    notFound();
  }
  
  // Safe to pass to Client Component - only public fields
  return <ProfileClient profile={profile} />;
}
```

### Server Component - Get Own Profile

```typescript
import { getMyProfileDTO } from '@/data';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const profile = await getMyProfileDTO();
  
  if (!profile) {
    redirect('/onboarding');
  }
  
  return <div>Welcome, {profile.full_name}!</div>;
}
```

### Server Action - Check Permissions

```typescript
'use server';

import { isAdmin } from '@/data';
import { createClient } from '@/lib/supabase/server';

export async function deletePost(postId: string) {
  // Always validate input
  if (typeof postId !== 'string') {
    throw new Error('Invalid post ID');
  }
  
  // Check permissions
  if (!(await isAdmin())) {
    throw new Error('Unauthorized');
  }
  
  // Perform action
  const supabase = await createClient();
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  
  if (error) {
    throw new Error('Failed to delete post');
  }
}
```

## Security Principles

1. **Never Trust Input**: Always validate `params`, `searchParams`, and action arguments
2. **Re-verify Authorization**: Check permissions in every Server Action
3. **Use DTOs**: Never pass raw database rows to Client Components
4. **Server-Only**: All files in this directory are marked with `'server-only'`
5. **RLS + Application Layer**: RLS provides base security, this layer adds defense in depth

## Best Practices

- ✅ Use `getCurrentUser()` instead of calling `supabase.auth.getUser()` directly
- ✅ Use DTOs when passing data to Client Components
- ✅ Always validate user input before using it
- ✅ Check permissions in Server Actions, not just Server Components
- ✅ Use `cache()` for functions that might be called multiple times in one request

## See Also

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [React Server Components Security](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#security)

