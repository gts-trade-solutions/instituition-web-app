import { NextResponse } from "next/server";
import { captureOrder, isPayPalEnabled } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";
import { sendRegistrationConfirmation } from "@/lib/email";

/**
 * PayPal return URL. After the buyer approves the payment, PayPal redirects
 * here with ?token=<orderId> (and ?PayerID=...). We verify the order belongs
 * to this registration, capture it, confirm the captured amount matches, then
 * mark the registration PAID. Any failure sends the buyer back to /register.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const rid = url.searchParams.get("rid");
  const orderId = url.searchParams.get("token");
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  const cancel = () => NextResponse.redirect(`${base}/register?canceled=1`);
  const success = () =>
    NextResponse.redirect(`${base}/register/success?rid=${rid ?? ""}&paypal=1`);

  if (!isPayPalEnabled || !orderId || !rid) return cancel();

  let reg;
  try {
    reg = await prisma.registration.findUnique({
      where: { id: rid },
      include: { seminar: true },
    });
  } catch (err) {
    console.error("[paypal] registration lookup failed:", err);
    return cancel();
  }

  // The order id we redirected the buyer with must match the one we stored for
  // this registration — otherwise a caller could mark an arbitrary rid PAID.
  if (!reg || reg.paymentRef !== orderId) return cancel();

  // Idempotent: a refresh/prefetch of the return URL shouldn't re-capture.
  if (reg.status === "PAID") return success();

  let result;
  try {
    result = await captureOrder(orderId);
  } catch (err) {
    console.error("[paypal] capture failed:", err);
    return cancel();
  }

  if (!result.completed) return cancel();

  // Confirm PayPal captured the amount we actually charged for.
  if (result.amountCents != null && result.amountCents !== reg.amountCents) {
    console.error(
      `[paypal] amount mismatch for reg ${rid}: captured ${result.amountCents} vs owed ${reg.amountCents}`,
    );
    return cancel();
  }

  try {
    await prisma.registration.update({
      where: { id: rid },
      data: { status: "PAID" },
    });
    await sendRegistrationConfirmation({
      email: reg.email,
      fullName: reg.fullName,
      amountCents: reg.amountCents,
      cause: reg.cause,
      seminarStart: reg.seminar?.startDate ?? null,
      seminarEnd: reg.seminar?.endDate ?? null,
      seminarLocation: reg.seminar?.location ?? null,
    });
  } catch (err) {
    // Money was taken but we failed to record it — this needs manual
    // reconciliation, so log loudly and flag it on the confirmation page.
    console.error(
      `[paypal] PAID UPDATE FAILED AFTER CAPTURE — reconcile reg ${rid}, order ${orderId}:`,
      err,
    );
    return NextResponse.redirect(
      `${base}/register/success?rid=${rid}&paypal=1&reconcile=1`,
    );
  }

  return success();
}
