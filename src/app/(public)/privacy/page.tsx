// app/(public)/privacy/page.tsx
import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateSchemaOrg } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy",
  description:
    "How IndianCoffeeBeans.com collects, uses, and protects your personal information.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy",
    "personal information",
  ],
  canonical: "/privacy",
  type: "website",
  other: {
    "application/ld+json": JSON.stringify(
      generateSchemaOrg({
        type: "WebPage",
        name: "Privacy Policy",
        description:
          "How IndianCoffeeBeans.com collects, uses, and protects your personal information.",
        url: "/privacy",
      })
    ),
  },
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-caption">Last Updated: May 22, 2025</div>

      <section className="mb-8">
        <p className="mb-6 text-body">
          This privacy policy governs how IndianCoffeeBeans (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses, maintains and
          discloses information collected from users (&quot;User&quot;,
          &quot;you&quot;) of the indiancoffeebeans.com website
          (&quot;Site&quot;). This privacy policy applies to the Site and all
          services offered by IndianCoffeeBeans.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          1. Personal Identification Information
        </h2>
        <p className="mb-4 text-body">
          We may collect personal identification information from Users in a
          variety of ways, including when users register on the site, subscribe
          to our newsletter, submit reviews or ratings, and in connection with
          other activities, services, or features we make available on our Site.
          Users may visit our Site anonymously. We will collect personal
          identification information from Users only if they voluntarily submit
          such information to us.
        </p>
        <p className="text-body">
          Users can always refuse to supply personal identification information,
          except that it may prevent them from engaging in certain site-related
          activities such as leaving reviews or subscribing to our newsletter.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">2. Information We Do Not Collect</h2>
        <p className="mb-4 text-body">
          We do not collect or store payment information. When you purchase
          products through our affiliate links, you will be redirected to
          third-party websites (such as roaster websites, Amazon, or other
          marketplaces) where any payment transactions occur directly with those
          third parties.
        </p>
        <p className="text-body">
          These third-party sites have their own privacy policies and terms of
          service. We strongly recommend reading their privacy policies before
          making any purchases or providing personal information to these third
          parties. We are not responsible for the privacy practices or content
          of these external sites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">3. Web Browser Cookies</h2>
        <p className="mb-4 text-body">
          Our Site uses &quot;cookies&quot; to enhance User experience. Your web
          browser places cookies on your device for record-keeping purposes and
          to track information about your preferences. You can adjust your
          browser settings to alert you when our Site is trying to send you
          cookies or to block all cookies.
        </p>
        <p className="mb-4 text-body">
          Cookies help us understand how visitors use our site, track which
          coffee roasters and products are most popular, and improve our content
          recommendations. We use cookies for statistical analysis to improve
          our website and never store personally identifiable information in
          cookies.
        </p>
        <p className="text-body">
          IndianCoffeeBeans provides comprehensive cookie management tools that
          allow you to control your cookie preferences. Through our cookie
          management interface, you can view, enable, or disable different
          categories of cookies at any time. Essential cookies required for
          basic site functionality cannot be disabled, but all preference,
          analytics, and marketing cookies can be managed according to your
          preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          4. How We Use Collected Information
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may collect and use Users&apos; personal information
          for the following purposes:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            To improve customer service and respond to your inquiries and
            support needs
          </li>
          <li className="text-body">
            To personalize user experience and understand how our Users use the
            services and resources on our Site
          </li>
          <li className="text-body">
            To improve our Site based on feedback and usage patterns
          </li>
          <li className="text-body">
            To send Users information about coffee-related topics, new roasters,
            or featured products that may interest them (with consent)
          </li>
          <li className="text-body">
            To process newsletter subscriptions and send regular updates about
            Indian coffee
          </li>
          <li className="text-body">
            To display user reviews and ratings to help other coffee enthusiasts
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          5. How We Protect Your Information
        </h2>
        <p className="text-body">
          The security of your personal information is important to us. We adopt
          appropriate data collection, storage and processing practices and
          security measures to protect against unauthorized access, alteration,
          disclosure or destruction of your personal information. Since we do
          not process payments directly, we do not store sensitive financial
          information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          6. Sharing of Personal Information
        </h2>
        <p className="mb-4 text-body">
          We do not sell, trade, or rent Users&apos; personal identification
          information to others. We may share generic aggregated demographic
          information not linked to any personal identification information
          regarding visitors and users with our partners and advertisers for the
          purposes outlined above.
        </p>
        <p className="text-body">
          When you click on affiliate links to purchase products, you may be
          sharing information directly with those third-party retailers. This
          sharing is governed by their respective privacy policies, not ours.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">7. Third Party Websites</h2>
        <p className="text-body">
          Users may find links on our Site that lead to the sites and services
          of our partners, coffee roasters, Amazon, and other retailers. We do
          not control the content or links that appear on these sites and are
          not responsible for the practices employed by websites linked to or
          from our Site. Browsing and interaction on any other website is
          subject to that website&apos;s own terms and policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          8. Affiliate Marketing and Advertising
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans participates in affiliate marketing programs. When
          you purchase products through our affiliate links, we may receive a
          small commission at no additional cost to you. These commissions help
          us maintain and improve our service.
        </p>
        <p className="mb-4 text-body">
          We follow these principles regarding affiliate relationships:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            All affiliate links are clearly disclosed with language such as
            &quot;affiliate link&quot; or similar indicators
          </li>
          <li className="text-body">
            Our product reviews and recommendations are based on genuine
            evaluation, not solely on commission potential
          </li>
          <li className="text-body">
            We maintain editorial independence even with affiliate partners
          </li>
          <li className="text-body">
            We may collect analytics data about how users interact with
            affiliate links to improve our service
          </li>
        </ul>
        <p className="text-body">
          We also display advertisements from third parties that may use cookies
          to track your browsing behavior for ad targeting. You can manage these
          cookies through our cookie management interface. We do not sell your
          personal data to advertisers but may provide aggregated, anonymized
          data about our users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">9. User Reviews and Content</h2>
        <p className="mb-4 text-body">
          When you submit reviews, ratings, or other content to our Site, you
          grant us the right to display this content publicly to help other
          users make informed decisions about coffee purchases. We reserve the
          right to moderate content and remove reviews that violate our
          community guidelines.
        </p>
        <p className="mb-4 text-body">
          By submitting reviews, ratings, comments, or other content to
          IndianCoffeeBeans, you understand and agree that:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            All reviews, ratings, and comments become the property of
            IndianCoffeeBeans once submitted and will remain on the platform
            even if you later delete your account
          </li>
          <li className="text-body">
            While you may delete your personal profile and personally
            identifiable information, any content you have contributed (such as
            reviews, ratings, or comments) will remain on the site with your
            username anonymized
          </li>
          <li className="text-body">
            We retain perpetual rights to use, modify, display, and distribute
            your contributed content as part of our service
          </li>
          <li className="text-body">
            Content you provide must be honest, accurate, and based on your
            genuine experience
          </li>
        </ul>
        <p className="text-body">
          This approach allows us to maintain the integrity and value of our
          coffee directory even as users come and go, while still respecting
          your right to remove your personal information from our system.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          10. Changes to This Privacy Policy
        </h2>
        <p className="text-body">
          IndianCoffeeBeans has the discretion to update this privacy policy at
          any time. When we do, we will revise the updated date at the top of
          this page. We encourage Users to frequently check this page for any
          changes to stay informed about how we are helping to protect the
          personal information we collect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          11. Your Acceptance of These Terms
        </h2>
        <p className="text-body">
          By using this Site, you signify your acceptance of this policy. If you
          do not agree to this policy, please do not use our Site. Your
          continued use of the Site following the posting of changes to this
          policy will be deemed your acceptance of those changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">12. Contact Information</h2>
        <p className="text-body">
          If you have any questions about this Privacy Policy, the practices of
          this site, or your dealings with this site, please contact us at:
        </p>
        <div className="card-base mt-4 rounded-lg p-4">
          <p className="font-medium text-body">IndianCoffeeBeans</p>
          <p className="text-body">Hyderabad, India</p>
          <p className="text-body">
            Email:{" "}
            <a
              className="text-body underline"
              href="mailto:gt.abhiseh@gmail.com"
            >
              gt.abhiseh@gmail.com
            </a>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">13. Data Deletion and Retention</h2>
        <p className="mb-4 text-body">
          You have the right to request the deletion of your personal
          information from our systems. If you wish to delete your account and
          personal information, you can do so through your account settings or
          by contacting us directly at{" "}
          <a className="text-body underline" href="mailto:gt.abhiseh@gmail.com">
            gt.abhiseh@gmail.com
          </a>
          .
        </p>
        <p className="mb-4 text-body">
          When you request account deletion, we will remove your personally
          identifiable information (such as name, email, and other contact
          details) from our active databases. However, please note that:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Reviews, ratings, and other content contributions will remain on the
            platform, attributed to an anonymized username
          </li>
          <li className="text-body">
            We may retain certain information in our backup systems or for legal
            and compliance purposes
          </li>
          <li className="text-body">
            Information that has been shared with third parties or made public
            through your use of our services cannot be deleted by us
          </li>
          <li className="text-body">
            We may retain aggregated, anonymized data derived from your
            information even after your account is deleted
          </li>
        </ul>
        <p className="text-body">
          This policy allows us to respect your right to data deletion while
          maintaining the integrity and value of our coffee directory for other
          users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          14. Facebook Login and Social Authentication
        </h2>
        <p className="mb-4 text-body">
          When you sign in using Facebook Login, we collect limited information
          from your Facebook profile, including:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">Your name and email address</li>
          <li className="text-body">
            Profile picture (if you choose to use it)
          </li>
          <li className="text-body">
            Basic demographic information (if publicly available)
          </li>
        </ul>
        <p className="mb-4 text-body">
          We do not access your Facebook friends list, posts, or other private
          Facebook data. The information we collect is used solely to create and
          maintain your IndianCoffeeBeans account.
        </p>
        <p className="mb-4 text-body">
          If you signed up using Facebook and wish to delete your account and
          all associated data, you can:
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li className="text-body">
            Visit our data deletion page at [yourdomain.com/data-deletion]
          </li>
          <li className="text-body">
            Email us directly at gt.abhiseh@gmail.com
          </li>
          <li className="text-body">
            Use Facebook&apos;s app removal process and then contact us to
            delete local data
          </li>
        </ol>
        <p className="text-body">
          We will process all deletion requests within 7 business days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          15. Business Relationships with Roasters and Providers
        </h2>
        <p className="mb-4 text-body">
          In addition to affiliate partnerships, IndianCoffeeBeans may enter
          into direct business relationships with coffee roasters, retailers,
          and product providers for various commercial purposes, including:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Featured listings and premium placement on our directory
          </li>
          <li className="text-body">
            Co-branded content and promotional campaigns
          </li>
          <li className="text-body">
            Sponsored newsletters or educational content
          </li>
          <li className="text-body">Coffee tasting events and workshops</li>
          <li className="text-body">Joint marketing initiatives</li>
        </ul>
        <p className="mb-4 text-body">
          In the context of these business relationships, we may share certain
          aggregated data and analytics with our partners, such as:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Engagement metrics for featured listings (views, clicks, etc.)
          </li>
          <li className="text-body">
            Anonymized user behavior and interest patterns
          </li>
          <li className="text-body">Performance data for sponsored content</li>
        </ul>
        <p className="text-body">
          We will never share personally identifiable information of our users
          with these business partners unless you have explicitly opted in to
          such sharing. All commercial relationships are disclosed according to
          our transparency policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          16. Market Research and Analytics Services
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may analyze user behavior, preferences, and trends
          to create aggregated market research and industry insights. These
          analytics may be used to:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Produce industry reports on coffee consumption trends and
            preferences
          </li>
          <li className="text-body">
            Create benchmarking data for the specialty coffee market in India
          </li>
          <li className="text-body">
            Generate statistics on regional popularity of certain roast types,
            origins, or brewing methods
          </li>
          <li className="text-body">
            Analyze seasonal patterns in coffee purchasing behavior
          </li>
        </ul>
        <p className="mb-4 text-body">
          We may offer anonymized, aggregated research findings to industry
          partners, coffee businesses, or market researchers on a paid or unpaid
          basis. This research will never contain personally identifiable
          information about individual users.
        </p>
        <p className="text-body">
          By using our service, you agree that your anonymized usage data may be
          included in such aggregated analyses. This helps support the coffee
          industry while maintaining user privacy.
        </p>
      </section>
    </div>
  );
}
