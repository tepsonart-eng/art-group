import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Eye, BarChart3 } from "lucide-react";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getTrainingBySlug, getLessonProgressMap } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { hasAccessToTraining } from "@/lib/access";
import { FaqAccordion } from "@/components/faq-accordion";
import { TrainingLessonList } from "@/components/trainings/training-lesson-list";
import { TrainingResourceList } from "@/components/trainings/training-resource-list";
import { TrainingComments } from "@/components/trainings/training-comments";
import { PurchasePanel } from "@/components/checkout/purchase-panel";

const levelLabel: Record<string, { fr: string; en: string }> = {
  BEGINNER: { fr: "Débutant", en: "Beginner" },
  INTERMEDIATE: { fr: "Intermédiaire", en: "Intermediate" },
  ADVANCED: { fr: "Avancé", en: "Advanced" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "fr";
  const training = await getTrainingBySlug(slug);
  if (!training) return {};

  const isFr = locale === "fr";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = isFr ? training.titleFr : training.titleEn;
  const description = isFr ? training.shortDescFr : training.shortDescEn;

  return {
    title: `${title} — TEPSON ART GROUP`,
    description,
    alternates: {
      canonical: `${base}/${locale}/formations/${slug}`,
      languages: { fr: `${base}/fr/formations/${slug}`, en: `${base}/en/formations/${slug}` },
    },
  };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const training = await getTrainingBySlug(slug);
  if (!training || !training.published) notFound();

  prisma.training
    .update({ where: { id: training.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const currentUser = await getCurrentUser();
  const canAccess = await hasAccessToTraining(currentUser?.id ?? null, training);
  const progress = currentUser ? await getLessonProgressMap(currentUser.id, training.id) : undefined;
  const initialLessonId = progress
    ? Object.entries(progress).sort((a, b) => b[1].lastWatchedAt.getTime() - a[1].lastWatchedAt.getTime())[0]?.[0]
    : undefined;
  const progressForList = progress
    ? Object.fromEntries(Object.entries(progress).map(([id, p]) => [id, { completed: p.completed }]))
    : undefined;

  const title = locale === "fr" ? training.titleFr : training.titleEn;
  const presentation = locale === "fr" ? training.presentationFr : training.presentationEn;
  const objectives = locale === "fr" ? training.objectivesFr : training.objectivesEn;
  const categoryName = locale === "fr" ? training.category.nameFr : training.category.nameEn;
  const publishedLabel = locale === "fr" ? "Publié le" : "Published on";

  return (
    <article className="mx-auto max-w-4xl px-5 py-32 sm:px-8">
      <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-accent">
        {categoryName}
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <BarChart3 size={14} /> {levelLabel[training.level]?.[locale]}
        </span>
        {training.durationMinutes > 0 && (
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {training.durationMinutes} min
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Eye size={14} /> {training.viewCount}
        </span>
        <span>
          {publishedLabel} {new Date(training.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
        </span>
      </div>

      <div className="mt-8">
        {canAccess ? (
          <TrainingLessonList
            lessons={training.lessons}
            title={title}
            trainingId={training.id}
            progress={progressForList}
            initialLessonId={initialLessonId}
          />
        ) : (
          <PurchasePanel
            kind="training"
            id={training.id}
            priceXaf={training.priceXaf}
            locale={locale}
            loggedIn={Boolean(currentUser)}
          />
        )}
      </div>

      {presentation && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">
            {locale === "fr" ? "Présentation" : "Presentation"}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-muted sm:text-base">
            {presentation}
          </p>
        </section>
      )}

      {objectives && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">{locale === "fr" ? "Objectifs" : "Objectives"}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-muted sm:text-base">
            {objectives}
          </p>
        </section>
      )}

      {training.resources.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">
            {locale === "fr" ? "Ressources à télécharger" : "Downloadable resources"}
          </h2>
          <div className="mt-4">
            <TrainingResourceList resources={training.resources} />
          </div>
        </section>
      )}

      {training.faqItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">
            {locale === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
          </h2>
          <div className="mt-4">
            <FaqAccordion items={training.faqItems} />
          </div>
        </section>
      )}

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="font-display text-xl font-bold">{locale === "fr" ? "Commentaires" : "Comments"}</h2>
        <div className="mt-4">
          <TrainingComments
            trainingId={training.id}
            loggedIn={Boolean(currentUser)}
            comments={training.comments.map((c) => ({
              id: c.id,
              userId: c.userId,
              userAvatarPath: c.user?.avatarPath ?? null,
              authorName: c.authorName,
              comment: c.comment,
              createdAt: c.createdAt,
              likesCount: c._count.likes,
              likedByCurrentUser: currentUser ? c.likes.some((l) => l.userId === currentUser.id) : false,
            }))}
          />
        </div>
      </section>
    </article>
  );
}
