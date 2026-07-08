import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Facebook, Linkedin, Youtube } from "./SocialIcons";
import { Logo } from "./Logo";
import { WovenBorder } from "./WovenBorder";
import { getSiteContent } from "@/lib/content";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/seminars", label: "Seminars" },
  { href: "/causes", label: "Causes & Giving" },
  { href: "/why-it-matters", label: "Why It Matters" },
  { href: "/contact", label: "Contact" },
];

// TODO(client): replace "#" with the institute's real social profile URLs.
const socials = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

export async function Footer() {
  const site = await getSiteContent();
  return (
    <footer className="mt-0">
      <div className="bg-[#001733] text-cream-100">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white">
              {site.footerTagline}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full bg-ocean-500 text-white transition-colors hover:bg-ocean-600"
                  aria-label={`AI Institute on ${label}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-cream-50">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {quickLinks.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-white transition-colors hover:text-gold-400"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-cream-50">
              Contact Us
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm text-white">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-400" />
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-gold-400"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-gold-400">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>
                  {site.address}
                  <br />
                  {site.cityStateZip}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-cream-50">
              Stay Connected
            </h4>
            <p className="mt-5 text-sm text-white">
              Sign up for updates on upcoming seminars and resources.
            </p>
            <form className="mt-4 space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for seminar updates
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-white/15 bg-white px-4 py-2.5 text-sm text-navy-700 outline-none focus:ring-2 focus:ring-gold-400"
              />
              <button type="submit" className="btn-accent w-full py-2.5">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-200/60 sm:flex-row">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link href="/privacy" className="hover:text-cream-50">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-cream-50">Terms of Use</Link>
              <span className="text-cream-200/50">
                Designed &amp; developed by{" "}
                <a
                  href="https://raceinnovations.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold-400 transition-colors hover:text-gold-300"
                >
                  Race Innovations
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <WovenBorder size="lg" />
    </footer>
  );
}
