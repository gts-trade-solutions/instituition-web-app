"use client";

import { type ChangeEvent, useActionState, useState } from "react";
import {
  Lock,
  AlertCircle,
  ShieldCheck,
  User,
  Calendar,
  ClipboardList,
  HeartHandshake,
  Users,
  Droplet,
  Feather,
  Tag,
} from "lucide-react";
import { submitRegistration, type RegisterState } from "./actions";
import { formatCurrency, formatDateRange } from "@/lib/format";

type SeminarOption = {
  id: string;
  startDate: string;
  endDate: string;
  priceCents: number;
};

const roles = [
  "Finance / Accounting",
  "Grants / Program Manager",
  "Enterprise & Operations",
  "Workforce / Education",
  "Tribal Member / Job Seeker",
  "Other",
];

const causeDefs = [
  {
    key: "women",
    name: "Protecting Native American Women",
    desc: "Support programs that provide safety, resources, and empowerment.",
    Icon: Users,
    ring: "bg-[#6b46a3]",
    text: "text-[#6b46a3]",
  },
  {
    key: "water",
    name: "Protecting Our Water",
    desc: "Safeguard clean water for our people, our lands, and future generations.",
    Icon: Droplet,
    ring: "bg-teal-600",
    text: "text-teal-700",
  },
  {
    key: "sovereignty",
    name: "Supporting Native American Sovereignty",
    desc: "Strengthen self-governance, protect rights, and build a strong future for our Nations.",
    Icon: Feather,
    ring: "bg-rust-500",
    text: "text-rust-600",
  },
] as const;

const initial: RegisterState = {};

/** Map a ?cause= label (from a Causes page link) to a contribution key, if any. */
function matchCauseKey(label?: string): string | null {
  if (!label) return null;
  const l = label.trim().toLowerCase();
  const hit = causeDefs.find((c) => {
    const n = c.name.toLowerCase();
    return n === l || n.includes(l) || l.includes(n);
  });
  return hit?.key ?? null;
}

function weekdayRange(startISO: string, endISO: string) {
  // Dates are UTC midnight — format in UTC so the weekday doesn't shift a day.
  const opt = { weekday: "long", timeZone: "UTC" } as const;
  const s = new Date(startISO).toLocaleDateString("en-US", opt);
  const e = new Date(endISO).toLocaleDateString("en-US", opt);
  return `${s} – ${e}`;
}

export function RegisterForm({
  seminars,
  defaultSeminarId,
  defaultCause,
  defaultName,
  defaultEmail,
  paymentProvider,
}: {
  seminars: SeminarOption[];
  defaultSeminarId?: string;
  defaultCause?: string;
  defaultName?: string;
  defaultEmail?: string;
  /** Active gateway label ("PayPal"), or null for demo mode. */
  paymentProvider: string | null;
}) {
  const [state, action, pending] = useActionState(submitRegistration, initial);
  // Only accept a default that maps to a real radio, otherwise the posted
  // seminarId and the displayed seat price can silently diverge.
  const [seminarId, setSeminarId] = useState(
    seminars.some((s) => s.id === defaultSeminarId)
      ? (defaultSeminarId as string)
      : (seminars[0]?.id ?? ""),
  );
  const [contrib, setContrib] = useState<Record<string, string>>({
    women: "",
    water: "",
    sovereignty: "",
    custom: "",
  });

  // Cause the visitor arrived to support (from a "Causes & Giving" link,
  // e.g. /register?cause=Protecting%20Our%20Water). Highlighted below and
  // recorded even if no money is contributed, so their intent isn't lost.
  const preselectedCauseKey = matchCauseKey(defaultCause);

  const selected = seminars.find((s) => s.id === seminarId) ?? seminars[0];
  const seatPrice = selected?.priceCents ?? 159500;
  const contribCents = Object.values(contrib).reduce(
    (sum, v) => sum + Math.round((parseFloat(v || "0") || 0) * 100),
    0,
  );
  const totalCents = seatPrice + contribCents;
  const selectedCauses = causeDefs
    .filter(
      (c) =>
        c.key === preselectedCauseKey ||
        (parseFloat(contrib[c.key] || "0") || 0) > 0,
    )
    .map((c) => c.name);

  // Mirror the server-side contribution cap ($10,000) so the user gets inline
  // feedback instead of a generic error after submitting.
  const MAX_CONTRIB_CENTS = 10_000_00;
  const contribTooHigh = contribCents > MAX_CONTRIB_CENTS;

  return (
    <form
      action={action}
      className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
    >
      {/* Hidden values the server action needs. The seat fee is derived
          server-side from seminarId — only the optional contribution is sent. */}
      <input type="hidden" name="contributionCents" value={contribCents} />
      <input type="hidden" name="cause" value={selectedCauses.join(", ")} />

      {/* ── Left column ─────────────────────────────────────────── */}
      <div className="space-y-8">
        {state.error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SectionHeader icon={User} title="Participant Information" />

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" required defaultValue={defaultName} error={state.fieldErrors?.fullName} />
            <Field label="Email Address" name="email" type="email" required defaultValue={defaultEmail} error={state.fieldErrors?.email} />
          </div>
          <Field label="Phone Number" name="phone" type="tel" required />
          <Field label="Organization / Tribe" name="organization" required />

          <div>
            <label htmlFor="role" className="field-label">
              Which best describes you? <span className="text-rust-500">*</span>
            </label>
            <select id="role" name="role" className="field-input" defaultValue="" required>
              <option value="" disabled>
                Select the option that best fits your role
              </option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Seminar dates */}
        <fieldset id="dates" className="scroll-mt-28 space-y-4">
          <legend className="sr-only">Select a seminar date</legend>
          <SectionHeader icon={Calendar} title="Select Seminar Date" />
          <div className="space-y-3">
            {seminars.map((s) => {
              const active = seminarId === s.id;
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    active
                      ? "border-teal-600 bg-teal-50/60"
                      : "border-cream-300 bg-cream-50 hover:bg-cream-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="seminarId"
                    value={s.id}
                    checked={active}
                    onChange={() => setSeminarId(s.id)}
                    className="h-4 w-4 border-cream-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    <span className="block font-semibold text-navy-600">
                      {formatDateRange(s.startDate, s.endDate)}
                    </span>
                    <span className="block text-xs text-ink-soft">
                      {weekdayRange(s.startDate, s.endDate)}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-cream-300 bg-teal-50/40 px-4 py-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-teal-700" />
            <p className="text-sm text-ink-soft">
              Your information is secure and will never be shared. We respect your privacy.
            </p>
          </div>
        </fieldset>
      </div>

      {/* ── Right column ────────────────────────────────────────── */}
      <div className="space-y-6 lg:sticky lg:top-24">
        {/* Seminar summary */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 bg-teal-800 px-5 py-4">
            <ClipboardList className="h-5 w-5 text-cream-50" />
            <h3 className="font-display font-bold uppercase tracking-wide text-cream-50">
              Seminar Summary
            </h3>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Selected Date:
              </p>
              <p className="font-display text-xl font-bold text-navy-600">
                {selected ? formatDateRange(selected.startDate, selected.endDate) : "—"}
              </p>
              {selected && (
                <p className="text-sm text-ink-soft">
                  {weekdayRange(selected.startDate, selected.endDate)}
                </p>
              )}
            </div>
            <p className="border-t border-cream-200 pt-4 text-sm text-ink-soft">
              2-Day Hands-On Training &nbsp;|&nbsp; Meals Included &nbsp;|&nbsp; Certificate Provided
            </p>
            <div className="flex items-start justify-between border-t border-cream-200 pt-4">
              <div>
                <p className="font-semibold text-ink">Registration Fee</p>
                <p className="mt-1 max-w-[16rem] text-xs text-ink-soft">
                  Includes training materials, breakfast, snacks, lunch both days, AI tool
                  resources, and certificate.
                </p>
              </div>
              <p className="font-display text-xl font-bold text-navy-600">
                {formatCurrency(seatPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Optional contributions */}
        <div className="card space-y-5 p-5">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="h-6 w-6 text-teal-700" />
            <div>
              <h3 className="font-display font-bold uppercase tracking-wide text-teal-800">
                Optional Contributions
              </h3>
              <p className="text-xs text-ink-soft">
                100% of contributions go directly to these causes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {causeDefs.map((c) => {
              const preselected = c.key === preselectedCauseKey;
              return (
                <div
                  key={c.key}
                  className={`flex items-start gap-3 ${
                    preselected
                      ? "-mx-2 rounded-lg bg-teal-50/70 px-2 py-2 ring-1 ring-teal-600/40"
                      : ""
                  }`}
                >
                  <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full text-cream-50 ${c.ring}`}>
                    <c.Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${c.text}`}>{c.name}</p>
                    {preselected ? (
                      <p className="text-xs font-medium text-teal-700">
                        You&apos;re supporting this cause — add an optional contribution.
                      </p>
                    ) : (
                      <p className="text-xs text-ink-soft">{c.desc}</p>
                    )}
                  </div>
                  <AmountInput
                    label={`Contribution to ${c.name}`}
                    value={contrib[c.key]}
                    onChange={(v) => setContrib((prev) => ({ ...prev, [c.key]: v }))}
                  />
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-3 border-t border-cream-200 pt-4">
              <p className="text-sm text-ink">Custom Amount (optional)</p>
              <AmountInput
                label="Custom contribution amount"
                value={contrib.custom}
                onChange={(v) => setContrib((prev) => ({ ...prev, custom: v }))}
              />
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="card space-y-4 p-5">
          <div className="flex items-center gap-2.5">
            <Tag className="h-5 w-5 text-teal-700" />
            <h3 className="font-display font-bold uppercase tracking-wide text-teal-800">
              Payment Summary
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Seminar Registration Fee</span>
              <span className="font-medium text-ink">{formatCurrency(seatPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Total Contributions</span>
              <span className="font-medium text-ink">{formatCurrency(contribCents)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-cream-200 pt-4">
            <span className="font-display text-xl font-bold text-teal-800">TOTAL</span>
            <span className="font-display text-2xl font-bold text-teal-800">
              {formatCurrency(totalCents)}
            </span>
          </div>

          {contribTooHigh && (
            <p className="flex items-center gap-2 rounded-md bg-rust-500/10 px-3 py-2 text-xs text-rust-600" role="alert">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Contributions can total at most {formatCurrency(MAX_CONTRIB_CENTS)}. Please
              lower the amount.
            </p>
          )}

          <button
            type="submit"
            disabled={pending || totalCents < 100 || contribTooHigh}
            className="btn-accent w-full"
          >
            <Lock className="h-4 w-4" />
            {pending ? "Processing…" : "Proceed to Secure Payment"}
          </button>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
            <Lock className="h-3.5 w-3.5 text-teal-600" />
            {paymentProvider
              ? `Secure, encrypted checkout powered by ${paymentProvider}.`
              : "Demo mode — no real charge will be made."}
          </p>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof User;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-800 text-cream-50">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-navy-600">
        {title}
      </h2>
    </div>
  );
}

/** Keep only digits and a single decimal point, capped at 2 decimal places. */
function sanitizeAmount(raw: string): string {
  let v = raw.replace(/[^\d.]/g, "");
  const dot = v.indexOf(".");
  if (dot !== -1) {
    const intPart = v.slice(0, dot);
    const decPart = v.slice(dot + 1).replace(/\./g, "").slice(0, 2);
    v = `${intPart}.${decPart}`;
  }
  return v;
}

/** Add thousands separators to the integer part (kicks in at 1,000+). */
function withCommas(clean: string): string {
  if (clean === "") return "";
  const [intPart, decPart] = clean.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return clean.includes(".") ? `${grouped}.${decPart ?? ""}` : grouped;
}

/** Currency input: displays cents + comma separators, reports a clean numeric string. */
function AmountInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [display, setDisplay] = useState(() => withCommas(value));

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const clean = sanitizeAmount(e.target.value);
    onChange(clean);
    setDisplay(withCommas(clean));
  }

  function handleBlur() {
    if (value === "") {
      setDisplay("");
      return;
    }
    const n = parseFloat(value) || 0;
    // Always show cents (two decimals) and commas so amounts read unambiguously.
    setDisplay(
      n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
    onChange(n.toFixed(2));
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <span className="text-sm text-ink-soft" aria-hidden="true">$</span>
      <input
        type="text"
        inputMode="decimal"
        aria-label={label}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0.00"
        className="w-24 rounded-lg border border-cream-300 bg-white px-3 py-2 text-right text-sm focus:border-teal-500 focus:ring-teal-500"
      />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label} {required && <span className="text-rust-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="field-input"
      />
      {error && <p className="mt-1 text-xs text-rust-600">{error}</p>}
    </div>
  );
}
