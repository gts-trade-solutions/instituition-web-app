"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <h2 className="text-xl font-semibold text-teal-800">Something went wrong</h2>
        <p className="mt-1 text-sm text-ink-soft">
          This section couldn&apos;t be loaded. Please try again.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-ink-soft/70">Reference: {error.digest}</p>
        )}
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-teal-700"
      >
        Try again
      </button>
    </div>
  );
}
