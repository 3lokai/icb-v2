# 🏗️ **PHASE 0: AUTH INFRASTRUCTURE SETUP PRD**
## IndianCoffeeBeans.com - Foundation Layer

**Version:** 1.0  
**Timeline:** 2 days  
**Status:** Ready for Implementation  
**Prerequisites:** Existing Supabase project + Next.js 15 app

---

## 📊 **EXECUTIVE SUMMARY**

Establish the foundational authentication infrastructure that will support all future user-facing features. This includes Supabase client/server setup, middleware configuration, and core type definitions.

**Key Outcomes:**
- 🔐 Secure auth infrastructure ready for production
- 🛡️ Route protection system in place
- 🎯 Type-safe auth state management
- ⚡ Optimized server/client separation

---

## 🎯 **PHASE 0 OBJECTIVES**

### **Core Infrastructure**
- ✅ Enhanced Supabase server.ts configuration
- ✅ Enhanced Supabase client.ts configuration  
- ✅ Next.js 15 middleware with route protection
- ✅ Type definitions for auth system
- ✅ Error handling and session management
- ✅ Development vs Production configurations

### **File Structure Setup**
```
src/
├── lib/
│   ├── supabase/
│   │   ├── server.ts          # Server-side Supabase client
│   │   ├── client.ts          # Client-side Supabase client
│   │   └── middleware.ts      # Middleware utilities
│   └── auth/
│       ├── config.ts          # Auth configuration
│       ├── session.ts         # Session management
│       └── errors.ts          # Auth error handling
├── types/
│   ├── auth.ts               # Auth-related types
│   └── supabase-auth.ts      # Extended Supabase auth types
├── middleware.ts             # Next.js middleware
└── app/
    └── auth/
        └── callback/
            └── route.ts      # OAuth callback handler
```

---

## 🗄️ **SUPABASE CONFIGURATION**

### **Enhanced server.ts**
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )
}

// Helper function to get current user server-side
export async function getCurrentUser() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Exception getting user:', error)
    return null
  }
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error getting user profile:', error)
      return null
    }
    
    return profile
  } catch (error) {
    console.error('Exception getting user profile:', error)
    return null
  }
}

// Helper function to check user role
export async function getUserRole(userId: string): Promise<string | null> {
  const supabase = createClient()
  
  try {
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error getting user role:', error)
      return 'user' // Default role
    }
    
    return roleData?.role || 'user'
  } catch (error) {
    console.error('Exception getting user role:', error)
    return 'user'
  }
}
```

### **Enhanced client.ts**
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // Create a singleton instance
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        },
        global: {
          headers: {
            'x-application-name': 'IndianCoffeeBeans'
          }
        }
      }
    )
  }
  
  return client
}

// Helper function for client-side auth state
export function getSupabaseAuth() {
  const supabase = createClient()
  return supabase.auth
}

// Helper function to sign out
export async function signOut() {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    
    // Clear any local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
    }
    
    return { success: true }
  } catch (error) {
    console.error('Exception during sign out:', error)
    throw error
  }
}

// Helper function for social auth
export async function signInWithProvider(provider: 'google' | 'facebook') {
  const supabase = createClient()
  
  const redirectTo = `${window.location.origin}/auth/callback`
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    
    if (error) {
      console.error(`Error signing in with ${provider}:`, error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error(`Exception during ${provider} sign in:`, error)
    throw error
  }
}
```

### **Middleware utilities**
```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Store user info in headers for access in pages
  if (user) {
    supabaseResponse.headers.set('x-user-id', user.id)
    supabaseResponse.headers.set('x-user-email', user.email || '')
  }

  return { supabaseResponse, user }
}

// Helper to check if route requires auth
export function isProtectedRoute(pathname: string): boolean {
  const protectedPrefixes = [
    '/profile',
    '/tools',
    '/settings'
  ]
  
  return protectedPrefixes.some(prefix => pathname.startsWith(prefix))
}

// Helper to check if route is auth page
export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/')
}

// Helper to check admin routes
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin/')
}
```

---

## 🛡️ **MIDDLEWARE CONFIGURATION**

### **Next.js 15 middleware.ts**
```typescript
// middleware.ts (root level)
import { NextRequest } from 'next/server'
import { updateSession, isProtectedRoute, isAuthRoute, isAdminRoute } from '@/lib/supabase/middleware'
import { getUserRole } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Update auth session
  const { supabaseResponse, user } = await updateSession(request)
  
  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      // Redirect to sign in with return URL
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('from', pathname)
      redirectUrl.searchParams.set('message', 'signin-required')
      
      return Response.redirect(redirectUrl)
    }
  }
  
  // Handle admin routes
  if (isAdminRoute(pathname)) {
    if (!user) {
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('from', pathname)
      redirectUrl.searchParams.set('message', 'admin-access-required')
      
      return Response.redirect(redirectUrl)
    }
    
    // Check admin role
    const userRole = await getUserRole(user.id)
    if (userRole !== 'admin') {
      // Redirect to home with error
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('error', 'insufficient-permissions')
      
      return Response.redirect(redirectUrl)
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && user && pathname !== '/auth/callback') {
    const from = request.nextUrl.searchParams.get('from')
    const redirectUrl = new URL(from || '/', request.url)
    
    return Response.redirect(redirectUrl)
  }
  
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 🔐 **AUTH CONFIGURATION**

### **Auth config and helpers**
```typescript
// src/lib/auth/config.ts
export const authConfig = {
  providers: {
    google: {
      enabled: true,
      scopes: 'email profile'
    },
    facebook: {
      enabled: process.env.NODE_ENV === 'production', // Only in prod due to app review
      scopes: 'email public_profile'
    },
    email: {
      enabled: true,
      requireEmailConfirmation: true
    }
  },
  
  session: {
    duration: 30 * 24 * 60 * 60, // 30 days in seconds
    autoRefresh: true
  },
  
  redirectUrls: {
    afterSignIn: '/',
    afterSignUp: '/auth/onboarding',
    afterSignOut: '/',
    afterEmailConfirmation: '/profile'
  },
  
  rateLimit: {
    signInAttempts: 5,
    signUpAttempts: 3,
    passwordResetAttempts: 3,
    timeWindow: 15 * 60 * 1000 // 15 minutes
  }
}

// Helper function to get redirect URL after auth
export function getRedirectUrl(from?: string): string {
  if (from && from !== '/auth/signin' && from !== '/auth/signup') {
    return from
  }
  
  return authConfig.redirectUrls.afterSignIn
}
```

### **Session management**
```typescript
// src/lib/auth/session.ts
import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { User, Session } from '@supabase/supabase-js'

// Client-side session management
export class SessionManager {
  private static instance: SessionManager
  private supabase = createClient()
  
  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }
  
  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        return null
      }
      
      return session
    } catch (error) {
      console.error('Exception getting session:', error)
      return null
    }
  }
  
  async getUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting user:', error)
        return null
      }
      
      return user
    } catch (error) {
      console.error('Exception getting user:', error)
      return null
    }
  }
  
  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }
  
  async refreshSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        return null
      }
      
      return session
    } catch (error) {
      console.error('Exception refreshing session:', error)
      return null
    }
  }
}

// Server-side session utilities
export async function getServerSession() {
  const supabase = createServerClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting server session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Exception getting server session:', error)
    return null
  }
}
```

### **Error handling**
```typescript
// src/lib/auth/errors.ts
import { AuthError } from '@supabase/supabase-js'

export interface AuthErrorInfo {
  message: string
  code: string
  userMessage: string
  retry: boolean
}

export function handleAuthError(error: AuthError | Error): AuthErrorInfo {
  // Handle Supabase-specific auth errors
  if ('status' in error) {
    const authError = error as AuthError
    
    switch (authError.status) {
      case 400:
        if (authError.message.includes('Invalid login credentials')) {
          return {
            message: authError.message,
            code: 'INVALID_CREDENTIALS',
            userMessage: 'Invalid email or password. Please try again.',
            retry: true
          }
        }
        if (authError.message.includes('Email not confirmed')) {
          return {
            message: authError.message,
            code: 'EMAIL_NOT_CONFIRMED',
            userMessage: 'Please check your email and click the confirmation link.',
            retry: false
          }
        }
        break
        
      case 422:
        if (authError.message.includes('User already registered')) {
          return {
            message: authError.message,
            code: 'USER_EXISTS',
            userMessage: 'An account with this email already exists. Try signing in instead.',
            retry: false
          }
        }
        break
        
      case 429:
        return {
          message: authError.message,
          code: 'RATE_LIMITED',
          userMessage: 'Too many attempts. Please wait a few minutes before trying again.',
          retry: true
        }
        
      default:
        break
    }
  }
  
  // Generic error handling
  return {
    message: error.message,
    code: 'UNKNOWN_ERROR',
    userMessage: 'Something went wrong. Please try again.',
    retry: true
  }
}

export class AuthErrorBoundary {
  static handle(error: unknown): AuthErrorInfo {
    if (error instanceof Error) {
      return handleAuthError(error)
    }
    
    return {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      userMessage: 'Something went wrong. Please try again.',
      retry: true
    }
  }
}
```

---

## 📝 **TYPE DEFINITIONS**

### **Auth types**
```typescript
// src/types/auth.ts
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserRole = Database['public']['Tables']['user_roles']['Row']

export interface AuthUser extends User {
  profile?: UserProfile
  role?: string
}

export interface AuthSession extends Session {
  user: AuthUser
}

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  initialized: boolean
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName: string
}

export interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  signIn: (credentials: SignInCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

export type AuthProvider = 'google' | 'facebook' | 'email'

export interface AuthRedirectState {
  from?: string
  message?: string
  error?: string
}
```

### **Extended Supabase types**
```typescript
// src/types/supabase-auth.ts
import type { Database } from '@/types/supabase'

// Helper types for auth-related database operations
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type UserRoleInsert = Database['public']['Tables']['user_roles']['Insert']

export type NotificationPreferencesInsert = Database['public']['Tables']['user_notification_preferences']['Insert']
export type NotificationPreferencesUpdate = Database['public']['Tables']['user_notification_preferences']['Update']

// Auth response types
export interface AuthResponse {
  success: boolean
  error?: string
  user?: AuthUser
  redirectTo?: string
}

export interface ProfileCreationData {
  fullName: string
  city?: string
  state?: string
  experienceLevel?: 'beginner' | 'enthusiast' | 'expert'
  preferredBrewingMethods?: string[]
}
```

---

## 🔧 **OAUTH CALLBACK HANDLER**

### **Auth callback route**
```typescript
// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  
  if (code) {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${origin}/auth/signin?error=callback_failed`)
      }
      
      if (data.user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single()
        
        // If no profile or onboarding not completed, redirect to onboarding
        if (!profile || !profile.onboarding_completed) {
          return NextResponse.redirect(`${origin}/auth/onboarding`)
        }
        
        // Otherwise redirect to intended destination
        const redirectUrl = next.startsWith('/') ? `${origin}${next}` : authConfig.redirectUrls.afterSignIn
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Exception during auth callback:', error)
      return NextResponse.redirect(`${origin}/auth/signin?error=callback_exception`)
    }
  }
  
  // Return to sign in page if no code
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code`)
}
```

---

## 🧪 **TESTING CONFIGURATION**

### **Environment variables required**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional for Facebook auth
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### **Development setup checklist**
- [ ] Supabase project configured
- [ ] Auth providers enabled in Supabase dashboard
- [ ] Redirect URLs added to Supabase auth settings
- [ ] Environment variables set
- [ ] Database schema deployed

---

## 🚀 **IMPLEMENTATION STEPS**

### **Day 1: Core Infrastructure**
1. ✅ Update/create `src/lib/supabase/server.ts`
2. ✅ Update/create `src/lib/supabase/client.ts`
3. ✅ Create `src/lib/supabase/middleware.ts`
4. ✅ Create type definitions in `src/types/auth.ts`
5. ✅ Test Supabase connection and auth state

### **Day 2: Middleware & Routing**
1. ✅ Create/update `middleware.ts` in root
2. ✅ Create auth configuration in `src/lib/auth/config.ts`
3. ✅ Create session management in `src/lib/auth/session.ts`
4. ✅ Create error handling in `src/lib/auth/errors.ts`
5. ✅ Create OAuth callback route
6. ✅ Test route protection and redirects

---

## ✅ **ACCEPTANCE CRITERIA**

### **Functional Requirements**
- [ ] Server-side auth client properly configured
- [ ] Client-side auth client properly configured
- [ ] Middleware protects `/tools`, `/profile`, `/settings` routes
- [ ] OAuth callback handler works for Google/Facebook
- [ ] Session management handles refresh automatically
- [ ] Error handling provides user-friendly messages
- [ ] Type safety enforced throughout auth system

### **Non-Functional Requirements**
- [ ] Auth state updates within 100ms
- [ ] Middleware adds <50ms to request processing
- [ ] No memory leaks in client-side auth state
- [ ] Proper error logging for debugging
- [ ] GDPR-compliant session handling

---

## 🔍 **TESTING SCENARIOS**

### **Authentication Flow Tests**
1. **Sign in with valid credentials** → Success
2. **Sign in with invalid credentials** → Error message
3. **Access protected route without auth** → Redirect to sign in
4. **OAuth callback success** → Redirect to intended page
5. **OAuth callback failure** → Redirect to sign in with error
6. **Session refresh** → Automatic refresh works
7. **Sign out** → Clear session and redirect

### **Middleware Tests**
1. **Public route access** → No restrictions
2. **Protected route without auth** → Redirect to sign in
3. **Auth route with existing session** → Redirect away
4. **Admin route without admin role** → Access denied

---

## 🚨 **POTENTIAL ISSUES & SOLUTIONS**

### **Common Issues**
| Issue | Solution |
|-------|----------|
| Infinite redirect loops | Add proper route detection in middleware |
| Session not persisting | Ensure cookies are properly configured |
| OAuth callback fails | Check redirect URLs in provider settings |
| TypeScript errors | Ensure all types are properly imported |
| Rate limiting false positives | Implement proper IP detection |

### **Development vs Production**
- **Development**: More verbose logging, relaxed rate limits
- **Production**: Strict error handling, security headers, monitoring

---

## 📊 **SUCCESS METRICS**

### **Technical KPIs**
- ✅ Auth state loads in <200ms
- ✅ Zero auth-related console errors
- ✅ 100% TypeScript coverage for auth code
- ✅ Middleware processing time <50ms
- ✅ Session refresh success rate >99%

### **UX KPIs**
- ✅ OAuth callback success rate >95%
- ✅ User can access protected routes immediately after auth
- ✅ Error messages are helpful and actionable
- ✅ No unexpected logouts during normal usage

---

## 🔄 **POST-IMPLEMENTATION**

### **Validation Steps**
1. Test all auth flows in development
2. Verify middleware protection works
3. Test OAuth providers (Google first, Facebook when approved)
4. Check error handling edge cases
5. Validate type safety with TypeScript strict mode

### **Ready for Phase 1A**
Once Phase 0 is complete, you'll have:
- ✅ Solid auth foundation
- ✅ Protected routes working
- ✅ Session management in place
- ✅ Ready to build auth pages and components

---

**Next Steps After Phase 0:**
1. ✅ Build auth pages (`/auth/signin`, `/auth/signup`)
2. ✅ Create onboarding flow
3. ✅ Build profile system
4. ✅ Implement rating migration

**Ready to build the foundation?** Let's start with the server and client configurations! 🚀