import Link from "next/link";
import {
  Users,
  DollarSign,
  MessageSquare,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateRange } from "@/lib/format";
import {
  requireAdminFeature,
  isAdminFeatureEnabled,
  type AdminFeature,
} from "@/lib/adminFeatures";

async function getStats() {
  try {
    const [regCount, paidAgg, newMessages, upcoming, recent] = await Promise.all([
      prisma.registration.count(),
      prisma.registration.aggregate({
        _sum: { amountCents: true },
        where: { status: "PAID" },
      }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.seminar.count({
        where: { published: true, endDate: { gte: new Date() } },
      }),
      prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { seminar: true },
      }),
    ]);
    return {
      regCount,
      revenue: paidAgg._sum.amountCents ?? 0,
      newMessages,
      upcoming,
      recent,
      ok: true as const,
    };
  } catch {
    return {
      regCount: 0,
      revenue: 0,
      newMessages: 0,
      upcoming: 0,
      recent: [],
      ok: false as const,
    };
  }
}

export default async function AdminDashboard() {
  requireAdminFeature("dashboard");
  const s = await getStats();

  const cards: {
    label: string;
    value: string | number;
    icon: typeof Users;
    href: string;
    feature: AdminFeature;
  }[] = [
    { label: "Registrations", value: s.regCount, icon: Users, href: "/admin/registrations", feature: "registrations" },
    { label: "Paid Revenue", value: formatCurrency(s.revenue), icon: DollarSign, href: "/admin/registrations", feature: "registrations" },
    { label: "New Messages", value: s.newMessages, icon: MessageSquare, href: "/admin/messages", feature: "messages" },
    { label: "Upcoming Seminars", value: s.upcoming, icon: CalendarDays, href: "/admin/seminars", feature: "seminars" },
  ];
  const showRecent = isAdminFeatureEnabled("registrations");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-teal-800">Dashboard</h1>
        <p className="mt-1 text-ink-soft">A snapshot of your institute.</p>
      </div>

      {!s.ok && (
        <div className="rounded-xl bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
          Could not reach the database. Check your <code>DATABASE_URL</code> and
          run <code>npx prisma db push</code>.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const enabled = isAdminFeatureEnabled(c.feature);
          const body = (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-600">
                <c.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm text-ink-soft">{c.label}</p>
                <p className="font-display text-2xl font-semibold text-teal-800">
                  {c.value}
                </p>
              </div>
            </>
          );
          // Only link cards whose section is enabled — otherwise the target
          // route just redirects back here (a confusing dead-end).
          return enabled ? (
            <Link
              key={c.label}
              href={c.href}
              className="card group flex items-center gap-4 p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              {body}
            </Link>
          ) : (
            <div key={c.label} className="card flex items-center gap-4 p-6">
              {body}
            </div>
          );
        })}
      </div>

      {showRecent && (
      <div className="card">
        <div className="flex items-center justify-between border-b border-cream-200 p-6">
          <h2 className="text-lg font-semibold text-teal-800">
            Recent Registrations
          </h2>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-rust-500"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {s.recent.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">No registrations yet.</p>
        ) : (
          <div className="divide-y divide-cream-200">
            {s.recent.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-6">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{r.fullName}</p>
                  <p className="truncate text-sm text-ink-soft">{r.email}</p>
                </div>
                <div className="hidden w-36 shrink-0 text-right text-sm text-ink-soft sm:block">
                  {r.seminar
                    ? formatDateRange(r.seminar.startDate, r.seminar.endDate)
                    : "—"}
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-teal-50 text-teal-700",
    PENDING: "bg-gold-400/20 text-gold-500",
    CANCELLED: "bg-rust-500/10 text-rust-600",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-cream-200 text-ink-soft"
      }`}
    >
      {status}
    </span>
  );
}
