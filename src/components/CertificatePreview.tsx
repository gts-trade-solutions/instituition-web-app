"use client";

import { useEffect, useRef, useState } from "react";

/** The certificate sheet's fixed size, from lib/certificate.ts. */
const SHEET_W = 1123;
const SHEET_H = 794;

/**
 * Shows a registration's certificate inline.
 *
 * The certificate is a standalone HTML document laid out at a fixed A4
 * landscape size, so it's framed rather than inlined, and scaled down to
 * whatever width it's given. Scaling has to happen in JS because the factor
 * depends on the measured container width.
 */
export function CertificatePreview({ registrationId }: { registrationId: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fit = () => setScale(box.clientWidth / SHEET_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const src = `/api/certificate/${encodeURIComponent(registrationId)}`;

  return (
    <div>
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden rounded-lg border border-cream-300 bg-cream-50 shadow-card"
        style={{ aspectRatio: `${SHEET_W} / ${SHEET_H}` }}
      >
        {/* Rendered only once the scale is known, so it never flashes at full
            size before shrinking. */}
        {scale > 0 && (
          <iframe
            src={src}
            title="Your Certificate of Registration"
            loading="lazy"
            // A preview, not something to interact with — the link below opens
            // the real thing for printing.
            tabIndex={-1}
            scrolling="no"
            className="pointer-events-none absolute left-0 top-0 border-0"
            style={{
              width: SHEET_W,
              height: SHEET_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-6 py-2.5 text-sm"
        >
          Open &amp; Print
        </a>
        <p className="text-sm text-ink-soft">
          A copy is attached to your confirmation email.
        </p>
      </div>
    </div>
  );
}
