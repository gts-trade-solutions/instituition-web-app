"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Floating quick-action pills pinned to the right edge, shown site-wide.
 * Register → registration, Donate → causes, Dates → seminars list, Help → FAQ.
 * The pill for the page you're currently on highlights itself.
 */
const actions = [
  { href: "/register", label: "Register", accent: "primary" },
  // Points at Causes & Giving rather than straight to registration: that page
  // is where the causes and the suggested amounts are explained.
  { href: "/causes", label: "Donate", accent: "donate" },
  { href: "/seminars#dates", label: "Dates", accent: null },
  { href: "/faq", label: "Help", accent: null },
] as const;

export function QuickActions() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick actions"
      // Anchored to the bottom-right corner rather than centred on the right
      // edge, where the stack sat across the middle of the page and covered
      // content. bottom-24 keeps it clear of the scroll-to-top button, which
      // occupies bottom-6 in the same corner.
      className="fixed bottom-24 right-6 z-40 hidden flex-col items-end gap-2.5 sm:flex"
    >
      {actions.map((a) => {
        // Match on the path only — a.href may carry a #hash (e.g. /seminars#dates)
        // that usePathname() never includes, which would break the highlight.
        const path = a.href.split("#")[0];
        const active = pathname === path || pathname.startsWith(`${path}/`);
        const cls = active
          ? "bg-teal-600 text-cream-50 ring-2 ring-teal-700"
          : a.accent === "primary"
            ? "bg-rust-500 text-white hover:bg-rust-600"
            : a.accent === "donate"
              ? "bg-[#8B1E24] text-white hover:bg-[#741A1F]"
              : "bg-cream-50 text-navy-700 hover:bg-cream-100";
        return (
          <Link
            key={a.href}
            href={a.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wide shadow-lg transition-colors ${cls}`}
          >
            {a.label}
          </Link>
        );
      })}
    </nav>
  );
}
