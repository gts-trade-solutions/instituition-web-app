"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BANNER_SRC, SPLASH_STORAGE_KEY } from "@/lib/splash";

/**
 * Full-screen welcome banner shown once per browsing session. Only the "Enter
 * the Portal" button leaves it — clicking the artwork does nothing.
 *
 * The "already seen" flag lives in sessionStorage, which the server can't read,
 * so a naive render would either flash the site before the banner appears or
 * flash the banner at people who already dismissed it. The inline script in the
 * site layout avoids both: it stamps data-splash="seen" on <html> before first
 * paint, and CSS in globals.css hides this overlay when that attribute is
 * present. So the markup always renders on the server, and CSS — not React —
 * decides whether it is ever painted.
 */

/** Artwork dimensions, so the frame can match its aspect exactly. */
const ART_W = 2132;
const ART_H = 941;

/**
 * Where the "Enter the Portal" button sits inside the artwork, measured off the
 * image itself. The frame below is locked to the artwork's aspect ratio, so
 * these percentages land on the button at every screen size.
 */
const HOTSPOT = { left: "41.3%", top: "87.3%", width: "17.1%", height: "4.6%" };

export function PortalSplash() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Whether this session already dismissed the banner is settled in CSS via
    // the data-splash attribute, so there's nothing to read back into state
    // here — only focus to move, and only when the banner is actually showing.
    if (document.documentElement.getAttribute("data-splash") === "seen") return;
    ref.current?.focus();
  }, []);

  function enter(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab/window, middle-click) behave normally.
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      // Private mode / storage disabled — the banner just shows again later.
    }
    // A full navigation rather than a client-side transition: it works
    // identically from any page and can't leave the overlay stranded when the
    // visitor is already on "/". The flag above is written first, so the
    // pre-paint script hides the banner on arrival.
    window.location.assign("/");
  }

  return (
    <div
      id="portal-splash"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 overflow-y-auto bg-cream-100 p-4"
    >
      {/* Frame locked to the artwork's aspect and sized to fit the viewport, so
          the whole poster is always visible. Cover-cropping it left phones
          showing a narrow slice of the middle. */}
      <div
        className="relative w-[min(100%,calc((100svh-8rem)*2.2657))] shrink-0"
        style={{ aspectRatio: `${ART_W} / ${ART_H}` }}
      >
        <Image
          src={BANNER_SRC}
          alt="Accounting Institute for Native Americans — Employee Resource Portal"
          fill
          priority
          // Served as-is rather than through the image optimizer: this is the
          // first thing painted, and the optimizer's first-request processing
          // left the panel blank for a beat on a cold cache.
          unoptimized
          className="object-contain"
        />

        {/* Sits exactly over the button drawn into the artwork. Hidden on small
            screens, where the poster shrinks until that button is far too small
            to tap — the real button below serves there instead. */}
        <Link
          ref={ref}
          href="/"
          onClick={enter}
          aria-label="Enter the portal"
          className="absolute hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust-500 sm:block"
          style={HOTSPOT}
        />
      </div>

      {/* On phones the poster is too small for its drawn button to be a usable
          target, so the same action gets a real one. */}
      <Link
        href="/"
        onClick={enter}
        className="btn-accent shrink-0 px-8 py-3 text-base sm:hidden"
      >
        Enter the Portal
      </Link>
    </div>
  );
}
