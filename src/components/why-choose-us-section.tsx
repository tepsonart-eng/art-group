"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Gauge, Leaf } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";

const iconMap = { sparkles: Sparkles, shield: ShieldCheck, gauge: Gauge, leaf: Leaf } as const;

export type WhyChooseUsEntry = {
  id: string;
  iconKey: string;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
};

export function WhyChooseUsSection({
  items,
  imagePath,
}: {
  items: WhyChooseUsEntry[];
  imagePath?: string | null;
}) {
  const { dict, locale } = useDictionary();

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="title-composite text-3xl sm:text-4xl">
            <span className="accent-serif">{dict.why.titleAccent}</span>{" "}
            <span className="accent-bold">{dict.why.titleBold}</span>
          </h2>
          <div className="mt-8 space-y-8">
            {items.map((item, i) => {
              const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? Sparkles;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="timeline-item"
                >
                  <Icon className="mb-2 text-accent" size={20} />
                  <h3 className="font-display font-bold">
                    {locale === "fr" ? item.titleFr : item.titleEn}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {locale === "fr" ? item.textFr : item.textEn}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-accent-dark to-accent"
        >
          {imagePath ? (
            <Image src={imagePath} alt="" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-white/30" size={120} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
