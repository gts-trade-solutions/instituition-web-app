import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { LegalHero } from "@/components/LegalHero";
import { LegalBody, LegalSection } from "@/components/LegalBody";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the AI Institute for Native Americans collects, uses, and protects your personal information.",
};

export default async function PrivacyPage() {
  const site = await getSiteContent();
  return (
    <>
      <LegalHero title="Privacy Policy" updated="July 1, 2026" />
      <LegalBody>
        <p>
          The {site.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          respects your privacy and is committed to protecting the personal
          information you share with us. This Privacy Policy explains what we
          collect, how we use it, and the choices you have.
        </p>

        <LegalSection title="Information We Collect">
          <p>When you register for a seminar, contact us, or subscribe to updates, we may collect:</p>
          <ul>
            <li>Your name, email address, phone number, and organization or Tribe.</li>
            <li>Your role and seminar preferences.</li>
            <li>Payment details, which are processed securely by our payment provider (PayPal). We do not store your full card number on our servers.</li>
            <li>Messages you send us through the contact form.</li>
          </ul>
        </LegalSection>

        <LegalSection title="How We Use Your Information">
          <ul>
            <li>To process your seminar registration and payment.</li>
            <li>To respond to your questions and requests.</li>
            <li>To send you confirmations, updates, and—if you opt in—news about upcoming seminars and resources.</li>
            <li>To improve our programs, services, and website.</li>
          </ul>
        </LegalSection>

        <LegalSection title="How We Share Information">
          <p>
            We do not sell your personal information. We share it only with trusted
            service providers who help us operate—such as our payment processor and
            email tools—and only as needed to deliver our services, or when required
            by law.
          </p>
        </LegalSection>

        <LegalSection title="Payments">
          <p>
            Payments are handled by PayPal, a PCI-compliant payment processor.
            Their handling of your payment data is governed by PayPal&rsquo;s own
            privacy policy.
          </p>
        </LegalSection>

        <LegalSection title="Data Security">
          <p>
            We use reasonable administrative and technical safeguards to protect your
            information. No method of transmission over the internet is completely
            secure, so we cannot guarantee absolute security.
          </p>
        </LegalSection>

        <LegalSection title="Your Choices">
          <ul>
            <li>You may unsubscribe from marketing emails at any time.</li>
            <li>You may request access to, correction of, or deletion of your personal information.</li>
          </ul>
        </LegalSection>

        <LegalSection title="Contact Us">
          <p>
            Questions about this policy? Reach us at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> or {site.phone}, or by
            mail at {site.address}, {site.cityStateZip}.
          </p>
        </LegalSection>
      </LegalBody>
    </>
  );
}
