import type { Metadata } from "next";
import Image from "next/image";
import { Tag, Check } from "lucide-react";
import { getPageContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { WovenBorder } from "@/components/WovenBorder";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the Accounting Institute for Native Americans — our mission to equip tribal professionals and communities with AI, financial, and career skills.",
};

const pillars = [
  {
    icon: "/images/about-why-we-exist.png",
    title: "Why We Exist",
    body: [
      "Tribal governments and organizations face increasing demands with limited resources. Many systems remain manual and inefficient.",
      "We strengthen internal capability to improve performance, accuracy, and sustainability.",
    ],
  },
  {
    icon: "/images/about-our-approach.png",
    title: "Our Approach",
    body: [
      "Our training is hands-on, practical, and designed for immediate use. Every concept connects directly to real tribal operations.",
      "We deliver tools—not theory.",
    ],
  },
  {
    icon: "/images/about-our-focus.png",
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
      <section className="pt-12 pb-10">
        <div className="grid w-full items-center gap-12 px-5 sm:px-10 xl:px-14 lg:grid-cols-2">
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
      <section className="pb-8">
        <div className="w-full px-5 sm:px-10 xl:px-14">
          <div className="grid gap-8 rounded-md bg-cream-100 p-8 md:grid-cols-3 md:gap-0 lg:p-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} variant="up">
                <div
                  className={`group flex h-full flex-col ${
                    i > 0 ? "md:border-l md:border-cream-300 md:pl-8" : ""
                  } ${i < pillars.length - 1 ? "md:pr-8" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={p.icon}
                      alt=""
                      width={128}
                      height={128}
                      className="icon-pop h-16 w-16 shrink-0 rounded-full object-contain"
                    />
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wide text-navy-600">
                        {p.title}
                      </h3>
                      <span className="mt-2 block h-0.5 w-12 bg-rust-500" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 text-base text-ink-soft">
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
      <section className="pb-10">
        <div className="w-full px-5 sm:px-10 xl:px-14">
          <Reveal>
            <div className="grid items-center gap-8 rounded-md bg-cream-100 p-8 lg:grid-cols-[auto_1.2fr_1fr] lg:gap-10 lg:p-10">
              <span className="grid h-28 w-28 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Tag className="h-14 w-14" />
              </span>
              <div>
                <p className="font-display text-2xl uppercase tracking-wide text-navy-600">
                  Program Value
                </p>
                <p className="mt-1 font-display text-5xl text-rust-500">
                  <CountUp value={1595} prefix="$" />
                  <span className="ml-3 align-middle font-display text-lg uppercase tracking-wide text-navy-600">
                    Per Participant
                  </span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Participants gain practical financial skills, increased efficiency,
                  and tools that improve day-to-day operations—along with a certificate
                  of completion.
                </p>
              </div>
              <ul className="space-y-3 lg:border-l lg:border-cream-300 lg:pl-10">
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="text-base text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Banner — full-bleed band with centered copy, like the demo */}
      <section className="bg-[#00262c] text-cream-50">
        <div className="relative flex flex-col items-center gap-5 px-5 py-10 sm:flex-row sm:gap-8 sm:px-10">
          <Image
            src="/images/cta-feather-v2.png"
            alt=""
            width={200}
            height={182}
            className="animate-float h-24 w-auto shrink-0 select-none sm:h-28"
          />
          <div className="flex-1 text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              {c.bannerTitle}
            </h2>
            <span className="mx-auto mt-3 block h-0.5 w-14 bg-rust-500" />
            <p className="mt-3 text-lg text-cream-100/90">{c.bannerSubtitle}</p>
          </div>
        </div>
      </section>
      <WovenBorder size="lg" />
    </>
  );
}
