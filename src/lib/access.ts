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
