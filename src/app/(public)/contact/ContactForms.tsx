// src/app/(public)/contact/ContactForms.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Icon, IconName } from "@/components/common/Icon";
import { FormModal } from "../../../components/contactus/FormModal";
import { NewsletterSection } from "../../../components/contactus/NewsletterSection";
import { SectionHeader } from "../../../components/contactus/SectionHeader";
import { SocialMediaSection } from "../../../components/contactus/SocialMediaSection";

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
    if (formSubmitting) {
      return "Joining...";
    }
    if (formSubmitted) {
      return "Joined!";
    }
    return "Join Newsletter";
  };

  const getRoasterButtonText = () => {
    if (formSubmitting) {
      return "Submitting...";
    }
    if (formSubmitted) {
      return "Roaster Submitted!";
    }
    return "Submit Roaster";
  };

  const getSuggestionButtonText = () => {
    if (formSubmitting) {
      return "Submitting...";
    }
    if (formSubmitted) {
      return "Suggestion Submitted!";
    }
    return "Submit Suggestion";
  };

  const getProfessionalButtonText = () => {
    if (formSubmitting) {
      return "Submitting...";
    }
    if (formSubmitted) {
      return "Inquiry Submitted!";
    }
    return "Submit Inquiry";
  };

  const getModalButtonText = () => {
    if (activeForm === "roaster") {
      return getRoasterButtonText();
    }
    if (activeForm === "suggestion") {
      return getSuggestionButtonText();
    }
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
    <div>
      {/* Hero Header - Glass treatment for impact */}
      <header className="relative mb-16 text-center">
        <div className="surface-0 -z-10 absolute inset-0 rounded-3xl" />
        <div className="relative z-10 py-12">
          <h1 className="mb-6 animate-fade-in-scale text-balance text-display text-primary">
            Connect With Us
          </h1>
          <p className="mx-auto max-w-3xl text-body text-muted-foreground">
            Join the Indian coffee community and help build the definitive
            resource for local coffee
          </p>
        </div>
      </header>

      {/* Coffee Enthusiasts Section - Clean approach */}
      <section className="mb-20">
        <SectionHeader title="For Coffee Enthusiasts" />

        <NewsletterSection
          formError={formError}
          formSubmitted={formSubmitted}
          formSubmitting={formSubmitting}
          getButtonText={getNewsletterButtonText}
          onSubmit={(e) => handleFormSubmit(e, "newsletter")}
        />

        {/* Action Cards - Clean approach */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="group rounded-lg border border-border/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-lg">
            <div className="mb-4">
              <div className="mb-4 h-14 w-14 flex-center rounded-full bg-secondary transition-transform duration-300 group-hover:scale-110">
                <Icon color="primary" name="Plus" size={28} />
              </div>
              <h3 className="text-heading text-primary transition-colors duration-200 group-hover:text-accent">
                Submit a Roaster
              </h3>
              <p className="mt-2 text-caption text-foreground">
                Know an amazing Indian coffee roaster that should be in our
                directory? Help us expand our coverage.
              </p>
            </div>
            <button
              className="btn-secondary w-full"
              onClick={() => setActiveForm("roaster")}
              type="button"
            >
              Submit a Roaster
            </button>
          </div>

          <div className="group rounded-lg border border-border/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-lg">
            <div className="mb-4">
              <div className="mb-4 h-14 w-14 flex-center rounded-full bg-secondary transition-transform duration-300 group-hover:scale-110">
                <Icon color="primary" name="PencilSimple" size={28} />
              </div>
              <h3 className="text-heading text-primary transition-colors duration-200 group-hover:text-accent">
                Suggest Changes
              </h3>
              <p className="mt-2 text-caption text-foreground">
                Spotted outdated information? Have ideas for new features or
                improvements? We would love to hear from you.
              </p>
            </div>
            <button
              className="btn-secondary w-full"
              onClick={() => setActiveForm("suggestion")}
              type="button"
            >
              Suggest Changes
            </button>
          </div>
        </div>
      </section>

      {/* For Roasters Section - Clean approach */}
      <section className="mb-20">
        <SectionHeader title="For Coffee Roasters" />

        <div className="overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Image
                alt="Coffee roaster"
                className="object-cover"
                fill
                src="/images/contact/roaster.png"
              />
            </div>

            <div className="card-padding">
              <h3 className="mb-4 text-heading text-primary">
                Claim Your Listing
              </h3>
              <p className="mb-4 text-body text-foreground">
                Already listed in our directory? Claim your roastery profile to:
              </p>

              <ul className="mb-6 space-y-3">
                {[
                  "Update your product information",
                  "Add special offers and seasonal beans",
                  "Respond to customer reviews",
                  "Get verified status with a badge",
                ].map((item) => (
                  <li className="flex items-center" key={item}>
                    <div className="mr-3 h-5 w-5 flex-shrink-0 text-accent">
                      <Icon color="accent" name="Check" size={20} />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                className="btn-primary mb-4 block w-full py-3 text-center"
                href="/roasters/claim"
              >
                Claim Your Listing
              </Link>

              <p className="text-center text-muted-foreground text-caption">
                Not listed yet?
                <button
                  className="ml-1 text-accent transition-colors duration-200 hover:text-accent-foreground hover:underline"
                  onClick={() => setActiveForm("roaster")}
                  type="button"
                >
                  Submit your roastery
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals Section - Glass treatment for emphasis */}
      <section className="mb-20">
        <div className="surface-2 card-padding relative overflow-hidden rounded-3xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative z-10">
            <SectionHeader align="center" title="For Coffee Professionals" />
            <div className="mb-6">
              <h3 className="mb-2 text-heading text-primary">
                Partner With Us
              </h3>
              <p className="mx-auto max-w-2xl text-body text-muted-foreground">
                We collaborate with coffee professionals across the industry to
                enhance the Indian coffee ecosystem.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  icon: "Megaphone",
                  title: "Guest Articles",
                  description:
                    "Share your expertise through guest posts on brewing, roasting, or coffee culture",
                },
                {
                  icon: "Users",
                  title: "Research Collaboration",
                  description:
                    "Partner on industry research or data sharing to enhance the coffee community",
                },
                {
                  icon: "GraduationCap",
                  title: "Educational Content",
                  description:
                    "Create guides, tutorials, or educational materials for coffee enthusiasts",
                },
              ].map((item) => (
                <div
                  className="group rounded-lg border border-border/30 bg-card/40 p-6 text-center"
                  key={item.title}
                >
                  <div className="mx-auto mb-3 h-12 w-12 flex-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                    <Icon
                      color="primary"
                      name={item.icon as IconName}
                      size={24}
                    />
                  </div>
                  <h4 className="mb-2 text-heading text-primary transition-colors duration-200 group-hover:text-accent">
                    {item.title}
                  </h4>
                  <p className="text-caption leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                className="btn-primary hover-lift"
                onClick={() => setActiveForm("professional")}
                type="button"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Follow & Connect Section - Clean approach */}
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
    </div>
  );
}
