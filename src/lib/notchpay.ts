import crypto from "crypto";

const NOTCHPAY_BASE_URL = "https://api.notchpay.co";

export class NotchPayError extends Error {}

function apiKey() {
  const key = process.env.NOTCHPAY_API_KEY;
  if (!key) throw new NotchPayError("NOTCHPAY_API_KEY n'est pas configurée.");
  return key;
}

type InitializePaymentResult = {
  transaction: { reference: string; status: string; [key: string]: unknown };
  authorization_url: string;
};

export async function initializePayment({
  amountXaf,
  email,
  phone,
  name,
  reference,
  description,
}: {
  amountXaf: number;
  email: string;
  phone: string;
  name: string;
  reference: string;
  description: string;
}): Promise<InitializePaymentResult> {
  const res = await fetch(`${NOTCHPAY_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountXaf,
      currency: "XAF",
      email,
      phone,
      reference,
      description,
      customer: { name, email, phone },
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new NotchPayError(json?.message || "Échec de l'initialisation du paiement Notch Pay.");
  }
  return json;
}

export async function processMobileMoneyPayment(
  transactionReference: string,
  { channel, phone }: { channel: "cm.mtn" | "cm.orange"; phone: string }
) {
  const res = await fetch(`${NOTCHPAY_BASE_URL}/payments/${transactionReference}`, {
    method: "PUT",
    headers: {
      Authorization: apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      data: { phone, country: "CM" },
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new NotchPayError(json?.message || "Échec du traitement du paiement mobile money.");
  }
  return json;
}

export async function retrievePayment(transactionReference: string) {
  const res = await fetch(`${NOTCHPAY_BASE_URL}/payments/${transactionReference}`, {
    method: "GET",
    headers: { Authorization: apiKey() },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new NotchPayError(json?.message || "Échec de la récupération du paiement Notch Pay.");
  }
  return json;
}

export function verifyNotchPaySignature(rawBody: string, signatureHeader: string | null): boolean {
  const hash = process.env.NOTCHPAY_WEBHOOK_HASH;
  if (!hash || !signatureHeader) return false;

  const expected = crypto.createHmac("sha256", hash).update(rawBody, "utf8").digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signatureHeader, "hex");
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
