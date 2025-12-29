"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/header";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

/**
 * Conditionally renders Header and Footer based on the current route.
 * Excludes Header/Footer for auth pages.
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Routes that should not show header and footer
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="surface-0 flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
