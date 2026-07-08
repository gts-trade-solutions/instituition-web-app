import type { Metadata } from "next";
import Image from "next/image";
import { Users, Target, Landmark, Tag, CheckCircle2 } from "lucide-react";
import { getPageContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { WovenBorder } from "@/components/WovenBorder";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the AI Institute for Native Americans — our mission to equip tribal professionals and communities with AI, financial, and career skills.",
};

const pillars = [
  {
    icon: Users,
    title: "Why We Exist",
    body: [
      "Tribal governments and organizations face increasing demands with limited resources. Many systems remain manual and inefficient.",
      "We strengthen internal capability to improve performance, accuracy, and sustainability.",
    ],
  },
  {
    icon: Target,
    title: "Our Approach",
    body: [
      "Our training is hands-on, practical, and designed for immediate use. Every concept connects directly to real tribal operations.",
      "We deliver tools—not theory.",
    ],
  },
  {
    icon: Landmark,
    title: "Our Focus",
    body: [
      "We serve tribal governments, staff, enterprises, and workforce programs.",
      "Our work strengthens the people responsible for delivering results.",
    ],
  },
];

const includes = [
  "Includes training materials",
  "Breakfast, snacks & lunch both days",
  "AI tool resources",
  "Certificate of completion",
];

export default async function AboutPage() {
  const c = await getPageContent("about");
  return (
    <>
      {/* Hero — exact demo banner (title + subtitle baked into the image) */}
      <section>
        <div className="relative aspect-[2048/560] w-full overflow-hidden bg-navy-800">
          <Image
            src="/images/about-hero-banner.jpg"
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

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-navy-600 sm:text-4xl">
              {c.missionTitle}
            </h2>
            <span className="mt-4 block h-0.5 w-12 bg-rust-500" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>{c.missionBody1}</p>
              <p>{c.missionBody2}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="img-zoom relative aspect-[4/3] rounded-lg shadow-soft">
              <Image
                src="/images/about-dreamcatcher.jpg"
                alt="Dreamcatcher and feather on wood"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-8 rounded-lg border border-cream-300 bg-cream-50 p-8 shadow-card md:grid-cols-3 md:gap-0 lg:p-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} variant="up">
                <div
                  className={`group flex h-full flex-col ${
                    i > 0 ? "md:border-l md:border-cream-300 md:pl-8" : ""
                  } ${i < pillars.length - 1 ? "md:pr-8" : ""}`}
                >
                  <div className="flex items-center gap-4">
                  <span className={`icon-pop grid h-16 w-16 shrink-0 place-items-center rounded-full text-cream-50 ${
                    i === 1 ? "bg-rust-500" : "bg-teal-600"
                  }`}>
                    <p.icon className="h-8 w-8" />
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                    {p.title}
                  </h3>
                </div>
                <span className="mt-4 h-0.5 w-14 bg-rust-500" />
                <div className="mt-4 space-y-3 text-lg text-ink-soft">
                  {p.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Program value */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <Reveal>
            <div className="grid items-center gap-8 rounded-lg border border-cream-300 bg-cream-50 p-8 shadow-card lg:grid-cols-[auto_1fr_1fr] lg:gap-12 lg:p-12">
              <span className="grid h-28 w-28 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Tag className="h-14 w-14" />
              </span>
              <div>
                <p className="font-display text-base font-bold uppercase tracking-wide text-navy-600">
                  Program Value
                </p>
                <p className="font-display text-6xl font-bold text-rust-500">
                  <CountUp value={1595} prefix="$" />
                  <span className="ml-2 align-middle font-display text-lg font-semibold uppercase tracking-wide text-navy-600">
                    Per Participant
                  </span>
                </p>
                <p className="mt-2 text-base text-ink-soft">
                  Participants gain practical financial skills, increased efficiency,
                  and tools that improve day-to-day operations—along with a certificate
                  of completion.
                </p>
              </div>
              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-teal-600" />
                    <span className="text-lg text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Banner */}
      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <div className="flex flex-col items-center gap-5 overflow-hidden rounded-lg bg-[#002E33] px-8 py-10 text-cream-50 sm:flex-row sm:gap-8 sm:py-12">
            <Image
              src="/images/cta-feather-v2.png"
              alt=""
              width={200}
              height={182}
              className="animate-float h-24 w-auto shrink-0 select-none"
            />
            <div className="text-center sm:text-left">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                {c.bannerTitle}
              </h2>
              <span className="mx-auto mt-3 block h-0.5 w-14 bg-rust-500 sm:mx-0" />
              <p className="mt-3 text-cream-100/90">{c.bannerSubtitle}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
