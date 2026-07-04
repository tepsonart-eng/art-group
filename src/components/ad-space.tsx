"use client";

import { useDictionary } from "@/components/dictionary-provider";

export function AdSpace({
  titleFr,
  titleEn,
  textFr,
  textEn,
}: {
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
}) {
  const { dict, locale } = useDictionary();
  const title = locale === "fr" ? titleFr : titleEn;
  const text = locale === "fr" ? textFr : textEn;

  if (!title && !text) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="grid gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-surface-alt to-accent-soft sm:grid-cols-[1fr_1.4fr]">
        <div className="flex min-h-[10rem] items-center justify-center bg-gradient-to-br from-accent to-ink p-8">
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/80">
            {dict.ad.label}
          </span>
        </div>
        <div className="flex flex-col justify-center p-8">
          <h3 className="font-display text-xl font-extrabold">{title}</h3>
          <p className="mt-2 text-sm text-text-muted">{text}</p>
        </div>
      </div>
    </section>
  );
}
