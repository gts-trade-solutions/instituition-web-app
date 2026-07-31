"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BANNER_SRC, SPLASH_STORAGE_KEY } from "@/lib/splash";

/**
 * Full-screen welcome banner shown once per browsing session. Clicking (or
 * pressing a key) anywhere dismisses it and reveals the site underneath.
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
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Whether this session already dismissed the banner is settled in CSS via
    // the data-splash attribute, so there's nothing to read back into state
    // here — only focus to move, and only when the banner is actually showing.
    if (document.documentElement.getAttribute("data-splash") === "seen") return;
    ref.current?.focus();
  }, []);

  function dismiss() {
    if (leaving) return;
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      // Nothing to do — it just means the banner shows again next navigation.
    }
    document.documentElement.setAttribute("data-splash", "seen");
    setLeaving(true);
    window.setTimeout(() => setGone(true), 400);
  }

  if (gone) return null;

  return (
    <button
      ref={ref}
      id="portal-splash"
      type="button"
      onClick={dismiss}
      onKeyDown={(e) => {
        // Enter/Space already fire onClick for a button; catch Escape too so the
        // banner behaves like any other dismissible overlay.
        if (e.key === "Escape") dismiss();
      }}
      aria-label="Enter the site"
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-cream-100 transition-opacity duration-[400ms] ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src={BANNER_SRC}
        alt="Accounting Institute for Native Americans — Employee Resource Portal. Click anywhere to continue."
        fill
        priority
        // Contained on a 3:2 banner: on screens wider than 3:2 the height is
        // what constrains it, so the painted width is ~1.5x the viewport
        // height, not the full width. Telling the browser that avoids
        // fetching a needlessly large file on wide, short windows.
        sizes="(min-aspect-ratio: 3/2) 150vh, 100vw"
        // contain, not cover: the banner is dense with text, and cropping it
        // on tall or narrow screens would cut that text off.
        className="object-contain"
      />
    </button>
  );
}
