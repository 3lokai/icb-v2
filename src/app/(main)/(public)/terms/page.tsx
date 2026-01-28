// app/(public)/terms/page.tsx
import type { Metadata } from "next";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { termsPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "Terms of Service - IndianCoffeeBeans.com",
  description:
    "Terms and conditions for using IndianCoffeeBeans.com directory and services.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "legal",
    "user agreement",
  ],
  canonical: "/terms",
  type: "website",
});

export default function TermsPage() {
  const sections = [
    { id: "acceptance", label: "1. Acceptance" },
    { id: "description", label: "2. Service Description" },
    { id: "accounts", label: "3. User Accounts" },
    { id: "privacy", label: "4. Privacy Policy" },
    { id: "platform", label: "5. Directory Platform" },
    { id: "affiliates", label: "6. Affiliate Relations" },
    { id: "availability", label: "7. Access & Availability" },
    { id: "license", label: "8. License & Use" },
    { id: "conduct", label: "9. User Conduct" },
    { id: "reviews", label: "10. User Content" },
    { id: "third-party", label: "11. Third Party Sites" },
    { id: "ip", label: "12. Intellectual Property" },
    { id: "disclaimer", label: "13. Disclaimer" },
    { id: "liability", label: "14. Liability" },
    { id: "age", label: "15. Age Restrictions" },
    { id: "communications", label: "16. Communications" },
    { id: "modifications", label: "17. Changes to Terms" },
    { id: "disputes", label: "18. Dispute Resolution" },
    { id: "contact", label: "19. Contact Info" },
    { id: "severability", label: "20. Severability" },
    { id: "scraping", label: "21. Third Party Info" },
    { id: "images", label: "22. Image Rights" },
    { id: "moderation", label: "23. Content Moderation" },
    { id: "promotional", label: "24. Featured Listings" },
    { id: "guests", label: "25. Guest Contributors" },
    { id: "partnerships", label: "26. Partnerships" },
    { id: "premium", label: "27. Premium Services" },
    { id: "educational", label: "28. Educational Content" },
    { id: "merchandise", label: "29. Merchandise" },
    { id: "referral", label: "30. Referral Programs" },
    { id: "api", label: "31. API Services" },
    { id: "restrictions", label: "32. Anti-Scraping" },
  ];

  return (
    <>
      <StructuredData schema={termsPageSchema} />
      <Stack gap="16">
        {/* Hero Header */}
        <header className="relative pt-12 text-center text-primary">
          <Section spacing="tight">
            <Stack gap="6" className="items-center">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.2em]">
                  Legal Framework
                </span>
                <span className="h-px w-12 bg-accent/60" />
              </div>
              <h1 className="animate-fade-in-scale text-display text-primary text-balance leading-[1.05]">
                Terms of <span className="text-accent italic">Service</span>
              </h1>
              <p className="mx-auto max-w-3xl text-body-large text-muted-foreground leading-relaxed md:text-heading">
                The guidelines and agreements that define how we build and share
                the Indian specialty coffee directory.
              </p>
              <div className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
                Last Updated: May 22, 2025
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
                    The website indiancoffeebeans.com (&quot;website&quot;) is
                    operated by IndianCoffeeBeans (&quot;we&quot;,
                    &quot;us&quot;, or &quot;our&quot;), based in Hyderabad,
                    India. Please read these Terms of Service carefully before
                    using our website. By using IndianCoffeeBeans.com, you
                    signify your agreement to be bound by these Terms of
                    Service.
                  </p>
                </section>

                <section id="acceptance">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      1. Acceptance of Terms
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        By accessing and using this website, you accept and
                        agree to be bound by the terms and provision of this
                        agreement. If you do not agree to abide by the above,
                        please do not use this service.
                      </p>
                      <p>
                        These Terms of Service constitute an electronic record
                        and do not require physical or digital signatures. These
                        terms apply to all users of the website, including
                        browsers, reviewers, and contributors.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="description">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      2. Service Description
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        IndianCoffeeBeans.com is a directory platform that
                        provides information about Indian coffee roasters,
                        coffee beans, brewing guides, and related educational
                        content. We are not a marketplace or e-commerce
                        platform. Instead, we provide information and direct
                        users to external websites where they can purchase
                        coffee products.
                      </p>
                      <p>
                        All product purchases occur on third-party websites. We
                        are not responsible for transactions, product quality,
                        shipping, or customer service related to purchases made
                        through external links.
                      </p>
                      <p>
                        Product information, descriptions, images, and other
                        content related to coffee products and roasters may be
                        sourced directly from roasters&apos; websites, product
                        packaging, or public information. This content belongs
                        to the respective roasters or brands and is displayed
                        for informational purposes only. We make no warranties
                        regarding the accuracy, completeness, or reliability of
                        such information. Users should verify all product
                        details, including pricing, availability, and
                        specifications, directly with the roaster or retailer
                        before making a purchase.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="accounts">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      3. User Accounts
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        If you create an account on our website, you are
                        responsible for maintaining the confidentiality of your
                        account credentials and for restricting access to your
                        device to prevent unauthorized access to your account.
                        You agree to accept responsibility for all activities
                        that occur under your account.
                      </p>
                      <p>
                        You may use your account to leave reviews, save
                        favorites, and access personalized content. We reserve
                        the right to refuse service, terminate accounts, or
                        remove content at any time without notice for violations
                        of these terms.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="privacy">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      4. Privacy Policy
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      Please review our Privacy Policy, which governs your visit
                      and use of the website. The personal information provided
                      to us during the course of usage will be treated as
                      confidential and in accordance with our Privacy Policy and
                      applicable laws.
                    </p>
                  </Stack>
                </section>

                <section id="platform">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      5. Directory Platform
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        You understand that our website is an informational
                        directory platform that enables you to discover coffee
                        roasters, learn about coffee products, and access
                        external websites where products can be purchased. We
                        are a facilitator of information and not a party to any
                        transactions between you and third-party sellers.
                      </p>
                      <p>
                        IndianCoffeeBeans.com is currently free to use. We may
                        introduce premium features in the future with prior
                        notice to users.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="affiliates">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      6. Affiliate Relationships
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        Our website contains affiliate links to third-party
                        websites and marketplaces. When you make a purchase
                        through these links, we may receive a commission at no
                        additional cost to you. These affiliate relationships
                        help us maintain and improve our service.
                      </p>
                      <p>
                        All affiliate relationships are disclosed where
                        applicable. Our reviews and recommendations are based on
                        genuine evaluation and are not influenced solely by
                        affiliate commissions.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="availability">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      7. Website Access and Availability
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      We strive to ensure that our website is available
                      uninterrupted and that transmissions are error-free.
                      However, due to the nature of the internet, this cannot be
                      guaranteed. Your access to the website may occasionally be
                      suspended or restricted for repairs, maintenance, or
                      introduction of new features.
                    </p>
                  </Stack>
                </section>

                <section id="license">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      8. License and Permitted Use
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        Subject to your compliance with these Terms of Service,
                        we grant you a limited, non-exclusive, non-transferable,
                        revocable license to access and make personal use of
                        this website, but not to download (other than page
                        caching) or modify it, or any portion of it, except with
                        our express written consent.
                      </p>
                      <div className="grid gap-3">
                        <p className="text-micro font-bold uppercase tracking-widest text-accent">
                          This license does not include:
                        </p>
                        {[
                          "Any resale or commercial use of this website or its contents",
                          "Any collection and use of product listings, descriptions, images, or prices",
                          "Any derivative use of this website or its contents",
                          "Any downloading, copying, or other use of account information",
                          "Any use of data mining, robots, scrapers, or similar data gathering and extraction tools",
                          "Any reproduction, duplication, copying, selling, reselling, or exploitation of any portion of the website",
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
                      <p>
                        Any unauthorized use automatically terminates the
                        permissions granted by these Terms of Service. You may
                        not frame or utilize framing techniques to enclose any
                        trademark, logo, or other proprietary information on the
                        website without our express written consent.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="conduct">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      9. User Conduct
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>You must not use the website in any way that:</p>
                      <div className="grid gap-3">
                        {[
                          "Causes, or is likely to cause, interruption, damage, or impairment to the website",
                          "Is used for fraudulent purposes or in connection with criminal activities",
                          "Sends or reuses material that is illegal, offensive, misleading, abusive, defamatory, or harmful",
                          "Violates intellectual property rights or privacy of others",
                          "Contains viruses or other malicious code",
                          "Involves spam, chain letters, or mass unsolicited communications",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="reviews">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      10. Reviews and User Content
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        Users may post reviews, comments, and other content,
                        provided the content is not illegal, obscene, abusive,
                        threatening, defamatory, or otherwise objectionable. We
                        reserve the right to remove, refuse, or edit any content
                        that violates these Terms of Service.
                      </p>
                      <p>
                        By posting content, you grant us a non-exclusive,
                        royalty-free, perpetual license to use, reproduce,
                        modify, and display such content throughout the world in
                        any media. You represent that you own the rights to any
                        content you post and that such content is accurate and
                        lawful.
                      </p>
                      <p>
                        You agree to indemnify and hold IndianCoffeeBeans
                        harmless from any claims, damages, or liabilities
                        arising from your user-generated content. We are not
                        responsible for the accuracy, quality, safety, legality,
                        or reliability of any user-generated content. All
                        opinions expressed in reviews, ratings, comments, and
                        other user content are those of the individuals who
                        posted them and do not represent our views or opinions.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="third-party">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      11. Third-Party Websites
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        Our website contains links to third-party websites
                        operated by coffee roasters, retailers, and other
                        businesses. We are not responsible for examining or
                        evaluating the offerings, content, or practices of these
                        third-party websites.
                      </p>
                      <p>
                        When you access these external websites, you are subject
                        to their terms of service and privacy policies. We
                        recommend reading these policies before making purchases
                        or providing personal information.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="ip">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      12. Intellectual Property
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        All content on this website, including but not limited
                        to text, graphics, logos, images, coffee directory data,
                        roaster information, product descriptions, user
                        interface elements, databases, and software, is our
                        property or that of our content suppliers and is
                        protected by Indian and international intellectual
                        property laws.
                      </p>
                      <div className="grid gap-3">
                        <p className="text-micro font-bold uppercase tracking-widest text-accent">
                          Our intellectual property rights extend to:
                        </p>
                        {[
                          "The compilation, organization, and arrangement of all content on the website",
                          "The selection, coordination, and presentation of all materials",
                          "The comprehensive database of coffee roasters, products, and regional information",
                          "Original editorial content, reviews, and educational materials",
                          "The overall look and feel, design elements, and user experience",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          The IndianCoffeeBeans name and logo are our
                          trademarks. You may not use our trademarks in
                          connection with any product or service without our
                          express written consent. Unauthorized use of our
                          intellectual property constitutes infringement and may
                          result in legal action.
                        </p>
                        <p>
                          While individual facts about coffee products may not
                          be protected by copyright, the particular selection,
                          coordination, arrangement, and enhancement of those
                          facts within our database is protected intellectual
                          property.
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </section>

                <section id="disclaimer">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      13. Disclaimer
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        You acknowledge that you are using our website at your
                        own risk. We provide information about coffee roasters
                        and products for informational purposes only. We do not
                        endorse or guarantee the quality, safety, or legality of
                        products offered by third-party sellers.
                      </p>
                      <p>
                        This website and all content are provided &quot;as
                        is&quot; without warranty of any kind. We disclaim all
                        warranties, express or implied, including warranties of
                        merchantability, fitness for a particular purpose, and
                        non-infringement.
                      </p>
                      <p>
                        IndianCoffeeBeans serves as an aggregator and directory
                        of coffee-related information. We do not independently
                        verify or validate product descriptions, specifications,
                        images, or other content sourced from roasters&apos;
                        websites or provided by users. Information may be
                        obtained through automated means, direct submissions, or
                        manual collection. All such third-party content is the
                        responsibility of its original creator or publisher. By
                        using our service, you acknowledge and accept that we do
                        not guarantee the accuracy of any information displayed
                        and cannot be held liable for any errors, omissions, or
                        outdated information.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="liability">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      14. Limitation of Liability
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        To the maximum extent permitted by applicable law,
                        IndianCoffeeBeans, its directors, employees, partners,
                        agents, suppliers, or affiliates shall not be liable for
                        any direct, indirect, incidental, special,
                        consequential, or exemplary damages resulting from:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Your access to or use of (or inability to access or use) the website or any content",
                          "Any conduct or content of any third party on the website, including without limitation, any defamatory, offensive, or illegal conduct",
                          "Any products, services, or content obtained from third-party websites linked from our platform",
                          "Unauthorized access, use, or alteration of your transmissions or content",
                          "Errors, inaccuracies, or omissions in the content or functionality of the website",
                          "Transactions between you and third-party sellers, including product quality, delivery, prices, and consumer satisfaction",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          This limitation applies whether the alleged liability
                          is based on contract, tort, negligence, strict
                          liability, or any other basis, even if we have been
                          advised of the possibility of such damage.
                        </p>
                        <p className="font-bold text-foreground">
                          In no event shall our total liability to you for all
                          damages, losses, or causes of action exceed ₹6,000
                          (five thousand Indian Rupees). This cap applies
                          regardless of whether you have paid for any services,
                          as IndianCoffeeBeans is primarily offered as a free
                          information directory.
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </section>

                <section id="age">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      15. Age Restrictions
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      Use of our website is available only to persons who can
                      form legally binding contracts under Indian law. If you
                      are under the age of 18, you may use our website only with
                      the involvement of a parent or guardian.
                    </p>
                  </Stack>
                </section>

                <section id="communications">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      16. Communications
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      When you visit our website, you are communicating with us
                      electronically. You consent to receive communications from
                      us electronically, including email newsletters,
                      notifications, and updates about our service.
                    </p>
                  </Stack>
                </section>

                <section id="modifications">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      17. Modifications to Terms
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      We reserve the right to modify these Terms of Service at
                      any time. Changes will be effective when posted on this
                      page with a new &quot;Last Updated&quot; date. Your
                      continued use of the website after changes are posted
                      constitutes acceptance of the modified terms.
                    </p>
                  </Stack>
                </section>

                <section id="disputes">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      18. Dispute Resolution and Governing Law
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        These Terms of Service are governed by and construed in
                        accordance with the laws of India, without giving effect
                        to any principles of conflicts of law. Any disputes
                        arising from these terms or your use of our website
                        shall be subject to the exclusive jurisdiction of the
                        courts in Hyderabad, Telangana, India.
                      </p>
                      <p>
                        Before filing any formal legal action, you agree to
                        first attempt to resolve the dispute informally by
                        contacting us at{" "}
                        <a
                          className="text-accent underline font-bold"
                          href="mailto:support@indiancoffeebeans.com"
                        >
                          support@indiancoffeebeans.com
                        </a>
                        . Most concerns can be resolved quickly and efficiently
                        through this process.
                      </p>
                      <p>
                        You agree that any claim arising out of or related to
                        these Terms or our Services must be filed within one (1)
                        year after such claim arose, otherwise, your claim is
                        permanently barred. You also explicitly waive any right
                        to class action proceedings.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="contact">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      19. Contact Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        If you have any questions about these Terms of Service
                        or our website, please contact us at:
                      </p>
                      <div className="rounded-2xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-8 transition-all hover:bg-accent/10">
                        <Stack gap="1">
                          <p className="font-bold text-foreground text-heading">
                            IndianCoffeeBeans
                          </p>
                          <p>Hyderabad, India</p>
                          <p>
                            Email:{" "}
                            <a
                              className="text-accent font-bold underline"
                              href="mailto:support@indiancoffeebeans.com"
                            >
                              support@indiancoffeebeans.com
                            </a>
                          </p>
                        </Stack>
                      </div>
                    </Stack>
                  </Stack>
                </section>

                <section id="severability">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      20. Severability
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <p>
                      If any provision of these Terms of Service is found to be
                      invalid or unenforceable, the remaining provisions will
                      continue to be valid and enforceable to the fullest extent
                      permitted by law.
                    </p>
                  </Stack>
                </section>

                <section id="scraping">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      21. Content Scraping and Third-Party Information
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="4">
                      <p>
                        We may collect and display information, images, and
                        content from third-party sources, including but not
                        limited to roaster websites, social media accounts, and
                        other publicly available sources. This content is
                        displayed for informational purposes only and remains
                        the intellectual property of its original creators.
                      </p>
                      <p>
                        While we strive to ensure all content is accurate and
                        up-to-date, we cannot guarantee the accuracy,
                        completeness, or reliability of information obtained
                        from third-party sources. Product availability, pricing,
                        specifications, and other details may change without
                        notice. Users should always verify information directly
                        with roasters or retailers before making purchase
                        decisions.
                      </p>
                      <p>
                        If you are a coffee roaster or rights holder and believe
                        that content displayed on our platform infringes on your
                        rights, please contact us at{" "}
                        <a
                          className="text-accent underline font-bold"
                          href="mailto:support@indiancoffeebeans.com"
                        >
                          support@indiancoffeebeans.com
                        </a>{" "}
                        with details, and we will address your concerns
                        promptly.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="images">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      22. Image Rights and User-Submitted Photos
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        Users may submit photos as part of reviews, comments, or
                        other contributions to IndianCoffeeBeans. By submitting
                        photos or images, you:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Confirm you own the rights to these images or have permission to share them publicly",
                          "Grant IndianCoffeeBeans a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and display such images",
                          "Understand that images will remain on our platform even if you delete your account",
                          "Agree not to upload images containing identifiable people without their consent",
                          "Agree not to upload images containing trademarks, logos, or copyrighted content you don't have rights to",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        We respect intellectual property rights and will respond
                        to legitimate requests to remove images that infringe on
                        copyrights or other legal protections. Please contact us
                        at{" "}
                        <a
                          className="text-accent underline font-bold"
                          href="mailto:support@indiancoffeebeans.com"
                        >
                          support@indiancoffeebeans.com
                        </a>{" "}
                        with any concerns.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="moderation">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      23. Content Moderation and Editorial Policies
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans reserves the right to moderate all
                        content on our platform, including but not limited to
                        user reviews, comments, ratings, and images. Our content
                        moderation may be performed automatically through
                        filters or manually by our team. We may, at our sole
                        discretion:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Remove content that violates our guidelines, contains spam, or is otherwise inappropriate",
                          "Edit user reviews for clarity, grammar, or format without changing the substantive meaning",
                          "Prioritize or feature certain reviews based on relevance, helpfulness, or recency",
                          "Flag suspicious content patterns or potential conflicts of interest",
                          "Implement verification processes for reviewers to enhance trust",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group transition-all hover:border-accent/30"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          Our editorial team may create original content about
                          coffee roasters, products, or brewing techniques. This
                          content represents our independent views and analysis,
                          though it may contain affiliate links as disclosed in
                          our Affiliate Marketing policy.
                        </p>
                        <p>
                          We strive for accuracy in all content but cannot
                          guarantee that all information is completely current
                          or correct. We make no representations about the
                          suitability of the information for any purpose.
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </section>

                <section id="promotional">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      24. Featured Listings and Promotional Content
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans offers premium placement and featured
                        listing opportunities for coffee roasters and product
                        providers. Such featured content will be clearly labeled
                        as &quot;Featured,&quot; &quot;Sponsored,&quot; or
                        similar designation to distinguish it from regular
                        listings.
                      </p>
                      <div className="grid gap-3">
                        <p className="text-micro font-bold uppercase tracking-widest text-accent">
                          We maintain full editorial discretion over all content
                          on our platform, including:
                        </p>
                        {[
                          "The right to decline paid placement requests at our sole discretion",
                          "The right to remove featured listings that no longer meet our quality standards",
                          "The ability to adjust placement and visibility based on user engagement and relevance",
                          "Final approval on all promotional language and imagery associated with featured listings",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        Payment for featured placement does not guarantee
                        positive reviews or ratings, nor does it influence our
                        editorial content. We maintain a strict separation
                        between paid promotions and our objective evaluation of
                        coffee products and roasters.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="guests">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      25. Guest Contributors and Third-Party Content
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may publish articles, blog posts,
                        reviews, or other content created by guest contributors,
                        industry experts, or third-party authors. This content
                        is subject to the following terms:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Opinions, views, and statements expressed by guest contributors are their own and do not necessarily reflect the position of IndianCoffeeBeans",
                          "Guest content will be clearly labeled with the contributor's name or an appropriate byline",
                          "We reserve the right to edit guest contributions for clarity, grammar, length, and adherence to our content guidelines",
                          "By submitting content for publication, contributors grant us a perpetual, worldwide, non-exclusive license to publish, distribute, and display their content",
                          "Guest contributors are responsible for ensuring their submissions do not infringe on third-party rights",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        IndianCoffeeBeans reviews guest content for quality and
                        relevance but cannot verify all facts or claims made by
                        third-party contributors. Users should exercise their
                        own judgment when evaluating opinions expressed in guest
                        content.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="partnerships">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      26. Partnerships and Events
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may partner with coffee roasters,
                        retailers, or other industry participants for events,
                        newsletters, promotions, or content collaborations.
                        These partnerships are governed by the following
                        principles:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "All partnerships and commercial relationships will be transparently disclosed to users",
                          "Partner content will be clearly labeled as such to distinguish it from independent editorial content",
                          "Partnership opportunities do not guarantee positive reviews or preferential treatment in our directory listings",
                          "We maintain editorial independence and the right to provide honest assessments of partner products or services",
                          "Users may receive promotional communications about partner events or offerings, subject to our Privacy Policy and their communication preferences",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        When we organize or promote events, whether
                        independently or with partners, participation in such
                        events is subject to separate terms and conditions that
                        will be provided at the time of registration or ticket
                        purchase.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="premium">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      27. Premium Membership and Subscription Services
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        While IndianCoffeeBeans currently operates as a free
                        service, we may introduce premium membership tiers or
                        subscription-based features in the future. If and when
                        such services are introduced:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "All subscription terms, including pricing, billing cycles, and cancellation policies, will be clearly disclosed before purchase",
                          "Users will have the option to cancel recurring subscriptions through their account settings",
                          "Premium features will be clearly distinguished from free content",
                          "We reserve the right to modify the features included in each subscription tier with reasonable notice",
                          "Educational content, early access, exclusive offers, and enhanced personalization may be included in premium memberships",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        All subscription payments will be processed through
                        secure third-party payment processors. We do not store
                        payment card information on our servers. Subscription
                        services will be subject to additional terms provided at
                        the time of enrollment.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="educational">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      28. Educational Content and Courses
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may develop and offer educational
                        content, including but not limited to online courses,
                        workshops, webinars, and certification programs related
                        to coffee appreciation, brewing techniques, and industry
                        knowledge. These educational offerings are subject to
                        the following terms:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Course materials, videos, PDFs, and other educational content are protected by copyright and may not be reproduced or distributed without permission",
                          "Certificates or credentials earned through our programs do not constitute professional licensure or accreditation",
                          "Course fees, if any, will be clearly disclosed before enrollment and are typically non-refundable once access to materials has been granted",
                          "We may partner with industry professionals, roasters, or educational institutions to develop course content",
                          "Completion of courses or workshops does not guarantee specific outcomes or results",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <p>
                        While we strive to provide accurate and up-to-date
                        educational content, we do not warrant that course
                        materials will be error-free or that techniques taught
                        will be suitable for all circumstances. Users
                        participate in educational activities at their own risk.
                      </p>
                    </Stack>
                  </Stack>
                </section>

                <section id="merchandise">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      29. Merchandise and Product Sales
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may offer merchandise or physical
                        products, including but not limited to branded items,
                        specialty coffee selections, brewing equipment, or
                        curated sample boxes. These product offerings are
                        subject to the following terms:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Product descriptions, including prices, specifications, and availability, are subject to change without notice",
                          "We do not guarantee that product colors and specifications will appear exactly as displayed due to variations in device screens",
                          "Shipping policies, delivery timeframes, and return procedures will be provided at the time of purchase",
                          "For perishable items like coffee beans, we cannot accept returns unless the product is defective",
                          "Promotional offers and discounts may be subject to additional terms and conditions",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          When we partner with roasters or other vendors to
                          create co-branded or curated products, we select
                          partners based on quality and alignment with our
                          values. However, we do not manufacture coffee products
                          ourselves and rely on our partners&apos; production
                          standards and quality control.
                        </p>
                        <p>
                          All sales are subject to applicable Indian laws,
                          including consumer protection regulations. Nothing in
                          these terms restricts your statutory rights as a
                          consumer.
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </section>

                <section id="referral">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      30. Referral Programs and Commissions
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may offer referral programs,
                        ambassador initiatives, or commission structures that
                        reward users for inviting others to the platform or for
                        contributing high-quality content. These incentive
                        programs are subject to the following terms:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "Eligibility criteria for participation in referral programs will be clearly defined",
                          "Rewards, whether in the form of site credits, discounts, or monetary compensation, will be issued according to the program terms in effect at the time of the qualifying activity",
                          "We reserve the right to modify, suspend, or terminate any referral program at our discretion",
                          "Fraudulent referrals, artificial engagement, or other attempts to manipulate program metrics will result in disqualification and forfeiture of rewards",
                          "Participants are responsible for any tax implications arising from rewards or commissions earned",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          Participants in commission-based programs must
                          disclose their affiliation with IndianCoffeeBeans when
                          promoting our platform to others, in accordance with
                          applicable advertising regulations and guidelines.
                        </p>
                        <p>
                          By participating in referral programs, you agree not
                          to make false or misleading claims about our services
                          and to respect the communication preferences of those
                          you refer to our platform.
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </section>

                <section id="api">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      31. API and Developer Services
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans may develop and offer Application
                        Programming Interfaces (APIs) or other developer tools
                        that provide programmatic access to our coffee directory
                        data and functionality. Use of these developer services
                        is subject to the following terms:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "API access may be subject to rate limits, authentication requirements, and usage quotas",
                          "Developers must register for API keys and comply with our API documentation and guidelines",
                          "Commercial use of our API or data may require a paid subscription or licensing agreement",
                          "Applications using our API must properly attribute IndianCoffeeBeans as the data source",
                          "We reserve the right to modify or discontinue API endpoints or features with reasonable notice",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          Developers may not use our API to build applications
                          that compete directly with core IndianCoffeeBeans
                          services or that misrepresent our data. We maintain
                          the right to revoke API access for applications that
                          violate these terms or that provide a poor user
                          experience.
                        </p>
                        <p>
                          When using our API, developers are responsible for
                          ensuring their applications comply with data
                          protection regulations and for obtaining any necessary
                          consents from their end users.
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </section>

                <section id="restrictions">
                  <Stack gap="4">
                    <h2 className="text-title text-primary italic">
                      32. Site Access Restrictions and Anti-Scraping Policy
                    </h2>
                    <div className="h-px w-16 bg-accent/60" />
                    <Stack gap="6">
                      <p>
                        IndianCoffeeBeans invests significant resources in
                        collecting, organizing, and presenting coffee directory
                        information. To protect this investment and ensure the
                        integrity of our platform, the following restrictions
                        apply to all users:
                      </p>
                      <div className="grid gap-3">
                        {[
                          "You may not use automated tools, bots, crawlers, scrapers, or other data extraction methods to access, copy, or collect data from our website without our express written permission",
                          "You may not bypass or attempt to bypass any access control mechanisms or usage limitations we implement, including IP blocks, rate limiting, or CAPTCHA",
                          "You may not engage in activities that place excessive load on our servers or infrastructure",
                          "You may not create derivative databases, directories, or indices based on content scraped or collected from our platform",
                          "You may not use our content, data, or design elements to create a competing service",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group"
                          >
                            <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                            <p className="text-body">{item}</p>
                          </div>
                        ))}
                      </div>
                      <Stack gap="4">
                        <p>
                          Permissible use of our content is limited to normal
                          browsing, sharing individual listings via provided
                          social sharing features, and reasonable personal use.
                          Commercial use of our data is prohibited without a
                          formal licensing agreement.
                        </p>
                        <div className="text-micro font-bold uppercase tracking-widest text-accent mt-4">
                          Enforcement:
                        </div>
                        <p>
                          We actively monitor for unauthorized scraping and data
                          extraction. Violation of these restrictions may result
                          in:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "Immediate termination of your access to IndianCoffeeBeans",
                            "Implementation of technical measures to block your access",
                            "Legal action for intellectual property infringement, breach of contract, or other applicable causes of action",
                            "Seeking monetary damages and/or injunctive relief",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-muted/5 group transition-all hover:bg-destructive/5 hover:border-destructive/20"
                            >
                              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/60 group-hover:bg-destructive group-hover:scale-125 transition-all" />
                              <p className="text-body">{item}</p>
                            </div>
                          ))}
                        </div>
                        <p>
                          Legitimate research organizations, educational
                          institutions, or parties interested in commercial data
                          licensing should contact us directly at{" "}
                          <a
                            className="text-accent underline font-bold"
                            href="mailto:support@indiancoffeebeans.com"
                          >
                            support@indiancoffeebeans.com
                          </a>{" "}
                          to discuss authorized access arrangements.
                        </p>
                      </Stack>
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
                Questions about our terms?
              </h3>
              <p className="text-body-large text-muted-foreground">
                We&apos;re committed to clarity and transparency.
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
