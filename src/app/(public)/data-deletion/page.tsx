"use client";

const CONTACT_EMAIL = "gta3lok.ai@gmail.com";

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

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-caption">Last Updated: June 6, 2025</div>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">What Data We Collect</h2>
        <h3 className="mb-2 text-subheading">From Facebook Login Users:</h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li className="text-body">
            <strong>Name:</strong> Your display name from Facebook to
            personalize your experience
          </li>
          <li className="text-body">
            <strong>Email Address:</strong> Used for account management and
            communication
          </li>
          <li className="text-body">
            <strong>Profile Picture:</strong> Displayed on your account and
            reviews (optional)
          </li>
        </ul>
        <p className="text-body italic">
          <strong>Note:</strong> We only collect basic profile information
          necessary for account functionality. We do not access your Facebook
          posts, friends list, or other private information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">How to Request Data Deletion</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-subheading">
            Step 1: Send an Email Request
          </h3>
          <p className="mb-2 text-body">
            Send your deletion request to our privacy team at:
          </p>
          <p className="font-semibold text-body text-xl">
            <a className="text-body underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-subheading">
            Step 2: Use This Email Template
          </h3>
          <p className="mb-2 text-body">
            Copy and paste this template to ensure we have all the information
            needed to process your request:
          </p>
          <div className="card-base relative rounded-md p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {emailTemplate}
            </pre>
            <button
              className="absolute top-2 right-2 rounded bg-muted px-3 py-1 font-semibold text-xs transition-colors hover:bg-muted/80"
              onClick={() => navigator.clipboard.writeText(emailTemplate)}
              type="button"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-subheading">
            Step 3: Wait for Confirmation
          </h3>
          <p className="text-body">
            We&apos;ll send you a confirmation email within 7 days acknowledging
            your request and providing a timeline for completion.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">Processing Timeline</h2>
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div className="card-base rounded-lg border-l-4 border-l-primary p-6">
            <h4 className="mb-2 font-bold text-primary text-xl">7 Days</h4>
            <p className="font-semibold text-primary">Initial Response</p>
            <p className="text-caption">
              We&apos;ll acknowledge your request and verify your identity
            </p>
          </div>
          <div className="card-base rounded-lg border-l-4 border-l-accent p-6">
            <h4 className="mb-2 font-bold text-accent text-xl">30 Days</h4>
            <p className="font-semibold text-accent">Complete Deletion</p>
            <p className="text-caption">
              All your data will be permanently removed from our systems
            </p>
          </div>
          <div className="card-base rounded-lg border-l-4 border-l-muted-foreground p-6">
            <h4 className="mb-2 font-bold text-muted-foreground text-xl">
              Final
            </h4>
            <p className="font-semibold text-muted-foreground">Confirmation</p>
            <p className="text-caption">
              You&apos;ll receive confirmation once deletion is complete
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">What Happens to Your Data</h2>
        <div className="mb-4">
          <h3 className="mb-2 text-subheading">
            <span className="text-primary">✅</span> Permanently Deleted:
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li className="text-body">Your name and email address</li>
            <li className="text-body">Profile picture and personal info</li>
            <li className="text-body">Account preferences and settings</li>
            <li className="text-body">Login credentials and session data</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-subheading">
            <span className="text-accent">⚠️</span> Anonymized (Stays on Site):
          </h3>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li className="text-body">Coffee ratings you submitted</li>
            <li className="text-body">Reviews and comments you wrote</li>
            <li className="text-body">Community contributions</li>
          </ul>
          <p className="text-body italic">
            <strong>Why?</strong> Your ratings help other coffee lovers make
            better decisions. They remain on the site but show &quot;Anonymous
            User&quot; instead of your name.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">Important Notes</h2>
        <div className="mb-4">
          <h3 className="mb-2 text-subheading">Cannot Be Recovered:</h3>
          <p className="text-body">
            Once your personal data is deleted, it cannot be recovered.
            You&apos;ll need to create a new account if you wish to use
            IndianCoffeeBeans again in the future.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-subheading">Alternative Options:</h3>
          <p className="text-body">
            If you&apos;re concerned about privacy but don&apos;t want to delete
            your account entirely, you can update your privacy settings or
            temporarily deactivate your account instead.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-heading">Need Help?</h2>
        <p className="mb-2 text-body">
          If you have questions about data deletion or need assistance with your
          request, contact our privacy team:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li className="text-body">
            <strong>Privacy Team:</strong>{" "}
            <a className="text-body underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </li>
          <li className="text-body">
            <strong>General Support:</strong>{" "}
            <a className="text-body underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
