"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { AuthCard, Field } from "@/components/AuthCard";
import { forgotAction, type AuthState } from "../auth-actions";

const initial: AuthState = {};

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotAction, initial);

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email and we'll generate a link to reset your password."
      footer={
        <Link href="/login" className="font-semibold text-rust-500 hover:text-rust-600">
          ← Back to sign in
        </Link>
      }
    >
      {state.ok ? (
        <div role="status" className="flex items-start gap-3 rounded-md bg-teal-600/10 px-4 py-4 text-sm text-teal-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      ) : (
        <form action={action} className="space-y-5">
          {state.error && (
            <div role="alert" className="flex items-center gap-2 rounded-md bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <Field label="Email Address" name="email" type="email" autoComplete="email" placeholder="you@email.com" />
          <button type="submit" disabled={pending} className="btn-accent w-full justify-center">
            <Mail className="h-4 w-4" />
            {pending ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
