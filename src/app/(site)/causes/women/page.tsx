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
import { Reveal } from "@/components/Reveal";
import { WovenBorder } from "@/components/WovenBorder";
import { GivePanel } from "./GivePanel";

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

const CAUSE = "Protecting Native American Women";

export default function ProtectingWomenPage() {
  return (
    <>
      {/* Light hero: the headline sits on cream at the left and the photograph
          bleeds off the right, fading into the background rather than sitting
          under a dark wash. */}
      <section>
        <WovenBorder />
        <div className="relative isolate overflow-hidden bg-cream-50">
          {/* Photo layer — right-anchored, faded out towards the text. */}
          <div className="absolute inset-y-0 right-0 -z-10 w-full sm:w-[68%] lg:w-[62%]">
            <Image
              src="/images/cause-women-hero.jpg"
              alt="A Native American woman looking out over a river valley at sunset"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 65vw"
              className="object-cover"
              // The hero band is far wider than the photo, so cover crops
              // vertically. Bias towards her face and the sunset horizon rather
              // than the centre, which would sit on her shoulders.
              style={{ objectPosition: "62% 38%" }}
            />
            {/* Fade to cream on the left edge, and a light veil on small
                screens where the photo sits behind the text. */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream-50 via-cream-50/70 to-transparent sm:via-cream-50/20 sm:to-transparent" />
            <div className="absolute inset-0 bg-cream-50/55 sm:hidden" />
          </div>

          <div className="container-page py-12 sm:py-16 lg:py-20">
            <div className="max-w-lg">
              <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] text-[#8B1E24] sm:text-5xl lg:text-6xl">
                Protecting
                <br />
                Native American
                <br />
                Women
              </h1>

              {/* Rule with a dot at its end, as in the design. */}
              <span className="mt-6 flex items-center gap-2" aria-hidden>
                <span className="h-0.5 w-40 bg-teal-600 sm:w-52" />
                <span className="h-2 w-2 rounded-full bg-teal-600" />
              </span>

              <p className="mt-5 font-display text-lg tracking-wide text-teal-700 sm:text-xl">
                Honoring Our Women. Strengthening Our Nations.
              </p>
              <p className="mt-4 max-w-md leading-relaxed text-ink sm:text-lg">
                Native women are the heart of our families, the strength of our
                communities, and the keepers of our traditions. Yet they face a
                crisis of violence, disappearance, and injustice.
              </p>
            </div>
          </div>
        </div>
        <WovenBorder />
      </section>

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

            {/* Dreamcatcher between the two columns, with the rules either
                side of it. Cut out against transparency so it sits on the page
                rather than in a paler box of its own. */}
            <Reveal delay={0.1} variant="fade" className="hidden lg:block">
              <div className="flex h-full items-center border-x border-cream-300 px-8 xl:px-10">
                <Image
                  src="/images/cause-dreamcatcher.png"
                  alt=""
                  width={600}
                  height={900}
                  className="h-auto w-[180px] xl:w-[210px]"
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
                <GivePanel cause={CAUSE} />
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
