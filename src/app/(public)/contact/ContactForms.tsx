// src/app/(public)/contact/ContactForms.tsx
"use client";

// src/app/(public)/contact/ContactForms.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { FormModal } from "@/components/contactus/FormModal";
import { NewsletterSection } from "@/components/contactus/NewsletterSection";
import { SectionHeader } from "@/components/contactus/SectionHeader";
import { SocialMediaSection } from "@/components/contactus/SocialMediaSection";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Icon, type IconName } from "@/components/common/Icon";

type ContactFormsProps = {
  submitForm: (
    formType: string,
    formData: FormData
  ) => Promise<{ success: boolean; error?: string; id?: string }>;
  subscribeToNewsletter: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
};

export default function ContactForms({
  submitForm,
  subscribeToNewsletter,
}: ContactFormsProps) {
  const [activeForm, setActiveForm] = useState<
    "general" | "roaster" | "suggestion" | "professional"
  >("general");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const getModalButtonText = () => {
    if (activeForm === "roaster") return getRoasterButtonText();
    if (activeForm === "suggestion") return getSuggestionButtonText();
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
    <Stack gap="12" className="pb-20">
      {/* Hero Header - Editorial approach */}
      <header className="relative pt-16 lg:pt-24 overflow-hidden">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <Section spacing="tight">
          <div className="mx-auto max-w-4xl text-center">
            <Stack gap="8" className="items-center">
              <div className="flex items-center gap-4 animate-fade-in">
                <span className="h-px w-10 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.2em] uppercase">
                  Our Community
                </span>
                <span className="h-px w-10 bg-accent/60" />
              </div>

              <h1 className="text-display text-balance leading-[1.05] tracking-tight animate-fade-in-scale">
                Connect With <span className="text-accent italic">Us.</span>
              </h1>

              <p className="mx-auto max-w-2xl text-body-large text-muted-foreground leading-relaxed animate-fade-in delay-200">
                Join the Indian coffee community and help build the definitive
                resource for local coffee enthusiasts and professionals.
              </p>
            </Stack>
          </div>
        </Section>
      </header>

      {/* Coffee Enthusiasts Section */}
      <Section spacing="default">
        <Stack gap="12">
          <SectionHeader eyebrow="Community" title="For Coffee Enthusiasts" />

          <NewsletterSection
            formError={formError}
            formSubmitted={formSubmitted}
            formSubmitting={formSubmitting}
            getButtonText={getNewsletterButtonText}
            onSubmit={(e) => handleFormSubmit(e, "newsletter")}
          />

          {/* Action Cards - Refined Editorial Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                title: "Submit a Roaster",
                description:
                  "Know an amazing Indian coffee roaster that should be in our directory? Help us expand our coverage and support local businesses.",
                icon: "PlusCircle",
                action: () => setActiveForm("roaster"),
                buttonText: "Submit a Roaster",
              },
              {
                title: "Suggest Changes",
                description:
                  "Spotted outdated information? Have ideas for new features or improvements? We're always listening to our community.",
                icon: "PencilSimpleCircle",
                action: () => setActiveForm("suggestion"),
                buttonText: "Suggest Changes",
              },
            ].map((card) => (
              <div
                className="group relative flex flex-col p-10 rounded-[2.5rem] border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                key={card.title}
              >
                <Stack gap="8">
                  <div className="flex items-start justify-between">
                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-accent/20 group-hover:bg-accent/5 group-hover:scale-110">
                      <Icon
                        color="accent"
                        name={card.icon as IconName}
                        size={32}
                      />
                    </div>
                    <span className="text-micro font-bold text-muted-foreground/30 uppercase tracking-[0.2em] pt-2">
                      Active Form
                    </span>
                  </div>

                  <Stack gap="3">
                    <h3 className="font-serif italic text-title text-primary group-hover:text-accent transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </Stack>

                  <Button
                    variant="secondary"
                    className="w-full h-14 text-body font-bold uppercase tracking-widest bg-background border-border/60 hover-lift"
                    onClick={card.action}
                  >
                    {card.buttonText}
                  </Button>
                </Stack>
              </div>
            ))}
          </div>
        </Stack>
      </Section>

      {/* For Roasters Section - Magazine Layout */}
      <Section spacing="default">
        <Stack gap="12">
          <SectionHeader eyebrow="Partnerships" title="For Coffee Roasters" />

          <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
            {/* Magazine accent: stripe */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute left-0 top-0 h-full w-1.5 md:w-2 bg-gradient-to-b from-primary via-accent to-primary/60 opacity-60" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-12 xl:col-span-5 relative min-h-[400px] xl:min-h-0">
                <Image
                  alt="Coffee roaster at work"
                  className="object-cover"
                  fill
                  src="/images/contact/roaster.png"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent pointer-events-none" />
              </div>

              <div className="lg:col-span-12 xl:col-span-7 p-8 md:p-12 xl:p-16">
                <Stack gap="12">
                  <Stack gap="4">
                    <h3 className="text-title text-balance leading-[1.1] tracking-tight">
                      Claim Your{" "}
                      <span className="text-accent italic">Legacy.</span>
                    </h3>
                    <p className="text-body-large text-muted-foreground max-w-xl leading-relaxed">
                      Already listed in our directory? Claim your roastery
                      profile to take full control of your brand presence and
                      connect directly with our community.
                    </p>
                  </Stack>

                  <div className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
                    {[
                      "Update product information",
                      "Add seasonal offerings",
                      "Respond to reviews",
                      "Get verified badge",
                    ].map((item) => (
                      <div
                        className="flex items-center gap-4 text-caption font-bold uppercase tracking-wider text-primary/80"
                        key={item}
                      >
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-border/40">
                    <Stack gap="8">
                      <Button
                        asChild
                        size="lg"
                        className="h-14 px-12 text-body font-bold uppercase tracking-widest shadow-xl shadow-primary/5 hover-lift"
                      >
                        <Link href="/roasters/claim">Claim Your Listing</Link>
                      </Button>
                      <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/40">
                        Not listed yet?{" "}
                        <button
                          className="text-accent hover:text-accent/80 transition-colors underline decoration-accent/20 underline-offset-4"
                          onClick={() => setActiveForm("roaster")}
                          type="button"
                        >
                          Submit your roastery
                        </button>
                      </p>
                    </Stack>
                  </div>
                </Stack>
              </div>
            </div>
          </div>
        </Stack>
      </Section>

      {/* For Professionals Section - Editorial highlight */}
      <Section spacing="loose">
        <div className="relative overflow-hidden rounded-[3rem] border border-border bg-card p-12 md:p-20 shadow-sm">
          {/* Subtle grid background or accents */}
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

          <Stack gap="16" className="relative z-10">
            <Stack gap="4" className="items-center text-center">
              <SectionHeader
                align="center"
                eyebrow="Industry"
                title="For Coffee Professionals"
              />
              <p className="mx-auto max-w-3xl text-body-large text-muted-foreground leading-relaxed">
                We collaborate with industry leaders, educators, and coffee
                creators to enhance the Indian coffee ecosystem through
                deep-dive content, research-driven insights, and community-led
                education.
              </p>
            </Stack>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
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
                  className="group flex flex-col items-center text-center gap-8 p-10 rounded-[2.5rem] border border-border bg-background transition-all duration-500 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
                  key={item.title}
                >
                  <div className="h-20 w-20 flex items-center justify-center rounded-3xl border border-border bg-muted/30 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent group-hover:border-accent/20">
                    <Icon name={item.icon as IconName} size={36} />
                  </div>
                  <Stack gap="3">
                    <h4 className="font-serif italic text-title text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </Stack>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-16 text-body font-bold uppercase tracking-widest border-border hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 hover-lift shadow-sm"
                onClick={() => setActiveForm("professional")}
              >
                Get In Touch
              </Button>
            </div>
          </Stack>
        </div>
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
  );
}
