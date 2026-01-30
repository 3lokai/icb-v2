"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState, Fragment } from "react";
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
      "border border-border/50 bg-card/40 transition-all duration-500 hover:shadow-xl",
      "transform-gpu hover:-translate-y-1 cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    {/* Grid Background */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-1 bg-accent/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute right-0 top-0 h-12 w-12 bg-accent/5 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
    </div>

    <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
      <div className="flex transform-gpu flex-col gap-5 transition-all duration-500 grow">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-500">
            <Icon name={icon} size={24} color="accent" />
          </div>
          <div className="h-px w-8 bg-border/40 group-hover:w-12 transition-all duration-500" />
        </div>

        <Stack gap="3">
          <h4 className="text-title text-foreground tracking-tight italic">
            {title}
          </h4>
          <p className="text-pretty text-body-muted leading-relaxed">
            {description}
          </p>
        </Stack>
      </div>

      <div className="mt-8 pt-6 border-t border-border/10 flex w-full transform-gpu items-center opacity-60 transition-all duration-500 group-hover:opacity-100">
        <span className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-micro">
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
  </div>
);

// StatsBar Component - Refactored to a compact, editorial ribbon
const StatsBar = () => {
  const stats = [
    { number: "60+", label: "Roasters Listed", urgent: false },
    { number: "2,000+", label: "Coffees Cataloged", urgent: false },
    { number: "10", label: "Founding Spots Left", urgent: true },
    { number: "0%", label: "Commission", urgent: false },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm px-6 py-4 md:px-12 md:py-6">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
        {stats.map((stat, index) => (
          <Fragment key={index}>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 group">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2">
                  <span className="text-heading md:text-title font-bold text-accent tracking-tighter">
                    {stat.number}
                  </span>
                  {stat.urgent && (
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 border-accent/20 text-accent text-micro px-1.5 py-0 h-4 uppercase font-bold tracking-wider"
                    >
                      Limited
                    </Badge>
                  )}
                </div>
                <span className="text-micro md:text-overline uppercase tracking-[0.2em] font-bold text-muted-foreground/70">
                  {stat.label}
                </span>
              </div>
            </div>
            {index < stats.length - 1 && (
              <div className="hidden md:block h-10 w-px bg-border/40 rotate-[15deg]" />
            )}
          </Fragment>
        ))}
      </div>
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
      title: "Early Presence",
      description:
        "Be listed while discovery habits are still forming. Early roasters establish context, credibility, and visibility as users begin comparing coffees across brands.",
      buttonText: "Get listed",
      tier: "free" as const,
    },
    {
      icon: "TrendUp" as IconName,
      title: "Real Momentum",
      description:
        "A growing catalogue of Indian specialty coffees, active user ratings, and continuous discovery activity — all visible, verifiable, and brand-neutral. No inflated promises. Just traction you can see.",
      buttonText: "View the directory",
      tier: "verified" as const,
    },
    {
      icon: "Handshake" as IconName,
      title: "Help Shape the Platform",
      description:
        "Founding roasters have direct input on structure, taxonomy, and features — ensuring the platform reflects how Indian specialty coffee actually works. We build with roasters, not around them.",
      buttonText: "Partner with us",
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
      number: "01",
      title: "Submit Your Details",
      description:
        "Share your roastery details, website, and contact information. We verify accuracy — not marketing claims.",
    },
    {
      number: "02",
      title: "Choose Your Tier",
      description:
        "Start free, or opt for Verified / Premium for additional visibility and profile controls.",
    },
    {
      number: "03",
      title: "Go Live",
      description:
        "Your roaster profile goes live within 24–48 hours and becomes discoverable across the platform.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
      {steps.map((step, index) => (
        <div
          key={index}
          className="relative group flex flex-col items-center text-center md:items-start md:text-left"
        >
          {/* Large Background Number */}
          <div
            className="absolute -top-10 -left-6 font-bold text-accent/3 select-none pointer-events-none group-hover:text-accent/5 transition-colors duration-500"
            style={{ fontSize: "120px" }}
          >
            {step.number}
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-accent/5 text-accent border border-accent/10 group-hover:bg-accent/10 transition-colors duration-500">
              <span className="text-caption font-bold tracking-tighter w-6 h-6 flex items-center justify-center">
                {step.number.replace(/^0/, "")}
              </span>
            </div>
            <h3 className="text-title italic mb-4">{step.title}</h3>
            <p className="text-body-muted leading-relaxed max-w-[280px] md:max-w-none">
              {step.description}
            </p>
          </div>
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
      name: "COMMUNITY",
      price: "₹0",
      period: "forever",
      badge: null,
      features: [
        "Community listing",
        "Link to your website",
        "Community reviews visible",
        "Searchable in directory",
      ],
      cta: "Get Listed Free",
      tier: "free" as const,
      featured: false,
    },
    {
      name: "FOUNDING ROASTERS",
      price: "₹3,500",
      originalPrice: "₹6,000",
      period: "per year",
      badge: "Price Locked Forever",
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
      name: "FOUNDING PARTNER",
      price: "₹15,000",
      period: "per year",
      badge: "Limited Availability",
      features: [
        "Founding Partner recognition",
        "Traffic analytics & insights",
        "Unlimited photos/videos",
        "Custom profile sections",
        "Early access to new features",
        "Direct access to support",
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
            "group relative flex flex-col rounded-3xl transition-all duration-500",
            "bg-card/40 border-2",
            tierData.featured
              ? "border-accent shadow-2xl scale-[1.02] z-10 bg-card"
              : "border-border/40 hover:border-accent/40 hover:bg-card/60"
          )}
        >
          {tierData.featured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <Badge
                variant="default"
                className="bg-accent text-accent-foreground text-micro uppercase font-bold tracking-[0.2em] px-4 py-1.5 shadow-lg shadow-accent/20"
              >
                Recommended
              </Badge>
            </div>
          )}

          <div className="p-8 md:p-10 flex flex-col flex-1">
            <div className="mb-8">
              <div className="text-micro font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">
                {tierData.name}
              </div>

              <div className="min-h-[100px] flex flex-col justify-end">
                {tierData.originalPrice ? (
                  <Stack gap="1">
                    <div className="flex items-center gap-3">
                      <span className="text-micro font-bold uppercase tracking-wider text-muted-foreground/40 italic line-through decoration-accent/40 decoration-2">
                        {tierData.originalPrice}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-5 text-micro uppercase font-bold border-accent/20 text-accent bg-accent/5"
                      >
                        SAVE {(100 - (3500 / 6000) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-display font-bold text-accent tracking-tighter leading-none italic">
                          {tierData.price}
                        </span>
                        <span className="text-body-muted text-overline uppercase tracking-widest font-medium">
                          / {tierData.period}
                        </span>
                      </div>
                    </div>
                  </Stack>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-display font-bold text-foreground tracking-tighter leading-none">
                      {tierData.price}
                    </span>
                    <span className="text-body-muted text-overline uppercase tracking-widest font-medium">
                      / {tierData.period}
                    </span>
                  </div>
                )}
              </div>

              {tierData.badge && (
                <div className="mt-6 flex items-center gap-2 text-accent text-micro font-bold uppercase tracking-widest">
                  <Icon name="TrendUp" size={14} />
                  {tierData.badge}
                </div>
              )}
            </div>

            <div className="h-px w-full bg-border/20 mb-8" />

            <ul className="flex-1 space-y-4 mb-10">
              {tierData.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-start gap-4 group/item"
                >
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent group-hover/item:scale-125 transition-all shrink-0" />
                  <span className="text-caption text-foreground/80 leading-relaxed font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              variant={tierData.featured ? "default" : "outline"}
              className={cn(
                "w-full h-12 rounded-xl font-bold uppercase tracking-widest text-micro transition-all duration-300",
                tierData.featured
                  ? "bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 hover:-translate-y-1"
                  : "hover:border-accent hover:text-accent hover:bg-accent/5"
              )}
              onClick={() => {
                trackEvent(
                  "partner_cta_clicked",
                  "partner_page",
                  tierData.tier
                );
                onTierSelect(tierData.tier);
              }}
            >
              {tierData.cta}
            </Button>

            {tierData.tier === "free" && (
              <p className="text-center text-micro text-muted-foreground/60 italic mt-4">
                No credit card required to get listed.
              </p>
            )}
          </div>
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
      title: "Verified Listing",
      description:
        "Your roastery is reviewed and marked as active, helping users trust the information they see.",
    },
    {
      icon: "ArrowSquareOut" as IconName,
      title: "Direct Traffic",
      description:
        "We link directly to your website and purchase pages. No commissions. No intermediaries.",
    },
    {
      icon: "Image" as IconName,
      title: "Rich Profiles",
      description:
        "Add photos, share your story, and document your sourcing and roasting approach.",
    },
    {
      icon: "Star" as IconName,
      title: "Community Reviews",
      description:
        "Ratings and feedback from verified users, tied to specific coffees — not generic brand scores.",
    },
    {
      icon: "GearSix" as IconName,
      title: "Coffee & Product Management",
      description:
        "Add, update, and manage your coffee listings as they change through the year.",
    },
    {
      icon: "TrendUp" as IconName,
      title: "Performance Insights",
      description:
        "See how users discover and interact with your coffees — quietly, without vanity metrics.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group p-6 rounded-2xl border border-border/40 bg-card/20 hover:border-accent/30 hover:bg-card/40 transition-all duration-300"
        >
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-accent/5 text-accent border border-accent/10 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500 shrink-0">
              <Icon name={feature.icon} size={28} />
            </div>
            <div>
              <h4 className="text-heading italic mb-2">{feature.title}</h4>
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
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/60 shadow-2xl transition-all duration-700">
      {/* Editorial Accents */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/[0.03] blur-[120px]" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-accent/40" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative p-10 md:p-20 text-center md:text-left">
        <Stack gap="12">
          <Stack gap="6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-12 bg-accent/60" />
                <span className="text-overline text-accent tracking-[0.3em] font-bold">
                  GET STARTED
                </span>
              </div>
            </div>
            <h2 className="text-display md:text-[5rem] text-balance leading-[0.95] tracking-tight">
              Ready to Get{" "}
              <span className="text-accent italic">Discovered?</span>
            </h2>
            <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
              Join 60+ roasters already listed on IndianCoffeeBeans. Build
              long-term discovery for your coffees — without ads, commissions,
              or rankings.
            </p>
          </Stack>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              size="lg"
              className="h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase tracking-[0.2em] text-micro shadow-2xl shadow-accent/20 transition-all hover:-translate-y-1"
              onClick={() => {
                trackEvent("partner_cta_clicked", "partner_page", "verified");
                onCtaClick("verified");
              }}
            >
              Claim A Founding Spot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 border-border hover:border-accent hover:text-accent font-bold uppercase tracking-[0.2em] text-micro transition-all hover:-translate-y-1"
              onClick={() => {
                trackEvent("partner_cta_clicked", "partner_page", "free");
                onCtaClick("free");
              }}
            >
              Start with Free Listing
            </Button>
          </div>

          <p className="text-micro font-bold tracking-widest text-muted-foreground border-t border-border/10 pt-8 mt-4">
            Questions? Email us at{" "}
            <a
              href="mailto:contact@indiancoffeebeans.com"
              className="text-accent hover:underline lowercase italic font-medium"
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
            Be <span className="text-accent italic">Discovered.</span>
            <br />
            On a <span className="text-accent italic">Neutral </span>Ground.
          </>
        }
        overline="FOUNDING ROASTERS"
        description="IndianCoffeeBeans is a discovery and reputation layer for Indian specialty coffee. Your coffees are explored through structured data and user ratings - not ads or rankings."
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
              How Discovery Works
            </Button>
          </div>
        }
      />

      <PageShell className="-mt-20 relative z-30">
        <Stack gap="4">
          {/* Stats Bar */}
          <Section spacing="tight">
            <StatsBar />
          </Section>

          {/* Benefits Section */}
          <Section spacing="default">
            <Stack gap="8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-12">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        THE BENEFITS
                      </span>
                    </div>
                    <h2 className="text-title md:text-display text-balance leading-[1] tracking-tight">
                      Why Partner With{" "}
                      <span className="text-accent italic">
                        IndianCoffeeBeans?
                      </span>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      A neutral discovery layer for Indian specialty coffee —
                      built to surface coffees fairly, not promote brands
                      aggressively.
                    </p>
                  </Stack>
                </div>
              </div>
              <BenefitsSection
                onCardClick={(tier) => {
                  setActiveForm(tier);
                }}
              />
              <p className="text-micro text-muted-foreground/70 text-center md:text-left pt-2 border-t border-border/30 mt-2">
                IndianCoffeeBeans does not sell coffee, run ads, or rank brands.
              </p>
            </Stack>
          </Section>

          {/* How It Works */}
          <Section spacing="default">
            <Stack gap="12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        Simple Process
                      </span>
                    </div>
                    <h2 className="text-title md:text-display text-balance leading-[1] tracking-tight">
                      Get Listed in{" "}
                      <span className="text-accent italic">3 Steps.</span>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      From submission to going live, we keep onboarding simple
                      and transparent — no back-and-forth, no gatekeeping.
                    </p>
                  </Stack>
                </div>
                <div className="md:col-span-4 flex md:justify-end pb-2">
                  <div className="flex items-center gap-3 text-micro text-accent/60 uppercase tracking-[0.3em] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    24-48 Hours
                  </div>
                </div>
              </div>
              <HowItWorksSection />
              <p className="text-micro text-muted-foreground/70 text-center md:text-left pt-4 border-t border-border/30 mt-2">
                No commissions. No exclusivity. You control your presence.
              </p>
            </Stack>
          </Section>

          {/* Pricing Tiers */}
          <div id="pricing" className="scroll-mt-20">
            <Section spacing="default">
              <Stack gap="12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-8">
                    <Stack gap="6">
                      <div className="inline-flex items-center gap-4">
                        <span className="h-px w-8 md:w-12 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Pricing
                        </span>
                      </div>
                      <h2 className="text-title md:text-display text-balance leading-[1] tracking-tight">
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
                    <div className="flex items-center gap-3 text-micro text-accent/60 uppercase tracking-[0.3em] font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      Limited Time
                    </div>
                  </div>
                </div>
                <PricingTiers
                  onTierSelect={(tier) => {
                    setActiveForm(tier);
                  }}
                />
                <p className="text-center text-micro text-muted-foreground italic mt-4">
                  Pricing reflects participation and platform sustainability,
                  not paid promotion.
                </p>
              </Stack>
            </Section>
          </div>

          {/* Features Grid */}
          <Section spacing="default">
            <Stack gap="12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <Stack gap="6">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        The Features
                      </span>
                    </div>
                    <h2 className="text-title md:text-display text-balance leading-[1] tracking-tight">
                      What&apos;s{" "}
                      <span className="text-accent italic">Included?</span>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                      Everything you need to present your roastery clearly and
                      connect with serious coffee drinkers across India.
                    </p>
                  </Stack>
                </div>
                <div className="md:col-span-4 flex md:justify-end pb-2">
                  <div className="flex items-center gap-3 text-micro text-accent/60 uppercase tracking-[0.3em] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Full Control
                  </div>
                </div>
              </div>
              <FeaturesGrid />
              <p className="text-micro text-muted-foreground/70 text-center md:text-left pt-4 border-t border-border/30 mt-2">
                No ads. No sponsored placement. Discovery is driven by data and
                user activity.
              </p>
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
