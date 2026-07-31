"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Suggested gift amounts plus a custom box. There is no standalone donation
 * checkout on this site — contributions are added during seminar registration —
 * so every route out of here carries the chosen figure to /register as
 * ?amount=, where it lands in this cause's contribution box.
 */

const GIFTS = [
  { amount: "25", body: "Provides emergency supplies for a woman in crisis." },
  { amount: "50", body: "Supports legal advocacy and safety planning." },
  { amount: "100", body: "Helps fund healing services and counseling." },
  { amount: "250", body: "Provides safe shelter and support for families." },
];

export function GivePanel({ cause }: { cause: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  // A typed custom amount wins over a chosen chip; strip anything that isn't a
  // number so a stray character can't end up in the query string.
  const clean = custom.replace(/[^0-9.]/g, "");
  const amount = clean && parseFloat(clean) > 0 ? clean : picked;

  const href =
    `/register?cause=${encodeURIComponent(cause)}` +
    (amount ? `&amount=${encodeURIComponent(amount)}` : "");

  return (
    <>
      <ul className="mt-6 space-y-3">
        {GIFTS.map((g) => {
          const active = picked === g.amount && !clean;
          return (
            <li key={g.amount} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setPicked(g.amount);
                  setCustom("");
                }}
                aria-pressed={active}
                className={`w-20 shrink-0 rounded-md py-2 text-center font-display text-lg text-cream-50 transition-colors ${
                  active
                    ? "bg-[#5F1418] ring-2 ring-[#8B1E24] ring-offset-2 ring-offset-cream-100"
                    : "bg-[#8B1E24] hover:bg-[#741A1F]"
                }`}
              >
                ${g.amount}
              </button>
              <span className="text-sm leading-relaxed text-ink-soft">
                {g.body}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-1 items-stretch overflow-hidden rounded-md border border-cream-300 bg-cream-50">
          <span className="grid w-10 shrink-0 place-items-center border-r border-cream-300 bg-cream-100 font-display text-ink-soft">
            $
          </span>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            inputMode="decimal"
            placeholder="Other Amount"
            aria-label="Custom contribution amount"
            className="w-full min-w-0 bg-transparent px-3 py-2.5 text-ink outline-none placeholder:text-ink-soft/60"
          />
        </div>
        <span className="shrink-0 text-sm text-ink-soft">Custom Contribution</span>
      </div>

      <Link
        href={href}
        className="mt-4 block w-full rounded-md bg-[#8B1E24] py-3.5 text-center font-display text-lg uppercase tracking-wide text-cream-50 transition-colors hover:bg-[#741A1F]"
      >
        Donate Now
      </Link>
      <p className="mt-3 text-center text-xs text-ink-soft">
        Contributions are added during seminar registration, where you can also
        change the amount.
      </p>
    </>
  );
}
