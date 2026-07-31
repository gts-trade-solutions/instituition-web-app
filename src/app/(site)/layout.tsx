import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuickActions } from "@/components/QuickActions";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MobileNav } from "@/components/MobileNav";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { PortalSplash } from "@/components/PortalSplash";
import { BANNER_SRC, SPLASH_STORAGE_KEY } from "@/lib/splash";
import { getUser } from "@/lib/user-auth";

const BANNER_FILE = join(process.cwd(), "public", BANNER_SRC);

/**
 * Runs before first paint: if this session already dismissed the welcome
 * banner, stamp <html data-splash="seen"> so the CSS in globals.css hides the
 * overlay immediately. Without it, returning visitors would see the banner
 * flash for a frame before React could remove it.
 */
const SPLASH_NO_FLASH = `try{if(sessionStorage.getItem(${JSON.stringify(
  SPLASH_STORAGE_KEY,
)})==='1')document.documentElement.setAttribute('data-splash','seen')}catch(e){}`;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  // The banner artwork is supplied separately, so only mount the splash once
  // the file exists. Deciding it here — on the server, where we can just look —
  // beats letting the browser discover a missing image: no broken overlay, and
  // no full-screen blocker for a picture that isn't there. Checked per render
  // rather than once at module load so dropping the file in takes effect
  // immediately; it's one stat() on a page that already awaits a DB session.
  const hasBanner = existsSync(BANNER_FILE);
  return (
    <div className="flex min-h-full flex-col">
      {hasBanner && (
        <>
          <script dangerouslySetInnerHTML={{ __html: SPLASH_NO_FLASH }} />
          {/* Without JS the overlay could never be dismissed, so hide it. */}
          <noscript>
            <style>{`#portal-splash{display:none!important}`}</style>
          </noscript>
          <PortalSplash />
        </>
      )}
      {/* Content layer sits ABOVE the footer with an opaque background, so the
          sticky footer below is hidden until the page scrolls up to reveal it. */}
      <div className="relative z-10 flex flex-1 flex-col bg-[#fbf3ea]">
        <Navbar user={user ? { name: user.name } : null} />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      <QuickActions />
      <ScrollToTop />
      <MobileNav />
    </div>
  );
}
