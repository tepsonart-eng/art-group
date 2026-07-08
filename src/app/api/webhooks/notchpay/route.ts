import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNotchPaySignature } from "@/lib/notchpay";

function mapEventToStatus(type: string): "PAID" | "FAILED" | "EXPIRED" | "CANCELLED" | null {
  switch (type) {
    case "payment.complete":
      return "PAID";
    case "payment.failed":
      return "FAILED";
    case "payment.expired":
      return "EXPIRED";
    case "payment.canceled":
    case "payment.cancelled":
      return "CANCELLED";
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-notch-signature");

  if (!verifyNotchPaySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let payload: { type?: string; data?: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const status = mapEventToStatus(payload.type ?? "");
  if (!status) {
    // Événement non géré (ex. payment.created) — accusé de réception sans action.
    return NextResponse.json({ received: true });
  }

  const data = payload.data ?? {};
  // Le nom exact du champ de référence dans le payload webhook n'est pas garanti par la
  // documentation publique — on tente les variantes les plus probables.
  const reference =
    (data.reference as string | undefined) ??
    (data.transaction as string | undefined) ??
    (data.trx_reference as string | undefined) ??
    (data.id as string | undefined);

  if (!reference) {
    return NextResponse.json({ error: "Référence introuvable dans le webhook" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { notchpayReference: reference } });
  if (!order) {
    return NextResponse.json({ received: true });
  }

  if (status === "PAID") {
    const remoteAmount = Number(data.amount);
    if (Number.isFinite(remoteAmount) && remoteAmount !== order.amountXaf) {
      console.error(
        `[notchpay-webhook] Montant incohérent pour la commande ${order.id} : attendu ${order.amountXaf}, reçu ${remoteAmount}.`
      );
      return NextResponse.json({ error: "Montant incohérent" }, { status: 400 });
    }
  }

  // Transition idempotente : ne s'applique que si la commande est encore en attente.
  await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: { status, paidAt: status === "PAID" ? new Date() : null },
  });

  return NextResponse.json({ received: true });
}
