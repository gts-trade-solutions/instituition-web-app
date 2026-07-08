import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Users } from "lucide-react";
import { getPageContent, getSiteContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { WovenBorder } from "@/components/WovenBorder";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about seminars, group pricing, or partnerships? Get in touch with the AI Institute for Native Americans.",
};

export default async function ContactPage() {
  const c = await getPageContent("contact");
  const site = await getSiteContent();

  const methods = [
    { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone}` },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Address", value: `${site.address}\n${site.cityStateZip}` },
    { icon: Clock, label: "Office Hours", value: c.officeHours },
  ];

  return (
    <>
      {/* Hero — exact demo banner (title + subtitle baked into the image) */}
      <section>
        <div className="relative aspect-[2048/520] w-full overflow-hidden bg-navy-800">
          <Image
            src="/images/contact-hero-banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <WovenBorder size="lg" />
        <h1 className="sr-only">
          {c.title}. {c.subtitle}
        </h1>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid items-stretch gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Get in touch */}
          <Reveal className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Mail className="h-6 w-6" />
              </span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                Get In Touch
              </h2>
            </div>
            <p className="mt-4 text-ink-soft">{c.getInTouchBody}</p>

            <div className="mt-8 flex flex-1 flex-col justify-between gap-6">
              {methods.map((m) => {
                const body = (
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                      <m.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold uppercase tracking-wide text-navy-600">
                        {m.label}
                      </p>
                      <p className="whitespace-pre-line text-ink-soft">{m.value}</p>
                    </div>
                  </div>
                );
                return m.href ? (
                  <a key={m.label} href={m.href} className="block transition-opacity hover:opacity-80">
                    {body}
                  </a>
                ) : (
                  <div key={m.label}>{body}</div>
                );
              })}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Users className="h-6 w-6" />
              </span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                Send Us A Message
              </h2>
            </div>
            <div className="mt-5">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Group training band */}
      <section className="relative overflow-hidden bg-[#002E33] text-cream-50">
        <div className="grid items-stretch lg:grid-cols-2">
          {/* Text (left) */}
          <div className="flex items-center">
            <div className="container-page py-12 lg:py-16" style={{ marginRight: 0 }}>
              <div className="flex max-w-lg items-start gap-5">
                <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-cream-50/60 sm:grid">
                  <Users className="h-8 w-8" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                    Interested In Group Training?
                  </h2>
                  <p className="mt-3 text-cream-100/85">
                    We offer special group rates for Tribal governments, departments, and
                    organizations. Contact us to get a custom quote for your team.
                  </p>
                  <Link
                    href={`mailto:${site.email}?subject=Group%20Training`}
                    className="btn-outline-light mt-6"
                  >
                    Request Group Information
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Photo (right) — taller so the full faces show, framed toward the heads */}
          <div className="relative min-h-[300px]">
            <Image
              src="/images/contact-group-v2.jpg"
              alt="Tribal professionals collaborating"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: "50% 22%" }}
            />
          </div>
        </div>
      </section>

      {/* Thank you */}
      <section className="relative overflow-hidden bg-[#F5ECE1]">
        {/* Eagle + mountain silhouette, bottom-right (transparent, blends into the band) */}
        <Image
          src="/images/thanks-scenery-v3.png"
          alt=""
          width={1212}
          height={318}
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 hidden h-28 w-auto select-none lg:block"
        />
        <div className="container-page relative flex flex-col items-center gap-5 py-16 text-center sm:flex-row sm:text-left">
          <Image
            src="/images/thanks-medallion.png"
            alt=""
            width={280}
            height={266}
            className="h-20 w-20 shrink-0 select-none"
          />
          <div>
            <p className="max-w-xl text-ink-soft">
              Together, we build stronger Nations through knowledge, opportunity, and
              respect for our traditions and future.
            </p>
            <p className="mt-2 font-display text-lg font-bold uppercase tracking-wide text-teal-600">
              Thank You For Supporting Native Communities.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
