import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Landmark,
  ReceiptText,
  TrendingUp,
  FileUser,
  DollarSign,
  UtensilsCrossed,
  Users,
  Check,
  Calendar,
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
    icon: Landmark,
    title: "AI-Enhanced Cash Reconciliation",
    body: "Learn monthly cash reconciliation using AI tools that save time, reduce errors, and strengthen Tribal financial integrity.",
  },
  {
    icon: ReceiptText,
    title: "AI-Enhanced Accounts Payable",
    body: "Streamline invoice processing, approvals, and payments with AI automation and best practices for Tribal AP operations.",
  },
];

const day2 = [
  {
    icon: TrendingUp,
    title: "AI-Assisted IDC Rate Proposals",
    body: "Use AI to write stronger IDC grant narratives, build accurate budgets, and increase success in securing funding for your Nation.",
  },
  {
    icon: FileUser,
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
        <div className="absolute inset-y-0 right-0 hidden w-[60%] lg:block">
          <Image
            src="/images/seminars-hero.jpg"
            alt="Tribal professionals learning with laptops"
            fill
            priority
            sizes="60vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #FBF3EA 0%, rgba(251,243,234,0.35) 14%, rgba(251,243,234,0) 34%)",
            }}
          />
        </div>
        <div className="container-page relative py-12 lg:py-20">
          <div className="max-w-xl">
            <h1 className="font-display text-5xl font-bold uppercase leading-[1.02] text-navy-600 sm:text-6xl">
              {c.title}
            </h1>
            <p className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-teal-600 sm:text-2xl">
              {c.subtitle}
            </p>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
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
            className="object-cover"
          />
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <FlourishTitle>What You Will Learn</FlourishTitle>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <CurriculumColumn label="Day 1" tint="bg-teal-600" cards={day1} iconTint="bg-teal-600" accent="text-teal-600" />
            <CurriculumColumn label="Day 2" tint="bg-rust-500" cards={day2} iconTint="bg-rust-500" accent="text-rust-500" />
          </div>
        </div>
      </section>

      {/* Dates + Info */}
      <section className="bg-cream-200/60 py-16 sm:py-20">
        <div className="container-page grid items-stretch gap-8 lg:grid-cols-2">
          {/* Dates table */}
          <Reveal className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-teal-600" />
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                Upcoming Seminar Dates
              </h2>
            </div>
            <div className="mt-5 flex flex-1 flex-col overflow-hidden rounded-lg border border-cream-300 bg-cream-50 shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-700 text-left font-display text-xs uppercase tracking-wide text-cream-50">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Seats</th>
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
                          className="btn-accent px-3 py-1.5 text-xs"
                        >
                          Register
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-auto flex items-center gap-2 border-t border-cream-200 px-4 py-3.5 text-sm font-semibold text-ink-soft">
                <Calendar className="h-4 w-4" /> New seminars every two weeks!
              </p>
            </div>
          </Reveal>

          {/* Info box */}
          <Reveal delay={0.1} className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                Seminar Information
              </h2>
            </div>
            <div className="mt-5 flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-4 rounded-lg border border-cream-300 bg-cream-50 p-5 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-600 text-cream-50">
                  <DollarSign className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Investment
                  </p>
                  <p className="font-display text-3xl font-bold text-navy-600">
                    <CountUp value={1595} prefix="$" />{" "}
                    <span className="text-sm font-semibold text-ink-soft">Per Participant</span>
                  </p>
                  <p className="text-xs text-ink-soft">Group rates available</p>
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
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                {c.bannerTitle}
              </h2>
              <p className="mt-2 text-cream-100/85">{c.bannerSubtitle}</p>
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
  cards: { icon: typeof Landmark; title: string; body: string }[];
  iconTint: string;
  accent: string;
}) {
  return (
    <Reveal>
      <div className="rounded-lg border border-cream-300 bg-cream-50/60 p-5 shadow-card">
        <div className={`mx-auto mb-6 w-40 rounded-md py-2 text-center font-display text-lg font-bold uppercase tracking-widest text-cream-50 ${tint}`}>
          {label}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <div key={card.title} className="group flex h-full flex-col items-center rounded-lg bg-cream-50 p-6 text-center transition-shadow duration-300 hover:shadow-card">
              <span className={`icon-pop grid h-16 w-16 place-items-center rounded-full text-cream-50 ${iconTint}`}>
                <card.icon className="h-8 w-8" />
              </span>
              <h3 className={`mt-4 font-display text-base font-bold uppercase leading-tight tracking-wide ${accent}`}>
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{card.body}</p>
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
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-600 text-cream-50">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-navy-600">
            {title}
          </p>
          <ul className="mt-2 space-y-1.5">
            {items.map((it) => (
              <li key={it} className="flex items-center gap-2 text-sm text-ink-soft">
                <Check className="h-4 w-4 shrink-0 text-teal-600" /> {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
