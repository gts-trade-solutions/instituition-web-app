"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, UserRound, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";

type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

/**
 * The cause pages hang off "Causes & Giving" rather than sitting alongside it.
 * Six top-level items already fill the bar at 1280px — two more would push the
 * sign-in and register buttons off the edge.
 */
const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/seminars", label: "Seminars" },
  {
    href: "/causes",
    label: "Causes & Giving",
    children: [
      { href: "/causes", label: "All Causes" },
      { href: "/causes/water", label: "Protecting Water" },
      { href: "/causes/women", label: "Protecting Native American Women" },
    ],
  },
  { href: "/why-it-matters", label: "Why It Matters" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ user }: { user?: { name: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation — adjust state during render (React's
  // recommended pattern) rather than in an effect.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The bottom mobile nav bar's "Menu" button toggles this same drawer.
  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    window.addEventListener("toggle-mobile-menu", toggle);
    return () => window.removeEventListener("toggle-mobile-menu", toggle);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF3EA]">
      <nav className="flex h-28 w-full items-center justify-between gap-3 px-4 py-2 sm:px-6 xl:h-40 xl:px-6 2xl:gap-4 2xl:px-10">
        <Logo className="pt-1 sm:pt-2" priority />

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((l) => {
            const item = (
              <Link
                href={l.href}
                className={`relative flex items-center gap-1 whitespace-nowrap px-2.5 py-2 text-base font-semibold tracking-normal transition-colors 2xl:px-3 ${
                  isActive(l.href)
                    ? "text-rust-500"
                    : "text-navy-600 hover:text-rust-500"
                }`}
              >
                {l.label}
                {l.children && <ChevronDown className="h-4 w-4" />}
                {isActive(l.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-rust-500" />
                )}
              </Link>
            );

            if (!l.children) return <div key={l.href}>{item}</div>;

            // Opens on hover and on keyboard focus. focus-within means tabbing
            // into the submenu keeps it open without any state to manage.
            return (
              <div key={l.href} className="group relative">
                {item}
                <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-[15rem] rounded-md border border-cream-300 bg-cream-50 p-1.5 shadow-card">
                    {l.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`block rounded px-3 py-2 text-sm font-semibold transition-colors ${
                          pathname === c.href
                            ? "bg-cream-200 text-rust-500"
                            : "text-navy-600 hover:bg-cream-200 hover:text-rust-500"
                        }`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 xl:flex 2xl:gap-4">
          {user ? (
            <Link
              href="/account"
              aria-label="My Account"
              title="My Account"
              className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                isActive("/account")
                  ? "border-rust-500 bg-rust-500 text-white"
                  : "border-cream-300 bg-cream-50 text-navy-600 hover:border-rust-500 hover:text-rust-500"
              }`}
            >
              <UserRound className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap text-base font-semibold text-navy-600 transition-colors hover:text-rust-500"
            >
              Sign In
            </Link>
          )}
          <Link href="/register" className="btn-accent whitespace-nowrap px-4 py-3 text-base 2xl:px-6">
            Register Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-md border border-cream-300 bg-cream-50 text-navy-600 xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={open ? "pointer-events-auto xl:hidden" : "pointer-events-none xl:hidden"}>
        <div
          className={`fixed inset-0 top-28 z-40 bg-navy-800/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-menu"
          inert={!open}
          className={`fixed inset-x-0 top-28 z-50 border-b border-cream-300 bg-[#FBF3EA] px-5 pb-6 pt-3 shadow-soft transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <div key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-md px-4 py-3 text-base font-semibold tracking-normal ${
                    isActive(l.href)
                      ? "bg-teal-600 text-cream-50"
                      : "text-navy-600 hover:bg-cream-200"
                  }`}
                >
                  {l.label}
                </Link>
                {/* Sub-pages listed inline — a drawer has the room, so there's
                    no reason to hide them behind another tap. */}
                {l.children && (
                  <div className="mt-1 flex flex-col gap-1 border-l border-cream-300 pl-3 ml-4">
                    {l.children
                      .filter((c) => c.href !== l.href)
                      .map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`rounded-md px-4 py-2.5 text-sm font-semibold ${
                            pathname === c.href
                              ? "bg-cream-200 text-rust-500"
                              : "text-navy-600 hover:bg-cream-200"
                          }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center gap-2.5 rounded-md px-4 py-3 text-base font-semibold tracking-normal text-navy-600 hover:bg-cream-200"
            >
              {user && <UserRound className="h-5 w-5" />}
              {user ? "My Account" : "Sign In"}
            </Link>
            <Link href="/register" className="btn-accent mt-3 w-full">
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
