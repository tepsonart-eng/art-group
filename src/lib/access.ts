import { prisma } from "@/lib/prisma";

export async function hasAccessToTraining(
  userId: string | null,
  training: { id: string; isPremium: boolean }
): Promise<boolean> {
  if (!training.isPremium) return true;
  if (!userId) return false;

  const order = await prisma.order.findFirst({
    where: { userId, trainingId: training.id, status: "PAID" },
    select: { id: true },
  });
  return order !== null;
}

export async function hasAccessToProduct(userId: string | null, productId: string): Promise<boolean> {
  if (!userId) return false;

  const order = await prisma.order.findFirst({
    where: { userId, productId, status: "PAID" },
    select: { id: true },
  });
  return order !== null;
}
