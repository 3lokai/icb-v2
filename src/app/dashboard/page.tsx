"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useModal } from "@/components/providers/modal-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";

export default function DashboardPage() {
  const { signOut } = useAuth();
  const { openModal } = useModal();
  const router = useRouter();

  // Use TanStack Query for user data
  const { data: user, isLoading, error } = useUser();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed out successfully!");
        router.push("/");
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  const showConfirmationModal = () => {
    openModal({
      type: "confirmation",
      title: "Confirm Action",
      description: "Are you sure you want to perform this action?",
      confirmText: "Yes, continue",
      cancelText: "Cancel",
      onConfirm: () => {
        toast.success("Action confirmed!");
      },
    });
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="text-center">
            <h2 className="font-semibold text-lg">Loading...</h2>
            <p className="text-muted-foreground text-sm">Please wait</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="text-center">
            <h2 className="font-semibold text-destructive text-lg">Error</h2>
            <p className="text-muted-foreground text-sm">
              Failed to load user data. Please try again.
            </p>
            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Protected Route</CardTitle>
              <CardDescription>
                This page is only accessible to authenticated users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                You can see this content because you're signed in.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium text-sm">Email:</span>
                <span className="ml-2 text-muted-foreground text-sm">
                  {user?.email}
                </span>
              </div>
              <div>
                <span className="font-medium text-sm">User ID:</span>
                <span className="ml-2 font-mono text-muted-foreground text-sm">
                  {user?.id}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={showConfirmationModal} variant="outline">
            Show Modal Demo
          </Button>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
