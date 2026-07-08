import Link from "next/link";
import { Mail, Trash2, Archive, MailOpen, CornerUpLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { setMessageStatus, deleteMessage } from "./actions";
import { requireAdminFeature } from "@/lib/adminFeatures";

const STATUSES = ["NEW", "READ", "ARCHIVED"] as const;
type Filter = "ALL" | (typeof STATUSES)[number];

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  requireAdminFeature("messages");
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
        <h1 className="text-2xl font-semibold text-teal-800">Messages</h1>
        <p className="mt-1 text-ink-soft">
          Inquiries submitted through the contact form.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["ALL", ...STATUSES] as Filter[]).map((f) => (
          <Link
            key={f}
            href={f === "ALL" ? "/admin/messages" : `/admin/messages?status=${f}`}
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
        <div className="card p-10 text-center text-ink-soft">No messages found.</div>
      ) : (
        <div className="grid gap-4">
          {rows.map((m) => (
            <div key={m.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{m.fullName}</p>
                    {m.status === "NEW" && (
                      <span className="rounded-full bg-rust-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                    {m.status === "ARCHIVED" && (
                      <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-soft">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-soft">
                    {m.email}
                    {m.organization ? ` · ${m.organization}` : ""}
                  </p>
                </div>
                <span className="text-xs text-ink-soft">
                  {formatDate(m.createdAt)}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-teal-700">{m.subject}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">
                {m.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cream-200 pt-4">
                <a
                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                >
                  <CornerUpLeft className="h-3.5 w-3.5" /> Reply
                </a>
                {m.status !== "READ" && (
                  <StatusButton id={m.id} status="READ" icon={<MailOpen className="h-3.5 w-3.5" />}>
                    Mark Read
                  </StatusButton>
                )}
                {m.status !== "NEW" && (
                  <StatusButton id={m.id} status="NEW" icon={<Mail className="h-3.5 w-3.5" />}>
                    Mark Unread
                  </StatusButton>
                )}
                {m.status !== "ARCHIVED" && (
                  <StatusButton id={m.id} status="ARCHIVED" icon={<Archive className="h-3.5 w-3.5" />}>
                    Archive
                  </StatusButton>
                )}
                <form action={deleteMessage} className="ml-auto">
                  <input type="hidden" name="id" value={m.id} />
                  <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-rust-600 hover:bg-rust-500/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
          {rows.length === 200 && (
            <p className="text-center text-xs text-ink-soft">
              Showing the 200 most recent messages.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusButton({
  id,
  status,
  icon,
  children,
}: {
  id: string;
  status: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <form action={setMessageStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-cream-100 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-cream-200">
        {icon} {children}
      </button>
    </form>
  );
}

async function fetchRows(filter: Filter) {
  return prisma.contactMessage.findMany({
    where: filter === "ALL" ? {} : { status: filter },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}
