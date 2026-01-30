// app/roasters/terms/page.tsx
import type { Metadata } from "next";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { roastersTermsPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "Roaster Partnership Agreement - IndianCoffeeBeans.com",
  description:
    "Terms and conditions for roaster partnerships and subscription services on IndianCoffeeBeans.com.",
  keywords: [
    "roaster partnership",
    "roaster terms",
    "subscription terms",
    "coffee roaster agreement",
    "partnership agreement",
  ],
  canonical: "/roasters/terms",
  type: "website",
});

export default function RoastersTermsPage() {
  const sections = [
    { id: "service-tiers", label: "1. Service Tiers and Features" },
    { id: "subscription", label: "2. Subscription Terms" },
    { id: "profile-ownership", label: "3. Profile Ownership and Verification" },
    { id: "platform-usage", label: "4. Platform Usage and Restrictions" },
    { id: "traffic", label: "5. Traffic and Performance" },
    { id: "commission", label: "6. Commission Structure" },
    { id: "data-privacy", label: "7. Data and Privacy" },
    { id: "ip", label: "8. Intellectual Property" },
    { id: "disclaimer", label: "9. Disclaimer and Limitation of Liability" },
    { id: "termination", label: "10. Term and Termination" },
    { id: "changes", label: "11. Changes to Agreement" },
    { id: "disputes", label: "12. Dispute Resolution" },
    { id: "general", label: "13. General Provisions" },
    { id: "contact", label: "14. Contact Information" },
    { id: "founding", label: "15. Founding Roaster Program" },
  ];

  return (
    <>
      <StructuredData schema={roastersTermsPageSchema} />
      <Stack gap="16">
        {/* Hero Header */}
        <header className="relative pt-12 text-center text-primary">
          <Section spacing="tight">
            <Stack gap="6" className="items-center">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.2em]">
                  Partnership Agreement
                </span>
                <span className="h-px w-12 bg-accent/60" />
              </div>
              <h1 className="animate-fade-in-scale text-display text-primary text-balance leading-[1.05]">
                Roaster Partnership{" "}
                <span className="text-accent italic">Agreement</span>
              </h1>
              <p className="mx-auto max-w-3xl text-body-large text-muted-foreground leading-relaxed md:text-heading">
                The terms and conditions that govern our partnership with coffee
                roasters and subscription services.
              </p>
              <div className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
                Last Updated: January 2, 2026
              </div>
            </Stack>
          </Section>
        </header>

        {/* Content Section */}
        <Section contained={true} spacing="default">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <aside className="md:col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <div className="rounded-2xl border border-border/30 bg-muted/5 p-8">
                <Stack gap="6">
                  <h2 className="text-heading text-primary font-serif italic">
                    Quick Navigation
                  </h2>
                  <div className="h-px w-12 bg-accent/60" />
                  <nav className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-accent/20">
                    {sections.map((item) => (
                      <a
                        href={`#${item.id}`}
                        key={item.id}
                        className="text-micro font-medium uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </Stack>
              </div>
            </aside>

            <div className="md:col-span-12 lg:col-span-8">
              <Stack
                gap="12"
                className="text-body-large text-muted-foreground leading-relaxed"
              >
                <section id="introduction">
                  <p className="text-foreground">
                    This Roaster Partnership Agreement (&quot;Agreement&quot;)
                    is entered into between IndianCoffeeBeans (&quot;we&quot;,
                    &quot;us&quot;, or &quot;our&quot;), operated from
                    Hyderabad, India, and the coffee roaster or business entity
                    (&quot;Roaster&quot;, &quot;you&quot;, or &quot;your&quot;)
                    accessing our roaster partnership services.
                  </p>
                  <p className="text-foreground mt-4">
                    By subscribing to any paid tier (Verified or Premium),
                    submitting payment, or claiming your roaster profile, you
                    agree to be bound by these terms.
                  </p>
                </section>

                <section id="service-tiers">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      1. Service Tiers and Features
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          1.1 Free Tier
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Basic directory listing with roaster name, location, and website link",
                            "Visibility in search and browse functions",
                            "Community reviews displayed on profile",
                            "No payment required",
                            "No guaranteed placement or priority",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          1.2 Verified Tier (₹3,500/year - Founding Roaster
                          Rate)
                        </h3>
                        <p className="text-micro font-bold uppercase tracking-widest text-accent mb-3">
                          Regular price: ₹6,000/year after first 10 founding
                          roasters
                        </p>
                        <p className="mb-3">
                          Includes all Free Tier features plus:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "Verified badge displayed on profile",
                            "Ability to claim and edit roaster profile",
                            "Add roaster story, photos (up to 5), and detailed information",
                            "Product management dashboard to add/edit coffee listings",
                            "Basic traffic analytics (profile views, clicks to website, product page views)",
                            "Ability to respond to community reviews",
                            "Priority customer support via email",
                            '"Founding Roaster" badge (first 10 roasters only)',
                            "Featured mention in launch communications (first 10 roasters only)",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 font-bold text-foreground">
                          Price Lock Guarantee: Founding roasters (first 10)
                          lock in ₹3,500/year rate permanently, even when
                          regular price increases to ₹6,000/year.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          1.3 Premium Tier (₹15,000/year)
                        </h3>
                        <p className="text-micro font-bold uppercase tracking-widest text-accent mb-3">
                          Limited availability
                        </p>
                        <p className="mb-3">
                          Includes all Verified Tier features plus:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "Advanced analytics dashboard with detailed traffic breakdowns",
                            "Competitor benchmarking (anonymized comparative data)",
                            "Unlimited photos and video uploads",
                            "Custom profile sections and enhanced branding",
                            "Email capture widget to build mailing list from traffic",
                            "Quarterly profile optimization reviews and consultations",
                            "Priority WhatsApp support",
                            "Early access to new platform features",
                            "Data cleanup and product catalog management service (launching Q2 2026)",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="subscription">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      2. Subscription Terms
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          2.1 Billing and Payment
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "All subscriptions are billed annually in advance",
                            "Payment is processed via Instamojo (UPI, cards, net banking, wallets accepted)",
                            "Prices are shown in Indian Rupees (INR) and are final",
                            "We are currently not GST registered; prices do not include GST",
                            "Payment confirmation serves as acceptance of these terms",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          2.2 Automatic Renewal
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Subscriptions automatically renew annually unless cancelled",
                            "Renewal occurs at the same rate you initially subscribed (price lock applies to founding roasters)",
                            "We will send email notification 30 days before renewal",
                            "You may cancel renewal at any time before renewal date",
                            "Cancellation takes effect at end of current subscription period",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          2.3 Cancellation and Refunds
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You may cancel your subscription at any time through your dashboard or by contacting us",
                            "Cancellation prevents future charges but does not refund current subscription period",
                            "7-Day Money-Back Guarantee: Full refund available within 7 days of initial purchase if unsatisfied",
                            "After 7 days, no refunds for partial subscription periods",
                            "Upon cancellation, your profile reverts to Free Tier at end of paid period",
                            "Founding Roaster benefits are forfeited if subscription is cancelled and not renewed within 60 days",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          2.4 Price Changes
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "We reserve the right to change subscription prices with 60 days notice",
                            "Price changes apply to new subscribers and renewals (except founding roasters with price lock)",
                            "Existing subscribers will receive email notification of price changes before renewal",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="profile-ownership">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      3. Profile Ownership and Verification
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          3.1 Profile Claiming Process
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You may claim an existing roaster profile by providing proof of business ownership",
                            "Acceptable verification: email from business domain, business registration documents, or social media account verification",
                            "Verification typically completed within 24-48 hours",
                            "We reserve the right to request additional documentation if ownership is disputed",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          3.2 Profile Content Rights
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You retain ownership of all content you upload (photos, descriptions, product information)",
                            "By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to display this content on our platform",
                            "You confirm that you have rights to all uploaded content and that it does not infringe on third-party rights",
                            "We may use roaster names, logos, and basic information in marketing materials and promotional content",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          3.3 Content Guidelines
                        </h3>
                        <p className="mb-3">All profile content must:</p>
                        <div className="grid gap-3">
                          {[
                            "Be accurate and not misleading",
                            "Comply with Indian food safety and advertising regulations",
                            "Not contain offensive, defamatory, or inappropriate material",
                            "Not make unsubstantiated health claims about coffee products",
                            "Include only coffee products you actually produce or sell",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4">
                          We reserve the right to remove content that violates
                          these guidelines.
                        </p>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="platform-usage">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      4. Platform Usage and Restrictions
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          4.1 Permitted Use
                        </h3>
                        <p className="mb-3">
                          You may use the roaster dashboard to:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "Update your roaster profile information",
                            "Add, edit, and remove coffee product listings",
                            "Respond to customer reviews (politely and professionally)",
                            "View analytics and performance metrics",
                            "Download reports (Premium tier only)",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          4.2 Prohibited Activities
                        </h3>
                        <p className="mb-3">You may not:</p>
                        <div className="grid gap-3">
                          {[
                            "Create multiple accounts to circumvent tier limitations",
                            "Upload content belonging to other roasters or brands",
                            "Manipulate reviews or ratings (fake reviews, incentivized positive reviews)",
                            "Scrape data from other roaster profiles",
                            "Use automated tools to manipulate analytics or engagement",
                            "Resell or share your account access with others",
                            "Use the platform primarily for competitor research without maintaining active roaster profile",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          4.3 Review Response Guidelines
                        </h3>
                        <p className="mb-3">When responding to reviews:</p>
                        <div className="grid gap-3">
                          {[
                            "Remain professional and courteous, even with negative reviews",
                            "Do not offer incentives for review modification or deletion",
                            "Do not include personal information about reviewers",
                            "Do not make false claims about products or competitors",
                            "Focus on addressing concerns and providing helpful information",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4">
                          Violations may result in loss of review response
                          privileges or account suspension.
                        </p>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="traffic">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      5. Traffic and Performance
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          5.1 No Traffic Guarantees
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "We do not guarantee specific traffic volumes, conversion rates, or sales",
                            "Platform traffic depends on SEO, marketing efforts, and user engagement",
                            "Your profile visibility depends on multiple factors including relevance, ratings, and content quality",
                            "Premium placement does not guarantee increased sales",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          5.2 Analytics Accuracy
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Analytics are provided for informational purposes",
                            "We strive for accuracy but cannot guarantee 100% precision",
                            "Data may be delayed by up to 24-48 hours",
                            "We are not liable for business decisions made based on analytics data",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          5.3 Platform Changes
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "We may modify platform features, layout, or algorithms at any time",
                            "Changes are made to improve user experience and platform performance",
                            "We will notify roasters of major changes affecting paid features",
                            "No compensation for temporary unavailability during updates",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="commission">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      6. Commission Structure
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          6.1 Zero Commission Model
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "We do NOT take commission on sales made through our platform",
                            "All traffic is directed to your website",
                            "You handle all transactions, fulfillment, and customer service independently",
                            "We are not a party to any transaction between you and customers",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          6.2 Affiliate Links (Optional)
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "We may include affiliate tracking in links to your website (if you have affiliate program)",
                            "Affiliate commissions are negotiated separately and are optional",
                            "You decide whether to participate in any affiliate arrangements",
                            "Affiliate participation does not affect your subscription price or profile visibility",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="data-privacy">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      7. Data and Privacy
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          7.1 Your Data
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You retain ownership of all business data and content you upload",
                            "We collect analytics data about profile performance for your benefit",
                            "We may use aggregated, anonymized data for platform improvements and industry insights",
                            "See our Privacy Policy for details on data handling",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          7.2 Customer Data
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Email capture widget (Premium tier) allows you to build mailing list",
                            "You are solely responsible for compliance with email marketing regulations",
                            "You must obtain proper consent before sending marketing emails",
                            "We are not responsible for your email marketing practices",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          7.3 Export and Portability
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You may export your product data and analytics at any time",
                            "Export formats: CSV, JSON (depending on data type)",
                            "Account closure includes option to download all your data",
                            "We retain anonymized analytics data after account closure",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="ip">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      8. Intellectual Property
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          8.1 Your Trademarks
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You grant us limited license to display your business name, logo, and trademarks on our platform",
                            "This license is non-exclusive and terminates when your account is closed",
                            "We will not use your trademarks in ways that suggest endorsement beyond directory listing",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          8.2 Platform IP
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "IndianCoffeeBeans name, logo, and platform design are our intellectual property",
                            "You may reference your listing on our platform in marketing materials",
                            "You may not imply exclusive partnership or endorsement without written permission",
                            '"Verified" and "Founding Roaster" badges are our trademarks and may not be used outside our platform',
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="disclaimer">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      9. Disclaimer and Limitation of Liability
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          9.1 Platform Disclaimer
                        </h3>
                        <p className="mb-3">
                          IndianCoffeeBeans is provided &quot;as is&quot;
                          without warranties of any kind. We do not warrant
                          that:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "The platform will be uninterrupted or error-free",
                            "Traffic or exposure will increase sales",
                            "Analytics will be completely accurate",
                            "Reviews will always be fair or accurate",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          9.2 Limitation of Liability
                        </h3>
                        <p className="mb-3">
                          To the maximum extent permitted by law, our total
                          liability to you for any claims arising from this
                          agreement shall not exceed the amount you paid for
                          your subscription in the 12 months prior to the claim.
                        </p>
                        <p className="mb-3">We are not liable for:</p>
                        <div className="grid gap-3">
                          {[
                            "Lost profits, revenue, or business opportunities",
                            "Indirect, consequential, or punitive damages",
                            "User reviews or customer complaints",
                            "Third-party actions or content",
                            "Data loss or security breaches beyond our control",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          9.3 Indemnification
                        </h3>
                        <p>
                          You agree to indemnify and hold harmless
                          IndianCoffeeBeans from any claims, damages, or
                          expenses arising from:
                        </p>
                        <div className="grid gap-3 mt-3">
                          {[
                            "Your content or product listings",
                            "Your interactions with customers",
                            "Your violation of laws or regulations",
                            "Your violation of third-party rights (trademarks, copyrights, etc.)",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="termination">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      10. Term and Termination
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          10.1 Term
                        </h3>
                        <p>
                          This agreement begins when you subscribe and continues
                          until terminated by either party.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          10.2 Termination by You
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "You may cancel your subscription at any time",
                            "Cancellation takes effect at end of current billing period",
                            "Profile reverts to Free Tier after paid period expires",
                            "You may delete your profile entirely by contacting us",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          10.3 Termination by Us
                        </h3>
                        <p className="mb-3">
                          We may suspend or terminate your account immediately
                          if you:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "Violate these terms",
                            "Engage in fraudulent activity",
                            "Upload illegal or infringing content",
                            "Manipulate reviews or analytics",
                            "Fail to pay subscription fees",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4">
                          Upon termination for cause, no refund will be provided
                          for remaining subscription period.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          10.4 Effect of Termination
                        </h3>
                        <p className="mb-3">Upon termination:</p>
                        <div className="grid gap-3">
                          {[
                            "Your access to paid features ends immediately",
                            "Your profile may revert to Free Tier or be removed entirely",
                            "You lose access to analytics and dashboard",
                            "You may export your data within 30 days of termination",
                            "Founding Roaster benefits are permanently forfeited",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="changes">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      11. Changes to Agreement
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          11.1 Modifications
                        </h3>
                        <p>
                          We may update these terms at any time by posting
                          revised version on our website with new &quot;Last
                          Updated&quot; date.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          11.2 Notice of Changes
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Material changes will be emailed to all roaster partners",
                            "Changes take effect 30 days after notification",
                            "Continued use after changes constitutes acceptance",
                            "If you don't agree to changes, you may cancel subscription",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="disputes">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      12. Dispute Resolution
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          12.1 Informal Resolution
                        </h3>
                        <p>
                          Before pursuing formal legal action, you agree to
                          contact us at{" "}
                          <a
                            className="text-accent underline font-bold"
                            href="mailto:support@indiancoffeebeans.com"
                          >
                            support@indiancoffeebeans.com
                          </a>{" "}
                          to attempt informal resolution. Most disputes can be
                          resolved efficiently through direct communication.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          12.2 Governing Law
                        </h3>
                        <p>
                          This agreement is governed by the laws of India. Any
                          disputes shall be subject to the exclusive
                          jurisdiction of courts in Hyderabad, Telangana, India.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          12.3 Limitation Period
                        </h3>
                        <p>
                          Any claims arising from this agreement must be filed
                          within one (1) year of the claim arising, or be
                          permanently barred.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          12.4 No Class Actions
                        </h3>
                        <p>
                          You waive any right to class action proceedings.
                          Disputes must be resolved individually.
                        </p>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="general">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      13. General Provisions
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          13.1 Entire Agreement
                        </h3>
                        <p>
                          This agreement, together with our general Terms of
                          Service and Privacy Policy, constitutes the entire
                          agreement between you and IndianCoffeeBeans.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          13.2 Severability
                        </h3>
                        <p>
                          If any provision is found invalid or unenforceable,
                          remaining provisions continue in full effect.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          13.3 No Waiver
                        </h3>
                        <p>
                          Our failure to enforce any provision does not
                          constitute a waiver of that provision.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          13.4 Assignment
                        </h3>
                        <p>
                          You may not assign this agreement without our written
                          consent. We may assign this agreement to any successor
                          entity.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          13.5 Force Majeure
                        </h3>
                        <p>
                          We are not liable for failures or delays caused by
                          circumstances beyond our reasonable control (natural
                          disasters, government actions, internet outages,
                          etc.).
                        </p>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="contact">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      14. Contact Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <p>
                        <strong>
                          For roaster partnership questions or support:
                        </strong>
                      </p>
                      <div className="rounded-2xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-8 transition-all hover:bg-accent/10">
                        <Stack gap="1">
                          <p className="font-bold text-foreground text-heading">
                            IndianCoffeeBeans
                          </p>
                          <p>Hyderabad, Telangana, India</p>
                          <p>
                            Email:{" "}
                            <a
                              className="text-accent font-bold underline"
                              href="mailto:contact@indiancoffeebeans.com"
                            >
                              contact@indiancoffeebeans.com
                            </a>
                          </p>
                          <p>
                            Support:{" "}
                            <a
                              className="text-accent font-bold underline"
                              href="mailto:support@indiancoffeebeans.com"
                            >
                              support@indiancoffeebeans.com
                            </a>
                          </p>
                        </Stack>
                      </div>
                      <div className="grid gap-3 mt-4">
                        <p>
                          <strong>For verification and account issues:</strong>
                          <br />
                          Include your business name, website, and registered
                          email address.
                        </p>
                        <p>
                          <strong>For billing and payment questions:</strong>
                          <br />
                          Include your subscription tier and payment reference
                          number.
                        </p>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="founding">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      15. Founding Roaster Program (Limited Time)
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />

                    <Stack gap="6">
                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          15.1 Program Details
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Limited to first 10 roasters who subscribe to Verified tier",
                            "Founding rate: ₹3,500/year (regular ₹6,000/year)",
                            "Price locked permanently as long as subscription remains active",
                            'Special "Founding Roaster" badge on profile',
                            "Featured in launch announcements and marketing materials",
                            "Priority consideration for beta features and feedback",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          15.2 Eligibility Requirements
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Must subscribe to Verified tier before program closes",
                            "Must maintain active, continuous subscription (grace period: 60 days)",
                            "Forfeited if subscription cancelled and not renewed within 60 days",
                            "Forfeited if account terminated for cause",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-heading text-foreground mb-3">
                          15.3 Program Closure
                        </h3>
                        <div className="grid gap-3">
                          {[
                            "Program closes when 10 roasters subscribe OR on March 1, 2026, whichever comes first",
                            "No exceptions after program closure",
                            "New subscribers pay regular ₹6,000/year rate",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5"
                            >
                              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                {/* Acceptance Section */}
                <section className="pt-12 border-t border-border/30">
                  <Stack gap="6">
                    <h2 className="text-title text-primary italic">
                      Acceptance
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        By clicking &quot;I Agree&quot;, subscribing to a paid
                        tier, or submitting payment, you acknowledge that you
                        have read, understood, and agree to be bound by this
                        Roaster Partnership Agreement.
                      </p>
                      <p>
                        You confirm that you have the authority to enter into
                        this agreement on behalf of your business entity.
                      </p>
                      <p>
                        <strong>For founding roasters:</strong> By subscribing
                        at the founding roaster rate, you acknowledge the
                        special terms and conditions of the Founding Roaster
                        Program outlined in Section 15.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                {/* Concluding Quote */}
                <section className="pt-12 border-t border-border/30">
                  <Stack gap="4" className="items-center text-center">
                    <p className="text-title font-serif italic text-accent/60 max-w-2xl">
                      &quot;Building transparency and trust in the Indian
                      specialty coffee ecosystem.&quot;
                    </p>
                    <div className="h-px w-12 bg-accent/60" />
                    <p className="text-micro text-muted-foreground">
                      Version History: v1.0 (January 2, 2026) - Initial roaster
                      partnership agreement
                    </p>
                  </Stack>
                </section>
              </Stack>
            </div>
          </div>
        </Section>

        {/* Simple Footer CTA */}
        <Section contained={true} className="pb-24">
          <Cluster
            align="center"
            gap="8"
            className="rounded-4xl bg-accent/5 border border-accent/10 p-12"
          >
            <Stack gap="2">
              <h3 className="text-heading font-serif italic">
                Questions about our partnership terms?
              </h3>
              <p className="text-body-large text-muted-foreground">
                We&apos;re here to help clarify any questions.
              </p>
            </Stack>
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full px-8"
            >
              <a href="mailto:support@indiancoffeebeans.com">Contact Support</a>
            </Button>
          </Cluster>
        </Section>
      </Stack>
    </>
  );
}
