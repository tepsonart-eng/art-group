"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveSiteAsset, UploadError } from "@/lib/upload";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function num(formData: FormData, key: string, fallback = 0) {
  const v = Number(formData.get(key));
  return Number.isFinite(v) ? v : fallback;
}

function refreshSite() {
  revalidatePath("/[locale]", "layout");
}

export async function upsertTeamMember(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data: Record<string, unknown> = {
    name: str(formData, "name"),
    roleFr: str(formData, "roleFr"),
    roleEn: str(formData, "roleEn"),
    rating: Math.min(5, Math.max(1, num(formData, "rating", 5))),
    order: num(formData, "order"),
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      data.photoPath = await saveSiteAsset(photo, "image");
    } catch (err) {
      if (!(err instanceof UploadError)) throw err;
      console.error("[team-photo]", err.message);
    }
  }

  if (id) await prisma.teamMember.update({ where: { id }, data });
  else await prisma.teamMember.create({ data: data as never });
  refreshSite();
}

export async function deleteTeamMember(formData: FormData) {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id: str(formData, "id") } });
  refreshSite();
}
