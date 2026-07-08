import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarDays,
  MapPin,
  HeartHandshake,
  Ticket,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
} from "lucide-react";
import { requireUser, getAccountDetails, type AccountRegistration } from "@/lib/user-auth";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/format";
import { WovenBorder } from "@/components/WovenBorder";
import { logoutAction } from "../auth-actions";

export const metadata: Metadata = { title: "My Account" };

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const statusStyles: Record<
  AccountRegistration["status"],
  { label: string; icon: typeof CheckCircle2; cls: string }
> = {
  PAID: { label: "Confirmed", icon: CheckCircle2, cls: "bg-teal-600/10 text-teal-700" },
  PENDING: { label: "Pending payment", icon: Clock, cls: "bg-rust-500/10 text-rust-600" },
  CANCELLED: { label: "Cancelled", icon: XCircle, cls: "bg-navy-800/10 text-ink-soft" },
};

export default async function AccountPage() {
  const user = await requireUser();
  const { memberSince, registrations } = await getAccountDetails(user);
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return (
    <>
      {/* Header band */}
      <section>
        <div className="relative overflow-hidden bg-[#002E33] text-cream-50">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 via-transparent to-transparent" />
          <div className="container-page relative flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-600 font-display text-2xl font-bold text-cream-50 ring-4 ring-cream-50/15">
                {initials(user.name) || "?"}
              </span>
              <div>
                <p className="text-sm uppercase tracking-widest text-cream-100/70">
                  Welcome back
                </p>
                <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
                  {firstName}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-cream-100/85">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="btn-outline-light whitespace-nowrap"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
        <WovenBorder />
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Registrations */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-800 text-cream-50">
                <Ticket className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
                Your Registrations
              </h2>
            </div>

            {registrations.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-cream-300 bg-cream-50 p-10 text-center shadow-card">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream-200 text-teal-700">
                  <CalendarDays className="h-7 w-7" />
                </span>
                <p className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-navy-600">
                  No registrations yet
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                  When you register for a seminar, it will appear here so you can
                  keep track of your upcoming training.
                </p>
                <Link href="/register" className="btn-accent mt-6 inline-flex">
                  Register For A Seminar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {registrations.map((r) => {
                  const s = statusStyles[r.status];
                  return (
                    <li
                      key={r.id}
                      className="overflow-hidden rounded-lg border border-cream-300 bg-cream-50 shadow-card"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cream-200 px-5 py-4">
                        <div>
                          <p className="font-display text-lg font-bold text-navy-600">
                            {r.seminarStart && r.seminarEnd
                              ? formatDateRange(r.seminarStart, r.seminarEnd)
                              : r.seminarTitle ?? "Seminar Registration"}
                          </p>
                          {r.seminarLocation && (
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
                              <MapPin className="h-4 w-4" /> {r.seminarLocation}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${s.cls}`}
                        >
                          <s.icon className="h-3.5 w-3.5" />
                          {s.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                        <div className="space-y-1 text-ink-soft">
                          <p>Registered {formatDate(r.createdAt)}</p>
                          {r.cause && (
                            <p className="flex items-center gap-1.5 text-teal-700">
                              <HeartHandshake className="h-4 w-4" />
                              Supporting: {r.cause}
                            </p>
                          )}
                        </div>
                        <p className="font-display text-xl font-bold text-navy-600">
                          {formatCurrency(r.amountCents)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-cream-300 bg-cream-50 p-6 shadow-card">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-navy-600">
                Account Details
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Name
                  </dt>
                  <dd className="capitalize text-navy-700">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Email
                  </dt>
                  <dd className="break-words text-navy-700">{user.email}</dd>
                </div>
                {memberSince && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      Member Since
                    </dt>
                    <dd className="text-navy-700">{formatDate(memberSince)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-lg bg-[#002E33] p-6 text-cream-50 shadow-card">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                Ready For More?
              </h3>
              <p className="mt-2 text-sm text-cream-100/85">
                Browse upcoming dates or reserve your next seminar seat.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link href="/register" className="btn-accent w-full justify-center">
                  Register For A Seminar
                </Link>
                <Link href="/seminars" className="btn-outline-light w-full justify-center">
                  View Seminar Dates
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
