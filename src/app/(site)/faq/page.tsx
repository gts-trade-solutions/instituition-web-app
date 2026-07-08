import Link from "next/link";
import type { Metadata } from "next";
import { HelpCircle, Plus, Mail } from "lucide-react";
import { getPageContent, getSiteContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { WovenBorder } from "@/components/WovenBorder";
import { FlourishTitle } from "@/components/Section";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description:
    "Answers to common questions about the AI Institute for Native Americans 2-day seminars — pricing, schedule, what is included, and more.",
};

const faqs = [
  {
    q: "What is included in the registration fee?",
    a: "Your registration covers the full 2-day hands-on training, all course materials, AI tool resources, breakfast, snacks and lunch both days, and a certificate of completion.",
  },
  {
    q: "How long is the seminar and what is the format?",
    a: "Each seminar is a 2-day intensive made up of 4 practical sessions. Every session is hands-on, so you leave with tools and workflows you can apply immediately in your daily work.",
  },
  {
    q: "How much does it cost, and are group rates available?",
    a: "Registration is $1,595 per participant. We also offer special group rates for Tribal governments, departments, and organizations — reach out and we'll put together a custom quote for your team.",
  },
  {
    q: "Who should attend?",
    a: "Finance and accounting staff, grants and program managers, enterprise and operations staff, workforce and education staff, and Tribal members or job seekers all get value from the training. No technical background is required.",
  },
  {
    q: "What are the optional contributions during registration?",
    a: "At registration you can add a contribution to any of our featured causes. 100% of every contribution goes directly to the cause you choose — it is entirely optional and separate from your seminar fee.",
  },
  {
    q: "How do I register, and how do I pay?",
    a: "Choose an upcoming date on the registration page, fill in your details, and check out through our secure, encrypted payment process. You'll receive a confirmation once your seat is reserved.",
  },
  {
    q: "Do I receive a certificate?",
    a: "Yes. Every participant who completes the 2-day training receives a certificate of completion.",
  },
  {
    q: "What if a seminar is full?",
    a: "New seminars are added every two weeks. If your preferred date shows a waitlist, join it or contact us and we'll help you find the next available date.",
  },
];

export default async function FaqPage() {
  const site = await getSiteContent();
  const contact = await getPageContent("contact");

  return (
    <>
      {/* Hero */}
      <section>
        <div className="relative flex min-h-[240px] items-center overflow-hidden bg-[#002E33] text-cream-50 sm:min-h-0 sm:aspect-[1536/360]">
          <div className="container-page relative w-full py-14">
            <div className="flex items-center gap-4">
              <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-cream-50/60 sm:grid">
                <HelpCircle className="h-8 w-8" />
              </span>
              <div>
                <h1 className="font-display text-4xl font-bold uppercase leading-[1.02] sm:text-5xl lg:text-6xl">
                  Help &amp; FAQ
                </h1>
                <p className="mt-3 max-w-xl text-lg text-cream-100/85">
                  Answers to the questions we hear most about our seminars,
                  registration, and giving.
                </p>
              </div>
            </div>
          </div>
        </div>
        <WovenBorder />
      </section>

      {/* Questions */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <FlourishTitle>Frequently Asked Questions</FlourishTitle>
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04} variant="up">
                <details className="group rounded-lg border border-cream-300 bg-cream-50 shadow-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                    <span className="font-display text-base font-bold uppercase tracking-wide text-navy-600">
                      {f.q}
                    </span>
                    <Plus className="h-5 w-5 shrink-0 text-teal-600 transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="border-t border-cream-200 px-5 py-4 text-ink-soft">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <div className="flex flex-col items-center gap-6 rounded-lg bg-[#002E33] px-8 py-10 text-center text-cream-50 lg:flex-row lg:justify-between lg:text-left">
            <div className="flex items-center gap-5">
              <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-cream-50/60 sm:grid">
                <Mail className="h-8 w-8" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                  Still Have Questions?
                </h2>
                <p className="mt-2 text-cream-100/85">
                  {contact.getInTouchBody}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-outline-light">
                Contact Us
              </Link>
              <Link
                href={`mailto:${site.email}`}
                className="btn-accent"
              >
                Email Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
