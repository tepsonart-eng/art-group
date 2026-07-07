"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

const commentSchema = z.object({
  trainingId: z.string().trim().min(1),
  authorName: z.string().trim().min(1),
  authorEmail: z.string().trim().email(),
  comment: z.string().trim().min(1),
});

export type TrainingCommentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitTrainingComment(
  _prevState: TrainingCommentFormState,
  formData: FormData
): Promise<TrainingCommentFormState> {
  if (formData.get("website")) {
    return { status: "success" };
  }

  const parsed = commentSchema.safeParse({
    trainingId: formData.get("trainingId"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
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

  await prisma.trainingComment.create({
    data: {
      trainingId: parsed.data.trainingId,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      comment: parsed.data.comment,
      ipAddress: ip,
      status: settings.reviewModeration ? "PENDING" : "APPROVED",
    },
  });

  return { status: "success" };
}
