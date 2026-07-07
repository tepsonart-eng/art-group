"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function recordLessonView(lessonId: string, trainingId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { lastWatchedAt: new Date() },
    create: { userId: user.id, lessonId, trainingId, lastWatchedAt: new Date() },
  });
}

export async function toggleLessonComplete(lessonId: string, trainingId: string, completed: boolean) {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: {
      userId: user.id,
      lessonId,
      trainingId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });
}
