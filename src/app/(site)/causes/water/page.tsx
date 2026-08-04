import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Droplet, Check, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { FlourishTitle } from "@/components/Section";
import { WovenBorder } from "@/components/WovenBorder";

export const metadata: Metadata = {
  title: "Protecting Water",
  description:
    "Water is sacred and sustains all life. Learn why protecting rivers, lakes, and aquifers matters for Tribal Nations — and how your contribution helps.",
};

const pillars = [
  {
    icon: "/images/water-icon-importance.png",
    title: "The Importance",
    tone: "text-teal-600",
    bg: "bg-teal-600",
    lead: "Water is life. It is at the heart of our culture, spirituality, and way of life.",
    marker: "check" as const,
    points: [
      "Sustains our communities and traditions",
      "Supports our health and well-being",
      "Essential for food, agriculture, and economic development",
      "Protects the lands, fish, wildlife, and sacred places",
      "A gift from the Creator that must be respected and safeguarded",
    ],
  },
  {
    icon: "/images/water-icon-peril.png",
    title: "The Current Peril",
    tone: "text-rust-600",
    bg: "bg-rust-600",
    lead: "Our waters face serious threats that endanger our future.",
    marker: "cross" as const,
    points: [
      "Industrial pollution and toxic runoff",
      "Oil spills, mining, and hazardous waste",
      "Overuse and diversion of water from our rivers and aquifers",
      "Climate change causing droughts, floods, and degraded water quality",
      "Lack of enforcement of environmental protections on and near Tribal lands",
    ],
  },
  {
    icon: "/images/water-icon-help.png",
    title: "The Need For Help",
    tone: "text-ocean-500",
    bg: "bg-ocean-500",
    lead: "We must act now to protect our water and secure a healthy tomorrow.",
    marker: "check" as const,
    points: [
      "Support clean water monitoring and restoration projects",
      "Strengthen Tribal water rights and sovereignty",
      "Educate and empower communities about water protection",
      "Advocate for strong environmental policies and enforcement",
      "Invest in sustainable solutions that protect water for future generations",
    ],
  },
];

const support = [
  {
    icon: "/images/support-monitoring.png",
    title: "Clean Water Monitoring",
    body: "Testing and monitoring rivers, lakes, and groundwater.",
  },
  {
    icon: "/images/support-restoration.png",
    title: "Restoration Projects",
    body: "Restoring habitats and removing pollution from waterways.",
  },
  {
    icon: "/images/support-rights.png",
    title: "Water Rights Advocacy",
    body: "Defending Tribal water rights and protecting our sovereignty.",
  },
  {
    icon: "/images/support-education.png",
    title: "Education & Awareness",
    body: "Teaching future generations the value of water and how to protect it.",
  },
  {
    icon: "/images/support-partnerships.png",
    title: "Community Partnerships",
    body: "Working together to build strong, sustainable solutions.",
  },
];

const CAUSE = "Protecting Our Water";

export default function ProtectingWaterPage() {
  return (
    <>
      {/* Light hero: the headline sits on cream at the left and the photograph
          bleeds off the right. White type over the photo was unreadable — the
          river scene is bright, with no dark area to sit text on. */}
      <section>
        <WovenBorder />
        <div className="relative isolate overflow-hidden bg-cream-50">
          <div className="absolute inset-y-0 right-0 -z-10 w-full sm:w-[70%] lg:w-[64%]">
            <Image
              // Full-resolution river photo (1874x839). The cause-*-v2 files
              // are 900px card assets and visibly softened when stretched.
              src="/images/cause-water-hero.jpg"
              alt="A clear river running through forest and mountains"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover"
            />
            {/* Fade to cream on the left edge, and a light veil on small
                screens where the photo sits behind the text. */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream-50 via-cream-50/70 to-transparent sm:via-cream-50/20 sm:to-transparent" />
            <div className="absolute inset-0 bg-cream-50/55 sm:hidden" />
          </div>

          <div className="container-page py-12 sm:py-16 lg:py-20">
            <div className="max-w-lg">
              <h1 className="font-display text-4xl font-bold uppercase leading-[1.08] sm:text-5xl">
                <span className="text-navy-700">Protecting Water—</span>
                <br />
                <span className="text-teal-600">The Lifeblood Of</span>
                <br />
                <span className="text-teal-600">Mother Earth</span>
              </h1>
              <p className="mt-5 max-w-sm leading-relaxed text-ink sm:text-lg">
                Water is sacred. It sustains all life. It is our responsibility
                to protect it for generations to come.
              </p>
              <span className="mt-7 grid h-16 w-16 place-items-center rounded-full bg-teal-700 text-cream-50">
                <Droplet className="h-8 w-8" strokeWidth={1.5} />
              </span>
            </div>
          </div>
        </div>
        <WovenBorder />
      </section>

      {/* Standfirst band — flat navy with a woven diamond either side of the
          line, as the design has it. */}
      <section className="bg-[#1B3B5F] py-7 sm:py-8">
        <div className="container-page">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <WeaveDiamond className="hidden shrink-0 sm:block" />
            <p className="max-w-3xl text-center text-lg font-semibold leading-relaxed text-cream-50 sm:text-xl">
              Clean water is essential to the health of our people, our
              communities, our economies, and the survival of future generations.
            </p>
            <WeaveDiamond className="hidden shrink-0 sm:block" />
          </div>
        </div>
      </section>

      {/* Importance / peril / need */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} variant="up">
                <div className="h-full lg:border-l lg:border-cream-300 lg:pl-10 lg:first:border-l-0 lg:first:pl-0">
                  <div className="flex items-center gap-4">
                    {/* Supplied artwork — each badge brings its own coloured
                        circle, so no background is needed behind it. */}
                    <Image
                      src={p.icon}
                      alt=""
                      width={256}
                      height={256}
                      className="icon-pop h-14 w-14 shrink-0 object-contain"
                    />
                    <h2
                      className={`font-display text-xl font-bold uppercase tracking-wide ${p.tone} sm:text-2xl`}
                    >
                      {p.title}
                    </h2>
                  </div>
                  <p className="mt-5 text-ink-soft">{p.lead}</p>
                  <ul className="mt-5 space-y-3">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-ink">
                        {p.marker === "check" ? (
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.bg} text-cream-50`}>
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rust-600 text-cream-50">
                            <X className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        )}
                        <span className="text-sm leading-relaxed sm:text-base">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How support helps */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <FlourishTitle>How Your Support Helps</FlourishTitle>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {support.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06} variant="up">
                <div className="h-full text-center lg:border-l lg:border-cream-300 lg:px-5 lg:first:border-l-0">
                  {/* Supplied artwork — each badge carries its own colour, so
                      the per-item background classes are gone with it. */}
                  <Image
                    src={s.icon}
                    alt=""
                    width={224}
                    height={224}
                    className="icon-pop mx-auto h-16 w-16 object-contain"
                  />
                  <h3 className="mt-4 font-display text-base font-bold uppercase leading-tight tracking-wide text-teal-700">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 100% note */}
      <section className="pb-4">
        <div className="container-page">
          <Reveal variant="fade">
            <div className="flex items-center gap-6 rounded-lg border border-teal-100 bg-teal-50 px-7 py-6">
              <Image
                src="/images/cause-feather-beaded.png"
                alt=""
                width={520}
                height={597}
                className="hidden h-auto w-20 shrink-0 select-none sm:block"
              />
              <div>
                <p className="font-display text-lg font-bold uppercase tracking-wide text-teal-700 sm:text-xl">
                  100% of contributions go directly to water protection
                  initiatives.
                </p>
                <p className="mt-2 text-ink-soft">
                  Your gift helps protect the lifeblood of our communities, our
                  traditions, and our Mother Earth.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <div className="relative isolate grid gap-8 overflow-hidden rounded-lg bg-[#002E33] px-8 py-10 text-cream-50 lg:grid-cols-2 lg:gap-12 lg:px-10">
            {/* Background carries the ripple only. The emblem is a separate
                element below, because object-cover crops this band vertically
                — the band is proportionally wider than the artwork — and that
                was slicing the circle. Sized against the band's height, it can
                no longer be cut. */}
            <Image
              src="/images/water-band-plain.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 90vw"
              className="-z-10 object-cover"
            />
            <Image
              src="/images/water-emblem.png"
              alt=""
              width={290}
              height={287}
              className="pointer-events-none absolute -z-10 hidden h-[78%] w-auto lg:right-8 lg:top-1/2 lg:block lg:-translate-y-1/2"
            />
            {/* Two columns of copy run wider than the standfirst does, so this
                scrim is heavier than the one on that band. */}
            <div className="absolute inset-0 -z-10 bg-[#002E33]/70 lg:bg-[#002E33]/45" />
            <div>
              <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide sm:text-3xl">
                Together, We Can Protect Our Water.
              </h2>
              <p className="mt-4 font-display text-xl italic text-teal-100 sm:text-2xl">
                For Today. For Tomorrow. For Our Future.
              </p>
            </div>
            <div className="lg:border-l lg:border-cream-50/15 lg:pl-12">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide sm:text-2xl">
                Make A Difference Today
              </h3>
              <p className="mt-3 text-cream-100/85">
                Choose to give when you register for a seminar or make a
                donation online.
              </p>
              <Link
                href={`/register?cause=${encodeURIComponent(CAUSE)}`}
                className="btn-accent mt-6"
              >
                Give Now &amp; Protect Our Water
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WovenBorder size="lg" />
    </>
  );
}

/**
 * Woven diamond flanking the standfirst: a stepped outer diamond with a solid
 * centre and a small diamond off each side, drawn rather than shipped as an
 * image so it stays crisp and picks up the band's palette.
 */
function WeaveDiamond({ className = "" }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <svg width="74" height="34" viewBox="0 0 74 34" fill="none">
        <g stroke="#7FB2D9" strokeWidth="1.6" fill="none">
          <path d="M37 2 L52 17 L37 32 L22 17 Z" />
          <path d="M37 8 L46 17 L37 26 L28 17 Z" />
          <path d="M9 17 L14 12 L19 17 L14 22 Z" />
          <path d="M55 17 L60 12 L65 17 L60 22 Z" />
        </g>
        <path d="M37 12 L42 17 L37 22 L32 17 Z" fill="#7FB2D9" />
      </svg>
    </span>
  );
}

