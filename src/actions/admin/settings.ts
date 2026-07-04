"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveSiteAsset, UploadError } from "@/lib/upload";
import { defaultSiteSettings } from "@/lib/settings";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export type SettingsFormState = { status: "idle" | "success" | "error"; message?: string };

const TEXT_FIELDS = [
  "heroTaglinesFr",
  "heroTaglinesEn",
  "agencyIntroFr",
  "agencyIntroEn",
  "aboutTextFr",
  "aboutTextEn",
  "teamTextFr",
  "teamTextEn",
  "planetTextFr",
  "planetTextEn",
  "adSpaceTitleFr",
  "adSpaceTitleEn",
  "adSpaceTextFr",
  "adSpaceTextEn",
  "ctaTitleFr",
  "ctaTitleEn",
  "contactQuoteFr",
  "contactQuoteEn",
  "trustTitleFr",
  "trustTitleEn",
  "phone1",
  "phone2",
  "contactEmail",
  "addressFr",
  "addressEn",
  "whatsappNumber",
  "mapEmbedUrl",
  "rccm",
  "legalAddress",
] as const;

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin(["SUPER_ADMIN", "EDITOR"]);

  const data: Record<string, unknown> = {
    palette: str(formData, "palette") || defaultSiteSettings.palette,
    reviewModeration: bool(formData, "reviewModeration"),
  };

  for (const field of TEXT_FIELDS) {
    data[field] = str(formData, field);
  }

  try {
    const logo1 = formData.get("logoLight");
    if (logo1 instanceof File && logo1.size > 0) {
      data.logoLightPath = await saveSiteAsset(logo1, "image");
    }
    const logo2 = formData.get("logoDark");
    if (logo2 instanceof File && logo2.size > 0) {
      data.logoDarkPath = await saveSiteAsset(logo2, "image");
    }
    const video = formData.get("heroVideo");
    if (video instanceof File && video.size > 0) {
      data.heroVideoPath = await saveSiteAsset(video, "video");
    }
    const brochure = formData.get("brochurePdf");
    if (brochure instanceof File && brochure.size > 0) {
      data.brochurePdfPath = await saveSiteAsset(brochure, "document");
    }
  } catch (err) {
    if (err instanceof UploadError) {
      return { status: "error", message: err.message };
    }
    throw err;
  }

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/[locale]", "layout");
  return { status: "success" };
}
