import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getTrainingCategories, getTrainings } from "@/lib/data";
import { TrainingGrid } from "@/components/trainings/training-grid";

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
    ? "Formations & Tutoriels — TEPSON ART GROUP"
    : "Trainings & Tutorials — TEPSON ART GROUP";
  const description = isFr
    ? "Des formations et tutoriels pratiques en DJing, production musicale, audiovisuel, marketing digital et plus encore."
    : "Practical trainings and tutorials in DJing, music production, audiovisual, digital marketing and more.";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}/formations`,
      languages: { fr: `${base}/fr/formations`, en: `${base}/en/formations` },
    },
  };
}

export default async function FormationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [categories, trainings] = await Promise.all([getTrainingCategories(), getTrainings()]);

  const titleAccent = locale === "fr" ? "Nos" : "Our";
  const titleBold = locale === "fr" ? "formations" : "trainings";
  const subtitle =
    locale === "fr"
      ? "Formations et tutoriels pratiques pour développer votre savoir-faire."
      : "Practical trainings and tutorials to grow your skills.";

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
        <TrainingGrid trainings={trainings} categories={categories} />
      </div>
    </section>
  );
}
