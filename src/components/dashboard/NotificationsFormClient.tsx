"use client";

import { Accent } from "@/components/primitives/accent";
import { useEffect } from "react";
import { useSettingsForm } from "@/hooks/use-settings-form";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/hooks/use-profile";
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
import { Stack } from "@/components/primitives/stack";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { notificationPreferencesUpdateSchema } from "@/lib/validations/profile";
import type { NotificationPreferencesUpdateFormData } from "@/lib/validations/profile";
import type { Database } from "@/types/supabase-types";

type NotificationPreferences =
  Database["public"]["Tables"]["user_notification_preferences"]["Row"];

type NotificationsFormClientProps = {
  initialPreferences: NotificationPreferences | null;
};

export function NotificationsFormClient({
  initialPreferences,
}: NotificationsFormClientProps) {
  const updatePreferences = useUpdateNotificationPreferences();

  // Use hook with server-fetched initialData
  const { data: preferences } = useNotificationPreferences(initialPreferences);

  const {
    formData,
    setFormData,
    updateField: updateFormData,
    isSaving,
    error,
    fieldErrors,
    handleSubmit,
  } = useSettingsForm({
    initial: {
      newRoasters: true,
      coffeeUpdates: true,
      newsletter: true,
      platformUpdates: true,
      emailFrequency: "weekly",
    } satisfies Partial<NotificationPreferencesUpdateFormData>,
    schema: notificationPreferencesUpdateSchema,
    save: (data) => updatePreferences.mutateAsync(data),
    messages: {
      success: "Notification preferences updated successfully!",
      errorTitle: "Failed to update preferences",
      fallback: "Failed to update notification preferences. Please try again.",
    },
  });

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
  }, [preferences, setFormData]);

  return (
    <Stack gap="8">
      <DashboardPageHeader
        eyebrow="Communication"
        title={
          <>
            Notification <Accent>Settings.</Accent>
          </>
        }
        description="Manage your notification preferences and email frequency."
      />

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
              <FieldLabel htmlFor="email-frequency">Email Frequency</FieldLabel>
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
              <Button disabled={isSaving} onClick={handleSubmit} type="button">
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </Stack>
        </FieldGroup>
      </Stack>
    </Stack>
  );
}
