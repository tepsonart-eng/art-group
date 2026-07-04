"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function num(formData: FormData, key: string, fallback = 0) {
  const v = Number(formData.get(key));
  return Number.isFinite(v) ? v : fallback;
}
function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function upsertTestimonial(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    clientName: str(formData, "clientName"),
    clientRole: str(formData, "clientRole"),
    companyName: str(formData, "companyName"),
    colorHex: str(formData, "colorHex") || "#e11d2e",
    quoteFr: str(formData, "quoteFr"),
    quoteEn: str(formData, "quoteEn"),
    rating: num(formData, "rating", 5),
    verified: bool(formData, "verified"),
    order: num(formData, "order"),
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/[locale]", "layout");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/[locale]", "layout");
}
