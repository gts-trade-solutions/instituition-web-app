import { prisma } from "./prisma";

export type SeminarDTO = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  priceCents: number;
  capacity: number;
  seatsLeft: number;
};

/** Fallback dates mirror the original site, used only if the DB is empty/unreachable. */
const FALLBACK: SeminarDTO[] = [
  ["2026-07-30", "2026-07-31"],
  ["2026-08-13", "2026-08-14"],
  ["2026-08-27", "2026-08-28"],
  ["2026-09-10", "2026-09-11"],
  ["2026-09-24", "2026-09-25"],
].map(([s, e], i) => ({
  id: `fallback-${i}`,
  title: "AI, Financial Skills & Career Success — 2-Day Intensive",
  startDate: new Date(s),
  endDate: new Date(e),
  location: "Tulsa, Oklahoma",
  priceCents: 159500,
  capacity: 40,
  seatsLeft: 40 - i * 3,
}));

export async function getUpcomingSeminars(limit?: number): Promise<SeminarDTO[]> {
  try {
    const rows = await prisma.seminar.findMany({
      where: { published: true, endDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      // Only confirmed (PAID) registrations consume a seat — abandoned checkouts
      // (PENDING) and CANCELLED rows must not make a seminar look full.
      include: {
        _count: { select: { registrations: { where: { status: "PAID" } } } },
      },
      ...(limit ? { take: limit } : {}),
    });
    if (rows.length === 0) return limit ? FALLBACK.slice(0, limit) : FALLBACK;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      startDate: r.startDate,
      endDate: r.endDate,
      location: r.location,
      priceCents: r.priceCents,
      capacity: r.capacity,
      seatsLeft: Math.max(0, r.capacity - r._count.registrations),
    }));
  } catch {
    return limit ? FALLBACK.slice(0, limit) : FALLBACK;
  }
}
