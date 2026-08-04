import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getPageContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { WovenBorder } from "@/components/WovenBorder";

export const metadata: Metadata = {
  title: "Why It Matters",
  description:
    "Why AI and financial skills matter for Native American communities, sovereignty, and economic opportunity.",
};

const empowers = [
  { icon: "/images/why-govern-ourselves.png", title: "Govern Ourselves", body: "Make decisions that reflect our values, traditions, and the needs of our people." },
  { icon: "/images/why-protect-lands.png", title: "Protect Our Lands and Resources", body: "Care for the lands, waters, and natural resources entrusted to us for future generations." },
  { icon: "/images/why-strengthen-communities.png", title: "Strengthen Our Communities", body: "Build healthy, safe, and vibrant communities through programs and services we control." },
  { icon: "/images/why-economic-independence.png", title: "Build Economic Independence", body: "Create jobs, support tribal enterprises, and strengthen our financial future." },
  { icon: "/images/why-future-generations.png", title: "Invest in Our Future Generations", body: "Provide education, training, and opportunities so our youth can lead with pride and purpose." },
];

const trainingPoints = [
  "Improve financial management and accountability",
  "Increase efficiency and reduce administrative burdens",
  "Write stronger grants and secure more funding",
  "Build a skilled workforce equipped for today and tomorrow",
  "Strengthen tribal enterprises and economic development",
];

export default async function WhyPage() {
  const c = await getPageContent("why");
  return (
    <>
      {/* Hero — split: text on cream (left), star-quilt photo (right) */}
      <section>
        <WovenBorder />
        <div className="relative overflow-hidden bg-[#FBF3EA]">
          {/* Desktop: photo bleeds in from the right, fading into the cream */}
          <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
            <Image
              src="/images/why-hero-v2.jpg"
              alt="Native woman in star quilt overlooking a valley at sunrise"
              fill
              priority
              sizes="52vw"
              className="object-cover"
              style={{ objectPosition: "50% 0%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #FBF3EA 0%, rgba(251,243,234,0.35) 16%, rgba(251,243,234,0) 42%)",
              }}
            />
          </div>
          <div className="container-page relative py-10 lg:flex lg:min-h-[440px] lg:flex-col lg:justify-center lg:py-16">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl font-bold uppercase leading-[1.05] text-navy-600 sm:text-6xl">
                {c.title} <span className="text-rust-500">{c.titleAccent}</span>{" "}
                {c.titleEnd}
              </h1>
              <span className="mt-5 block h-1 w-16 bg-rust-500" />
              <p className="mt-5 max-w-lg text-xl leading-relaxed text-ink-soft">
                {c.subtitle}
              </p>
              <p className="mt-4 font-display text-xl font-semibold italic text-teal-600">
                {c.emphasis}
              </p>
            </div>
          </div>
          {/* Mobile: photo below the text */}
          <div className="relative h-56 w-full sm:h-72 lg:hidden">
            <Image
              src="/images/why-hero-v2.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "50% 0%" }}
            />
          </div>
        </div>
      </section>

      {/* Empowers */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <h2 className="text-center font-display text-2xl font-bold uppercase tracking-wide text-teal-600 sm:text-3xl">
            Sovereignty Empowers Our Nations To:
          </h2>
          <div className="mt-12 grid gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-0">
            {empowers.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.06} variant="blur">
                <div className={`group flex h-full cursor-default flex-col items-center px-5 text-center ${i > 0 ? "lg:border-l lg:border-cream-300" : ""}`}>
                  <Image
                    src={e.icon}
                    alt=""
                    width={128}
                    height={128}
                    className="icon-pop h-16 w-16 rounded-full object-contain shadow-card"
                  />
                  <h3 className="mt-4 font-display text-base font-bold uppercase leading-tight tracking-wide text-navy-600">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Training band */}
      <section className="pb-10 sm:pb-12">
        <div className="container-page">
          <div className="overflow-hidden rounded-lg bg-[#002E33] text-cream-50">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="img-zoom relative min-h-[260px]">
                <Image
                  src="/images/why-training-v2.jpg"
                  alt="Three tribal professionals collaborating around a laptop"
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 lg:py-12 lg:pr-12">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                  How This Training Supports Sovereignty
                </h2>
                <p className="mt-3 text-cream-100/80">
                  Strong systems are the backbone of strong Nations. Our AI training
                  helps Tribal governments and organizations:
                </p>
                <ul className="mt-5 space-y-2.5">
                  {trainingPoints.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-cream-100/90">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" /> {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-display font-semibold uppercase tracking-wide text-gold-400">
                  Stronger skills. Stronger systems. Stronger sovereignty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote + together */}
      <section className="pb-10 sm:pb-12">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full gap-5 rounded-lg border border-cream-300 bg-cream-50 p-8 shadow-card">
              <Image
                src="/images/cta-feather-v2.png"
                alt=""
                width={90}
                height={82}
                className="h-24 w-auto shrink-0 select-none"
              />
              <div>
                <span className="font-display text-4xl font-bold leading-none text-rust-500">
                  &ldquo;
                </span>
                <p className="font-display text-xl font-semibold leading-snug text-navy-600">
                  Sovereignty is not a gift. It is a right. Our Nations have always
                  been here, and we will continue to build a future that honors our
                  ancestors and uplifts our people.
                </p>
                <p className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-rust-500">
                  — For Our Nations. For Our Future.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full gap-5 rounded-lg border border-cream-300 bg-cream-50 p-8 shadow-card">
              <Image
                src="/images/logo-emblem-v2.png"
                alt=""
                width={88}
                height={88}
                className="hidden h-20 w-20 shrink-0 select-none sm:block"
              />
              <div className="flex flex-col justify-center">
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-teal-600">
                  Together, We Build Stronger Nations
                </h3>
                <p className="mt-3 text-ink-soft">
                  When we invest in our people, our systems, and our sovereignty, we
                  create a future where our Nations can thrive—today and for generations
                  to come.
                </p>
                <Link href="/register" className="btn-accent mt-6 self-start">
                  Register For A Seminar
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#002E33] text-cream-50">
        <div className="container-page flex flex-col items-center gap-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex items-center gap-5">
            <Image
              src="/images/why-cta-together.png"
              alt=""
              width={128}
              height={128}
              className="hidden h-16 w-16 shrink-0 rounded-full object-cover sm:block"
            />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide sm:text-2xl">
              {c.bannerTitle}
              <span className="mt-1 block text-sm font-normal normal-case tracking-normal text-cream-100/80">
                {c.bannerSubtitle}
              </span>
            </h2>
          </div>
          <Link href="/register" className="btn-gold shrink-0">
            Register Now
          </Link>
        </div>
      </section>
    </>
  );
}
