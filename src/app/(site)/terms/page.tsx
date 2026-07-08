import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { LegalHero } from "@/components/LegalHero";
import { LegalBody, LegalSection } from "@/components/LegalBody";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms of use governing registration for and participation in AI Institute for Native Americans seminars.",
};

export default async function TermsPage() {
  const site = await getSiteContent();
  return (
    <>
      <LegalHero title="Terms of Use" updated="July 1, 2026" />
      <LegalBody>
        <p>
          Welcome to {site.name}. By accessing our website or registering for a
          seminar, you agree to these Terms of Use. Please read them carefully.
        </p>

        <LegalSection title="Use of Our Website">
          <p>
            You may use this website for lawful purposes only. You agree not to
            misuse the site, interfere with its operation, or attempt to access it in
            any unauthorized way.
          </p>
        </LegalSection>

        <LegalSection title="Seminar Registration & Payment">
          <ul>
            <li>Registration is confirmed once payment is successfully completed.</li>
            <li>The standard seminar fee is $1,595 per participant unless otherwise stated; group rates may apply.</li>
            <li>Payments are processed securely through PayPal.</li>
            <li>Seats are limited and offered on a first-come, first-served basis.</li>
          </ul>
        </LegalSection>

        <LegalSection title="Cancellations & Refunds">
          <p>
            If you are unable to attend, please contact us as early as possible. We
            will work with you to transfer your registration to a future date where
            possible. Refund eligibility depends on how far in advance you notify us;
            contact {site.email} for details.
          </p>
        </LegalSection>

        <LegalSection title="Contributions">
          <p>
            Optional contributions made during registration support the causes
            described on our Causes &amp; Giving page. 100% of contributions go
            directly to those causes. Contributions are voluntary and non-refundable.
          </p>
        </LegalSection>

        <LegalSection title="Intellectual Property">
          <p>
            All content, training materials, logos, and design on this site are the
            property of {site.name} and may not be reproduced or distributed without
            permission.
          </p>
        </LegalSection>

        <LegalSection title="Disclaimer">
          <p>
            Our seminars and materials are provided for educational purposes. While we
            strive for accuracy and practical value, we make no guarantees regarding
            specific outcomes or results.
          </p>
        </LegalSection>

        <LegalSection title="Contact Us">
          <p>
            Questions about these terms? Reach us at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> or {site.phone}.
          </p>
        </LegalSection>
      </LegalBody>
    </>
  );
}
