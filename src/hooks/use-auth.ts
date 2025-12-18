/**
 * Compatibility hook for useAuth - wraps Zustand store
 * 
 * This maintains the same API as the old Context-based useAuth,
 * making migration seamless. All components can continue using
 * `useAuth()` without changes.
 * 
 * @deprecated Consider using useAuthStore directly for better performance
 */
import { useAuthStore } from "@/store/zustand/auth-store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const signInWithOAuth = useAuthStore((state) => state.signInWithOAuth);
  const signOut = useAuthStore((state) => state.signOut);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    refreshUser,
  };
}

