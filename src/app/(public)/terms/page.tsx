// app/(public)/terms/page.tsx
import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateSchemaOrg } from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title: "Terms of Service",
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
  other: {
    "application/ld+json": JSON.stringify(
      generateSchemaOrg({
        type: "WebPage",
        name: "Terms of Service",
        description:
          "Terms and conditions for using IndianCoffeeBeans.com directory and services.",
        url: "/terms",
      })
    ),
  },
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-caption">Last Updated: May 22, 2025</div>

      <section className="mb-8">
        <p className="mb-6 text-body">
          The website indiancoffeebeans.com (&quot;website&quot;) is operated by
          IndianCoffeeBeans (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;), based in Hyderabad, India. Please read these Terms
          of Service carefully before using our website. By using
          IndianCoffeeBeans.com, you signify your agreement to be bound by these
          Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">1. Acceptance of Terms</h2>
        <p className="mb-4 text-body">
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement. If you do not agree to
          abide by the above, please do not use this service.
        </p>
        <p className="text-body">
          These Terms of Service constitute an electronic record and do not
          require physical or digital signatures. These terms apply to all users
          of the website, including browsers, reviewers, and contributors.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">2. Service Description</h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans.com is a directory platform that provides
          information about Indian coffee roasters, coffee beans, brewing
          guides, and related educational content. We are not a marketplace or
          e-commerce platform. Instead, we provide information and direct users
          to external websites where they can purchase coffee products.
        </p>
        <p className="mb-4 text-body">
          All product purchases occur on third-party websites. We are not
          responsible for transactions, product quality, shipping, or customer
          service related to purchases made through external links.
        </p>
        <p className="text-body">
          Product information, descriptions, images, and other content related
          to coffee products and roasters may be sourced directly from
          roasters&apos; websites, product packaging, or public information.
          This content belongs to the respective roasters or brands and is
          displayed for informational purposes only. We make no warranties
          regarding the accuracy, completeness, or reliability of such
          information. Users should verify all product details, including
          pricing, availability, and specifications, directly with the roaster
          or retailer before making a purchase.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">3. User Accounts</h2>
        <p className="mb-4 text-body">
          If you create an account on our website, you are responsible for
          maintaining the confidentiality of your account credentials and for
          restricting access to your device to prevent unauthorized access to
          your account. You agree to accept responsibility for all activities
          that occur under your account.
        </p>
        <p className="text-body">
          You may use your account to leave reviews, save favorites, and access
          personalized content. We reserve the right to refuse service,
          terminate accounts, or remove content at any time without notice for
          violations of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">4. Privacy Policy</h2>
        <p className="text-body">
          Please review our Privacy Policy, which governs your visit and use of
          the website. The personal information provided to us during the course
          of usage will be treated as confidential and in accordance with our
          Privacy Policy and applicable laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">5. Directory Platform</h2>
        <p className="mb-4 text-body">
          You understand that our website is an informational directory platform
          that enables you to discover coffee roasters, learn about coffee
          products, and access external websites where products can be
          purchased. We are a facilitator of information and not a party to any
          transactions between you and third-party sellers.
        </p>
        <p className="text-body">
          IndianCoffeeBeans.com is currently free to use. We may introduce
          premium features in the future with prior notice to users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">6. Affiliate Relationships</h2>
        <p className="mb-4 text-body">
          Our website contains affiliate links to third-party websites and
          marketplaces. When you make a purchase through these links, we may
          receive a commission at no additional cost to you. These affiliate
          relationships help us maintain and improve our service.
        </p>
        <p className="text-body">
          All affiliate relationships are disclosed where applicable. Our
          reviews and recommendations are based on genuine evaluation and are
          not influenced solely by affiliate commissions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          7. Website Access and Availability
        </h2>
        <p className="text-body">
          We strive to ensure that our website is available uninterrupted and
          that transmissions are error-free. However, due to the nature of the
          internet, this cannot be guaranteed. Your access to the website may
          occasionally be suspended or restricted for repairs, maintenance, or
          introduction of new features.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">8. License and Permitted Use</h2>
        <p className="mb-4 text-body">
          Subject to your compliance with these Terms of Service, we grant you a
          limited, non-exclusive, non-transferable, revocable license to access
          and make personal use of this website, but not to download (other than
          page caching) or modify it, or any portion of it, except with our
          express written consent.
        </p>
        <p className="mb-4 text-body">This license does not include:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Any resale or commercial use of this website or its contents
          </li>
          <li className="text-body">
            Any collection and use of product listings, descriptions, images, or
            prices
          </li>
          <li className="text-body">
            Any derivative use of this website or its contents
          </li>
          <li className="text-body">
            Any downloading, copying, or other use of account information
          </li>
          <li className="text-body">
            Any use of data mining, robots, scrapers, or similar data gathering
            and extraction tools
          </li>
          <li className="text-body">
            Any reproduction, duplication, copying, selling, reselling, or
            exploitation of any portion of the website
          </li>
        </ul>
        <p className="text-body">
          Any unauthorized use automatically terminates the permissions granted
          by these Terms of Service. You may not frame or utilize framing
          techniques to enclose any trademark, logo, or other proprietary
          information on the website without our express written consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">9. User Conduct</h2>
        <p className="mb-4 text-body">
          You must not use the website in any way that:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Causes, or is likely to cause, interruption, damage, or impairment
            to the website
          </li>
          <li className="text-body">
            Is used for fraudulent purposes or in connection with criminal
            activities
          </li>
          <li className="text-body">
            Sends or reuses material that is illegal, offensive, misleading,
            abusive, defamatory, or harmful
          </li>
          <li className="text-body">
            Violates intellectual property rights or privacy of others
          </li>
          <li className="text-body">
            Contains viruses or other malicious code
          </li>
          <li className="text-body">
            Involves spam, chain letters, or mass unsolicited communications
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">10. Reviews and User Content</h2>
        <p className="mb-4 text-body">
          Users may post reviews, comments, and other content, provided the
          content is not illegal, obscene, abusive, threatening, defamatory, or
          otherwise objectionable. We reserve the right to remove, refuse, or
          edit any content that violates these Terms of Service.
        </p>
        <p className="mb-4 text-body">
          By posting content, you grant us a non-exclusive, royalty-free,
          perpetual license to use, reproduce, modify, and display such content
          throughout the world in any media. You represent that you own the
          rights to any content you post and that such content is accurate and
          lawful.
        </p>
        <p className="mb-4 text-body">
          You agree to indemnify and hold IndianCoffeeBeans harmless from any
          claims, damages, or liabilities arising from your user-generated
          content. We are not responsible for the accuracy, quality, safety,
          legality, or reliability of any user-generated content. All opinions
          expressed in reviews, ratings, comments, and other user content are
          those of the individuals who posted them and do not represent our
          views or opinions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">11. Third-Party Websites</h2>
        <p className="mb-4 text-body">
          Our website contains links to third-party websites operated by coffee
          roasters, retailers, and other businesses. We are not responsible for
          examining or evaluating the offerings, content, or practices of these
          third-party websites.
        </p>
        <p className="text-body">
          When you access these external websites, you are subject to their
          terms of service and privacy policies. We recommend reading these
          policies before making purchases or providing personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">12. Intellectual Property</h2>
        <p className="mb-4 text-body">
          All content on this website, including but not limited to text,
          graphics, logos, images, coffee directory data, roaster information,
          product descriptions, user interface elements, databases, and
          software, is our property or that of our content suppliers and is
          protected by Indian and international intellectual property laws.
        </p>
        <p className="mb-4 text-body">
          Our intellectual property rights extend to:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            The compilation, organization, and arrangement of all content on the
            website
          </li>
          <li className="text-body">
            The selection, coordination, and presentation of all materials
          </li>
          <li className="text-body">
            The comprehensive database of coffee roasters, products, and
            regional information
          </li>
          <li className="text-body">
            Original editorial content, reviews, and educational materials
          </li>
          <li className="text-body">
            The overall look and feel, design elements, and user experience
          </li>
        </ul>
        <p className="mb-4 text-body">
          The IndianCoffeeBeans name and logo are our trademarks. You may not
          use our trademarks in connection with any product or service without
          our express written consent. Unauthorized use of our intellectual
          property constitutes infringement and may result in legal action.
        </p>
        <p className="text-body">
          While individual facts about coffee products may not be protected by
          copyright, the particular selection, coordination, arrangement, and
          enhancement of those facts within our database is protected
          intellectual property.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">13. Disclaimer</h2>
        <p className="mb-4 text-body">
          You acknowledge that you are using our website at your own risk. We
          provide information about coffee roasters and products for
          informational purposes only. We do not endorse or guarantee the
          quality, safety, or legality of products offered by third-party
          sellers.
        </p>
        <p className="mb-4 text-body">
          This website and all content are provided &quot;as is&quot; without
          warranty of any kind. We disclaim all warranties, express or implied,
          including warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
        <p className="text-body">
          IndianCoffeeBeans serves as an aggregator and directory of
          coffee-related information. We do not independently verify or validate
          product descriptions, specifications, images, or other content sourced
          from roasters&apos; websites or provided by users. Information may be
          obtained through automated means, direct submissions, or manual
          collection. All such third-party content is the responsibility of its
          original creator or publisher. By using our service, you acknowledge
          and accept that we do not guarantee the accuracy of any information
          displayed and cannot be held liable for any errors, omissions, or
          outdated information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">14. Limitation of Liability</h2>
        <p className="mb-4 text-body">
          To the maximum extent permitted by applicable law, IndianCoffeeBeans,
          its directors, employees, partners, agents, suppliers, or affiliates
          shall not be liable for any direct, indirect, incidental, special,
          consequential, or exemplary damages resulting from:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Your access to or use of (or inability to access or use) the website
            or any content
          </li>
          <li className="text-body">
            Any conduct or content of any third party on the website, including
            without limitation, any defamatory, offensive, or illegal conduct
          </li>
          <li className="text-body">
            Any products, services, or content obtained from third-party
            websites linked from our platform
          </li>
          <li className="text-body">
            Unauthorized access, use, or alteration of your transmissions or
            content
          </li>
          <li className="text-body">
            Errors, inaccuracies, or omissions in the content or functionality
            of the website
          </li>
          <li className="text-body">
            Transactions between you and third-party sellers, including product
            quality, delivery, prices, and consumer satisfaction
          </li>
        </ul>
        <p className="mb-4 text-body">
          This limitation applies whether the alleged liability is based on
          contract, tort, negligence, strict liability, or any other basis, even
          if we have been advised of the possibility of such damage.
        </p>
        <p className="text-body">
          In no event shall our total liability to you for all damages, losses,
          or causes of action exceed ₹5,000 (five thousand Indian Rupees). This
          cap applies regardless of whether you have paid for any services, as
          IndianCoffeeBeans is primarily offered as a free information
          directory.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">15. Age Restrictions</h2>
        <p className="text-body">
          Use of our website is available only to persons who can form legally
          binding contracts under Indian law. If you are under the age of 18,
          you may use our website only with the involvement of a parent or
          guardian.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">16. Communications</h2>
        <p className="text-body">
          When you visit our website, you are communicating with us
          electronically. You consent to receive communications from us
          electronically, including email newsletters, notifications, and
          updates about our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">17. Modifications to Terms</h2>
        <p className="text-body">
          We reserve the right to modify these Terms of Service at any time.
          Changes will be effective when posted on this page with a new
          &quot;Last Updated&quot; date. Your continued use of the website after
          changes are posted constitutes acceptance of the modified terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          18. Dispute Resolution and Governing Law
        </h2>
        <p className="mb-4 text-body">
          These Terms of Service are governed by and construed in accordance
          with the laws of India, without giving effect to any principles of
          conflicts of law. Any disputes arising from these terms or your use of
          our website shall be subject to the exclusive jurisdiction of the
          courts in Hyderabad, Telangana, India.
        </p>
        <p className="mb-4 text-body">
          Before filing any formal legal action, you agree to first attempt to
          resolve the dispute informally by contacting us at{" "}
          <a className="text-body underline" href="mailto:gt.abhiseh@gmail.com">
            gt.abhiseh@gmail.com
          </a>
          . Most concerns can be resolved quickly and efficiently through this
          process.
        </p>
        <p className="text-body">
          You agree that any claim arising out of or related to these Terms or
          our Services must be filed within one (1) year after such claim arose,
          otherwise, your claim is permanently barred. You also explicitly waive
          any right to class action proceedings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">19. Contact Information</h2>
        <p className="text-body">
          If you have any questions about these Terms of Service or our website,
          please contact us at:
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
        <h2 className="mb-4 text-heading">20. Severability</h2>
        <p className="text-body">
          If any provision of these Terms of Service is found to be invalid or
          unenforceable, the remaining provisions will continue to be valid and
          enforceable to the fullest extent permitted by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          21. Content Scraping and Third-Party Information
        </h2>
        <p className="mb-4 text-body">
          We may collect and display information, images, and content from
          third-party sources, including but not limited to roaster websites,
          social media accounts, and other publicly available sources. This
          content is displayed for informational purposes only and remains the
          intellectual property of its original creators.
        </p>
        <p className="mb-4 text-body">
          While we strive to ensure all content is accurate and up-to-date, we
          cannot guarantee the accuracy, completeness, or reliability of
          information obtained from third-party sources. Product availability,
          pricing, specifications, and other details may change without notice.
          Users should always verify information directly with roasters or
          retailers before making purchase decisions.
        </p>
        <p className="text-body">
          If you are a coffee roaster or rights holder and believe that content
          displayed on our platform infringes on your rights, please contact us
          at{" "}
          <a className="text-body underline" href="mailto:gt.abhiseh@gmail.com">
            gt.abhiseh@gmail.com
          </a>{" "}
          with details, and we will address your concerns promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          22. Image Rights and User-Submitted Photos
        </h2>
        <p className="mb-4 text-body">
          Users may submit photos as part of reviews, comments, or other
          contributions to IndianCoffeeBeans. By submitting photos or images,
          you:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Confirm you own the rights to these images or have permission to
            share them publicly
          </li>
          <li className="text-body">
            Grant IndianCoffeeBeans a worldwide, non-exclusive, royalty-free
            license to use, reproduce, modify, publish, and display such images
          </li>
          <li className="text-body">
            Understand that images will remain on our platform even if you
            delete your account
          </li>
          <li className="text-body">
            Agree not to upload images containing identifiable people without
            their consent
          </li>
          <li className="text-body">
            Agree not to upload images containing trademarks, logos, or
            copyrighted content you don&apos;t have rights to
          </li>
        </ul>
        <p className="text-body">
          We respect intellectual property rights and will respond to legitimate
          requests to remove images that infringe on copyrights or other legal
          protections. Please contact us at{" "}
          <a className="text-body underline" href="mailto:gt.abhiseh@gmail.com">
            gt.abhiseh@gmail.com
          </a>{" "}
          with any concerns.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          23. Content Moderation and Editorial Policies
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans reserves the right to moderate all content on our
          platform, including but not limited to user reviews, comments,
          ratings, and images. Our content moderation may be performed
          automatically through filters or manually by our team. We may, at our
          sole discretion:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Remove content that violates our guidelines, contains spam, or is
            otherwise inappropriate
          </li>
          <li className="text-body">
            Edit user reviews for clarity, grammar, or format without changing
            the substantive meaning
          </li>
          <li className="text-body">
            Prioritize or feature certain reviews based on relevance,
            helpfulness, or recency
          </li>
          <li className="text-body">
            Flag suspicious content patterns or potential conflicts of interest
          </li>
          <li className="text-body">
            Implement verification processes for reviewers to enhance trust
          </li>
        </ul>
        <p className="mb-4 text-body">
          Our editorial team may create original content about coffee roasters,
          products, or brewing techniques. This content represents our
          independent views and analysis, though it may contain affiliate links
          as disclosed in our Affiliate Marketing policy.
        </p>
        <p className="text-body">
          We strive for accuracy in all content but cannot guarantee that all
          information is completely current or correct. We make no
          representations about the suitability of the information for any
          purpose.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          24. Featured Listings and Promotional Content
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans offers premium placement and featured listing
          opportunities for coffee roasters and product providers. Such featured
          content will be clearly labeled as &quot;Featured,&quot;
          &quot;Sponsored,&quot; or similar designation to distinguish it from
          regular listings.
        </p>
        <p className="mb-4 text-body">
          We maintain full editorial discretion over all content on our
          platform, including:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            The right to decline paid placement requests at our sole discretion
          </li>
          <li className="text-body">
            The right to remove featured listings that no longer meet our
            quality standards
          </li>
          <li className="text-body">
            The ability to adjust placement and visibility based on user
            engagement and relevance
          </li>
          <li className="text-body">
            Final approval on all promotional language and imagery associated
            with featured listings
          </li>
        </ul>
        <p className="text-body">
          Payment for featured placement does not guarantee positive reviews or
          ratings, nor does it influence our editorial content. We maintain a
          strict separation between paid promotions and our objective evaluation
          of coffee products and roasters.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          25. Guest Contributors and Third-Party Content
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may publish articles, blog posts, reviews, or other
          content created by guest contributors, industry experts, or
          third-party authors. This content is subject to the following terms:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Opinions, views, and statements expressed by guest contributors are
            their own and do not necessarily reflect the position of
            IndianCoffeeBeans
          </li>
          <li className="text-body">
            Guest content will be clearly labeled with the contributor&apos;s
            name or an appropriate byline
          </li>
          <li className="text-body">
            We reserve the right to edit guest contributions for clarity,
            grammar, length, and adherence to our content guidelines
          </li>
          <li className="text-body">
            By submitting content for publication, contributors grant us a
            perpetual, worldwide, non-exclusive license to publish, distribute,
            and display their content
          </li>
          <li className="text-body">
            Guest contributors are responsible for ensuring their submissions do
            not infringe on third-party rights
          </li>
        </ul>
        <p className="text-body">
          IndianCoffeeBeans reviews guest content for quality and relevance but
          cannot verify all facts or claims made by third-party contributors.
          Users should exercise their own judgment when evaluating opinions
          expressed in guest content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">26. Partnerships and Events</h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may partner with coffee roasters, retailers, or
          other industry participants for events, newsletters, promotions, or
          content collaborations. These partnerships are governed by the
          following principles:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            All partnerships and commercial relationships will be transparently
            disclosed to users
          </li>
          <li className="text-body">
            Partner content will be clearly labeled as such to distinguish it
            from independent editorial content
          </li>
          <li className="text-body">
            Partnership opportunities do not guarantee positive reviews or
            preferential treatment in our directory listings
          </li>
          <li className="text-body">
            We maintain editorial independence and the right to provide honest
            assessments of partner products or services
          </li>
          <li className="text-body">
            Users may receive promotional communications about partner events or
            offerings, subject to our Privacy Policy and their communication
            preferences
          </li>
        </ul>
        <p className="text-body">
          When we organize or promote events, whether independently or with
          partners, participation in such events is subject to separate terms
          and conditions that will be provided at the time of registration or
          ticket purchase.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          27. Premium Membership and Subscription Services
        </h2>
        <p className="mb-4 text-body">
          While IndianCoffeeBeans currently operates as a free service, we may
          introduce premium membership tiers or subscription-based features in
          the future. If and when such services are introduced:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            All subscription terms, including pricing, billing cycles, and
            cancellation policies, will be clearly disclosed before purchase
          </li>
          <li className="text-body">
            Users will have the option to cancel recurring subscriptions through
            their account settings
          </li>
          <li className="text-body">
            Premium features will be clearly distinguished from free content
          </li>
          <li className="text-body">
            We reserve the right to modify the features included in each
            subscription tier with reasonable notice
          </li>
          <li className="text-body">
            Educational content, early access, exclusive offers, and enhanced
            personalization may be included in premium memberships
          </li>
        </ul>
        <p className="text-body">
          All subscription payments will be processed through secure third-party
          payment processors. We do not store payment card information on our
          servers. Subscription services will be subject to additional terms
          provided at the time of enrollment.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          28. Educational Content and Courses
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may develop and offer educational content, including
          but not limited to online courses, workshops, webinars, and
          certification programs related to coffee appreciation, brewing
          techniques, and industry knowledge. These educational offerings are
          subject to the following terms:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Course materials, videos, PDFs, and other educational content are
            protected by copyright and may not be reproduced or distributed
            without permission
          </li>
          <li className="text-body">
            Certificates or credentials earned through our programs do not
            constitute professional licensure or accreditation
          </li>
          <li className="text-body">
            Course fees, if any, will be clearly disclosed before enrollment and
            are typically non-refundable once access to materials has been
            granted
          </li>
          <li className="text-body">
            We may partner with industry professionals, roasters, or educational
            institutions to develop course content
          </li>
          <li className="text-body">
            Completion of courses or workshops does not guarantee specific
            outcomes or results
          </li>
        </ul>
        <p className="text-body">
          While we strive to provide accurate and up-to-date educational
          content, we do not warrant that course materials will be error-free or
          that techniques taught will be suitable for all circumstances. Users
          participate in educational activities at their own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">29. Merchandise and Product Sales</h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may offer merchandise or physical products,
          including but not limited to branded items, specialty coffee
          selections, brewing equipment, or curated sample boxes. These product
          offerings are subject to the following terms:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Product descriptions, including prices, specifications, and
            availability, are subject to change without notice
          </li>
          <li className="text-body">
            We do not guarantee that product colors and specifications will
            appear exactly as displayed due to variations in device screens
          </li>
          <li className="text-body">
            Shipping policies, delivery timeframes, and return procedures will
            be provided at the time of purchase
          </li>
          <li className="text-body">
            For perishable items like coffee beans, we cannot accept returns
            unless the product is defective
          </li>
          <li className="text-body">
            Promotional offers and discounts may be subject to additional terms
            and conditions
          </li>
        </ul>
        <p className="mb-4 text-body">
          When we partner with roasters or other vendors to create co-branded or
          curated products, we select partners based on quality and alignment
          with our values. However, we do not manufacture coffee products
          ourselves and rely on our partners&apos; production standards and
          quality control.
        </p>
        <p className="text-body">
          All sales are subject to applicable Indian laws, including consumer
          protection regulations. Nothing in these terms restricts your
          statutory rights as a consumer.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          30. Referral Programs and Commissions
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may offer referral programs, ambassador initiatives,
          or commission structures that reward users for inviting others to the
          platform or for contributing high-quality content. These incentive
          programs are subject to the following terms:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Eligibility criteria for participation in referral programs will be
            clearly defined
          </li>
          <li className="text-body">
            Rewards, whether in the form of site credits, discounts, or monetary
            compensation, will be issued according to the program terms in
            effect at the time of the qualifying activity
          </li>
          <li className="text-body">
            We reserve the right to modify, suspend, or terminate any referral
            program at our discretion
          </li>
          <li className="text-body">
            Fraudulent referrals, artificial engagement, or other attempts to
            manipulate program metrics will result in disqualification and
            forfeiture of rewards
          </li>
          <li className="text-body">
            Participants are responsible for any tax implications arising from
            rewards or commissions earned
          </li>
        </ul>
        <p className="mb-4 text-body">
          Participants in commission-based programs must disclose their
          affiliation with IndianCoffeeBeans when promoting our platform to
          others, in accordance with applicable advertising regulations and
          guidelines.
        </p>
        <p className="text-body">
          By participating in referral programs, you agree not to make false or
          misleading claims about our services and to respect the communication
          preferences of those you refer to our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">31. API and Developer Services</h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans may develop and offer Application Programming
          Interfaces (APIs) or other developer tools that provide programmatic
          access to our coffee directory data and functionality. Use of these
          developer services is subject to the following terms:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            API access may be subject to rate limits, authentication
            requirements, and usage quotas
          </li>
          <li className="text-body">
            Developers must register for API keys and comply with our API
            documentation and guidelines
          </li>
          <li className="text-body">
            Commercial use of our API or data may require a paid subscription or
            licensing agreement
          </li>
          <li className="text-body">
            Applications using our API must properly attribute IndianCoffeeBeans
            as the data source
          </li>
          <li className="text-body">
            We reserve the right to modify or discontinue API endpoints or
            features with reasonable notice
          </li>
        </ul>
        <p className="mb-4 text-body">
          Developers may not use our API to build applications that compete
          directly with core IndianCoffeeBeans services or that misrepresent our
          data. We maintain the right to revoke API access for applications that
          violate these terms or that provide a poor user experience.
        </p>
        <p className="text-body">
          When using our API, developers are responsible for ensuring their
          applications comply with data protection regulations and for obtaining
          any necessary consents from their end users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">
          32. Site Access Restrictions and Anti-Scraping Policy
        </h2>
        <p className="mb-4 text-body">
          IndianCoffeeBeans invests significant resources in collecting,
          organizing, and presenting coffee directory information. To protect
          this investment and ensure the integrity of our platform, the
          following restrictions apply to all users:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            You may not use automated tools, bots, crawlers, scrapers, or other
            data extraction methods to access, copy, or collect data from our
            website without our express written permission
          </li>
          <li className="text-body">
            You may not bypass or attempt to bypass any access control
            mechanisms or usage limitations we implement, including IP blocks,
            rate limiting, or CAPTCHA
          </li>
          <li className="text-body">
            You may not engage in activities that place excessive load on our
            servers or infrastructure
          </li>
          <li className="text-body">
            You may not create derivative databases, directories, or indices
            based on content scraped or collected from our platform
          </li>
          <li className="text-body">
            You may not use our content, data, or design elements to create a
            competing service
          </li>
        </ul>
        <p className="mb-4 text-body">
          Permissible use of our content is limited to normal browsing, sharing
          individual listings via provided social sharing features, and
          reasonable personal use. Commercial use of our data is prohibited
          without a formal licensing agreement.
        </p>
        <p className="mb-4 text-body">
          We actively monitor for unauthorized scraping and data extraction.
          Violation of these restrictions may result in:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            Immediate termination of your access to IndianCoffeeBeans
          </li>
          <li className="text-body">
            Implementation of technical measures to block your access
          </li>
          <li className="text-body">
            Legal action for intellectual property infringement, breach of
            contract, or other applicable causes of action
          </li>
          <li className="text-body">
            Seeking monetary damages and/or injunctive relief
          </li>
        </ul>
        <p className="text-body">
          Legitimate research organizations, educational institutions, or
          parties interested in commercial data licensing should contact us
          directly at{" "}
          <a className="text-body underline" href="mailto:gt.abhiseh@gmail.com">
            gt.abhiseh@gmail.com
          </a>{" "}
          to discuss authorized access arrangements.
        </p>
      </section>
    </div>
  );
}
