# Email setup (AWS SES)

Registration confirmations — and the attached Certificate of Registration —
are sent through AWS SES. Sending is **dormant until configured**: while
`SES_FROM_EMAIL` is blank, `isEmailEnabled` is false and every send is a safe
no-op that returns `{ sent: false, skipped: true }`. Registration and payment
still work; no mail goes out and nothing throws.

## Status

| | |
|---|---|
| SES region | `ap-south-1` |
| Account | production access (not the SES sandbox) |
| Sending identity | `accountinginstitutionnativeamericans.com` |
| DKIM | **PENDING** — waiting on the DNS records below |
| App sending | **OFF** — `SES_FROM_EMAIL` is blank |

This app must send under its own domain. Do **not** point `SES_FROM_EMAIL` at
`raceautoindia.com` (or any other identity on this AWS account) — those belong
to different properties.

## Step 1 — publish the DKIM records

Add these three CNAMEs to the DNS for
`accountinginstitutionnativeamericans.com`. Each record's name ends with the
domain; if your DNS panel appends the domain automatically, enter only the part
before it.

| Type | Name | Value |
|---|---|---|
| CNAME | `frjwbxtbmyxvzrqyd5xnamtgz3juusn5._domainkey` | `frjwbxtbmyxvzrqyd5xnamtgz3juusn5.dkim.amazonses.com` |
| CNAME | `sxvmbyikbeabxmduv7tbqgf4kh7dqbj2._domainkey` | `sxvmbyikbeabxmduv7tbqgf4kh7dqbj2.dkim.amazonses.com` |
| CNAME | `t3zz3lu7uvnhxkef3p7atxu2kd3sclmh._domainkey` | `t3zz3lu7uvnhxkef3p7atxu2kd3sclmh.dkim.amazonses.com` |

Do not set a TTL longer than an hour while you're waiting. SES polls for these
and flips the identity to verified on its own, usually within minutes of the
records going live, though DNS propagation can take up to 72 hours.

## Step 2 — confirm SES sees them

In the SES console (ap-south-1) the identity should read **Verified** with DKIM
**Successful**.

## Step 3 — turn sending on

Set these in `.env` (never commit it — `.env*` is gitignored):

```
AWS_SES_REGION="ap-south-1"
AWS_SES_ACCESS_KEY_ID="..."
AWS_SES_SECRET_ACCESS_KEY="..."
SES_FROM_EMAIL="Accounting Institute <no-reply@accountinginstitutionnativeamericans.com>"
SES_REPLY_TO="..."   # optional; an inbox someone actually reads
```

Because the **domain** is verified, any address on it works as a sender without
being verified separately — `no-reply@` needs no mailbox behind it. That also
means replies to it go nowhere, so set `SES_REPLY_TO` to a real inbox.

Restart the dev server afterwards: env vars are read once at startup, so a
running server won't pick them up.

## Notes

- The IAM user needs `ses:SendEmail`.
- Confirmation mail is sent when a registration is confirmed. With no PayPal
  credentials the site runs in demo mode and sends immediately on registration;
  with PayPal configured it sends after the payment capture marks the
  registration PAID.
