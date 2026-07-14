// src/screens/privacy.jsx
import React from "react";
import "../privacy.css"; // path: src/styles/privacy.css

const EFFECTIVE_DATE = "December 24, 2025";
const CONTACT_EMAIL = "oscarkwanga@gmail.com";

const Section = ({ id, title, children }) => (
  <section id={id} className="pp-section">
    <div className="pp-static-header">
      <span className="pp-title">{title}</span>
    </div>
    <div className="pp-body show" role="region">
      {children}
    </div>
  </section>
);

export const PrivacyPolicy = () => {
  return (
    <div className="pp-shell">
      <header className="pp-hero">
        <div className="pp-hero-inner">
          <div>
            <h1 className="pp-h1">Dwelify — Privacy Policy</h1>
            <p className="pp-sub">
              Effective date: <strong>{EFFECTIVE_DATE}</strong>
              <span className="pp-dot" /> Contact:{" "}
              <a className="pp-contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </header>

      <main className="pp-main">
        <nav className="pp-toc">
          <a href="#intro">Intro</a>
          <a href="#info">What we collect</a>
          <a href="#use">How we use it</a>
          <a href="#share">Sharing</a>
          <a href="#security">Security</a>
          <a href="#retention">Retention</a>
          <a href="#rights">Your rights</a>
          <a href="#children">Children</a>
          <a href="#transfers">Transfers</a>
          <a href="#delete">Delete</a>
          <a href="#changes">Changes</a>
          <a href="#contact">Contact</a>
        </nav>

        <article className="pp-article">
          <Section id="intro" title="1. Introduction">
            <p>
              Dwelify (“we”, “us”, “our”) provides a platform to search and list
              properties. This Privacy Policy explains what information we
              collect, how we use it, who we share it with, and the choices you
              have. By using Dwelify you agree to the collection and use
              described here.
            </p>
          </Section>

          <Section id="info" title="2. Information we collect">
            <p>
              We collect the following categories of information to run the
              service, verify listings, accept payments, and keep users safe:
            </p>
            <ul>
              <li>
                <strong>Account & identity:</strong> name, username, profile
                photo, email, phone.
              </li>
              <li>
                <strong>Authentication:</strong> hashed passwords, login
                timestamps, device info.
              </li>
              <li>
                <strong>Location:</strong> precise or approximate location
                (only with permission) for map features.
              </li>
              <li>
                <strong>Property listing data:</strong> property details, photos,
                and landlord verification documents (ID, utility bills, title
                deeds, surveys and survey numbers).
              </li>
              <li>
                <strong>Payments & billing:</strong> M-Pesa transaction IDs,
                amounts, timestamps and necessary billing info.
              </li>
              <li>
                <strong>Usage & diagnostics:</strong> app logs, crash reports,
                IP addresses, device model, OS version, anonymized analytics.
              </li>
              <li>
                <strong>Communications:</strong> messages between users (if
                enabled), support requests, transactional emails.
              </li>
            </ul>
          </Section>

          <Section id="use" title="3. How we use your information">
            <ul>
              <li>Create and manage your account and authenticate users.</li>
              <li>Provide property search, listing and map services.</li>
              <li>
                Verify landlord ownership and property authenticity using
                uploaded documents.
              </li>
              <li>Process payments (M-Pesa) and issue receipts.</li>
              <li>Communicate about accounts, support, and transactions.</li>
              <li>Prevent fraud, enforce Terms of Service and protect the community.</li>
              <li>Improve and personalize the service through analytics and diagnostics.</li>
              <li>Comply with legal obligations and respond to lawful requests by authorities.</li>
            </ul>
          </Section>

          <Section id="share" title="4. Sharing & disclosure">
            <p>We do not sell your personal data. We may share information with:</p>
            <ul>
              <li>
                <strong>Payment processors:</strong> (M-Pesa or related providers)
                to handle payments and refunds.
              </li>
              <li>
                <strong>Cloud & hosting providers:</strong> to store data, images
                and documents.
              </li>
              <li>
                <strong>Third-party service providers:</strong> analytics, email,
                crash reporting — under contract and limited access.
              </li>
              <li>
                <strong>Law enforcement or regulators:</strong> when required by
                law or to respond to legal process.
              </li>
              <li>
                <strong>Business transfers:</strong> if Dwelify is sold or
                merges, data may be transferred under confidentiality.
              </li>
            </ul>
            <p>
              Verification documents (IDs, deeds etc.) are only shared with
              trusted parties when strictly necessary for verification, fraud
              prevention or legal compliance.
            </p>
          </Section>

          <Section id="security" title="5. Security">
            <p>
              We implement administrative and technical safeguards such as HTTPS
              (TLS), secure access controls, and hashed passwords. Despite our
              efforts, no system is 100% secure. In the unlikely event of a
              breach we will notify affected users and regulators as required by
              law.
            </p>
          </Section>

          <Section id="retention" title="6. Data retention">
            <p>We retain personal data only as long as necessary:</p>
            <ul>
              <li>
                <strong>Account data:</strong> while the account is active and
                for a reasonable period after deactivation for backups, fraud
                prevention or legal claims.
              </li>
              <li>
                <strong>Payment records:</strong> typically up to 7 years for
                financial recordkeeping and compliance.
              </li>
              <li>
                <strong>Verification documents:</strong> retained as needed for
                verification/compliance (generally up to 7 years unless you
                request deletion and no legal reason to retain exists).
              </li>
            </ul>
            <p>
              If you request deletion we will erase or anonymize data unless
              required to retain it by law.
            </p>
          </Section>

          <Section id="rights" title="7. Your rights & choices">
            <p>Subject to local law, you may have rights including:</p>
            <ul>
              <li>Access — request a copy of your data.</li>
              <li>Rectification — correct inaccurate or incomplete data.</li>
              <li>Deletion — request erasure (subject to legal exceptions).</li>
              <li>Portability — request a machine-readable copy of your data.</li>
              <li>Restriction/objection — in certain cases, object to or restrict processing.</li>
            </ul>
            <p>
              To exercise these rights contact us at{" "}
              <a className="pp-contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              . We may verify your identity before fulfilling requests.
            </p>
          </Section>

          <Section id="children" title="8. Children">
            <p>
              Dwelify is not intended for children under 13 (or the minimum age
              in your country). We do not knowingly collect personal data from
              children. If you believe a child submitted personal data, contact
              us to request deletion.
            </p>
          </Section>

          <Section id="transfers" title="9. International transfers">
            <p>
              Your data may be stored or processed outside your country. When we
              transfer data internationally we use appropriate protections
              (contracts, standard clauses or other lawful mechanisms).
            </p>
          </Section>

          <Section id="delete" title="10. How to delete or disable your account">
            <p>
              You can request account deletion in-app (if available) or by
              emailing <strong>{CONTACT_EMAIL}</strong> with subject “Delete my
              Dwelify account” and your registered email/phone. We will confirm
              when deletion completes, subject to legal/accounting retention
              requirements.
            </p>
          </Section>

          <Section id="changes" title="11. Changes to this policy">
            <p>
              We may update this policy occasionally. Material changes will
              include a revised effective date and we will notify users where
              appropriate.
            </p>
          </Section>

          <Section id="contact" title="12. Contact">
            <p>
              If you have questions or want to exercise your rights, email:
              <strong> {CONTACT_EMAIL}</strong>.
            </p>
            <p className="pp-note">
              Back to <a href="/signin">Sign in</a>.
            </p>
          </Section>

          <div className="pp-summary">
            <strong>Short summary (for Google Play):</strong> Dwelify collects
            account information, contact details, location, photos and property
            documents, and payment information (M-Pesa) to enable property
            search, listing, verification, and payments. Contact{" "}
            {CONTACT_EMAIL} for privacy requests.
          </div>
        </article>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
