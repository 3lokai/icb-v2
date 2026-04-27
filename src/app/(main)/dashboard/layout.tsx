import type { Metadata } from "next";
import { LoopsSessionTracker } from "@/components/loops/LoopsSessionTracker";
import { PageShell } from "@/components/primitives/page-shell";
import { DashboardLayoutContent } from "@/components/dashboard/DashboardLayoutContent";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <LoopsSessionTracker />
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PageShell>
  );
}
