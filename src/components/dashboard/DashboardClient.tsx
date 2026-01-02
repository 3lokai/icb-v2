"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import Link from "next/link";
import type { PrivateProfileDTO } from "@/data/user-dto";
import { queryKeys } from "@/lib/query-keys";
import type { Database } from "@/types/supabase-types";

type CoffeePreferences =
  Database["public"]["Tables"]["user_coffee_preferences"]["Row"];

type DashboardClientProps = {
  initialProfile: PrivateProfileDTO | null;
  initialCoffeePreferences: CoffeePreferences | null;
};

export function DashboardClient({
  initialProfile,
  initialCoffeePreferences,
}: DashboardClientProps) {
  // Use TanStack Query with initialData to avoid refetching
  const { data: profile } = useQuery({
    queryKey: queryKeys.profile.current,
    initialData: initialProfile,
    staleTime: 5 * 60 * 1000,
  });

  if (!profile) {
    return (
      <Section spacing="default" contained={false}>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Stack gap="4" className="text-center">
            <h2 className="text-subheading text-destructive">Error</h2>
            <p className="text-muted-foreground text-caption">
              Failed to load profile data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </Stack>
        </div>
      </Section>
    );
  }

  // Note: created_at is not in PrivateProfileDTO, so we'll show a generic message
  const joinedDate = "Recently";

  const profileCompletion = [
    profile.full_name,
    profile.experience_level,
    profile.preferred_brewing_methods &&
      profile.preferred_brewing_methods.length > 0,
  ].filter(Boolean).length;

  const completionPercentage = Math.round((profileCompletion / 3) * 100);

  return (
    <Section spacing="default" contained={false}>
      <Stack gap="8">
        {/* Magazine-style header */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="6">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 md:w-12 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    Your Dashboard
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Welcome back, {profile.full_name || profile.email}!
                </h2>
                <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                  Manage your profile, preferences, and account settings from
                  your personal dashboard.
                </p>
              </Stack>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-heading">
                <Icon name="User" size={20} className="h-5 w-5" />
                Profile Status
              </CardTitle>
              <CardDescription>Your profile completion</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="4">
                <Stack gap="2">
                  <div className="flex items-center justify-between text-caption">
                    <span>Completion</span>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </Stack>
                {profile.onboarding_completed ? (
                  <Badge variant="default" className="w-fit">
                    <Icon
                      name="CheckCircle"
                      size={12}
                      className="h-3 w-3 mr-1"
                    />
                    Onboarding Complete
                  </Badge>
                ) : (
                  <Button asChild size="sm">
                    <Link href="/auth/onboarding">Complete Onboarding</Link>
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-heading">
                <Icon name="Coffee" size={20} className="h-5 w-5" />
                Coffee Preferences
              </CardTitle>
              <CardDescription>Your coffee preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.preferred_brewing_methods &&
              profile.preferred_brewing_methods.length > 0 ? (
                <Stack gap="2">
                  <p className="text-caption text-muted-foreground">
                    {profile.preferred_brewing_methods.length} brewing method
                    {profile.preferred_brewing_methods.length !== 1
                      ? "s"
                      : ""}{" "}
                    configured
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/preferences">
                      Update Preferences
                    </Link>
                  </Button>
                </Stack>
              ) : (
                <Stack gap="2">
                  <p className="text-caption text-muted-foreground">
                    No preferences set yet
                  </p>
                  <Button asChild size="sm">
                    <Link href="/dashboard/preferences">Set Preferences</Link>
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-heading">
                <Icon name="Calendar" size={20} className="h-5 w-5" />
                Account Info
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="2">
                <div className="text-caption">
                  <span className="font-medium">Joined:</span>
                  <span className="ml-2 text-muted-foreground">
                    {joinedDate}
                  </span>
                </div>
                <div className="text-caption">
                  <span className="font-medium">Experience Level:</span>
                  <span className="ml-2 text-muted-foreground capitalize">
                    {profile.experience_level || "Not set"}
                  </span>
                </div>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-heading">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/profile">
                    <Icon name="User" size={16} className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/preferences">
                    <Icon name="Coffee" size={16} className="h-4 w-4 mr-2" />
                    Coffee Preferences
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/notifications">
                    <Icon name="Bell" size={16} className="h-4 w-4 mr-2" />
                    Notifications
                  </Link>
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </Stack>
    </Section>
  );
}
