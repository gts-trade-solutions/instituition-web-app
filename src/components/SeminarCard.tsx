import Link from "next/link";
import type { SeminarDTO } from "@/lib/seminars";
import { formatDateRange, formatSeats } from "@/lib/format";

export function SeminarCard({ seminar }: { seminar: SeminarDTO }) {
  const full = seminar.seatsLeft <= 0;
  return (
    <div className="flex flex-col items-center rounded-lg border border-cream-300 bg-cream-50 p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:shadow-soft">
      <p className="font-display text-lg font-bold uppercase tracking-wide text-navy-600">
        {formatDateRange(seminar.startDate, seminar.endDate)}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-600">
        {formatSeats(seminar.seatsLeft)}
      </p>
      <Link
        href={full ? "/contact" : `/register?seminar=${encodeURIComponent(seminar.id)}`}
        className="btn-accent mt-4 w-full py-2.5"
      >
        {full ? "Join Waitlist" : "Register"}
      </Link>
    </div>
  );
}
