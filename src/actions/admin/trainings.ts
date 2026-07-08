"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveSiteAsset, UploadError } from "@/lib/upload";

async function safeSaveSiteAsset(file: File, kind: "image" | "video" | "document") {
  try {
    return await saveSiteAsset(file, kind);
  } catch (err) {
    if (err instanceof UploadError) {
      console.error("[upload]", err.message);
      return undefined;
    }
    throw err;
  }
}

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

function refreshSite() {
  revalidatePath("/[locale]", "layout");
}

// --- Training categories ---
export async function upsertTrainingCategory(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    slug: str(formData, "slug"),
    nameFr: str(formData, "nameFr"),
    nameEn: str(formData, "nameEn"),
    order: num(formData, "order"),
  };
  if (id) await prisma.trainingCategory.update({ where: { id }, data });
  else await prisma.trainingCategory.create({ data });
  refreshSite();
}

export async function deleteTrainingCategory(formData: FormData) {
  await requireAdmin();
  await prisma.trainingCategory.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Trainings ---
export async function upsertTraining(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data: Record<string, unknown> = {
    slug: str(formData, "slug"),
    categoryId: str(formData, "categoryId"),
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    shortDescFr: str(formData, "shortDescFr"),
    shortDescEn: str(formData, "shortDescEn"),
    presentationFr: str(formData, "presentationFr"),
    presentationEn: str(formData, "presentationEn"),
    objectivesFr: str(formData, "objectivesFr"),
    objectivesEn: str(formData, "objectivesEn"),
    level: (str(formData, "level") || "BEGINNER") as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    durationMinutes: num(formData, "durationMinutes"),
    order: num(formData, "order"),
    published: bool(formData, "published"),
    isPremium: bool(formData, "isPremium"),
    priceXaf: num(formData, "priceXaf"),
  };

  const thumbnail = formData.get("thumbnail");
  if (thumbnail instanceof File && thumbnail.size > 0) {
    const path = await safeSaveSiteAsset(thumbnail, "image");
    if (path) data.thumbnailPath = path;
  }

  if (id) await prisma.training.update({ where: { id }, data });
  else await prisma.training.create({ data: data as never });
  refreshSite();
}

export async function deleteTraining(formData: FormData) {
  await requireAdmin();
  await prisma.training.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Training lessons (leçons/vidéos) ---
export async function upsertTrainingLesson(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    trainingId: str(formData, "trainingId"),
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    order: num(formData, "order"),
    videoSourceType: (str(formData, "videoSourceType") || "UPLOAD") as
      | "UPLOAD"
      | "YOUTUBE"
      | "VIMEO"
      | "EXTERNAL",
    videoFilePath: str(formData, "videoFilePath") || null,
    youtubeUrl: str(formData, "youtubeUrl") || null,
    vimeoUrl: str(formData, "vimeoUrl") || null,
    externalUrl: str(formData, "externalUrl") || null,
    durationMinutes: num(formData, "durationMinutes"),
  };
  if (id) await prisma.trainingLesson.update({ where: { id }, data });
  else await prisma.trainingLesson.create({ data });
  refreshSite();
}

export async function deleteTrainingLesson(formData: FormData) {
  await requireAdmin();
  await prisma.trainingLesson.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Training resources (PDF) ---
export async function upsertTrainingResource(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data: Record<string, unknown> = {
    trainingId: str(formData, "trainingId"),
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    order: num(formData, "order"),
  };

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const path = await safeSaveSiteAsset(file, "document");
    if (path) data.filePath = path;
  }

  if (id) {
    await prisma.trainingResource.update({ where: { id }, data });
  } else {
    if (!data.filePath) return; // a new resource needs a file
    await prisma.trainingResource.create({ data: data as never });
  }
  refreshSite();
}

export async function deleteTrainingResource(formData: FormData) {
  await requireAdmin();
  await prisma.trainingResource.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Training FAQ ---
export async function upsertTrainingFaqItem(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    trainingId: str(formData, "trainingId"),
    questionFr: str(formData, "questionFr"),
    questionEn: str(formData, "questionEn"),
    answerFr: str(formData, "answerFr"),
    answerEn: str(formData, "answerEn"),
    order: num(formData, "order"),
  };
  if (id) await prisma.trainingFaqItem.update({ where: { id }, data });
  else await prisma.trainingFaqItem.create({ data });
  refreshSite();
}

export async function deleteTrainingFaqItem(formData: FormData) {
  await requireAdmin();
  await prisma.trainingFaqItem.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}
