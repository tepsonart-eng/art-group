"use server";

import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireUser, getCurrentUser } from "@/lib/user-auth";
import { initializePayment, processMobileMoneyPayment, retrievePayment, NotchPayError } from "@/lib/notchpay";

const channelMap = { ORANGE_MONEY: "cm.orange", MTN_MOMO: "cm.mtn" } as const;

export type CheckoutFormState = {
  status: "idle" | "pending" | "error";
  orderId?: string;
  message?: string;
};

const purchaseSchema = z.object({
  trainingId: z.string().optional(),
  productId: z.string().optional(),
  phoneNumber: z.string().trim().regex(/^6\d{8}$/, "Numéro invalide (9 chiffres commençant par 6)."),
  channel: z.enum(["ORANGE_MONEY", "MTN_MOMO"]),
});

export async function initiatePurchase(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const locale = String(formData.get("locale") || "fr");
  const user = await requireUser(locale);

  const parsed = purchaseSchema.safeParse({
    trainingId: formData.get("trainingId") || undefined,
    productId: formData.get("productId") || undefined,
    phoneNumber: formData.get("phoneNumber"),
    channel: formData.get("channel"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }
  const { trainingId, productId } = parsed.data;
  if ((!trainingId && !productId) || (trainingId && productId)) {
    return { status: "error", message: "Formulaire invalide." };
  }

  let amountXaf: number;
  let description: string;
  let orderData: { trainingId?: string; productId?: string };

  if (trainingId) {
    const training = await prisma.training.findUnique({ where: { id: trainingId } });
    if (!training || !training.isPremium || training.priceXaf <= 0) {
      return { status: "error", message: "Cette formation n'est pas disponible à l'achat." };
    }
    const existing = await prisma.order.findFirst({
      where: { userId: user.id, trainingId: training.id, status: "PAID" },
    });
    if (existing) {
      return { status: "error", message: "Vous avez déjà accès à cette formation." };
    }
    amountXaf = training.priceXaf;
    description = `Formation : ${training.titleFr}`;
    orderData = { trainingId: training.id };
  } else {
    const product = await prisma.product.findUnique({ where: { id: productId! } });
    if (!product || !product.published || product.priceXaf <= 0) {
      return { status: "error", message: "Ce produit n'est pas disponible à l'achat." };
    }
    const existing = await prisma.order.findFirst({
      where: { userId: user.id, productId: product.id, status: "PAID" },
    });
    if (existing) {
      return { status: "error", message: "Vous avez déjà acheté ce produit." };
    }
    amountXaf = product.priceXaf;
    description = `Produit : ${product.titleFr}`;
    orderData = { productId: product.id };
  }

  const internalReference = `tag-${crypto.randomBytes(8).toString("hex")}`;
  const phone = `237${parsed.data.phoneNumber}`;

  try {
    const init = await initializePayment({
      amountXaf,
      email: user.email,
      phone,
      name: user.name,
      reference: internalReference,
      description,
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        ...orderData,
        amountXaf,
        channel: parsed.data.channel,
        phoneNumber: phone,
        notchpayReference: init.transaction,
      },
    });

    await processMobileMoneyPayment(init.transaction, {
      channel: channelMap[parsed.data.channel],
      phone,
    });

    return { status: "pending", orderId: order.id };
  } catch (err) {
    const message = err instanceof NotchPayError ? err.message : "Échec de l'initialisation du paiement.";
    return { status: "error", message };
  }
}

function mapNotchStatus(raw?: string): "PAID" | "FAILED" | "EXPIRED" | "CANCELLED" | null {
  switch (raw) {
    case "complete":
      return "PAID";
    case "failed":
      return "FAILED";
    case "expired":
      return "EXPIRED";
    case "canceled":
    case "cancelled":
      return "CANCELLED";
    default:
      return null;
  }
}

export async function getOrderStatus(orderId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== user.id) return null;
  if (order.status !== "PENDING") return order.status;

  // Relance de secours si le webhook tarde à arriver (au-delà de 15s).
  if (Date.now() - order.createdAt.getTime() > 15000) {
    try {
      const remote = await retrievePayment(order.notchpayReference);
      const remoteStatus = mapNotchStatus(remote?.transaction?.status ?? remote?.status);
      if (remoteStatus) {
        await prisma.order.updateMany({
          where: { id: order.id, status: "PENDING" },
          data: { status: remoteStatus, paidAt: remoteStatus === "PAID" ? new Date() : null },
        });
        const refreshed = await prisma.order.findUnique({ where: { id: order.id } });
        return refreshed?.status ?? order.status;
      }
    } catch {
      // Best-effort uniquement — le client continue de sonder.
    }
  }

  return order.status;
}
