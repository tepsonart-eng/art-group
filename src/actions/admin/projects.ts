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

export async function upsertProject(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    slug: str(formData, "slug"),
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    category: str(formData, "category"),
    colorFrom: str(formData, "colorFrom") || "#e11d2e",
    colorTo: str(formData, "colorTo") || "#111111",
    youtubeUrl: str(formData, "youtubeUrl") || null,
    contextFr: str(formData, "contextFr"),
    contextEn: str(formData, "contextEn"),
    objectivesFr: str(formData, "objectivesFr"),
    objectivesEn: str(formData, "objectivesEn"),
    location: str(formData, "location"),
    projectDate: str(formData, "projectDate"),
    order: num(formData, "order"),
    published: bool(formData, "published"),
  };
  if (id) await prisma.project.update({ where: { id }, data });
  else await prisma.project.create({ data });
  revalidatePath("/[locale]", "layout");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  await prisma.project.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/[locale]", "layout");
}
