import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Bird,
  AlertTriangle,
  HandHeart,
  Check,
  House,
  Scale,
  HeartPulse,
  GraduationCap,
  Feather,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { WovenBorder } from "@/components/WovenBorder";

export const metadata: Metadata = {
  title: "Protecting Native American Women",
  description:
    "Native women are the heart of our families and the keepers of our traditions. Learn about the crisis they face and how your contribution helps.",
};

const pillars = [
  {
    icon: Bird,
    title: "The Importance",
    lead: null,
    points: [
      "Native women are caregivers, leaders, educators, and protectors of culture.",
      "They strengthen families, preserve languages, and pass on our values.",
      "When Native women thrive, our Nations thrive.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "The Current Peril",
    lead: null,
    points: [
      "Native women are 2.5 times more likely to experience violence.",
      "They go missing at alarming rates, with far too many cases ignored.",
      "Jurisdictional gaps, racism, and lack of resources perpetuate this crisis.",
      "This is a national emergency that demands action.",
    ],
  },
  {
    icon: HandHeart,
    title: "The Need For Help",
    lead: null,
    points: [
      "Support safe housing and emergency shelters.",
      "Fund advocacy, legal assistance, and healing services.",
      "Strengthen Tribal programs that protect and empower Native women.",
      "Together, we can create change and ensure a safer future.",
    ],
  },
];

const impact = [
  {
    icon: House,
    title: "Safe Shelter & Housing",
    body: "Providing emergency shelter and safe housing for Native women and their children.",
  },
  {
    icon: Scale,
    title: "Legal Advocacy",
    body: "Supporting legal services to pursue justice and accountability for survivors.",
  },
  {
    icon: HeartPulse,
    title: "Healing & Wellness",
    body: "Funding culturally grounded healing, trauma recovery, and mental health services.",
  },
  {
    icon: GraduationCap,
    title: "Prevention & Education",
    body: "Investing in education, awareness, and prevention programs to end violence in our communities.",
  },
];

/** Suggested contributions, added during seminar registration. */
const gifts = [
  { amount: "$25", body: "Provides emergency supplies for a woman in crisis." },
  { amount: "$50", body: "Supports legal advocacy and safety planning." },
  { amount: "$100", body: "Helps fund healing services and counseling." },
  { amount: "$250", body: "Provides safe shelter and support for families." },
];

const CAUSE = "Protecting Native American Women";

export default function ProtectingWomenPage() {
  return (
    <>
      <PageHero
        topWeave
        title={
          <>
            Protecting
            <br />
            Native American Women
          </>
        }
        // See the water page: the -v2 files are 900px card assets, too small
        // for a full-bleed hero. This is the same photo resampled to 1800px.
        image="/images/cause-women-hero.jpg"
        imageAlt="Native American women and a child together outdoors"
        objectPosition="50% 22%"
      >
        <p className="mt-6 font-display text-xl uppercase tracking-wide text-gold-400 sm:text-2xl">
          Honoring Our Women. Strengthening Our Nations.
        </p>
        <p className="mt-4 max-w-xl leading-relaxed text-white sm:text-lg">
          Native women are the heart of our families, the strength of our
          communities, and the keepers of our traditions. Yet they face a crisis
          of violence, disappearance, and injustice.
        </p>
      </PageHero>

      {/* Importance / peril / need */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} variant="up">
                <div className="h-full lg:border-l lg:border-cream-300 lg:pl-10 lg:first:border-l-0 lg:first:pl-0">
                  <div className="flex items-center gap-4">
                    <span className="icon-pop grid h-14 w-14 shrink-0 place-items-center rounded-full bg-rust-600 text-cream-50">
                      <p.icon className="h-7 w-7" />
                    </span>
                    <h2 className="font-display text-xl font-bold uppercase tracking-wide text-rust-600 sm:text-2xl">
                      {p.title}
                    </h2>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rust-600 text-cream-50">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-sm leading-relaxed text-ink sm:text-base">
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

      {/* Contribution band */}
      <section className="pb-4">
        <div className="container-page">
          <Reveal variant="fade">
            <div className="grid gap-7 rounded-lg bg-[#0B3B3C] px-8 py-8 text-cream-50 lg:grid-cols-2 lg:gap-10">
              <p className="font-display text-xl font-bold uppercase leading-snug tracking-wide sm:text-2xl">
                Your contribution helps save lives, restore hope, and protect the
                women who are the backbone of our communities.
              </p>
              <div className="flex items-center gap-6 lg:border-l lg:border-cream-50/15 lg:pl-10">
                <Feather
                  className="hidden h-14 w-14 shrink-0 text-gold-400 sm:block"
                  strokeWidth={1.2}
                />
                <p className="font-display text-lg font-bold uppercase leading-snug tracking-wide text-gold-400 sm:text-xl">
                  100% of contributions go directly to programs supporting Native
                  women.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Impact + how to help */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
            <Reveal variant="up">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600 sm:text-3xl">
                  Your Support Makes An Impact
                </h2>
                <span className="mt-3 block h-0.5 w-20 bg-rust-500" />
                <ul className="mt-7 space-y-6">
                  {impact.map((it) => (
                    <li key={it.title} className="flex gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal-700 text-cream-50">
                        <it.icon className="h-6 w-6" strokeWidth={1.7} />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold uppercase tracking-wide text-navy-600">
                          {it.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                          {it.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1} variant="fade" className="hidden lg:block">
              <div className="relative h-full w-px bg-cream-300">
                <Image
                  src="/images/about-dreamcatcher.jpg"
                  alt=""
                  width={260}
                  height={260}
                  className="absolute left-1/2 top-1/2 h-auto w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-card xl:w-[260px]"
                />
              </div>
            </Reveal>

            <Reveal delay={0.15} variant="up">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600 sm:text-3xl">
                  How You Can Help
                </h2>
                <span className="mt-3 block h-0.5 w-20 bg-rust-500" />
                <p className="mt-5 text-ink-soft">
                  When you register for a seminar, you can add a contribution to
                  Protecting Native American Women. Every gift—large or
                  small—makes a difference.
                </p>
                <ul className="mt-6 space-y-3">
                  {gifts.map((g) => (
                    <li key={g.amount} className="flex items-center gap-4">
                      <span className="grid w-20 shrink-0 place-items-center rounded-md bg-rust-600 py-2 font-display text-lg text-cream-50">
                        {g.amount}
                      </span>
                      <span className="text-sm leading-relaxed text-ink-soft">
                        {g.body}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/register?cause=${encodeURIComponent(CAUSE)}`}
                  className="btn-accent mt-7 w-full justify-center"
                >
                  Donate Now
                </Link>
                <p className="mt-3 text-center text-xs text-ink-soft">
                  Contributions are added during seminar registration, where you
                  can also enter a custom amount.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pb-12">
        <div className="container-page">
          <div className="flex flex-col items-center gap-7 rounded-lg border border-cream-300 bg-cream-100 px-8 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex items-center gap-5">
              <HandHeart
                className="hidden h-14 w-14 shrink-0 text-rust-600 sm:block"
                strokeWidth={1.4}
              />
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                  Together, We Can Protect Our Women.
                </h2>
                <p className="mt-2 text-ink-soft">
                  Our strength is in our unity. Our future depends on our women.
                </p>
                <p className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-rust-600">
                  Honor. Protect. Empower. Native Women.
                </p>
              </div>
            </div>
            <p className="font-display text-xl font-bold uppercase leading-snug tracking-wide text-teal-700">
              Strong Women
              <br />
              Strong Nations
              <br />
              Strong Future
            </p>
          </div>
        </div>
      </section>

      <section className="bg-teal-800 py-4">
        <div className="container-page">
          <p className="text-center font-display text-sm uppercase tracking-wide text-cream-50 sm:text-base">
            Accounting Institute for Native Americans
            <span className="mx-3 text-gold-400">|</span>
            <span className="font-sans normal-case tracking-normal text-cream-100/85">
              Building Stronger Nations Through Knowledge, Skills &amp; Unity
            </span>
          </p>
        </div>
      </section>

      <WovenBorder size="lg" />
    </>
  );
}
