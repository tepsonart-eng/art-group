import { Download, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/format";
import type { ResourceCardEntry } from "@/components/resources/types";

const typeLabel: Record<ResourceCardEntry["type"], { fr: string; en: string }> = {
  EBOOK: { fr: "E-book", en: "E-book" },
  GUIDE: { fr: "Guide pratique", en: "Practical guide" },
  COURSE_MATERIAL: { fr: "Support de cours", en: "Course material" },
  CHECKLIST: { fr: "Checklist", en: "Checklist" },
  TECHNICAL_SHEET: { fr: "Fiche technique", en: "Technical sheet" },
  EDUCATIONAL_DOCUMENT: { fr: "Document pédagogique", en: "Educational document" },
  OTHER: { fr: "Ressource téléchargeable", en: "Downloadable resource" },
};

export function ResourceCard({
  resource,
  locale,
  downloadLabel,
}: {
  resource: ResourceCardEntry;
  locale: "fr" | "en";
  downloadLabel: string;
}) {
  const title = locale === "fr" ? resource.titleFr : resource.titleEn;
  const description = locale === "fr" ? resource.descriptionFr : resource.descriptionEn;
  const categoryName = locale === "fr" ? resource.category.nameFr : resource.category.nameEn;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-alt">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-accent via-accent-dark to-ink">
        {resource.coverImagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource.coverImagePath}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText size={40} className="text-white/70" />
          </div>
        )}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-ink">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-[11px] font-display font-semibold uppercase tracking-wide text-accent">
          {typeLabel[resource.type][locale]}
        </span>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {description && <p className="line-clamp-2 text-sm text-text-muted">{description}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
          <span>{formatFileSize(resource.fileSizeBytes, locale)}</span>
          <span>
            {resource.createdAt.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
          </span>
          <span>
            {resource.downloadCount} {locale === "fr" ? "téléchargements" : "downloads"}
          </span>
        </div>

        <a
          href={`/api/resources/${resource.id}/download`}
          className="btn-pill-solid mt-3 inline-flex w-fit items-center gap-2"
        >
          <Download size={14} /> {downloadLabel}
        </a>
      </div>
    </div>
  );
}
