import Link from "next/link";
import { Clock, Eye, BarChart3, Lock } from "lucide-react";
import { getYoutubeId } from "@/lib/youtube";
import type { TrainingCardEntry } from "@/components/trainings/types";

const levelLabel: Record<TrainingCardEntry["level"], { fr: string; en: string }> = {
  BEGINNER: { fr: "Débutant", en: "Beginner" },
  INTERMEDIATE: { fr: "Intermédiaire", en: "Intermediate" },
  ADVANCED: { fr: "Avancé", en: "Advanced" },
};

export function TrainingCard({
  training,
  locale,
  watchLabel,
}: {
  training: TrainingCardEntry;
  locale: "fr" | "en";
  watchLabel: string;
}) {
  const title = locale === "fr" ? training.titleFr : training.titleEn;
  const shortDesc = locale === "fr" ? training.shortDescFr : training.shortDescEn;
  const categoryName = locale === "fr" ? training.category.nameFr : training.category.nameEn;
  const firstLesson = training.lessons[0];

  return (
    <Link
      href={`/${locale}/formations/${training.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-alt transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-accent via-accent-dark to-ink">
        {training.thumbnailPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={training.thumbnailPath}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : firstLesson?.videoSourceType === "YOUTUBE" && firstLesson.youtubeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://img.youtube.com/vi/${getYoutubeId(firstLesson.youtubeUrl)}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : firstLesson?.videoSourceType === "UPLOAD" && firstLesson.videoFilePath ? (
          <video
            src={firstLesson.videoFilePath}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-ink">
          {categoryName}
        </span>
        {training.isPremium && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-white">
            <Lock size={11} /> {training.priceXaf.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} FCFA
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-bold group-hover:text-accent">{title}</h3>
        {shortDesc && <p className="line-clamp-2 text-sm text-text-muted">{shortDesc}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <BarChart3 size={13} /> {levelLabel[training.level][locale]}
          </span>
          {training.durationMinutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> {training.durationMinutes} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye size={13} /> {training.viewCount}
          </span>
        </div>

        <div className="mt-3">
          <span className="btn-pill-solid">{watchLabel}</span>
        </div>
      </div>
    </Link>
  );
}
