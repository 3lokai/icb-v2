"use client";

import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Coffee, Calendar, User, Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-subheading text-destructive">Error</h2>
          <p className="text-muted-foreground text-caption">
            Failed to load profile data. Please try again.
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
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-title">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile.full_name || profile.email}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Status
            </CardTitle>
            <CardDescription>Your profile completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
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
            </div>
            {profile.onboarding_completed ? (
              <Badge variant="default" className="w-fit">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Onboarding Complete
              </Badge>
            ) : (
              <Button asChild size="sm">
                <Link href="/auth/onboarding">Complete Onboarding</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Coffee Preferences
            </CardTitle>
            <CardDescription>Your coffee preferences</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.preferred_brewing_methods &&
            profile.preferred_brewing_methods.length > 0 ? (
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  {profile.preferred_brewing_methods.length} brewing method
                  {profile.preferred_brewing_methods.length !== 1
                    ? "s"
                    : ""}{" "}
                  configured
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/preferences">Update Preferences</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  No preferences set yet
                </p>
                <Button asChild size="sm">
                  <Link href="/dashboard/preferences">Set Preferences</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Info
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-caption">
              <span className="font-medium">Joined:</span>
              <span className="ml-2 text-muted-foreground">{joinedDate}</span>
            </div>
            <div className="text-caption">
              <span className="font-medium">Experience Level:</span>
              <span className="ml-2 text-muted-foreground capitalize">
                {profile.experience_level || "Not set"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/profile">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/preferences">
                <Coffee className="h-4 w-4 mr-2" />
                Coffee Preferences
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
