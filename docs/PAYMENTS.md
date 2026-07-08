# Payments — Getting Your PayPal Keys

The app uses **PayPal** as its payment gateway. It's fully integrated — you only
need to paste in your API credentials.

- **Demo mode:** with the PayPal keys left blank, the site still works end to end —
  registrations are recorded and the confirmation page shows, but **no real charge
  is made**. This is the default until you add keys.
- **Live mode:** once `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set,
  PayPal checkout goes live. No code changes needed.

---

## 1. The environment variables

The site reads these from `.env` (see `.env.example`):

| Variable | What it is | Example |
|---|---|---|
| `PAYPAL_CLIENT_ID` | REST app Client ID | `AXk…` |
| `PAYPAL_CLIENT_SECRET` | REST app Secret | `EL8…` |
| `PAYPAL_ENV` | Which environment to hit | `sandbox` or `live` |
| `NEXT_PUBLIC_SITE_URL` | Your public URL (used for the return URL) | `https://your-domain.com` |

> Restart the server after editing `.env` — env vars are read at boot.

---

## 2. Test vs. live keys

PayPal gives you **two sets** of credentials:

- **Sandbox** — for development/testing. No real money moves. Use with
  `PAYPAL_ENV="sandbox"`.
- **Live** — for production, real charges. Use with `PAYPAL_ENV="live"`.

---

## 3. PayPal — step by step

### 3.1 Create a developer account
1. Go to <https://developer.paypal.com/> and log in with your PayPal account
   (or create one).
2. Open the **Dashboard** → **Apps & Credentials**
   (<https://developer.paypal.com/dashboard/applications/sandbox>).

### 3.2 Get SANDBOX keys (for development)
1. At the top, make sure the **Sandbox** tab is selected.
2. Under **REST API apps**, click **Create App**.
3. Give it a name (e.g. `AI Institute – Sandbox`) and click **Create App**.
4. The app page shows:
   - **Client ID** — copy it.
   - **Secret** — click **Show** and copy it.
5. Paste them into `.env` and restart — checkout goes live immediately:
   ```env
   PAYPAL_CLIENT_ID="your-sandbox-client-id"
   PAYPAL_CLIENT_SECRET="your-sandbox-secret"
   PAYPAL_ENV="sandbox"
   ```

### 3.3 Sandbox test accounts (fake buyer/seller)
1. Go to **Testing Tools → Sandbox Accounts**
   (<https://developer.paypal.com/dashboard/accounts>).
2. PayPal auto-creates a **Business** (seller) and **Personal** (buyer) test
   account. Use the Personal account's email/password to "pay" in sandbox
   checkout — no real money moves.

### 3.4 Test the flow
1. Sign in on the site, go to **Register**, fill in the form, and click
   **Proceed to Secure Payment**.
2. You're redirected to PayPal — log in with your **sandbox Personal** account
   and approve.
3. PayPal returns you to the site, the payment is captured, and the registration
   is marked **PAID** with a confirmation page.

### 3.5 Webhooks (optional)
The app **captures the payment synchronously** when PayPal redirects the buyer
back to `/api/paypal/capture`, then marks the registration **PAID** — so a
webhook is **not required** for checkout to work.

> One edge case: if the buyer closes the tab after approving but before the
> redirect completes, the order is approved but not captured. Adding a PayPal
> webhook (`PAYMENT.CAPTURE.COMPLETED`) as a reconciliation fallback would close
> that gap; it's optional and not wired yet.

### 3.6 Go live
1. In the dashboard switch from **Sandbox** to **Live**.
2. Under **Apps & Credentials → Live**, create (or open) your app and copy the
   **live** Client ID and Secret.
3. Set on production:
   ```env
   PAYPAL_CLIENT_ID="your-live-client-id"
   PAYPAL_CLIENT_SECRET="your-live-secret"
   PAYPAL_ENV="live"
   ```
4. Your PayPal business account must be verified and confirmed to accept live
   payments.

---

## 4. Quick checklist
- [ ] `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV` (`sandbox`/`live`)
- [ ] `NEXT_PUBLIC_SITE_URL` — correct `https://` domain in production (used for the return URL)
- [ ] Restart the server after editing `.env`
- [ ] Sandbox app + sandbox buyer account for testing
- [ ] Live app credentials for production

## 5. Security notes
- **Never commit real keys.** `.env` is git-ignored — keep it that way.
- The PayPal **Secret** is server-only — never expose it in client code. Only
  values prefixed `NEXT_PUBLIC_` are safe in the browser.
- If the secret leaks, **roll it** immediately in the PayPal dashboard.
