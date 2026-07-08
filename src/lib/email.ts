import "server-only";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { formatCurrency, formatDateRange } from "./format";

/**
 * Transactional email via AWS SES (v2 API).
 *
 * Dormant until credentials are set — exactly like the PayPal gateway.
 * Add these to your .env and `isEmailEnabled` flips on; no code changes needed:
 *
 *   AWS_SES_REGION            — e.g. "us-east-1" (the region your SES lives in)
 *   AWS_SES_ACCESS_KEY_ID     — IAM access key with ses:SendEmail permission
 *   AWS_SES_SECRET_ACCESS_KEY — matching IAM secret
 *   SES_FROM_EMAIL            — a *verified* SES sender, e.g. "AI Institute <no-reply@yourdomain.org>"
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

/** Low-level send. Never throws — logs and reports failure instead. */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  if (!isEmailEnabled) return { sent: false, skipped: true };
  try {
    await getClient().send(
      new SendEmailCommand({
        FromEmailAddress: fromEmail,
        Destination: { ToAddresses: [params.to] },
        ReplyToAddresses: replyTo ? [replyTo] : undefined,
        Content: {
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

/** Confirmation email sent once a registration is paid/confirmed. */
export async function sendRegistrationConfirmation(reg: {
  email: string;
  fullName: string;
  amountCents: number;
  cause?: string | null;
  seminarStart?: Date | null;
  seminarEnd?: Date | null;
  seminarLocation?: string | null;
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

  const subject = "Your AI Institute seminar registration is confirmed";

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for registering for the AI Institute for Native Americans 2-day seminar. Your registration is confirmed.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "We look forward to seeing you there.",
    "",
    "— AI Institute for Native Americans",
  ].join("\n");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
    <h2 style="color:#0f766e">You're registered!</h2>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>Thank you for registering for the <strong>AI Institute for Native Americans</strong>
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
    <p>We look forward to seeing you there.</p>
    <p style="color:#6b7280;font-size:13px">— AI Institute for Native Americans</p>
  </div>`;

  return sendEmail({ to: reg.email, subject, html, text });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
