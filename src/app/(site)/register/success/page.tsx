import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = { title: "Registration Confirmed" };

type View = {
  state: "confirmed" | "demo" | "pending";
  amountCents: number | null;
  email: string | null;
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    demo?: string;
    rid?: string;
    paypal?: string;
    reconcile?: string;
  }>;
}) {
  const sp = await searchParams;
  const user = await getUser();
  const reconciling = sp.reconcile === "1";

  // Resolve the registration, verify the current user owns it, and derive the
  // display state. This page is READ-ONLY — the PAID transition is owned by the
  // PayPal capture route, never by a render.
  const regId = sp.rid ?? null;

  let view: View | null = null;
  if (regId && user) {
    try {
      const reg = await prisma.registration.findUnique({ where: { id: regId } });
      if (reg && reg.userId === user.userId) {
        if (sp.demo) {
          view = { state: "demo", amountCents: reg.amountCents, email: reg.email };
        } else {
          view = {
            state: reg.status === "PAID" ? "confirmed" : "pending",
            amountCents: reg.amountCents,
            email: reg.email,
          };
        }
      }
    } catch {
      // Ignore — falls through to the "couldn't confirm" state.
    }
  }

  // ── Could not verify ownership / payment ──────────────────────
  if (!view) {
    return (
      <Shell
        icon={<AlertCircle className="h-11 w-11" />}
        tint="bg-cream-200 text-ink-soft"
        title="We couldn't confirm this registration"
        body={
          user
            ? "If you just completed a payment, it may take a moment to appear. Check your account for the latest status."
            : "Please sign in to view your registration and its payment status."
        }
        primary={user ? { href: "/account", label: "Go to My Account" } : { href: "/login", label: "Sign In" }}
      />
    );
  }

  // ── Payment not yet confirmed ─────────────────────────────────
  if (view.state === "pending") {
    return (
      <Shell
        icon={<Clock className="h-11 w-11" />}
        tint="bg-gold-400/15 text-gold-500"
        title={reconciling ? "We're finalizing your payment" : "Payment processing"}
        body={
          reconciling
            ? "Your payment went through, but we're still recording it. It will appear in your account shortly — please contact us if it doesn't."
            : "We haven't received confirmation of your payment yet. This page will reflect it once your bank or PayPal completes the charge."
        }
        primary={{ href: "/account", label: "View My Account" }}
      />
    );
  }

  // ── Confirmed / demo ──────────────────────────────────────────
  const isDemo = view.state === "demo";
  return (
    <Shell
      icon={<CheckCircle2 className="h-11 w-11" />}
      tint="bg-teal-50 text-teal-600"
      title="You're registered!"
      body={
        isDemo
          ? "This is a demo confirmation — no real charge was made."
          : "Thank you for registering. A confirmation has been sent to your email."
      }
      details={{ email: view.email, amountCents: view.amountCents }}
      primary={{ href: "/", label: "Back to Home" }}
    />
  );
}

function Shell({
  icon,
  tint,
  title,
  body,
  details,
  primary,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  body: string;
  details?: { email: string | null; amountCents: number | null };
  primary: { href: string; label: string };
}) {
  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-20">
      <div className="card max-w-lg p-8 text-center sm:p-12">
        <span className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${tint}`}>
          {icon}
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-teal-800">{title}</h1>
        <p className="mt-3 text-ink-soft">{body}</p>

        {details && (details.amountCents != null || details.email) && (
          <div className="mt-6 space-y-2 rounded-xl bg-cream-100 p-5 text-left text-sm">
            {details.email && (
              <div className="flex justify-between">
                <span className="text-ink-soft">Confirmation email</span>
                <span className="font-medium text-ink">{details.email}</span>
              </div>
            )}
            {details.amountCents != null && (
              <div className="flex justify-between">
                <span className="text-ink-soft">Amount</span>
                <span className="font-medium text-ink">
                  {formatCurrency(details.amountCents)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={primary.href} className="btn-primary">
            {primary.label} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/seminars" className="btn-outline">
            View Seminars
          </Link>
        </div>
      </div>
    </section>
  );
}
