import { formatDate } from "./format";

/**
 * Printable "Certificate of Registration" — rendered as a single self-contained
 * HTML document (no external CSS, fonts, or images) so it survives being sent
 * as an email attachment and opens correctly offline in any browser.
 *
 * Recipients open it and use their browser's Print → "Save as PDF" to get a
 * PDF; the @page rules below already set A4 landscape with no margins.
 */

export type CertificateData = {
  /** Registrant's name, printed on the main rule. */
  fullName: string;
  /** Registration id — printed under "Registration ID" for support lookups. */
  registrationId: string;
  /** When the registration was created; falls back to now. */
  issuedAt?: Date | null;
  /** The registrant's selected role, printed under "Track / Department". */
  track?: string | null;
};

/** Ornament colours, cycled across the diamond bands. */
const DIAMONDS = ["#14554e", "#b33d07", "#d3a03a", "#16283f"];

/** A row of 12 alternating diamond ornaments (top and bottom bands). */
function diamondBand(): string {
  return Array.from({ length: 12 }, (_, i) => {
    const c = DIAMONDS[i % DIAMONDS.length];
    return `<span class="dia" style="border-color:${c}"><i style="background:${c}"></i></span>`;
  }).join("");
}

/** Stacked "X" weave panel used down both margins. */
function weavePanel(color: string): string {
  const rows = 5;
  const step = 66;
  const paths = Array.from({ length: rows }, (_, i) => {
    const y = i * step;
    return `M0 ${y} L84 ${y + step} M84 ${y} L0 ${y + step}`;
  }).join(" ");
  return `<svg class="weave" width="84" height="${rows * step}" viewBox="0 0 84 ${rows * step}" aria-hidden="true">
      <path d="${paths}" fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="1.4" />
    </svg>`;
}

/** Open-book emblem at the centre of the seal. */
const EMBLEM = `<svg class="emblem" viewBox="0 0 128 92" aria-hidden="true">
    <path d="M10 22 L58 10 L58 82 L10 70 Z" fill="none" stroke="#14554e" stroke-width="5" stroke-linejoin="round" />
    <path d="M118 22 L70 10 L70 82 L118 70 Z" fill="none" stroke="#14554e" stroke-width="5" stroke-linejoin="round" />
    <path d="M50 20 L58 18 L58 78 L50 76 Z" fill="#d3a03a" />
    <path d="M78 20 L70 18 L70 78 L78 76 Z" fill="#d3a03a" />
  </svg>`;

export function renderCertificateHtml(data: CertificateData): string {
  const name = data.fullName.trim() || "Registrant Name";
  const issued = formatDate(data.issuedAt ?? new Date());
  const track = data.track?.trim() || "General Program";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Certificate of Registration — ${escapeHtml(name)}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px;
    background: #e9e2d6;
    font-family: Georgia, "Times New Roman", Times, serif;
    color: #23201c;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    position: relative;
    width: 1123px;
    height: 794px;
    margin: 0 auto;
    padding: 26px;
    overflow: hidden;
    background:
      repeating-linear-gradient(115deg, #f2e9d8 0 42px, #f7f0e2 42px 84px),
      #f7f0e2;
  }
  /* Three concentric rules: thick gold, then a thin teal and rust hairline. */
  .frame { position: absolute; border-radius: 26px; pointer-events: none; }
  .frame-gold { inset: 18px; border: 7px solid #d3a03a; }
  .frame-teal { inset: 28px; border: 1.5px solid #14554e; }
  .frame-rust { inset: 38px; border: 1px solid #cf5a24; }

  .inner { position: relative; height: 100%; padding: 34px 62px 26px; }

  .band { display: flex; justify-content: space-between; padding: 0 46px; }
  .dia {
    width: 19px; height: 19px;
    border: 1.8px solid;
    transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center;
    background: #f7f0e2;
  }
  .dia i { width: 4px; height: 4px; border-radius: 50%; display: block; }

  .weave-left, .weave-right { position: absolute; top: 210px; }
  .weave-left { left: 78px; }
  .weave-right { right: 78px; }

  .org { text-align: center; margin-top: 30px; }
  .org b {
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    color: #14554e;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
  .org b + b { font-size: 17px; margin-top: 3px; }

  h1 {
    margin: 6px 0 0;
    text-align: center;
    font-size: 64px;
    font-weight: 700;
    color: #16283f;
    letter-spacing: 0.005em;
  }

  /* Decorative seal sits behind the recitals; sized to clear the field rules. */
  .seal {
    position: absolute;
    top: 200px; left: 50%;
    width: 350px; height: 350px;
    margin-left: -175px;
    border-radius: 50%;
    border: 12px solid #d3a03a;
    background: #fdfaf3;
  }
  .seal::after {
    content: "";
    position: absolute; inset: 8px;
    border-radius: 50%;
    border: 2.5px solid #14554e;
  }
  /* Sits in the clear band low in the seal, below the tagline. */
  .emblem { position: absolute; top: 258px; left: 50%; width: 96px; margin-left: -48px; }

  .body { position: relative; text-align: center; margin-top: 26px; }
  .certifies { font-size: 25px; font-style: italic; color: #4f4a42; }
  .name {
    margin: 6px auto 0;
    font-size: 46px;
    font-style: italic;
    color: #4f4a42;
    line-height: 1.15;
    max-width: 760px;
    word-break: break-word;
  }
  .rule { width: 760px; height: 1.5px; margin: 12px auto 0; background: #14554e; }
  .recital { margin: 22px auto 0; font-size: 20px; line-height: 1.65; max-width: 900px; }
  .tagline {
    margin: 12px 0 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: #b33d07;
  }

  .fields { position: absolute; left: 62px; right: 62px; bottom: 140px; display: flex; gap: 54px; }
  .signs { position: absolute; left: 168px; right: 168px; bottom: 72px; display: flex; gap: 54px; }
  .slot { flex: 1; text-align: center; }
  .slot .val {
    min-height: 26px;
    font-size: 17px;
    color: #23201c;
    padding: 0 6px 3px;
    word-break: break-all;
  }
  .slot .line { height: 1px; background: #d3a03a; }
  .signs .slot .line { background: #14554e; }
  .slot .lbl {
    margin-top: 7px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: #4f4a42;
  }

  .footer { position: absolute; left: 0; right: 0; bottom: 0; text-align: center; }
  .footer .tracks {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #14554e;
  }
  .footer .fine {
    margin-top: 6px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    color: #8a8378;
  }

  @media screen and (max-width: 1200px) { body { padding: 12px; overflow-x: auto; } }
  @media print { body { padding: 0; background: none; } .sheet { margin: 0; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="frame frame-gold"></div>
    <div class="frame frame-teal"></div>
    <div class="frame frame-rust"></div>

    <div class="inner">
      <div class="band">${diamondBand()}</div>

      <div class="weave-left">${weavePanel("#2f7d72")}</div>
      <div class="weave-right">${weavePanel("#cf5a24")}</div>

      <div class="seal">${EMBLEM}</div>

      <div class="org">
        <b>ACCOUNTING INSTITUTE</b>
        <b>FOR NATIVE AMERICANS</b>
      </div>
      <h1>Certificate of Registration</h1>

      <div class="body">
        <div class="certifies">This certifies that</div>
        <div class="name">${escapeHtml(name)}</div>
        <div class="rule"></div>
        <p class="recital">
          has successfully registered with the Accounting Institute for Native Americans<br />
          to participate in professional development for Accounting, Human Resources, and Administration.
        </p>
        <p class="tagline">Strengthening tribal organizations through stewardship, service, and excellence</p>
      </div>

      <div class="fields">
        <div class="slot">
          <div class="val">${escapeHtml(issued)}</div>
          <div class="line"></div>
          <div class="lbl">Date Issued</div>
        </div>
        <div class="slot">
          <div class="val">${escapeHtml(data.registrationId)}</div>
          <div class="line"></div>
          <div class="lbl">Registration ID</div>
        </div>
        <div class="slot">
          <div class="val">${escapeHtml(track)}</div>
          <div class="line"></div>
          <div class="lbl">Track / Department</div>
        </div>
      </div>

      <div class="signs">
        <div class="slot">
          <div class="val"></div>
          <div class="line"></div>
          <div class="lbl">Institute Director</div>
        </div>
        <div class="slot">
          <div class="val"></div>
          <div class="line"></div>
          <div class="lbl">Program Coordinator</div>
        </div>
      </div>

      <div class="footer">
        <div class="tracks">Accounting &nbsp;-&nbsp; Human Resources &nbsp;-&nbsp; Administration</div>
        <div class="fine">
          Confirms registration only. A certificate of completion is issued after the 2-day training.
        </div>
        <div class="band" style="margin-top:10px">${diamondBand()}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Filename used for the email attachment and browser downloads. */
export function certificateFileName(fullName: string): string {
  const slug =
    fullName
      .trim()
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "Registrant";
  return `Certificate-of-Registration-${slug}.html`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
