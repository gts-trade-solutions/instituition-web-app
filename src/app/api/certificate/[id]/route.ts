import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { renderCertificateHtml } from "@/lib/certificate";

/**
 * Serves a registration's Certificate of Registration as a standalone HTML
 * document — the same one attached to the confirmation email. The success page
 * frames this so the certificate appears in the UI straight after registering,
 * and opening it directly gives a print-ready page.
 *
 * Only the registration's own owner may fetch it. A missing registration and
 * someone else's registration both return 404, so this can't be used to probe
 * which ids exist.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const user = await getUser();
  if (!user) return new NextResponse("Not found", { status: 404 });

  let reg;
  try {
    reg = await prisma.registration.findUnique({ where: { id } });
  } catch (err) {
    console.error("[certificate] lookup failed:", err);
    return new NextResponse("Unavailable", { status: 503 });
  }

  if (!reg || reg.userId !== user.userId) {
    return new NextResponse("Not found", { status: 404 });
  }

  const html = renderCertificateHtml({
    fullName: reg.fullName,
    registrationId: reg.id,
    issuedAt: reg.createdAt,
    track: reg.role,
  });

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Personal, and cheap to regenerate — don't let anything cache it.
      "cache-control": "private, no-store, max-age=0",
    },
  });
}
