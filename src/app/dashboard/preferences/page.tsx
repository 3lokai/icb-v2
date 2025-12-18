"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  useCoffeePreferences,
  useUpdateCoffeePreferences,
} from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ROAST_LEVELS,
  PROCESSING_METHODS,
  popularFlavorProfiles,
  popularRegions,
} from "@/lib/utils/coffee-constants";
import { coffeePreferencesUpdateSchema } from "@/lib/validations/profile";
import type { CoffeePreferencesUpdateFormData } from "@/lib/validations/profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreferencesPage() {
  const { data: preferences, isLoading } = useCoffeePreferences();
  const updatePreferences = useUpdateCoffeePreferences();

  const [formData, setFormData] = useState<
    Partial<CoffeePreferencesUpdateFormData>
  >({
    roastLevels: [],
    flavorProfiles: [],
    processingMethods: [],
    regions: [],
    withMilkPreference: false,
    decafOnly: false,
    organicOnly: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Initialize form data from preferences
  useEffect(() => {
    if (preferences) {
      setFormData({
        roastLevels: preferences.roast_levels || [],
        flavorProfiles: preferences.flavor_profiles || [],
        processingMethods: preferences.processing_methods || [],
        regions: preferences.regions || [],
        withMilkPreference: preferences.with_milk_preference ?? false,
        decafOnly: preferences.decaf_only ?? false,
        organicOnly: preferences.organic_only ?? false,
      });
    }
  }, [preferences]);

  const toggleArrayItem = (
    key: keyof CoffeePreferencesUpdateFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return {
        ...prev,
        [key]: updated as CoffeePreferencesUpdateFormData[typeof key],
      };
    });
    setError(null);
  };

  const updateFormData = <K extends keyof CoffeePreferencesUpdateFormData>(
    key: K,
    value: CoffeePreferencesUpdateFormData[K]
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
    const validationResult = coffeePreferencesUpdateSchema.safeParse(formData);

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
        toast.success("Coffee preferences updated successfully!", {
          description: "Your changes have been saved.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update preferences. Please try again.";
      setError(errorMessage);
      toast.error("Failed to update preferences", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-default p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container-default p-6">
      <div className="mb-6">
        <h1 className="font-bold text-title">Coffee Preferences</h1>
        <p className="text-muted-foreground text-caption">
          Customize your coffee preferences
        </p>
      </div>

      <div className="flex w-full flex-col gap-6">
        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-caption">
            {error}
          </div>
        )}

        <FieldGroup>
          <div className="flex flex-col gap-6">
            <Field data-invalid={!!fieldErrors.roastLevels}>
              <FieldLabel>Roast Levels</FieldLabel>
              <FieldDescription>
                Select your preferred roast levels (up to 10)
              </FieldDescription>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {ROAST_LEVELS.map((roast) => (
                  <div className="flex items-center gap-2" key={roast.value}>
                    <Checkbox
                      checked={
                        formData.roastLevels?.includes(roast.value) ?? false
                      }
                      id={`roast-${roast.value}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem("roastLevels", roast.value);
                        } else {
                          toggleArrayItem("roastLevels", roast.value);
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor={`roast-${roast.value}`}
                    >
                      {roast.label}
                    </Label>
                  </div>
                ))}
              </div>
              {fieldErrors.roastLevels && (
                <FieldError>{fieldErrors.roastLevels}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.flavorProfiles}>
              <FieldLabel>Flavor Profiles</FieldLabel>
              <FieldDescription>
                Select your preferred flavor profiles (up to 20)
              </FieldDescription>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {popularFlavorProfiles.map((flavor) => (
                  <div className="flex items-center gap-2" key={flavor}>
                    <Checkbox
                      checked={
                        formData.flavorProfiles?.includes(flavor) ?? false
                      }
                      id={`flavor-${flavor}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem("flavorProfiles", flavor);
                        } else {
                          toggleArrayItem("flavorProfiles", flavor);
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor={`flavor-${flavor}`}
                    >
                      {flavor}
                    </Label>
                  </div>
                ))}
              </div>
              {fieldErrors.flavorProfiles && (
                <FieldError>{fieldErrors.flavorProfiles}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.processingMethods}>
              <FieldLabel>Processing Methods</FieldLabel>
              <FieldDescription>
                Select your preferred processing methods (up to 15)
              </FieldDescription>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {PROCESSING_METHODS.map((method) => (
                  <div className="flex items-center gap-2" key={method.value}>
                    <Checkbox
                      checked={
                        formData.processingMethods?.includes(method.value) ??
                        false
                      }
                      id={`method-${method.value}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem("processingMethods", method.value);
                        } else {
                          toggleArrayItem("processingMethods", method.value);
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor={`method-${method.value}`}
                    >
                      {method.label}
                    </Label>
                  </div>
                ))}
              </div>
              {fieldErrors.processingMethods && (
                <FieldError>{fieldErrors.processingMethods}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.regions}>
              <FieldLabel>Regions</FieldLabel>
              <FieldDescription>
                Select your preferred coffee regions (up to 20)
              </FieldDescription>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {popularRegions.map((region) => (
                  <div className="flex items-center gap-2" key={region}>
                    <Checkbox
                      checked={formData.regions?.includes(region) ?? false}
                      id={`region-${region}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem("regions", region);
                        } else {
                          toggleArrayItem("regions", region);
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor={`region-${region}`}
                    >
                      {region}
                    </Label>
                  </div>
                ))}
              </div>
              {fieldErrors.regions && (
                <FieldError>{fieldErrors.regions}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Brew Preferences</FieldLabel>
              <FieldDescription>Optional preferences</FieldDescription>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="with-milk"
                  >
                    I prefer coffee with milk
                  </Label>
                  <Switch
                    checked={formData.withMilkPreference ?? false}
                    id="with-milk"
                    onCheckedChange={(checked) =>
                      updateFormData("withMilkPreference", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="decaf-only"
                  >
                    Decaf only
                  </Label>
                  <Switch
                    checked={formData.decafOnly ?? false}
                    id="decaf-only"
                    onCheckedChange={(checked) =>
                      updateFormData("decafOnly", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="organic-only"
                  >
                    Organic only
                  </Label>
                  <Switch
                    checked={formData.organicOnly ?? false}
                    id="organic-only"
                    onCheckedChange={(checked) =>
                      updateFormData("organicOnly", checked)
                    }
                  />
                </div>
              </div>
            </Field>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button disabled={isSaving} onClick={handleSubmit} type="button">
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}
