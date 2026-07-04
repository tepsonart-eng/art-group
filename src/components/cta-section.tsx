"use client";

import { useDictionary } from "@/components/dictionary-provider";

export function CTASection() {
  const { dict, locale } = useDictionary();

  return (
    <section className="bg-ink py-24 text-center text-white">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <h2 className="title-composite text-3xl sm:text-4xl">
          <span className="accent-serif">{dict.cta.titleAccent}</span>{" "}
          <span className="accent-bold">{dict.cta.titleBold}</span>
        </h2>
        <a href={`/${locale}#contact`} className="btn-pill-solid mt-8 inline-flex">
          <span aria-hidden>›</span> {dict.cta.button}
        </a>
      </div>
    </section>
  );
}
