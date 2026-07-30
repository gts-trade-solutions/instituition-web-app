import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";

/** Condensed display face used for headings, prices, and buttons (matches the demo). */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const SITE_NAME = "Accounting Institute for Native Americans";
const SITE_DESCRIPTION =
  "2-day hands-on training that equips tribal professionals and community members with AI, financial, and career skills to build stronger Nations.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/images/home-hero-banner.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/home-hero-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`h-full scroll-smooth antialiased ${anton.variable}`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
