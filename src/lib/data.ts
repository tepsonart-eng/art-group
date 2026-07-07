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
