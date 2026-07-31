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
      {/* Two copies of the same picture. The banner is 3:2 and browser windows
          are wider than that, so it can either be cropped or sit in bars —
          there is no object-fit that avoids both. This blurred, over-scaled
          copy fills the edges so nothing looks empty, while the sharp copy
          above it stays fully contained and loses none of the artwork. */}
      <Image
        src={BANNER_SRC}
        alt=""
        aria-hidden
        fill
        unoptimized
        className="scale-110 object-cover blur-2xl"
      />
      <Image
        src={BANNER_SRC}
        alt="Accounting Institute for Native Americans — Employee Resource Portal. Click anywhere to continue."
        fill
        priority
        // Served as-is rather than through the image optimizer. This is the
        // very first thing a visitor sees, and the optimizer's first-request
        // processing left the panel blank for a beat on a cold cache. The file
        // is ~270KB and already sized for the job, so there's little to gain
        // from resizing it and a visible cost to getting it late.
        unoptimized
        // contain: every part of the banner stays on screen, including the top
        // line and the ENTER THE PORTAL band at the bottom.
        className="object-contain"
      />
    </Link>
  );
}
