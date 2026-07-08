"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, UserPlus } from "lucide-react";
import { AuthCard, Field } from "@/components/AuthCard";
import { PasswordField } from "@/components/PasswordField";
import { signupAction, type AuthState } from "../auth-actions";

const initial: AuthState = {};

export function SignupForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState(signupAction, initial);
  const gated = redirectTo === "/register";
  const loginHref =
    redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";

  return (
    <AuthCard
      title="Create Account"
      subtitle={
        gated
          ? "Create an account to register for a seminar and track your participation."
          : "Sign up to register for seminars and track your participation."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link href={loginHref} className="font-semibold text-rust-500 hover:text-rust-600">
            Sign in
          </Link>
        </>
      }
    >
      <form action={action} className="space-y-5">
        {state.error && (
          <div role="alert" className="flex items-center gap-2 rounded-md bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}
        <input type="hidden" name="redirect" value={redirectTo} />
        <Field label="Full Name" name="name" autoComplete="name" placeholder="Jane Doe" />
        <Field label="Email Address" name="email" type="email" autoComplete="email" placeholder="you@email.com" />
        <PasswordField label="Password" name="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
        <PasswordField label="Confirm Password" name="confirm" autoComplete="new-password" placeholder="Re-enter password" minLength={8} />
        <button type="submit" disabled={pending} className="btn-accent w-full justify-center">
          <UserPlus className="h-4 w-4" />
          {pending ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </AuthCard>
  );
}
