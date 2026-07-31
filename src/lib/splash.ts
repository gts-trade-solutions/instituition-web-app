/**
 * Constants shared by the welcome banner's server and client halves.
 *
 * These deliberately live outside PortalSplash.tsx: that file is a "use client"
 * module, and a value imported from one into a server component arrives as a
 * client-reference proxy rather than the value itself — so the layout's
 * existsSync() check would receive a function instead of a path.
 */

/** Banner artwork, relative to /public. Drop the file here to enable the splash. */
export const BANNER_SRC = "/images/portal-welcome.jpg";

/** sessionStorage key recording that this session already dismissed the banner. */
export const SPLASH_STORAGE_KEY = "portal-splash-seen";
