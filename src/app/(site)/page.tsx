import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { getPageContent } from "@/lib/content";
import { getUpcomingSeminars } from "@/lib/seminars";
import { formatDateRange } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SeminarCard } from "@/components/SeminarCard";
import { WovenBorder } from "@/components/WovenBorder";

const benefits = [
  {
    icon: DollarSign,
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
        <div className="relative w-full aspect-[2600/895] bg-navy-800">
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
            className="absolute left-[4.6%] top-[79.5%] h-[11.7%] w-[24.8%] rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-50"
          />
          <Link
            href="/seminars"
            aria-label={c.heroSecondaryCta}
            className="absolute left-[31.6%] top-[79.5%] h-[11.7%] w-[16.8%] rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-50"
          />
          {/* Live copy kept for SEO / screen readers (the visible text is baked
              into the banner image). */}
          <h1 className="sr-only">
            {c.heroTitle} {c.heroTitleAccent}. {c.heroSubtitle}
          </h1>
          {/* Woven line overlaid on the photo's bottom edge — full width, scaled
              proportionally with the banner like the original baked-in stripe. */}
          <WovenBorder size="xl" className="absolute inset-x-0 bottom-0 !h-[2.6%]" />
        </div>
      </section>

      {/* ── Info bar ─────────────────────────────────────── */}
      <section className="bg-[#FBF3EA]">
        <div className="w-full px-5 py-12 sm:px-10 xl:px-14">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-6">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                <Calendar className="h-10 w-10" />
              </span>
              <div>
                <p className="text-lg font-bold uppercase tracking-wide text-ink-soft">
                  Next Seminar
                </p>
                <p className="whitespace-nowrap font-display text-4xl font-bold text-navy-600">
                  {next ? formatDateRange(next.startDate, next.endDate) : "Coming soon"}
                </p>
              </div>
            </div>

            <div className="hidden h-20 w-px bg-cream-300 lg:block" />

            <div className="text-center">
              <p className="font-display text-6xl font-bold text-navy-600">
                <CountUp value={(next?.priceCents ?? 159500) / 100} prefix="$" />
              </p>
              <p className="text-lg font-bold uppercase tracking-wide text-ink-soft">
                {c.priceLabel}
              </p>
              <p className="text-base font-semibold text-ink-soft">{c.priceNote}</p>
            </div>

            <div className="hidden h-20 w-px bg-cream-300 lg:block" />

            <div className="grid w-full grid-cols-3 items-start gap-3 sm:flex sm:w-auto sm:flex-nowrap sm:justify-center sm:gap-8">
              {[
                { src: "/images/feature-meals.png", label: "Meals Included" },
                { src: "/images/feature-training.png", label: "Training Materials" },
                { src: "/images/feature-certificate.png", label: "Certificate of Completion" },
              ].map(({ src, label }) => (
                <div key={label} className="flex flex-col items-center gap-3 text-center sm:w-36">
                  <Image
                    src={src}
                    alt=""
                    width={56}
                    height={56}
                    className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
                  />
                  <span className="text-sm font-bold uppercase leading-snug tracking-wide text-navy-600 sm:text-base">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/register" className="btn-accent whitespace-nowrap px-10 py-5 text-xl font-bold">
              Reserve Your Spot Now
            </Link>
          </div>
        </div>
        <div className="w-full px-5 sm:px-10 xl:px-14">
          <div className="h-px bg-cream-300" />
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────── */}
      <section className="bg-[#FBF3EA] pt-16 pb-12">
        <div className="w-full px-5 sm:px-10 xl:px-14">
          <Reveal>
            <h2 className="text-center font-display text-4xl uppercase text-navy-600">
              {c.benefitsTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal
                key={b.title}
                delay={i * 0.08}
                variant="blur"
                className={`lg:px-6 ${i > 0 ? "lg:border-l-2 lg:border-cream-300" : ""}`}
              >
                <div className="group flex cursor-default flex-col items-center text-center">
                  <span className={`icon-pop grid h-20 w-20 place-items-center rounded-full text-cream-50 shadow-card ${b.color}`}>
                    <b.icon className="h-12 w-12" />
                  </span>
                  <h3 className="mt-4 font-sans text-xl font-bold text-navy-600">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-base leading-snug text-ink-soft">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming seminars ────────────────────────────── */}
      <section className="bg-[#FBF3EA] pb-12">
        <div className="w-full px-5 sm:px-10 xl:px-14">
          <div className="h-px bg-cream-300" />
          <Reveal>
            <h2 className="pt-8 text-center font-display text-3xl uppercase text-navy-600">
              Upcoming Seminars
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seminars.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <SeminarCard seminar={s} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xl font-semibold text-ink-soft sm:text-2xl">
            New seminars every two weeks!
          </p>
        </div>
      </section>

      {/* ── Causes CTA band ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#00262c] text-cream-50">
        <Image
          src="/images/cta-mandala.png"
          alt=""
          width={646}
          height={592}
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-auto select-none object-cover object-left lg:block"
        />
        <div className="relative grid w-full items-center gap-8 px-5 py-10 sm:px-10 xl:px-14 lg:grid-cols-[auto_1fr_auto]">
          <Image
            src="/images/cta-feather-v2.png"
            alt="Beaded eagle feather"
            width={660}
            height={600}
            className="animate-float h-36 w-auto shrink-0 select-none lg:h-40"
          />
          <div>
            <h2 className="font-display text-3xl uppercase tracking-wide">
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
