"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Floating quick-action pills pinned to the right edge, shown site-wide.
 * Register → registration, Dates → seminars list, Help → FAQ page.
 * The pill for the page you're currently on highlights itself.
 */
const actions = [
  { href: "/register", label: "Register", accent: true },
  { href: "/seminars", label: "Dates", accent: false },
  { href: "/faq", label: "Help", accent: false },
];

export function QuickActions() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick actions"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 sm:flex"
    >
      {actions.map((a) => {
        const active = pathname === a.href || pathname.startsWith(`${a.href}/`);
        const cls = active
          ? "bg-teal-600 text-cream-50 ring-2 ring-teal-700"
          : a.accent
            ? "bg-rust-500 text-white hover:bg-rust-600"
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
