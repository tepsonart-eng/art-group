import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(6).toString("hex").toUpperCase().slice(0, 8);
  return `TAG-${year}-${suffix}`;
}

export async function issueCertificateIfComplete(userId: string, trainingId: string) {
  const [totalLessons, completedCount] = await Promise.all([
    prisma.trainingLesson.count({ where: { trainingId } }),
    prisma.lessonProgress.count({ where: { userId, trainingId, completed: true } }),
  ]);

  if (totalLessons === 0 || completedCount < totalLessons) return;

  try {
    await prisma.certificate.create({
      data: { userId, trainingId, certificateNumber: generateCertificateNumber() },
    });
  } catch {
    // Certificat déjà délivré pour cet utilisateur/formation (contrainte unique) — rien à faire.
  }
}
