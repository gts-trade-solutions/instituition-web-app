import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge-of-app auth gate (defense in depth). The authoritative checks still live
 * in each page/server action (requireUser / requireAdmin) — this just ensures a
 * newly added /admin or /account route can't be silently public if someone
 * forgets the in-page guard. Next 16 renamed `middleware` to `proxy`.
 */
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
);
const ISSUER = "aiinstitute";

async function isValid(
  token: string | undefined,
  audience: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience,
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const ok = await isValid(
      req.cookies.get("ai_admin_session")?.value,
      "aiinstitute:admin",
    );
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    const ok = await isValid(
      req.cookies.get("ai_user_session")?.value,
      "aiinstitute:user",
    );
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
