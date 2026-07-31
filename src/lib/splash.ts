/**
 * Constants shared by the welcome banner's server and client halves.
 *
 * These deliberately live outside PortalSplash.tsx: that file is a "use client"
 * module, and a value imported from one into a server component arrives as a
 * client-reference proxy rather than the value itself — so the layout's
 * existsSync() check would receive a function instead of a path.
 */

/**
 * Banner artwork, relative to /public. The splash only mounts when this file
 * exists.
 *
 * This is the supplied 16:9 poster widened to ~2.27:1 by clamping its outermost
 * pixel column outwards on each side. A browser window is wider than 16:9 once
 * the tab strip and bookmarks bar take their share, so filling it with the
 * original meant cropping the top line and the ENTER THE PORTAL band. With the
 * padding there, the crop lands on the streaked margins and the whole poster
 * survives. portal-welcome.jpg beside it is the untouched original.
 */
export const BANNER_SRC = "/images/portal-welcome-wide.jpg";

/** sessionStorage key recording that this session already dismissed the banner. */
export const SPLASH_STORAGE_KEY = "portal-splash-seen";
