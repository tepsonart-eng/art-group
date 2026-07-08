"use client";

import { useMemo, useState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { ProductCard } from "@/components/shop/product-card";
import type { ProductCardEntry, ProductCategoryEntry } from "@/components/shop/types";

export function ProductGrid({
  products,
  categories,
}: {
  products: ProductCardEntry[];
  categories: ProductCategoryEntry[];
}) {
  const { dict, locale } = useDictionary();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(
    () =>
      activeCategory === "all" ? products : products.filter((p) => p.category.slug === activeCategory),
    [products, activeCategory]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors ${
            activeCategory === "all" ? "bg-accent text-white" : "bg-surface-alt text-text-muted hover:text-accent"
          }`}
        >
          {dict.shop.allCategoriesTab}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`rounded-full px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeCategory === cat.slug ? "bg-accent text-white" : "bg-surface-alt text-text-muted hover:text-accent"
            }`}
          >
            {locale === "fr" ? cat.nameFr : cat.nameEn}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-text-muted">{dict.shop.empty}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} buyLabel={dict.shop.buyButton} />
          ))}
        </div>
      )}
    </div>
  );
}
