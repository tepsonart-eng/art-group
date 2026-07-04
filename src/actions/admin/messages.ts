"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function markMessageRead(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id: str(formData, "id") },
    data: { read: true },
  });
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: str(formData, "id") } });
}
