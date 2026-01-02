"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useUpdateNotificationPreferences } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { notificationPreferencesUpdateSchema } from "@/lib/validations/profile";
import type { NotificationPreferencesUpdateFormData } from "@/lib/validations/profile";
import type { Database } from "@/types/supabase-types";
import { queryKeys } from "@/lib/query-keys";

type NotificationPreferences =
  Database["public"]["Tables"]["user_notification_preferences"]["Row"];

type NotificationsFormClientProps = {
  initialPreferences: NotificationPreferences | null;
};

export function NotificationsFormClient({
  initialPreferences,
}: NotificationsFormClientProps) {
  const updatePreferences = useUpdateNotificationPreferences();

  // Use TanStack Query with initialData to avoid refetching
  const { data: preferences } = useQuery({
    queryKey: queryKeys.profile.notifications,
    initialData: initialPreferences,
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState<
    Partial<NotificationPreferencesUpdateFormData>
  >({
    newRoasters: true,
    coffeeUpdates: true,
    newsletter: true,
    platformUpdates: true,
    emailFrequency: "weekly",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Initialize form data from preferences
  useEffect(() => {
    if (preferences) {
      setFormData({
        newRoasters: preferences.new_roasters ?? true,
        coffeeUpdates: preferences.coffee_updates ?? true,
        newsletter: preferences.newsletter ?? true,
        platformUpdates: preferences.platform_updates ?? true,
        emailFrequency:
          (preferences.email_frequency as
            | "immediately"
            | "daily"
            | "weekly"
            | "monthly"
            | "never") || "weekly",
      });
    }
  }, [preferences]);

  const updateFormData = <
    K extends keyof NotificationPreferencesUpdateFormData,
  >(
    key: K,
    value: NotificationPreferencesUpdateFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    // Validate with Zod
    const validationResult =
      notificationPreferencesUpdateSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      setError("Please correct the errors below.");
      setIsSaving(false);
      return;
    }

    try {
      const result = await updatePreferences.mutateAsync(validationResult.data);

      if (result.success) {
        toast.success("Notification preferences updated successfully!", {
          description: "Your changes have been saved.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update notification preferences. Please try again.";
      setError(errorMessage);
      toast.error("Failed to update preferences", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

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
                    Communication
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Notification{" "}
                  <span className="text-accent italic">Settings.</span>
                </h2>
                <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                  Manage your notification preferences and email frequency.
                </p>
              </Stack>
            </div>
          </div>
        </div>

        <Stack gap="6">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-caption">
              {error}
            </div>
          )}

          <FieldGroup>
            <Stack gap="8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
                <div className="flex flex-col gap-1">
                  <FieldLabel>Email Notifications</FieldLabel>
                  <FieldDescription>
                    Choose what notifications you want to receive via email
                  </FieldDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor="new-roasters"
                      >
                        New roasters
                      </Label>
                      <Switch
                        checked={formData.newRoasters ?? true}
                        id="new-roasters"
                        onCheckedChange={(checked) =>
                          updateFormData("newRoasters", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor="coffee-updates"
                      >
                        Coffee updates
                      </Label>
                      <Switch
                        checked={formData.coffeeUpdates ?? true}
                        id="coffee-updates"
                        onCheckedChange={(checked) =>
                          updateFormData("coffeeUpdates", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor="newsletter"
                      >
                        Newsletter
                      </Label>
                      <Switch
                        checked={formData.newsletter ?? true}
                        id="newsletter"
                        onCheckedChange={(checked) =>
                          updateFormData("newsletter", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor="platform-updates"
                      >
                        Platform updates
                      </Label>
                      <Switch
                        checked={formData.platformUpdates ?? true}
                        id="platform-updates"
                        onCheckedChange={(checked) =>
                          updateFormData("platformUpdates", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
                <FieldLabel htmlFor="email-frequency">
                  Email Frequency
                </FieldLabel>
                <div className="flex flex-col gap-2">
                  <FieldDescription>
                    How often would you like to receive email notifications?
                  </FieldDescription>
                  <Select
                    onValueChange={(value) =>
                      updateFormData(
                        "emailFrequency",
                        value as NotificationPreferencesUpdateFormData["emailFrequency"]
                      )
                    }
                    value={formData.emailFrequency || "weekly"}
                  >
                    <SelectTrigger
                      id="email-frequency"
                      className="w-full"
                      data-invalid={!!fieldErrors.emailFrequency}
                    >
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.emailFrequency && (
                    <FieldError>{fieldErrors.emailFrequency}</FieldError>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  disabled={isSaving}
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </Stack>
          </FieldGroup>
        </Stack>
      </Stack>
    </Section>
  );
}
