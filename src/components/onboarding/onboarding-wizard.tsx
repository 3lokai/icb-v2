"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { saveOnboardingData } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PROCESSING_METHODS,
  popularBrewingMethods,
  popularFlavorProfiles,
  popularRegions,
  ROAST_LEVELS,
} from "@/lib/utils/coffee-constants";
import {
  type OnboardingFormData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "@/lib/validations/onboarding";

const TOTAL_STEPS = 4;

const initialFormData: Partial<OnboardingFormData> = {
  fullName: "",
  city: "",
  state: "",
  country: "India",
  preferredBrewingMethods: [],
  roastLevels: [],
  flavorProfiles: [],
  processingMethods: [],
  regions: [],
  withMilkPreference: false,
  decafOnly: false,
  organicOnly: false,
  newsletterSubscribed: true,
  newRoasters: true,
  coffeeUpdates: true,
  platformUpdates: true,
  emailFrequency: "weekly",
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Multi-step form component with complex rendering logic
export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<Partial<OnboardingFormData>>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
    // Clear field error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const toggleArrayItem = (key: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated as OnboardingFormData[typeof key] };
    });
    setError(null);
  };

  const getStepSchemaAndData = (step: number) => {
    switch (step) {
      case 1:
        return {
          schema: step1Schema,
          stepData: {
            fullName: formData.fullName,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            gender: formData.gender,
          },
        };
      case 2:
        return {
          schema: step2Schema,
          stepData: {
            experienceLevel: formData.experienceLevel,
            preferredBrewingMethods: formData.preferredBrewingMethods,
          },
        };
      case 3:
        return {
          schema: step3Schema,
          stepData: {
            roastLevels: formData.roastLevels,
            flavorProfiles: formData.flavorProfiles,
            processingMethods: formData.processingMethods,
            regions: formData.regions,
            withMilkPreference: formData.withMilkPreference,
            decafOnly: formData.decafOnly,
            organicOnly: formData.organicOnly,
          },
        };
      case 4:
        return {
          schema: step4Schema,
          stepData: {
            newsletterSubscribed: formData.newsletterSubscribed,
            newRoasters: formData.newRoasters,
            coffeeUpdates: formData.coffeeUpdates,
            platformUpdates: formData.platformUpdates,
            emailFrequency: formData.emailFrequency,
          },
        };
      default:
        return null;
    }
  };

  const validateStep = (step: number): boolean => {
    const stepConfig = getStepSchemaAndData(step);
    if (!stepConfig) {
      return true;
    }

    const { schema, stepData } = stepConfig;
    const result = schema.safeParse(stepData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      setError("Please correct the errors below.");
      return false;
    }

    setFieldErrors({});
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
      setFieldErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  const handleSkip = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
    } else {
      handleSubmit();
    }
  };

  const toOptionalArray = (arr: string[] | undefined) =>
    arr && arr.length > 0 ? arr : undefined;

  const prepareOnboardingData = (): OnboardingFormData => {
    if (!formData.fullName) {
      throw new Error("Full name is required");
    }

    return {
      fullName: formData.fullName,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      gender: formData.gender || undefined,
      experienceLevel: formData.experienceLevel || undefined,
      preferredBrewingMethods: toOptionalArray(
        formData.preferredBrewingMethods
      ),
      roastLevels: toOptionalArray(formData.roastLevels),
      flavorProfiles: toOptionalArray(formData.flavorProfiles),
      processingMethods: toOptionalArray(formData.processingMethods),
      regions: toOptionalArray(formData.regions),
      withMilkPreference: formData.withMilkPreference || undefined,
      decafOnly: formData.decafOnly || undefined,
      organicOnly: formData.organicOnly || undefined,
      newsletterSubscribed: formData.newsletterSubscribed,
      newRoasters: formData.newRoasters,
      coffeeUpdates: formData.coffeeUpdates,
      platformUpdates: formData.platformUpdates,
      emailFrequency: formData.emailFrequency,
    };
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      if (!validateStep(step)) {
        // Go to the first step with errors
        setCurrentStep(step);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const onboardingData = prepareOnboardingData();
      const result = await saveOnboardingData(onboardingData);

      if (!result.success) {
        // Handle server-side validation errors
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          setError(result.error || "Please correct the errors below.");
        } else {
          setError(result.error || "Failed to save profile. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Success - show toast and redirect to profile
      toast.success("Welcome to IndianCoffeeBeans!", {
        description: "Your profile has been set up successfully.",
      });
      router.push("/profile");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Step Content */}
      <FieldGroup>
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="font-bold text-2xl">
                Welcome! Let&apos;s get started
              </h2>
              <p className="text-balance text-muted-foreground text-sm">
                Tell us a bit about yourself
              </p>
            </div>

            <Field data-invalid={!!fieldErrors.fullName}>
              <FieldLabel htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="fullName"
                onChange={(e) => updateFormData("fullName", e.target.value)}
                placeholder="John Doe"
                required
                type="text"
                value={formData.fullName || ""}
              />
              {fieldErrors.fullName && (
                <FieldError>{fieldErrors.fullName}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field data-invalid={!!fieldErrors.city}>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input
                  id="city"
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="Mumbai"
                  type="text"
                  value={formData.city || ""}
                />
                {fieldErrors.city && (
                  <FieldError>{fieldErrors.city}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!fieldErrors.state}>
                <FieldLabel htmlFor="state">State</FieldLabel>
                <Input
                  id="state"
                  onChange={(e) => updateFormData("state", e.target.value)}
                  placeholder="Maharashtra"
                  type="text"
                  value={formData.state || ""}
                />
                {fieldErrors.state && (
                  <FieldError>{fieldErrors.state}</FieldError>
                )}
              </Field>
            </div>

            <Field data-invalid={!!fieldErrors.country}>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Input
                id="country"
                onChange={(e) => updateFormData("country", e.target.value)}
                placeholder="India"
                type="text"
                value={formData.country || ""}
              />
              <FieldDescription>
                Defaults to India, but you can change it
              </FieldDescription>
              {fieldErrors.country && (
                <FieldError>{fieldErrors.country}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.gender}>
              <FieldLabel>Gender (Optional)</FieldLabel>
              <RadioGroup
                onValueChange={(value) =>
                  updateFormData(
                    "gender",
                    value as OnboardingFormData["gender"]
                  )
                }
                value={formData.gender || ""}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="gender-male" value="male" />
                  <Label className="font-normal" htmlFor="gender-male">
                    Male
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="gender-female" value="female" />
                  <Label className="font-normal" htmlFor="gender-female">
                    Female
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="gender-non-binary" value="non-binary" />
                  <Label className="font-normal" htmlFor="gender-non-binary">
                    Non-binary
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    id="gender-prefer-not-to-say"
                    value="prefer-not-to-say"
                  />
                  <Label
                    className="font-normal"
                    htmlFor="gender-prefer-not-to-say"
                  >
                    Prefer not to say
                  </Label>
                </div>
              </RadioGroup>
            </Field>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="font-bold text-2xl">Your Coffee Journey</h2>
              <p className="text-balance text-muted-foreground text-sm">
                Help us personalize your experience
              </p>
            </div>

            <Field data-invalid={!!fieldErrors.experienceLevel}>
              <FieldLabel>
                Experience Level <span className="text-destructive">*</span>
              </FieldLabel>
              <RadioGroup
                onValueChange={(value) =>
                  updateFormData(
                    "experienceLevel",
                    value as OnboardingFormData["experienceLevel"]
                  )
                }
                value={formData.experienceLevel || ""}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="exp-beginner" value="beginner" />
                  <Label className="font-normal" htmlFor="exp-beginner">
                    Beginner
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="exp-enthusiast" value="enthusiast" />
                  <Label className="font-normal" htmlFor="exp-enthusiast">
                    Enthusiast
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="exp-expert" value="expert" />
                  <Label className="font-normal" htmlFor="exp-expert">
                    Expert
                  </Label>
                </div>
              </RadioGroup>
              {fieldErrors.experienceLevel && (
                <FieldError>{fieldErrors.experienceLevel}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Preferred Brewing Methods</FieldLabel>
              <FieldDescription>
                Select all that apply (optional)
              </FieldDescription>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {popularBrewingMethods.map((method) => (
                  <div className="flex items-center gap-2" key={method}>
                    <Checkbox
                      checked={
                        formData.preferredBrewingMethods?.includes(method) ??
                        false
                      }
                      id={`method-${method}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem("preferredBrewingMethods", method);
                        } else {
                          toggleArrayItem("preferredBrewingMethods", method);
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor={`method-${method}`}
                    >
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </Field>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="font-bold text-2xl">Coffee Preferences</h2>
              <p className="text-balance text-muted-foreground text-sm">
                Optional - You can skip this step
              </p>
            </div>

            <Field>
              <FieldLabel>Preferred Roast Levels</FieldLabel>
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
            </Field>

            <Field>
              <FieldLabel>Flavor Profiles</FieldLabel>
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
            </Field>

            <Field>
              <FieldLabel>Processing Methods</FieldLabel>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {PROCESSING_METHODS.slice(0, 9).map((method) => (
                  <div className="flex items-center gap-2" key={method.value}>
                    <Checkbox
                      checked={
                        formData.processingMethods?.includes(method.value) ??
                        false
                      }
                      id={`process-${method.value}`}
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
                      htmlFor={`process-${method.value}`}
                    >
                      {method.label}
                    </Label>
                  </div>
                ))}
              </div>
            </Field>

            <Field>
              <FieldLabel>Preferred Regions</FieldLabel>
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
            </Field>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.withMilkPreference}
                  id="with-milk"
                  onCheckedChange={(checked) =>
                    updateFormData("withMilkPreference", checked === true)
                  }
                />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor="with-milk"
                >
                  I prefer coffee with milk
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.decafOnly}
                  id="decaf-only"
                  onCheckedChange={(checked) =>
                    updateFormData("decafOnly", checked === true)
                  }
                />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor="decaf-only"
                >
                  Decaf only
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.organicOnly}
                  id="organic-only"
                  onCheckedChange={(checked) =>
                    updateFormData("organicOnly", checked === true)
                  }
                />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor="organic-only"
                >
                  Organic only
                </Label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="font-bold text-2xl">Notification Preferences</h2>
              <p className="text-balance text-muted-foreground text-sm">
                Optional - You can skip this step
              </p>
            </div>

            <Field>
              <FieldLabel>Email Notifications</FieldLabel>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.newsletterSubscribed}
                    id="newsletter"
                    onCheckedChange={(checked) =>
                      updateFormData("newsletterSubscribed", checked === true)
                    }
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="newsletter"
                  >
                    Subscribe to newsletter
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.newRoasters}
                    id="new-roasters"
                    onCheckedChange={(checked) =>
                      updateFormData("newRoasters", checked === true)
                    }
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="new-roasters"
                  >
                    New roasters added
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.coffeeUpdates}
                    id="coffee-updates"
                    onCheckedChange={(checked) =>
                      updateFormData("coffeeUpdates", checked === true)
                    }
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="coffee-updates"
                  >
                    Coffee updates
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.platformUpdates}
                    id="platform-updates"
                    onCheckedChange={(checked) =>
                      updateFormData("platformUpdates", checked === true)
                    }
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor="platform-updates"
                  >
                    Platform updates
                  </Label>
                </div>
              </div>
            </Field>

            <Field>
              <FieldLabel>Email Frequency</FieldLabel>
              <RadioGroup
                onValueChange={(value) =>
                  updateFormData(
                    "emailFrequency",
                    value as OnboardingFormData["emailFrequency"]
                  )
                }
                value={formData.emailFrequency}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="freq-immediately" value="immediately" />
                  <Label className="font-normal" htmlFor="freq-immediately">
                    Immediately
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="freq-daily" value="daily" />
                  <Label className="font-normal" htmlFor="freq-daily">
                    Daily
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="freq-weekly" value="weekly" />
                  <Label className="font-normal" htmlFor="freq-weekly">
                    Weekly
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="freq-monthly" value="monthly" />
                  <Label className="font-normal" htmlFor="freq-monthly">
                    Monthly
                  </Label>
                </div>
              </RadioGroup>
            </Field>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <div>
            {currentStep > 1 && (
              <Button
                disabled={isLoading}
                onClick={handleBack}
                type="button"
                variant="outline"
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(currentStep === 3 || currentStep === 4) && (
              <Button
                disabled={isLoading}
                onClick={handleSkip}
                type="button"
                variant="ghost"
              >
                Skip
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button disabled={isLoading} onClick={handleNext} type="button">
                Next
              </Button>
            ) : (
              <Button disabled={isLoading} onClick={handleSubmit} type="button">
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </div>
      </FieldGroup>
    </div>
  );
}
