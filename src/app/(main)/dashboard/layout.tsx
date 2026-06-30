import type { Metadata } from "next";
import { LifecycleSessionTracker } from "@/components/lifecycle/LifecycleSessionTracker";
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
      <LifecycleSessionTracker />
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PageShell>
  );
}
