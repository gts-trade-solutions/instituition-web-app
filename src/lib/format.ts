export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Seats phrasing for public listings. To avoid signalling low demand, we only
 * expose an exact count once seats drop under 50 — at 50+ it reads "50 or more",
 * then counts down one by one (49 left, 48 left, …); 0 becomes "Waitlist".
 */
export function formatSeats(seatsLeft: number): string {
  if (seatsLeft <= 0) return "Waitlist";
  if (seatsLeft >= 50) return "50 or more";
  return `${seatsLeft} left`;
}

// Seminar dates are stored as UTC midnight, so we format in UTC everywhere to
// avoid an off-by-one day in negative-offset (e.g. US) timezones.
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "July 30–31, 2026" style range (collapses same month/year). */
export function formatDateRange(
  start: Date | string,
  end: Date | string,
): string {
  const s = new Date(start);
  const e = new Date(end);
  const month = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const sameMonth =
    s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  if (sameMonth) {
    return `${month(s)} ${s.getUTCDate()}–${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  }
  return `${formatDate(s)} – ${formatDate(e)}`;
}
