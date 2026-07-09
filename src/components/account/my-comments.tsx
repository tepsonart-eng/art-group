import type { Locale } from "@/lib/i18n";
import { getUserComments } from "@/lib/data";

const statusLabel: Record<string, { fr: string; en: string }> = {
  PENDING: { fr: "En attente", en: "Pending" },
  APPROVED: { fr: "Publié", en: "Published" },
  HIDDEN: { fr: "Masqué", en: "Hidden" },
};

export async function MyComments({
  userId,
  locale,
  title,
  emptyText,
}: {
  userId: string;
  locale: Locale;
  title: string;
  emptyText: string;
}) {
  const comments = await getUserComments(userId);

  return (
    <div>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {comments.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <a
              key={comment.id}
              href={`/${locale}/formations/${comment.training.slug}`}
              className="block rounded-xl bg-surface-alt p-4 hover:bg-surface"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-display text-sm font-semibold">
                  {locale === "fr" ? comment.training.titleFr : comment.training.titleEn}
                </p>
                <span
                  className={`shrink-0 text-xs font-semibold ${
                    comment.status === "APPROVED"
                      ? "text-green-600 dark:text-green-400"
                      : comment.status === "PENDING"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {statusLabel[comment.status][locale]}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-text-muted">{comment.comment}</p>
              <p className="mt-1 text-xs text-text-muted">
                {comment.createdAt.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
