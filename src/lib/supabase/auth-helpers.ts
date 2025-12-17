import { createClient as createBrowserClient } from "./client";
import { createClient as createServerClient } from "./server";

// Client-side auth helpers
export const auth = {
  async signIn(email: string, password: string) {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(email: string, password: string) {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
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
