import Link from "next/link";
import { Award, Download } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getUserCertificates } from "@/lib/data";

export async function MyCertificates({
  userId,
  locale,
  title,
  emptyText,
  downloadLabel,
}: {
  userId: string;
  locale: Locale;
  title: string;
  emptyText: string;
  downloadLabel: string;
}) {
  const certificates = await getUserCertificates(userId);

  return (
    <div>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {certificates.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="flex items-center gap-4 rounded-xl bg-surface-alt p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Award size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold">
                  {locale === "fr" ? certificate.training.titleFr : certificate.training.titleEn}
                </p>
                <p className="text-xs text-text-muted">{certificate.certificateNumber}</p>
              </div>
              <Link
                href={`/api/certificates/${certificate.id}/pdf`}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white"
              >
                <Download size={14} /> {downloadLabel}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
