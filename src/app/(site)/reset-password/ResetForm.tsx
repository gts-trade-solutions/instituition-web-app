"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { PasswordField } from "@/components/PasswordField";
import { resetAction, type AuthState } from "../auth-actions";

const initial: AuthState = {};

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetAction, initial);

  if (!token) {
    return (
      <AuthCard
        title="Reset Password"
        footer={
          <Link href="/forgot-password" className="font-semibold text-rust-500 hover:text-rust-600">
            Request a new link
          </Link>
        }
      >
        <div className="flex items-start gap-3 rounded-md bg-rust-500/10 px-4 py-4 text-sm text-rust-600">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>This reset link is missing or invalid. Please request a new one.</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/login" className="font-semibold text-rust-500 hover:text-rust-600">
          ← Back to sign in
        </Link>
      }
    >
      {state.ok ? (
        <div className="space-y-5">
          <div role="status" className="flex items-start gap-3 rounded-md bg-teal-600/10 px-4 py-4 text-sm text-teal-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{state.message}</p>
          </div>
          <Link href="/login" className="btn-accent w-full justify-center">
            Go to Sign In
          </Link>
        </div>
      ) : (
        <form action={action} className="space-y-5">
          {state.error && (
            <div role="alert" className="flex items-center gap-2 rounded-md bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <input type="hidden" name="token" value={token} />
          <PasswordField label="New Password" name="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
          <PasswordField label="Confirm New Password" name="confirm" autoComplete="new-password" placeholder="Re-enter password" minLength={8} />
          <button type="submit" disabled={pending} className="btn-accent w-full justify-center">
            <KeyRound className="h-4 w-4" />
            {pending ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
