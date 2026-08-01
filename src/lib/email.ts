import "server-only";
import { randomUUID } from "node:crypto";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { formatCurrency, formatDateRange } from "./format";
import { certificateFileName, renderCertificateHtml } from "./certificate";

/**
 * Transactional email via AWS SES (v2 API).
 *
 * Dormant until credentials are set — exactly like the PayPal gateway.
 * Add these to your .env and `isEmailEnabled` flips on; no code changes needed:
 *
 *   AWS_SES_REGION            — e.g. "us-east-1" (the region your SES lives in)
 *   AWS_SES_ACCESS_KEY_ID     — IAM access key with ses:SendEmail permission
 *   AWS_SES_SECRET_ACCESS_KEY — matching IAM secret
 *   SES_FROM_EMAIL            — a *verified* SES sender, e.g. "Accounting Institute <no-reply@yourdomain.org>"
 *   SES_REPLY_TO              — (optional) address replies should go to
 *
 * While unset, every send is a safe no-op (returns { sent:false, skipped:true })
 * and never throws — so registration/payment flows work with or without email.
 */
const region = process.env.AWS_SES_REGION;
const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY;
const fromEmail = process.env.SES_FROM_EMAIL;
const replyTo = process.env.SES_REPLY_TO;

export const isEmailEnabled = Boolean(
  region && accessKeyId && secretAccessKey && fromEmail,
);

/** Which of the required vars are absent — used to explain a skipped send. */
function missingConfig(): string[] {
  return (
    [
      ["AWS_SES_REGION", region],
      ["AWS_SES_ACCESS_KEY_ID", accessKeyId],
      ["AWS_SES_SECRET_ACCESS_KEY", secretAccessKey],
      ["SES_FROM_EMAIL", fromEmail],
    ] as const
  )
    .filter(([, v]) => !v)
    .map(([k]) => k);
}

// Say so once at startup. Without this a deployment with no SES vars looks
// identical to a working one — sends just vanish, with nothing in the logs.
let warned = false;

let client: SESv2Client | null = null;
function getClient(): SESv2Client {
  if (!client) {
    client = new SESv2Client({
      region,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    });
  }
  return client;
}

export type SendResult = { sent: boolean; skipped?: boolean; error?: boolean };

export type Attachment = {
  /** Name the recipient sees in their mail client. */
  filename: string;
  /** MIME type, e.g. "text/html" or "application/pdf". */
  contentType: string;
  /** File body. */
  content: string | Buffer;
};

/**
 * Low-level send. Never throws — logs and reports failure instead.
 *
 * With no attachments we use SES's Simple content (it handles the MIME for us).
 * Attachments require Raw content, so we assemble the multipart message
 * ourselves in `buildRawMessage` below.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Attachment[];
}): Promise<SendResult> {
  if (!isEmailEnabled) {
    if (!warned) {
      warned = true;
      console.warn(
        `[ses] email is DISABLED — not sending. Missing: ${missingConfig().join(", ")}. ` +
          `Set these in the server's environment (.env is gitignored, so it does not ship with the repo) and restart.`,
      );
    }
    return { sent: false, skipped: true };
  }
  const hasAttachments = Boolean(params.attachments?.length);
  try {
    await getClient().send(
      new SendEmailCommand({
        FromEmailAddress: fromEmail,
        Destination: { ToAddresses: [params.to] },
        ReplyToAddresses: replyTo ? [replyTo] : undefined,
        Content: hasAttachments
          ? {
              Raw: {
                Data: buildRawMessage({
                  from: fromEmail!,
                  to: params.to,
                  replyTo,
                  subject: params.subject,
                  html: params.html,
                  text: params.text,
                  attachments: params.attachments!,
                }),
              },
            }
          : {
              Simple: {
                Subject: { Data: params.subject, Charset: "UTF-8" },
                Body: {
                  Html: { Data: params.html, Charset: "UTF-8" },
                  Text: { Data: params.text, Charset: "UTF-8" },
                },
              },
            },
      }),
    );
    return { sent: true };
  } catch (err) {
    console.error("[ses] send failed:", err);
    return { sent: false, error: true };
  }
}

/**
 * Assemble an RFC 5322 message with a plain/HTML alternative body plus file
 * attachments:
 *
 *   multipart/mixed
 *   ├── multipart/alternative  (text/plain + text/html)
 *   └── attachment…
 */
function buildRawMessage(m: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments: Attachment[];
}): Uint8Array {
  // Boundaries must not occur in any part; a UUID makes that a non-issue.
  const mixed = `mixed_${randomUUID()}`;
  const alt = `alt_${randomUUID()}`;

  const lines: string[] = [
    `From: ${m.from}`,
    `To: ${m.to}`,
    ...(m.replyTo ? [`Reply-To: ${m.replyTo}`] : []),
    `Subject: ${encodeHeader(m.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    "",
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    "",
    `--${alt}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(Buffer.from(m.text, "utf-8")),
    `--${alt}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(Buffer.from(m.html, "utf-8")),
    `--${alt}--`,
    "",
  ];

  for (const a of m.attachments) {
    const body = Buffer.isBuffer(a.content)
      ? a.content
      : Buffer.from(a.content, "utf-8");
    lines.push(
      `--${mixed}`,
      `Content-Type: ${a.contentType}; charset="UTF-8"; name="${a.filename}"`,
      `Content-Disposition: attachment; filename="${a.filename}"`,
      "Content-Transfer-Encoding: base64",
      "",
      base64Lines(body),
    );
  }

  lines.push(`--${mixed}--`, "");
  return Buffer.from(lines.join("\r\n"), "utf-8");
}

/** Base64 wrapped at 76 chars per line, as RFC 2045 requires. */
function base64Lines(buf: Buffer): string {
  return (buf.toString("base64").match(/.{1,76}/g) ?? []).join("\r\n");
}

/** RFC 2047 encoded-word — only needed when the header isn't plain ASCII. */
function encodeHeader(value: string): string {
  if (!/[^\x20-\x7E]/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf-8").toString("base64")}?=`;
}

/**
 * Confirmation email sent once a registration is paid/confirmed, with the
 * registrant's Certificate of Registration attached.
 */
export async function sendRegistrationConfirmation(reg: {
  email: string;
  fullName: string;
  amountCents: number;
  cause?: string | null;
  seminarStart?: Date | null;
  seminarEnd?: Date | null;
  seminarLocation?: string | null;
  /** Printed on the certificate; omit to send the email without one. */
  registrationId?: string | null;
  /** Registrant's role — the certificate's "Track / Department". */
  track?: string | null;
  /** Certificate issue date; defaults to today. */
  issuedAt?: Date | null;
}): Promise<SendResult> {
  const firstName = reg.fullName.trim().split(/\s+/)[0] || "there";
  const when =
    reg.seminarStart && reg.seminarEnd
      ? formatDateRange(reg.seminarStart, reg.seminarEnd)
      : null;

  const rows: [string, string][] = [];
  if (when) rows.push(["Seminar dates", when]);
  if (reg.seminarLocation) rows.push(["Location", reg.seminarLocation]);
  rows.push(["Amount", formatCurrency(reg.amountCents)]);
  if (reg.cause) rows.push(["Supporting", reg.cause]);

  const subject = "Your Accounting Institute seminar registration is confirmed";

  // The certificate needs an id to print, so it only rides along when the
  // caller passes one. Everything else degrades to the plain confirmation.
  //
  // This runs on the registration and post-payment paths, so it must never
  // throw: a certificate we failed to render is not a reason to fail a
  // registration or a captured payment. Skip it when email is off, too — no
  // point building an attachment for a send that's about to no-op.
  const attachments: Attachment[] = [];
  if (reg.registrationId && isEmailEnabled) {
    try {
      attachments.push({
        filename: certificateFileName(reg.fullName),
        contentType: "text/html",
        content: renderCertificateHtml({
          fullName: reg.fullName,
          registrationId: reg.registrationId,
          issuedAt: reg.issuedAt ?? null,
          track: reg.track ?? null,
        }),
      });
    } catch (err) {
      console.error("[email] certificate render failed:", err);
    }
  }
  const certNote = attachments.length
    ? "Your Certificate of Registration is attached. Open it in any browser, then use Print → Save as PDF if you'd like a copy to keep or print."
    : null;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for registering for the Accounting Institute for Native Americans 2-day seminar. Your registration is confirmed.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...(certNote ? [certNote, ""] : []),
    "We look forward to seeing you there.",
    "",
    "— Accounting Institute for Native Americans",
  ].join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
    <h2 style="color:#0f766e">You're registered!</h2>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>Thank you for registering for the <strong>Accounting Institute for Native Americans</strong>
       2-day seminar. Your registration is confirmed.</p>
    <table style="border-collapse:collapse;margin:16px 0;width:100%">
      ${rows
        .map(
          ([k, v]) =>
            `<tr>
               <td style="padding:6px 0;color:#6b7280">${escapeHtml(k)}</td>
               <td style="padding:6px 0;text-align:right;font-weight:600">${escapeHtml(v)}</td>
             </tr>`,
        )
        .join("")}
    </table>
    ${
      certNote
        ? `<div style="border-left:3px solid #d3a03a;background:#faf5ea;padding:12px 16px;margin:16px 0">
             <strong style="color:#14554e">Certificate of Registration attached</strong>
             <p style="margin:6px 0 0;font-size:14px">${escapeHtml(certNote.replace(/^Your Certificate of Registration is attached\. /, ""))}</p>
           </div>`
        : ""
    }
    <p>We look forward to seeing you there.</p>
    <p style="color:#6b7280;font-size:13px">— Accounting Institute for Native Americans</p>
  </div>`;

  return sendEmail({ to: reg.email, subject, html, text, attachments });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
