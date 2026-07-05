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

// --- Categories (Compétences) ---
export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data: Record<string, unknown> = {
    slug: str(formData, "slug"),
    order: num(formData, "order"),
    visualOnly: bool(formData, "visualOnly"),
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    itemsFr: str(formData, "itemsFr"),
    itemsEn: str(formData, "itemsEn"),
    colorFrom: str(formData, "colorFrom") || "#e11d2e",
    colorTo: str(formData, "colorTo") || "#111111",
  };

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const path = await safeSaveSiteAsset(image, "image");
    if (path) data.imagePath = path;
  }

  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data: data as never });
  refreshSite();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Portfolio tabs (filtres réalisations) ---
export async function upsertPortfolioTab(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    slug: str(formData, "slug"),
    labelFr: str(formData, "labelFr"),
    labelEn: str(formData, "labelEn"),
    order: num(formData, "order"),
  };
  if (id) await prisma.portfolioTab.update({ where: { id }, data });
  else await prisma.portfolioTab.create({ data });
  refreshSite();
}

export async function deletePortfolioTab(formData: FormData) {
  await requireAdmin();
  await prisma.portfolioTab.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Why choose us items ---
export async function upsertWhyChooseUsItem(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    iconKey: str(formData, "iconKey") || "sparkles",
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    textFr: str(formData, "textFr"),
    textEn: str(formData, "textEn"),
    order: num(formData, "order"),
  };
  if (id) await prisma.whyChooseUsItem.update({ where: { id }, data });
  else await prisma.whyChooseUsItem.create({ data });
  refreshSite();
}

export async function deleteWhyChooseUsItem(formData: FormData) {
  await requireAdmin();
  await prisma.whyChooseUsItem.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Commitment items ---
export async function upsertCommitmentItem(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    iconKey: str(formData, "iconKey") || "sparkles",
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    textFr: str(formData, "textFr"),
    textEn: str(formData, "textEn"),
    order: num(formData, "order"),
  };
  if (id) await prisma.commitmentItem.update({ where: { id }, data });
  else await prisma.commitmentItem.create({ data });
  refreshSite();
}

export async function deleteCommitmentItem(formData: FormData) {
  await requireAdmin();
  await prisma.commitmentItem.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- FAQ ---
export async function upsertFaqItem(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    questionFr: str(formData, "questionFr"),
    questionEn: str(formData, "questionEn"),
    answerFr: str(formData, "answerFr"),
    answerEn: str(formData, "answerEn"),
    order: num(formData, "order"),
  };
  if (id) await prisma.faqItem.update({ where: { id }, data });
  else await prisma.faqItem.create({ data });
  refreshSite();
}

export async function deleteFaqItem(formData: FormData) {
  await requireAdmin();
  await prisma.faqItem.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Partner logos ---
export async function upsertPartnerLogo(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data: Record<string, unknown> = {
    name: str(formData, "name"),
    type: (str(formData, "type") || "PARTNER") as "PARTNER" | "ARTIST",
    colorHex: str(formData, "colorHex") || "#e11d2e",
    order: num(formData, "order"),
  };

  const logoFile = formData.get("logoImage");
  if (logoFile instanceof File && logoFile.size > 0) {
    const path = await safeSaveSiteAsset(logoFile, "image");
    if (path) data.logoImagePath = path;
  }

  if (id) await prisma.partnerLogo.update({ where: { id }, data });
  else await prisma.partnerLogo.create({ data: data as never });
  refreshSite();
}

export async function deletePartnerLogo(formData: FormData) {
  await requireAdmin();
  await prisma.partnerLogo.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}

// --- Social links ---
export async function updateSocialLink(formData: FormData) {
  await requireAdmin();
  const platform = str(formData, "platform") as
    | "FACEBOOK"
    | "INSTAGRAM"
    | "TIKTOK"
    | "YOUTUBE"
    | "LINKEDIN"
    | "WHATSAPP";
  await prisma.socialLink.upsert({
    where: { platform },
    update: { url: str(formData, "url"), visible: bool(formData, "visible") },
    create: { platform, url: str(formData, "url"), visible: bool(formData, "visible") },
  });
  refreshSite();
}
