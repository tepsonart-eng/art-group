import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getTrainingCategories, getResources } from "@/lib/data";
import { ResourceGrid } from "@/components/resources/resource-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "fr";
  const isFr = locale === "fr";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title = isFr
    ? "Ressources PDF — TEPSON ART GROUP"
    : "PDF Resources — TEPSON ART GROUP";
  const description = isFr
    ? "E-books, guides pratiques, checklists et fiches techniques à télécharger."
    : "E-books, practical guides, checklists and technical sheets to download.";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}/ressources`,
      languages: { fr: `${base}/fr/ressources`, en: `${base}/en/ressources` },
    },
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [categories, resources] = await Promise.all([getTrainingCategories(), getResources()]);

  const titleAccent = locale === "fr" ? "Nos" : "Our";
  const titleBold = locale === "fr" ? "ressources" : "resources";
  const subtitle =
    locale === "fr"
      ? "E-books, guides pratiques, checklists et fiches techniques à télécharger."
      : "E-books, practical guides, checklists and technical sheets to download.";

  return (
    <section className="mx-auto max-w-7xl px-5 py-32 sm:px-8">
      <div className="title-composite text-center">
        <h1 className="text-3xl sm:text-4xl">
          <span className="accent-serif">{titleAccent}</span> <span className="accent-bold">{titleBold}</span>
        </h1>
        <div className="divider-dots" />
        <p className="mx-auto mt-2 max-w-xl text-text-muted">{subtitle}</p>
      </div>

      <div className="mt-10">
        <ResourceGrid resources={resources} categories={categories} />
      </div>
    </section>
  );
}
