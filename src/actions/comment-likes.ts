"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function toggleCommentLike(commentId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const existing = await prisma.commentLike.findUnique({
    where: { commentId_userId: { commentId, userId: user.id } },
  });

  if (existing) {
    await prisma.commentLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.commentLike.create({ data: { commentId, userId: user.id } });
  }

  revalidatePath("/[locale]/formations/[slug]", "page");
}
