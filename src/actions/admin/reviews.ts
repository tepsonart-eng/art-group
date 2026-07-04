"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function setReviewStatus(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as "PENDING" | "APPROVED" | "HIDDEN";
  await prisma.review.update({ where: { id }, data: { status } });
  revalidatePath("/[locale]", "layout");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/[locale]", "layout");
}

export async function banReviewIp(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const review = await prisma.review.findUnique({ where: { id } });
  if (review?.ipAddress && review.ipAddress !== "unknown") {
    await prisma.bannedIp.upsert({
      where: { ip: review.ipAddress },
      update: {},
      create: { ip: review.ipAddress, reason: "Banni depuis la modération des avis" },
    });
  }
  await prisma.review.update({ where: { id }, data: { status: "HIDDEN" } });
  revalidatePath("/[locale]", "layout");
}

export async function unbanIp(formData: FormData) {
  await requireAdmin();
  await prisma.bannedIp.delete({ where: { id: str(formData, "id") } });
}
