"use client";

import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/header";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="surface-0 flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-default section-spacing">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
