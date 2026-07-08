"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  name,
  placeholder,
  autoComplete = "current-password",
  minLength,
}: {
  label: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-navy-600">
        {label} <span className="text-rust-500">*</span>
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-md border border-cream-300 bg-cream-50 px-4 py-2.5 pr-11 text-navy-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-soft transition-colors hover:text-navy-600"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
