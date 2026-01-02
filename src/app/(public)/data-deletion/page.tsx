"use client";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { toast } from "sonner";

const CONTACT_EMAIL = "support@indiancoffeebeans.com";

export default function DataDeletionPage() {
  const emailTemplate = `Subject: Data Deletion Request - IndianCoffeeBeans Account

Dear IndianCoffeeBeans Team,

I request the deletion of my personal data from IndianCoffeeBeans.com.

Account Details:
- Email: [your-email@example.com]
- Name: [your name]
- Signed up via: [Facebook Login / Email / Other]

I understand that:
- My personal information will be permanently deleted
- My coffee ratings/reviews will remain but be anonymized to "Anonymous User"
- This action cannot be undone

Please confirm when deletion is complete.

Thank you,
[Your name]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailTemplate);
    toast.success("Template Copied!", {
      description: "You can now paste it into your email client.",
    });
  };

  return (
    <Stack gap="12" className="pb-20">
      {/* Hero Header */}
      <header className="relative pt-12 text-center">
        <Section spacing="tight">
          <Stack gap="6" className="items-center">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-accent/60" />
              <span className="text-micro font-bold uppercase tracking-[0.3em] text-accent">
                Compliance
              </span>
              <span className="h-px w-12 bg-accent/60" />
            </div>
            <h1 className="animate-fade-in-scale text-display text-primary text-balance leading-none">
              Data <span className="text-accent italic">Deletion.</span>
            </h1>
            <div className="text-caption font-bold uppercase tracking-widest text-muted-foreground/60 italic">
              Last Updated: June 6, 2025
            </div>
          </Stack>
        </Section>
      </header>

      <Section spacing="default">
        <div className="mx-auto max-w-3xl">
          <Stack
            gap="16"
            className="text-body-large text-muted-foreground leading-relaxed"
          >
            {/* Intro */}
            <Stack gap="6">
              <h2 className="text-title text-primary font-serif italic text-pretty leading-tight">
                What Data We Collect
              </h2>
              <Stack gap="4">
                <p>
                  We only collect basic profile information necessary for
                  account functionality. For Facebook Login Users, this includes
                  your display name, email, and optional profile picture.
                </p>
                <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5 italic text-accent font-medium">
                  &quot;We do not access your Facebook posts, friends list, or
                  other private information beyond your basic profile.&quot;
                </div>
              </Stack>
            </Stack>

            {/* How to Request */}
            <Stack gap="8">
              <h2 className="text-title text-primary font-serif italic text-pretty leading-tight">
                How to Request Deletion
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Stack
                  gap="4"
                  className="p-8 rounded-4xl border border-border/40 bg-muted/5"
                >
                  <span className="text-micro font-bold uppercase tracking-widest text-accent">
                    Step 01
                  </span>
                  <h3 className="font-serif italic text-heading text-primary">
                    Email Request
                  </h3>
                  <p className="text-caption">
                    Send your request to our privacy team at:
                  </p>
                  <a
                    className="text-accent font-bold underline-offset-4 hover:underline"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </Stack>

                <Stack
                  gap="4"
                  className="p-8 rounded-4xl border border-border/40 bg-muted/5"
                >
                  <span className="text-micro font-bold uppercase tracking-widest text-accent">
                    Step 02
                  </span>
                  <h3 className="font-serif italic text-heading text-primary">
                    Confirmation
                  </h3>
                  <p className="text-caption">
                    We&apos;ll send you a confirmation email within 7 days
                    acknowledging your request.
                  </p>
                </Stack>
              </div>

              <Stack gap="4" className="pt-4">
                <h3 className="text-micro font-bold uppercase tracking-widest text-muted-foreground">
                  Using The Template
                </h3>
                <div className="relative group overflow-hidden rounded-4xl border border-border/40 bg-card/5 transition-all">
                  <div className="p-8 font-mono text-caption whitespace-pre-wrap leading-relaxed">
                    {emailTemplate}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-background border-border shadow-sm group-hover:scale-105 transition-transform"
                      onClick={handleCopy}
                    >
                      Copy Template
                    </Button>
                  </div>
                </div>
              </Stack>
            </Stack>

            {/* Timeline */}
            <Stack gap="6">
              <h2 className="text-title text-primary font-serif italic text-pretty leading-tight text-center">
                Processing Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    days: "07 Days",
                    label: "Initial Response",
                    desc: "Identity verification and acknowledgement.",
                  },
                  {
                    days: "30 Days",
                    label: "Full Deletion",
                    desc: "Data permanently removed from all systems.",
                  },
                  {
                    days: "Final",
                    label: "Confirmation",
                    desc: "Receipt of completion confirmation.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-8 rounded-4xl border border-border/20 bg-background/50"
                  >
                    <div className="text-title font-serif italic text-accent mb-2">
                      {item.days}
                    </div>
                    <div className="text-micro font-bold uppercase tracking-widest text-primary mb-3">
                      {item.label}
                    </div>
                    <p className="text-caption leading-tight text-muted-foreground/80">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Stack>

            {/* Impacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border/20">
              <Stack gap="6">
                <h3 className="font-serif italic text-heading text-primary">
                  Permanently Deleted
                </h3>
                <ul className="space-y-4">
                  {[
                    "Your name and email address",
                    "Profile picture and personal info",
                    "Account preferences and settings",
                    "Login credentials and session data",
                  ].map((item) => (
                    <li className="flex items-start gap-3" key={item}>
                      <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Stack>

              <Stack gap="6">
                <h3 className="font-serif italic text-heading text-primary">
                  Anonymized Contributions
                </h3>
                <ul className="space-y-4">
                  {[
                    "Coffee ratings you submitted",
                    "Reviews and comments",
                    "Community contributions",
                  ].map((item) => (
                    <li className="flex items-start gap-3" key={item}>
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-caption italic opacity-80">
                  Your ratings help other coffee lovers make decisions. They
                  remain but show &quot;Anonymous User&quot;.
                </p>
              </Stack>
            </div>

            {/* Final Help */}
            <Stack gap="6" className="pt-12 border-t border-border/20">
              <h2 className="text-heading text-primary font-serif italic">
                Need Assistance?
              </h2>
              <p>
                If you have any questions about data deletion, please contact
                our privacy team at:{" "}
                <span className="text-accent font-medium">{CONTACT_EMAIL}</span>
              </p>
            </Stack>
          </Stack>
        </div>
      </Section>
    </Stack>
  );
}
