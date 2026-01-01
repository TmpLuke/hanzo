const MONEYMOTION_API_URL = "https://api.moneymotion.io";

export interface CreateSessionParams {
  description: string;
  urls: { success: string; cancel: string; failure: string };
  userInfo: { email: string };
  lineItems: {
    name: string;
    description: string;
    pricePerItemInCents: number;
    quantity: number;
  }[];
}

export async function createCheckoutSession(params: CreateSessionParams) {
  const apiKey = import.meta.env.VITE_MONEYMOTION_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing VITE_MONEYMOTION_API_KEY");
  }

  // CRITICAL: MoneyMotion requires this exact structure
  const payload = { json: params };

  console.log("[MoneyMotion] Creating session:", JSON.stringify(payload, null, 2));

  const res = await fetch(
    `${MONEYMOTION_API_URL}/checkoutSessions.createCheckoutSession`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        "X-Currency": "USD",
      },
      body: JSON.stringify(payload),
    }
  );

  const responseText = await res.text();

  if (!res.ok) {
    console.error("[MoneyMotion] API Error:", responseText);
    throw new Error(`MoneyMotion API Error (${res.status}): ${responseText}`);
  }

  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Failed to parse MoneyMotion response: ${responseText}`);
  }

  // CRITICAL: Correct path to session ID based on official docs
  const sessionId =
    responseData?.result?.data?.json?.checkoutSessionId ||
    responseData?.result?.data?.checkoutSessionId;

  if (!sessionId) {
    console.error("[MoneyMotion] No session ID in response:", responseText);
    throw new Error("No checkout session ID returned from MoneyMotion");
  }

  return { checkoutSessionId: sessionId };
}

export function getCheckoutUrl(sessionId: string) {
  // CRITICAL: This is the correct checkout URL format
  return `https://moneymotion.io/checkout/${sessionId}`;
}

export async function getCheckoutSessionInfo(sessionId: string) {
  const apiKey = import.meta.env.VITE_MONEYMOTION_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_MONEYMOTION_API_KEY");
  const payload = { json: { checkoutSessionId: sessionId } };
  // Use GET request with query parameter
  const res = await fetch(
    `${MONEYMOTION_API_URL}/checkoutSessions.getCompletedOrPendingCheckoutSessionInfo?json.checkoutId=${sessionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        "X-Currency": "USD",
      },
    }
  );
  const txt = await res.text();
  if (!res.ok) {
    throw new Error(`MoneyMotion info error (${res.status}): ${txt}`);
  }
  let data;
  try {
    data = JSON.parse(txt);
  } catch {
    throw new Error(`Invalid JSON from MoneyMotion: ${txt}`);
  }
  const json = data?.result?.data?.json;
  if (!json) throw new Error("Missing session json");
  const totalCents =
    json?.totalPrice?.amountInCentsUsd ??
    json?.totalPrice?.amountInCents ??
    0;
  const status = json?.status || "pending";
  return { totalCents, status, raw: json };
}
