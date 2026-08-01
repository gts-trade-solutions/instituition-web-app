# DNS change request — forward this to whoever manages the domain

Copy the text below into an email. It is a one-time change; nothing further is
needed from them afterwards.

---

**Subject:** DNS change request — 3 CNAME records for aiinstitutefornativeamericans.com

Hello,

Please add the following three CNAME records to the DNS for
**aiinstitutefornativeamericans.com**. They authorise Amazon SES to send
transactional email (registration confirmations) for the domain.

| Type | Host / Name | Points to / Value | TTL |
|---|---|---|---|
| CNAME | `y7geb73koh63erdeap3z37kbejukmqff._domainkey` | `y7geb73koh63erdeap3z37kbejukmqff.dkim.amazonses.com` | 1 hour |
| CNAME | `ymtxf6x5blwiwki4so7ex7gzk2fsmfp2._domainkey` | `ymtxf6x5blwiwki4so7ex7gzk2fsmfp2.dkim.amazonses.com` | 1 hour |
| CNAME | `ublklq6zxflxuilcjciotplfsl42wxuf._domainkey` | `ublklq6zxflxuilcjciotplfsl42wxuf.dkim.amazonses.com` | 1 hour |

Notes for whoever applies this:

- The domain is at GoDaddy (nameservers `ns11`/`ns12.domaincontrol.com`).
- Enter only the host part shown in the middle column. GoDaddy appends the
  domain automatically — if the saved record reads
  `..._domainkey.aiinstitutefornativeamericans.com.aiinstitutefornativeamericans.com`,
  the domain has been typed twice.
- These are DKIM signing keys. They only permit sending; they do not affect
  the website, existing email, MX records, or anything else already configured.
- No MX record is required and none should be changed. Nothing needs to receive
  mail at this domain for this to work.

Thank you.

---

## Confirming it worked

Once they say it's done, check the records resolve:

```
nslookup -type=CNAME y7geb73koh63erdeap3z37kbejukmqff._domainkey.aiinstitutefornativeamericans.com
```

A `canonical name = ...dkim.amazonses.com` reply means it is live. Amazon SES
polls on its own and marks the domain verified within minutes of that, after
which registration email starts sending with no further changes and no app
restart.
