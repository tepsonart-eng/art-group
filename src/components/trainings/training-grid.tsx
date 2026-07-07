"use client";

import { useMemo, useState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { TrainingCard } from "@/components/trainings/training-card";
import type { TrainingCardEntry, TrainingCategoryEntry } from "@/components/trainings/types";

export function TrainingGrid({
  trainings,
  categories,
}: {
  trainings: TrainingCardEntry[];
  categories: TrainingCategoryEntry[];
}) {
  const { dict, locale } = useDictionary();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(
    () =>
      activeCategory === "all" ? trainings : trainings.filter((t) => t.category.slug === activeCategory),
    [trainings, activeCategory]
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
          {dict.trainings.allCategoriesTab}
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
        <p className="mt-16 text-center text-text-muted">{dict.trainings.empty}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
              locale={locale}
              watchLabel={dict.trainings.watchButton}
            />
          ))}
        </div>
      )}
    </div>
  );
}
