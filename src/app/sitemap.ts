import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Public, indexable marketing pages only — gated/auth/admin routes are excluded.
const ROUTES = [
  "",
  "/about",
  "/seminars",
  "/causes",
  "/why-it-matters",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
