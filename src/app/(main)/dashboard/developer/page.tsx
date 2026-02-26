import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { listApiKeys, getUsageForMyKeys } from "@/app/actions/api-keys";
import { DeveloperPortal } from "@/components/dashboard/DeveloperPortal";

export default async function DeveloperPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard/developer");
  }

  const [keysResult, usageResult] = await Promise.all([
    listApiKeys(),
    getUsageForMyKeys(),
  ]);

  const keys = keysResult.success ? (keysResult.data ?? []) : [];
  const usage = usageResult.success ? (usageResult.data ?? {}) : {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading font-bold">Developer</h1>
        <p className="mt-1 text-muted-foreground text-caption">
          Manage API keys and view usage for the external API.
        </p>
      </div>
      <DeveloperPortal initialKeys={keys} initialUsage={usage} />
    </div>
  );
}
