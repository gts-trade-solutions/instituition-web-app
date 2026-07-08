"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, LogIn } from "lucide-react";
import { AuthCard, Field } from "@/components/AuthCard";
import { PasswordField } from "@/components/PasswordField";
import { loginAction, type AuthState } from "../auth-actions";

const initial: AuthState = {};

export function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  const signupHref =
    redirectTo !== "/" ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup";

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back. Sign in to manage your seminar registrations."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href={signupHref} className="font-semibold text-rust-500 hover:text-rust-600">
            Create one
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
        <Field label="Email Address" name="email" type="email" autoComplete="email" placeholder="you@email.com" />
        <PasswordField label="Password" name="password" autoComplete="current-password" placeholder="••••••••" />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={pending} className="btn-accent w-full justify-center">
          <LogIn className="h-4 w-4" />
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </AuthCard>
  );
}
