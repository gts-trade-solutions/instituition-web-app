import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./auth";

const COOKIE_NAME = "ai_user_session";
const ISSUER = "aiinstitute";
const AUDIENCE = "aiinstitute:user";

/** Signing key. Missing AUTH_SECRET is fatal in production (never use a repo default). */
function loadSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET must be set to a strong value (>=16 chars) in production.",
      );
    }
    return new TextEncoder().encode("dev-insecure-secret-change-me");
  }
  return new TextEncoder().encode(s);
}
const secret = loadSecret();

export type UserSession = {
  userId: string;
  email: string;
  name: string;
};

/* ─── Session ──────────────────────────────────────────────── */

export async function createUserSession(payload: UserSession): Promise<void> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return { userId: payload.userId, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

/** Use in protected user pages — redirects to /login if not signed in. */
export async function requireUser(): Promise<UserSession> {
  const session = await getUser();
  if (!session) redirect("/login");
  return session;
}

/* ─── Accounts ─────────────────────────────────────────────── */

const normalizeEmail = (email: string) => email.toLowerCase().trim();

// Compared against on the not-found path so login timing doesn't reveal
// whether an account exists.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword("timing-equalizer"));

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<UserSession> {
  const cleanEmail = normalizeEmail(email);
  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: cleanEmail,
      passwordHash: await hashPassword(password),
    },
  });
  return { userId: user.id, email: user.email, name: user.name };
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<UserSession | null> {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
  if (!user) {
    await verifyPassword(password, await getDummyHash());
    return null;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return { userId: user.id, email: user.email, name: user.name };
}

/* ─── Account details ──────────────────────────────────────── */

export type AccountRegistration = {
  id: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  amountCents: number;
  cause: string | null;
  createdAt: Date;
  seminarTitle: string | null;
  seminarStart: Date | null;
  seminarEnd: Date | null;
  seminarLocation: string | null;
};

export type AccountDetails = {
  memberSince: Date | null;
  registrations: AccountRegistration[];
};

/**
 * Loads the profile extras for the account page: when the user joined and the
 * seminar registrations tied to their email. Degrades gracefully (empty data)
 * if the database is unreachable.
 */
export async function getAccountDetails(
  session: UserSession,
): Promise<AccountDetails> {
  try {
    const [user, regs] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { createdAt: true },
      }),
      prisma.registration.findMany({
        // Primarily linked by account id; fall back to email so registrations
        // created before the userId link (or under a differently-cased email)
        // still surface here.
        where: {
          OR: [
            { userId: session.userId },
            { email: normalizeEmail(session.email) },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          seminar: {
            select: { title: true, startDate: true, endDate: true, location: true },
          },
        },
      }),
    ]);

    return {
      memberSince: user?.createdAt ?? null,
      registrations: regs.map((r) => ({
        id: r.id,
        status: r.status,
        amountCents: r.amountCents,
        cause: r.cause,
        createdAt: r.createdAt,
        seminarTitle: r.seminar?.title ?? null,
        seminarStart: r.seminar?.startDate ?? null,
        seminarEnd: r.seminar?.endDate ?? null,
        seminarLocation: r.seminar?.location ?? null,
      })),
    };
  } catch {
    return { memberSince: null, registrations: [] };
  }
}

/* ─── Password reset ───────────────────────────────────────── */

/**
 * Creates a reset token (valid 1 hour) for the given email and returns the
 * reset URL. Returns null if no account matches (caller should not reveal that).
 */
export async function createPasswordReset(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/reset-password?token=${token}`;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (
    !user ||
    !user.resetTokenExpiry ||
    user.resetTokenExpiry.getTime() < Date.now()
  ) {
    return false;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(newPassword),
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
  return true;
}
