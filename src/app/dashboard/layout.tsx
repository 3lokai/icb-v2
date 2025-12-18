import { PageShell } from "@/components/page-shell";
import { DashboardLayoutContent } from "@/components/dashboard/DashboardLayoutContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PageShell>
  );
}
