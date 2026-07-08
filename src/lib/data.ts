import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getPortfolioTabs() {
  return prisma.portfolioTab.findMany({ orderBy: { order: "asc" } });
}

export async function getProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { order: "asc" } });
}

export async function getApprovedReviews() {
  return prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
}

export async function getFaqItems() {
  return prisma.faqItem.findMany({ orderBy: { order: "asc" } });
}

export async function getPartnerLogos() {
  return prisma.partnerLogo.findMany({ orderBy: { order: "asc" } });
}

export async function getWhyChooseUsItems() {
  return prisma.whyChooseUsItem.findMany({ orderBy: { order: "asc" } });
}

export async function getCommitmentItems() {
  return prisma.commitmentItem.findMany({ orderBy: { order: "asc" } });
}

export async function getVisibleSocialLinks() {
  return prisma.socialLink.findMany({ where: { visible: true } });
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { order: "asc" } });
}

export async function getTrainingCategories() {
  return prisma.trainingCategory.findMany({ orderBy: { order: "asc" } });
}

export async function getTrainings() {
  return prisma.training.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { category: true, lessons: { orderBy: { order: "asc" } } },
  });
}

export async function getTrainingBySlug(slug: string) {
  return prisma.training.findUnique({
    where: { slug },
    include: {
      category: true,
      lessons: { orderBy: { order: "asc" } },
      resources: { orderBy: { order: "asc" } },
      faqItems: { orderBy: { order: "asc" } },
      comments: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getLessonProgressMap(userId: string, trainingId: string) {
  const rows = await prisma.lessonProgress.findMany({ where: { userId, trainingId } });
  const map: Record<string, { completed: boolean; lastWatchedAt: Date }> = {};
  for (const row of rows) {
    map[row.lessonId] = { completed: row.completed, lastWatchedAt: row.lastWatchedAt };
  }
  return map;
}

export async function getUserTrainingsProgress(userId: string) {
  const progressRows = await prisma.lessonProgress.findMany({ where: { userId } });
  if (progressRows.length === 0) return [];

  const trainingIds = Array.from(new Set(progressRows.map((r) => r.trainingId)));
  const [trainings, certificates] = await Promise.all([
    prisma.training.findMany({
      where: { id: { in: trainingIds } },
      include: { lessons: true },
    }),
    prisma.certificate.findMany({ where: { userId, trainingId: { in: trainingIds } } }),
  ]);

  return trainingIds
    .map((trainingId) => {
      const training = trainings.find((t) => t.id === trainingId);
      if (!training) return null;
      const rowsForTraining = progressRows.filter((r) => r.trainingId === trainingId);
      const completedCount = rowsForTraining.filter((r) => r.completed).length;
      const totalLessons = training.lessons.length;
      const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const lastWatchedAt = rowsForTraining.reduce(
        (latest, r) => (r.lastWatchedAt > latest ? r.lastWatchedAt : latest),
        rowsForTraining[0].lastWatchedAt
      );
      const certificateId = certificates.find((c) => c.trainingId === trainingId)?.id ?? null;
      return { training, percent, completedCount, totalLessons, lastWatchedAt, certificateId };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime());
}

export async function getUserCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: { training: true },
    orderBy: { issuedAt: "desc" },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { training: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCertificateByNumber(certificateNumber: string) {
  return prisma.certificate.findUnique({
    where: { certificateNumber },
    include: { training: true, user: true },
  });
}
