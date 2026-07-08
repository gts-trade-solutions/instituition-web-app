import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { UserRound, Bird, Droplet, Check, HandHeart, Feather } from "lucide-react";
import { getPageContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { FlourishTitle } from "@/components/Section";
import { WovenBorder } from "@/components/WovenBorder";

export const metadata: Metadata = {
  title: "Causes & Giving",
  description:
    "Support Native American women, water, and sovereignty. 100% of contributions made during seminar registration go directly to these causes.",
};

const causes = [
  {
    icon: UserRound,
    title: "Protecting Native American Women",
    body: "Supporting programs that promote safety, wellness, and empowerment for Native women and families.",
    points: [
      "Increase access to safety resources",
      "Support healing and wellness programs",
      "Strengthen community outreach",
      "Promote education and leadership",
    ],
    image: "/images/cause-women-v2.jpg",
    pos: "50% 22%",
    color: "text-plum-500",
    iconBg: "bg-plum-500",
    btn: "bg-plum-500 hover:bg-plum-600",
    tag: "Protecting+Native+American+Women",
  },
  {
    icon: Bird,
    title: "Supporting Native American Sovereignty",
    body: "Strengthening Tribal self-determination, governance, and economic independence so our Nations can thrive.",
    points: [
      "Advocate for Treaty and Tribal rights",
      "Support Tribal governance capacity",
      "Invest in education and leadership",
      "Build strong, sustainable communities",
    ],
    image: "/images/cause-sovereignty-v2.jpg",
    pos: "50% 50%",
    color: "text-teal-600",
    iconBg: "bg-teal-600",
    btn: "bg-teal-700 hover:bg-teal-800",
    tag: "Supporting+Native+American+Sovereignty",
  },
  {
    icon: Droplet,
    title: "Protecting Our Water — The Lifeblood of Mother Earth",
    body: "Safeguarding clean water for our people, our lands, and future generations.",
    points: [
      "Protect rivers, lakes, and aquifers",
      "Support water quality and access",
      "Promote sustainable practices",
      "Honor and care for our sacred waters",
    ],
    image: "/images/cause-water-v2.jpg",
    pos: "50% 50%",
    color: "text-ocean-500",
    iconBg: "bg-ocean-500",
    btn: "bg-ocean-500 hover:bg-ocean-600",
    tag: "Protecting+Our+Water",
  },
];

const together = [
  "Strengthen our Nations",
  "Protect our rights",
  "Uplift our communities",
  "Preserve our culture",
  "Honor Mother Earth",
];

export default async function CausesPage() {
  const c = await getPageContent("causes");
  return (
    <>
      {/* Hero — exact demo banner (title + subtitle + intro baked into the image) */}
      <section>
        <WovenBorder />
        <div className="relative aspect-[2032/560] w-full overflow-hidden bg-navy-800">
          <Image
            src="/images/causes-hero-banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <h1 className="sr-only">
          {c.title}. {c.subtitle}. {c.intro}
        </h1>
      </section>

      {/* Three causes */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <FlourishTitle>Three Ways To Make A Difference</FlourishTitle>
          <p className="mx-auto mt-5 max-w-2xl text-center text-ink-soft">
            <span className="font-semibold text-navy-600">{c.contributionNote}</span>
            <br />
            Your generosity creates a lasting impact for our Nations today and for
            generations to come.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {causes.map((cause, i) => (
              <Reveal key={cause.title} delay={i * 0.08} variant="up">
                <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-cream-300 bg-cream-50 shadow-card transition-shadow duration-300 hover:shadow-soft">
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start gap-4">
                      <span className={`icon-pop grid h-14 w-14 shrink-0 place-items-center rounded-full text-cream-50 ${cause.iconBg}`}>
                        <cause.icon className="h-7 w-7" />
                      </span>
                      <div>
                        <h3 className={`font-display text-lg font-bold uppercase leading-tight tracking-wide ${cause.color}`}>
                          {cause.title}
                        </h3>
                        <span className={`mt-2 block h-0.5 w-16 ${cause.iconBg}`} />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-ink-soft">{cause.body}</p>
                    <ul className="mt-4 space-y-2">
                      {cause.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-ink">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${cause.color}`} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="img-zoom relative aspect-[900/441]">
                    <Image
                      src={cause.image}
                      alt={cause.title}
                      fill
                      sizes="(max-width:1024px) 100vw, 33vw"
                      className="object-cover"
                      style={{ objectPosition: cause.pos ?? "50% 50%" }}
                    />
                  </div>
                  <Link
                    href={`/register?cause=${encodeURIComponent(cause.tag.replace(/\+/g, " "))}`}
                    className={`block py-3 text-center font-display text-sm font-semibold uppercase tracking-wide text-cream-50 transition-colors ${cause.btn}`}
                  >
                    Learn More
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution matters */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-10 rounded-lg border border-cream-300 bg-cream-50 p-8 shadow-card lg:grid-cols-2 lg:gap-12 lg:p-10">
          <Reveal>
            <div className="flex gap-5">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-rust-500 text-cream-50">
                <Feather className="h-8 w-8" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-rust-500">
                  Your Contribution Matters
                </h3>
                <p className="mt-3 text-ink-soft">
                  During seminar registration, you can add a contribution to any of the
                  causes above. Every dollar you give goes directly to the cause you
                  choose.
                </p>
                <p className="mt-3 font-display font-bold uppercase tracking-wide text-teal-600">
                  100% of contributions go directly to these causes.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:border-l lg:border-cream-300 lg:pl-12">
            <div className="flex gap-5">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                <HandHeart className="h-8 w-8" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-teal-600">
                  Together, We Can:
                </h3>
                <ul className="mt-3 space-y-2">
                  {together.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-ink">
                      <Check className="h-4 w-4 shrink-0 text-rust-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col items-center gap-6 overflow-hidden rounded-lg bg-[#002E33] px-8 py-10 text-cream-50 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-5 text-center lg:text-left">
              <Image
                src="/images/cta-feather-v2.png"
                alt=""
                width={140}
                height={127}
                className="animate-float hidden h-20 w-auto shrink-0 select-none sm:block"
              />
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                  {c.bannerTitle}
                </h2>
                <p className="mt-2 text-cream-100/85">{c.bannerSubtitle}</p>
              </div>
            </div>
            <Link href="/register" className="btn-accent shrink-0">
              Register For A Seminar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
