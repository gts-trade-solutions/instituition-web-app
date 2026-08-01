# Email setup (AWS SES)

Registration confirmations — and the attached Certificate of Registration —
are sent through AWS SES. Sending is **dormant until configured**: while any of
the four required vars is missing, `isEmailEnabled` is false and every send is
a no-op that returns `{ sent: false, skipped: true }`. Registration and payment
still work; no mail goes out and nothing throws. The app logs one warning
naming the missing vars, so a misconfigured server says so in its logs.

## Status

| | |
|---|---|
| SES region | `ap-south-1` |
| Account | production access (not the SES sandbox) |
| Sending identity | `aiinstitutefornativeamericans.com` |
| DKIM | **PENDING** — waiting on the DNS records below |
| App sending | **OFF** — `SES_FROM_EMAIL` is unset |

> An earlier attempt used `accountinginstitutionnativeamericans.com`. That
> domain is not registered — DNS returns NXDOMAIN — so its records could never
> be published and the identity could never verify. Use the domain below, which
> is registered and whose DNS is under your control (GoDaddy).

This app should send under its own domain. Do **not** point `SES_FROM_EMAIL` at
`raceautoindia.com` or the other identities on this AWS account; they belong to
different properties.

## Step 1 — publish the DKIM records

**No mailbox is needed for the sending address.** Domain verification authorises
sending by DNS, so once the domain is verified SES will send as any address on
it — `no-reply@` included — whether or not that inbox exists. Nothing is ever
delivered to it; that is what `SES_REPLY_TO` is for.

DNS for this domain is managed by someone else. The request to send them is in
[DNS-REQUEST.md](DNS-REQUEST.md) — it is a one-time change and needs no ongoing
involvement from them.

At GoDaddy, add three CNAME records to `aiinstitutefornativeamericans.com`.
GoDaddy appends the domain automatically, so enter only the host part shown.

| Type | Host | Points to |
|---|---|---|
| CNAME | `y7geb73koh63erdeap3z37kbejukmqff._domainkey` | `y7geb73koh63erdeap3z37kbejukmqff.dkim.amazonses.com` |
| CNAME | `ymtxf6x5blwiwki4so7ex7gzk2fsmfp2._domainkey` | `ymtxf6x5blwiwki4so7ex7gzk2fsmfp2.dkim.amazonses.com` |
| CNAME | `ublklq6zxflxuilcjciotplfsl42wxuf._domainkey` | `ublklq6zxflxuilcjciotplfsl42wxuf.dkim.amazonses.com` |

SES polls for these and flips the identity to verified on its own, usually
within minutes of the records going live.

Check they resolve:

```
nslookup -type=CNAME y7geb73koh63erdeap3z37kbejukmqff._domainkey.aiinstitutefornativeamericans.com
```

## Step 2 — set the variables on the server

**`.env` is gitignored (`.gitignore:34` is `.env*`), so it never ships with the
repo.** A deploy that only pulls from git has no SES config at all — this is the
usual reason mail works locally and not in production. Set these in the VPS
environment (systemd `Environment=`, a PM2 ecosystem file, `docker --env-file`,
or a `.env` placed on the server by hand):

```
AWS_SES_REGION="ap-south-1"
AWS_SES_ACCESS_KEY_ID="..."
AWS_SES_SECRET_ACCESS_KEY="..."
SES_FROM_EMAIL="Accounting Institute <no-reply@aiinstitutefornativeamericans.com>"
SES_REPLY_TO="info@raceautoindia.com"
```

`SES_REPLY_TO` must be an inbox someone actually reads — it needs no SES
verification, but replies go there and nowhere else.
`info@aiinstitutefornativeamericans.com` does **not** exist as a mailbox, so it
must not be used here; replies would bounce. Note the site's contact page still
advertises that address, which means anyone writing to it today gets nothing.

Note the names: the app reads **`AWS_SES_*`**. A server that only has
`AWS_S3_*` set — even with the same key and secret — will not send. The same
IAM user can serve both; only the variable names differ.

Because the **domain** is verified, any address on it works as a sender without
being verified separately, so `no-reply@` needs no mailbox behind it. That also
means replies to it go nowhere — point `SES_REPLY_TO` at a real inbox.

Restart the app afterwards: these are read once at startup.

## Step 3 — confirm

Register on the site and watch the server log:

- nothing from `[ses]` and mail arrives → working.
- `[ses] email is DISABLED — not sending. Missing: ...` → the named vars aren't
  reaching the process.
- `[ses] send failed: ...` → credentials or identity problem; the message says
  which.

## Notes

- The IAM user needs `ses:SendEmail`.
- Confirmation mail is sent when a registration is confirmed. With no PayPal
  credentials the site runs in demo mode and sends immediately on registration;
  with PayPal configured it sends after the capture marks the registration PAID.
