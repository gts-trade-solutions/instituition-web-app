"use server";

import { redirect } from "next/navigation";
import {
  registerUser,
  authenticateUser,
  createUserSession,
  destroyUserSession,
  createPasswordReset,
  resetPassword,
} from "@/lib/user-auth";

export type AuthState = { error?: string; ok?: boolean; message?: string };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Only allow same-site relative paths (e.g. "/register") as a post-auth target. */
function safeRedirect(target: FormDataEntryValue | null): string {
  const t = typeof target === "string" ? target : "";
  // Same-site absolute paths only: reject protocol-relative ("//"), any
  // backslash (browsers normalize it to "/"), and ASCII control characters.
  if (!t.startsWith("/") || t.startsWith("//")) return "/";
  for (let i = 0; i < t.length; i++) {
    const code = t.charCodeAt(i);
    if (code < 0x20 || code === 0x5c) return "/";
  }
  return t;
}
const MAX_PASSWORD = 72; // bcrypt truncates beyond 72 bytes — reject rather than silently cut.

/* ─── Sign up ──────────────────────────────────────────────── */
export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name || !email || !password) {
    return { error: "Please fill in all fields." };
  }
  if (!isEmail(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password.length > MAX_PASSWORD) {
    return { error: `Password must be ${MAX_PASSWORD} characters or fewer.` };
  }
  if (password !== confirm) return { error: "Passwords do not match." };

  let session;
  try {
    session = await registerUser(name, email, password);
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("already exists")
          ? "An account with this email already exists."
          : "Unable to reach the database. Please try again.",
    };
  }

  await createUserSession(session);
  redirect(safeRedirect(formData.get("redirect")));
}

/* ─── Sign in ──────────────────────────────────────────────── */
export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  let session;
  try {
    session = await authenticateUser(email, password);
  } catch {
    return { error: "Unable to reach the database. Please try again." };
  }
  if (!session) return { error: "Invalid email or password." };

  await createUserSession(session);
  redirect(safeRedirect(formData.get("redirect")));
}

/* ─── Sign out ─────────────────────────────────────────────── */
export async function logoutAction(): Promise<void> {
  await destroyUserSession();
  redirect("/login");
}

/* ─── Forgot password ──────────────────────────────────────── */
export async function forgotAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!isEmail(email)) return { error: "Please enter a valid email address." };

  try {
    const resetUrl = await createPasswordReset(email);
    // No email provider yet — log the reset link to the server console.
    if (resetUrl) {
      console.log(`\n🔑 Password reset link for ${email}:\n${resetUrl}\n`);
    }
  } catch {
    return { error: "Unable to reach the database. Please try again." };
  }

  // Always report success so we don't reveal which emails have accounts.
  return {
    ok: true,
    message:
      "If an account exists for that email, a password-reset link has been generated. (Check the server console for the link.)",
  };
}

/* ─── Reset password ───────────────────────────────────────── */
export async function resetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { error: "Missing or invalid reset token." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password.length > MAX_PASSWORD) {
    return { error: `Password must be ${MAX_PASSWORD} characters or fewer.` };
  }
  if (password !== confirm) return { error: "Passwords do not match." };

  let ok = false;
  try {
    ok = await resetPassword(token, password);
  } catch {
    return { error: "Unable to reach the database. Please try again." };
  }
  if (!ok) {
    return { error: "This reset link is invalid or has expired." };
  }

  return { ok: true, message: "Your password has been reset. You can now sign in." };
}
