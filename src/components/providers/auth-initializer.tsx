"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/zustand/auth-store";

/**
 * AuthInitializer - Initializes the Zustand auth store
 * 
 * This component should be placed in the root layout to initialize
 * auth state on app load. It replaces the need for AuthProvider.
 * 
 * Usage:
 * ```tsx
 * <QueryProvider>
 *   <AuthInitializer>
 *     {children}
 *   </AuthInitializer>
 * </QueryProvider>
 * ```
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return <>{children}</>;
}

