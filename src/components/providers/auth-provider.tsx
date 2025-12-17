"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "@/lib/supabase/auth-helpers";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: authUser, error } = await auth.getUser();
      if (error) {
        // Failed to get user
        setUser(null);
      } else {
        setUser(authUser);
      }
    } catch (_error) {
      // Error refreshing user
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await auth.signIn(email, password);
    if (!error) {
      await refreshUser();
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await auth.signUp(email, password);
    if (!error) {
      await refreshUser();
    }
    return { error };
  };

  const signOut = async () => {
    const { error } = await auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  useEffect(() => {
    // Initial user fetch
    refreshUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    // Initial user fetch
    refreshUser,
  ]);

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
