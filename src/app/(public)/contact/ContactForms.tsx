"use client";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { FormModal } from "@/components/contactus/FormModal";
import { NewsletterSection } from "@/components/contactus/NewsletterSection";
import { SectionHeader } from "@/components/contactus/SectionHeader";
import { SocialMediaSection } from "@/components/contactus/SocialMediaSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

type ContactFormsProps = {
  submitForm: (
    formType: string,
    formData: FormData
  ) => Promise<{ success: boolean; error?: string; id?: string }>;
  subscribeToNewsletter: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
};

// Custom Card Component that matches BentoCard style but handles onClick
const InteractiveBentoCard = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  className,
}: {
  icon: IconName;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  className?: string;
}) => (
  <div
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
      "border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-md",
      "transform-gpu dark:border-border/40 dark:bg-card/40 cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-primary/40 via-accent/40 to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>

    <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
      <div className="flex transform-gpu flex-col gap-4 transition-all duration-500 group-hover:-translate-y-2 grow">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-500">
            <Icon name={icon} size={20} />
          </div>
        </div>

        <Stack gap="2">
          <h4 className="text-heading text-foreground tracking-tight">
            {title}
          </h4>
          <p className="text-pretty text-body-muted leading-relaxed">
            {description}
          </p>
        </Stack>
      </div>

      <div className="mt-4 flex w-full transform-gpu items-center opacity-70 transition-all duration-500 group-hover:opacity-100">
        <span className="flex items-center gap-2 text-accent font-medium text-caption">
          {buttonText}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-500 group-hover:bg-accent/2" />
  </div>
);

export default function ContactForms({
  submitForm,
  subscribeToNewsletter,
}: ContactFormsProps) {
  const searchParams = useSearchParams();
  const [activeForm, setActiveForm] = useState<
    "general" | "roaster" | "suggestion" | "professional" | "claim"
  >("general");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Check for form query parameter on mount
  useEffect(() => {
    const formParam = searchParams.get("form");
    if (formParam === "claim") {
      setActiveForm("claim");
    }
  }, [searchParams]);

  const getNewsletterButtonText = () => {
    if (formSubmitting) return "Joining...";
    if (formSubmitted) return "Joined!";
    return "Join Newsletter";
  };

  const getRoasterButtonText = () => {
    if (formSubmitting) return "Submitting...";
    if (formSubmitted) return "Submitted!";
    return "Submit Roaster";
  };

  const getSuggestionButtonText = () => {
    if (formSubmitting) return "Submitting...";
    if (formSubmitted) return "Submitted!";
    return "Submit Suggestion";
  };

  const getProfessionalButtonText = () => {
    if (formSubmitting) return "Submitting...";
    if (formSubmitted) return "Submitted!";
    return "Submit Inquiry";
  };

  const getClaimButtonText = () => {
    if (formSubmitting) return "Submitting...";
    if (formSubmitted) return "Submitted!";
    return "Submit Claim Request";
  };

  const getModalButtonText = () => {
    if (activeForm === "roaster") return getRoasterButtonText();
    if (activeForm === "suggestion") return getSuggestionButtonText();
    if (activeForm === "claim") return getClaimButtonText();
    return getProfessionalButtonText();
  };

  const handleFormSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      let result: { success: boolean; error?: string; id?: string };

      if (formType === "newsletter") {
        result = await subscribeToNewsletter(formData);
      } else {
        result = await submitForm(formType, formData);
      }

      if (result.success) {
        if (formType === "newsletter") {
          toast.success("Subscribed!", {
            description: "🎉 You have been added to our newsletter!",
          });
          form.reset();
        } else {
          setFormSubmitted(true);
          setTimeout(() => {
            setFormSubmitted(false);
            form.reset();
            setActiveForm("general");
          }, 3000);
        }
      } else if (formType === "newsletter") {
        toast.error("Subscription Failed", {
          description: result.error || "Something went wrong.",
        });
      } else {
        setFormError(
          result.error || "There was a problem submitting your form"
        );
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <PageHeader
        title={
          <>
            Connect With <span className="text-accent italic">Us.</span>
          </>
        }
        overline="Our Community"
        description="Join the Indian coffee community and help build the definitive resource for local coffee enthusiasts and professionals."
      />

      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <Stack gap="12">
          {/* Coffee Enthusiasts Section */}
          <div className="bg-background rounded-3xl p-6 md:p-10 border border-border/50 shadow-xl">
            <Stack gap="12">
              <SectionHeader
                eyebrow="Community"
                title="For Coffee Enthusiasts"
              />

              <NewsletterSection
                formError={formError}
                formSubmitted={formSubmitted}
                formSubmitting={formSubmitting}
                getButtonText={getNewsletterButtonText}
                onSubmit={(e) => handleFormSubmit(e, "newsletter")}
              />

              {/* Action Cards - Bento Grid Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InteractiveBentoCard
                  icon="PlusCircle"
                  title="Submit a Roaster"
                  description="Know an amazing Indian coffee roaster that should be in our directory? Help us expand our coverage and support local businesses."
                  buttonText="Submit Roaster"
                  onClick={() => setActiveForm("roaster")}
                />
                <InteractiveBentoCard
                  icon="PencilSimple"
                  title="Suggest Changes"
                  description="Spotted outdated information? Have ideas for new features or improvements? We're always listening to our community."
                  buttonText="Suggest Changes"
                  onClick={() => setActiveForm("suggestion")}
                />
              </div>
            </Stack>
          </div>

          {/* For Roasters Section - Magazine Feature */}
          <Section spacing="tight">
            <Stack gap="12">
              <SectionHeader
                eyebrow="Partnerships"
                title="For Coffee Roasters"
              />

              <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-primary via-accent to-primary/60 opacity-60" />
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-0">
                    <Image
                      alt="Coffee roaster at work"
                      className="object-cover"
                      fill
                      src="/images/contact/roaster.png"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-background/20 to-transparent pointer-events-none lg:bg-linear-to-l" />
                  </div>

                  <div className="lg:col-span-7 p-8 md:p-12">
                    <Stack gap="8">
                      <Stack gap="4">
                        <h3 className="text-heading text-balance">
                          Claim Your{" "}
                          <span className="text-accent italic">Legacy.</span>
                        </h3>
                        <p className="text-body text-muted-foreground leading-relaxed">
                          Already listed in our directory? Claim your roastery
                          profile to take full control of your brand presence
                          and connect directly with our community.
                        </p>
                      </Stack>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          "Update product information",
                          "Add seasonal offerings",
                          "Respond to reviews",
                          "Get verified badge",
                        ].map((item) => (
                          <div
                            className="flex items-center gap-3 text-caption font-medium text-foreground/80"
                            key={item}
                          >
                            <Icon
                              name="CheckCircle"
                              className="text-accent h-4 w-4"
                            />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Button
                          size="lg"
                          className="hover-lift"
                          onClick={() => setActiveForm("claim")}
                        >
                          Claim Your Listing
                        </Button>
                        <button
                          className="text-caption font-medium text-muted-foreground hover:text-accent transition-colors underline decoration-border/50 hover:decoration-accent/50 underline-offset-4"
                          onClick={() => setActiveForm("roaster")}
                          type="button"
                        >
                          Or submit a new roastery &rarr;
                        </button>
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            </Stack>
          </Section>

          {/* For Professionals Section */}
          <Section spacing="tight">
            <Stack gap="12">
              <SectionHeader
                align="left"
                eyebrow="Industry"
                title="For Coffee Professionals"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "Megaphone",
                    title: "Guest Articles",
                    description:
                      "Share your expertise through guest posts on brewing, roasting, or coffee culture.",
                  },
                  {
                    icon: "UsersThree",
                    title: "Collaborations",
                    description:
                      "Partner on industry research or data sharing to enhance the community.",
                  },
                  {
                    icon: "GraduationCap",
                    title: "Education",
                    description:
                      "Create guides, tutorials, or educational materials for coffee enthusiasts.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group relative flex flex-col gap-4 p-8 rounded-2xl border border-border bg-card/50 hover:bg-card transition-all duration-300 hover:border-accent/20"
                  >
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon name={item.icon as IconName} size={24} />
                    </div>
                    <div>
                      <h4 className="text-subheading font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-caption text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover-lift min-w-[200px]"
                  onClick={() => setActiveForm("professional")}
                >
                  Get In Touch
                </Button>
              </div>
            </Stack>
          </Section>

          {/* Follow & Connect Section */}
          <SocialMediaSection />

          {/* Form Modal Section */}
          {activeForm !== "general" && (
            <FormModal
              activeForm={activeForm}
              formError={formError}
              formSubmitted={formSubmitted}
              formSubmitting={formSubmitting}
              getButtonText={getModalButtonText}
              onClose={() => setActiveForm("general")}
              onSubmit={handleFormSubmit}
            />
          )}
        </Stack>
      </div>
    </div>
  );
}
