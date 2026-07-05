"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useDictionary } from "@/components/dictionary-provider";

export type CategoryEntry = {
  id: string;
  slug: string;
  visualOnly: boolean;
  titleFr: string;
  titleEn: string;
  itemsFr: string;
  itemsEn: string;
  colorFrom: string;
  colorTo: string;
  imagePath: string | null;
};

export function SkillsSection({ categories }: { categories: CategoryEntry[] }) {
  const { dict, locale } = useDictionary();

  return (
    <section id="competences" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="title-composite text-center">
        <h2 className="text-3xl sm:text-4xl">
          <span className="accent-serif">{dict.skills.titleAccent}</span>{" "}
          <span className="accent-bold">{dict.skills.titleBold}</span>
        </h2>
        <div className="divider-dots" />
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const title = locale === "fr" ? cat.titleFr : cat.titleEn;
          const items = (locale === "fr" ? cat.itemsFr : cat.itemsEn)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group overflow-hidden rounded-2xl shadow-sm ${
                cat.visualOnly ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div
                className="relative flex h-48 items-end overflow-hidden p-6 transition-transform duration-500 group-hover:scale-[1.03]"
                style={
                  cat.imagePath
                    ? undefined
                    : { background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})` }
                }
              >
                {cat.imagePath && (
                  <>
                    <Image src={cat.imagePath} alt={title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </>
                )}
                {cat.visualOnly && (
                  <h3 className="relative font-display text-2xl font-extrabold text-white drop-shadow">
                    {title}
                  </h3>
                )}
              </div>
              {!cat.visualOnly && (
                <div className="bg-accent p-6 text-white">
                  <h3 className="font-display text-lg font-extrabold">{title}</h3>
                  <ul className="mt-4 space-y-1.5 text-sm text-white/90">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
