"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function setTrainingCommentStatus(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as "PENDING" | "APPROVED" | "HIDDEN";
  await prisma.trainingComment.update({ where: { id }, data: { status } });
  revalidatePath("/[locale]", "layout");
}

export async function deleteTrainingComment(formData: FormData) {
  await requireAdmin();
  await prisma.trainingComment.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/[locale]", "layout");
}

export async function banTrainingCommentIp(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const comment = await prisma.trainingComment.findUnique({ where: { id } });
  if (comment?.ipAddress && comment.ipAddress !== "unknown") {
    await prisma.bannedIp.upsert({
      where: { ip: comment.ipAddress },
      update: {},
      create: { ip: comment.ipAddress, reason: "Banni depuis la modération des commentaires de formation" },
    });
  }
  await prisma.trainingComment.update({ where: { id }, data: { status: "HIDDEN" } });
  revalidatePath("/[locale]", "layout");
}
