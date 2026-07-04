"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

const reviewSchema = z.object({
  authorName: z.string().trim().min(1),
  authorEmail: z.string().trim().email(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().trim().min(1),
});

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  if (formData.get("website")) {
    return { status: "success" };
  }

  const parsed = reviewSchema.safeParse({
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { status: "error" };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const banned = await prisma.bannedIp.findUnique({ where: { ip } });
  if (banned) {
    return { status: "error" };
  }

  const settings = await getSiteSettings();

  await prisma.review.create({
    data: {
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      ipAddress: ip,
      status: settings.reviewModeration ? "PENDING" : "APPROVED",
    },
  });

  return { status: "success" };
}
