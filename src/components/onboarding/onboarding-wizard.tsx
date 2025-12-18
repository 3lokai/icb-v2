"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Country, State, City } from "country-state-city";
import { saveOnboardingData } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";
import { Icon } from "@/components/common/Icon";
import { popularBrewingMethods } from "@/lib/utils/coffee-constants";
import {
  type OnboardingFormData,
  step1Schema,
  step2Schema,
} from "@/lib/validations/onboarding";

const TOTAL_STEPS = 2;

const initialFormData: Partial<OnboardingFormData> = {
  fullName: "",
  city: "",
  state: "",
  country: "India",
  preferredBrewingMethods: [],
  withMilkPreference: false,
  decafOnly: false,
  organicOnly: false,
};

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<Partial<OnboardingFormData>>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("IN");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");
  const [cityInputValue, setCityInputValue] = useState<string>(
    initialFormData.city || ""
  );
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Country-State-City data
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () =>
      selectedCountryCode ? State.getStatesOfCountry(selectedCountryCode) : [],
    [selectedCountryCode]
  );
  const cities = useMemo(
    () =>
      selectedCountryCode && selectedStateCode
        ? City.getCitiesOfState(selectedCountryCode, selectedStateCode)
        : [],
    [selectedCountryCode, selectedStateCode]
  );

  // Filter cities based on input
  const filteredCities = useMemo(() => {
    if (!cityInputValue.trim()) {
      return cities.slice(0, 10); // Show first 10 when empty
    }
    const searchTerm = cityInputValue.toLowerCase().trim();
    return cities
      .filter((city) => city.name.toLowerCase().includes(searchTerm))
      .slice(0, 10); // Limit to 10 results
  }, [cities, cityInputValue]);

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
            withMilkPreference: formData.withMilkPreference,
            decafOnly: formData.decafOnly,
            organicOnly: formData.organicOnly,
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
      withMilkPreference: formData.withMilkPreference || undefined,
      decafOnly: formData.decafOnly || undefined,
      organicOnly: formData.organicOnly || undefined,
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

      // Success - show toast and redirect to dashboard
      toast.success("Welcome to IndianCoffeeBeans!", {
        description: "Your profile has been set up successfully.",
      });
      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center text-caption">
          <span className="text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-caption">
          {error}
        </div>
      )}

      {/* Step Content */}
      <FieldGroup>
        {currentStep === 1 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-title">Welcome! Let&apos;s get started</h2>
              <p className="text-balance text-muted-foreground text-caption">
                Tell us a bit about yourself
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
              <FieldLabel htmlFor="fullName" className="md:pt-2">
                Full Name <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="flex flex-col gap-2">
                <Input
                  data-invalid={!!fieldErrors.fullName}
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
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
              <div className="flex flex-col gap-1 md:pt-2">
                <FieldLabel>Location</FieldLabel>
                <FieldDescription>Defaults to India</FieldDescription>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Select
                    onValueChange={(value) => {
                      const country = countries.find(
                        (c) => c.isoCode === value
                      );
                      setSelectedCountryCode(value);
                      setSelectedStateCode("");
                      updateFormData("country", country?.name || "");
                      updateFormData("state", undefined);
                      updateFormData("city", undefined);
                    }}
                    value={
                      countries.find((c) => c.name === formData.country)
                        ?.isoCode || selectedCountryCode
                    }
                  >
                    <SelectTrigger
                      className="w-full"
                      data-invalid={!!fieldErrors.country}
                      id="country"
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.country && (
                    <FieldError>{fieldErrors.country}</FieldError>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Select
                    disabled={!selectedCountryCode}
                    onValueChange={(value) => {
                      const state = states.find((s) => s.isoCode === value);
                      setSelectedStateCode(value);
                      updateFormData("state", state?.name || "");
                      updateFormData("city", undefined);
                      setCityInputValue("");
                      setShowCityDropdown(false);
                    }}
                    value={
                      states.find((s) => s.name === formData.state)?.isoCode ||
                      ""
                    }
                  >
                    <SelectTrigger
                      className="w-full"
                      data-invalid={!!fieldErrors.state}
                      id="state"
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.state && (
                    <FieldError>{fieldErrors.state}</FieldError>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      data-invalid={!!fieldErrors.city}
                      disabled={!selectedStateCode}
                      id="city"
                      onBlur={() => {
                        // Delay hiding dropdown to allow click on option
                        setTimeout(() => setShowCityDropdown(false), 200);
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCityInputValue(value);
                        setShowCityDropdown(true);
                        updateFormData("city", value);
                      }}
                      onFocus={() => {
                        if (selectedStateCode) {
                          setShowCityDropdown(true);
                        }
                      }}
                      placeholder="Start typing city name..."
                      type="text"
                      value={cityInputValue}
                    />
                    {showCityDropdown &&
                      selectedStateCode &&
                      filteredCities.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
                          {filteredCities.map((city) => (
                            <button
                              className="w-full px-3 py-2 text-left text-caption hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                              key={city.name}
                              onClick={() => {
                                setCityInputValue(city.name);
                                updateFormData("city", city.name);
                                setShowCityDropdown(false);
                              }}
                              type="button"
                            >
                              {city.name}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                  {fieldErrors.city && (
                    <FieldError>{fieldErrors.city}</FieldError>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
              <div className="flex flex-col gap-1 md:pt-2">
                <FieldLabel>Gender</FieldLabel>
                <FieldDescription>
                  Skip if you prefer not sharing
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => updateFormData("gender", "male")}
                    type="button"
                    variant={formData.gender === "male" ? "default" : "ghost"}
                  >
                    <Icon name="GenderMale" size={20} />
                    <span>Male</span>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => updateFormData("gender", "female")}
                    type="button"
                    variant={formData.gender === "female" ? "default" : "ghost"}
                  >
                    <Icon name="GenderFemale" size={20} />
                    <span>Female</span>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => updateFormData("gender", "non-binary")}
                    type="button"
                    variant={
                      formData.gender === "non-binary" ? "default" : "ghost"
                    }
                  >
                    <Icon name="GenderIntersex" size={20} />
                    <span>Non-binary</span>
                  </Button>
                </div>
                {fieldErrors.gender && (
                  <FieldError>{fieldErrors.gender}</FieldError>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-title">Your Coffee Journey</h2>
              <p className="text-balance text-muted-foreground text-caption">
                Help us personalize your experience
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
              <FieldLabel className="md:pt-2">
                Experience Level <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4">
                  <Slider
                    max={2}
                    min={0}
                    onValueChange={(value) => {
                      const levels = ["beginner", "enthusiast", "expert"];
                      updateFormData(
                        "experienceLevel",
                        levels[
                          value[0] ?? 0
                        ] as OnboardingFormData["experienceLevel"]
                      );
                    }}
                    step={1}
                    value={
                      formData.experienceLevel
                        ? [
                            ["beginner", "enthusiast", "expert"].indexOf(
                              formData.experienceLevel
                            ),
                          ]
                        : [0]
                    }
                  />
                  <div className="relative flex text-caption text-muted-foreground">
                    <span className="absolute left-0">Beginner</span>
                    <span className="absolute left-1/2 -translate-x-1/2">
                      Enthusiast
                    </span>
                    <span className="absolute right-0">Expert</span>
                  </div>
                </div>
                {fieldErrors.experienceLevel && (
                  <FieldError>{fieldErrors.experienceLevel}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
              <div className="flex flex-col gap-1 md:pt-2">
                <FieldLabel>Preferred Brewing Methods</FieldLabel>
                <FieldDescription>
                  Select all that apply (optional)
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <TagsInput
                  disabled={false}
                  maxTags={20}
                  onChange={(value) => {
                    updateFormData("preferredBrewingMethods", value);
                  }}
                  placeholder="Type to add brewing methods..."
                  popularSuggestions={popularBrewingMethods}
                  value={formData.preferredBrewingMethods || []}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8">
              <div className="flex flex-col gap-1 md:pt-2">
                <FieldLabel>Brew Preferences</FieldLabel>
                <FieldDescription>Optional preferences</FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
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
              </div>
            </div>
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
