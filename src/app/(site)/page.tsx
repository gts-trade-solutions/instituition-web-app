import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Users,
  TrendingUp,
  Calendar,
  UtensilsCrossed,
  BookOpen,
  Award,
  ArrowRight,
  Gauge,
} from "lucide-react";
import { getPageContent } from "@/lib/content";
import { getUpcomingSeminars } from "@/lib/seminars";
import { formatDateRange } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { FlourishTitle } from "@/components/Section";
import { SeminarCard } from "@/components/SeminarCard";
import { WovenBorder } from "@/components/WovenBorder";

const benefits = [
  {
    icon: Gauge,
    color: "bg-teal-600",
    title: "Improve Efficiency",
    body: "Save time and reduce administrative burdens with AI tools.",
  },
  {
    icon: CheckCircle2,
    color: "bg-rust-500",
    title: "Increase Accuracy",
    body: "Improve financial accuracy and reduce errors.",
  },
  {
    icon: Users,
    color: "bg-teal-600",
    title: "Strengthen Operations",
    body: "Build stronger systems and support Tribal governance.",
  },
  {
    icon: TrendingUp,
    color: "bg-plum-500",
    title: "Build Opportunities",
    body: "Support workforce development and economic growth.",
  },
];

export default async function HomePage() {
  const c = await getPageContent("home");
  const seminars = await getUpcomingSeminars(4);
  const next = seminars[0];

  return (
    <>
      {/* ── Hero — exact reference banner ─────────────────── */}
      <section>
        <div className="relative w-full aspect-[2600/920] bg-navy-800">
          <Image
            src="/images/home-hero-banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Real, clickable targets sit exactly over the painted buttons, so
              registration keeps working while the banner stays pixel-faithful
              to the reference. */}
          <Link
            href="/register"
            aria-label={c.heroPrimaryCta}
            className="absolute left-[4.6%] top-[77.3%] h-[11.4%] w-[24.8%] rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-50"
          />
          <Link
            href="/seminars"
            aria-label={c.heroSecondaryCta}
            className="absolute left-[31.6%] top-[77.3%] h-[11.4%] w-[16.8%] rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-50"
          />
          {/* Live copy kept for SEO / screen readers (the visible text is baked
              into the banner image). */}
          <h1 className="sr-only">
            {c.heroTitle} {c.heroTitleAccent}. {c.heroSubtitle}
          </h1>
        </div>
        <WovenBorder size="lg" />
      </section>

      {/* ── Info bar ─────────────────────────────────────── */}
      <section className="bg-[#FBF3EA]">
        <div className="container-page py-10">
          <div className="flex flex-col items-center gap-7 lg:flex-row lg:justify-between lg:gap-5">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Calendar className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                  Next Seminar
                </p>
                <p className="whitespace-nowrap font-display text-xl font-bold text-navy-600">
                  {next ? formatDateRange(next.startDate, next.endDate) : "Coming soon"}
                </p>
              </div>
            </div>

            <div className="hidden h-14 w-px bg-cream-300 lg:block" />

            <div className="text-center">
              <p className="font-display text-4xl font-bold text-navy-600">
                <CountUp value={(next?.priceCents ?? 159500) / 100} prefix="$" />
              </p>
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                {c.priceLabel}
              </p>
              <p className="text-sm text-ink-soft">{c.priceNote}</p>
            </div>

            <div className="hidden h-14 w-px bg-cream-300 lg:block" />

            <div className="flex flex-nowrap items-start justify-center gap-6">
              {[
                [UtensilsCrossed, "Meals Included"],
                [BookOpen, "Training Materials"],
                [Award, "Certificate of Completion"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof Award;
                return (
                  <div key={label as string} className="flex w-28 flex-col items-center gap-2 text-center">
                    <I className="h-8 w-8 shrink-0 text-navy-600" />
                    <span className="text-xs font-semibold uppercase leading-snug tracking-wide text-navy-600">
                      {label as string}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link href="/register" className="btn-accent whitespace-nowrap px-6 py-3.5 text-base">
              Reserve Your Spot Now
            </Link>
          </div>
        </div>
        <div className="container-page">
          <div className="h-px bg-cream-300" />
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────── */}
      <section className="bg-[#FBF3EA] py-16 sm:py-20">
        <div className="container-page">
          <FlourishTitle>{c.benefitsTitle}</FlourishTitle>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08} variant="blur">
                <div className="group flex cursor-default flex-col items-center text-center">
                  <span className={`icon-pop grid h-20 w-20 place-items-center rounded-full text-cream-50 shadow-card ${b.color}`}>
                    <b.icon className="h-10 w-10" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-navy-600">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-soft">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming seminars ────────────────────────────── */}
      <section className="border-t border-cream-300 bg-[#FBF3EA] py-16 sm:py-20">
        <div className="container-page">
          <FlourishTitle>Upcoming Seminars</FlourishTitle>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seminars.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <SeminarCard seminar={s} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-semibold text-ink-soft">
            New seminars every two weeks!
          </p>
        </div>
      </section>

      {/* ── Causes CTA band ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#002E33] text-cream-50">
        <Image
          src="/images/cta-mandala.png"
          alt=""
          width={646}
          height={592}
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-auto select-none object-cover object-left lg:block"
        />
        <div className="container-page relative grid items-center gap-8 py-14 lg:grid-cols-[auto_1fr_auto]">
          <Image
            src="/images/cta-feather-v2.png"
            alt="Beaded eagle feather"
            width={660}
            height={600}
            className="animate-float h-40 w-auto shrink-0 select-none lg:h-48"
          />
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
              Invest In Your Future. Invest In Your Nation.
            </h2>
            <p className="mt-3 max-w-xl text-cream-100/85">
              Support Protecting Native American Women and Native American Sovereignty.
            </p>
            <p className="mt-2 font-semibold text-gold-400">
              100% of contributions go directly to these causes.
            </p>
          </div>
          <Link href="/causes" className="btn-outline-light shrink-0">
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
