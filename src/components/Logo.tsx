import Link from "next/link";
import Image from "next/image";
import { Anton } from "next/font/google";

/** Tall condensed display face for the wordmark, matching the brand lockup. */
const wordmark = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-logo",
});

export function Logo({
  className = "",
  variant = "dark",
  priority = false,
  size = "md",
}: {
  className?: string;
  variant?: "dark" | "light";
  /** Only the header logo is above the fold — leave false for the footer. */
  priority?: boolean;
  /** "md" is the full header lockup; "sm" is the compact footer lockup. */
  size?: "md" | "sm";
}) {
  const light = variant === "light";
  const sm = size === "sm";
  const emblem = sm
    ? "/images/logo-emblem-footer-v4.png"
    : "/images/logo-emblem-v2.png";
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3.5 ${wordmark.variable} ${className}`}
    >
      {/* Deliberately taller than the wordmark block beside it (which measures
          4 / 4.68 / 6.12rem — top line + my-2 + "For" row + the pb reserving the
          NATIVE AMERICANS row), so the emblem reads as the anchor of the lockup
          rather than matching the text's cap height. */}
      <span
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full transition-transform group-hover:scale-105 ${
          sm
            ? "-top-1.5 h-[5.4rem] w-[5.4rem]"
            : "-top-1 h-[5.2rem] w-[5.2rem] sm:-top-1.5 sm:h-[6.1rem] sm:w-[6.1rem] 2xl:-top-2.5 2xl:h-32 2xl:w-32"
        } ${light && !sm ? "bg-cream-50 p-0.5" : ""}`}
      >
        <Image
          src={emblem}
          alt=""
          width={128}
          height={128}
          className="h-full w-full object-contain"
          priority={priority}
        />
      </span>
      {/* Width is set by the ACCOUNTING INSTITUTE line alone; the NATIVE AMERICANS
          row is absolutely positioned across that width so it stays flush at both
          edges without ever stretching the top line. */}
      <span
        className={`relative block font-[family-name:var(--font-logo)] leading-none ${
          sm ? "pb-[1.28rem]" : "pb-[1.17rem] sm:pb-[1.43rem] 2xl:pb-[2.07rem]"
        }`}
      >
        <span
          className={`flex gap-[0.15em] whitespace-nowrap uppercase leading-none ${
            sm
              ? "text-[1.3rem] tracking-[0.06em]"
              : "tracking-[0.02em] text-[1.28rem] sm:text-[1.55rem] 2xl:text-[2.25rem]"
          } ${light ? "text-cream-50" : "text-navy-600"}`}
        >
          <span>Accounting</span>
          <span>Institute</span>
        </span>
        <span className={`flex items-center ${sm ? "my-2 gap-2" : "my-2 gap-2.5"}`}>
          <span className={`h-0.5 flex-1 rounded-full ${light ? "bg-gold-400" : "bg-rust-500"}`} />
          <span
            className={`uppercase leading-none tracking-[0.2em] ${
              sm ? "text-[0.6rem]" : "text-[0.55rem] sm:text-[0.7rem] 2xl:text-[0.8rem]"
            } ${light ? "text-cream-200" : "text-navy-600"}`}
          >
            For
          </span>
          <span className={`h-0.5 flex-1 rounded-full ${light ? "bg-gold-400" : "bg-rust-500"}`} />
        </span>
        <span
          /* Tracking wide enough that the two words fill the ACCOUNTING INSTITUTE
             width themselves — justify-between would otherwise dump every bit of
             slack into one hole between them. The footer lockup needs more of it:
             its top line carries extra tracking, so there's more width to soak
             up. The matching -mr trims the trailing space letter-spacing adds
             after the final "S", keeping the right edge aligned. */
          className={`absolute inset-x-0 bottom-0 flex justify-between gap-[0.35em] whitespace-nowrap uppercase leading-none ${
            sm
              ? "-mr-[0.22em] tracking-[0.22em] text-[1.2rem]"
              : "-mr-[0.16em] tracking-[0.16em] text-[1.17rem] sm:text-[1.43rem] 2xl:text-[2.07rem]"
          } ${light ? (sm ? "text-cream-50" : "text-teal-100") : "text-teal-600"}`}
        >
          <span>Native</span>
          <span>Americans</span>
        </span>
      </span>
    </Link>
  );
}
