"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BANNER_SRC, SPLASH_STORAGE_KEY } from "@/lib/splash";

/**
 * Full-screen welcome banner shown once per browsing session. The whole panel
 * is a link, so clicking anywhere goes to the home page.
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
    // A full navigation rather than a client-side transition: it is what the
    // banner is for, it works identically from any page, and it can't leave the
    // overlay stranded when the visitor is already on "/". The flag above is
    // written first, so the pre-paint script hides the banner on arrival.
    window.location.assign("/");
  }

  return (
    <Link
      ref={ref}
      id="portal-splash"
      href="/"
      onClick={enter}
      aria-label="Enter the portal — go to the home page"
      className="fixed inset-0 z-[100] block cursor-pointer bg-cream-100"
    >
      <Image
        src={BANNER_SRC}
        alt="Accounting Institute for Native Americans — Employee Resource Portal. Click anywhere to continue."
        fill
        priority
        // Contained on a 3:2 banner: on screens wider than 3:2 the height is
        // what constrains it, so the painted width is ~1.5x the viewport
        // height, not the full width. Telling the browser that avoids fetching
        // a needlessly large file on wide, short windows.
        sizes="(min-aspect-ratio: 3/2) 150vh, 100vw"
        // contain, not cover: the banner is dense with text, and cropping it on
        // tall or narrow screens would cut that text off.
        className="object-contain"
      />
    </Link>
  );
}
