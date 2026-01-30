"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProfile, useUpdatePrivacySettings } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Stack } from "@/components/primitives/stack";
import { Rule } from "@/components/primitives/rule";
import { privacySettingsSchema } from "@/lib/validations/profile";
import type { PrivacySettingsFormData } from "@/lib/validations/profile";
import type { PrivateProfileDTO } from "@/data/user-dto";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { confirmPassword, deleteAccount } from "@/app/actions/account";

type PrivacyFormClientProps = {
  initialProfile: PrivateProfileDTO;
};

export function PrivacyFormClient({ initialProfile }: PrivacyFormClientProps) {
  const router = useRouter();
  const updatePrivacy = useUpdatePrivacySettings();

  // Use hook with server-fetched initialData
  const { data: profile } = useProfile(initialProfile);

  const [formData, setFormData] = useState<Partial<PrivacySettingsFormData>>({
    isPublicProfile: true,
    showLocation: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Account deletion state
  const [deleteStep, setDeleteStep] = useState<
    "initial" | "password" | "deleting"
  >("initial");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Reset delete dialog state when it closes
  useEffect(() => {
    if (!isDeleteDialogOpen) {
      setDeleteStep("initial");
      setPassword("");
      setPasswordError(null);
      setIsDeleting(false);
    }
  }, [isDeleteDialogOpen]);

  const handlePasswordConfirm = async () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    setIsDeleting(true);
    setPasswordError(null);

    try {
      const result = await confirmPassword(password);

      if (!result.success) {
        setPasswordError(result.error || "Invalid password. Please try again.");
        setIsDeleting(false);
        return;
      }

      // Password confirmed, proceed with deletion
      setDeleteStep("deleting");
      await handleAccountDeletion();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to verify password. Please try again.";
      setPasswordError(errorMessage);
      setIsDeleting(false);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      const result = await deleteAccount();

      if (!result.success) {
        toast.error("Failed to delete account", {
          description: result.error || "An error occurred. Please try again.",
        });
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
        return;
      }

      // Success - redirect to home page
      toast.success("Account deleted successfully", {
        description: "Your account has been permanently deleted.",
      });
      setIsDeleteDialogOpen(false);
      router.push("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete account. Please try again.";
      toast.error("Failed to delete account", {
        description: errorMessage,
      });
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
    }
  };

  return (
    <Stack gap="8">
      {/* Magazine-style header */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Security & Privacy
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                Privacy & <span className="text-accent italic">Data.</span>
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                Manage your privacy settings and account data with full control
                over what you share.
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
                <FieldLabel>Privacy Settings</FieldLabel>
                <FieldDescription>
                  Control what information is visible to others
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
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
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button disabled={isSaving} onClick={handleSubmit} type="button">
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
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  {deleteStep === "initial" && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. The following will
                          happen immediately:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-4">
                        <ul className="list-disc list-inside space-y-1 text-caption text-muted-foreground">
                          <li>Your account will be deactivated immediately</li>
                          <li>Your profile will be hidden from public view</li>
                          <li>Your reviews will be anonymized</li>
                          <li>All notifications will be stopped</li>
                          <li>
                            Your data will be permanently deleted within 30 days
                          </li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteStep("password")}
                          disabled={isDeleting}
                        >
                          Continue
                        </Button>
                      </DialogFooter>
                    </>
                  )}

                  {deleteStep === "password" && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Confirm Your Password</DialogTitle>
                        <DialogDescription>
                          Enter your password to confirm account deletion
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError(null);
                            }}
                            disabled={isDeleting}
                            aria-invalid={!!passwordError}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                password &&
                                !isDeleting
                              ) {
                                handlePasswordConfirm();
                              }
                            }}
                          />
                          {passwordError && (
                            <p className="text-destructive text-caption">
                              {passwordError}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteStep("initial")}
                          disabled={isDeleting}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handlePasswordConfirm}
                          disabled={!password.trim() || isDeleting}
                        >
                          {isDeleting ? "Verifying..." : "Confirm Deletion"}
                        </Button>
                      </DialogFooter>
                    </>
                  )}

                  {deleteStep === "deleting" && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Deleting Your Account</DialogTitle>
                        <DialogDescription>
                          Please wait while we delete your account and anonymize
                          your data...
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" disabled>
                          Deleting...
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
