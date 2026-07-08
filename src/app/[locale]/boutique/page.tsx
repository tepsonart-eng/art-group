import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getTrainingCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/shop/product-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "fr";
  const isFr = locale === "fr";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title = isFr ? "Boutique numérique — TEPSON ART GROUP" : "Digital shop — TEPSON ART GROUP";
  const description = isFr
    ? "E-books, templates et presets numériques à acheter à l'unité."
    : "Digital e-books, templates and presets available for individual purchase.";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}/boutique`,
      languages: { fr: `${base}/fr/boutique`, en: `${base}/en/boutique` },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [categories, products] = await Promise.all([getTrainingCategories(), getProducts()]);

  const titleAccent = locale === "fr" ? "Notre" : "Our";
  const titleBold = locale === "fr" ? "boutique" : "shop";
  const subtitle =
    locale === "fr"
      ? "E-books, templates et presets numériques à acheter à l'unité."
      : "Digital e-books, templates and presets available for individual purchase.";

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
        <ProductGrid products={products} categories={categories} />
      </div>
    </section>
  );
}
