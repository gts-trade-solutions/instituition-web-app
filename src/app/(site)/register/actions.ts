"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createOrder, isPayPalEnabled } from "@/lib/paypal";
import { getUser } from "@/lib/user-auth";
import { sendRegistrationConfirmation } from "@/lib/email";

/** Fallback seat price when no real seminar row is selected (matches the demo). */
const DEFAULT_SEAT_CENTS = 159500;

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  organization: z.string().optional(),
  role: z.string().optional(),
  descriptor: z.string().optional(),
  seminarId: z.string().optional(),
  cause: z.string().optional(),
  // Only the OPTIONAL contribution is client-supplied; the seat fee is always
  // derived server-side from the selected seminar. Cap keeps a fat-fingered or
  // tampered value from creating an absurd charge.
  contributionCents: z.coerce.number().int().min(0).max(10_000_00),
});

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitRegistration(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // Only signed-in users may register — mirror the page-level gate on the action.
  const user = await getUser();
  if (!user) {
    redirect("/signup?redirect=/register");
  }

  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    organization: formData.get("organization"),
    role: formData.get("role"),
    descriptor: formData.get("descriptor"),
    seminarId: formData.get("seminarId"),
    cause: formData.get("cause"),
    contributionCents: formData.get("contributionCents"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const d = parsed.data;
  // Ignore the fallback pseudo-ids (they aren't real DB rows).
  const requestedSeminarId =
    d.seminarId && !d.seminarId.startsWith("fallback-") ? d.seminarId : null;

  // Derive the seat fee from the DB — the client only supplies the optional
  // contribution, so a tampered form can't discount the registration.
  let seatCents = DEFAULT_SEAT_CENTS;
  let seminarId: string | null = requestedSeminarId;
  if (requestedSeminarId) {
    try {
      const seminar = await prisma.seminar.findUnique({
        where: { id: requestedSeminarId },
        select: {
          priceCents: true,
          capacity: true,
          _count: { select: { registrations: { where: { status: "PAID" } } } },
        },
      });
      if (seminar) {
        seatCents = seminar.priceCents;
        // Best-effort sold-out guard. Not a hard reservation (a transactional
        // check at capture time would be needed to fully prevent a concurrent
        // race), but it stops new sign-ups once the seminar is full.
        if (seminar._count.registrations >= seminar.capacity) {
          return {
            error: "This seminar is fully booked. Please choose another date.",
          };
        }
      } else {
        // Row vanished between page load and submit — don't attach a dead FK.
        seminarId = null;
      }
    } catch {
      return { error: "Could not verify the seminar. Please try again." };
    }
  }

  const email = d.email.toLowerCase().trim();
  const amountCents = seatCents + d.contributionCents;

  // Payment gateways reject zero/sub-cent charges — guard server-side.
  if (amountCents < 100) {
    return { error: "The registration total must be at least $1.00." };
  }

  let registrationId: string;
  try {
    const reg = await prisma.registration.create({
      data: {
        fullName: d.fullName,
        email,
        phone: d.phone || null,
        organization: d.organization || null,
        role: d.role || null,
        descriptor: d.descriptor || null,
        cause: d.cause || null,
        amountCents,
        seminarId,
        userId: user.userId,
      },
    });
    registrationId = reg.id;
  } catch {
    return { error: "Could not save your registration. Please try again." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // ── PayPal checkout ──────────────────────────────────────────
  // Active when PayPal credentials are configured. Create an order, stash its
  // id on the registration, then redirect the buyer to PayPal's approval page.
  // redirect() runs OUTSIDE the try/catch (it throws a control signal).
  if (isPayPalEnabled) {
    let approveUrl: string | null = null;
    try {
      const order = await createOrder({
        amountCents,
        referenceId: registrationId,
        description: d.cause
          ? `Seminar registration — supporting ${d.cause}`
          : "AI Institute — 2-Day Seminar Registration",
        returnUrl: `${siteUrl}/api/paypal/capture?rid=${registrationId}`,
        cancelUrl: `${siteUrl}/register?canceled=1`,
      });
      await prisma.registration.update({
        where: { id: registrationId },
        data: { paymentRef: order.id },
      });
      approveUrl = order.approveUrl;
    } catch (err) {
      console.error("[paypal] create order failed:", err);
      return {
        error:
          "Payment could not be started. Please check your details and try again.",
      };
    }

    if (approveUrl) redirect(approveUrl);
    return { error: "Payment could not be started. Please try again." };
  }

  // ── Demo mode (no PayPal keys) ───────────────────────────────
  // No real payment to confirm, so send the confirmation now (no-op unless SES
  // is configured). Must run before redirect() — redirect throws.
  await sendRegistrationConfirmation({
    email,
    fullName: d.fullName,
    amountCents,
    cause: d.cause || null,
  });
  redirect(`/register/success?demo=1&rid=${registrationId}`);
}
