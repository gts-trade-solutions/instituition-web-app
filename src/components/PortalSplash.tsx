"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BANNER_SRC, SPLASH_STORAGE_KEY } from "@/lib/splash";

/**
 * Full-screen welcome banner shown once per browsing session. The artwork
 * itself is not clickable — visitors leave it by one of the three buttons in
 * the bar along the bottom.
 *
 * The "already seen" flag lives in sessionStorage, which the server can't read,
 * so a naive render would either flash the site before the banner appears or
 * flash the banner at people who already dismissed it. The inline script in the
 * site layout avoids both: it stamps data-splash="seen" on <html> before first
 * paint, and CSS in globals.css hides this overlay when that attribute is
 * present. So the markup always renders on the server, and CSS — not React —
 * decides whether it is ever painted.
 */
export function PortalSplash() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Whether this session already dismissed the banner is settled in CSS via
    // the data-splash attribute, so there's nothing to read back into state
    // here — only focus to move, and only when the banner is actually showing.
    if (document.documentElement.getAttribute("data-splash") === "seen") return;
    ref.current?.focus();
  }, []);

  /**
   * Mark the banner seen, then let the browser follow the link normally. A full
   * navigation rather than a client-side transition: it works identically from
   * any page and can't leave the overlay stranded. Writing the flag first means
   * the pre-paint script hides the banner on arrival.
   */
  function markSeen() {
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      // Private mode / storage disabled — the banner just shows again later.
    }
    document.documentElement.setAttribute("data-splash", "seen");
  }

  return (
    <div id="portal-splash" className="fixed inset-0 z-[100] bg-cream-100">
      {/* Fills the screen on anything wider than a phone. On a portrait phone
          filling would crop a 2.27:1 poster down to a slice of its middle, so
          there it is fitted whole instead. */}
      <Image
        src={BANNER_SRC}
        alt="Accounting Institute for Native Americans — Employee Resource Portal"
        fill
        priority
        // Served as-is rather than through the image optimizer: this is the
        // first thing painted, and the optimizer's first-request processing
        // left the panel blank for a beat on a cold cache.
        unoptimized
        className="object-contain sm:object-cover"
      />

      {/* Action bar. Drawn by us rather than relying on the button inside the
          artwork: that one moves and crops with the image, and there is nowhere
          in it for Login and Sign Up. Sitting at the bottom edge, it covers the
          artwork's own button band so the two don't compete. */}
      <div className="absolute inset-x-0 bottom-0 bg-teal-800/95 px-4 py-4 backdrop-blur-sm sm:py-5">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Link
            href="/login"
            onClick={markSeen}
            className="btn-outline-light min-w-[7rem] justify-center px-6 py-2.5"
          >
            Login
          </Link>

          {/* On a phone all three won't fit on one line, so this takes its own
              full-width row and Login/Sign Up share the one below it. */}
          <Link
            ref={ref}
            href="/"
            onClick={markSeen}
            className="btn-accent order-first w-full justify-center px-8 py-3 text-base sm:order-none sm:w-auto sm:text-lg"
          >
            Enter the Portal
          </Link>

          <Link
            href="/signup"
            onClick={markSeen}
            className="btn-outline-light min-w-[7rem] justify-center px-6 py-2.5"
          >
            Sign Up
          </Link>
        </div>

        <p className="mt-3 text-center text-sm italic text-cream-200">
          Choose an option above to continue
        </p>
      </div>
    </div>
  );
}
