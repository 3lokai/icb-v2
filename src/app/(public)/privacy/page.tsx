// app/(public)/privacy/page.tsx
import type { Metadata } from "next";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { privacyPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy - IndianCoffeeBeans.com",
  description:
    "How IndianCoffeeBeans.com collects, uses, and protects your personal information.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy",
    "personal information",
    "terms of service",
  ],
  canonical: "/privacy",
  type: "website",
});

export default function PrivacyPage() {
  return (
    <>
      <StructuredData schema={privacyPageSchema} />
      <Stack gap="16">
        {/* Hero Header - Editorial Style */}
        <header className="relative pt-12 text-center text-primary">
          <Section spacing="tight">
            <Stack gap="6" className="items-center">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.2em]">
                  Transparency
                </span>
                <span className="h-px w-12 bg-accent/60" />
              </div>
              <h1 className="animate-fade-in-scale text-display text-primary text-balance leading-[1.05]">
                Privacy <span className="text-accent italic">Policy</span>
              </h1>
              <p className="mx-auto max-w-3xl text-body-large text-muted-foreground leading-relaxed md:text-heading">
                How we respect and protect your data while you explore the
                Indian coffee landscape.
              </p>
              <div className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
                Last Updated: May 22, 2025
              </div>
            </Stack>
          </Section>
        </header>

        {/* Content Section - Magazine Style */}
        <Section contained={true} spacing="default">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <aside className="md:col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <div className="rounded-2xl border border-border/30 bg-muted/5 p-8">
                <Stack gap="6">
                  <h3 className="text-heading text-primary font-serif italic">
                    Quick Navigation
                  </h3>
                  <div className="h-px w-12 bg-accent/60" />
                  <nav className="flex flex-col gap-3">
                    {[
                      { id: "personal-info", label: "1. Identification Info" },
                      {
                        id: "what-we-dont-collect",
                        label: "2. Info Not Collected",
                      },
                      { id: "cookies", label: "3. Browser Cookies" },
                      { id: "usage", label: "4. How We Use Data" },
                      { id: "protection", label: "5. Data Protection" },
                      { id: "sharing", label: "6. Sharing Info" },
                      {
                        id: "third-party-sites",
                        label: "7. Third Party Sites",
                      },
                      { id: "affiliates", label: "8. Affiliate & Ads" },
                      { id: "reviews", label: "9. User Reviews" },
                      { id: "changes", label: "10. Policy Changes" },
                      { id: "acceptance", label: "11. Acceptance" },
                      { id: "contact", label: "12. Contact Info" },
                      { id: "deletion", label: "13. Deletion & Retention" },
                      { id: "social", label: "14. Social Auth" },
                      { id: "business", label: "15. Business Relations" },
                      { id: "analytics", label: "16. Market Research" },
                    ].map((item) => (
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
                    This privacy policy governs how IndianCoffeeBeans
                    (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
                    collects, uses, maintains and discloses information
                    collected from users (&quot;User&quot;, &quot;you&quot;) of
                    the indiancoffeebeans.com website (&quot;Site&quot;). This
                    privacy policy applies to the Site and all services offered
                    by IndianCoffeeBeans.
                  </p>
                </section>

                <section id="personal-info">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      1. Personal Identification Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        We may collect personal identification information from
                        Users in a variety of ways, including when users
                        register on the site, subscribe to our newsletter,
                        submit reviews or ratings, and in connection with other
                        activities, services, or features we make available on
                        our Site. Users may visit our Site anonymously.
                      </p>
                      <p>
                        We will collect personal identification information from
                        Users only if they voluntarily submit such information
                        to us. Users can always refuse to supply personal
                        identification information, except that it may prevent
                        them from engaging in certain site-related activities
                        such as leaving reviews or subscribing to our
                        newsletter.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="what-we-dont-collect">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      2. Information We Do Not Collect
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <div className="rounded-xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-6">
                      <p className="text-accent-foreground">
                        We do not collect or store payment information. When you
                        purchase products through our affiliate links, you will
                        be redirected to third-party websites where any payment
                        transactions occur directly with those third parties.
                      </p>
                    </div>
                    <p>
                      These third-party sites have their own privacy policies
                      and terms of service. We strongly recommend reading their
                      privacy policies before making any purchases or providing
                      personal information to these third parties. We are not
                      responsible for the privacy practices or content of these
                      external sites.
                    </p>
                  </Stack>
                </section>

                <section id="cookies">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      3. Web Browser Cookies
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        Our Site uses &quot;cookies&quot; to enhance User
                        experience. Your web browser places cookies on your
                        device for record-keeping purposes and to track
                        information about your preferences. You can adjust your
                        browser settings to alert you when our Site is trying to
                        send you cookies or to block all cookies.
                      </p>
                      <p>
                        IndianCoffeeBeans provides comprehensive cookie
                        management tools that allow you to control your cookie
                        preferences. Through our cookie management interface,
                        you can view, enable, or disable different categories of
                        cookies at any time. Essential cookies required for
                        basic site functionality cannot be disabled, but all
                        preference, analytics, and marketing cookies can be
                        managed according to your preferences.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="usage">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      4. How We Use Collected Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may collect and use Users&apos;
                        personal information for the following purposes:
                      </p>
                      <div className="grid gap-4">
                        {[
                          "To improve customer service and respond to your inquiries and support needs",
                          "To personalize user experience and understand how our Users use the services and resources on our Site",
                          "To improve our Site based on feedback and usage patterns",
                          "To send Users information about coffee-related topics, new roasters, or featured products that may interest them (with consent)",
                          "To process newsletter subscriptions and send regular updates about Indian coffee",
                          "To display user reviews and ratings to help other coffee enthusiasts",
                        ].map((purpose, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            <p className="text-body">{purpose}</p>
                          </div>
                        ))}
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="protection">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      5. How We Protect Your Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      The security of your personal information is important to
                      us. We adopt appropriate data collection, storage and
                      processing practices and security measures to protect
                      against unauthorized access, alteration, disclosure or
                      destruction of your personal information. Since we do not
                      process payments directly, we do not store sensitive
                      financial information.
                    </p>
                  </Stack>
                </section>

                <section id="sharing">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      6. Sharing of Personal Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        We do not sell, trade, or rent Users&apos; personal
                        identification information to others. We may share
                        generic aggregated demographic information not linked to
                        any personal identification information regarding
                        visitors and users with our partners and advertisers for
                        the purposes outlined above.
                      </p>
                      <p>
                        When you click on affiliate links to purchase products,
                        you may be sharing information directly with those
                        third-party retailers. This sharing is governed by their
                        respective privacy policies, not ours.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="third-party-sites">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      7. Third Party Websites
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      Users may find links on our Site that lead to the sites
                      and services of our partners, coffee roasters, Amazon, and
                      other retailers. We do not control the content or links
                      that appear on these sites and are not responsible for the
                      practices employed by websites linked to or from our Site.
                      Browsing and interaction on any other website is subject
                      to that website&apos;s own terms and policies.
                    </p>
                  </Stack>
                </section>

                <section id="affiliates">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      8. Affiliate Marketing and Advertising
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        IndianCoffeeBeans participates in affiliate marketing
                        programs. When you purchase products through our
                        affiliate links, we may receive a small commission at no
                        additional cost to you. These commissions help us
                        maintain and improve our service.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        {[
                          {
                            title: "Disclosure",
                            text: "All affiliate links are clearly disclosed with language such as 'affiliate link' or similar indicators.",
                          },
                          {
                            title: "Integrity",
                            text: "Our product reviews and recommendations are based on genuine evaluation, not solely on commission potential.",
                          },
                          {
                            title: "Independence",
                            text: "We maintain editorial independence even with affiliate partners.",
                          },
                          {
                            title: "Analytics",
                            text: "We may collect analytics data about how users interact with affiliate links to improve our service.",
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="p-5 rounded-xl border border-border/20 bg-card/5 hover:bg-card/10 transition-colors"
                          >
                            <h3 className="font-serif italic text-primary mb-1">
                              {item.title}
                            </h3>
                            <p className="text-caption">{item.text}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        We also display advertisements from third parties that
                        may use cookies to track your browsing behavior for ad
                        targeting. You can manage these cookies through our
                        cookie management interface. We do not sell your
                        personal data to advertisers but may provide aggregated,
                        anonymized data about our users.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="reviews">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      9. User Reviews and Content
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        When you submit reviews, ratings, or other content to
                        our Site, you grant us the right to display this content
                        publicly to help other users make informed decisions
                        about coffee purchases. We reserve the right to moderate
                        content and remove reviews that violate our community
                        guidelines.
                      </p>
                      <div className="grid gap-4">
                        {[
                          "All reviews, ratings, and comments become the property of IndianCoffeeBeans once submitted and will remain on the platform even if you later delete your account",
                          "While you may delete your personal profile and personally identifiable information, any content you have contributed will remain on the site with your username anonymized",
                          "We retain perpetual rights to use, modify, display, and distribute your contributed content as part of our service",
                          "Content you provide must be honest, accurate, and based on your genuine experience",
                        ].map((point, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            <p className="text-body">{point}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-4 p-6 rounded-2xl border border-accent/20 border-l-4 border-l-accent bg-accent/5">
                        <Icon
                          name="Info"
                          className="text-accent flex-shrink-0"
                          size={24}
                        />
                        <p className="text-caption italic font-medium">
                          This approach allows us to maintain the integrity and
                          value of our coffee directory even as users come and
                          go, while still respecting your right to remove your
                          personal information.
                        </p>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="changes">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      10. Changes to This Policy
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      IndianCoffeeBeans has the discretion to update this
                      privacy policy at any time. When we do, we will revise the
                      updated date at the top of this page. We encourage Users
                      to frequently check this page for any changes to stay
                      informed about how we are helping to protect the personal
                      information we collect.
                    </p>
                  </Stack>
                </section>

                <section id="acceptance">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      11. Acceptance of Terms
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      By using this Site, you signify your acceptance of this
                      policy. If you do not agree to this policy, please do not
                      use our Site. Your continued use of the Site following the
                      posting of changes to this policy will be deemed your
                      acceptance of those changes.
                    </p>
                  </Stack>
                </section>

                <section id="contact">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      12. Contact Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      If you have any questions about this Privacy Policy, the
                      practices of this site, or your dealings with this site,
                      please contact us at:
                    </p>
                    <div className="p-8 rounded-2xl border border-border/40 bg-card/5">
                      <Stack gap="4" className="items-center text-center">
                        <Icon name="MapPin" size={32} className="text-accent" />
                        <h3 className="text-heading text-primary font-serif italic">
                          IndianCoffeeBeans
                        </h3>
                        <p className="text-caption">Hyderabad, India</p>
                        <Button
                          asChild
                          variant="link"
                          className="text-accent text-body-large"
                        >
                          <a href="mailto:gta3lok.ai@gmail.com">
                            gta3lok.ai@gmail.com
                          </a>
                        </Button>
                      </Stack>
                    </div>
                  </Stack>
                </section>

                <section id="deletion">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      13. Data Deletion and Retention
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        You have the right to request the deletion of your
                        personal information from our systems. If you wish to
                        delete your account and personal information, you can do
                        so through your account settings or by contacting us
                        directly at{" "}
                        <a
                          href="mailto:gta3lok.ai@gmail.com"
                          className="underline"
                        >
                          gta3lok.ai@gmail.com
                        </a>
                        .
                      </p>
                      <p>
                        When you request account deletion, we will remove your
                        personally identifiable information from our active
                        databases. However, please note that:
                      </p>
                      <div className="grid gap-4">
                        {[
                          "Reviews, ratings, and other content contributions will remain on the platform, attributed to an anonymized username",
                          "We may retain certain information in our backup systems or for legal and compliance purposes",
                          "Information that has been shared with third parties or made public through your use of our services cannot be deleted by us",
                          "We may retain aggregated, anonymized data derived from your information even after your account is deleted",
                        ].map((note, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            <p className="text-body">{note}</p>
                          </div>
                        ))}
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="social">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      14. Social Authentication
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        When you sign in using Facebook Login, we collect
                        limited information from your Facebook profile,
                        including:
                      </p>
                      <div className="grid gap-4">
                        {[
                          "Your name and email address",
                          "Profile picture (if you choose to use it)",
                          "Basic demographic information (if publicly available)",
                        ].map((info, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            <p className="text-body">{info}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        We do not access your Facebook friends list, posts, or
                        other private Facebook data. The information we collect
                        is used solely to create and maintain your
                        IndianCoffeeBeans account.
                      </p>
                      <p>
                        If you signed up using Facebook and wish to delete your
                        account and all associated data, you can:
                      </p>
                      <div className="grid gap-4">
                        {[
                          "Visit our data deletion page at [yourdomain.com/data-deletion]",
                          "Email us directly at gta3lok.ai@gmail.com",
                          "Use Facebook's app removal process and then contact us to delete local data",
                        ].map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            <p className="text-body">{step}</p>
                          </div>
                        ))}
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="business">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      15. Business Relationships
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may enter into direct business
                        relationships with roasters, retailers, and product
                        providers for various commercial purposes, including:
                      </p>
                      <ul className="mb-4 list-disc space-y-2 pl-6">
                        <li className="text-body text-muted-foreground">
                          Featured listings and premium placement on our
                          directory
                        </li>
                        <li className="text-body text-muted-foreground">
                          Co-branded content and promotional campaigns
                        </li>
                        <li className="text-body text-muted-foreground">
                          Sponsored newsletters or educational content
                        </li>
                        <li className="text-body text-muted-foreground">
                          Coffee tasting events and workshops
                        </li>
                        <li className="text-body text-muted-foreground">
                          Joint marketing initiatives
                        </li>
                      </ul>
                      <p>
                        In the context of these business relationships, we may
                        share certain aggregated data and analytics with our
                        partners, such as:
                      </p>
                      <ul className="mb-4 list-disc space-y-2 pl-6">
                        <li className="text-body text-muted-foreground">
                          Engagement metrics for featured listings (views,
                          clicks, etc.)
                        </li>
                        <li className="text-body text-muted-foreground">
                          Anonymized user behavior and interest patterns
                        </li>
                        <li className="text-body text-muted-foreground">
                          Performance data for sponsored content
                        </li>
                      </ul>
                      <p>
                        We will never share personally identifiable information
                        of our users with these business partners unless you
                        have explicitly opted in to such sharing. All commercial
                        relationships are disclosed according to our
                        transparency policies.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="analytics">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      16. Market Research & Analytics
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may analyze user behavior,
                        preferences, and trends to create aggregated market
                        research and industry insights. These analytics may be
                        used to:
                      </p>
                      <div className="grid gap-4">
                        {[
                          "Produce industry reports on coffee consumption trends and preferences",
                          "Create benchmarking data for the specialty coffee market in India",
                          "Generate statistics on regional popularity of certain roast types, origins, or brewing methods",
                          "Analyze seasonal patterns in coffee purchasing behavior",
                        ].map((point, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-xl border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            <p className="text-body">{point}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        We may offer anonymized, aggregated research findings to
                        industry partners, coffee businesses, or market
                        researchers on a paid or unpaid basis. This research
                        will never contain personally identifiable information
                        about individual users.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section
                  id="closing"
                  className="pt-8 border-t border-border/30"
                >
                  <p className="font-serif italic text-accent-foreground text-heading text-pretty">
                    &quot;Our commitment to your privacy is as strong as our
                    passion for great coffee. Together, we&apos;re building a
                    transparent home for Indian coffee lovers.&quot;
                  </p>
                </section>
              </Stack>
            </div>
          </div>
        </Section>

        {/* Support Section - Minimal Editorial Style */}
        <Section spacing="loose">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-muted/5 p-12 text-center">
            <Stack gap="8" className="relative z-10 items-center">
              <Stack gap="4" className="items-center">
                <span className="text-micro font-bold uppercase tracking-[0.3em] text-accent">
                  Questions
                </span>
                <h2 className="text-title text-primary text-balance md:text-display">
                  Need <span className="italic">Clarification?</span>
                </h2>
                <div className="h-px w-24 bg-accent/40" />
              </Stack>
              <p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
                If you have any questions about this Privacy Policy or your
                dealings with this site, we&apos;re here to help.
              </p>
              <Button asChild variant="default" size="lg" className="px-12">
                <a href="mailto:gta3lok.ai@gmail.com">Contact Support</a>
              </Button>
            </Stack>
          </div>
        </Section>
      </Stack>
    </>
  );
}
