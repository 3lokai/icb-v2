import { createClient as createBrowserClient } from "./client";
import { createClient as createServerClient } from "./server";

// Client-side auth helpers
export const auth = {
  async signIn(email: string, password: string) {
    const supabase = createBrowserClient();

    // Validate inputs before making the request
    if (!email || !password) {
      return {
        data: null,
        error: { message: "Email and password are required" },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    // Log error details for debugging
    if (error) {
      console.error("Sign in error:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });
    }

    return { data, error };
  },

  async signUp(
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) {
    const supabase = createBrowserClient();

    // Validate inputs before making the request
    if (!email || !password) {
      return {
        data: null,
        error: { message: "Email and password are required" },
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: metadata,
      },
    });

    // Log error details for debugging
    if (error) {
      console.error("Sign up error:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });
    }

    return { data, error };
  },

  async signOut() {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getUser() {
    const supabase = createBrowserClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const supabase = createBrowserClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = createBrowserClient();
    return supabase.auth.onAuthStateChange(callback);
  },

  async signInWithOAuth(provider: "google" | "facebook", returnTo?: string) {
    const supabase = createBrowserClient();
    // Build callback URL with optional next parameter for post-auth redirect
    const baseCallback =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";
    // Append the return URL as 'next' param so callback knows where to redirect
    const redirectTo =
      returnTo && returnTo !== "/dashboard"
        ? `${baseCallback}?next=${encodeURIComponent(returnTo)}`
        : baseCallback;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
    return { data, error };
  },

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    const supabase = createBrowserClient();
    const redirectUrl =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : "/auth/reset-password");
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { data, error };
  },

  async updateUser(updates: { password: string }) {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.updateUser({
      password: updates.password,
    });
    return { data, error };
  },
};

// Server-side auth helpers
export const serverAuth = {
  async getUser() {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const supabase = await createServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },
};
