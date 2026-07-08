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

export async function upsertProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data: Record<string, unknown> = {
    slug: str(formData, "slug"),
    categoryId: str(formData, "categoryId"),
    type: (str(formData, "type") || "OTHER") as "EBOOK" | "TEMPLATE" | "PRESET" | "OTHER",
    titleFr: str(formData, "titleFr"),
    titleEn: str(formData, "titleEn"),
    descriptionFr: str(formData, "descriptionFr"),
    descriptionEn: str(formData, "descriptionEn"),
    priceXaf: num(formData, "priceXaf"),
    order: num(formData, "order"),
    published: bool(formData, "published"),
  };

  const cover = formData.get("coverImage");
  if (cover instanceof File && cover.size > 0) {
    const path = await safeSaveSiteAsset(cover, "image");
    if (path) data.coverImagePath = path;
  }

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const path = await safeSaveSiteAsset(file, "document");
    if (path) data.filePath = path;
  }

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    if (!data.filePath) return; // un nouveau produit a besoin d'un fichier
    await prisma.product.create({ data: data as never });
  }
  refreshSite();
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}
