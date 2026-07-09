"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/user-auth";

const commentSchema = z.object({
  trainingId: z.string().trim().min(1),
  authorName: z.string().trim().min(1).optional(),
  authorEmail: z.string().trim().email().optional(),
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

  const currentUser = await getCurrentUser();

  const parsed = commentSchema.safeParse({
    trainingId: formData.get("trainingId"),
    authorName: formData.get("authorName") || undefined,
    authorEmail: formData.get("authorEmail") || undefined,
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { status: "error" };
  }

  if (!currentUser && (!parsed.data.authorName || !parsed.data.authorEmail)) {
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
      userId: currentUser?.id,
      authorName: currentUser?.name ?? parsed.data.authorName!,
      authorEmail: currentUser?.email ?? parsed.data.authorEmail!,
      comment: parsed.data.comment,
      ipAddress: ip,
      status: settings.reviewModeration ? "PENDING" : "APPROVED",
    },
  });

  return { status: "success" };
}
