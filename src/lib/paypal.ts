import "server-only";

/**
 * PayPal integration (Orders API v2, server-side redirect flow).
 *
 * Dormant until credentials are set: add PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET
 * to your .env and `isPayPalEnabled` flips on — no code changes needed.
 *
 *   PAYPAL_CLIENT_ID       — REST app client id
 *   PAYPAL_CLIENT_SECRET   — REST app secret
 *   PAYPAL_ENV             — "sandbox" (default) or "live"
 *
 * Flow: createOrder() → redirect user to the returned approveUrl →
 * PayPal redirects back to our return_url with ?token=<orderId> →
 * captureOrder(orderId) finalizes the payment.
 */

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const env = (process.env.PAYPAL_ENV ?? "sandbox").toLowerCase();

export const isPayPalEnabled = Boolean(clientId && clientSecret);

const API_BASE =
  env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

/** OAuth2 client-credentials access token (short-lived; fetched per request). */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`PayPal token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export type PayPalOrder = { id: string; approveUrl: string | null };

/** Create a CAPTURE-intent order and return the buyer approval URL. */
export async function createOrder(params: {
  amountCents: number;
  referenceId?: string;
  description?: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<PayPalOrder> {
  const token = await getAccessToken();
  const value = (params.amountCents / 100).toFixed(2);

  const res = await fetch(`${API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.referenceId,
          description: params.description?.slice(0, 127),
          amount: { currency_code: "USD", value },
        },
      ],
      application_context: {
        brand_name: "AI Institute for Native Americans",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal create-order failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    id: string;
    links?: { rel: string; href: string }[];
  };
  const approve = data.links?.find(
    (l) => l.rel === "approve" || l.rel === "payer-action",
  );
  return { id: data.id, approveUrl: approve?.href ?? null };
}

export type CaptureResult = {
  status: string;
  completed: boolean;
  amountCents: number | null;
  email: string | null;
};

/** Capture a previously-approved order. `completed` is true on success. */
export async function captureOrder(orderId: string): Promise<CaptureResult> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = (await res.json()) as {
    status?: string;
    payer?: { email_address?: string };
    purchase_units?: {
      amount?: { value?: string };
      payments?: { captures?: { amount?: { value?: string } }[] };
    }[];
  };

  if (!res.ok) {
    throw new Error(`PayPal capture failed: ${res.status} ${JSON.stringify(data)}`);
  }

  const unit = data.purchase_units?.[0];
  const value = unit?.payments?.captures?.[0]?.amount?.value ?? unit?.amount?.value;
  return {
    status: data.status ?? "UNKNOWN",
    completed: data.status === "COMPLETED",
    amountCents: value ? Math.round(parseFloat(value) * 100) : null,
    email: data.payer?.email_address ?? null,
  };
}
