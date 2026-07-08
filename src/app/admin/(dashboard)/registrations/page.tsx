import Link from "next/link";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/format";
import { updateRegistrationStatus, deleteRegistration } from "./actions";
import { requireAdminFeature } from "@/lib/adminFeatures";

const STATUSES = ["PENDING", "PAID", "CANCELLED"] as const;
type Filter = "ALL" | (typeof STATUSES)[number];

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  requireAdminFeature("registrations");
  const sp = await searchParams;
  const filter = (
    STATUSES.includes(sp.status as never) ? sp.status : "ALL"
  ) as Filter;

  let rows: Awaited<ReturnType<typeof fetchRows>> = [];
  let error = false;
  try {
    rows = await fetchRows(filter);
  } catch {
    error = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-teal-800">Registrations</h1>
        <p className="mt-1 text-ink-soft">
          Everyone who has registered for a seminar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["ALL", ...STATUSES] as Filter[]).map((f) => (
          <Link
            key={f}
            href={f === "ALL" ? "/admin/registrations" : `/admin/registrations?status=${f}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-teal-600 text-cream-50"
                : "bg-white text-ink-soft hover:bg-teal-50"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
          Could not reach the database.
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-ink-soft">
          No registrations found.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100 text-left text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Seminar</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {rows.map((r) => (
                  <tr key={r.id} className="align-top hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{r.fullName}</p>
                      <p className="text-ink-soft">{r.email}</p>
                      {r.organization && (
                        <p className="text-xs text-ink-soft">{r.organization}</p>
                      )}
                      {r.cause && (
                        <p className="mt-1 text-xs text-rust-500">♥ {r.cause}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-ink-soft">
                      {r.seminar
                        ? formatDateRange(r.seminar.startDate, r.seminar.endDate)
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-ink">
                      {formatCurrency(r.amountCents)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-ink-soft">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <form action={updateRegistrationStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <select
                          name="status"
                          defaultValue={r.status}
                          className="rounded-lg border border-cream-300 bg-white px-2 py-1 text-xs"
                          // Auto-submit on change via the form's requestSubmit
                          // (progressive enhancement handled below)
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button className="ml-2 rounded-lg bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100">
                          Update
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4">
                      <form
                        action={deleteRegistration}
                        className="flex justify-end"
                      >
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          className="grid h-9 w-9 place-items-center rounded-lg text-rust-600 hover:bg-rust-500/10"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 200 && (
            <p className="border-t border-cream-200 px-6 py-3 text-xs text-ink-soft">
              Showing the 200 most recent registrations. Refine with the status
              filters above to see others.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

async function fetchRows(filter: Filter) {
  return prisma.registration.findMany({
    where: filter === "ALL" ? {} : { status: filter },
    orderBy: { createdAt: "desc" },
    include: { seminar: true },
    take: 200,
  });
}
