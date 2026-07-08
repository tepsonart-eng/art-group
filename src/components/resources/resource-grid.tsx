"use client";

import { useMemo, useState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { ResourceCard } from "@/components/resources/resource-card";
import type { ResourceCardEntry, ResourceCategoryEntry } from "@/components/resources/types";

export function ResourceGrid({
  resources,
  categories,
}: {
  resources: ResourceCardEntry[];
  categories: ResourceCategoryEntry[];
}) {
  const { dict, locale } = useDictionary();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(
    () =>
      activeCategory === "all" ? resources : resources.filter((r) => r.category.slug === activeCategory),
    [resources, activeCategory]
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
          {dict.resources.allCategoriesTab}
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
        <p className="mt-16 text-center text-text-muted">{dict.resources.empty}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              locale={locale}
              downloadLabel={dict.resources.downloadButton}
            />
          ))}
        </div>
      )}
    </div>
  );
}
