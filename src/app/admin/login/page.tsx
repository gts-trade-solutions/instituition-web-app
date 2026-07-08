"use client";

import { useActionState } from "react";
import { LogIn, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-semibold text-teal-800">Admin Sign In</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage seminars, registrations, messages, and site content.
          </p>

          <form action={action} className="mt-6 space-y-5">
            {state.error && (
              <div role="alert" className="flex items-center gap-2 rounded-xl bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="field-input"
                placeholder="admin@aiinstitute.org"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="field-input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={pending} className="btn-primary w-full">
              <LogIn className="h-4 w-4" />
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
