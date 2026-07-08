import { ShoppingBag, Package } from "lucide-react";
import type { ProductCardEntry } from "@/components/shop/types";

const typeLabel: Record<ProductCardEntry["type"], { fr: string; en: string }> = {
  EBOOK: { fr: "E-book", en: "E-book" },
  TEMPLATE: { fr: "Template", en: "Template" },
  PRESET: { fr: "Preset", en: "Preset" },
  OTHER: { fr: "Produit numérique", en: "Digital product" },
};

export function ProductCard({
  product,
  locale,
  buyLabel,
}: {
  product: ProductCardEntry;
  locale: "fr" | "en";
  buyLabel: string;
}) {
  const title = locale === "fr" ? product.titleFr : product.titleEn;
  const description = locale === "fr" ? product.descriptionFr : product.descriptionEn;
  const categoryName = locale === "fr" ? product.category.nameFr : product.category.nameEn;

  return (
    <a
      href={`/${locale}/boutique/${product.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl bg-surface-alt transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-accent via-accent-dark to-ink">
        {product.coverImagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImagePath}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={40} className="text-white/70" />
          </div>
        )}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-ink">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-[11px] font-display font-semibold uppercase tracking-wide text-accent">
          {typeLabel[product.type][locale]}
        </span>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {description && <p className="line-clamp-2 text-sm text-text-muted">{description}</p>}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-extrabold text-accent">
            {product.priceXaf.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} FCFA
          </span>
          <span className="btn-pill-solid inline-flex items-center gap-2 text-xs">
            <ShoppingBag size={14} /> {buyLabel}
          </span>
        </div>
      </div>
    </a>
  );
}
