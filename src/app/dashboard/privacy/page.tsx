"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useProfile, useUpdatePrivacySettings } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Rule } from "@/components/primitives/rule";
import { privacySettingsSchema } from "@/lib/validations/profile";
import type { PrivacySettingsFormData } from "@/lib/validations/profile";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PrivacyPage() {
  const { data: profile, isLoading } = useProfile();
  const updatePrivacy = useUpdatePrivacySettings();

  const [formData, setFormData] = useState<Partial<PrivacySettingsFormData>>({
    isPublicProfile: true,
    showLocation: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        isPublicProfile: profile.is_public_profile ?? true,
        showLocation: profile.show_location ?? true,
      });
    }
  }, [profile]);

  const updateFormData = <K extends keyof PrivacySettingsFormData>(
    key: K,
    value: PrivacySettingsFormData[K]
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
    const validationResult = privacySettingsSchema.safeParse(formData);

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
      const result = await updatePrivacy.mutateAsync(validationResult.data);

      if (result.success) {
        toast.success("Privacy settings updated successfully!", {
          description: "Your changes have been saved.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update privacy settings. Please try again.";
      setError(errorMessage);
      toast.error("Failed to update settings", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Section spacing="default" contained={false}>
        <Stack gap="6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </Stack>
      </Section>
    );
  }

  return (
    <Section spacing="default" contained={false}>
      <Stack gap="8">
        {/* Magazine-style header */}
        <Stack gap="3">
          <div>
            <div className="inline-flex items-center gap-4 mb-3">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                Security & Privacy
              </span>
            </div>
            <h1 className="text-display text-balance leading-[1.1] tracking-tight">
              Privacy & Data
            </h1>
            <p className="text-muted-foreground text-caption mt-2">
              Manage your privacy settings and account data
            </p>
          </div>
        </Stack>

        <Stack gap="6">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-caption">
              {error}
            </div>
          )}

          <FieldGroup>
            <Stack gap="6">
              <Field>
                <FieldLabel>Privacy Settings</FieldLabel>
                <FieldDescription>
                  Control what information is visible to others
                </FieldDescription>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor="public-profile"
                      >
                        Public profile
                      </Label>
                      <p className="text-muted-foreground text-caption">
                        Allow others to view your profile
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublicProfile ?? true}
                      id="public-profile"
                      onCheckedChange={(checked) =>
                        updateFormData("isPublicProfile", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor="show-location"
                      >
                        Show location
                      </Label>
                      <p className="text-muted-foreground text-caption">
                        Display your city and state on your profile
                      </p>
                    </div>
                    <Switch
                      checked={formData.showLocation ?? true}
                      id="show-location"
                      onCheckedChange={(checked) =>
                        updateFormData("showLocation", checked)
                      }
                    />
                  </div>
                </div>
              </Field>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  disabled={isSaving}
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </Stack>
          </FieldGroup>

          <Rule spacing="default" />

          <Stack gap="6">
            <h2 className="text-title">Account Actions</h2>
            <Stack gap="4">
              <div className="rounded-md border border-border p-4">
                <h3 className="font-medium text-body mb-2">Export Data</h3>
                <p className="text-muted-foreground text-caption mb-4">
                  Download a copy of your account data
                </p>
                <Button variant="outline" disabled>
                  Export Data (Coming Soon)
                </Button>
              </div>

              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                <h3 className="font-medium text-body mb-2 text-destructive">
                  Delete Account
                </h3>
                <p className="text-muted-foreground text-caption mb-4">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Close dialog - handled by Dialog component
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          toast.error(
                            "Account deletion is not yet implemented"
                          );
                        }}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Section>
  );
}
