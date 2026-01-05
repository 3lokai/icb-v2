"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState } from "react";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/index";
import { toast } from "sonner";
import { PartnerFAQs } from "@/components/faqs/PartnerFAQs";
import PartnerFormModal from "./PartnerFormModal";

type PartnerPageClientProps = {
  submitForm: (
    formType: string,
    formData: FormData
  ) => Promise<{ success: boolean; error?: string; id?: string }>;
};

// InteractiveBentoCard component (reused from ContactForms pattern)
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

    <div className="relative z-10 card-padding flex flex-col h-full">
      <div className="flex transform-gpu flex-col gap-4 transition-all duration-500 group-hover:-translate-y-2 grow">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 group-hover:scale-110 transition-transform duration-500">
            <Icon name={icon} size={20} color="accent" />
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
          <Icon
            name="ArrowRight"
            size={14}
            color="accent"
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-500 group-hover:bg-accent/2" />
  </div>
);

// StatsBar Component
const StatsBar = () => {
  const stats = [
    { number: "60+", label: "Roasters Listed", urgent: false },
    { number: "2,000+", label: "Coffees Cataloged", urgent: false },
    { number: "10", label: "Founding Spots Left", urgent: true },
    { number: "0%", label: "Commission", urgent: false },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card-shell card-hover card-padding text-center rounded-xl relative"
        >
          {stat.urgent && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 bg-accent border-accent text-accent-foreground"
            >
              <Icon name="ClockClockwise" size={12} />
              Limited
            </Badge>
          )}
          <div className="text-display font-bold text-accent mb-2">
            {stat.number}
          </div>
          <div className="text-caption text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// BenefitsSection Component
const BenefitsSection = ({
  onCardClick,
}: {
  onCardClick: (tier: "free" | "verified" | "premium") => void;
}) => {
  const benefits = [
    {
      icon: "RocketLaunch" as IconName,
      title: "Early Mover Advantage",
      description:
        "Be featured when coffee enthusiasts discover the platform. Get visibility before competition floods in.",
      buttonText: "Get Started",
      tier: "free" as const,
    },
    {
      icon: "TrendUp" as IconName,
      title: "Growing Fast",
      description:
        "60+ roasters, 2,000+ coffees, and momentum building daily. Real data, real roasters, real impact.",
      buttonText: "Join Now",
      tier: "verified" as const,
    },
    {
      icon: "Handshake" as IconName,
      title: "Shape the Platform",
      description:
        "Direct input on features. Your feedback drives our roadmap. We build what roasters actually need.",
      buttonText: "Partner With Us",
      tier: "premium" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {benefits.map((benefit, index) => (
        <InteractiveBentoCard
          key={index}
          icon={benefit.icon}
          title={benefit.title}
          description={benefit.description}
          buttonText={benefit.buttonText}
          onClick={() => {
            trackEvent("partner_cta_clicked", "partner_page", benefit.tier);
            onCardClick(benefit.tier);
          }}
        />
      ))}
    </div>
  );
};

// HowItWorksSection Component
const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Submit Your Details",
      description:
        "Fill out a quick form with your roastery info, website, and contact details.",
    },
    {
      number: "2",
      title: "Choose Your Tier",
      description:
        "Start free or upgrade to Verified/Premium for enhanced features.",
    },
    {
      number: "3",
      title: "Go Live",
      description:
        "Your profile goes live within 24-48 hours. Start getting discovered.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {steps.map((step, index) => (
        <div
          key={index}
          className="card-shell card-padding rounded-xl relative"
        >
          <div className="text-hero font-bold text-primary mb-4">
            {step.number}
          </div>
          <h3 className="text-heading mb-3">{step.title}</h3>
          <p className="text-body-muted leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

// PricingTiers Component
const PricingTiers = ({
  onTierSelect,
}: {
  onTierSelect: (tier: "free" | "verified" | "premium") => void;
}) => {
  const tiers = [
    {
      name: "FREE",
      price: "₹0",
      period: "/ Forever",
      badge: null,
      features: [
        "Community listing",
        "Link to your website",
        "Community reviews visible",
        "Searchable in directory",
      ],
      cta: "Get Started",
      tier: "free" as const,
      featured: false,
    },
    {
      name: "VERIFIED",
      price: "₹3,500",
      originalPrice: "₹6,000",
      period: "/ year",
      badge: "First 10 Only - Then ₹6,000",
      features: [
        "Verified badge",
        "Claim & edit your profile",
        "Add roastery story & photos",
        "Product management dashboard",
        "Price locked forever",
        '"Founding Roaster" badge',
      ],
      cta: "Claim Founding Spot",
      tier: "verified" as const,
      featured: true,
    },
    {
      name: "PREMIUM",
      price: "₹15,000",
      period: "/ year",
      badge: "Limited Availability",
      features: [
        "Founding Partner recognition (permanent)",
        "Traffic analytics",
        "Unlimited photos/videos",
        "Custom profile sections",
        "Early access to new features",
        "Direct access",
        "Featured in launch posts",
      ],
      cta: "Request Invite",
      tier: "premium" as const,
      featured: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {tiers.map((tierData, index) => (
        <div
          key={index}
          className={cn(
            "card-base card-hover card-padding rounded-xl flex flex-col relative transition-all duration-300",
            tierData.featured &&
              "card-featured border-2 border-primary shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
          )}
        >
          {tierData.featured && (
            <Badge
              variant="default"
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-overline font-bold uppercase shadow-lg"
            >
              Most Popular
            </Badge>
          )}
          <div className="mb-6 min-h-[140px] flex flex-col">
            <div className="text-label text-muted-foreground mb-2">
              {tierData.name}
            </div>
            {tierData.originalPrice ? (
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-display font-bold text-accent italic">
                    {tierData.price}
                  </span>
                  <span className="text-body-muted">{tierData.period}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-title line-through text-muted-foreground">
                    {tierData.originalPrice}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-display font-bold text-accent">
                  {tierData.price}
                </span>
                <span className="text-body-muted">{tierData.period}</span>
              </div>
            )}
            {tierData.badge ? (
              <Badge
                variant="outline"
                className="mt-3 w-fit bg-accent/10 border-accent/30 text-accent"
              >
                <Icon name="ClockClockwise" size={14} />
                {tierData.badge}
              </Badge>
            ) : (
              <div className="mt-3 h-[24px]" />
            )}
          </div>

          <ul className="flex-1 space-y-3 mb-6">
            {tierData.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <Icon
                  name="CheckCircle"
                  className="text-accent h-5 w-5 shrink-0 mt-0.5"
                />
                <span className="text-caption text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="w-full transition-transform duration-300 hover:-translate-y-1"
            onClick={() => {
              trackEvent("partner_cta_clicked", "partner_page", tierData.tier);
              onTierSelect(tierData.tier);
            }}
          >
            {tierData.cta}
          </Button>
          {tierData.tier === "free" && (
            <p className="text-center text-micro text-muted-foreground mt-2">
              Submit your roastery to be listed. No payment required.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// FeaturesGrid Component
const FeaturesGrid = () => {
  const features = [
    {
      icon: "CheckCircle" as IconName,
      title: "Verified Badge",
      description: "Build trust with a platform-verified checkmark.",
    },
    {
      icon: "ArrowSquareOut" as IconName,
      title: "Direct Traffic",
      description: "We drive coffee lovers to YOUR website. Zero commission.",
    },
    {
      icon: "Image" as IconName,
      title: "Rich Profiles",
      description: "Upload photos, tell your story, showcase your process.",
    },
    {
      icon: "Star" as IconName,
      title: "Community Reviews",
      description: "Let customers share their experiences with your beans.",
    },
    {
      icon: "GearSix" as IconName,
      title: "Product Management",
      description: "Add, edit, and organize your coffee listings easily.",
    },
    {
      icon: "TrendUp" as IconName,
      title: "Performance Insights",
      description: "Understand what coffees resonate with your audience.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="card-base card-hover card-padding rounded-xl"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Icon name={feature.icon} size={24} />
            </div>
            <div>
              <h4 className="text-subheading font-medium mb-2">
                {feature.title}
              </h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// FinalCTA Component
const FinalCTA = ({
  onCtaClick,
}: {
  onCtaClick: (tier: "free" | "verified") => void;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
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

      <div className="relative p-8 md:p-12">
        <Stack gap="8">
          <Stack gap="6">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                Get Started
              </span>
            </div>
            <h2 className="text-display text-balance leading-[1.05] tracking-tight">
              Ready to Get{" "}
              <span className="text-accent italic">Discovered?</span>
            </h2>
            <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
              Join 60+ roasters already listed on India's fastest-growing coffee
              platform.
            </p>
          </Stack>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="transition-transform duration-300 hover:-translate-y-1 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-primary/90"
              onClick={() => {
                trackEvent("partner_cta_clicked", "partner_page", "verified");
                onCtaClick("verified");
              }}
            >
              Claim Your Founding Spot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-transform duration-300 hover:-translate-y-1"
              onClick={() => {
                trackEvent("partner_cta_clicked", "partner_page", "free");
                onCtaClick("free");
              }}
            >
              Start with Free Listing
            </Button>
          </div>

          <p className="text-caption text-muted-foreground">
            Questions? Email us at{" "}
            <a
              href="mailto:contact@indiancoffeebeans.com"
              className="text-accent hover:underline"
            >
              contact@indiancoffeebeans.com
            </a>
          </p>
        </Stack>
      </div>
    </div>
  );
};

export default function PartnerPageClient({
  submitForm,
}: PartnerPageClientProps) {
  const [activeForm, setActiveForm] = useState<
    "free" | "verified" | "premium" | null
  >(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const result = await submitForm("partner_inquiry", formData);

      if (result.success) {
        setFormSubmitted(true);
        trackEvent("partner_form_submitted", "partner_page", activeForm || "");
        toast.success("Request Submitted!", {
          description: "We'll reach out within 24 hours.",
        });
        setTimeout(() => {
          setFormSubmitted(false);
          setActiveForm(null);
        }, 3000);
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

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      trackEvent("partner_pricing_viewed", "partner_page", "");
    }
  };

  return (
    <div className="pb-20">
      <PageHeader
        title={
          <>
            Be Among the <span className="text-accent italic">First.</span>
            <br />
            Grow With Us.
          </>
        }
        overline="FOUNDING ROASTERS WANTED"
        description="We're building India's most comprehensive coffee platform. Join as a founding roaster and help shape the future of Indian specialty coffee discovery."
        rightSideContent={
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="transition-transform duration-300 hover:-translate-y-1 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-primary/90"
              onClick={() => {
                trackEvent("partner_cta_clicked", "partner_page", "verified");
                setActiveForm("verified");
              }}
            >
              Claim Founding Spot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-transform duration-300 hover:-translate-y-1"
              onClick={scrollToPricing}
            >
              See Pricing
            </Button>
          </div>
        }
      />

      <PageShell className="-mt-20 relative z-30">
        <Stack gap="16">
          {/* Stats Bar */}
          <Section spacing="tight">
            <StatsBar />
          </Section>

          {/* Benefits Section */}
          <Section spacing="default">
            <Stack gap="8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        The Benefits
                      </span>
                    </div>
                    <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                      Why Partner With{" "}
                      <span className="text-accent italic">Us?</span>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      Join India's fastest-growing coffee platform and get
                      discovered by thousands of coffee enthusiasts.
                    </p>
                  </Stack>
                </div>
                <div className="md:col-span-4 flex md:justify-end pb-2">
                  <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                    Growing Fast
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                  </div>
                </div>
              </div>
              <BenefitsSection
                onCardClick={(tier) => {
                  setActiveForm(tier);
                }}
              />
            </Stack>
          </Section>

          {/* How It Works */}
          <Section spacing="default">
            <Stack gap="8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        Simple Process
                      </span>
                    </div>
                    <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                      Get Listed in{" "}
                      <span className="text-accent italic">3 Steps.</span>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      From submission to going live, we make it easy to join the
                      platform and start getting discovered.
                    </p>
                  </Stack>
                </div>
                <div className="md:col-span-4 flex md:justify-end pb-2">
                  <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                    24-48 Hours
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                  </div>
                </div>
              </div>
              <HowItWorksSection />
            </Stack>
          </Section>

          {/* Pricing Tiers */}
          <div id="pricing">
            <Section spacing="default">
              <Stack gap="8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-8">
                    <Stack gap="6">
                      <div className="inline-flex items-center gap-4">
                        <span className="h-px w-8 md:w-12 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Pricing
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                        Choose Your{" "}
                        <span className="text-accent italic">Plan.</span>
                      </h2>
                      <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                        Start free or upgrade to unlock powerful features and
                        analytics. Founding roasters lock in special pricing
                        forever.
                      </p>
                    </Stack>
                  </div>
                  <div className="md:col-span-4 flex md:justify-end pb-2">
                    <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                      <span className="h-1 w-1 rounded-full bg-accent/40" />
                      Limited Time
                      <span className="h-1 w-1 rounded-full bg-accent/40" />
                    </div>
                  </div>
                </div>
                <PricingTiers
                  onTierSelect={(tier) => {
                    setActiveForm(tier);
                  }}
                />
                <p className="text-center text-micro text-muted-foreground mt-4">
                  Pricing reflects participation, not promotion.
                </p>
              </Stack>
            </Section>
          </div>

          {/* Features Grid */}
          <Section spacing="default">
            <Stack gap="8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        The Features
                      </span>
                    </div>
                    <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                      What&apos;s{" "}
                      <span className="text-accent italic">Included.</span>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      Everything you need to showcase your roastery and connect
                      with coffee enthusiasts across India.
                    </p>
                  </Stack>
                </div>
                <div className="md:col-span-4 flex md:justify-end pb-2">
                  <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                    Full Control
                    <span className="h-1 w-1 rounded-full bg-accent/40" />
                  </div>
                </div>
              </div>
              <FeaturesGrid />
            </Stack>
          </Section>

          {/* FAQ */}
          <PartnerFAQs />

          {/* Final CTA */}
          <Section spacing="loose">
            <FinalCTA
              onCtaClick={(tier) => {
                setActiveForm(tier);
              }}
            />
          </Section>
        </Stack>
      </PageShell>

      {/* Form Modal */}
      {activeForm && (
        <PartnerFormModal
          activeForm={activeForm}
          onClose={() => setActiveForm(null)}
          onSubmit={handleFormSubmit}
          formSubmitting={formSubmitting}
          formSubmitted={formSubmitted}
          formError={formError}
        />
      )}
    </div>
  );
}
