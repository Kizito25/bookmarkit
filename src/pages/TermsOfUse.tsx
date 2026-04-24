import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.svg";

export function TermsOfUsePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10 text-base leading-relaxed text-muted-foreground">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg">
          <div className="flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="Logo" className="h-7 w-7" />
              <span className="text-xl font-bold text-black">Bookmarkly</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </a>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Login/ Sign Up
                </Link>
              </div>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative"
            >
              <div
                className={`w-6 h-0.5 bg-gray-900 absolute transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45" : "translate-y-1"
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-gray-900 absolute transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45" : "-translate-y-1"
                }`}
              ></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 px-6 py-4 space-y-4">
              <a
                href="#pricing"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>

              <Link
                to="/login"
                className="block bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login/ Sign Up
              </Link>
            </div>
          )}
        </div>
        {/* Mobile Menu end */}
      </header>

      <div className="mx-auto mt-20 max-w-4xl rounded-xl bg-background p-8 shadow-sm">
        <header className="mb-8 space-y-3 text-foreground">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Last updated: 24 April 2026
          </p>
          <h1 className="text-3xl font-semibold">Terms of Use</h1>
          <p>
            These Terms of Use ("Terms") govern your access to and use of the
            Bookmarkly web application, mobile experiences, and related services
            (collectively, the "Service"). By using the Service, you agree to
            these Terms and our Privacy Policy. If you do not agree, do not use
            the Service.
          </p>
        </header>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              1. Eligibility and Acceptable Use
            </h2>
            <p className="mt-3">
              You may use the Service only if you can form a binding contract
              and comply with applicable laws. You agree not to misuse the
              Service, including probing for vulnerabilities, attempting
              unauthorized access, reverse engineering, automating abusive
              traffic, or interfering with normal operation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              2. Accounts and Security
            </h2>
            <p className="mt-3">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must provide accurate registration details and notify
              us immediately of any suspected unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              3. Your Content
            </h2>
            <p className="mt-3">
              You retain ownership of bookmarks, notes, tags, and other content
              you submit to Bookmarkly ("User Content"). You grant us a limited,
              non-exclusive license to host, process, and display User Content
              only as necessary to operate, secure, and improve the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              4. Prohibited Content and Conduct
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                You must not upload or distribute unlawful, infringing, harmful,
                or deceptive content through the Service.
              </li>
              <li>
                You must not use Bookmarkly to send spam, malware, or phishing
                links.
              </li>
              <li>
                You must respect third-party rights, including intellectual
                property, privacy, and confidentiality rights.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              5. Intellectual Property
            </h2>
            <p className="mt-3">
              The Service, including its software, branding, logos, and design,
              is owned by Bookmarkly or its licensors and protected by
              intellectual property laws. Except where expressly permitted, you
              may not reproduce, modify, distribute, or create derivative works
              from any part of the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              6. Third-Party Services and Links
            </h2>
            <p className="mt-3">
              Bookmarkly may integrate with or link to third-party websites,
              APIs, and tools. We do not control third-party services and are
              not responsible for their availability, content, or policies.
              Your use of those services is governed by their own terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              7. Suspension and Termination
            </h2>
            <p className="mt-3">
              We may suspend or terminate access to the Service at any time if
              we reasonably believe you violated these Terms, created legal or
              security risk, or harmed other users. You may stop using the
              Service at any time. On termination, your right to use the Service
              ceases immediately.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              8. Disclaimers
            </h2>
            <p className="mt-3">
              The Service is provided on an "as is" and "as available" basis.
              To the fullest extent permitted by law, Bookmarkly disclaims all
              warranties, express or implied, including fitness for a particular
              purpose, merchantability, and non-infringement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              9. Limitation of Liability
            </h2>
            <p className="mt-3">
              To the maximum extent permitted by law, Bookmarkly and its
              affiliates will not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of data,
              profits, or revenue, arising from or related to your use of the
              Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              10. Changes to the Terms
            </h2>
            <p className="mt-3">
              We may update these Terms from time to time. If we make material
              changes, we will update the "Last updated" date. Continued use of
              the Service after changes take effect constitutes acceptance of the
              revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              11. Governing Law
            </h2>
            <p className="mt-3">
              These Terms are governed by applicable laws in your jurisdiction
              and, where not prohibited, by the laws governing Bookmarkly's
              principal place of business, without regard to conflict-of-law
              rules.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              12. Contact Us
            </h2>
            <p className="mt-3">
              If you have any questions about these Terms, contact us at
              {" "}
              <a
                href="mailto:support@kizito.dev"
                className="text-primary underline"
              >
                support@kizito.dev
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
