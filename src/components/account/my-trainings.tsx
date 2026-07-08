import Link from "next/link";
import { Award } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getUserTrainingsProgress } from "@/lib/data";

export async function MyTrainings({
  userId,
  locale,
  title,
  emptyText,
  resumeLabel,
  certificateEarnedLabel,
}: {
  userId: string;
  locale: Locale;
  title: string;
  emptyText: string;
  resumeLabel: string;
  certificateEarnedLabel: string;
}) {
  const items = await getUserTrainingsProgress(userId);

  return (
    <div>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map(({ training, percent, completedCount, totalLessons, certificateId }) => (
            <Link
              key={training.id}
              href={`/${locale}/formations/${training.slug}`}
              className="flex items-center gap-4 rounded-xl bg-surface-alt p-4 transition-colors hover:text-accent"
            >
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-accent via-accent-dark to-ink">
                {training.thumbnailPath && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={training.thumbnailPath}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold">
                  {locale === "fr" ? training.titleFr : training.titleEn}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface">
                    <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-xs text-text-muted">
                    {completedCount}/{totalLessons} · {percent}%
                  </span>
                </div>
              </div>
              {percent === 100 && certificateId ? (
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-accent">
                  <Award size={14} /> {certificateEarnedLabel}
                </span>
              ) : (
                <span className="shrink-0 text-xs font-semibold text-accent">{resumeLabel}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
