import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getProductBySlug } from "@/lib/data";
import { getCurrentUser } from "@/lib/user-auth";
import { hasAccessToProduct } from "@/lib/access";
import { PurchasePanel } from "@/components/checkout/purchase-panel";

const typeLabel: Record<string, { fr: string; en: string }> = {
  EBOOK: { fr: "E-book", en: "E-book" },
  TEMPLATE: { fr: "Template", en: "Template" },
  PRESET: { fr: "Preset", en: "Preset" },
  OTHER: { fr: "Produit numérique", en: "Digital product" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "fr";
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const isFr = locale === "fr";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = isFr ? product.titleFr : product.titleEn;
  const description = isFr ? product.descriptionFr : product.descriptionEn;

  return {
    title: `${title} — TEPSON ART GROUP`,
    description,
    alternates: {
      canonical: `${base}/${locale}/boutique/${slug}`,
      languages: { fr: `${base}/fr/boutique/${slug}`, en: `${base}/en/boutique/${slug}` },
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const currentUser = await getCurrentUser();
  const owns = currentUser ? await hasAccessToProduct(currentUser.id, product.id) : false;

  const title = locale === "fr" ? product.titleFr : product.titleEn;
  const description = locale === "fr" ? product.descriptionFr : product.descriptionEn;
  const categoryName = locale === "fr" ? product.category.nameFr : product.category.nameEn;

  return (
    <article className="mx-auto max-w-3xl px-5 py-32 sm:px-8">
      <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-accent">
        {categoryName}
      </span>
      <p className="mt-3 text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
        {typeLabel[product.type]?.[locale]}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>

      {description && (
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-text-muted sm:text-base">
          {description}
        </p>
      )}

      <div className="mt-8">
        {owns ? (
          <a
            href={`/api/products/${product.id}/download`}
            className="btn-pill-solid inline-flex items-center gap-2"
          >
            <Download size={16} /> {locale === "fr" ? "Télécharger" : "Download"}
          </a>
        ) : (
          <PurchasePanel
            kind="product"
            id={product.id}
            priceXaf={product.priceXaf}
            locale={locale}
            loggedIn={Boolean(currentUser)}
          />
        )}
      </div>
    </article>
  );
}
