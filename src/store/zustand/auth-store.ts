import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { auth } from "@/lib/supabase/auth-helpers";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  refreshUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => Promise<{ error: any }>;
  signInWithOAuth: (
    provider: "google" | "facebook",
    returnTo?: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: true,
  initialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),

  refreshUser: async () => {
    try {
      const { user: authUser, error } = await auth.getUser();
      if (error) {
        set({ user: null, isLoading: false });
      } else {
        set({ user: authUser, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { error } = await auth.signIn(email, password);
    if (!error) {
      await get().refreshUser();
    }
    return { error };
  },

  signUp: async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    const { error } = await auth.signUp(email, password, metadata);
    if (!error) {
      await get().refreshUser();
    }
    return { error };
  },

  signInWithOAuth: async (
    provider: "google" | "facebook",
    returnTo?: string
  ) => {
    const { error } = await auth.signInWithOAuth(provider, returnTo);
    // OAuth redirects, so we don't need to refresh user here
    return { error };
  },

  signOut: async () => {
    const { error } = await auth.signOut();
    if (!error) {
      set({ user: null });
    }
    return { error };
  },

  initialize: async () => {
    if (get().initialized) {
      return;
    }

    set({ isLoading: true, initialized: true });

    // Initial user fetch
    await get().refreshUser();

    // Listen for auth state changes
    auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        set({ user: session?.user ?? null, isLoading: false });
      } else if (event === "SIGNED_OUT") {
        set({ user: null, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    });
  },
}));
