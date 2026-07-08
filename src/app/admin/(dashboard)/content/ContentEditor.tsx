"use client";

import { useActionState, useEffect, useState } from "react";
import { Save, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { saveContent, resetPageContent, type ContentState } from "./actions";

type PageData = {
  page: string;
  label: string;
  fields: { key: string; label: string; value: string; multiline: boolean }[];
};

const initial: ContentState = {};

export function ContentEditor({ pages }: { pages: PageData[] }) {
  const [active, setActive] = useState(pages[0]?.page ?? "");
  const current = pages.find((p) => p.page === active) ?? pages[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-teal-800">Page Content</h1>
        <p className="mt-1 text-ink-soft">
          Edit the text shown across your public website.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p.page}
            onClick={() => setActive(p.page)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === p.page
                ? "bg-teal-600 text-cream-50"
                : "bg-white text-ink-soft hover:bg-teal-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {current && <PageForm key={current.page} data={current} />}
    </div>
  );
}

function PageForm({ data }: { data: PageData }) {
  const [state, action, pending] = useActionState(saveContent, initial);
  // Show a success toast for 2.5s after each save. Only the (async) timer
  // updates state, so there's no synchronous setState in the effect body.
  const [dismissed, setDismissed] = useState<ContentState | null>(null);
  useEffect(() => {
    if (!state.ok) return;
    const t = setTimeout(() => setDismissed(state), 2500);
    return () => clearTimeout(t);
  }, [state]);
  const saved = state.ok && dismissed !== state;

  return (
    <form action={action} className="card p-6 sm:p-8">
      <input type="hidden" name="__page" value={data.page} />

      {state.error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-rust-500/10 px-4 py-3 text-sm text-rust-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {saved && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Saved! Changes are live on the site.
        </div>
      )}

      <div className="space-y-5">
        {data.fields.map((f) => (
          <div key={f.key}>
            <label className="field-label">{f.label}</label>
            {f.multiline ? (
              <textarea
                name={f.key}
                defaultValue={f.value}
                rows={3}
                className="field-input resize-y"
              />
            ) : (
              <input name={f.key} defaultValue={f.value} className="field-input" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-cream-200 pt-6">
        <button
          type="submit"
          formAction={resetPageContent}
          onClick={(e) => {
            if (!confirm("Reset this page's text to the original defaults?"))
              e.preventDefault();
          }}
          className="btn-ghost text-rust-600 hover:bg-rust-500/10"
        >
          <RotateCcw className="h-4 w-4" /> Reset to defaults
        </button>
        <button type="submit" disabled={pending} className="btn-primary">
          <Save className="h-4 w-4" />
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
