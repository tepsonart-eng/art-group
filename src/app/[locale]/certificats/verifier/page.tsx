import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { getCertificateByNumber } from "@/lib/data";

export default async function VerifyCertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { code } = await searchParams;
  const dict = await getDictionary(locale);

  const certificate = code ? await getCertificateByNumber(code.trim()) : null;

  return (
    <div className="mx-auto max-w-md px-5 py-32 sm:px-8">
      <h1 className="text-center font-display text-2xl font-extrabold">{dict.certificates.verifyTitle}</h1>

      <form action={`/${locale}/certificats/verifier`} method="GET" className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.certificates.codeLabel}
          </label>
          <input
            type="text"
            name="code"
            defaultValue={code ?? ""}
            required
            placeholder="TAG-2026-XXXXXXXX"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <button type="submit" className="btn-pill-solid w-full justify-center">
          {dict.certificates.verifySubmit}
        </button>
      </form>

      {code && (
        <div className="mt-6 rounded-2xl bg-surface-alt p-6">
          {certificate ? (
            <div>
              <p className="flex items-center gap-2 font-display font-semibold text-green-600 dark:text-green-400">
                <CheckCircle2 size={18} /> {dict.certificates.validTitle}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-text-muted">{dict.certificates.participantLabel} : </span>
                  {certificate.user.name}
                </p>
                <p>
                  <span className="text-text-muted">{dict.certificates.trainingLabel} : </span>
                  {locale === "fr" ? certificate.training.titleFr : certificate.training.titleEn}
                </p>
                <p>
                  <span className="text-text-muted">{dict.certificates.issuedOnLabel} : </span>
                  {new Date(certificate.issuedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
                </p>
                <p>
                  <span className="text-text-muted">{dict.certificates.codeLabel} : </span>
                  {certificate.certificateNumber}
                </p>
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 font-display font-semibold text-red-600 dark:text-red-400">
              <XCircle size={18} /> {dict.certificates.notFoundTitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
