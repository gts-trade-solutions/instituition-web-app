export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="bg-[#FBF3EA] py-16 sm:py-24">
      <div className="container-page">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-lg border border-cream-300 bg-cream-50 p-8 shadow-card sm:p-10">
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-600">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-5 text-center text-sm text-ink-soft">{footer}</div>}
        </div>
      </div>
    </section>
  );
}

/** Labeled text input matching the site's form styling. */
export function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-navy-600">
        {label} {required && <span className="text-rust-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...(type === "email"
          ? { inputMode: "email" as const, autoCapitalize: "none", autoCorrect: "off", spellCheck: false }
          : {})}
        className="w-full rounded-md border border-cream-300 bg-cream-50 px-4 py-2.5 text-navy-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
      />
    </div>
  );
}
