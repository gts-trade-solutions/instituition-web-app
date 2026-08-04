import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  DollarSign,
  UtensilsCrossed,
  Users,
  Check,
  Calendar,
  Info,
} from "lucide-react";
import { getPageContent } from "@/lib/content";
import { getUpcomingSeminars } from "@/lib/seminars";
import { formatDateRange, formatSeats } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { FlourishTitle } from "@/components/Section";

export const metadata: Metadata = {
  title: "Seminars",
  description:
    "A 2-day hands-on seminar in AI-enhanced finance, grants, and career skills for tribal professionals. View upcoming dates and register.",
};

const day1 = [
  {
    icon: "/images/seminar-cash-reconciliation.png",
    title: "AI-Enhanced Cash Reconciliation",
    body: "Learn monthly cash reconciliation using AI tools that save time, reduce errors, and strengthen Tribal financial integrity.",
  },
  {
    icon: "/images/seminar-accounts-payable.png",
    title: "AI-Enhanced Accounts Payable",
    body: "Streamline invoice processing, approvals, and payments with AI automation and best practices for Tribal AP operations.",
  },
];

const day2 = [
  {
    icon: "/images/seminar-idc-proposals.png",
    title: "AI-Assisted IDC Rate Proposals",
    body: "Use AI to write stronger IDC grant narratives, build accurate budgets, and increase success in securing funding for your Nation.",
  },
  {
    icon: "/images/seminar-resume.png",
    title: "AI-Enabled Resume Creation & Applying for Jobs",
    body: "Create standout resumes, cover letters, and use AI tools that open doors to new opportunities.",
  },
];

const includes = [
  "Breakfast, snacks & lunch both days",
  "All training materials",
  "AI tool resources",
  "Certificate of completion",
];

const whoAttend = [
  "Finance & Accounting Staff",
  "Grants & Program Managers",
  "Enterprise & Operations Staff",
  "Workforce & Education Staff",
  "Tribal Members & Job Seekers",
];

export default async function SeminarsPage() {
  const c = await getPageContent("seminars");
  const seminars = await getUpcomingSeminars();

  return (
    <>
      {/* Hero — split: text on cream (left), classroom photo (right) */}
      <section className="relative overflow-hidden bg-[#FBF3EA]">
        {/* Desktop: photo bleeds to the right edge, fading into the cream */}
        <div className="absolute inset-y-0 right-0 hidden w-[64%] lg:block">
          <Image
            src="/images/seminars-hero.jpg"
            alt="Tribal professionals learning with laptops"
            fill
            priority
            sizes="64vw"
            className="object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #FBF3EA 0%, rgba(251,243,234,0.55) 12%, rgba(251,243,234,0) 40%)",
            }}
          />
        </div>
        <div className="container-page relative py-12 lg:py-16">
          {/* Wide enough to keep the strapline on one line and the intro to
              five, as the design sets them. */}
          <div className="max-w-xl xl:max-w-[46rem]">
            <h1 className="font-display font-bold uppercase leading-[0.98] text-navy-600 text-5xl sm:text-6xl lg:text-7xl xl:text-[6.5rem]">
              {c.title}
            </h1>
            <p className="mt-4 font-display font-bold uppercase tracking-wide text-teal-600 text-xl sm:text-2xl xl:text-[2.35rem]">
              {c.subtitle}
            </p>
            {/* 38.5rem reproduces the design's line breaks exactly — the intro
                falls to five lines, breaking after "practical". */}
            <p className="mt-6 max-w-[34rem] leading-[1.85] text-ink text-lg xl:max-w-[38.5rem] xl:text-[1.4rem]">
              {c.intro}
            </p>
          </div>
        </div>
        {/* Mobile: photo below the text */}
        <div className="relative h-56 w-full sm:h-72 lg:hidden">
          <Image
            src="/images/seminars-hero.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <FlourishTitle>What You Will Learn</FlourishTitle>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <CurriculumColumn label="Day 1" tint="bg-teal-600" cards={day1} iconTint="bg-teal-600" accent="text-teal-600" />
            <CurriculumColumn label="Day 2" tint="bg-rust-500" cards={day2} iconTint="bg-rust-500" accent="text-rust-500" />
          </div>
        </div>
      </section>

      {/* Dates + Info */}
      <section id="dates" className="scroll-mt-28 bg-cream-200/60 py-10 sm:py-12">
        <div className="container-page grid items-stretch gap-8 lg:grid-cols-2">
          {/* Dates table */}
          <Reveal className="flex h-full min-w-0 flex-col">
            <div className="flex items-center gap-3">
              <Calendar className="h-7 w-7 text-teal-600" />
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-navy-600">
                Upcoming Seminar Dates
              </h2>
            </div>
            {/* Phones: stacked cards so each date reads clearly with no sideways scroll. */}
            <ul className="mt-5 space-y-3 sm:hidden">
              {seminars.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border border-cream-300 bg-cream-50 p-4 shadow-card"
                >
                  <p className="font-display text-lg font-bold text-navy-600">
                    {formatDateRange(s.startDate, s.endDate)}
                  </p>
                  <dl className="mt-2.5 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-ink-soft">Location</dt>
                      <dd className="text-right font-medium text-ink">{s.location}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-ink-soft">Seats Available</dt>
                      <dd className="text-right font-medium text-teal-600">
                        {formatSeats(s.seatsLeft)}
                      </dd>
                    </div>
                  </dl>
                  <Link
                    href={`/register?seminar=${encodeURIComponent(s.id)}`}
                    className="btn-accent mt-3.5 w-full justify-center py-2.5 text-sm"
                  >
                    Register
                  </Link>
                </li>
              ))}
            </ul>

            {/* Tablet and up: full table. It stretches to take the leftover
                height, so this column ends level with the information column
                beside it instead of leaving a gap under the table. */}
            <div className="mt-5 hidden overflow-x-auto rounded-lg border border-cream-300 bg-cream-50 shadow-card sm:flex sm:flex-1 sm:flex-col">
              <table className="w-full min-w-[560px] text-base">
                <thead>
                  <tr className="bg-teal-700 text-left font-display text-sm uppercase tracking-wide text-cream-50">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Seats Available</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {seminars.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 font-semibold text-navy-600">
                        {formatDateRange(s.startDate, s.endDate)}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{s.location}</td>
                      <td className="px-4 py-3 text-teal-600">
                        {formatSeats(s.seatsLeft)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/register?seminar=${encodeURIComponent(s.id)}`}
                          className="btn-accent px-4 py-2 text-sm"
                        >
                          Register
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/register"
              className="btn-outline mt-6 w-full justify-center"
            >
              View All Dates
            </Link>
            <p className="mt-4 flex items-center justify-center gap-2 text-base font-semibold text-ink-soft">
              <Calendar className="h-5 w-5" /> New seminars every two weeks!
            </p>
          </Reveal>

          {/* Info box */}
          <Reveal delay={0.1} className="flex h-full min-w-0 flex-col">
            <div className="flex items-center gap-3">
              <Info className="h-7 w-7 text-teal-600" />
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-navy-600">
                Seminar Information
              </h2>
            </div>
            <div className="mt-5 flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-5 rounded-lg border border-cream-300 bg-cream-50 p-5 shadow-card">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal-600 text-cream-50">
                  <DollarSign className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                    Investment
                  </p>
                  <p className="font-display text-5xl font-bold text-teal-700">
                    <CountUp value={1595} prefix="$" />
                  </p>
                </div>
                <div className="text-base text-ink-soft">
                  <p className="font-semibold text-navy-600">Per Participant</p>
                  <p>Group rates available</p>
                </div>
              </div>

              <InfoList icon={UtensilsCrossed} title="Includes" items={includes} />
              <InfoList icon={Users} title="Who Should Attend" items={whoAttend} />

              <Link href="/register" className="btn-accent mt-auto w-full">
                Register Now
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden bg-[#002E33] text-cream-50">
        <div className="container-page relative flex flex-col items-center gap-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex items-center gap-5">
            <Image
              src="/images/cta-feather-v2.png"
              alt=""
              width={140}
              height={127}
              className="animate-float h-20 w-auto shrink-0 select-none"
            />
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
                {c.bannerTitle}
              </h2>
              <p className="mt-2 text-lg text-cream-100/85">{c.bannerSubtitle}</p>
            </div>
          </div>
          <Link href="/register" className="btn-outline-light shrink-0">
            Register Your Team Today
          </Link>
        </div>
      </section>
    </>
  );
}

function CurriculumColumn({
  label,
  tint,
  cards,
  iconTint,
  accent,
}: {
  label: string;
  tint: string;
  cards: { icon: string; title: string; body: string }[];
  iconTint: string;
  accent: string;
}) {
  return (
    <Reveal>
      <div className="rounded-lg border border-cream-300 bg-cream-50/60 p-5 shadow-card">
        <div className={`mx-auto mb-6 w-44 rounded-md py-2.5 text-center font-display text-xl font-bold uppercase tracking-widest text-cream-50 ${tint}`}>
          {label}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <div key={card.title} className="group flex h-full flex-col items-center rounded-lg border border-cream-300 bg-cream-50 p-6 text-center transition-shadow duration-300 hover:shadow-card">
              <Image
                src={card.icon}
                alt=""
                width={160}
                height={160}
                className="icon-pop h-20 w-20 rounded-full object-contain"
              />
              <h3 className={`mt-4 font-display text-xl font-bold uppercase leading-tight tracking-wide ${accent}`}>
                {card.title}
              </h3>
              <p className="mt-2 text-base text-ink-soft">{card.body}</p>
              <span className={`mt-6 block h-1 w-16 rounded-full ${iconTint}`} />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function InfoList({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Users;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-cream-300 bg-cream-50 p-5 shadow-card">
      <div className="flex items-start gap-4">
        <Icon className="h-10 w-10 shrink-0 text-teal-600" strokeWidth={1.75} />
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-wide text-navy-600">
            {title}
          </p>
          <ul className="mt-2 space-y-2">
            {items.map((it) => (
              <li key={it} className="flex items-center gap-2.5 text-base text-ink-soft">
                <Check className="h-5 w-5 shrink-0 text-teal-600" /> {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
