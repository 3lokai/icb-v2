import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import {
  listApiKeys,
  getUsageForMyKeys,
  getMyApiPlan,
} from "@/app/actions/api-keys";
import { DeveloperPortal } from "@/components/dashboard/DeveloperPortal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DeveloperPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=sign-in&from=/dashboard/developer");
  }

  const [keysResult, usageResult, planResult] = await Promise.all([
    listApiKeys(),
    getUsageForMyKeys(),
    getMyApiPlan(),
  ]);

  const keys = keysResult.success ? (keysResult.data ?? []) : [];
  const usage = usageResult.success ? (usageResult.data ?? {}) : {};
  const plan = planResult.success ? planResult.data : undefined;
  const activeKeys = keys.filter((k) => k.is_active).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading font-bold">Developer</h1>
        <p className="mt-1 text-muted-foreground text-caption">
          Manage API keys and view usage for the external API.
        </p>
        <p className="mt-2 text-caption text-muted-foreground">
          View full{" "}
          <Link href="/developers" className="text-accent underline">
            API documentation
          </Link>
          .
        </p>
      </div>
      {plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              API plan <Badge variant="secondary">{plan.tier}</Badge>
            </CardTitle>
            <CardDescription>
              {plan.commercialUse
                ? "Licensed for customer-facing use."
                : "For development and internal tools. Customer-facing or commercial use needs a Commercial licence."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-caption">
            <p>
              {plan.quotaUsed.toLocaleString("en-IN")} /{" "}
              {plan.monthlyQuota.toLocaleString("en-IN")} requests this period
            </p>
            <p>
              {plan.rpm} requests per minute · {activeKeys} / {plan.maxKeys}{" "}
              active keys
            </p>
            {!plan.commercialUse && (
              <p className="pt-2">
                Need more volume or a commercial licence?{" "}
                <Link href="/contact" className="text-accent underline">
                  Talk to us
                </Link>
                .
              </p>
            )}
          </CardContent>
        </Card>
      )}
      <DeveloperPortal initialKeys={keys} initialUsage={usage} />
    </div>
  );
}
