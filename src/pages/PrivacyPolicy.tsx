import { Link } from "react-router-dom";

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10 text-base leading-relaxed text-muted-foreground">
      <div className="mx-auto max-w-4xl rounded-xl bg-background p-8 shadow-sm">
        <header className="mb-8 space-y-3 text-foreground">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Last updated: 20 January 2025
          </p>
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p>
            Bookmarkly is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use the Bookmarkly web application, mobile
            experiences, or related services (collectively, the "Service").
          </p>
        </header>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              1. Information We Collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Account Data:</strong>{" "}
                Email address, password hash, username, and optional profile
                photo stored in Supabase Auth and Storage.
              </li>
              <li>
                <strong className="text-foreground">Bookmark Content:</strong>{" "}
                URLs, titles, descriptions, tags, reminders, and metadata you
                voluntarily save.
              </li>
              <li>
                <strong className="text-foreground">Usage Data:</strong> Device
                information, IP address, referral data, approximate location,
                and log files captured through standard analytics tooling.
              </li>
              <li>
                <strong className="text-foreground">Support Data:</strong>{" "}
                Copies of messages, diagnostics, or attachments you send to our
                team.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              2. How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Authenticate you and maintain your sessions.</li>
              <li>
                Sync bookmarks, tags, and reminders across your devices in real
                time.
              </li>
              <li>
                Send transactional communications such as reminder emails,
                security notices, or service updates.
              </li>
              <li>
                Monitor usage trends to improve reliability, performance, and
                user experience.
              </li>
              <li>
                Detect, investigate, and prevent fraudulent or malicious
                activity.
              </li>
              <li>Comply with legal obligations and enforce our policies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              3. Legal Bases for Processing
            </h2>
            <p className="mt-3">
              If you reside in the European Economic Area or United Kingdom, we
              process your personal data under the following legal bases: (a)
              performance of a contract by providing the Service; (b) your
              consent when you upload optional data; (c) legitimate interests,
              such as securing the Service or improving features; and (d)
              compliance with legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              4. Data Retention
            </h2>
            <p className="mt-3">
              We retain personal information for as long as your account is
              active or as needed to deliver the Service. You can delete
              bookmarks or close your account at any time, and associated
              content will be removed or anonymised within 30 days unless a
              longer retention period is required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              5. Data Sharing
            </h2>
            <p className="mt-3">
              We do not sell your personal information. We may share limited
              data with trusted subprocessors that help us operate Bookmarkly
              (e.g., Supabase, analytics, email providers) under strict data
              processing agreements. We may disclose information if required by
              law, to protect our rights, or as part of a business transaction
              such as a merger or acquisition.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              6. International Transfers
            </h2>
            <p className="mt-3">
              Bookmarkly may process data on servers located in the United
              States and other jurisdictions. Where required, we rely on
              Standard Contractual Clauses or other approved safeguards to
              protect cross-border transfers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              7. Your Rights
            </h2>
            <p className="mt-3">
              Depending on your region, you may have rights to access, update,
              delete, or port your personal data, restrict or object to certain
              processing, withdraw consent, or lodge a complaint with your local
              supervisory authority. Contact us to exercise these rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              8. Security
            </h2>
            <p className="mt-3">
              We implement administrative, technical, and physical safeguards to
              protect your information, including encryption in transit,
              role-based access controls, and continuous monitoring. No system
              is perfectly secure, so please notify us immediately if you
              suspect any unauthorized account activity.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              9. Children's Privacy
            </h2>
            <p className="mt-3">
              Bookmarkly is not directed to children under 13 (or older age
              thresholds where required). We do not knowingly collect personal
              information from children. If we become aware that a child has
              provided personal data, we will take steps to delete it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              10. Contact Us
            </h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy or our data
              practices, contact us at{" "}
              <a
                href="mailto:privacy@bookmarkly.com"
                className="text-primary underline"
              >
                privacy@bookmarkly.com
              </a>
              .
            </p>
          </div>
        </section>

        <footer className="mt-10">
          <Link to="/" className="text-primary underline">
            Back to home
          </Link>
        </footer>
      </div>
    </div>
  );
}
