// src/screens/privacy.jsx
import React from "react";
import "../privacy.css"; // path: src/styles/privacy.css

const EFFECTIVE_DATE = "January 18, 2026";
const CONTACT_EMAIL = "oscarkwanga@gmail.com";
const CONTACT_PHONE = "+254 798104979";

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

export const AlfaPolicy = () => {
  return (
    <div className="pp-shell">
      <header className="pp-hero">
        <div className="pp-hero-inner">
          <div>
            <h1 className="pp-h1">Privacy Policy — Alfahomes</h1>
            <p className="pp-sub">
              Effective date: <strong>{EFFECTIVE_DATE}</strong>
              <span className="pp-dot" /> Contact:{" "}
              <a className="pp-contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              {" "} / {CONTACT_PHONE}
            </p>
          </div>
        </div>
      </header>

      <main className="pp-main">
        <nav className="pp-toc">
          <a href="#scope">1. Scope</a>
          <a href="#info">2. Information we collect</a>
          <a href="#use">3. How we use your information</a>
          <a href="#share">4. Sharing and disclosure</a>
          <a href="#permissions">5. Permissions & device features</a>
          <a href="#cookies">6. Cookies & similar technologies</a>
          <a href="#retention">7. Data retention</a>
          <a href="#security">8. Security</a>
          <a href="#thirdparty">9. Third-party services & links</a>
          <a href="#transfers">10. International transfers</a>
          <a href="#children">11. Children & minors</a>
          <a href="#rights">12. Your rights and choices</a>
          <a href="#payments">13. Payments, refunds, cancellations</a>
          <a href="#hosts">14. Privacy for hosts</a>
          <a href="#changes">15. Changes to this policy</a>
          <a href="#contact">16. Contact us</a>
        </nav>

        <article className="pp-article">
          <Section id="scope" title="1. Scope">
            <p>
              This policy applies to personal information collected through the Alfahomes mobile application and any related services we operate (including our website and customer support). It does not apply to third-party sites or services you may access from within the App.
            </p>
          </Section>

          <Section id="info" title="2. Information we collect">
            <p>We collect information you provide directly and information collected automatically.</p>

            <h4>A. Information you provide</h4>
            <p>
              Account information: name, email address, phone number, password.
            </p>
            <p>
              Listing and property data: property descriptions, location/address, photos, pricing, availability, host preferences.
            </p>
            <p>
              Booking details: check-in/check-out dates, passenger counts, special requests, payment receipts.
            </p>
            <p>
              Communications: messages you send via the app contact forms, chat, email, or WhatsApp.
            </p>
            <p>
              Support data: information you provide to customer support (including photos and attachments).
            </p>
            <p>
              Other optional fields: any other information you submit (e.g., ID verification documents, business registration).
            </p>

            <h4>B. Information collected automatically</h4>
            <p>
              Device & usage data: device model, OS version, unique device identifiers, IP address, app usage, crash logs, performance data.
            </p>
            <p>
              Location data: if you allow it, we may collect coarse or precise device location to provide location-based features (search by proximity, pickup/drop-off).
            </p>
            <p>
              Push notification token: for sending notifications to your device.
            </p>
            <p>
              Analytics: anonymized or pseudonymized analytics about how you use the App (events, pages viewed).
            </p>

            <h4>C. Payment data</h4>
            <p>
              Payment method information: when you make payments, we collect transactional information such as payment method and payment confirmation. We do not store full card numbers. Local payment methods (e.g., M-Pesa) are processed by our payment provider; we store payment confirmation and receipt details necessary for bookings and refunds.
            </p>
          </Section>

          <Section id="use" title="3. How we use your information">
            <p>We use information to:</p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Provide, maintain, and improve Alfahomes features (search, listing display, booking flow).</li>
              <li>Process bookings, payments, cancellations, and refunds.</li>
              <li>Communicate with you (notifications, booking confirmations, support).</li>
              <li>Provide location-based services and map features.</li>
              <li>Enforce our Terms of Service and safety policies.</li>
              <li>Detect and prevent fraud, abuse, and other harmful activity.</li>
              <li>Comply with legal obligations (tax, records, law enforcement requests).</li>
              <li>For analytics and product development (to improve the App).</li>
            </ul>
            <p>
              We rely primarily on your consent and our legitimate interests (operation, security, and improvement) to process your data.
            </p>
          </Section>

          <Section id="share" title="4. Sharing and disclosure">
            <p>We may share information with:</p>
            <ul>
              <li>
                Service providers and processors: hosting providers, payment processors, analytics providers, messaging/notification services, email providers. These third parties are contractually required to protect your data.
              </li>
              <li>
                Hosts and guests: when you book a property we share necessary booking details with the relevant host (name, contact, booking dates).
              </li>
              <li>
                Legal obligations: if required by law, court order, or to respond to government requests or to protect legal rights.
              </li>
              <li>
                Business transfers: in connection with a merger, acquisition, or sale of assets (you will be notified if your personal data is transferred).
              </li>
            </ul>
            <p>We do not sell your personal information.</p>
          </Section>

          <Section id="permissions" title="5. Permissions & device features">
            <p>To support the App’s functionality we request certain device permissions:</p>
            <ul>
              <li>Camera & storage: to upload property photos or profile pictures.</li>
              <li>Location (GPS): to show nearby listings, pickup points, and local recommendations.</li>
              <li>Phone / call linking: to enable calls or direct contact with hosts (user-initiated).</li>
              <li>Push notifications: to send booking updates, promotions, and safety alerts.</li>
            </ul>
            <p>You can revoke permissions in your device settings. Revoking location or camera permissions may limit certain App features.</p>
          </Section>

          <Section id="cookies" title="6. Cookies & similar technologies">
            <p>If you use our website, we use cookies and similar technologies for functionality and analytics. You can control cookies through your browser settings.</p>
          </Section>

          <Section id="retention" title="7. Data retention">
            <p>We retain your personal data only as long as necessary for the purposes described in this policy and to comply with legal obligations. Typical retention examples:</p>
            <ul>
              <li>Account information: retained while your account exists, plus a reasonable period after account deletion for backups and legal compliance (commonly 1–3 years).</li>
              <li>Booking and transaction records: retained for tax and accounting purposes (commonly 6–7 years, depending on local laws).</li>
              <li>Logs and analytics: retained in aggregated or pseudonymized form; raw logs typically retained for a shorter operational period (30–540 days), depending on the type of data.</li>
            </ul>
            <p>If you request account deletion we will remove or anonymize personal data subject to legal and operational constraints (e.g., records necessary for refunds, fraud prevention, or legal claims).</p>
          </Section>

          <Section id="security" title="8. Security">
            <p>We use industry-standard technical and administrative measures to protect personal data (encryption in transit, access controls, secure hosting). However, no system is 100% secure. If a data breach affecting personal data occurs, we will follow applicable laws and notify affected users and authorities as required.</p>
          </Section>

          <Section id="thirdparty" title="9. Third-party services & links">
            <p>Alfahomes may integrate with third-party services (payment gateways, analytics, maps, Google sign-in). These services have their own privacy policies; we recommend you review them. The App may contain links to third-party sites — we are not responsible for those sites’ privacy practices.</p>
          </Section>

          <Section id="transfers" title="10. International transfers">
            <p>Data we collect may be stored or processed in servers located in Kenya or in other countries. When transferring personal data across borders we apply safeguards required by applicable law (standard contractual clauses, vendor agreements). By using the App you consent to such transfers when necessary to provide the service.</p>
          </Section>

          <Section id="children" title="11. Children & minors">
            <p>Alfahomes is not directed to children under 18. We do not knowingly collect personal information from minors. If you believe a child under 18 provided us data, contact us to request deletion.</p>
          </Section>

          <Section id="rights" title="12. Your rights and choices">
            <p>Depending on where you live, you may have rights regarding your personal data, including:</p>
            <ul>
              <li>Access: request a copy of personal data we hold about you.</li>
              <li>Correction: request correction of inaccurate data.</li>
              <li>Deletion: request deletion of your account and personal data (subject to retention for legal reasons).</li>
              <li>Portability: request a structured, machine-readable copy of certain data.</li>
              <li>Objection / Restriction: object to or request limitation of certain processing.</li>
            </ul>
            <p>To exercise these rights contact us at the details below. We may need to verify your identity before processing requests. We will respond in accordance with applicable law.</p>
          </Section>

          <Section id="payments" title="13. Payments, refunds, cancellations">
            <p>Payments are handled via third-party payment processors and local payment providers (for example M-Pesa). We store only payment confirmations and necessary billing details. Refunds and cancellations are governed by the booking terms shown at checkout.</p>
          </Section>

          <Section id="hosts" title="14. Privacy for hosts">
            <p>Hosts who list properties must provide accurate listing information and obtain necessary permissions to post photos. Hosts are responsible for their interactions with guests (communications, payments, cancellations) and for complying with local laws.</p>
          </Section>

          <Section id="changes" title="15. Changes to this policy">
            <p>We may update this Privacy Policy. Material changes will be posted in the App and on our website with the updated effective date. Continued use of the App after changes indicates acceptance of the new policy.</p>
          </Section>

          <Section id="contact" title="16. Contact us">
            <p>If you have questions, data requests, or privacy concerns, contact:</p>
            <p>
              Alfahomes Support<br />
              Email: <a className="pp-contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
              Phone/WhatsApp: {CONTACT_PHONE}
            </p>
          </Section>

          <div className="pp-summary">
            <strong>Short summary (for Google Play):</strong> Alfahomes collects account information, contact details, location, photos and property documents, and payment information (M-Pesa) to enable property search, listing, verification, and payments. Contact {CONTACT_EMAIL} for privacy requests.
          </div>
        </article>
      </main>
    </div>
  );
};

export default AlfaPolicy;
